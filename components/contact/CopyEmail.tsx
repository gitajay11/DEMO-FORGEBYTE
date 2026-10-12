'use client';

import { useState } from 'react';

/** Copies the address and says so; falls back to mailto if clipboard is blocked. */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }
  return (
    <>
      <button type="button" className="copy-btn" onClick={copy} aria-describedby="copy-state">
        {email} <span className="mono">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <span id="copy-state" className="sr-only" role="status" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </>
  );
}
