import { cn } from "@/lib/cn";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** Closed set, not a className passthrough — cn() has no tailwind-merge to resolve two rotations. */
export type TWorkImageRotation =
  "-rotate-2" | "-rotate-1" | "rotate-0" | "rotate-1" | "rotate-2";

export interface IWorkFigureProps {
  /** Omit to render the placeholder box; pass once a real asset exists. */
  src?: string;
  /** Real description, or "" for a purely decorative image (CLAUDE.md image rules). */
  alt: string;
  width: number;
  height: number;
  label: string;
  caption?: string;
  /** Vary it between neighbouring images so a set doesn't tilt in lockstep. */
  rotation?: TWorkImageRotation;
}

export function WorkImage({
  src,
  alt,
  width,
  height,
  label,
  caption,
  rotation = "-rotate-1",
}: IWorkFigureProps) {
  return (
    <figure className={cn("rounded-lg bg-white p-2 shadow-xl", rotation)}>
      <ImagePlaceholder
        src={src}
        alt={alt}
        width={width}
        height={height}
        label={label}
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
