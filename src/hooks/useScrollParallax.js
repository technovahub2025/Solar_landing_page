import { useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

function useScrollParallax(intensity = 40) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      return undefined
    }

    let frameId = 0

    const updateOffset = () => {
      const nextOffset = Math.min(window.scrollY * 0.08, intensity)
      setOffset(nextOffset)
    }

    const handleScroll = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        updateOffset()
        frameId = 0
      })
    }

    updateOffset()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [intensity, prefersReducedMotion])

  return prefersReducedMotion ? 0 : offset
}

export default useScrollParallax
