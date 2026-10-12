import type { Metadata } from 'next';
import Link from 'next/link';
import { caseStudies, lab, studio } from '@/lib/content';
import { Reveal, Words } from '@/components/motion/Text';
import { LazyPortrait as Portrait } from '@/components/lazy';
import ToolsMap from '@/components/studio/ToolsMap';

export const metadata: Metadata = {
  title: 'Studio',
  description: `${studio.name} is an independent studio in ${studio.city}, led by ${studio.founder}. How we work, what we believe, and the tools we use.`,
  alternates: { canonical: '/studio' },
};

const PRINCIPLES = [
  { t: 'Ask why before how.', b: 'The cheapest bug is the feature we talked you out of building.' },
  { t: 'Boring is a feature.', b: 'Reliable, predictable software beats clever software that needs a babysitter.' },
  { t: 'Say no early.', b: 'If a deadline or scope cannot hold, you hear it in week one, not week six.' },
  { t: 'You own everything.', b: 'Code, accounts and documentation are yours. No lock-in, no hostage hosting.' },
  { t: 'Small by design.', b: 'One accountable person who knows the whole system, not a relay of hand-offs.' },
];

// Where each tool was actually used, derived from project stacks.
const used = (tool: string) =>
  [...caseStudies, ...lab].filter((p) => p.stack.some((s) => s.toLowerCase().includes(tool.toLowerCase()))).map((p) => p.title);

const GROUPS = [
  { name: 'Interfaces', tools: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion', 'PWA'] },
  { name: 'Backends', tools: ['Node', 'Express', 'Hono', 'Prisma', 'Nodemailer', 'Groq'] },
  { name: 'Data & payments', tools: ['PostgreSQL', 'Razorpay', 'Formspree'] },
  { name: 'Ship & run', tools: ['Vercel', 'Vite', 'HTML', 'CSS'] },
].map((g) => ({ name: g.name, tools: g.tools.map((name) => ({ name, usedIn: used(name) })) }));

export default function StudioPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="mono" style={{ marginBottom: 'var(--s-5)' }}>[01] — Studio</p>
        <h1 className="display-xl"><Words text="Problem solvers, not code typists." /></h1>
        <p className="lede">You are not buying hours of typing. You are buying better decisions.</p>
      </section>

      <section className="section container" aria-labelledby="founder-h">
        <div className="founder">
          <div className="portrait">
            <Portrait initials="AK" />
            <span className="mono">{studio.founder} · Founder</span>
          </div>
          <div className="founder-body">
            <h2 id="founder-h" className="display-l" style={{ marginBottom: 'var(--s-6)' }}>{studio.founder}</h2>
            <Reveal as="p" variant="blur">
              {studio.name} is {studio.founderFirst}&apos;s studio. Every project is led by {studio.founderFirst}, from the first
              call to the handover — no account managers, no hand-offs to someone you have not met.
            </Reveal>
            <p>
              {studio.founderFirst} cares about the parts users never see: the query that stays fast, the deploy that does not
              wake anyone up, the error message that actually helps. Comfortable across the stack — React and TypeScript on
              the front, Node and Postgres behind it.
            </p>
            <p>
              Based in {studio.city} ({studio.tzLabel}), working with clients remotely. Available for new projects from{' '}
              {studio.availability}.
            </p>
            <p className="quirk">Bring the hard question first. It saves everyone a meeting.</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <a className="ulink" href={studio.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
              <a className="ulink" href={studio.github} target="_blank" rel="noopener">GitHub ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="principles-h">
        <div className="grid" style={{ rowGap: 'var(--s-7)' }}>
          <h2 id="principles-h" className="display-l" style={{ gridColumn: '1 / span 4' }}>What we believe</h2>
          <ol className="principles">
            {PRINCIPLES.map((p, i) => (
              <li key={p.t}>
                <span className="mono">0{i + 1}</span>
                <div><h3>{p.t}</h3><p>{p.b}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section container" aria-labelledby="tools-h">
        <h2 id="tools-h" className="display-l" style={{ marginBottom: 'var(--s-7)' }}>Tools, and where they were used</h2>
        <ToolsMap groups={GROUPS} />
        <p className="body" style={{ marginTop: 'var(--s-7)' }}>
          We pick tools your team can maintain after we leave. If a simpler stack does the job, that is the one you get.{' '}
          <Link href="/contact" className="ulink" data-track="cta_click:studio">Start a project →</Link>
        </p>
      </section>
    </>
  );
}
