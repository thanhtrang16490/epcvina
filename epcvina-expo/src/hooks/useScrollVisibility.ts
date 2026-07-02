import { useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

export const useScrollVisibility = (threshold: number = 5) => {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<number | null>(null)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Only trigger if scroll difference is significant
    if (Math.abs(scrollDiff) > threshold) {
      if (scrollDiff > 0 && currentScrollY > 50) {
        // Scrolling down - hide
        setIsVisible(false)
      } else if (scrollDiff < 0) {
        // Scrolling up - show
        setIsVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    // Show tab bar after user stops scrolling
    scrollTimeout.current = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
  }

  return { isVisible, handleScroll }
}
