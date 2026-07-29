import NextLink from 'next/link';
import { cloneElement, type ReactElement, type SVGProps } from 'react';

import { routes } from '@/data/routes';
import type { Link } from '@/data/types';
import { cn } from '@/lib/cn';

/**
 * Solid pill button — LET'S CHAT, VIEW ALL, and the About Me CTA all
 * share this shape. Renders the right anchor kind for the given
 * `Link` (internal/external/email) so callers never hand-roll the
 * href/rel/target logic per CLAUDE.md's link rules.
 */
export interface IPillProps {
  link: Link;
  /** Decorative trailing icon, e.g. `<ArrowRightIcon />` — always forced aria-hidden. */
  arrow?: ReactElement<SVGProps<SVGSVGElement>>;
  className?: string;
}

export function Pill({ link, arrow, className }: IPillProps) {
  const content = (
    <>
      {link.label}
      {arrow ? cloneElement(arrow, { 'aria-hidden': true, focusable: false }) : null}
    </>
  );

  const base = cn(
    'type-label inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-brand px-6 py-3.5 text-surface-base uppercase shadow-lg transition-colors duration-200 hover:bg-brand-hover',
    className
  );

  if (link.type === 'internal') {
    return (
      <NextLink href={routes[link.to]} className={base}>
        {content}
      </NextLink>
    );
  }

  if (link.type === 'email') {
    return (
      <a href={`mailto:${link.email}`} className={base}>
        {content}
      </a>
    );
  }

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={base}>
      {content}
    </a>
  );
}
