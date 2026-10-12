import type { Metadata } from 'next';
import Image from 'next/image';
import { lab } from '@/lib/content';
import { Reveal, Words } from '@/components/motion/Text';
import { LazyWorld as WorldCanvas } from '@/components/lazy';
import OpenChat from '@/components/lab/OpenChat';

export const metadata: Metadata = {
  title: 'Lab',
  description: 'Demos, concept sites and experiments from Forgebyte — clearly labelled, and kept separate from client work.',
  alternates: { canonical: '/lab' },
};

export default function LabPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="mono" style={{ marginBottom: 'var(--s-5)' }}>[07] — Lab</p>
        <h1 className="display-xl"><Words text="Lab" /></h1>
        <p className="lede">
          Concept builds and experiments. None of these are client projects — they are where we try things before
          a client pays for them.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: 'var(--s-10)' }} aria-label="Experiments">
        {lab.map((l) => (
          <article className="cs-block" key={l.slug} aria-labelledby={`lab-${l.slug}`}>
            <p className="mono">{l.kind}</p>
            <div className="content">
              <h2 className="display-l" id={`lab-${l.slug}`} style={{ marginBottom: 'var(--s-5)' }}>{l.title}</h2>
              <p className="body" style={{ marginBottom: 'var(--s-5)' }}>{l.body}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--s-6)' }}>
                {l.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
              </div>
              <div className="tile-world" style={{ position: 'relative', aspectRatio: '16 / 9', border: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden', marginBottom: 'var(--s-5)' }}>
                <WorldCanvas kind={l.world} tint={l.tint} />
                {l.image && (
                  <Reveal variant="mask" className="shot" style={{ position: 'absolute', right: '5%', bottom: '-8%', width: '60%', aspectRatio: '16 / 10', border: '1px solid var(--border-strong)', overflow: 'hidden' }}>
                    <Image src={l.image} alt={l.imageAlt} width={1000} height={625} sizes="(max-width: 1023px) 60vw, 520px" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </Reveal>
                )}
              </div>
              {l.url.startsWith('#') ? (
                <OpenChat>Try it — open the chat →</OpenChat>
              ) : (
                <a href={l.url} target="_blank" rel="noopener" className="ulink">Open the demo ↗</a>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
