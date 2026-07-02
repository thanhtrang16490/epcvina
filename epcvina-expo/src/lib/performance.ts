/**
 * Performance monitoring utilities
 */

import React from 'react'

interface PerformanceMetric {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()

  /**
   * Bắt đầu đo thời gian
   */
  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: Date.now(),
    })
  }

  /**
   * Kết thúc đo thời gian và log kết quả
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name)
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`)
      return null
    }

    const endTime = Date.now()
    const duration = endTime - metric.startTime

    metric.endTime = endTime
    metric.duration = duration

    if (__DEV__) {
      console.log(`⏱️ ${name}: ${duration}ms`)
    }

    return duration
  }

  /**
   * Lấy tất cả metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Xóa tất cả metrics
   */
  clear(): void {
    this.metrics.clear()
  }

  /**
   * Đo thời gian thực thi của một function
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name)
    try {
      const result = await fn()
      return result
    } finally {
      this.end(name)
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * HOC để đo performance của component
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return (props: P) => {
    React.useEffect(() => {
      performanceMonitor.start(`${componentName}.mount`)
      return () => {
        performanceMonitor.end(`${componentName}.mount`)
      }
    }, [])

    return React.createElement(Component, props)
  }
}
