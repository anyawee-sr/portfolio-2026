"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { smoothScrollToTop } from "@/lib/smoothScrollTo";

import { BubbleTail } from "./ui/BubbleTail";

/** A speech-bubble "back to top?" link that lives across the footer's
 * top edge, near the googly eyes. Plays its rise-in bounce every time
 * it re-enters the viewport (not just the first time) — the wrapper
 * itself is the IntersectionObserver target, and `animate-rise-in-shake-x`
 * is only applied while visible, so there's nothing to "hide" up front:
 * the link is always real markup, always clickable, even before JS
 * hydrates.
 *
 * The `data-back-to-top` attribute is a CSS hook, not a component
 * prop: it lets `globals.css` hide this bubble specifically on the
 * 404 page (see the rule near `NotFoundSection`'s `data-notfound`)
 * regardless of viewport height — a short screen still makes that
 * page scroll, and a scroll-height check alone would let the bubble
 * back in there. Footer can't do this with a prop instead because
 * it's rendered by the root layout (`src/app/layout.tsx`) before the
 * layout can know `children` resolved to `src/app/not-found.tsx`. */
export function BackToTop() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    smoothScrollToTop(() => {
      document.getElementById("site-header")?.focus({ preventScroll: true });
    });
  }

  return (
    <div
      ref={wrapperRef}
      data-back-to-top
      className="absolute z-11 inset-x-4 -top-14 mx-auto flex max-w-300 justify-end md:inset-x-11"
    >
      <a
        href="#top"
        onClick={handleClick}
        className={cn(
          "type-caption relative inline-flex items-center rounded-full bg-brand p-3 -rotate-3 text-surface-base shadow-md",
          isVisible && "animate-rise-in-shake-x",
        )}
      >
        back to top?
        <BubbleTail className="absolute left-2 -bottom-3 text-brand" />
      </a>
    </div>
  );
}
