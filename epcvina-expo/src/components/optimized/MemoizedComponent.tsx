import React, { memo } from 'react'

/**
 * HOC để wrap component với React.memo
 * Tự động so sánh props để tránh re-render không cần thiết
 * 
 * @param Component - Component cần optimize
 * @param propsAreEqual - Custom comparison function (optional)
 * @returns Memoized component
 * 
 * @example
 * ```tsx
 * const MyComponent = ({ data }) => <View>...</View>
 * export default withMemo(MyComponent)
 * ```
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  return memo(Component, propsAreEqual)
}

/**
 * Custom comparison cho array props
 * So sánh shallow array để tránh re-render khi array reference thay đổi nhưng content giống nhau
 */
export function areArrayPropsEqual<P extends { [key: string]: any }>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>,
  arrayKeys: (keyof P)[]
): boolean {
  // Check non-array props
  const prevKeys = Object.keys(prevProps) as (keyof P)[]
  const nextKeys = Object.keys(nextProps) as (keyof P)[]

  if (prevKeys.length !== nextKeys.length) return false

  for (const key of prevKeys) {
    if (arrayKeys.includes(key)) {
      // Special handling for arrays
      const prevArray = prevProps[key] as any[]
      const nextArray = nextProps[key] as any[]

      if (!Array.isArray(prevArray) || !Array.isArray(nextArray)) {
        if (prevArray !== nextArray) return false
        continue
      }

      if (prevArray.length !== nextArray.length) return false

      for (let i = 0; i < prevArray.length; i++) {
        if (prevArray[i] !== nextArray[i]) return false
      }
    } else {
      // Normal comparison
      if (prevProps[key] !== nextProps[key]) return false
    }
  }

  return true
}

/**
 * Comparison function cho object props
 * So sánh shallow object properties
 */
export function areObjectPropsEqual<P extends { [key: string]: any }>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>,
  objectKeys: (keyof P)[]
): boolean {
  const prevKeys = Object.keys(prevProps) as (keyof P)[]
  const nextKeys = Object.keys(nextProps) as (keyof P)[]

  if (prevKeys.length !== nextKeys.length) return false

  for (const key of prevKeys) {
    if (objectKeys.includes(key)) {
      const prevObj = prevProps[key] as any
      const nextObj = nextProps[key] as any

      if (typeof prevObj !== 'object' || typeof nextObj !== 'object') {
        if (prevObj !== nextObj) return false
        continue
      }

      const prevObjKeys = Object.keys(prevObj)
      const nextObjKeys = Object.keys(nextObj)

      if (prevObjKeys.length !== nextObjKeys.length) return false

      for (const objKey of prevObjKeys) {
        if (prevObj[objKey] !== nextObj[objKey]) return false
      }
    } else {
      if (prevProps[key] !== nextProps[key]) return false
    }
  }

  return true
}
