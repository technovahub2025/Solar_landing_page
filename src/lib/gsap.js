import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
})

// Performance-optimized ScrollTrigger config
ScrollTrigger.config({
  ignoreMobileResize: true,
  limitCallbacks: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
})

export { gsap, ScrollTrigger }
