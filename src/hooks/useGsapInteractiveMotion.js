import { useEffect } from 'react'
import { gsap } from '../lib/gsap.js'
import { INTERACTIVE_SELECTOR, MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

const CONFIGS = {
  nav: {
    enter: { 
      y: -2, 
      color: 'var(--color-ink)', 
      duration: MOTION.duration.hover, 
      ease: MOTION.ease.soft,
      scale: 1.02
    },
    leave: { 
      y: 0, 
      color: '', 
      duration: 0.24, 
      ease: MOTION.ease.soft, 
      clearProps: 'transform,color' 
    },
    press: { 
      scale: 0.98, 
      duration: MOTION.duration.press, 
      ease: MOTION.ease.soft 
    },
  },
  button: {
    enter: {
      y: -3,
      scale: 1.01,
      boxShadow: '0 20px 36px rgba(33, 28, 23, 0.18)',
      duration: MOTION.duration.hover,
      ease: MOTION.ease.soft,
      rotateX: -1,
      transformPerspective: 1000,
    },
    leave: {
      y: 0,
      scale: 1,
      boxShadow: '',
      duration: 0.24,
      ease: MOTION.ease.soft,
      clearProps: 'transform,boxShadow',
    },
    press: { 
      scale: 0.985, 
      duration: MOTION.duration.press, 
      ease: MOTION.ease.soft,
      rotateX: 2,
    },
  },
  card: {
    enter: {
      y: -8,
      scale: 1.012,
      rotateX: -2,
      rotateY: 1,
      transformPerspective: 1000,
      boxShadow: '0 26px 54px rgba(37, 27, 17, 0.14)',
      duration: 0.34,
      ease: MOTION.ease.soft,
    },
    leave: {
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: '',
      duration: 0.28,
      ease: MOTION.ease.soft,
      clearProps: 'transform,boxShadow',
    },
    press: { 
      scale: 0.992, 
      duration: MOTION.duration.press, 
      ease: MOTION.ease.soft,
      rotateX: 1,
      rotateY: -0.5,
    },
  },
  soft: {
    enter: {
      y: -4,
      scale: 1.006,
      duration: 0.26,
      ease: MOTION.ease.soft,
      opacity: 0.95,
    },
    leave: {
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: MOTION.ease.soft,
      opacity: 1,
      clearProps: 'transform,opacity',
    },
    press: { 
      scale: 0.99, 
      duration: MOTION.duration.press, 
      ease: MOTION.ease.soft 
    },
  },
  pill: {
    enter: {
      y: -2,
      scale: 1.01,
      duration: 0.22,
      ease: MOTION.ease.soft,
      boxShadow: '0 8px 16px rgba(37, 27, 17, 0.1)',
    },
    leave: {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: MOTION.ease.soft,
      clearProps: 'transform,boxShadow',
    },
    press: { 
      scale: 0.985, 
      duration: MOTION.duration.press, 
      ease: MOTION.ease.soft 
    },
  },
}

// Cache the media query result
let cachedCanHover = null
let cachedMediaQuerySupported = false

function useGsapInteractiveMotion(ref, { selector = INTERACTIVE_SELECTOR } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const scope = ref?.current
    
    // Early returns for performance
    if (!scope || prefersReducedMotion) {
      return undefined
    }

    // Cache media query checks
    if (!cachedMediaQuerySupported && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      cachedMediaQuerySupported = true
      cachedCanHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    }

    const canHover = cachedCanHover
    if (!canHover) {
      return undefined
    }

    // Use querySelectorAll for better performance than toArray
    const nodes = scope.querySelectorAll(selector)

    if (nodes.length === 0) {
      return undefined
    }

    // Create cleanup functions once
    const cleanups = []
    
    nodes.forEach((node) => {
      const kind = node.dataset.motion || 'soft'
      const config = CONFIGS[kind] || CONFIGS.soft
      
      // Enhanced magnetic effect for specific elements
      let magneticEffect = null
      let cleanupMagnetic = null
      
      if (node.dataset.magnetic === 'true') {
        const handleMouseMove = (e) => {
          const rect = node.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const mouseX = e.clientX
          const mouseY = e.clientY
          const distanceX = (mouseX - centerX) * 0.15
          const distanceY = (mouseY - centerY) * 0.15
          
          magneticEffect = gsap.to(node, {
            x: distanceX,
            y: distanceY,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        }
        
        const handleMouseLeave = () => {
          if (magneticEffect) {
            magneticEffect.kill()
          }
          gsap.to(node, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
          })
        }
        
        node.addEventListener('mousemove', handleMouseMove)
        node.addEventListener('mouseleave', handleMouseLeave)
        
        cleanupMagnetic = () => {
          node.removeEventListener('mousemove', handleMouseMove)
          node.removeEventListener('mouseleave', handleMouseLeave)
          if (magneticEffect) {
            magneticEffect.kill()
          }
        }
      }

      // Use optimized GSAP tweens with overwrite: 'auto' to prevent conflicts
      const animateIn = () => gsap.to(node, { ...config.enter, overwrite: 'auto' })
      const animateOut = () => gsap.to(node, { ...config.leave, overwrite: 'auto' })
      const animatePress = () => gsap.to(node, { ...config.press, overwrite: 'auto' })
      const animateRelease = () => gsap.to(node, { ...config.enter, overwrite: 'auto' })

      node.addEventListener('pointerenter', animateIn)
      node.addEventListener('pointerleave', animateOut)
      node.addEventListener('focus', animateIn)
      node.addEventListener('blur', animateOut)
      node.addEventListener('pointerdown', animatePress)
      node.addEventListener('pointerup', animateRelease)
      node.addEventListener('pointercancel', animateOut)

      cleanups.push(() => {
        node.removeEventListener('pointerenter', animateIn)
        node.removeEventListener('pointerleave', animateOut)
        node.removeEventListener('focus', animateIn)
        node.removeEventListener('blur', animateOut)
        node.removeEventListener('pointerdown', animatePress)
        node.removeEventListener('pointerup', animateRelease)
        node.removeEventListener('pointercancel', animateOut)
        if (cleanupMagnetic) cleanupMagnetic()
        gsap.killTweensOf(node)
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [prefersReducedMotion, ref, selector])
}

export default useGsapInteractiveMotion
