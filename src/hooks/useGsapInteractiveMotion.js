import { useEffect } from 'react'
import { gsap } from '../lib/gsap.js'
import { INTERACTIVE_SELECTOR, MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from './usePrefersReducedMotion.js'

const CONFIGS = {
  nav: {
    enter: { y: -2, color: 'var(--color-ink)', duration: MOTION.duration.hover, ease: MOTION.ease.soft },
    leave: { y: 0, color: '', duration: 0.24, ease: MOTION.ease.soft, clearProps: 'transform,color' },
    press: { scale: 0.98, duration: MOTION.duration.press, ease: MOTION.ease.soft },
  },
  button: {
    enter: {
      y: -3,
      scale: 1.01,
      boxShadow: '0 20px 36px rgba(33, 28, 23, 0.18)',
      duration: MOTION.duration.hover,
      ease: MOTION.ease.soft,
    },
    leave: {
      y: 0,
      scale: 1,
      boxShadow: '',
      duration: 0.24,
      ease: MOTION.ease.soft,
      clearProps: 'transform,boxShadow',
    },
    press: { scale: 0.985, duration: MOTION.duration.press, ease: MOTION.ease.soft },
  },
  card: {
    enter: {
      y: -8,
      scale: 1.012,
      rotateX: -2,
      transformPerspective: 1000,
      boxShadow: '0 26px 54px rgba(37, 27, 17, 0.14)',
      duration: 0.34,
      ease: MOTION.ease.soft,
    },
    leave: {
      y: 0,
      scale: 1,
      rotateX: 0,
      boxShadow: '',
      duration: 0.28,
      ease: MOTION.ease.soft,
      clearProps: 'transform,boxShadow',
    },
    press: { scale: 0.992, duration: MOTION.duration.press, ease: MOTION.ease.soft },
  },
  soft: {
    enter: {
      y: -4,
      scale: 1.006,
      duration: 0.26,
      ease: MOTION.ease.soft,
    },
    leave: {
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: MOTION.ease.soft,
      clearProps: 'transform',
    },
    press: { scale: 0.99, duration: MOTION.duration.press, ease: MOTION.ease.soft },
  },
  pill: {
    enter: {
      y: -2,
      scale: 1.01,
      duration: 0.22,
      ease: MOTION.ease.soft,
    },
    leave: {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: MOTION.ease.soft,
      clearProps: 'transform',
    },
    press: { scale: 0.985, duration: MOTION.duration.press, ease: MOTION.ease.soft },
  },
}

function useGsapInteractiveMotion(ref, { selector = INTERACTIVE_SELECTOR } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const scope = ref?.current
    const canHover =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (!scope || prefersReducedMotion || !canHover) {
      return undefined
    }

    const nodes = Array.from(scope.querySelectorAll(selector))

    if (nodes.length === 0) {
      return undefined
    }

    const cleanups = nodes.map((node) => {
      const kind = node.dataset.motion || 'soft'
      const config = CONFIGS[kind] || CONFIGS.soft

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

      return () => {
        node.removeEventListener('pointerenter', animateIn)
        node.removeEventListener('pointerleave', animateOut)
        node.removeEventListener('focus', animateIn)
        node.removeEventListener('blur', animateOut)
        node.removeEventListener('pointerdown', animatePress)
        node.removeEventListener('pointerup', animateRelease)
        node.removeEventListener('pointercancel', animateOut)
        gsap.killTweensOf(node)
      }
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [prefersReducedMotion, ref, selector])
}

export default useGsapInteractiveMotion
