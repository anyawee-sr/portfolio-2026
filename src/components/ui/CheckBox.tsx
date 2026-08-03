import { cn } from "@/lib/cn";

export interface ICheckBoxProps {
  /**
   * Whether the x is struck into the box. Visual only — this mark is
   * always aria-hidden, so a caller whose checked/unchecked state
   * carries meaning (e.g. "interested in full-time roles") owns saying
   * so in its own accessible text; the box itself announces nothing.
   */
  checked: boolean;
  /**
   * Position of the mark in its list. Selects which jitter preset the
   * x gets and nothing else — repeats wrap — so a caller in a `.map()`
   * can pass its index straight through. Ignored when `checked` is
   * false: only the x jitters, never the brackets — the brackets are
   * what the form prints, the x is what gets typed in.
   */
  index?: number;
}

/* Per-instance jitter for the x. A typewriter never strikes the same
   spot twice, so no two marks in a list sit identically. Capped at
   ±1px / ±5deg: the x is only ~8px tall at type-h4, so anything larger
   stops reading as an off-register strike and starts reading as a
   layout bug. */
const X_JITTER = [
  "translate-x-px -translate-y-px rotate-4",
  "-translate-x-px rotate-2",
  "translate-y-px -rotate-3",
  "-translate-x-px translate-y-px -rotate-5",
];

/**
 * "[ x ]" mark — a checkable bullet, not a real form control: it's
 * never interactive, and is always `aria-hidden` since it draws state
 * rather than announcing it. `checked` only toggles the x's presence;
 * when a caller's checked/unchecked state carries real meaning (e.g.
 * About Me's Information rows treating every link as checked, or a
 * future "interested in full-time" row that isn't), that caller owns
 * saying so via its own accessible text. Drawn from two type layers
 * instead of geometry, matching the card's printed-form/filled-by-hand
 * split: the brackets are Montserrat/brand (what the form prints), the
 * x is Special Elite/ink (what gets typed in), same pairing as the
 * field values and contact URLs beside it. The x is sized past the
 * bracket gap and rotated so it overlaps the bracket strokes rather
 * than sitting neatly inside them — reads as typed, not as a clean UI
 * checkbox. `index` jitters the x's position/tilt per instance so a
 * list of these doesn't look machine-stamped.
 */
export function CheckBox({ checked, index = 0 }: ICheckBoxProps) {
  return (
    <span
      aria-hidden="true"
      className="type-h4 relative inline-flex shrink-0 items-center gap-3 font-sans font-normal text-brand"
    >
      <span>[</span>
      <span>]</span>
      {/* Centered with inset-0 + place-items-center rather than
          top/left-1/2 + -translate-1/2: every Tailwind translate-*
          utility writes the same --tw-translate-* pair, so centering by
          translate would leave no axis free for the jitter. The box is
          full-size and the glyph sits at its center, so rotating the box
          rotates the glyph about its own center. */}
      {checked ? (
        <span
          className={cn(
            "type-h4 font-typewriter absolute inset-0 grid place-items-center font-normal text-text-primary",
            X_JITTER[index % X_JITTER.length],
          )}
        >
          x
        </span>
      ) : null}
    </span>
  );
}
