import { memo } from 'react'
import CountUpMetric from '../components/CountUpMetric.jsx'
import SectionReveal from '../components/SectionReveal.jsx'
import {
  benefitList,
  impactStats,
  processSteps,
  solutions,
  testimonials,
  trustItems,
} from '../content/siteContent.js'

function Features() {
  return (
    <>
      <SectionReveal className="section-band section-band-light section-space pb-0 pt-[clamp(1rem,2.4vw,2rem)]" id="impact" variant="hero">
        <div className="content-shell">
          <div className="anchor-target paper-panel overflow-hidden px-6 py-8 md:px-8" id="impact-panel">
            <div className="motion-line grid gap-8 border-b border-black/8 pb-8 md:grid-cols-[1fr_0.9fr] md:items-start">
              <div>
                <span className="kicker">Impact at a glance</span>
                <h2 className="section-heading mt-5">Solar outcomes that feel measurable and dependable.</h2>
              </div>
              <p className="section-copy max-w-xl">
                The page now leads with confidence-building proof points before users enter the calculator,
                making the experience feel closer to a premium solar brand site than a raw utility tool.
              </p>
            </div>

            <div className="stagger-grid mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {impactStats.map((item, index) => (
                <article className="editorial-card hover-lift p-5" data-motion="card" key={item.label} style={{ '--stagger-delay': 120 + index * 90 }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    0{index + 1}
                  </p>
                  <CountUpMetric visible value={item.value} suffix={item.suffix} label={item.label} text={item.text} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-space" id="solutions" variant="split-left">
        <div className="anchor-target content-shell pt-4 md:pt-5" id="solutions-top">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <span className="kicker">Our solar solutions</span>
              <h2 className="section-heading mt-5">Residential comfort. Commercial clarity. Backup when it matters.</h2>
            </div>
            <p className="section-copy max-w-2xl">
              Inspired by established solar solution sites, this block presents a fuller offer story:
              rooftop systems, storage readiness, long-term support, and sector-flexible planning.
            </p>
          </div>

          <div className="stagger-grid mt-10 grid gap-4 lg:grid-cols-4">
            {solutions.map((item, index) => (
              <article
                className="solution-card editorial-card hover-lift flex min-h-[320px] flex-col justify-between p-5"
                data-motion="card"
                key={item.title}
                style={{ '--stagger-delay': 120 + index * 100, '--stagger-x': index % 2 === 0 ? '-18px' : '18px' }}
              >
                <div>
                  <p className="solution-card-tag text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    {item.tag}
                  </p>
                  <h3 className="solution-card-title mt-5 font-['Syne'] text-3xl leading-[1.02] tracking-[-0.06em] text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="solution-card-copy mt-5 text-sm leading-7 text-[var(--color-muted)]">
                    {item.text}
                  </p>
                </div>

                <div className="stagger-grid mt-8 flex flex-wrap gap-2">
                  {item.pills.map((pill, pillIndex) => (
                    <span
                      className="solution-card-pill rounded-full border border-black/8 bg-white/70 px-3 py-2 text-xs font-semibold text-[var(--color-muted)]"
                      data-motion="pill"
                      key={pill}
                      style={{ '--stagger-delay': 280 + pillIndex * 70, '--stagger-scale': 0.96 }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-space pt-0" id="process" variant="split-right" delay={80}>
        <div className="content-shell pt-4 md:pt-5">
          <div className="anchor-target paper-panel px-6 py-8 md:px-8 md:py-10" id="process-panel">
            <div className="motion-line grid gap-8 border-b border-black/8 pb-8 md:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.7fr)] md:items-start">
              <div>
                <span className="kicker">How the journey works</span>
                <h2 className="section-heading process-heading mt-5">Simple process. Strong performance.</h2>
              </div>
              <div className="min-w-0 md:max-w-[38rem] md:justify-self-end">
                <p className="section-copy">
                  The flow stays clean and minimal: discover the need, shape the system, validate the result,
                  and prepare the quote.
                </p>
                <p className="mt-5 text-sm font-semibold tracking-[0.02em] text-[var(--color-ink)]">
                  Keep scrolling to explore the full landing experience.
                </p>
              </div>
            </div>

            <div className="process-card-grid stagger-grid mt-8 grid gap-4 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <article
                  className="feature-hover-card editorial-card hover-lift flex min-h-[250px] flex-col justify-between p-6"
                  data-motion="card"
                  key={item.title}
                  style={{ '--stagger-delay': 110 + index * 95, '--stagger-x': index % 2 === 0 ? '-20px' : '20px' }}
                >
                  <div>
                    <p className="feature-hover-eyebrow text-sm font-semibold text-[var(--color-accent)]">
                      {item.step}
                    </p>
                    <h3 className="feature-hover-title mt-4 font-['Syne'] text-3xl tracking-[-0.06em] text-[var(--color-ink)]">
                      {item.title}
                    </h3>
                    <p className="feature-hover-copy mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {item.text}
                    </p>
                  </div>
                  <span
                    className="feature-hover-pill inline-flex w-fit rounded-full border border-black/8 bg-white/80 px-3 py-2 text-xs font-semibold text-[var(--color-muted)]"
                  >
                    {item.badge}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-space pt-0" id="benefits" variant="soft">
        <div className="anchor-target content-shell pt-4 md:pt-5" id="benefits-top">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <div>
              <span className="kicker">Why choose solar now</span>
              <h2 className="section-heading mt-5">A better energy decision for homes and growing businesses.</h2>
            </div>
            <p className="section-copy max-w-2xl">
              This benefits section brings the message closer to the reference style: roomy, structured, and
              focused on confidence rather than sales pressure.
            </p>
          </div>

          <div className="stagger-grid mt-10 grid gap-4 border-t border-black/8 pt-8 md:grid-cols-2 xl:grid-cols-3">
            {benefitList.map((benefit, index) => (
              <article className="p-1" data-motion="soft" key={benefit.title} style={{ '--stagger-delay': 90 + index * 75 }}>
                <h3 className="font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">
                  {benefit.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--color-muted)]">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-band-contrast section-space pt-0" id="trust" variant="scale">
        <div className="wide-shell">
          <div className="dark-panel bg-[linear-gradient(180deg,rgba(37,31,25,0.98),rgba(26,21,17,0.98))] px-6 py-8 md:px-8 md:py-10">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <h2 className="section-heading max-w-[10ch] text-white">Trusted for quality, support, and clarity.</h2>
              <div className="grid gap-4">
                <div className="stagger-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {trustItems.map((item, index) => (
                    <div
                      className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-4 text-center text-sm font-semibold tracking-[0.02em] text-white/80"
                      data-motion="soft"
                      key={item}
                      style={{ '--stagger-delay': 100 + index * 70 }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <p className="max-w-xl text-sm leading-7 text-white/68">
                  Instead of borrowing real brand marks, this redesign uses neutral trust markers and fresh
                  customer feedback to preserve the premium feel without copying protected assets.
                </p>
              </div>
            </div>

            <div className="stagger-grid mt-10 grid gap-4 lg:grid-cols-4">
              {testimonials.map((item, index) => (
                <article
                  className="trust-hover-card flex min-h-[260px] flex-col justify-between rounded-[1.7rem] border border-black/8 bg-[#f3ebdf] p-5 text-[var(--color-ink)]"
                  data-motion="card"
                  key={item.name}
                  style={{ '--stagger-delay': 140 + index * 85, '--stagger-x': index % 2 === 0 ? '-14px' : '14px' }}
                >
                  <div>
                    <span className="trust-hover-quote text-4xl font-black text-[var(--color-ink)]/80">
                      "
                    </span>
                    <p className="trust-hover-copy mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {item.quote}
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="trust-hover-name font-semibold text-[var(--color-ink)]">{item.name}</p>
                    <p className="trust-hover-role text-xs text-[var(--color-muted)]">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>
    </>
  )
}

export default memo(Features)
