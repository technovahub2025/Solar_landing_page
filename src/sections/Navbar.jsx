import { memo, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navLinks } from '../content/siteContent.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import useGsapInteractiveMotion from '../hooks/useGsapInteractiveMotion.js'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'

function Navbar() {
  const location = useLocation()
  const headerRef = useRef(null)
  const scrolledRef = useRef(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    let timeoutId = 0
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
        timeoutId = 0
        updateActiveSection()
        return
      }

      retries += 1
      timeoutId = window.setTimeout(collectSections, 120)
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
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [location.pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event) => {
      if (event.matches) {
        setMobileMenuOpen(false)
      }
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
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

        <div className="flex items-center gap-2">
          <a className="primary-button hidden shrink-0 !px-3 !py-2.5 text-xs sm:inline-flex sm:!px-5 sm:!py-3 sm:text-sm" data-motion="button" data-nav-enter href="#calculator-panel">
            Get Free Solar Plan
          </a>

          <button
            aria-controls="mobile-nav"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/70 text-[var(--color-ink)] shadow-[0_14px_30px_rgba(37,27,17,0.08)] transition hover:bg-white lg:hidden"
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`border-t border-black/6 bg-[rgba(250,246,239,0.94)] px-4 pb-4 pt-3 shadow-[0_18px_42px_rgba(37,27,17,0.08)] site-glass transition-[opacity,transform,max-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          mobileMenuOpen ? 'pointer-events-auto max-h-[32rem] translate-y-0 opacity-100' : 'pointer-events-none max-h-0 -translate-y-2 overflow-hidden opacity-0'
        }`}
        id="mobile-nav"
      >
        <nav className="grid gap-2" aria-label="Mobile primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold transition ${
                activeHash === link.href
                  ? 'border-[rgba(200,154,75,0.28)] bg-[linear-gradient(180deg,#fffaf1,#f4ead9)] text-[var(--color-ink)]'
                  : 'border-black/8 bg-white/72 text-[var(--color-muted)]'
              }`}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <a className="primary-button mt-2 w-full justify-center" href="#calculator-panel" onClick={() => setMobileMenuOpen(false)}>
            Get Free Solar Plan
          </a>
        </nav>
      </div>
    </header>
  )
}

export default memo(Navbar)
