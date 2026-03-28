import { memo } from 'react'
import img10 from '../assets/10.png'
import img9 from '../assets/9.png'
import { RippleButton } from '../components/MicroInteractions.jsx'
import SectionReveal from '../components/SectionReveal.jsx'

function FooterCta() {
  return (
    <SectionReveal className="section-band section-space mt-0 pt-0" id="contact" variant="up" delay={80}>
      <div className="wide-shell section-content">
        <div className="anchor-target paper-panel art-panel relative overflow-hidden px-6 py-6 md:px-8 md:py-8" id="contact-panel">
          <div className="relative z-10">
            <div className="motion-line grid gap-6 border-b border-black/8 pb-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
              <div className="max-w-4xl">
                <span className="kicker">Ready to move forward</span>
                <h2 className="mt-5 font-['Syne'] text-[clamp(2.8rem,5vw,5rem)] leading-[0.94] tracking-[-0.07em] text-[var(--color-ink)]">
                  Plan a cleaner, more resilient energy future.
                </h2>
              </div>

              <div className="space-y-4 lg:pt-1">
                <p className="section-copy max-w-2xl">
                  Use the solar calculator above to size your system, capture your details, and create a polished
                  proposal for your home, office, or commercial site.
                </p>
                <div className="stagger-grid flex flex-wrap gap-2 text-xs font-semibold">
                  {['Fast consultation response', 'Proposal-ready outputs', 'Residential and commercial support'].map((item, index) => (
                    <span
                      className="rounded-full border border-black/8 bg-white/76 px-3 py-2 text-[var(--color-muted)]"
                      key={item}
                      style={{ '--stagger-delay': 90 + index * 70 }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-cards-stage mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
              <div
                className="contact-cards-bg"
                aria-hidden="true"
                style={{ backgroundImage: `url(${img10})` }}
              />
              <div
                className="contact-cards-bg contact-cards-bg-left"
                aria-hidden="true"
                style={{ backgroundImage: `url(${img9})` }}
              />
              <div className="relative z-10">
                <div className="stagger-grid flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <RippleButton
                    as="a"
                    className="primary-button"
                    data-magnetic="true"
                    data-motion="button"
                    href="#calculator-panel"
                  >
                    Build My Solar Plan
                  </RippleButton>
                  <a className="outline-button" data-motion="button" href="#quote-panel">
                    Review Quote Section
                  </a>
                </div>

                <div className="stagger-grid mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-black/8 bg-white/72 px-5 py-5" data-motion="soft" style={{ '--stagger-delay': 120 }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Call
                    </p>
                    <p className="mt-3 font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">+91 98765 43210</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-black/8 bg-white/72 px-5 py-5" data-motion="soft" style={{ '--stagger-delay': 200 }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Email
                    </p>
                    <p className="mt-3 break-all font-semibold text-[var(--color-ink)]">hello@sunridgesolar.in</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-black/8 bg-white/72 px-5 py-5" data-motion="soft" style={{ '--stagger-delay': 280 }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      Coverage
                    </p>
                    <p className="mt-3 font-semibold text-[var(--color-ink)]">Consultations across India</p>
                  </div>
                </div>

              </div>

              <div className="relative z-10 rounded-[1.9rem] border border-[rgba(200,154,75,0.2)] bg-[linear-gradient(180deg,#fffaf1,#f4ead9)] p-6 shadow-[0_22px_45px_rgba(37,27,17,0.08)]" data-magnetic="true" data-motion="card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Best for
                </p>
                <h3 className="mt-4 font-['Syne'] text-3xl tracking-[-0.06em] text-[var(--color-ink)]">
                  Homes, offices, and growing commercial sites
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Share energy usage, backup needs, and roof availability to move from rough interest to a confident next step.
                </p>
                <div className="mt-6 border-t border-black/8 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Next step
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
                    Start with the calculator, prepare the quote, then download a clean proposal to review or share.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

export default memo(FooterCta)
