import { useEffect } from 'react'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

const VARIANT_MAP = {
  up: { y: MOTION.distance.section, scale: 1 },
  hero: { y: MOTION.distance.hero, scale: 0.985 },
  'split-left': { y: MOTION.distance.section, x: -16, scale: 1 },
  'split-right': { y: MOTION.distance.section, x: 16, scale: 1 },
  scale: { y: 28, scale: 0.97 },
  soft: { y: 22, scale: 1 },
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

function useGsapReveal(ref, { variant = 'up', delay = 0, start = 'top 82%' } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    const shouldUseDetailedReveal =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 768px) and (pointer: fine)').matches

    if (!node) {
      return undefined
    }

    if (prefersReducedMotion) {
      gsap.set(node, { clearProps: 'all', autoAlpha: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      const variantConfig = VARIANT_MAP[variant] || VARIANT_MAP.up
      const timeline = gsap.timeline({
        defaults: { ease: MOTION.ease.primary },
        scrollTrigger: {
          trigger: node,
          start,
          once: true,
        },
      })

      timeline.from(node, {
        autoAlpha: 0,
        y: variantConfig.y,
        x: variantConfig.x || 0,
        scale: variantConfig.scale,
        duration: shouldUseDetailedReveal ? MOTION.duration.section : 0.78,
        delay: delay / 1000,
        clearProps: 'opacity,visibility,transform',
      })

      if (!shouldUseDetailedReveal) {
        return
      }

      const motionLines = gsap.utils.toArray('.motion-line', node)
      if (motionLines.length > 0) {
        timeline.from(
          motionLines,
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.92,
            stagger: MOTION.stagger.base,
            clearProps: 'opacity,visibility,transform',
          },
          0.1,
        )
      }

      const standalones = gsap
        .utils.toArray('.kicker, .section-heading, .section-copy', node)
        .filter((element) => !element.closest('.motion-line') && !element.closest('.stagger-grid'))

      if (standalones.length > 0) {
        timeline.from(
          standalones,
          {
            autoAlpha: 0,
            y: 18,
            duration: MOTION.duration.item,
            stagger: MOTION.stagger.tight,
            clearProps: 'opacity,visibility,transform',
          },
          0.14,
        )
      }

      const staggerGroups = gsap.utils.toArray('.stagger-grid', node)
      staggerGroups.forEach((group, index) => {
        if (group.children.length === 0) {
          return
        }

        timeline.from(
          group.children,
          {
            autoAlpha: 0,
            y: (index, element) => readMotionVar(element, '--stagger-y', MOTION.distance.item),
            x: (index, element) => readMotionVar(element, '--stagger-x', 0),
            scale: (index, element) => readMotionVar(element, '--stagger-scale', 0.985),
            duration: 0.96,
            stagger: MOTION.stagger.base,
            clearProps: 'opacity,visibility,transform',
          },
          0.18 + index * 0.08,
        )
      })
    }, ref)

    return () => ctx.revert()
  }, [delay, prefersReducedMotion, ref, start, variant])
}

export default useGsapReveal
