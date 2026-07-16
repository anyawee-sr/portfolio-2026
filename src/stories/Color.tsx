import { useEffect, useRef, useState, type RefObject } from 'react';

import './Color.css';

export interface ColorToken {
  /** CSS custom property backing the token, e.g. "--color-brand" */
  cssVar: string;
  /** Tailwind utility class used to paint this token as a background */
  utility: string;
  /** Tailwind utility class for this token's hover state, if it has one (e.g. "bg-brand-hover") */
  hoverUtility?: string;
  /**
   * The `hover:` variant of hoverUtility, written out in full (e.g. "hover:bg-brand-hover").
   * Tailwind's scanner only detects class names that appear as one literal token in source —
   * building this via `hover:${hoverUtility}` at render time is invisible to it.
   */
  hoverClassName?: string;
}

export const SEMANTIC_COLOR_TOKENS: ColorToken[] = [
  {
    cssVar: '--color-brand',
    utility: 'bg-brand',
    hoverUtility: 'bg-brand-hover',
    hoverClassName: 'hover:bg-brand-hover',
  },
  { cssVar: '--color-text-primary', utility: 'bg-text-primary' },
  { cssVar: '--color-text-secondary', utility: 'bg-text-secondary' },
  { cssVar: '--color-surface-base', utility: 'bg-surface-base' },
  { cssVar: '--color-surface-card', utility: 'bg-surface-card' },
  { cssVar: '--color-surface-accent', utility: 'bg-surface-accent' },
];

function rgbToHex(rgb: string): string {
  const channels = rgb.match(/\d+/g);
  if (!channels) return rgb;
  const [r, g, b] = channels.map(Number);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0').toUpperCase()).join('')}`;
}

function useComputedHex(ref: RefObject<HTMLElement | null>): string {
  const [hex, setHex] = useState('');

  useEffect(() => {
    if (!ref.current) return;
    setHex(rgbToHex(getComputedStyle(ref.current).backgroundColor));
  }, [ref]);

  return hex;
}

function ColorRow({ cssVar, utility, hoverUtility, hoverClassName }: ColorToken) {
  const chipRef = useRef<HTMLDivElement>(null);
  const hex = useComputedHex(chipRef);
  const hoverChipRef = useRef<HTMLDivElement>(null);
  const hoverHex = useComputedHex(hoverChipRef);
  const name = cssVar.replace(/^--/, '');

  const chipClassName = hoverClassName
    ? `swatch-chip rounded-sm transition-colors ${utility} ${hoverClassName}`
    : `swatch-chip rounded-sm ${utility}`;

  return (
    <tr className="color-token-row">
      <td className="color-token-cell">
        <div ref={chipRef} aria-hidden="true" className={chipClassName} />
        {hoverUtility && <div ref={hoverChipRef} aria-hidden="true" className={`swatch-chip-probe ${hoverUtility}`} />}
      </td>
      <td className="color-token-cell type-body-m text-text-primary">{name}</td>
      <td className="color-token-cell type-body-m text-text-primary">
        {hex || '—'}
        {hoverUtility && (
          <span className="type-caption text-text-secondary"> → hover {hoverHex || '—'}</span>
        )}
      </td>
    </tr>
  );
}

export interface PaletteProps {
  tokens: ColorToken[];
}

export function Palette({ tokens }: PaletteProps) {
  return (
    <table className="color-token-table">
      <thead>
        <tr>
          <th scope="col" className="type-label text-brand">
            SWATCH
          </th>
          <th scope="col" className="type-label text-brand">
            NAME
          </th>
          <th scope="col" className="type-label text-brand">
            HEX
          </th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <ColorRow key={token.cssVar} {...token} />
        ))}
      </tbody>
    </table>
  );
}

export function ColorTokens() {
  return (
    <section aria-labelledby="color-tokens-title" className="color-tokens-page">
      <h2 id="color-tokens-title" className="type-h2 text-text-primary">
        Semantic Color Tokens
      </h2>
      <p className="type-body-m text-text-secondary max-w-[60ch]">
        Every swatch reads its color live from the token defined in globals.css — nothing here is a
        hardcoded hex value.
      </p>
      <Palette tokens={SEMANTIC_COLOR_TOKENS} />
    </section>
  );
}
