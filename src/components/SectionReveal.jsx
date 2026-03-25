import { memo, useRef } from 'react'
import useGsapReveal from '../hooks/useGsapReveal.js'
import useGsapInteractiveMotion from '../hooks/useGsapInteractiveMotion.js'

function SectionReveal({
  className = '',
  children,
  variant = 'up',
  delay = 0,
  interactive = true,
  ...props
}) {
  const ref = useRef(null)
  useGsapReveal(ref, { variant, delay })
  useGsapInteractiveMotion(ref, { selector: interactive ? '[data-motion]' : '[data-motion="never-match"]' })

  return (
    <section
      ref={ref}
      className={`reveal-section ${className}`.trim()}
      data-variant={variant}
      style={{ '--section-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </section>
  )
}

export default memo(SectionReveal)
