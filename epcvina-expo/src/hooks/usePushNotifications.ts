/**
 * usePushNotifications Hook
 * Quản lý push notifications: xin quyền, lấy token, lưu vào Supabase
 *
 * NOTE: Push notifications (remote) are NOT supported in Expo Go SDK 53+.
 * Use a development build for full functionality.
 * In Expo Go, this hook is a no-op — no warnings, no errors.
 */

import { useEffect, useRef, useState } from 'react'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { supabase } from '../lib/supabase'
import { errorTracker } from '../lib/error-tracking'

/** True when running inside Expo Go app */
const IS_EXPO_GO = Constants.appOwnership === 'expo'

// Only load expo-notifications in development builds (not Expo Go)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Notifications: any = null
if (!IS_EXPO_GO) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Notifications = require('expo-notifications')
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    })
  } catch {
    // Silently ignore if not available
  }
}

interface UsePushNotificationsOptions {
  userId?: string
  /** Callback khi user tap vào notification */
  onNotificationTap?: (data: Record<string, any>) => void
}

export function usePushNotifications({ userId, onNotificationTap }: UsePushNotificationsOptions = {}) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notificationListener = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseListener = useRef<any>(null)

  useEffect(() => {
    if (!userId) return

    // Expo Go / missing notifications module => skip completely
    if (!Notifications) {
      if (__DEV__) console.warn('[PushNotifications] Notifications module not available in this environment')
      return
    }

    registerForPushNotifications(userId)

    try {
      // Lắng nghe notification khi app đang mở
      notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
        if (__DEV__) {
          console.log('[PushNotifications] Received:', notification.request.content.title)
        }
      })

      // Lắng nghe khi user tap vào notification
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        const data = response.notification.request.content.data as Record<string, any>
        if (__DEV__) {
          console.log('[PushNotifications] Tapped:', data)
        }
        onNotificationTap?.(data)
      })
    } catch {
      if (__DEV__) console.warn('[PushNotifications] Notification listeners not supported in Expo Go')
    }

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [userId, onNotificationTap])

  const registerForPushNotifications = async (uid: string) => {
    try {
      if (!Notifications) return

      // Chỉ hoạt động trên thiết bị thật
      if (!Device.isDevice) {
        if (__DEV__) console.warn('[PushNotifications] Chỉ hoạt động trên thiết bị thật')
        return
      }

      // Xin quyền
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      setPermissionStatus(finalStatus)

      if (finalStatus !== 'granted') {
        if (__DEV__) console.warn('[PushNotifications] Quyền bị từ chối')
        return
      }

      // Tạo Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Thông báo chung',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#175ead',
          sound: 'default',
        })

        await Notifications.setNotificationChannelAsync('orders', {
          name: 'Đơn hàng',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
          sound: 'default',
        })
      }

      // Lấy Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync()
      const token = tokenData.data
      setExpoPushToken(token)

      // Lưu token vào Supabase profiles
      if (token) {
        await supabase
          .from('profiles')
          .update({ push_token: token, push_token_updated_at: new Date().toISOString() })
          .eq('id', uid)

        if (__DEV__) console.log('[PushNotifications] Token saved:', token.slice(0, 20) + '...')
      }
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'usePushNotifications.register' })
    }
  }

  return {
    expoPushToken,
    permissionStatus,
  }
}

/**
 * Gửi local notification ngay lập tức
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  channelId = 'default'
): Promise<string | null> {
  try {
    if (!Notifications) {
      if (__DEV__) console.warn('[PushNotifications] scheduleNotificationAsync not available (Expo Go)')
      return null
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null, // Gửi ngay
    })
    return id
  } catch (error) {
    errorTracker.logError(error as Error, { action: 'sendLocalNotification' })
    return null
  }
}

/**
 * Gửi notification sau X giây
 */
export async function scheduleNotificationAfter(
  title: string,
  body: string,
  seconds: number,
  data?: Record<string, any>
): Promise<string | null> {
  try {
    if (!Notifications) {
      if (__DEV__) console.warn('[PushNotifications] scheduleNotificationAsync not available (Expo Go)')
      return null
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data || {}, sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
    })
    return id
  } catch (error) {
    errorTracker.logError(error as Error, { action: 'scheduleNotificationAfter' })
    return null
  }
}

/**
 * Xóa badge
 */
export async function clearBadge(): Promise<void> {
  try {
    if (!Notifications) return
    await Notifications.setBadgeCountAsync(0)
  } catch {
    // Silently fail
  }
}
