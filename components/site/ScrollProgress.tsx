'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Hairline at the top of the viewport showing how far down the page you are.
 *  Passive scroll listener, one update per frame, transform only. */
export default function ScrollProgress() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      // re-read every frame: pinned sections change the page height
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
