import { memo, useEffect, useRef, useState } from 'react'
import useCountUp from '../hooks/useCountUp.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

function CountUpMetric({
  value,
  label,
  text,
  visible,
  prefix = '',
  suffix = '',
  decimals = 0,
}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isReady = prefersReducedMotion || inView
  const animatedValue = useCountUp(value, visible && isReady, 1300, decimals)

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined
    }

    const node = ref.current
    if (!node) {
      return undefined
    }

    // Use IntersectionObserver with proper cleanup
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1,
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <div ref={ref}>
      <p className="mt-6 font-['Syne'] text-5xl tracking-[-0.06em] text-[var(--color-ink)]">
        {prefix}
        {animatedValue.toLocaleString('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </p>
      <h3 className="mt-4 font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">
        {label}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{text}</p>
    </div>
  )
}

export default memo(CountUpMetric)
