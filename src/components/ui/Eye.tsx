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
 * Renders static for now; the pupil is its own element carrying
 * `data-pupil` so a later cursor-tracking pass (see CLAUDE.md — eyes
 * follow the cursor in design-ref, deferred here) can drive its
 * transform without touching this markup. Any future animation must
 * respect prefers-reduced-motion (handled globally in globals.css).
 *
 * NOTE: will replace with eyes image later
 */
export function Eye({ size, className }: IEyeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "surface-eye pointer-events-none rounded-full flex items-center justify-center",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <div
        data-pupil
        className="surface-pupil relative w-1/2 h-1/2 rounded-full translate-y-1"
      >
        <span className="surface-eye-glint absolute top-1 left-1 w-1.5 h-1.5 rounded-full" />
      </div>
    </div>
  );
}
