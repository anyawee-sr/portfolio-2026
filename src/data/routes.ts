/**
 * Internal route paths — single source of truth.
 * Referenced via `keyof typeof routes` so a typo in a `to` field
 * fails at compile time instead of producing a dead link.
 *
 * `work`/`aboutMe` are hash anchors into homepage sections, not
 * separate pages — this is a single-page site.
 */
export const routes = {
  work: '/#work',
  aboutMe: '/#about-me',
} as const;

/**
 * `/work/[slug]` detail page — not built yet, added ahead of time so
 * case study cards have a real (if 404-for-now) destination instead
 * of `href="#"`. Takes a `slug` param so it can't live in the flat
 * `routes` object above (that's keyed by `keyof typeof routes` with
 * no per-entry params).
 */
export function workDetailPath(slug: string) {
  return `/work/${slug}`;
}
