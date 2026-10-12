import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { caseStudies, services } from '@/lib/content';
import { Words } from '@/components/motion/Text';
import WorkIndex from '@/components/work/WorkIndex';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Case studies from Forgebyte: Loopa, Nutriyah, Sri Cauvery Electronics and Élaré Beauty — the problem, the questions we asked, and what got built.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="mono" style={{ marginBottom: 'var(--s-5)' }}>[03] — Work</p>
        <h1 className="display-xl"><Words text="Work" /></h1>
        <p className="lede">
          Client projects, live, in testing or in progress — each labelled honestly. Demos and experiments live in the{' '}
          <Link href="/lab" className="ulink">Lab</Link>.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: 'var(--s-10)' }} aria-label="All case studies">
        {/* useSearchParams needs a Suspense boundary in a static page */}
        <Suspense fallback={null}>
          <WorkIndex items={caseStudies} services={services.map(({ slug, name }) => ({ slug, name }))} />
        </Suspense>
      </section>
    </>
  );
}
