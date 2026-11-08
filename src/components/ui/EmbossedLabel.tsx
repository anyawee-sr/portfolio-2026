import { cn } from "@/lib/cn";

export interface IEmbossedLabelProps {
  label: string;
  /** One of Tailwind's built-in `rotate-*`/`-rotate-*` utilities — sets the resting tilt. */
  rotationClass: string;
  /** Caller-supplied positioning (e.g. `absolute -top-3 -left-3`) — EmbossedLabel only owns its own look. */
  className?: string;
}

/**
 * Label-maker tape stuck onto something — deliberately static (no hover,
 * no pill shape) so it never reads as a button the way `Sticker` can. */
export function EmbossedLabel({
  label,
  rotationClass,
  className,
}: IEmbossedLabelProps) {
  return (
    <span
      className={cn(
        "surface-embossed-tape type-tape inline-flex items-center whitespace-nowrap px-3 py-1.5 uppercase text-surface-base shadow-lg",
        rotationClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
