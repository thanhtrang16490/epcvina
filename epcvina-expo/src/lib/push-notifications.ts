/**
 * Push Notifications Service
 * Handle push notifications với Expo Notifications
 * 
 * Features:
 * - Request permissions
 * - Register for push tokens
 * - Handle incoming notifications
 * - Schedule local notifications
 * - Badge management
 */

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { ErrorTracker } from './error-tracking'
import { Analytics, AnalyticsEvents } from './analytics'

/**
 * Notification configuration
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

/**
 * Notification data interface
 */
export interface NotificationData {
  title: string
  body: string
  data?: Record<string, any>
  sound?: boolean
  badge?: number
}

/**
 * Push token response
 */
export interface PushTokenResponse {
  token: string
  type: 'ios' | 'android'
}

/**
 * Push Notifications Manager
 */
export class PushNotifications {
  private static pushToken: string | null = null
  private static notificationListener: any = null
  private static responseListener: any = null

  /**
   * Initialize push notifications
   * Request permissions and register for push tokens
   * 
   * @returns Push token or null
   * 
   * @example
   * ```typescript
   * const token = await PushNotifications.initialize()
   * if (token) {
   *   // Send token to backend
   *   await sendTokenToBackend(token)
   * }
   * ```
   */
  static async initialize(): Promise<string | null> {
    try {
      // Check if running on physical device
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices')
        return null
      }

      // Request permissions
      const hasPermission = await this.requestPermissions()
      if (!hasPermission) {
        console.warn('Push notification permissions denied')
        return null
      }

      // Get push token
      const token = await this.registerForPushNotifications()
      if (token) {
        this.pushToken = token
        
        // Track analytics
        Analytics.trackEvent(AnalyticsEvents.NOTIFICATION_PERMISSION_GRANTED, {
          platform: Platform.OS,
        })
      }

      // Setup listeners
      this.setupNotificationListeners()

      return token
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.initialize',
      })
      return null
    }
  }

  /**
   * Request notification permissions
   * @returns Whether permission was granted
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        Analytics.trackEvent(AnalyticsEvents.NOTIFICATION_PERMISSION_DENIED, {
          platform: Platform.OS,
        })
        return false
      }

      return true
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.requestPermissions',
      })
      return false
    }
  }

  /**
   * Register for push notifications and get token
   * @returns Push token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      })

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        })
      }

      return token.data
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.registerForPushNotifications',
      })
      return null
    }
  }

  /**
   * Setup notification listeners
   */
  private static setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification)
        
        // Track analytics
        Analytics.trackEvent(AnalyticsEvents.NOTIFICATION_RECEIVED, {
          title: notification.request.content.title,
          foreground: true,
        })
      }
    )

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response)
        
        // Track analytics
        Analytics.trackEvent(AnalyticsEvents.NOTIFICATION_OPENED, {
          title: response.notification.request.content.title,
          data: response.notification.request.content.data,
        })

        // Handle navigation based on notification data
        this.handleNotificationResponse(response)
      }
    )
  }

  /**
   * Handle notification tap
   * Navigate to appropriate screen based on notification data
   */
  private static handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data

    // You can add navigation logic here
    // Example: router.push(data.screen)
    console.log('Handle notification navigation:', data)
  }

  /**
   * Schedule local notification
   * 
   * @param notification - Notification data
   * @param trigger - When to trigger (seconds from now, or specific time)
   * @returns Notification ID
   * 
   * @example
   * ```typescript
   * // Schedule notification in 5 seconds
   * await PushNotifications.scheduleNotification(
   *   { title: 'Reminder', body: 'Check your orders' },
   *   { seconds: 5 }
   * )
   * 
   * // Schedule for specific time
   * await PushNotifications.scheduleNotification(
   *   { title: 'Daily Report', body: 'Your daily report is ready' },
   *   { hour: 9, minute: 0, repeats: true }
   * )
   * ```
   */
  static async scheduleNotification(
    notification: NotificationData,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger,
      })

      // Track analytics
      Analytics.trackEvent(AnalyticsEvents.NOTIFICATION_SCHEDULED, {
        title: notification.title,
      })

      return id
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.scheduleNotification',
        notification,
      })
      return null
    }
  }

  /**
   * Send immediate local notification
   * 
   * @param notification - Notification data
   * @returns Notification ID
   * 
   * @example
   * ```typescript
   * await PushNotifications.sendNotification({
   *   title: 'New Order',
   *   body: 'You have a new order #123',
   *   data: { orderId: '123', screen: 'OrderDetail' }
   * })
   * ```
   */
  static async sendNotification(notification: NotificationData): Promise<string | null> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger: null, // Send immediately
      })

      return id
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.sendNotification',
        notification,
      })
      return null
    }
  }

  /**
   * Cancel scheduled notification
   * @param notificationId - Notification ID to cancel
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId)
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.cancelNotification',
        notificationId,
      })
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync()
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.cancelAllNotifications',
      })
    }
  }

  /**
   * Get all scheduled notifications
   * @returns Array of scheduled notifications
   */
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync()
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.getScheduledNotifications',
      })
      return []
    }
  }

  /**
   * Set badge count
   * @param count - Badge number (0 to clear)
   */
  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count)
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.setBadgeCount',
        count,
      })
    }
  }

  /**
   * Get current badge count
   * @returns Current badge count
   */
  static async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync()
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'PushNotifications.getBadgeCount',
      })
      return 0
    }
  }

  /**
   * Clear badge
   */
  static async clearBadge(): Promise<void> {
    await this.setBadgeCount(0)
  }

  /**
   * Get push token
   * @returns Current push token
   */
  static getPushToken(): string | null {
    return this.pushToken
  }

  /**
   * Cleanup listeners
   */
  static cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove()
    }
    if (this.responseListener) {
      this.responseListener.remove()
    }
  }
}
