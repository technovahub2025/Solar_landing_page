import { memo, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navLinks } from '../content/siteContent.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import useGsapInteractiveMotion from '../hooks/useGsapInteractiveMotion.js'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'

function Navbar() {
  const location = useLocation()
  const headerRef = useRef(null)
  const scrolledRef = useRef(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const prefersReducedMotion = usePrefersReducedMotion()
  useGsapInteractiveMotion(headerRef)

  useEffect(() => {
    let frameId = 0

    const updateScrolled = () => {
      const nextScrolled = window.scrollY > 18

      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled
        setScrolled(nextScrolled)
      }

      frameId = 0
    }

    const handleScroll = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(updateScrolled)
    }

    updateScrolled()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || !headerRef.current) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-nav-enter]', {
        y: -20,
        autoAlpha: 0,
        duration: 0.78,
        stagger: MOTION.stagger.tight,
        ease: MOTION.ease.crisp,
        clearProps: 'opacity,visibility,transform',
      })
    }, headerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  useEffect(() => {
    let frameId = 0
    let retryTimeoutId = 0
    let retries = 0
    let sections = []
    let topSection = null

    const collectSections = () => {
      sections = navLinks
        .map((link) => {
          const element = document.querySelector(link.href)
          return element ? { href: link.href, element } : null
        })
        .filter(Boolean)

      topSection = document.querySelector('#top')

      if (sections.length === navLinks.length || retries >= 20) {
        retryTimeoutId = 0
        updateActiveSection()
        return
      }

      retries += 1
      retryTimeoutId = window.setTimeout(collectSections, 120)
    }

    const updateActiveSection = () => {
      const headerHeight = headerRef.current?.offsetHeight || 78
      const probeY = headerHeight + window.innerHeight * 0.28

      if (topSection) {
        const topRect = topSection.getBoundingClientRect()
        if (topRect.top <= headerHeight && topRect.bottom > probeY) {
          setActiveHash('')
          frameId = 0
          return
        }
      }

      const activeSection = sections.find(({ element }) => {
        const rect = element.getBoundingClientRect()
        return rect.top <= probeY && rect.bottom >= probeY
      })

      setActiveHash(activeSection?.href || '')
      frameId = 0
    }

    const queueUpdate = () => {
      if (frameId) {
        return
      }

      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    collectSections()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId)
      }
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [location.pathname])

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b transition-all duration-500 ${
        scrolled
          ? 'border-black/8 bg-[rgba(244,239,230,0.88)] shadow-[0_20px_50px_rgba(37,27,17,0.08)] site-glass'
          : 'border-transparent bg-[rgba(244,239,230,0.72)]'
      }`}
    >
      <div className="content-shell flex min-h-[78px] items-center justify-between gap-2 px-1 sm:gap-4">
        <a className="min-w-0 flex items-center gap-3" data-nav-enter href="#top" aria-label="Sunridge Solar home">
          <img
            className="h-10 w-10 rounded-full object-cover shadow-[0_12px_24px_rgba(200,154,75,0.25)] sm:h-12 sm:w-12"
            src={logo}
            alt="Sunridge Solar logo"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-['Syne'] text-base font-semibold tracking-[-0.04em] text-[var(--color-ink)] sm:text-lg">
              Sunridge Solar
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] sm:block lg:text-[11px] lg:tracking-[0.22em]">
              Rooftop and storage solutions
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[var(--color-muted)] lg:flex" aria-label="Primary">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              className={`motion-nav-link transition hover:text-[var(--color-ink)] ${
                activeHash === link.href ? 'text-[var(--color-ink)]' : ''
              }`}
              data-nav-enter
              data-motion="nav"
              data-active={activeHash === link.href}
              href={link.href}
              style={{ '--nav-delay': `${120 + index * 60}ms` }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="primary-button shrink-0 !px-3 !py-2.5 text-xs sm:!px-5 sm:!py-3 sm:text-sm" data-motion="button" data-nav-enter href="#calculator-panel">
          Get Free Solar Plan
        </a>
      </div>
    </header>
  )
}

export default memo(Navbar)
