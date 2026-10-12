import Image from 'next/image';
import Link from 'next/link';
import { caseStudies, engagements, faq, lab, process, services, studio } from '@/lib/content';
import { CONTACT_EMAIL, CONTACT_PHONE_E164, SITE_URL, WHATSAPP_URL } from '@/lib/site';
import { Index, Reveal, Words } from '@/components/motion/Text';
import HeroStage from '@/components/home/HeroStage';
import IdeaField from '@/components/home/IdeaField';
import Glyph from '@/components/home/Glyph';
import { LazyConstellation as Constellation, LazyPortrait as Portrait, LazyProcessPin as ProcessPin, LazyWorkTrack as WorkTrack, LazyWorld as WorldCanvas } from '@/components/lazy';
import ContactForm from '@/components/contact/ContactForm';
import CopyEmail from '@/components/contact/CopyEmail';
import HeroPoster from '@/components/home/HeroPoster';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#studio`,
      name: studio.name,
      url: SITE_URL,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE_E164,
      description: 'An independent studio building web applications, APIs, MVPs and AI features for founders, early-stage startups and small businesses.',
      areaServed: 'Worldwide',
      address: { '@type': 'PostalAddress', addressLocality: studio.city, addressCountry: 'IN' },
      founder: { '@id': `${SITE_URL}/#founder` },
      knowsAbout: services.map((s) => s.name),
      sameAs: [studio.github, studio.linkedin],
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#founder`,
      name: studio.founder,
      jobTitle: 'Founder & developer',
      worksFor: { '@id': `${SITE_URL}/#studio` },
      sameAs: [studio.github, studio.linkedin],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* [00] HERO -------------------------------------------------------- */}
      <section className="hero" data-stage="pending" aria-labelledby="hero-title">
        <HeroPoster />
        <div className="hero-scene" aria-hidden="true" />
        <p className="sr-only">
          Visual: a slowly turning sculpture of particles and orbital rings. Scattered points — client ideas,
          constraints and data — converge on one working form.
        </p>
        <div className="hero-scrim" aria-hidden="true" />

        <p className="hero-corner tl mono hero-meta">{studio.name} — Est. {studio.est}</p>
        <p className="hero-corner tr mono hero-meta">
          {studio.city} · {studio.tzLabel}
          <br />
          {studio.coords}
        </p>
        <a className="hero-corner br mono hero-meta scroll-cue" href="#positioning">Scroll ↓</a>

        <div className="container">
          <p className="mono live hero-meta" style={{ marginBottom: 'var(--s-5)' }}>
            Accepting projects · {studio.availability}
          </p>
          <h1 id="hero-title" className="display-xl">
            <span className="line l1"><span>We build</span></span>
            <span className="line l2"><span className="outline">things.</span></span>
            <span className="line l3"><span>We question</span></span>
            <span className="line l4"><span>things.</span></span>
          </h1>
          <div className="hero-foot">
            <p className="hero-sub hero-meta">
              A small studio building software, AI features and interfaces for {studio.idealClients}.
            </p>
            <div className="hero-ctas hero-meta">
              <Link href="/contact" className="btn btn-primary" data-magnetic data-track="cta_click:hero">
                Start a project <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <a href="#work" className="ulink">See the work ↓</a>
            </div>
          </div>
        </div>
        <HeroStage />
      </section>

      {/* [01] POSITIONING ------------------------------------------------- */}
      <section className="section manifesto" id="positioning" aria-labelledby="positioning-title">
        <div className="container">
          <Index n="01" label="Studio" />
          <div className="grid">
            <h2 id="positioning-title" className="display-l manifesto-head">
              <Words text="Curiosity is a feature." />{' '}
              <Words text="Free will is the runtime." className="dim" />
            </h2>
            <div className="manifesto-body">
              <Reveal as="p" variant="blur">
                We&apos;re <strong>{studio.name}</strong>, a small studio led by <strong>{studio.founder}</strong>. We design and
                build software, AI features and interfaces that make sense beyond the code editor.
              </Reveal>
              <Reveal as="p" variant="blur">Some studios see a brief and start coding. We ask a few more questions first.</Reveal>
              <Reveal as="p" variant="blur">
                Occasionally those questions change the product. Occasionally they just save you three months. Both
                outcomes are useful.
              </Reveal>
            </div>
            <IdeaField />
          </div>
        </div>
      </section>

      {/* [02] SERVICES ---------------------------------------------------- */}
      <section className="section" id="services" aria-labelledby="services-title">
        <div className="container">
          <Index n="02" label="Services" />
          <div className="grid" style={{ marginBottom: 'var(--s-8)' }}>
            <h2 id="services-title" className="display-l" style={{ gridColumn: '1 / span 8' }}>
              <Words text="Mostly software. Occasionally, better questions." />
            </h2>
            <Reveal as="p" variant="blur" className="body-l" style={{ gridColumn: '1 / span 6', marginTop: 'var(--s-5)' }}>
              Always, a working product. Here is what we take on, and when we are the wrong choice.
            </Reveal>
          </div>
          <div className="services-layout">
            <Constellation items={services.map(({ slug, name, glyph, index }) => ({ slug, name, glyph, index }))} />
            <div className="service-list">
              {services.map((s) => (
                <article className="service" id={s.slug} key={s.slug} aria-labelledby={`${s.slug}-title`}>
                  <div className="service-head">
                    <Glyph kind={s.glyph} className="glyph" />
                    <span className="mono">[{s.index}]</span>
                    <h3 className="h3" id={`${s.slug}-title`}>{s.name}</h3>
                  </div>
                  <p className="promise">{s.promise}</p>
                  <p className="problem">{s.problem}</p>
                  <dl>
                    <dt className="mono">Deliverables</dt>
                    <dd><ul>{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul></dd>
                    <dt className="mono">Duration</dt>
                    <dd className="mono-plain">{s.duration}</dd>
                  </dl>
                  <div className="fit">
                    <div className="yes"><span className="mono">A good fit if</span><p>{s.fitIf}</p></div>
                    <div><span className="mono">Not a fit if</span><p>{s.notFitIf}</p></div>
                  </div>
                  <Link href={`/services#${s.slug}`} className="ulink">More on this service →</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* [03] WORK -------------------------------------------------------- */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="container">
          <Index n="03" label="Selected work" />
          <div className="work-head">
            <h2 id="work-title" className="display-l"><Words text="Built, shipped, or nearly there." /></h2>
            <Link href="/work" className="ulink">All work →</Link>
          </div>
        </div>
        <div className="work-track-wrap">
          <div className="container" style={{ overflow: 'visible' }}>
            <div className="work-track">
              {caseStudies.map((cs, i) => (
                <article className="chapter" key={cs.slug} aria-labelledby={`ch-${cs.slug}`}>
                  <Link href={`/work/${cs.slug}`} className="chapter-world" data-cursor="view" aria-label={`${cs.title} — read the case study`} tabIndex={-1}>
                    <WorldCanvas kind={cs.world} tint={cs.tint} />
                    <span className="mono world-label">[0{i + 1}] {cs.world}</span>
                    <Reveal variant="mask" className="shot">
                      <Image src={cs.image} alt="" width={1000} height={625} sizes="(max-width: 1023px) 58vw, 640px" />
                    </Reveal>
                  </Link>
                  <div className="chapter-body">
                    <div className="meta-row">
                      <span className="mono">{cs.client}</span>
                      <span className="mono">{cs.year}</span>
                      <span className="status" data-status={cs.status}>{cs.status}</span>
                    </div>
                    <h3 className="h3" id={`ch-${cs.slug}`}>{cs.title}</h3>
                    <div className="pair"><span className="mono">Problem</span><p>{cs.problem}</p></div>
                    <div className="pair"><span className="mono">Outcome</span><p>{cs.outcome}</p></div>
                    <Link href={`/work/${cs.slug}`} className="ulink" data-cursor="view">Read the case study →</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <WorkTrack />
        </div>
      </section>

      {/* [04] PROCESS ----------------------------------------------------- */}
      <section className="section" id="process" aria-labelledby="process-title">
        <div className="container">
          <Index n="04" label="Process" />
          <div className="process-wrap">
            <div className="process-intro">
              <h2 id="process-title" className="display-l"><Words text="How a project runs" /></h2>
              <p>Five stages. Each one ends with something you can hold, not just a status update.</p>
            </div>
            <div className="process-steps">
              <span className="process-line" aria-hidden="true"><i /></span>
              <ol>
              {process.map((p, i) => (
                <li className="step" key={p.name}>
                  <h3 className="h3"><span className="mono">0{i + 1}</span>{p.name}</h3>
                  <p>{p.what}</p>
                  <div className="receive">
                    <span className="mono">You get — <span style={{ color: 'var(--text-1)' }}>{p.receive}</span></span>
                    <span className="mono">Takes — <span style={{ color: 'var(--text-1)' }}>{p.time}</span></span>
                  </div>
                </li>
              ))}
              </ol>
            </div>
          </div>
          <Reveal as="p" variant="perspective" className="process-end">
            You&apos;ll always know what&apos;s being built, why, and what it costs.
          </Reveal>
        </div>
        <ProcessPin />
      </section>

      {/* [05] PROOF ------------------------------------------------------- */}
      <section className="section" id="proof" aria-labelledby="proof-title">
        <div className="container">
          <Index n="05" label="Proof" />
          <div className="proof-grid">
            <div className="proof-head">
              <h2 id="proof-title" className="display-l"><Words text="No testimonials yet. Here is the thinking instead." /></h2>
              <Reveal as="p" variant="blur" className="body" style={{ marginTop: 'var(--s-5)' }}>
                We would rather show how we approach a problem than quote people out of context. Below is how a
                typical brief gets taken apart before any code.
              </Reveal>
            </div>
            <div className="teardown">
              <p className="mono" style={{ marginBottom: 12 }}>Example brief</p>
              <p className="brief">“We need an app for appointments.”</p>
              <ol>
                <li><p><strong>Who actually books?</strong>Patients, the front desk, or both — they need different screens.</p></li>
                <li><p><strong>What breaks today?</strong>Double bookings, no-shows or phone queues each lead to a different product.</p></li>
                <li><p><strong>Does it need to be an app?</strong>A link that opens in WhatsApp may get more bookings than a download.</p></li>
                <li><p><strong>What must be true every morning?</strong>The day&apos;s list, correct, on the device the clinic already uses.</p></li>
              </ol>
            </div>
            <div className="verifiable">
              {caseStudies.map((cs) => (
                <a key={cs.slug} href={cs.url} target="_blank" rel="noopener">
                  <span className="mono">{cs.status}</span>
                  <span className="ulink">{cs.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* [06] FOUNDER ----------------------------------------------------- */}
      <section className="section" id="founder" aria-labelledby="founder-title">
        <div className="container">
          <Index n="06" label="Who you work with" />
          <div className="founder">
            <div className="portrait">
              <Portrait initials="AK" />
              <span className="mono">{studio.founder} · Founder</span>
            </div>
            <div className="founder-body">
              <h2 id="founder-title" className="display-l" style={{ marginBottom: 'var(--s-6)' }}>
                <Words text={`You work with ${studio.founderFirst}.`} />
              </h2>
              <p>
                {studio.founder} leads every project at {studio.name}, from the first call to the handover. No account
                managers, no hand-offs to someone you have not met.
              </p>
              <p>
                {studio.founderFirst} cares about the parts users never see: the query that stays fast, the deploy that does not wake anyone
                up, the error message that actually helps. Comfortable across the stack, from React and TypeScript to Node
                and Postgres.
              </p>
              <div className="interests">
                {['Product thinking', 'UX', 'AI in products', 'Backend systems', 'Performance'].map((x) => (
                  <span className="tag" key={x}>{x}</span>
                ))}
              </div>
              <p className="quirk">Fill your coffee cup before booking a call with us.</p>
              <Link href="/studio" className="ulink">More about the studio →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* [07] LAB --------------------------------------------------------- */}
      <section className="section" id="lab" aria-labelledby="lab-title">
        <div className="container">
          <Index n="07" label="Lab" />
          <div className="work-head">
            <h2 id="lab-title" className="display-l"><Words text="Experiments and demos" /></h2>
            <Link href="/lab" className="ulink">Open the lab →</Link>
          </div>
          <div className="lab-strip">
            {lab.map((l) => (
              <article className="lab-tile" key={l.slug}>
                <div className="tile-world">
                  <WorldCanvas kind={l.world} tint={l.tint} />
                  <span className="mono">{l.kind}</span>
                </div>
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* [08] ENGAGEMENT -------------------------------------------------- */}
      <section className="section" id="engage" aria-labelledby="engage-title">
        <div className="container">
          <Index n="08" label="Engagement" />
          <h2 id="engage-title" className="display-l" style={{ marginBottom: 'var(--s-7)' }}>
            <Words text="Ways to work together" />
          </h2>
          <div className="engage">
            {engagements.map((e) => (
              <div className="engage-row" key={e.name}>
                <h3>{e.name}</h3>
                <p>{e.includes}</p>
                <span className="mono-plain dur">{e.duration}</span>
                <span className="mono-plain price">{e.price}</span>
              </div>
            ))}
          </div>
          <p className="engage-note">
            Every build is quoted individually and in writing. Payment terms are set in the scope. We work on IST, which
            overlaps with UK and European mornings and US evenings.
          </p>
        </div>
      </section>

      {/* [09] FAQ --------------------------------------------------------- */}
      <section className="section" id="faq" aria-labelledby="faq-title">
        <div className="container">
          <Index n="09" label="FAQ" />
          <div className="grid">
            <h2 id="faq-title" className="display-l faq-head"><Words text="Fair questions" /></h2>
            <div className="faq">
              {faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}<span className="plus" aria-hidden="true" /></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* [10] CONTACT ----------------------------------------------------- */}
      <section className="section contact" id="contact" aria-labelledby="contact-title">
        <span className="contact-light" aria-hidden="true" />
        <div className="container">
          <h2 id="contact-title" className="display-l contact-head"><Words text="Got a problem worth thinking about?" /></h2>
          <p className="contact-sub">Tell us what you are trying to fix. We reply within {studio.replyWithin}.</p>
          <div className="contact-grid">
            <ContactForm source="home" />
            <aside className="alt" aria-label="Other ways to reach us">
              <div className="alt-item">
                <span className="mono">Book a call</span>
                <a className="ulink" href={WHATSAPP_URL} target="_blank" rel="noopener" data-track="booking_click:home-whatsapp">
                  Message on WhatsApp ↗
                </a>
                <p>We&apos;ll find a time that works in your time zone.</p>
              </div>
              <div className="alt-item">
                <span className="mono">Email directly</span>
                <CopyEmail email={CONTACT_EMAIL} />
              </div>
              <div className="alt-item">
                <span className="mono">Elsewhere</span>
                <div style={{ display: 'flex', gap: 20 }}>
                  <a className="ulink" href={studio.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
                  <a className="ulink" href={studio.github} target="_blank" rel="noopener">GitHub ↗</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
