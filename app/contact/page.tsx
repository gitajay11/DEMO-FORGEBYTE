import type { Metadata } from 'next';
import { studio } from '@/lib/content';
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/site';
import { Words } from '@/components/motion/Text';
import ContactForm from '@/components/contact/ContactForm';
import CopyEmail from '@/components/contact/CopyEmail';

export const metadata: Metadata = {
  title: 'Start a project',
  description: `Tell Forgebyte what you are trying to fix or build. We reply within ${studio.replyWithin}, with next steps or a few questions.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="contact" aria-labelledby="contact-h" style={{ paddingBottom: 'var(--s-10)' }}>
      <span className="contact-light" aria-hidden="true" />
      <div className="container">
        <h1 id="contact-h" className="display-xl contact-head" style={{ marginTop: 'calc(var(--nav-h) + var(--s-10))' }}>
          <Words text="Got a problem worth thinking about?" />
        </h1>
        <p className="contact-sub">
          A few quick questions — only three are required. We reply within {studio.replyWithin}.
        </p>
        <div className="contact-grid">
          <ContactForm source="contact-page" />
          <aside className="alt" aria-label="Other ways to reach us">
            <div className="alt-item">
              <span className="mono">Prefer to talk?</span>
              <a className="ulink" href={WHATSAPP_URL} target="_blank" rel="noopener" data-track="booking_click:contact-whatsapp">
                Message us on WhatsApp ↗
              </a>
              <p>Tell us when suits you and we&apos;ll call. We&apos;re on {studio.tzLabel}.</p>
            </div>
            <div className="alt-item">
              <span className="mono">Email us</span>
              <CopyEmail email={CONTACT_EMAIL} />
            </div>
            <div className="alt-item">
              <span className="mono">Elsewhere</span>
              <div style={{ display: 'flex', gap: 20 }}>
                <a className="ulink" href={studio.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
                <a className="ulink" href={studio.github} target="_blank" rel="noopener">GitHub ↗</a>
              </div>
            </div>
            <p className="coffee">Fill your coffee cup before booking a call with us.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
