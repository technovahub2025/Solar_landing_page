import { memo, useEffect, useRef, useCallback } from 'react'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

// Success feedback animation
export const SuccessFeedback = memo(({ trigger, children }) => {
  const containerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const triggerSuccess = useCallback(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline()
      
      // Checkmark animation
      timeline
        .fromTo('.success-check',
          { scale: 0, rotation: -45 },
          { 
            scale: 1, 
            rotation: 0,
            duration: 0.4,
            ease: MOTION.ease.elastic
          }
        )
        .fromTo('.success-circle',
          { scale: 0, opacity: 0 },
          { 
            scale: 1.2, 
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          },
          0
        )
        .to('.success-circle',
          { 
            scale: 1, 
            duration: 0.2,
            ease: 'power2.inOut'
          }
        )
        .to('.success-ripple',
          { 
            scale: 3, 
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
          },
          0.1
        )
    }, containerRef)

    setTimeout(() => ctx.revert(), 2000)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (trigger) {
      triggerSuccess()
    }
  }, [trigger, triggerSuccess])

  return (
    <div ref={containerRef} className="relative inline-flex items-center justify-center">
      {children}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="success-circle w-12 h-12 rounded-full bg-green-500 opacity-0" />
        <div className="success-ripple absolute w-12 h-12 rounded-full border-2 border-green-500" />
        <svg className="success-check absolute w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  )
})

// Loading dots animation
export const LoadingDots = memo(({ size = 'medium', color = 'var(--color-accent)' }) => {
  const containerRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray('.loading-dot', containerRef)
      
      gsap.timeline({ repeat: -1 })
        .to(dots, {
          scale: 1.5,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        })
    }, containerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  const sizeClasses = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3'
  }

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`loading-dot rounded-full ${sizeClasses[size]}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
})

// Button ripple effect
export const RippleButton = memo(({ as: Component = 'button', children, onClick, className = '', type, ...props }) => {
  const buttonRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const createRipple = useCallback((event) => {
    if (prefersReducedMotion || !buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none'
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.style.transform = 'scale(0)'

    button.appendChild(ripple)

    gsap.to(ripple, {
      scale: 4,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    })
  }, [prefersReducedMotion])

  const handleClick = useCallback((event) => {
    createRipple(event)
    onClick?.(event)
  }, [createRipple, onClick])

  return (
    <Component
      ref={buttonRef}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      type={Component === 'button' ? (type || 'button') : undefined}
      {...props}
    >
      {children}
    </Component>
  )
})

// Floating animation
export const FloatingElement = memo(({ children, intensity = 'medium', delay = 0 }) => {
  const elementRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return

    const intensityMap = {
      subtle: { y: 3, duration: 4 },
      medium: { y: 6, duration: 3 },
      strong: { y: 10, duration: 2.5 }
    }

    const config = intensityMap[intensity] || intensityMap.medium

    const ctx = gsap.context(() => {
      gsap.timeline({ repeat: -1, delay })
        .to(elementRef.current, {
          y: config.y,
          duration: config.duration,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1
        })
    }, elementRef)

    return () => ctx.revert()
  }, [intensity, delay, prefersReducedMotion])

  return <div ref={elementRef}>{children}</div>
})

// Pulse on hover
export const PulseOnHover = memo(({ children, className = '', ...props }) => {
  const elementRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return

    const element = elementRef.current
    
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: MOTION.ease.elastic,
        repeat: 1,
        yoyo: true
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      gsap.killTweensOf(element)
    }
  }, [prefersReducedMotion])

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  )
})

// Typewriter effect
export const TypewriterText = memo(({ text, speed = 50, delay = 0, onComplete, className = '' }) => {
  const textRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!textRef.current) {
      return undefined
    }

    if (prefersReducedMotion) {
      textRef.current.textContent = text
    }

    return undefined
  }, [prefersReducedMotion, text])

  useEffect(() => {
    if (prefersReducedMotion || !textRef.current) return

    const element = textRef.current
    element.textContent = ''

    const ctx = gsap.context(() => {
      gsap.timeline({ delay: delay / 1000, onComplete })
        .to(element, {
          text: text,
          duration: text.length * (speed / 1000),
          ease: 'none',
          onUpdate: function() {
            const progress = this.progress()
            const currentLength = Math.floor(text.length * progress)
            element.textContent = text.slice(0, currentLength)
          }
        })
    }, textRef)

    return () => ctx.revert()
  }, [text, speed, delay, onComplete, prefersReducedMotion])

  return <span ref={textRef} className={className} />
})
