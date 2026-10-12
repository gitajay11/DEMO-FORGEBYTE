'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { studio } from '@/lib/content';

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/studio', label: 'Studio' },
  { href: '/lab', label: 'Lab' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, return on scroll up
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 240);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Menu: lock scroll, move focus in, Escape closes, focus returns
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = menuRef.current?.querySelector<HTMLElement>('a');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && menuRef.current) {
        const items = [...menuRef.current.querySelectorAll<HTMLElement>('a, button')];
        const all = [buttonRef.current!, ...items];
        const i = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); all[all.length - 1].focus(); }
        else if (!e.shiftKey && i === all.length - 1) { e.preventDefault(); all[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      buttonRef.current?.focus();
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(href + '/') ? 'page' : undefined);

  return (
    <>
      <header className="nav" data-hidden={hidden && !open} data-scrolled={scrolled || open}>
        <div className="container nav-inner">
          <Link href="/" className="logo" aria-label="Forgebyte — home">
            <span className="logo-mark" aria-hidden="true">{'{}'}</span>
            forgebyte
          </Link>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="ulink" aria-current={current(l.href)}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className={`btn ${scrolled ? 'btn-primary' : 'btn-ghost'}`} data-magnetic data-track="cta_click:nav">
                  Start a project
                </Link>
              </li>
            </ul>
          </nav>
          <button
            ref={buttonRef}
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="site-menu" className="menu" data-open={open} ref={menuRef} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          <ul className="menu-list">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={current(l.href)}>
                  <span className="mono">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" aria-current={current('/contact')} data-track="cta_click:menu">
                <span className="mono">05</span>
                Start a project
              </Link>
            </li>
          </ul>
        </nav>
        <div className="menu-foot">
          <p className="mono live">Accepting projects · {studio.availability}</p>
          <p className="mono">{studio.city} · {studio.tzLabel}</p>
        </div>
      </div>
    </>
  );
}
