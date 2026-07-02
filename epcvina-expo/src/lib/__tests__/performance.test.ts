import { performanceMonitor } from '../performance'

describe('performanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clear()
  })

  it('should start and end timing', () => {
    performanceMonitor.start('test-operation')
    const duration = performanceMonitor.end('test-operation')

    expect(duration).toBeGreaterThanOrEqual(0)
    expect(typeof duration).toBe('number')
  })

  it('should return null for non-existent metric', () => {
    const duration = performanceMonitor.end('non-existent')

    expect(duration).toBeNull()
  })

  it('should measure async operations', async () => {
    const mockAsyncFn = () =>
      new Promise(resolve => setTimeout(() => resolve('done'), 50))

    const result = await performanceMonitor.measure('async-test', mockAsyncFn)

    expect(result).toBe('done')

    const metrics = performanceMonitor.getMetrics()
    const metric = metrics.find(m => m.name === 'async-test')

    expect(metric).toBeDefined()
    expect(metric?.duration).toBeGreaterThanOrEqual(50)
  })

  it('should track multiple metrics', () => {
    performanceMonitor.start('operation-1')
    performanceMonitor.start('operation-2')
    performanceMonitor.end('operation-1')
    performanceMonitor.end('operation-2')

    const metrics = performanceMonitor.getMetrics()

    expect(metrics.length).toBe(2)
    expect(metrics[0].name).toBe('operation-1')
    expect(metrics[1].name).toBe('operation-2')
  })

  it('should clear all metrics', () => {
    performanceMonitor.start('test-1')
    performanceMonitor.start('test-2')
    performanceMonitor.end('test-1')
    performanceMonitor.end('test-2')

    expect(performanceMonitor.getMetrics().length).toBe(2)

    performanceMonitor.clear()

    expect(performanceMonitor.getMetrics().length).toBe(0)
  })

  it('should handle errors in measured functions', async () => {
    const mockErrorFn = () => Promise.reject(new Error('Test error'))

    await expect(
      performanceMonitor.measure('error-test', mockErrorFn)
    ).rejects.toThrow('Test error')

    // Metric should still be recorded
    const metrics = performanceMonitor.getMetrics()
    const metric = metrics.find(m => m.name === 'error-test')

    expect(metric).toBeDefined()
  })
})
