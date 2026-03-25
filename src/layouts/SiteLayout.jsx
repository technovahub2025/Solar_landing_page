import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { gsap } from '../lib/gsap.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import { MOTION } from '../lib/motion.js'
import Navbar from '../sections/Navbar.jsx'

const MAX_SCROLL_ATTEMPTS = 24

function SiteLayout() {
  const location = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    let timeoutId = 0
    let animationFrameId = 0

    const performScroll = (hash) => {
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
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })

      if (!prefersReducedMotion) {
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
    }

    const scrollToHashTarget = (hash, attempt = 0) => {
      if (!hash) {
        return
      }

      const didScroll = performScroll(hash)

      if (didScroll || attempt >= MAX_SCROLL_ATTEMPTS) {
        return
      }

      timeoutId = window.setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(() => {
          scrollToHashTarget(hash, attempt + 1)
        })
      }, 60)
    }

    const handleAnchorClick = (event) => {
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
    }

    const handleHashChange = () => {
      scrollToHashTarget(window.location.hash)
    }

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
  }, [location.hash, prefersReducedMotion])

  return (
    <div className="site-frame min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default SiteLayout
