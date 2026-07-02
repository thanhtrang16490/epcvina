import { Analytics, AnalyticsEvents } from '../analytics'

describe('Analytics', () => {
  beforeEach(() => {
    Analytics.clearEventQueue()
    Analytics.clearUserProperties()
    Analytics.setEnabled(true)
  })

  it('should track events', () => {
    Analytics.trackEvent('test_event', { key: 'value' })

    const queue = Analytics.getEventQueue()
    expect(queue).toHaveLength(1)
    expect(queue[0].name).toBe('test_event')
    expect(queue[0].properties).toMatchObject({ key: 'value' })
  })

  it('should track screen views', () => {
    Analytics.trackScreen('TestScreen', { category: 'test' })

    const queue = Analytics.getEventQueue()
    expect(queue).toHaveLength(1)
    expect(queue[0].name).toBe('screen_view')
    expect(queue[0].properties).toMatchObject({
      screen_name: 'TestScreen',
      category: 'test',
    })
  })

  it('should set and include user properties', () => {
    Analytics.setUserProperties({
      userId: '123',
      role: 'sale',
    })

    Analytics.trackEvent('test_event')

    const queue = Analytics.getEventQueue()
    expect(queue[0].properties).toMatchObject({
      userId: '123',
      role: 'sale',
    })
  })

  it('should clear user properties', () => {
    Analytics.setUserProperties({ userId: '123' })
    Analytics.clearUserProperties()
    Analytics.trackEvent('test_event')

    const queue = Analytics.getEventQueue()
    expect(queue[0].properties?.userId).toBeUndefined()
  })

  it('should track actions', () => {
    Analytics.trackAction('click', 'button', { button_id: 'submit' })

    const queue = Analytics.getEventQueue()
    expect(queue[0].name).toBe('click_button')
    expect(queue[0].properties).toMatchObject({ button_id: 'submit' })
  })

  it('should track timing', () => {
    Analytics.trackTiming('api', 'fetch_products', 1234)

    const queue = Analytics.getEventQueue()
    expect(queue[0].name).toBe('timing')
    expect(queue[0].properties).toMatchObject({
      category: 'api',
      variable: 'fetch_products',
      duration: 1234,
    })
  })

  it('should not track when disabled', () => {
    Analytics.setEnabled(false)
    Analytics.trackEvent('test_event')

    const queue = Analytics.getEventQueue()
    expect(queue).toHaveLength(0)
  })

  it('should limit queue size', () => {
    for (let i = 0; i < 150; i++) {
      Analytics.trackEvent(`event_${i}`)
    }

    const queue = Analytics.getEventQueue()
    expect(queue.length).toBeLessThanOrEqual(100)
  })
})
