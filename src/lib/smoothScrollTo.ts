const DURATION_MS = 800;

/** easeInOutCubic — slower start/end than the browser's native smooth
 * scroll, which reads as abrupt on long jumps (e.g. header nav to footer). */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** rAF-driven scroll with a custom easing curve. Falls back to an instant
 * jump under prefers-reduced-motion. Honors the target's scroll-margin-top
 * (e.g. `scroll-mt-20`) the same way native scrollIntoView does.
 * `onComplete` fires once the scroll settles (immediately in the
 * reduced-motion branch), so callers can know when it's safe to resume
 * anything that was suspended for the duration of the scroll. */
export function smoothScrollTo(target: HTMLElement, onComplete?: () => void) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const scrollMarginTop = parseFloat(
    getComputedStyle(target).scrollMarginTop || "0",
  );
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - scrollMarginTop;

  if (prefersReducedMotion) {
    window.scrollTo({ top: targetY });
    onComplete?.();
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) {
      startTime = timestamp;
    }

    const progress = Math.min((timestamp - startTime) / DURATION_MS, 1);

    window.scrollTo({ top: startY + distance * easeInOutCubic(progress) });

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(step);
}
