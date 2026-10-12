'use client';

import { useState } from 'react';

type Group = { name: string; tools: { name: string; usedIn: string[] }[] };

/**
 * Tools as a map, not a logo wall: pick a tool to see where it was actually
 * used. Every "used in" entry comes from a real project's stack.
 */
export default function ToolsMap({ groups }: { groups: Group[] }) {
  const [picked, setPicked] = useState<{ name: string; usedIn: string[] } | null>(null);
  return (
    <>
      <div className="tools-map">
        {groups.map((g) => (
          <div className="col" key={g.name}>
            <p className="mono">{g.name}</p>
            <ul>
              {g.tools.map((t) => (
                <li key={t.name}>
                  <button type="button" aria-pressed={picked?.name === t.name} onClick={() => setPicked(picked?.name === t.name ? null : t)}>
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="tools-used" role="status" aria-live="polite">
        {picked ? (
          picked.usedIn.length ? (
            <><strong>{picked.name}</strong> — used in {picked.usedIn.join(', ')}.</>
          ) : (
            <><strong>{picked.name}</strong> — used across our own tooling and this site.</>
          )
        ) : (
          'Pick a tool to see where it was used.'
        )}
      </p>
    </>
  );
}
