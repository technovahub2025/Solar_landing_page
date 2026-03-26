import { memo, useEffect, useRef } from 'react'
import { TypewriterText } from './MicroInteractions.jsx'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

function LoadingAnimation({ 
  type = 'solar', 
  size = 'medium', 
  text = 'Loading solar insights...' 
}) {
  const containerRef = useRef(null)
  const orbRef = useRef(null)
  const raysRef = useRef(null)
  const textRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'none' }
      })

      if (type === 'solar') {
        // Solar-themed loading animation
        timeline
          .to(orbRef.current, {
            rotation: 360,
            duration: 8,
            ease: 'none'
          })
          .to(raysRef.current, {
            rotation: -360,
            duration: 12,
            ease: 'none'
          }, 0)
          .to('.solar-ray', {
            opacity: 0.3,
            stagger: 0.1,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: 'power2.inOut'
          }, 0)
          .to(textRef.current, {
            opacity: 0.6,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: 'power2.inOut'
          }, 0)
      } else if (type === 'pulse') {
        // Pulse loading animation
        timeline
          .to(container, {
            scale: 1.05,
            duration: 1,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1
          })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [type, prefersReducedMotion])

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  if (type === 'solar') {
    return (
      <div 
        ref={containerRef}
        className="flex flex-col items-center justify-center gap-4 p-6"
      >
        <div className="relative" ref={orbRef}>
          {/* Central orb */}
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-soft)] shadow-lg`} />
          
          {/* Rotating rays */}
          <div ref={raysRef} className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="solar-ray absolute top-1/2 left-1/2 w-1 h-4 bg-[var(--color-accent)] origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-8px)`
                }}
              />
            ))}
          </div>
        </div>
        
        {text && (
          <div ref={textRef}>
            <TypewriterText
              className={`${textSizeClasses[size]} text-[var(--color-muted)] font-medium`}
              delay={120}
              speed={24}
              text={text}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center p-6"
    >
      <div className={`${sizeClasses[size]} rounded-full bg-[var(--color-accent)] opacity-80 animate-pulse`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-[var(--color-muted)] font-medium ml-3`}>
          {text}
        </p>
      )}
    </div>
  )
}

export default memo(LoadingAnimation)
