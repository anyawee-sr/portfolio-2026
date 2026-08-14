import type { Link } from "./types";

/**
 * Content for `src/app/not-found.tsx`. Kept in natural case like every
 * other data file — `uppercase` is applied at render, not stored here,
 * so screen readers announce words instead of spelling out letters.
 *
 * `headlineLead`/`headlineUnderlined` are split because only the second
 * half sits under the decorative hand-drawn line (see not-found.tsx).
 */
export interface INotFoundContent {
  title: string;
  code: string;
  headlineLead: string;
  headlineUnderlined: string;
  description: string;
  cta: Link;
}

export const notFound: INotFoundContent = {
  title: "Page not found",
  code: "404",
  headlineLead: "Looks like",
  headlineUnderlined: "you got lost",
  description:
    "This page packed up and left. Or maybe it never existed at all.",
  cta: { type: "internal", label: "Take me home", to: "home" },
};
