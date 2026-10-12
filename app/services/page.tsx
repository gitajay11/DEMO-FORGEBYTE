import type { Metadata } from 'next';
import Link from 'next/link';
import { caseStudies, engagements, process, services } from '@/lib/content';
import { Reveal, Words } from '@/components/motion/Text';
import Glyph from '@/components/home/Glyph';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web applications, APIs and backend systems, MVP sprints, AI features in products and ongoing support — from a small studio in Chennai working with founders and small businesses worldwide.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="mono" style={{ marginBottom: 'var(--s-5)' }}>[02] — Services</p>
        <h1 className="display-xl"><Words text="What we take on" /></h1>
        <p className="lede">
          Five kinds of work. Each one lists what you get, how long it usually takes, and when we are the wrong choice.
        </p>
        <nav aria-label="Services on this page" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', marginTop: 'var(--s-7)' }}>
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="ulink"><span className="mono">[{s.index}]</span> {s.name}</a>
          ))}
        </nav>
      </section>

      <div className="container svc-page">
        {services.map((s) => {
          const examples = caseStudies.filter((c) => c.services.includes(s.slug));
          return (
            <section className="service" id={s.slug} key={s.slug} aria-labelledby={`${s.slug}-h`}>
              <div className="side">
                <Glyph kind={s.glyph} className="glyph-lg" />
                <p className="mono" style={{ marginTop: 'var(--s-4)' }}>[{s.index}] — {s.duration}</p>
              </div>
              <div className="main">
                <h2 className="display-l" id={`${s.slug}-h`}>{s.name}</h2>
                <Reveal as="p" variant="blur" className="promise">{s.promise}</Reveal>
                <p className="problem">{s.problem}</p>
                <dl>
                  <dt className="mono">Deliverables</dt>
                  <dd><ul>{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul></dd>
                  <dt className="mono">How it runs</dt>
                  <dd>{process.map((p) => p.name).join(' → ')}</dd>
                  <dt className="mono">Typical length</dt>
                  <dd className="mono-plain">{s.duration}</dd>
                </dl>
                <div className="fit">
                  <div className="yes"><span className="mono">A good fit if</span><p>{s.fitIf}</p></div>
                  <div><span className="mono">Not a fit if</span><p>{s.notFitIf}</p></div>
                </div>
                {examples.length > 0 && (
                  <div className="examples">
                    <span className="mono">Examples —</span>
                    {examples.map((e) => <Link key={e.slug} href={`/work/${e.slug}`} className="ulink">{e.title}</Link>)}
                  </div>
                )}
                <Link href="/contact" className="btn btn-ghost" data-track={`cta_click:service-${s.slug}`}>
                  Talk about {s.short.toLowerCase()} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </section>
          );
        })}

        <section className="section" aria-labelledby="engage-h" style={{ borderTop: '1px solid var(--border)' }}>
          <h2 id="engage-h" className="display-l" style={{ marginBottom: 'var(--s-7)' }}>Engagement models</h2>
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
        </section>
      </div>
    </>
  );
}
