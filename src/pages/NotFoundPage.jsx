import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useGsapInteractiveMotion from '../hooks/useGsapInteractiveMotion.js'
import useGsapReveal from '../hooks/useGsapReveal.js'

function NotFoundPage() {
  const ref = useRef(null)
  useGsapReveal(ref, { variant: 'up' })
  useGsapInteractiveMotion(ref)

  return (
    <main className="section-space" ref={ref}>
      <div className="section-shell">
        <div className="paper-panel mx-auto max-w-3xl px-6 py-14 text-center md:px-10">
          <span className="kicker">Page not found</span>
          <h1 className="mt-6 text-[clamp(2.8rem,6vw,5rem)] text-[var(--color-ink)]">This route does not exist.</h1>
          <p className="section-copy mx-auto mt-5 max-w-xl">
            The landing page is still available on the main route. Head back there to continue exploring
            the solar experience.
          </p>
          <div className="mt-8 flex justify-center">
            <Link className="primary-button" data-motion="button" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFoundPage
