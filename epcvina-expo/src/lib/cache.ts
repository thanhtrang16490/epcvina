import AsyncStorage from '@react-native-async-storage/async-storage'

const CACHE_PREFIX = '@epcvina_cache:'
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

interface CacheItem<T> {
  data: T
  timestamp: number
}

export const cache = {
  /**
   * Set cache with expiry
   */
  async set<T>(key: string, data: T): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      }
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify(cacheItem)
      )
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  /**
   * Get cache if not expired
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`)
      if (!cached) return null

      const cacheItem: CacheItem<T> = JSON.parse(cached)
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_EXPIRY

      if (isExpired) {
        await this.remove(key)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  },

  /**
   * Remove specific cache
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`)
    } catch (error) {
      console.error('Cache remove error:', error)
    }
  },

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX))
      await AsyncStorage.multiRemove(cacheKeys)
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  },

  /**
   * Get or fetch data with cache
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    forceRefresh = false
  ): Promise<T> {
    if (!forceRefresh) {
      const cached = await this.get<T>(key)
      if (cached) return cached
    }

    const data = await fetchFn()
    await this.set(key, data)
    return data
  },
}
