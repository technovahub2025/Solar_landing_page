export const MOTION = {
  ease: {
    primary: 'power4.out',
    soft: 'sine.out',
    crisp: 'expo.out',
    elastic: 'back.out(1.6)',
  },
  duration: {
    hero: 1.4,
    section: 1.2,
    item: 0.9,
    hover: 0.3,
    press: 0.15,
    anchor: 0.8,
  },
  distance: {
    hero: 50,
    section: 40,
    item: 24,
    hover: 6,
  },
  stagger: {
    tight: 0.06,
    base: 0.08,
    relaxed: 0.12,
  },
  scrub: {
    soft: 0.6,
    base: 1.0,
    slow: 1.4,
  },
}

export const INTERACTIVE_SELECTOR = '[data-motion]'
