import { useEffect, useRef, useCallback } from 'react'

// Performance monitoring and optimization for animations
export function useAnimationPerformance() {
  const frameCount = useRef(0)
  const lastTime = useRef(0)
  const fps = useRef(60)
  const isLowPerformance = useRef(false)

  const measureFPS = useCallback(() => {
    frameCount.current++
    const currentTime = performance.now()
    
    if (currentTime >= lastTime.current + 1000) {
      fps.current = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
      frameCount.current = 0
      lastTime.current = currentTime
      
      // Detect low performance (below 30 FPS)
      isLowPerformance.current = fps.current < 30
    }
  }, [])

  const shouldUseReducedAnimations = useCallback(() => {
    // Check for various performance indicators
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4
    const isSlowConnection = navigator.connection && (
      navigator.connection.effectiveType === 'slow-2g' ||
      navigator.connection.effectiveType === '2g' ||
      navigator.connection.saveData
    )

    return isLowPerformance.current || isMobile || isLowEnd || isLowMemory || isSlowConnection
  }, [])

  const getOptimizedDuration = useCallback((baseDuration) => {
    return shouldUseReducedAnimations() ? baseDuration * 0.6 : baseDuration
  }, [shouldUseReducedAnimations])

  const getOptimizedStagger = useCallback((baseStagger) => {
    return shouldUseReducedAnimations() ? baseStagger * 0.5 : baseStagger
  }, [shouldUseReducedAnimations])

  // RAF-based animation loop for performance tracking
  useEffect(() => {
    let rafId
    lastTime.current = performance.now()
    
    const trackPerformance = () => {
      measureFPS()
      rafId = requestAnimationFrame(trackPerformance)
    }
    
    rafId = requestAnimationFrame(trackPerformance)
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [measureFPS])

  return {
    shouldUseReducedAnimations,
    getOptimizedDuration,
    getOptimizedStagger
  }
}
