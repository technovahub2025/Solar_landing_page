import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

function useCountUp(target, start = false, duration = 1300, precision = 0) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [value, setValue] = useState(0)
  const lastValueRef = useRef(0)
  const shouldAnimate = start && !prefersReducedMotion

  useEffect(() => {
    if (!shouldAnimate) {
      return undefined
    }

    let frameId = 0
    let startTime = 0

    const tick = (timestamp) => {
      if (!startTime) {
        startTime = timestamp
      }

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const factor = 10 ** precision
      const nextValue = Math.round(target * eased * factor) / factor

      if (nextValue !== lastValueRef.current) {
        lastValueRef.current = nextValue
        setValue(nextValue)
      }

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    lastValueRef.current = 0
    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [duration, precision, shouldAnimate, target])

  if (!start) {
    return 0
  }

  return prefersReducedMotion ? target : value
}

export default useCountUp
