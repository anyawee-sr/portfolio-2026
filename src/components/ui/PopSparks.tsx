import { cn } from "@/lib/cn";

/**
 * Decorative comic "pop" burst — three flecks that spring out of a
 * button's top-right corner on hover, then scale up and fade.
 *
 * The parent must be `group relative`: the burst is positioned against
 * it and only animates under `group-hover`/`group-focus-within`.
 */
export interface IPopSparksProps {
  className?: string;
}

export function PopSparks({ className }: IPopSparksProps) {
  return (
    <svg
      viewBox="0 0 251 238"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "pointer-events-none absolute -top-3 -right-2 size-7 origin-bottom-left text-brand opacity-0 group-hover:animate-spark-pop group-focus-within:animate-spark-pop",
        className,
      )}
    >
      <line
        x1="74.15"
        y1="39.43"
        x2="58.26"
        y2="76.6"
        stroke="currentColor"
        strokeWidth="18.02"
        strokeLinecap="round"
      />
      <line
        x1="174.92"
        y1="81.25"
        x2="143.67"
        y2="116.28"
        stroke="currentColor"
        strokeWidth="17.59"
        strokeLinecap="round"
      />
      <line
        x1="200.72"
        y1="191.16"
        x2="160.91"
        y2="195.98"
        stroke="currentColor"
        strokeWidth="16.97"
        strokeLinecap="round"
      />
    </svg>
  );
}
