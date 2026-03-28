import { memo } from 'react'
import CountUpMetric from '../components/CountUpMetric.jsx'
import SectionReveal from '../components/SectionReveal.jsx'
import img1 from '../assets/1.png'
import img2 from '../assets/2.png'
import img3 from '../assets/3.png'
import img4 from '../assets/4.png'
import img5 from '../assets/5.png'
import img6 from '../assets/6.png'
import img7 from '../assets/7.png'
import img8 from '../assets/8.png'
import img9 from '../assets/9.png'
import img10 from '../assets/10.png'
import {
  benefitList,
  impactStats,
  processSteps,
  solutions,
  testimonials,
  trustItems,
} from '../content/siteContent.js'

const impactCardArt = [img2, img8, img9, img10]

function Features() {
  return (
    <>
      <SectionReveal className="section-band section-band-light section-space pb-0 pt-[clamp(1rem,2.4vw,2rem)]" id="impact" variant="up">
        <div className="section-gap-art" aria-hidden="true">
          <div
            className="section-art-image section-art-fade-side absolute left-[-12%] top-[28%] h-[380px] w-[32%]"
            data-tone="ink"
            data-blend="ghost"
            style={{ backgroundImage: `url(${img2})`, '--art-opacity': 0.05 }}
          />
          <div
            className="section-art-image section-art-fade-bottom absolute right-[-10%] bottom-[-8%] h-[340px] w-[24%]"
            data-tone="ink"
            data-blend="ghost"
            style={{ backgroundImage: `url(${img10})`, '--art-opacity': 0.05 }}
          />
        </div>
        <div className="content-shell section-content">
          <div className="anchor-target paper-panel art-panel overflow-hidden px-6 py-8 md:px-8 md:py-9" id="impact-panel">
            <div className="motion-line-impact grid gap-8 border-b border-black/8 pb-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] md:items-start">
              <div>
                <span className="kicker">Impact at a glance</span>
                <h2 className="section-heading mt-5">Solar outcomes that feel measurable and dependable.</h2>
              </div>

              <div className="grid gap-4 md:gap-5">
                <p className="section-copy max-w-xl md:ml-auto md:max-w-[28rem]">
                  The page now leads with confidence-building proof points before users enter the calculator,
                  making the experience feel closer to a premium solar brand site than a raw utility tool.
                </p>
                <div className="impact-free-art">
                  <div
                    aria-hidden="true"
                    data-tone="ink"
                    data-blend="ghost"
                    className="section-art-image section-art-fade-side absolute right-[-12%] top-[-10%] h-[124%] w-[124%]"
                    style={{ backgroundImage: `url(${img8})`, '--art-opacity': 0.22 }}
                  />
                </div>
              </div>
            </div>

            <div className="stagger-grid mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {impactStats.map((item, index) => (
                <article
                  className="editorial-card art-panel hover-lift overflow-hidden p-5"
                  data-motion="card"
                  key={item.label}
                  style={{ '--stagger-delay': 120 + index * 90 }}
                >
                  <div className="section-art-shell" aria-hidden="true">
                    <div
                      className={`section-art-image ${
                        index % 2 === 0 ? 'section-art-fade-bottom' : 'section-art-fade-wide'
                      } absolute ${
                        index % 2 === 0
                          ? 'right-[-2%] bottom-[-12%] h-[150px] w-[64%]'
                          : 'left-[-8%] bottom-[-8%] h-[150px] w-[82%]'
                      }`}
                      data-tone="ink"
                      data-blend="ghost"
                      style={{
                        backgroundImage: `url(${impactCardArt[index % impactCardArt.length]})`,
                        '--art-opacity': 0.05,
                      }}
                    />
                  </div>
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

      <SectionReveal className="section-band section-space" id="solutions" variant="up">
        <div className="section-gap-art" aria-hidden="true">
          <div
            className="section-art-image section-art-fade-side absolute left-[-8%] top-[18%] h-[420px] w-[46%]"
            data-tone="ink"
            data-blend="ghost"
            style={{ backgroundImage: `url(${img3})`, '--art-opacity': 0.05 }}
          />
          <div
            className="section-art-image section-art-fade-bottom absolute right-[-8%] bottom-[-6%] h-[360px] w-[36%]"
            data-tone="ink"
            data-blend="ghost"
            style={{ backgroundImage: `url(${img5})`, '--art-opacity': 0.05 }}
          />
        </div>
        <div className="anchor-target content-shell section-content pt-4 md:pt-5" id="solutions-top">
          <div className="paper-panel art-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div className="solutions-hero-copy grid gap-5 md:pb-10">
                <span className="kicker w-fit justify-self-start">Our solar solutions</span>
                <h2 className="section-heading mt-5">Residential comfort. Commercial clarity. Backup when it matters.</h2>
                <div className="impact-free-art solutions-free-art" aria-hidden="true">
                  <div
                    data-tone="ink"
                    data-blend="ghost"
                    className="section-art-image section-art-fade-wide absolute left-[-2%] top-[10%] h-[96%] w-[72%]"
                    style={{
                      backgroundImage: `url(${img3})`,
                      '--art-opacity': 0.18,
                      backgroundPosition: 'center bottom',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:justify-self-end">
                <p className="section-copy max-w-2xl md:max-w-[28rem]">
                  Inspired by established solar solution sites, this block presents a fuller offer story:
                  rooftop systems, storage readiness, long-term support, and sector-flexible planning.
                </p>
              </div>
            </div>

            <div className="stagger-grid mt-10 grid gap-4 lg:grid-cols-4">
              {solutions.map((item, index) => (
                <article
                  className="solution-card editorial-card hover-lift flex min-h-[320px] flex-col justify-between overflow-hidden p-5"
                  data-motion="card"
                  key={item.title}
                  style={{ '--stagger-delay': 120 + index * 100, '--stagger-x': index % 2 === 0 ? '-18px' : '18px' }}
                >
                  <div className="section-art-shell" aria-hidden="true">
                    <div
                      className={`section-art-image ${
                        index % 2 === 0 ? 'section-art-fade-bottom' : 'section-art-fade-side'
                      } absolute ${
                        index % 2 === 0
                          ? 'right-[-4%] bottom-[-12%] h-[180px] w-[82%]'
                          : 'left-[-10%] bottom-[-8%] h-[200px] w-[72%]'
                      }`}
                      data-tone="ink"
                      data-blend="ghost"
                      style={{
                        backgroundImage: `url(${[img1, img5, img8, img9][index % 4]})`,
                        '--art-opacity': 0.5,
                      }}
                    />
                  </div>
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
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-space pt-0" id="process" variant="up" delay={80}>
        <div className="section-gap-art" aria-hidden="true">
        </div>
        <div className="content-shell section-content pt-4 md:pt-5">
          <div className="anchor-target paper-panel art-panel process-panel px-6 py-8 md:px-8 md:py-10" id="process-panel">
            <div
              className="process-panel-art"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${img5})`
              }}
            />
            <div className="relative z-10">
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
                    <div className="section-art-shell" aria-hidden="true">
                      <div
                        className={`section-art-image ${
                          index % 2 === 0 ? 'section-art-fade-bottom' : 'section-art-fade-side'
                        } absolute ${
                          index % 2 === 0
                            ? 'right-[-4%] bottom-[-8%] h-[160px] w-[68%]'
                            : 'left-[-8%] bottom-[-6%] h-[175px] w-[58%]'
                        }`}
                        data-tone="ink"
                        data-blend="ghost"
                        style={{
                          backgroundImage: `url(${[img2, img7, img8, img9][index % 4]})`,
                          '--art-opacity': 0.05,
                        }}
                      />
                    </div>
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
                    <span className="feature-hover-pill inline-flex w-fit rounded-full border border-black/8 bg-white/80 px-3 py-2 text-xs font-semibold text-[var(--color-muted)]">
                      {item.badge}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-space pt-0" id="benefits" variant="up">
        <div className="anchor-target content-shell section-content pt-4 md:pt-5" id="benefits-top">
          <div className="paper-panel art-panel overflow-hidden px-6 py-8 md:px-8 md:py-10">
            <div className="relative grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div className="section-art-shell pointer-events-none" aria-hidden="true">
                <div
                  className="section-art-image section-art-fade-side benefits-bg-art absolute right-[-2%] top-[10%] h-[84%] w-[50%]"
                  data-tone="ink"
                  data-blend="ghost"
                  data-fit="cover"
                  style={{ backgroundImage: `url(${img7})`, '--art-opacity': 0.14 }}
                />
              </div>
              <div>
                <span className="kicker">Why choose solar now</span>
                <h2 className="section-heading mt-5">A better energy decision for homes and growing businesses.</h2>
              </div>
              <div className="relative z-10 grid gap-4 md:justify-self-end">
                <p className="section-copy max-w-2xl md:max-w-[28rem]">
                  This benefits section brings the message closer to the reference style: roomy, structured, and
                  focused on confidence rather than sales pressure.
                </p>
              </div>
            </div>

            <div className="stagger-grid mt-10 grid gap-4 border-t border-black/8 pt-8 md:grid-cols-2 xl:grid-cols-3">
              {benefitList.map((benefit, index) => (
                <article className="art-panel overflow-hidden rounded-[1.45rem] p-1" data-motion="soft" key={benefit.title} style={{ '--stagger-delay': 90 + index * 75 }}>
                  <h3 className="font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--color-muted)]">{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section-band section-band-contrast section-space pt-0" id="trust" variant="up">
        <div className="section-gap-art" aria-hidden="true">
          <div
            className="section-art-image section-art-fade-side absolute left-[-8%] top-[10%] h-[480px] w-[42%]"
            data-tone="dark"
            style={{ backgroundImage: `url(${img3})`, '--art-opacity': 0.09 }}
          />
        </div>
        <div className="wide-shell section-content">
          <div className="dark-panel art-panel bg-[linear-gradient(180deg,rgba(37,31,25,0.98),rgba(26,21,17,0.98))] px-6 py-8 md:px-8 md:py-10">
            <div className="section-art-shell" aria-hidden="true">
              <div
                className="section-art-image section-art-fade-panel absolute right-[-2%] top-[4%] h-[62%] w-[56%]"
                data-tone="dark"
                style={{ backgroundImage: `url(${img3})`, '--art-opacity': 0.14 }}
              />
              <div
                className="section-art-image section-art-fade-wide absolute left-[2%] bottom-[-2%] h-[36%] w-[56%]"
                data-tone="dark"
                style={{ backgroundImage: `url(${img6})`, '--art-opacity': 0.1 }}
              />
            </div>
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
                  className="trust-hover-card art-panel flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.7rem] border border-black/8 bg-[#f3ebdf] p-5 text-[var(--color-ink)]"
                  data-motion="card"
                  key={item.name}
                  style={{ '--stagger-delay': 140 + index * 85, '--stagger-x': index % 2 === 0 ? '-14px' : '14px' }}
                >
                  <div className="section-art-shell" aria-hidden="true">
                    <div
                      className={`section-art-image ${
                        index % 2 === 0 ? 'section-art-fade-bottom' : 'section-art-fade-wide'
                      } absolute ${
                        index % 2 === 0
                          ? 'right-[-4%] bottom-[-14%] h-[150px] w-[72%]'
                          : 'left-[-8%] bottom-[-10%] h-[150px] w-[80%]'
                      }`}
                      data-tone="ink"
                      data-blend="ghost"
                      style={{
                        backgroundImage: `url(${[img4, img5, img9, img10][index % 4]})`,
                        '--art-opacity': 0.05,
                      }}
                    />
                  </div>
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
