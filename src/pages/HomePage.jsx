import { Suspense, lazy, memo } from 'react'
import PageTransition from '../components/PageTransition.jsx'
import LoadingAnimation from '../components/LoadingAnimation.jsx'
import Hero from '../sections/Hero.jsx'

const loadFeatures = () => import('../sections/Features.jsx')
const loadSolarCalculator = () => import('../sections/SolarCalculator.jsx')
const loadFooterCta = () => import('../sections/FooterCta.jsx')

const Features = lazy(loadFeatures)
const SolarCalculator = lazy(loadSolarCalculator)
const FooterCta = lazy(loadFooterCta)

function SectionFallback({ minHeight = '60vh' }) {
  return (
    <section className="section-band section-space" style={{ minHeight }} aria-hidden="true">
      <div className="flex items-center justify-center h-full">
        <LoadingAnimation type="solar" size="medium" />
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <PageTransition>
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
    </PageTransition>
  )
}

export default memo(HomePage)
