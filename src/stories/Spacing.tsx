import { useEffect, useRef, useState, type RefObject } from 'react';

import './Spacing.css';

export interface ISpacingStep {
  step: string;
  utility: string;
}

export const SPACING_STEPS: ISpacingStep[] = [
  { step: '0', utility: 'w-0' },
  { step: '1', utility: 'w-1' },
  { step: '2', utility: 'w-2' },
  { step: '4', utility: 'w-4' },
  { step: '6', utility: 'w-6' },
  { step: '8', utility: 'w-8' },
  { step: '12', utility: 'w-12' },
  { step: '16', utility: 'w-16' },
];

function useComputedRem(ref: RefObject<HTMLElement | null>): string {
  const [rem, setRem] = useState('');

  useEffect(() => {
    if (!ref.current) return;

    const widthPx = parseFloat(getComputedStyle(ref.current).width);
    const rootFontSizePx = parseFloat(getComputedStyle(document.documentElement).fontSize);

    setRem(`${widthPx / rootFontSizePx}rem`);
  }, [ref]);

  return rem;
}

function SpacingRow({ step, utility }: ISpacingStep) {
  const boxRef = useRef<HTMLDivElement>(null);
  const rem = useComputedRem(boxRef);

  return (
    <tr>
      <td className="py-3.5 align-middle type-body-m text-text-primary">{`gap-${step}`}</td>
      <td className="py-3.5 align-middle type-body-m text-text-primary">{rem || '—'}</td>
      <td className="py-3.5 align-middle">
        <div ref={boxRef} aria-hidden="true" className={`${utility} h-4 rounded-sm bg-brand`} />
      </td>
    </tr>
  );
}

export interface ISpacingTableProps {
  steps: ISpacingStep[];
}

export function SpacingTable({ steps }: ISpacingTableProps) {
  return (
    <table className="spacing-token-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Name
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Value
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Swatch
          </th>
        </tr>
      </thead>
      <tbody>
        {steps.map((token) => (
          <SpacingRow key={token.step} {...token} />
        ))}
      </tbody>
    </table>
  );
}

export function SpacingTokens() {
  return (
    <section aria-labelledby="spacing-tokens-title" className="flex flex-col gap-3.5">
      <h2 id="spacing-tokens-title" className="type-h2 text-text-primary">
        Spacing
      </h2>
      <p className="type-body-m text-text-secondary max-w-149">
        This project has no custom spacing tokens — every gap, width, padding, and margin comes
        straight from Tailwind&apos;s own scale, each step a multiple of --spacing (e.g. gap-4 is
        calc(var(--spacing) * 4)). A handful of steps below, read live from the DOM.
      </p>
      <SpacingTable steps={SPACING_STEPS} />
    </section>
  );
}
