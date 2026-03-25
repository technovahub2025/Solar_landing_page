import { Suspense, lazy, memo } from 'react'
import Hero from '../sections/Hero.jsx'

const loadFeatures = () => import('../sections/Features.jsx')
const loadSolarCalculator = () => import('../sections/SolarCalculator.jsx')
const loadFooterCta = () => import('../sections/FooterCta.jsx')

if (typeof window !== 'undefined' && window.location.hash) {
  loadFeatures()
  loadSolarCalculator()
  loadFooterCta()
}

const Features = lazy(loadFeatures)
const SolarCalculator = lazy(loadSolarCalculator)
const FooterCta = lazy(loadFooterCta)

function SectionFallback({ minHeight = '60vh' }) {
  return <section className="section-band section-space" style={{ minHeight }} aria-hidden="true" />
}

function HomePage() {
  return (
    <main className="w-full">
      <Hero />
      <Suspense fallback={<SectionFallback minHeight="120vh" />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="120vh" />}>
        <SolarCalculator />
      </Suspense>
      <Suspense fallback={<SectionFallback minHeight="42vh" />}>
        <FooterCta />
      </Suspense>
    </main>
  )
}

export default memo(HomePage)
