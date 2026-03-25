import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.config({
  autoSleep: 60,
  force3D: false,
  nullTargetWarn: false,
})
ScrollTrigger.config({
  ignoreMobileResize: true,
  limitCallbacks: true,
})

export { gsap, ScrollTrigger }
