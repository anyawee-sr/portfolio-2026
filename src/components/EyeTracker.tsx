"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * TODO: mobile has no mouse pointer — pupils should jiggle via device
 * tilt/shake (`devicemotion`) instead.
 */

/** Gap kept between the pupil and the eye's edge at max travel — stops
 * it from visually poking through the white. */
const PUPIL_RIM_PADDING_PX = 3;

interface IEyePair {
  eye: HTMLElement;
  pupil: HTMLElement;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * useSyncExternalStore instead of useState+useEffect: matchMedia can
 * change outside of React (an OS-level setting), and setting state
 * inside an effect body would trigger an extra render — the exact
 * pattern react-hooks/set-state-in-effect warns about. Server snapshot
 * always assumes reduced motion, so SSR and first paint match; the real
 * value swaps in once the browser confirms it.
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
 * Moves every googly eye's pupil (`[data-eye]` → `[data-pupil]`, see
 * Eye.tsx) to follow the mouse. Mounted once in layout.tsx instead of
 * living inside `Eye` itself — pointer position updates every frame, so
 * per-Eye tracking would (a) force `Eye` into a Client Component for
 * motion that's `aria-hidden` anyway, and (b) duplicate the same DOM
 * writes across instances. Full reasoning:
 * docs/adr/0003-cursor-tracking-googly-eyes.md.
 *
 * Renders nothing. Deliberately differs from the design-ref prototype
 * (design-ref/landing-page.dc.html) in four ways:
 * 1. Re-aims on scroll/resize too, not just `pointermove` — otherwise
 *    eyes stare at a fixed screen point while the page moves under them.
 * 2. Pupils reset to resting position when the pointer leaves the
 *    window, instead of staying stuck at their last position.
 * 3. Skips touch (`pointerType !== "mouse"`) and respects
 *    `prefers-reduced-motion` — the prototype does neither.
 * 4. Reads eye/pupil sizes from the DOM instead of a hardcoded ratio,
 *    so it survived `Eye` being rebuilt with real images unchanged.
 */
export function EyeTracker() {
  const pathname = usePathname();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    // Reduced motion (or not yet confirmed off): skip entirely —
    // resting position already comes from the surface-pupil CSS fallback.
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

    // Read all eye positions first, then write — avoids layout
    // thrashing from interleaving reads/writes per eye.
    function updatePupils() {
      frame = null;

      if (!hasPointer) {
        return;
      }

      for (const { eye, pupil } of pairs) {
        const eyeRect = eye.getBoundingClientRect();

        // Hidden via responsive class (width 0) — nothing to aim.
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
      // No cursor position yet to re-aim toward.
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
