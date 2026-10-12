'use client';

import { useEffect, useState } from 'react';
import { motionReduced } from '@/lib/prefs';
import { studio } from '@/lib/content';

// ABI intro. The mechanism is unchanged from the original site (and matches
// ajaykumarak.online): three words typed out, plays on every full page load,
// Skip button, stacks vertically below 900px, skipped for reduced motion.
// Only the styling follows the new design system.

const WORDS = [
  { first: 'A', rest: 'rchitecting' },
  { first: 'B', rest: 'old' },
  { first: 'I', rest: 'deas' },
] as const;

const TYPE_SPEED = 34;

/** The hero waits for this before running its own opening sequence. */
function announceDone() {
  (window as Window & { __introDone?: boolean }).__introDone = true;
  window.dispatchEvent(new Event('intro:done'));
}

export default function IntroOverlay() {
  const [typed, setTyped] = useState(['', '', '']);
  const [cursorDone, setCursorDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  function closeIntro() {
    setHidden(true);
    document.body.classList.remove('intro-lock');
    announceDone();
  }

  useEffect(() => {
    if (motionReduced()) {
      document.body.classList.remove('intro-lock');
      setHidden(true);
      announceDone();
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));

    (async () => {
      await sleep(500);
      for (let w = 0; w < WORDS.length; w++) {
        const { rest } = WORDS[w];
        for (let i = 1; i <= rest.length; i++) {
          await sleep(TYPE_SPEED);
          if (cancelled) return;
          setTyped((prev) => {
            const next = [...prev];
            next[w] = rest.slice(0, i);
            return next;
          });
        }
      }
      setCursorDone(true);
      await sleep(900);
      if (cancelled) return;
      closeIntro();
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div id="introOverlay" className={hidden ? 'hide' : undefined} aria-hidden="true">
      <div className="intro-meta top">
        <span className="mono">[00] — {studio.name}</span>
        <span className="mono">{studio.coords}</span>
      </div>
      <div className="intro-letters">
        {WORDS.map((word, i) => (
          <span className="intro-word" key={word.first}>
            <span className="intro-first">{word.first}</span>
            <span className="intro-rest">{typed[i]}</span>
            {i === WORDS.length - 1 && (
              <span className={`intro-cursor${cursorDone ? ' done' : ''}`} />
            )}
          </span>
        ))}
      </div>
      <div className="intro-meta bottom">
        <span className="mono">{studio.city} · {studio.tzLabel}</span>
        <button className="intro-skip" type="button" onClick={closeIntro}>
          Skip →
        </button>
      </div>
    </div>
  );
}
