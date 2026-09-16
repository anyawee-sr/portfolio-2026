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
 * Googly eye — purely decorative, aria-hidden. `data-eye` + `data-pupil`
 * are a DOM contract `EyeTracker` depends on for cursor tracking (see
 * EyeTracker.tsx, docs/adr/0003-cursor-tracking-googly-eyes.md) —
 * resting position comes from `surface-pupil`'s CSS fallback, not a
 * class here.
 *
 * Three image layers, bottom to top: dome and pupil each paint their
 * own `background-image` (`surface-eye`/`surface-pupil`); the glint is
 * a separate element pinned to the dome (`absolute inset-0`), not
 * nested inside the pupil, so it stays fixed while the pupil tracks
 * underneath and visibly lightens under the glint's alpha.
 *
 * The glint's `relative` positioning context lives on an inner wrapper,
 * not this root — callers (Footer, Hero, WorkDetailHero) override this
 * root's position via `className` (e.g. `absolute right-24`) to overlap
 * two Eyes. Tailwind emits `.relative` after `.absolute`, so a
 * `relative` here would always beat a caller's `absolute` and silently
 * break that.
 */
export function Eye({ size, className }: IEyeProps) {
  return (
    <div
      data-eye
      aria-hidden="true"
      className={cn(
        "surface-eye pointer-events-none rounded-full",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div data-pupil className="surface-pupil w-1/2 h-1/2 rounded-full" />
        <div className="surface-eye-glint absolute inset-0 z-10 rounded-full" />
      </div>
    </div>
  );
}
