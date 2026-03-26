import { useEffect } from 'react'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'
import { useAnimationPerformance } from './useAnimationPerformance.js'

const VARIANT_MAP = {
  up: { y: MOTION.distance.section, scale: 1 },
  hero: { y: MOTION.distance.hero, scale: 0.985 },
  'split-left': { x: -72, y: 0, scale: 1, rotation: -1.2 },
  'split-right': { x: 72, y: 0, scale: 1, rotation: 1.2 },
  scale: { x: 0, y: 0, scale: 0.9 },
  soft: { x: 0, y: 12, scale: 0.992, rotation: 0.35 },
}

const readMotionVar = (element, name, fallback) => {
  if (!(element instanceof HTMLElement)) {
    return fallback
  }

  const value = window.getComputedStyle(element).getPropertyValue(name).trim()

  if (!value) {
    return fallback
  }

  const numericValue = Number.parseFloat(value)
  return Number.isNaN(numericValue) ? fallback : numericValue
}

const getVariantEase = (variant) => {
  const easeMap = {
    'split-left': 'power3.out',
    'split-right': 'power3.out',
    scale: MOTION.ease.crisp,
    soft: MOTION.ease.soft,
  }
  return easeMap[variant] || MOTION.ease.primary
}

const getVariantDuration = (variant, isDetailed) => {
  const durationMap = {
    hero: MOTION.duration.hero,
    'split-left': 1.0,
    'split-right': 1.0,
    scale: 1.05,
    soft: 0.82,
  }
  return isDetailed ? (durationMap[variant] || MOTION.duration.section) : 0.78
}

const getCustomStagger = (pattern) => {
  switch (pattern) {
    case 'wave':
      return {
        each: 0.08,
        from: 'center',
        ease: 'power2.inOut'
      }
    case 'zigzag':
      return (i) => {
        const baseDelay = 0.05
        const rowDelay = Math.floor(i / 4) * 0.1
        const colDelay = (i % 4) * 0.03
        return baseDelay + rowDelay + colDelay
      }
    default:
      return MOTION.stagger.base
  }
}

function useGsapReveal(ref, { variant = 'up', delay = 0, start = 'top 82%' } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { getOptimizedDuration, getOptimizedStagger, shouldUseReducedAnimations } = useAnimationPerformance()

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return undefined
    }

    // Skip animations for users who prefer reduced motion or have low performance
    if (prefersReducedMotion || shouldUseReducedAnimations()) {
      gsap.set(node, { clearProps: 'all', autoAlpha: 1 })
      return undefined
    }

    // Cache media query checks for performance
    const shouldUseDetailedReveal =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 768px) and (pointer: fine)').matches

    const performAnimation = (target) => {
      // Use gsap.context for proper cleanup and performance
      const ctx = gsap.context(() => {
        const variantConfig = VARIANT_MAP[variant] || VARIANT_MAP.up
        const timeline = gsap.timeline({
          defaults: { ease: MOTION.ease.primary },
        })

        // Enhanced main reveal animation with variant-specific easing and performance optimization
        const variantEase = getVariantEase(variant)
        const variantDuration = getOptimizedDuration(
          shouldUseDetailedReveal ? getVariantDuration(variant, true) : 0.78
        )
        
        timeline.from(target, {
          autoAlpha: variantConfig.autoAlpha !== undefined ? variantConfig.autoAlpha : 0,
          y: variantConfig.y || 0,
          x: variantConfig.x || 0,
          scale: variantConfig.scale || 1,
          rotation: variantConfig.rotation || 0,
          skewY: variantConfig.skewY || 0,
          duration: variantDuration,
          delay: delay / 1000,
          ease: variantEase,
          clearProps: 'opacity,visibility,transform',
          onComplete: () => {
            // Remove GPU acceleration after animation
            gsap.set(target, { willChange: 'auto' })
          }
        })

        // Skip complex stagger animations on mobile/low-power devices
        if (!shouldUseDetailedReveal) {
          return
        }

        // Enhanced stagger animations with different patterns
        const motionLines = gsap.utils.toArray('.motion-line', target)
        if (motionLines.length > 0) {
          timeline.from(
            motionLines,
            {
              autoAlpha: 0,
              y: 18,
              duration: 0.92,
              stagger: getOptimizedStagger(MOTION.stagger.base),
              clearProps: 'opacity,visibility,transform',
            },
            0.1,
          )
        }

        const standalones = gsap
          .utils.toArray('.kicker, .section-heading, .section-copy', target)
          .filter((element) => !element.closest('.motion-line') && !element.closest('.stagger-grid'))

        if (standalones.length > 0) {
          timeline.from(
            standalones,
            {
              autoAlpha: 0,
              y: 18,
              duration: MOTION.duration.item,
              stagger: getOptimizedStagger(MOTION.stagger.tight),
              clearProps: 'opacity,visibility,transform',
            },
            0.14,
          )
        }

        const staggerGroups = gsap.utils.toArray('.stagger-grid', target)
        staggerGroups.forEach((group, index) => {
          if (!group || group.children.length === 0) {
            return
          }

          const staggerPattern = group.dataset.staggerPattern || 'wave'
          const customStagger = getCustomStagger(staggerPattern)
          const optimizedStagger = getOptimizedStagger(customStagger)

          timeline.from(
            group.children,
            {
              autoAlpha: 0,
              y: (i, element) => readMotionVar(element, '--stagger-y', MOTION.distance.item),
              x: (i, element) => readMotionVar(element, '--stagger-x', 0),
              scale: (i, element) => readMotionVar(element, '--stagger-scale', 0.985),
              duration: 0.96,
              stagger: optimizedStagger,
              clearProps: 'opacity,visibility,transform',
            },
            0.18 + index * 0.08,
          )
        })
      }, target)

      return () => ctx.revert()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return
        }

        gsap.set(entry.target, { transform: 'translateZ(0)', willChange: 'transform, opacity' })
        performAnimation(entry.target)
        observer.unobserve(entry.target)
      },
      { threshold: 0.1, rootMargin: '50px 0px' },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      // Cleanup function
      if (node) {
        gsap.killTweensOf(node)
        gsap.set(node, { clearProps: 'all' })
      }
    }
  }, [delay, prefersReducedMotion, ref, start, variant, getOptimizedDuration, getOptimizedStagger, shouldUseReducedAnimations])
}

export default useGsapReveal
