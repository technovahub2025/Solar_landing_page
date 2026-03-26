import { memo, useEffect, useRef, useState } from 'react'
import { FloatingElement, PulseOnHover, RippleButton } from '../components/MicroInteractions.jsx'
import solarVideo from '../assets/solarvideo.mp4'
import useGsapInteractiveMotion from '../hooks/useGsapInteractiveMotion.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'

const HERO_HEADLINE = ['Clean power.', 'Lower bills.', 'Better backup.']
const HERO_NOTES = [
  ['25-year panel life', 'Long-horizon planning for durable rooftops.'],
  ['EMI-friendly options', 'Flexible budgets for homes and growing businesses.'],
  ['Fast installation', 'Most systems move from plan to setup in weeks, not months.'],
]

function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  useGsapInteractiveMotion(heroRef)

  useEffect(() => {
    const heroNode = heroRef.current

    if (!heroNode || prefersReducedMotion) {
      return undefined
    }

    const mediaQuerySupported =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    const isCompactViewport = mediaQuerySupported && window.matchMedia('(max-width: 767px)').matches
    const isReducedDataMode =
      typeof navigator !== 'undefined' &&
      'connection' in navigator &&
      navigator.connection?.saveData

    if (isCompactViewport || isReducedDataMode) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return
        }

        setShouldLoadVideo(true)
        observer.disconnect()
      },
      {
        rootMargin: '220px 0px',
        threshold: 0.01,
      },
    )

    observer.observe(heroNode)

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  useEffect(() => {
    const videoNode = videoRef.current

    if (!videoNode) {
      return undefined
    }

    if (!shouldLoadVideo || prefersReducedMotion) {
      videoNode.pause()
      return undefined
    }

    const playPromise = videoNode.play()

    if (playPromise?.catch) {
      playPromise.catch(() => {})
    }

    return () => videoNode.pause()
  }, [prefersReducedMotion, shouldLoadVideo])

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) {
      return undefined
    }

    const ctx = gsap.context(() => {
      const isCompactViewport =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(max-width: 767px)').matches
      const isCoarsePointer =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches

      const timeline = gsap.timeline({
        defaults: { ease: MOTION.ease.primary },
      })

      timeline
        .from('.hero-panel', {
          autoAlpha: 0,
          y: 24,
          scale: 0.985,
          duration: 1.12,
          clearProps: 'opacity,visibility,transform',
        })
        .from(
          '.hero-kicker',
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.7,
            clearProps: 'opacity,visibility,transform',
          },
          0.14,
        )
        .from(
          '.hero-line',
          {
            autoAlpha: 0,
            yPercent: 108,
            rotateX: -14,
            transformOrigin: '0% 50% -80',
            duration: 1.02,
            stagger: MOTION.stagger.relaxed,
            clearProps: 'opacity,visibility,transform',
          },
          0.22,
        )
        .from(
          '.hero-copy, .hero-actions',
          {
            autoAlpha: 0,
            y: 22,
            duration: 0.82,
            stagger: MOTION.stagger.tight,
            clearProps: 'opacity,visibility,transform',
          },
          0.42,
        )
        .from(
          '.sticky-note',
          {
            autoAlpha: 0,
            y: 26,
            rotate: 0,
            duration: 0.82,
            stagger: MOTION.stagger.base,
            clearProps: 'opacity,visibility,transform',
          },
          0.5,
        )
        .from(
          '.hero-benefit-card',
          {
            autoAlpha: 0,
            y: 24,
            scale: 0.985,
            duration: 0.8,
            stagger: MOTION.stagger.base,
            clearProps: 'opacity,visibility,transform',
          },
          0.6,
        )

      if (!isCompactViewport && !isCoarsePointer && videoRef.current) {
        gsap.to(videoRef.current, {
          scale: 1.035,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: MOTION.scrub.soft,
            pin: false,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.hero-orb-left, .hero-orb-right', {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: MOTION.scrub.base,
            invalidateOnRefresh: true,
          },
        })
      }
    }, heroRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section className="section-band section-space min-h-[min(94vh,1080px)] overflow-hidden pt-0 max-md:min-h-[min(100vh,800px)] max-md:pt-4" id="top" ref={heroRef}>
      <div className="wide-shell">
        <div className="hero-panel paper-panel relative min-h-[760px] overflow-hidden">
          <video
            ref={videoRef}
            className="hero-video absolute inset-0 z-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload={shouldLoadVideo ? 'metadata' : 'none'}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%232d2722' width='1920' height='1080'/%3E%3C/svg%3E"
          >
            {shouldLoadVideo ? <source src={solarVideo} type="video/mp4" /> : null}
          </video>
          <div className="hero-overlay hero-overlay-left pointer-events-none absolute inset-0 z-[1]" />
          <FloatingElement delay={0.4} intensity="medium">
            <div className="hero-orb hero-orb-right pointer-events-none absolute bottom-[-8rem] right-[-5rem] z-[1] h-72 w-72 rounded-full bg-[rgba(200,154,75,0.16)]" />
          </FloatingElement>
          <div className="hero-orb hero-orb-left pointer-events-none absolute left-[-3rem] top-24 z-[1] h-48 w-48 rounded-full bg-white/80" />

          <div className="hero-content absolute inset-0 z-20 px-4 py-4 md:px-8 md:py-8">
            <div className="hero-main relative z-10">
              <div className="hero-stage relative z-10 pt-2">
                <span className="hero-kicker kicker !border-white/14 !bg-white/10 !text-white/72">Solar savings for homes and businesses</span>
                <h1 className="mt-6 max-w-[10ch] text-[clamp(3.2rem,8vw,7.8rem)] leading-[0.86] tracking-[-0.08em] text-white">
                  {HERO_HEADLINE.map((line) => (
                    <span className="hero-line-wrap block overflow-hidden" key={line}>
                      <span className="hero-line block">{line}</span>
                    </span>
                  ))}
                </h1>
                <p className="hero-copy mt-6 max-w-xl text-base leading-8 text-white/78 md:text-lg">
                  Built for modern rooftops, energy-conscious homes, and performance-driven businesses,
                  our solar planning experience helps you move from exploration to a confident quote in
                  one polished flow.
                </p>

                <div className="hero-actions mt-8 flex flex-wrap gap-3">
                  <PulseOnHover className="inline-flex">
                    <RippleButton
                      as="a"
                      className="primary-button"
                      data-magnetic="true"
                      data-motion="button"
                      href="#calculator-panel"
                    >
                      Start Solar Estimate
                    </RippleButton>
                  </PulseOnHover>
                  <a className="outline-button" data-motion="button" href="#solutions-top">
                    Explore Solutions
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-side stagger-grid grid items-start gap-3" data-stagger-pattern="zigzag" style={{ '--hero-delay': '420ms' }}>
              {HERO_NOTES.map(([title, copy], index) => (
                <article
                  className="sticky-note hover-lift max-w-[280px] p-4"
                  key={title}
                  style={{
                    '--stagger-delay': 460 + index * 90,
                    '--note-rotate': `${index === 1 ? '-2.5deg' : index === 2 ? '3deg' : '-1deg'}`,
                    '--note-accent': index === 1 ? 'rgba(240, 216, 154, 0.9)' : 'rgba(255, 245, 222, 0.92)',
                  }}
                >
                  <p className="font-['Syne'] text-lg font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{copy}</p>
                </article>
              ))}
            </div>

            <div className="hero-bottom stagger-grid grid gap-3 md:grid-cols-3" style={{ '--hero-delay': '460ms' }}>
              {[
                ['Residential ready', 'Home rooftop plans with savings, backup, and site-fit guidance.'],
                ['Commercial aware', 'Business-focused recommendations with scalable, reliable system sizing.'],
                ['End-to-end support', 'Design, installation, after-sales care, and proposal generation in one place.'],
              ].map(([title, copy], index) => (
                <div className="hero-benefit-card hero-benefit-surface hover-lift rounded-[1.5rem] border border-white/12 p-4" data-motion="card" key={title} style={{ '--stagger-delay': 520 + index * 90 }}>
                  <p className="font-['Syne'] text-lg font-semibold tracking-[-0.04em] text-white">
                    {title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/70">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Hero)
