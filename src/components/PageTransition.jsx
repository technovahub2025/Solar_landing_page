import { memo, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

function PageTransition({ children, isEntering = true }) {
  const containerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: MOTION.ease.primary }
      })

      if (isEntering) {
        // Page enter animation
        timeline
          .fromTo(container, 
            { 
              autoAlpha: 0,
              y: 30,
              scale: 0.98
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: MOTION.duration.section,
              ease: MOTION.ease.primary,
              clearProps: 'opacity,visibility,transform'
            }
          )
      } else {
        // Page exit animation
        timeline
          .to(container, {
            autoAlpha: 0,
            y: -20,
            scale: 1.02,
            duration: 0.6,
            ease: MOTION.ease.crisp
          })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isEntering, prefersReducedMotion])

  return (
    <div ref={containerRef} className="page-transition-container">
      {children}
    </div>
  )
}

export default memo(PageTransition)
