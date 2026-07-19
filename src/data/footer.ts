import { nav } from './nav';
import { links } from './links';
import type { Link } from './types';

/**
 * Footer columns. `navigation` mirrors the top nav exactly;
 * `contact` leads with email (the one real point of contact —
 * LET'S CHAT deep-links here) followed by social profiles.
 */
export const footer = {
  navigation: nav,
  contact: [
    { type: 'email', label: 'Email', email: 'anyawee.sr@gmail.com' },
    ...links,
  ] as Link[],
};

/** Computed at render time so the copyright year never goes stale. */
export const copyrightYear = new Date().getFullYear();
