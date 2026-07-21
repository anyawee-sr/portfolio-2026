import './Shadow.css';

export interface IShadowStep {
  /** Tailwind box-shadow utility class, written in full (e.g. "shadow-xl"). */
  utility: string;
}

// Full stock Tailwind shadow scale — this project has no custom shadow
// tokens (see globals.css), so every shadow-* class below resolves
// straight from Tailwind's own defaults.
export const SHADOW_STEPS: IShadowStep[] = [
  { utility: 'shadow-none' },
  { utility: 'shadow-2xs' },
  { utility: 'shadow-xs' },
  { utility: 'shadow-sm' },
  { utility: 'shadow-md' },
  { utility: 'shadow-lg' },
  { utility: 'shadow-xl' },
  { utility: 'shadow-2xl' },
];

function ShadowRow({ utility }: IShadowStep) {
  return (
    <tr>
      <td className="shadow-token-cell py-3.5 align-middle">
        <div
          aria-hidden="true"
          className={`${utility} size-16 rounded-lg bg-surface-accent`}
        />
      </td>
      <td className="shadow-token-cell py-3.5 align-middle type-body-m text-text-primary">
        {utility}
      </td>
    </tr>
  );
}

export interface IShadowTableProps {
  steps: IShadowStep[];
}

export function ShadowTable({ steps }: IShadowTableProps) {
  return (
    <table className="shadow-token-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Swatch
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Name
          </th>
        </tr>
      </thead>
      <tbody>
        {steps.map((token) => (
          <ShadowRow key={token.utility} {...token} />
        ))}
      </tbody>
    </table>
  );
}

export function ShadowTokens() {
  return (
    <section aria-labelledby="shadow-tokens-title" className="flex flex-col gap-3.5">
      <h2 id="shadow-tokens-title" className="type-h2 text-text-primary">
        Shadow
      </h2>
      <p className="type-body-m text-text-secondary max-w-149">
        This project has no custom shadow tokens — every drop shadow comes straight from
        Tailwind&apos;s own scale, from shadow-none through shadow-2xl.
      </p>
      <ShadowTable steps={SHADOW_STEPS} />
    </section>
  );
}
