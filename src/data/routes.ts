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
