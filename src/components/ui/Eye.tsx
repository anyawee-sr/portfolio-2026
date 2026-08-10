import { cn } from "@/lib/cn";

export type TEyeSize = "sm" | "md" | "lg";

export interface IEyeProps {
  size: TEyeSize;
  className?: string;
}

const SIZE_CLASSES: Record<TEyeSize, string> = {
  sm: "size-8 sm:size-10 md:size-14",
  md: "size-12 sm:size-16 md:size-20",
  lg: "size-18 sm:size-24 md:size-30",
};

/**
 * Googly eye — purely decorative, never announced by a screen reader.
 * `data-eye` on the root plus `data-pupil` on the direct child is a
 * contract `EyeTracker` (src/components/EyeTracker.tsx) depends on: it
 * queries every `[data-eye]` on the page, measures the root and pupil as
 * circles, and drives the pupil's position by writing `--pupil-x`/
 * `--pupil-y` custom properties (consumed by `surface-pupil` in
 * globals.css) — it never touches this markup. Resting position (no JS,
 * reduced-motion) comes from that utility's fallback values, not from a
 * class here. See docs/adr/0003-cursor-tracking-googly-eyes.md.
 *
 * NOTE: will replace with eyes image later
 */
export function Eye({ size, className }: IEyeProps) {
  return (
    <div
      data-eye
      aria-hidden="true"
      className={cn(
        "surface-eye pointer-events-none rounded-full flex items-center justify-center",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div
        data-pupil
        className="surface-pupil relative w-1/2 h-1/2 rounded-full"
      >
        <span className="surface-eye-glint absolute top-1 left-1 w-1.5 h-1.5 rounded-full" />
      </div>
    </div>
  );
}
