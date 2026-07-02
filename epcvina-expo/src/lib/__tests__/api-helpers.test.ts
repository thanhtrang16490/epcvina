import { apiCall, retryApiCall } from '../api-helpers'

describe('api-helpers', () => {
  describe('apiCall', () => {
    it('should return data on success', async () => {
      const mockFn = jest.fn(() => Promise.resolve({ data: 'test data' }))

      const result = await apiCall(mockFn)

      expect(result.data).toEqual({ data: 'test data' })
      expect(result.status).toBe(200)
      expect(result.error).toBeUndefined()
    })

    it('should return error on failure', async () => {
      const mockFn = jest.fn(() => Promise.reject(new Error('Test error')))

      const result = await apiCall(mockFn)

      expect(result.error).toBeDefined()
      expect(result.data).toBeUndefined()
    })

    it('should handle network errors', async () => {
      const networkError = new Error('network error')
      const mockFn = jest.fn(() => Promise.reject(networkError))

      const result = await apiCall(mockFn, {
        offlineAction: 'test_action',
        offlineData: { test: 'data' },
      })

      expect(result.error).toBeDefined()
    })
  })

  describe('retryApiCall', () => {
    it('should succeed on first try', async () => {
      const mockFn = jest.fn(() => Promise.resolve('success'))

      const result = await retryApiCall(mockFn, 3, 100)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure', async () => {
      let attempts = 0
      const mockFn = jest.fn(() => {
        attempts++
        if (attempts < 3) {
          return Promise.reject(new Error('Fail'))
        }
        return Promise.resolve('success')
      })

      const result = await retryApiCall(mockFn, 3, 10)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should throw after max retries', async () => {
      const mockFn = jest.fn(() => Promise.reject(new Error('Always fail')))

      await expect(retryApiCall(mockFn, 3, 10)).rejects.toThrow('Always fail')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })
  })
})
