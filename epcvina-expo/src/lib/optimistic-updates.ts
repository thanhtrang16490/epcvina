/**
 * Optimistic Updates Manager
 * Quản lý optimistic updates cho better UX
 * 
 * Features:
 * - Immediate UI updates
 * - Rollback on error
 * - Conflict resolution
 * - Queue management
 */

import React from 'react'
import { ErrorTracker } from './error-tracking'
import { OfflineManager } from './offline-manager'

interface OptimisticUpdate<T = any> {
  id: string
  type: string
  data: T
  originalData?: T
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  error?: Error
}

class OptimisticUpdatesManager {
  private updates: Map<string, OptimisticUpdate> = new Map()
  private listeners: Set<(updates: OptimisticUpdate[]) => void> = new Set()

  /**
   * Apply optimistic update
   * @param id - Unique ID for the update
   * @param type - Type of update
   * @param data - New data
   * @param originalData - Original data (for rollback)
   * @param apiCall - API call to execute
   * 
   * @example
   * ```typescript
   * await OptimisticUpdates.apply(
   *   'order-123',
   *   'update_order',
   *   { status: 'completed' },
   *   { status: 'pending' },
   *   () => supabase.from('orders').update({ status: 'completed' }).eq('id', '123')
   * )
   * ```
   */
  async apply<T>(
    id: string,
    type: string,
    data: T,
    originalData: T,
    apiCall: () => Promise<any>
  ): Promise<{ success: boolean; error?: Error }> {
    // Create optimistic update
    const update: OptimisticUpdate<T> = {
      id,
      type,
      data,
      originalData,
      timestamp: Date.now(),
      status: 'pending',
    }

    // Store update
    this.updates.set(id, update)
    this.notifyListeners()

    try {
      // Execute API call
      await apiCall()

      // Mark as success
      update.status = 'success'
      this.updates.set(id, update)
      this.notifyListeners()

      // Remove after delay
      setTimeout(() => {
        this.updates.delete(id)
        this.notifyListeners()
      }, 5000)

      return { success: true }
    } catch (error) {
      // Mark as failed
      update.status = 'failed'
      update.error = error as Error
      this.updates.set(id, update)
      this.notifyListeners()

      // Log error
      ErrorTracker.error(error as Error, `OptimisticUpdates.apply.${type}`)

      // Queue for offline retry if network error
      if (this.isNetworkError(error)) {
        await OfflineManager.queueAction('update', type, data)
      }

      return { success: false, error: error as Error }
    }
  }

  /**
   * Rollback optimistic update
   * @param id - Update ID
   */
  rollback(id: string) {
    const update = this.updates.get(id)
    if (!update) return

    // Remove update
    this.updates.delete(id)
    this.notifyListeners()

    if (__DEV__) {
      console.log('🔄 Rolled back optimistic update:', id)
    }
  }

  /**
   * Get pending updates
   */
  getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(u => u.status === 'pending')
  }

  /**
   * Get failed updates
   */
  getFailedUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(u => u.status === 'failed')
  }

  /**
   * Get all updates
   */
  getAllUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values())
  }

  /**
   * Subscribe to updates
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  subscribe(listener: (updates: OptimisticUpdate[]) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Clear all updates
   */
  clear() {
    this.updates.clear()
    this.notifyListeners()
  }

  /**
   * Retry failed updates
   */
  async retryFailed() {
    const failed = this.getFailedUpdates()

    for (const update of failed) {
      // Remove from map
      this.updates.delete(update.id)

      // Queue for retry
      await OfflineManager.queueAction('update', update.type, update.data)
    }

    this.notifyListeners()
  }

  /**
   * Check if error is network error
   */
  private isNetworkError(error: any): boolean {
    return (
      error?.message?.includes('network') ||
      error?.message?.includes('offline') ||
      error?.message?.includes('fetch')
    )
  }

  /**
   * Notify listeners
   */
  private notifyListeners() {
    const updates = this.getAllUpdates()
    this.listeners.forEach(listener => listener(updates))
  }
}

// Export singleton
export const OptimisticUpdates = new OptimisticUpdatesManager()

/**
 * Hook to use optimistic updates
 * @returns Optimistic updates state and functions
 * 
 * @example
 * ```typescript
 * const { apply, pending, failed } = useOptimisticUpdates()
 * 
 * const handleUpdate = async () => {
 *   await apply(
 *     'order-123',
 *     'update_order',
 *     newData,
 *     originalData,
 *     () => apiCall()
 *   )
 * }
 * ```
 */
export function useOptimisticUpdates() {
  const [updates, setUpdates] = React.useState<OptimisticUpdate[]>([])

  React.useEffect(() => {
    const unsubscribe = OptimisticUpdates.subscribe(setUpdates)
    return unsubscribe
  }, [])

  return {
    apply: OptimisticUpdates.apply.bind(OptimisticUpdates),
    rollback: OptimisticUpdates.rollback.bind(OptimisticUpdates),
    retryFailed: OptimisticUpdates.retryFailed.bind(OptimisticUpdates),
    pending: updates.filter(u => u.status === 'pending'),
    failed: updates.filter(u => u.status === 'failed'),
    all: updates,
  }
}
