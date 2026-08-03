import type { Link } from './types';

/**
 * NOTE:
 * aboutMe.ts's contact.rows intentionally duplicates these values
 * — update both if an email or handle changes.
 */
export const email: Extract<Link, { type: 'email' }> = {
  type: 'email',
  label: 'Email',
  email: 'anyawee.sr@gmail.com',
};

export const links: Link[] = [
  { type: 'external', label: 'GitHub', href: 'https://github.com/anyawee-sr' },
  { type: 'external', label: 'GitLab', href: 'https://gitlab.com/anyawee-sr' },
  { type: 'external', label: 'LinkedIn', href: 'https://www.linkedin.com/in/anyawee-sr' },
];
