import { cn } from "@/lib/cn";

export interface IWorkVideoProps {
  src: string;
  /** Still shown before playback — iOS Safari shows nothing without one. */
  poster: string;
  /** Accessible name for the video — describe what it shows, not a generic label. */
  label: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
}

/**
 * Self-hosted sibling of WorkEmbed — same untilted paper-card shell, for short
 * silent clips. Plays only on request, so there's no autoplay motion to guard
 * for prefers-reduced-motion.
 */
export function WorkVideo({
  src,
  poster,
  label,
  width,
  height,
  caption,
  className,
}: IWorkVideoProps) {
  return (
    <figure className={cn("rounded-lg bg-white p-4 shadow-2xl", className)}>
      <video
        src={src}
        poster={poster}
        aria-label={label}
        width={width}
        height={height}
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-sm"
      />
      {caption ? (
        <figcaption className="type-caption mt-2 px-1 pb-1 text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
