import { OptimisticUpdates } from '../optimistic-updates'

describe('OptimisticUpdates', () => {
  beforeEach(() => {
    OptimisticUpdates.clear()
  })

  it('should apply optimistic update successfully', async () => {
    const apiCall = jest.fn(() => Promise.resolve({ success: true }))

    const result = await OptimisticUpdates.apply(
      'test-1',
      'update_test',
      { value: 'new' },
      { value: 'old' },
      apiCall
    )

    expect(result.success).toBe(true)
    expect(apiCall).toHaveBeenCalled()
  })

  it('should handle failed updates', async () => {
    const apiCall = jest.fn(() => Promise.reject(new Error('API Error')))

    const result = await OptimisticUpdates.apply(
      'test-2',
      'update_test',
      { value: 'new' },
      { value: 'old' },
      apiCall
    )

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should track pending updates', async () => {
    const apiCall = jest.fn(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    OptimisticUpdates.apply(
      'test-3',
      'update_test',
      { value: 'new' },
      { value: 'old' },
      apiCall
    )

    const pending = OptimisticUpdates.getPendingUpdates()
    expect(pending).toHaveLength(1)
    expect(pending[0].id).toBe('test-3')
  })

  it('should rollback updates', async () => {
    const apiCall = jest.fn(() => Promise.resolve())

    await OptimisticUpdates.apply(
      'test-4',
      'update_test',
      { value: 'new' },
      { value: 'old' },
      apiCall
    )

    OptimisticUpdates.rollback('test-4')

    const all = OptimisticUpdates.getAllUpdates()
    expect(all.find(u => u.id === 'test-4')).toBeUndefined()
  })

  it('should notify listeners', async () => {
    const listener = jest.fn()
    const unsubscribe = OptimisticUpdates.subscribe(listener)

    const apiCall = jest.fn(() => Promise.resolve())

    await OptimisticUpdates.apply(
      'test-5',
      'update_test',
      { value: 'new' },
      { value: 'old' },
      apiCall
    )

    expect(listener).toHaveBeenCalled()

    unsubscribe()
  })

  it('should clear all updates', async () => {
    const apiCall = jest.fn(() => Promise.resolve())

    await OptimisticUpdates.apply(
      'test-6',
      'update_test',
      { value: 'new' },
      { value: 'old' },
      apiCall
    )

    OptimisticUpdates.clear()

    const all = OptimisticUpdates.getAllUpdates()
    expect(all).toHaveLength(0)
  })
})
