import { useEffect, useRef, useState, type RefObject } from "react";

import "./BorderRadius.css";

export interface IRadiusStep {
  /** Tailwind border-radius utility class, written in full (e.g. "rounded-xl"). */
  utility: string;
}

// Full stock Tailwind radius scale — this project has no custom radius
// tokens (see globals.css), so every rounded-* class below resolves
// straight from Tailwind's own defaults.
export const RADIUS_STEPS: IRadiusStep[] = [
  { utility: "rounded-none" },
  { utility: "rounded-xs" },
  { utility: "rounded-sm" },
  { utility: "rounded-md" },
  { utility: "rounded-lg" },
  { utility: "rounded-xl" },
  { utility: "rounded-2xl" },
  { utility: "rounded-3xl" },
  { utility: "rounded-full" },
];

// rounded-full has no finite px value to read — Tailwind implements it as
// calc(infinity * 1px), which the browser clamps to its max representable
// length (~3.3e7px). Anything past this threshold is effectively "full".
const FULL_RADIUS_THRESHOLD_PX = 999;

function formatRadius(computed: string): string {
  const px = parseFloat(computed);
  return px > FULL_RADIUS_THRESHOLD_PX ? "9999px" : computed;
}

function useComputedRadius(ref: RefObject<HTMLElement | null>): string {
  const [radius, setRadius] = useState("");

  useEffect(() => {
    if (!ref.current) return;

    setRadius(formatRadius(getComputedStyle(ref.current).borderTopLeftRadius));
  }, [ref]);

  return radius;
}

function BorderRadiusRow({ utility }: IRadiusStep) {
  const swatchRef = useRef<HTMLDivElement>(null);
  const radius = useComputedRadius(swatchRef);

  return (
    <tr>
      <td className="border-radius-token-cell py-3.5 align-middle">
        <div
          ref={swatchRef}
          aria-hidden="true"
          className={`${utility} size-16 bg-brand`}
        />
      </td>
      <td className="border-radius-token-cell py-3.5 align-middle type-body-m text-text-primary">
        {radius || "—"}
      </td>
      <td className="border-radius-token-cell py-3.5 align-middle type-body-m text-text-primary">
        {utility}
      </td>
    </tr>
  );
}

export interface IBorderRadiusTableProps {
  steps: IRadiusStep[];
}

export function BorderRadiusTable({ steps }: IBorderRadiusTableProps) {
  return (
    <table className="border-radius-token-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Swatch
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Value
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Name
          </th>
        </tr>
      </thead>
      <tbody>
        {steps.map((token) => (
          <BorderRadiusRow key={token.utility} {...token} />
        ))}
      </tbody>
    </table>
  );
}

export function BorderRadiusTokens() {
  return (
    <section
      aria-labelledby="border-radius-tokens-title"
      className="flex flex-col gap-3.5"
    >
      <h2 id="border-radius-tokens-title" className="type-h2 text-text-primary">
        Border Radius
      </h2>
      <p className="type-body-m text-text-secondary max-w-149">
        This project has no custom radius tokens — every rounded corner comes
        straight from Tailwind&apos;s own scale, from rounded-none through
        rounded-full. The full scale below, read live from the DOM.
      </p>
      <BorderRadiusTable steps={RADIUS_STEPS} />
    </section>
  );
}
