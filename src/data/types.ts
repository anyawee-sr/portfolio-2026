import { routes } from "@/data/routes";

/**
 * Shared link shape for nav + footer content.
 * Discriminated on `type` so components can switch on it and attach
 * the correct behavior/attributes per kind:
 *  - internal → next/link, no decoration
 *  - external → target="_blank" rel="noopener noreferrer" + aria-hidden arrow
 *  - email    → <a href={`mailto:${email}`}>, no decoration
 *
 * This is a union `type`, not an `interface` — it does not take the
 * project's `I`-prefix convention (see CLAUDE.md).
 */
export type Link =
  | { type: "internal"; label: string; to: keyof typeof routes }
  | { type: "external"; label: string; href: string }
  | { type: "email"; label: string; email: string };
