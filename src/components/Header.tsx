'use client';

import NextLink from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { email } from '@/data/links';
import { nav } from '@/data/nav';
import { routes } from '@/data/routes';
import { cn } from '@/lib/cn';

import { Pill } from './ui/Pill';

/** Alternating tilt for the mobile menu's hanging badges — ±3–5deg per CLAUDE.md,
 * via Tailwind's own built-in rotate scale (not a named globals.css utility). */
const MENU_ROTATIONS = ['-rotate-6', 'rotate-3', '-rotate-3'];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const menuId = useId();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return
    };

    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();

        return;
      }

      if (event.key !== 'Tab' || !menuRef.current) {
        return
      };

      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>('a, button');

      if (focusableElements.length === 0) {
        return
      };

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  function handleClickMenu() {
    setIsOpen(false);
    setIsMenuMounted(false);
    buttonRef.current?.focus();
  }

  function handleToggleMenu() {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);

    if (nextIsOpen) {
      setIsMenuMounted(true);
    }
  }

  function handleMenuAnimationEnd() {
    if (!isOpen) {
      setIsMenuMounted(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 border-b border-brand/10 bg-surface-base px-4 py-5 md:px-11">
      <NextLink href="/" className="type-h3 text-brand">
        ANYAWEE SR.
      </NextLink>

      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex items-center gap-8">
          {nav.map((link) =>
            link.type === 'internal' ? (
              <li key={link.label}>
                <NextLink
                  href={routes[link.to]}
                  className="type-label uppercase text-text-secondary transition-colors hover:text-brand"
                >
                  {link.label}
                </NextLink>
              </li>
            ) : null
          )}
        </ul>
      </nav>

      <div className="hidden md:block">
        <Pill link={email} />
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleToggleMenu}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span
          aria-hidden="true"
          className={cn(
            'h-0.5 w-6 bg-brand transition-transform duration-200',
            isOpen && 'translate-y-2 rotate-45'
          )}
        />
        <span
          aria-hidden="true"
          className={cn('h-0.5 w-6 bg-brand transition-opacity duration-200', isOpen && 'opacity-0')}
        />
        <span
          aria-hidden="true"
          className={cn(
            'h-0.5 w-6 bg-brand transition-transform duration-200',
            isOpen && '-translate-y-2 -rotate-45'
          )}
        />
      </button>

      {isMenuMounted ? (
        <div
          id={menuId}
          ref={menuRef}
          onAnimationEnd={handleMenuAnimationEnd}
          className={cn(
            'absolute right-4 top-full -mt-2 flex flex-col items-end gap-3 bg-transparent md:hidden',
            !isOpen && 'is-closing pointer-events-none'
          )}
        >
          {nav.map((link, i) =>
            link.type === 'internal' ? (
              <NextLink
                key={link.label}
                ref={i === 0 ? firstLinkRef : undefined}
                href={routes[link.to]}
                onClick={handleClickMenu}
                className={cn(
                  'menu-badge type-h4 uppercase flex min-h-11 items-center rounded-xl bg-brand px-4 text-surface-base shadow-md',
                  isOpen ? 'animate-pop-in' : 'animate-pop-out',
                  MENU_ROTATIONS[i % MENU_ROTATIONS.length]
                )}
              >
                {link.label}
              </NextLink>
            ) : null
          )}
        </div>
      ) : null}
    </header>
  );
}
