import type { Link } from './types';

export const email: Extract<Link, { type: 'email' }> = {
  type: 'email',
  label: 'Email',
  email: 'anyawee.sr@gmail.com',
};

export const links: Link[] = [
  { type: 'external', label: 'GitHub', href: '#' },
  { type: 'external', label: 'GitLab', href: '#' },
  { type: 'external', label: 'LinkedIn', href: '#' },
];
