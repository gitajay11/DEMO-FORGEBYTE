import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies, services } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { Reveal, Words } from '@/components/motion/Text';
import { LazyWorld as WorldCanvas } from '@/components/lazy';
import { Approach, DepthTracker } from '@/components/work/Approach';

// Only the case studies we know about; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — case study`,
    description: `${cs.oneLiner} ${cs.problem}`.slice(0, 158),
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: { title: `${cs.title} — Forgebyte case study`, description: cs.oneLiner, url: `${SITE_URL}/work/${cs.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = caseStudies.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const cs = caseStudies[i];
  const next = caseStudies[(i + 1) % caseStudies.length];
  const serviceNames = cs.services.map((s) => services.find((x) => x.slug === s)?.name).filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: cs.title,
    about: cs.oneLiner,
    url: `${SITE_URL}/work/${cs.slug}`,
    creator: { '@type': 'Organization', name: 'Forgebyte', url: SITE_URL },
    keywords: cs.stack.join(', '),
    image: `${SITE_URL}${cs.image}`,
  };

  const meta: [string, string][] = [
    ['Client', cs.client],
    ['Industry', cs.industry],
    ['Year', cs.year],
    ['Role', cs.role],
    ['Status', cs.status],
    ['Stack', cs.stack.slice(0, 3).join(', ') + (cs.stack.length > 3 ? ' +' + (cs.stack.length - 3) : '')],
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DepthTracker slug={cs.slug} />

      {/* 1. Hero */}
      <header className="cs-hero">
        <div className="world"><WorldCanvas kind={cs.world} tint={cs.tint} /></div>
        <div className="container">
          <Link href="/work" className="ulink mono back">← All work</Link>
          <h1 className="display-xl"><Words text={cs.title} /></h1>
          <p className="one">{cs.oneLiner}</p>
          <dl className="metabar">
            {meta.map(([k, v]) => (
              <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container">
        {/* 2. Problem */}
        <section className="cs-block" aria-labelledby="problem">
          <h2 className="mono" id="problem">[01] — The problem</h2>
          <div className="content"><Reveal as="p" variant="perspective" className="lead">{cs.problem}</Reveal></div>
        </section>

        {/* 3. Questions — the signature section */}
        <section className="cs-block" aria-labelledby="questions">
          <h2 className="mono" id="questions">[02] — The questions we asked</h2>
          <div className="content">
            <ol className="questions">
              {cs.questions.map((q, n) => (
                <Reveal as="li" variant="clip-up" key={q}><span className="mono">Q{n + 1}</span><span>{q}</span></Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Approach */}
        <section className="cs-block" aria-labelledby="approach">
          <h2 className="mono" id="approach">[03] — The approach</h2>
          <div className="content"><Approach items={cs.approach} /></div>
        </section>

        {/* 5. Build */}
        <section className="cs-block" aria-labelledby="build">
          <h2 className="mono" id="build">[04] — The build</h2>
          <div className="content">
            <ul className="build-list">{cs.build.map((b) => <li key={b}>{b}</li>)}</ul>
            <p className="mono" style={{ marginTop: 'var(--s-5)' }}>Stack — {cs.stack.join(' · ')}</p>
          </div>
          <Reveal variant="mask" className="build-shot">
            <Image src={cs.image} alt={cs.imageAlt} width={1000} height={625} sizes="(max-width: 1440px) 92vw, 1312px" />
          </Reveal>
        </section>

        {/* 6. Outcome */}
        <section className="cs-block" aria-labelledby="outcome">
          <h2 className="mono" id="outcome">[05] — The outcome</h2>
          <div className="content">
            <span className="tag outcome-label">Qualitative · no metrics recorded</span>
            <Reveal as="p" variant="blur" className="lead">{cs.outcome}</Reveal>
            <p style={{ marginTop: 'var(--s-6)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <a href={cs.url} target="_blank" rel="noopener" className="ulink">Visit {cs.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗</a>
              <Link href="/contact" className="ulink" data-track={`cta_click:case-${cs.slug}`}>Start a similar project →</Link>
            </p>
            {serviceNames.length > 0 && <p className="mono" style={{ marginTop: 'var(--s-5)' }}>Services — {serviceNames.join(' · ')}</p>}
          </div>
        </section>
        {/* 7. Client voice: shown only when a real, consented testimonial exists. None yet. */}
      </div>

      {/* 8. Next case study */}
      <Link href={`/work/${next.slug}`} className="next-cs" data-cursor="view">
        <div className="world"><WorldCanvas kind={next.world} tint={next.tint} /></div>
        <div className="container">
          <p className="mono" style={{ marginBottom: 'var(--s-4)' }}>Next case study</p>
          <p className="display-l">{next.title} →</p>
          <p className="body" style={{ marginTop: 'var(--s-4)' }}>{next.oneLiner}</p>
        </div>
      </Link>
    </article>
  );
}
