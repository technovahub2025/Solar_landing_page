import { useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { gsap } from '../lib/gsap.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import { MOTION } from '../lib/motion.js'
import Navbar from '../sections/Navbar.jsx'

const MAX_SCROLL_ATTEMPTS = 2
const SCROLL_ALIGNMENT_TOLERANCE = 8

function SiteLayout() {
  const location = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()

  const performScroll = useCallback((hash, instant = false) => {
    const target = document.querySelector(hash)

    if (!target) {
      return false
    }

    const revealSection = target.closest('.reveal-section')

    if (revealSection) {
      gsap.set(revealSection, { clearProps: 'opacity,visibility,transform', autoAlpha: 1 })
    }

    gsap.set(target, { clearProps: 'opacity,visibility,transform', autoAlpha: 1 })

    const styles = window.getComputedStyle(target)
    const scrollMarginTop = Number.parseFloat(styles.scrollMarginTop) || 0
    const top = target.getBoundingClientRect().top + window.scrollY - scrollMarginTop

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: prefersReducedMotion || instant ? 'auto' : 'smooth',
    })

    if (!prefersReducedMotion && !instant) {
      gsap.fromTo(
        target,
        {
          boxShadow: '0 0 0 rgba(200,154,75,0)',
          y: 12,
        },
        {
          boxShadow: '0 24px 48px rgba(200,154,75,0.16)',
          y: 0,
          duration: MOTION.duration.anchor,
          ease: MOTION.ease.crisp,
          clearProps: 'boxShadow,transform',
          overwrite: 'auto',
        },
      )
    }

    window.setTimeout(() => {
      const cleanUrl = `${window.location.pathname}${window.location.search}`
      window.history.replaceState(null, '', cleanUrl)
    }, 450)

    return true
  }, [prefersReducedMotion])

  const isHashAligned = useCallback((hash) => {
    const target = document.querySelector(hash)

    if (!target) {
      return false
    }

    const styles = window.getComputedStyle(target)
    const scrollMarginTop = Number.parseFloat(styles.scrollMarginTop) || 0
    const targetTop = target.getBoundingClientRect().top
    const delta = Math.abs(targetTop - scrollMarginTop)

    if (delta <= SCROLL_ALIGNMENT_TOLERANCE) {
      return true
    }

    const viewportBottom = window.scrollY + window.innerHeight
    const documentBottom = document.documentElement.scrollHeight
    const atBottom = viewportBottom >= documentBottom - SCROLL_ALIGNMENT_TOLERANCE

    if (atBottom && targetTop <= scrollMarginTop + SCROLL_ALIGNMENT_TOLERANCE) {
      return true
    }

    return false
  }, [])

  const scrollToHashTarget = useCallback(function scrollToHashTarget(hash, attempt = 0) {
    if (!hash) {
      return
    }

    performScroll(hash, attempt > 0)

    if (isHashAligned(hash) || attempt >= MAX_SCROLL_ATTEMPTS) {
      return
    }

    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash, attempt + 1)
      })
    }, 220)
  }, [isHashAligned, performScroll])

  const handleAnchorClick = useCallback((event) => {
    if (!(event.target instanceof Element)) {
      return
    }

    const anchor = event.target.closest('a[href^="#"]')

    if (!(anchor instanceof HTMLAnchorElement)) {
      return
    }

    const hash = anchor.getAttribute('href')

    if (!hash || hash === '#') {
      return
    }

    event.preventDefault()
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
    scrollToHashTarget(hash)
  }, [scrollToHashTarget])

  const handleHashChange = useCallback(() => {
    scrollToHashTarget(window.location.hash)
  }, [scrollToHashTarget])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    let timeoutId = 0
    let animationFrameId = 0

    window.addEventListener('click', handleAnchorClick)
    window.addEventListener('hashchange', handleHashChange)

    if (location.hash) {
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = window.requestAnimationFrame(() => {
          scrollToHashTarget(location.hash)
        })
      })
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [location.hash, handleAnchorClick, handleHashChange, scrollToHashTarget])

  return (
    <div className="site-frame min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="site-background" aria-hidden="true" />
      <div className="site-navbar relative z-20">
        <Navbar />
      </div>
      <div className="site-content relative z-10 pt-[var(--nav-height)]">
        <Outlet />
      </div>
    </div>
  )
}

export default SiteLayout
