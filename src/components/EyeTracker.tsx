"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * TODO: mobile has no mouse pointer to track,
 * so on mobile the pupils should jiggle based on device tilt/shake (`devicemotion`) instead.
 */

/** How much space to leave between the pupil and the edge of the eye
 * when the pupil is pushed as far as it can go — stops it from looking
 * like it pokes through the white. */
const PUPIL_RIM_PADDING_PX = 3;

interface IEyePair {
  eye: HTMLElement;
  pupil: HTMLElement;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * We use useSyncExternalStore here instead of useState + useEffect.
 *
 * Reason: matchMedia's value can change outside of React (the user
 * flips an OS setting), and setting state inside an effect body
 * triggers an extra render
 *
 * exactly the pattern the
 * react-hooks/set-state-in-effect lint rule warns about. The server
 * snapshot always assumes reduced motion, so the server and the
 * client's first paint render the same thing; the real value swaps in
 * as soon as the browser confirms it.
 */
function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

/**
 * Moves every googly eye's pupil (`[data-eye]` → `[data-pupil]`,
 * see Eye.tsx) so it follows the mouse cursor.
 *
 * Mounted once in layout.tsx instead of living inside `Eye` itself.
 * Reason: cursor position updates on every frame (60fps-scale),
 * which isn't normal application state. If every `Eye` reacted to
 * `pointermove` on its own, it would
 * (a) force `Eye` to become a Client Component just for motion that's `aria-hidden` anyway
 * (b) still end up writing the same DOM properties this component already writes directly.
 * Full reasoning in docs/adr/0003-cursor-tracking-googly-eyes.md.
 *
 * Renders nothing — it's a pure side effect. On purpose, it behaves
 * differently from the design-ref prototype
 * (design-ref/landing-page.dc.html) in four ways:
 *
 * 1. Also re-aims the eyes on scroll and resize, not just
 *    `pointermove` — otherwise the eyes would keep staring at a fixed
 *    screen position while the page (and the eyes themselves) move
 *    underneath the cursor.
 * 2. Pupils go back to their resting position when the pointer leaves
 *    the window (e.g. switching tabs), instead of staying stuck
 *    wherever they last pointed.
 * 3. Skips touch input (`pointerType !== "mouse"`) and respects
 *    `prefers-reduced-motion: reduce`. The reference prototype does
 *    neither, so touch scrolling or reduced-motion users would see
 *    pupils darting around for no reason.
 * 4. Reads the eye/pupil sizes from the DOM every time instead of
 *    using a hardcoded ratio, so it keeps working even if `Eye` is
 *    ever rebuilt with two separately-sized images (iris + white)
 *    instead of nested divs.
 */
export function EyeTracker() {
  const pathname = usePathname();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    // If reduced motion is on (or we haven't confirmed it's off yet),
    // don't attach any listeners. The pupils' resting position already
    // comes from the `surface-pupil` fallback in globals.css, so
    // there's nothing to reset here either.
    if (prefersReducedMotion) {
      return;
    }

    const pairs: IEyePair[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-eye]"),
    )
      .map((eye) => {
        const pupil = eye.querySelector<HTMLElement>("[data-pupil]");
        return pupil ? { eye, pupil } : null;
      })
      .filter((pair): pair is IEyePair => pair !== null);

    if (pairs.length === 0) {
      return;
    }

    const pointer = { x: 0, y: 0 };

    let hasPointer = false;
    let frame: number | null = null;

    function resetPupils() {
      for (const { pupil } of pairs) {
        pupil.style.removeProperty("--pupil-x");
        pupil.style.removeProperty("--pupil-y");
      }
    }

    // Reads every eye's position first, then writes all the pupil
    // styles afterward. Keeping reads and writes in separate passes
    // avoids forcing the browser to recalculate layout over and over,
    // once per eye.
    function updatePupils() {
      frame = null;

      if (!hasPointer) {
        return;
      }

      for (const { eye, pupil } of pairs) {
        const eyeRect = eye.getBoundingClientRect();

        // Hidden by a responsive class (`hidden md:*` / `md:hidden`) —
        // its size is 0, so there's nothing to aim.
        if (eyeRect.width === 0) {
          continue;
        }

        const pupilWidth = pupil.getBoundingClientRect().width;
        const centerX = eyeRect.left + eyeRect.width / 2;
        const centerY = eyeRect.top + eyeRect.height / 2;
        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;
        const distance = Math.hypot(dx, dy) || 1;
        const maxOffset = Math.max(
          0,
          (eyeRect.width - pupilWidth) / 2 - PUPIL_RIM_PADDING_PX,
        );
        const k = Math.min(1, maxOffset / distance);

        pupil.style.setProperty("--pupil-x", `${(dx * k).toFixed(1)}px`);
        pupil.style.setProperty("--pupil-y", `${(dy * k).toFixed(1)}px`);
      }
    }

    function requestUpdate() {
      if (frame !== null) {
        return;
      }
      frame = requestAnimationFrame(updatePupils);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      hasPointer = true;
      requestUpdate();
    }

    function handleReframe() {
      /**
       * If the mouse hasn't moved yet,
       * there's no cursor position to re-aim toward, so skip it.
       */
      if (hasPointer) {
        requestUpdate();
      }
    }

    function handleLeave() {
      hasPointer = false;
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      resetPupils();
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleReframe, { passive: true });
    window.addEventListener("resize", handleReframe);
    document.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleReframe);
      window.removeEventListener("resize", handleReframe);
      document.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      resetPupils();
    };
  }, [pathname, prefersReducedMotion]);

  return null;
}
