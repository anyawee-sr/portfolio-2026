"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { email } from "@/data/links";
import { nav } from "@/data/nav";
import { routes } from "@/data/routes";
import { cn } from "@/lib/cn";
import { smoothScrollTo } from "@/lib/smoothScrollTo";

import { Pill } from "./ui/Pill";

/** Alternating tilt for the mobile menu's hanging badges — ±3–5deg per CLAUDE.md,
 * via Tailwind's own built-in rotate scale (not a named globals.css utility). */
const MENU_ROTATIONS = ["-rotate-6", "rotate-3", "-rotate-3"];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);

  const menuId = useId();
  const pathname = usePathname();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  // Suspended while a nav-click-triggered smooth scroll is in flight, so the
  // observer doesn't flip activeHash to whatever section briefly passes
  // under the viewport on the way to the target (e.g. clicking "About Me"
  // from the hero shouldn't flash "Work" as it scrolls past #work).
  const isProgrammaticScrollRef = useRef(false);

  // This is scroll-spy over hash anchors, which only exist on the landing
  // page (`/#work`, `/#about-me`) — once nav links point to real pages
  // instead of hash anchors, swap this for pathname-based active matching
  // and delete the IntersectionObserver. `pathname` is a dependency purely
  // to re-arm the observer when navigating back to `/` from a page (like
  // `/work/[slug]`) where the target sections don't exist — Header lives in
  // the root layout and never unmounts across client-side navigation, so
  // without this the observer set up on first mount would never look for
  // the sections again.
  useEffect(() => {
    const sectionIds = nav
      .filter((link) => link.type === "internal")
      .map((link) => routes[link.to].split("#")[1])
      .filter((hash): hash is string => Boolean(hash));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    // Deliberately not resetting activeHash here. On pages without these
    // sections (e.g. `/work/[slug]`), this lets activeHash keep whatever
    // value it already had: still "work" if the user navigated in from a
    // Work card on the landing page (so the highlight persists), or still
    // null if they loaded the detail page directly (so nothing highlights).
    if (sections.length === 0) {
      return;
    }

    let cancelled = false;
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        });

        if (cancelled || isProgrammaticScrollRef.current) {
          return;
        }

        // sectionIds is DOM order (work → about-me), so the first id still
        // marked visible is the topmost section on screen; none visible
        // means we're above them (hero/skills) — no active nav item.
        setActiveHash(sectionIds.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();

        return;
      }

      if (event.key !== "Tab" || !menuRef.current) {
        return;
      }

      const focusableElements =
        menuRef.current.querySelectorAll<HTMLElement>("a, button");

      if (focusableElements.length === 0) {
        return;
      }

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

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  function handleClickMenu() {
    setIsOpen(false);
    setIsMenuMounted(false);
    buttonRef.current?.focus();
  }

  // next/link skips its scroll-into-view when the target hash already
  // matches the current URL (e.g. user scrolled away from #work by hand,
  // then clicks "Work" again — URL never changed, so next/link no-ops).
  // Scroll manually so the link always jumps, regardless of URL state. When
  // the target section exists on this page, we take over the click
  // entirely (preventDefault) — leaving it to next/link's own navigation to
  // also run alongside ours makes it double up the URL hash on a repeat
  // click (e.g. `/#work#work`), so we sync the address bar ourselves via a
  // plain history.pushState instead of routing the click through next/link.
  // If the target doesn't exist (e.g. clicking "Work" from
  // `/work/[slug]`), we leave the event alone so next/link can still
  // navigate to the landing page normally.
  function handleNavLinkClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = document.getElementById(hash);

    if (!target) {
      return;
    }

    event.preventDefault();

    if (window.location.hash !== `#${hash}`) {
      window.history.pushState(null, "", `#${hash}`);
    }

    // Set the destination as active immediately and suspend the observer
    // for the duration of the scroll — see isProgrammaticScrollRef above.
    isProgrammaticScrollRef.current = true;
    setActiveHash(hash);

    smoothScrollTo(target, () => {
      isProgrammaticScrollRef.current = false;
    });
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
    <header
      id="site-header"
      tabIndex={-1}
      className="sticky top-0 z-50 flex items-center justify-between gap-8 border-b border-brand/10 bg-surface-base px-4 py-5 md:px-11"
    >
      <NextLink href="/" className="type-h3 text-brand">
        ANYAWEE SR.
      </NextLink>

      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex items-center gap-8">
          {nav.map((link) => {
            if (link.type !== "internal") {
              return null;
            }

            const hash = routes[link.to].split("#")[1];
            const isActive = hash === activeHash;

            return (
              <li key={link.label}>
                <NextLink
                  href={routes[link.to]}
                  onClick={
                    hash
                      ? (event) => handleNavLinkClick(event, hash)
                      : undefined
                  }
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "type-label uppercase transition-colors hover:text-brand",
                    isActive
                      ? "underline decoration-brand decoration-wavy decoration-2 underline-offset-4 text-brand"
                      : "text-text-secondary",
                  )}
                >
                  {link.label}
                </NextLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden md:block">
        <Pill link={email} />
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={handleToggleMenu}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-0.5 w-6 bg-brand transition-transform duration-200",
            isOpen && "translate-y-2 rotate-45",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "h-0.5 w-6 bg-brand",
            isOpen ? "opacity-0" : "transition-opacity duration-100 ease-out",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "h-0.5 w-6 bg-brand transition-transform duration-200",
            isOpen && "-translate-y-2 -rotate-45",
          )}
        />
      </button>

      {isMenuMounted ? (
        <div
          id={menuId}
          ref={menuRef}
          onAnimationEnd={handleMenuAnimationEnd}
          className={cn(
            "absolute right-4 top-full -mt-2 flex flex-col items-end gap-3 bg-transparent md:hidden",
            !isOpen && "is-closing pointer-events-none",
          )}
        >
          {nav.map((link, i) => {
            if (link.type !== "internal") {
              return null;
            }

            const hash = routes[link.to].split("#")[1];

            return (
              <NextLink
                key={link.label}
                ref={i === 0 ? firstLinkRef : undefined}
                href={routes[link.to]}
                onClick={(event) => {
                  if (hash) {
                    handleNavLinkClick(event, hash);
                  }

                  handleClickMenu();
                }}
                className={cn(
                  "menu-badge type-h4 uppercase flex min-h-11 items-center rounded-xl bg-brand px-4 text-surface-base shadow-md",
                  isOpen ? "animate-pop-in" : "animate-pop-out",
                  MENU_ROTATIONS[i % MENU_ROTATIONS.length],
                )}
              >
                {link.label}
              </NextLink>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}
