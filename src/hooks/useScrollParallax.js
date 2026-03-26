import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

function useScrollParallax(intensity = 40) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [offset, setOffset] = useState(0)
  const rafIdRef = useRef(0)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    // Early return for reduced motion
    if (prefersReducedMotion || typeof window === 'undefined') {
      return undefined
    }

    const updateOffset = () => {
      const currentScroll = window.scrollY
      
      // Throttle: only update if scroll position changed significantly
      if (Math.abs(currentScroll - lastScrollRef.current) < 1) {
        return
      }
      
      lastScrollRef.current = currentScroll
      const nextOffset = Math.min(currentScroll * 0.08, intensity)
      setOffset((current) => (current === nextOffset ? current : nextOffset))
    }

    const handleScroll = () => {
      // Cancel any pending frame to prevent buildup
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
      
      // Schedule next frame
      rafIdRef.current = window.requestAnimationFrame(() => {
        updateOffset()
        rafIdRef.current = 0
      })
    }

    // Initial update
    updateOffset()
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [intensity, prefersReducedMotion])

  if (prefersReducedMotion || typeof window === 'undefined') {
    return 0
  }

  return offset
}

export default useScrollParallax
