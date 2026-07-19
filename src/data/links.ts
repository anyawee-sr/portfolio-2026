import type { Link } from './types';

/**
 * Social profile links — reused in the hero bottom bar
 * (`hidden md:` per CLAUDE.md) and the footer contact column.
 * href values are placeholders, edit here to point at real profiles.
 */
export const links: Link[] = [
  { type: 'external', label: 'GitHub', href: '#' },
  { type: 'external', label: 'GitLab', href: '#' },
  { type: 'external', label: 'LinkedIn', href: '#' },
];
