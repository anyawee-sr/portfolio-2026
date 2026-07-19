/**
 * Internal route paths — single source of truth.
 * Referenced via `keyof typeof routes` so a typo in a `to` field
 * fails at compile time instead of producing a dead link.
 */
export const routes = {
  work: '/work',
  story: '/story',
  aboutMe: '/about',
  archive: '/archive',
} as const;
