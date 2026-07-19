import { useEffect, useRef, useState, type RefObject } from 'react';

import './Spacing.css';

export interface SpacingToken {
  /** CSS custom property backing the token, e.g. "--spacing-card-gap" */
  cssVar: string;
  /**
   * Tailwind utility class used to size this token's box as a width. Written out in full
   * (not derived from cssVar) because Tailwind's scanner only detects class names that
   * appear as one literal token in source — building "w-" + name at render time is
   * invisible to it and the utility's CSS never gets generated.
   */
  utility: string;
}

// Ascending by px so the box column reads as a growing staircase.
export const SPACING_TOKENS: SpacingToken[] = [
  { cssVar: '--spacing-card-gap', utility: 'w-card-gap' },
  { cssVar: '--spacing-dot-cell', utility: 'w-dot-cell' },
  { cssVar: '--spacing-nav-gap', utility: 'w-nav-gap' },
  { cssVar: '--spacing-grid-cell', utility: 'w-grid-cell' },
  { cssVar: '--spacing-section-y', utility: 'w-section-y' },
];

function useComputedWidth(ref: RefObject<HTMLElement | null>): string {
  const [width, setWidth] = useState('');

  useEffect(() => {
    if (!ref.current) return;

    setWidth(getComputedStyle(ref.current).width);
  }, [ref]);

  return width;
}

function SpacingRow({ cssVar, utility }: SpacingToken) {
  const boxRef = useRef<HTMLDivElement>(null);
  const width = useComputedWidth(boxRef);
  const name = cssVar.replace(/^--/, '');

  return (
    <tr className="spacing-token-row">
      <td className="spacing-token-cell type-body-m text-text-primary">{name}</td>
      <td className="spacing-token-cell type-body-m text-text-primary">{width || '—'}</td>
      <td className="spacing-token-cell">
        <div ref={boxRef} aria-hidden="true" className={`${utility} h-4 rounded-sm bg-brand`} />
      </td>
    </tr>
  );
}

export interface ISpacingTableProps {
  tokens: SpacingToken[];
}

export function SpacingTable({ tokens }: ISpacingTableProps) {
  return (
    <table className="spacing-token-table">
      <thead>
        <tr>
          <th scope="col" className="type-label text-brand uppercase">
            Name
          </th>
          <th scope="col" className="type-label text-brand uppercase">
            Value
          </th>
          <th scope="col" className="type-label text-brand uppercase">
            Box
          </th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <SpacingRow key={token.cssVar} {...token} />
        ))}
      </tbody>
    </table>
  );
}

export function SpacingTokens() {
  return (
    <section aria-labelledby="spacing-tokens-title" className="spacing-tokens-page">
      <h2 id="spacing-tokens-title" className="type-h2 text-text-primary">
        Spacing
      </h2>
      <p className="type-body-m text-text-secondary max-w-[60ch]">
        Every box&apos;s width is read live from the --spacing-* token in globals.css — nothing
        here is a hardcoded pixel value.
      </p>
      <SpacingTable tokens={SPACING_TOKENS} />
    </section>
  );
}
