import { useEffect, useRef, useState, type RefObject } from "react";

import "./Color.css";

export interface ColorToken {
  /** CSS custom property backing the token, e.g. "--color-brand" */
  cssVar: string;
  /**
   * Tailwind utility class used to paint this token as a background. Written out in full
   * (not derived from cssVar) because Tailwind's scanner only detects class names that
   * appear as one literal token in source — building "bg-" + name at render time is
   * invisible to it and the utility's CSS never gets generated.
   */
  utility: string;
}

export const COLOR_TOKENS: ColorToken[] = [
  { cssVar: "--color-brand", utility: "bg-brand" },
  { cssVar: "--color-brand-hover", utility: "bg-brand-hover" },
  { cssVar: "--color-text-primary", utility: "bg-text-primary" },
  { cssVar: "--color-text-secondary", utility: "bg-text-secondary" },
  { cssVar: "--color-surface-base", utility: "bg-surface-base" },
  { cssVar: "--color-surface-card", utility: "bg-surface-card" },
  { cssVar: "--color-surface-accent", utility: "bg-surface-accent" },
];

function rgbToHex(rgb: string): string {
  const channels = rgb.match(/\d+/g);
  if (!channels) return rgb;

  const [r, g, b] = channels.map(Number);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0").toUpperCase()).join("")}`;
}

function useComputedHex(ref: RefObject<HTMLElement | null>): string {
  const [hex, setHex] = useState("");

  useEffect(() => {
    if (!ref.current) return;

    setHex(rgbToHex(getComputedStyle(ref.current).backgroundColor));
  }, [ref]);

  return hex;
}

function ColorRow({ cssVar, utility }: ColorToken) {
  const chipRef = useRef<HTMLDivElement>(null);
  const hex = useComputedHex(chipRef);
  const name = cssVar.replace(/^--/, "");

  return (
    <tr>
      <td className="color-token-cell py-3.5 align-middle">
        <div
          ref={chipRef}
          aria-hidden="true"
          className={`swatch-chip rounded-full ${utility}`}
        />
      </td>
      <td className="color-token-cell py-3.5 align-middle type-body-m text-text-primary">
        {hex || "—"}
      </td>
      <td className="color-token-cell py-3.5 align-middle type-body-m text-text-primary">
        {name}
      </td>
    </tr>
  );
}

export interface IColorTableProps {
  tokens: ColorToken[];
}

export function ColorTable({ tokens }: IColorTableProps) {
  return (
    <table className="color-token-table">
      <thead>
        <tr>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Swatch
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Hex
          </th>
          <th scope="col" className="py-3.5 type-label text-brand uppercase">
            Name
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
    // TODO: will update
    <section
      aria-labelledby="color-tokens-title"
      className="flex flex-col gap-3.5"
    >
      <h2 id="color-tokens-title" className="type-h2 text-text-primary">
        Colors
      </h2>
      <p className="type-body-m text-text-secondary max-w-149">
        Every swatch reads its color live from the token defined in globals.css
        — nothing here is a hardcoded hex value.
      </p>
      <ColorTable tokens={COLOR_TOKENS} />
    </section>
  );
}
