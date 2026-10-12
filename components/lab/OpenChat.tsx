'use client';

/** Opens the site's chat widget (it listens for this event). */
export default function OpenChat({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="ulink" onClick={() => window.dispatchEvent(new Event('chat:open'))}>
      {children}
    </button>
  );
}
