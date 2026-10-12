// Server-rendered text splitters. They only emit markup; the reveal itself is
// CSS, triggered by SiteEffects adding `.in`. The full string stays in an
// sr-only span so screen readers read words, not fragments.

import type { ElementType, ReactNode } from 'react';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
};

/** Word-by-word stagger with a slight rotateX. */
export function Words({ text, as: Tag = 'span', className = '', id }: Props) {
  const words = text.split(' ');
  return (
    <Tag className={`words ${className}`.trim()} id={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span className="w" key={i} style={{ ['--i' as string]: i }}>
            <span>{w}</span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Mono metadata appearing character by character (no cursor, no sound). */
export function TypeIn({ text, as: Tag = 'span', className = '' }: Props) {
  return (
    <Tag className={`typein ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((c, i) => (
          <span className="c" key={i} style={{ ['--i' as string]: i }}>
            {c}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Section index label: "[02] — SERVICES". */
export function Index({ n, label }: { n: string; label: string }) {
  return (
    <p className="index mono">
      <TypeIn text={`[${n}] — ${label}`} />
    </p>
  );
}

export function Reveal({
  as: Tag = 'div',
  variant,
  className,
  children,
  style,
}: {
  as?: ElementType;
  variant: 'clip-up' | 'clip-left' | 'clip-centre' | 'blur' | 'perspective' | 'scale' | 'mask';
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Tag data-reveal={variant} className={className} style={style}>
      {children}
    </Tag>
  );
}
