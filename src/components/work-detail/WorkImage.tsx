import { cn } from "@/lib/cn";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { EmbossedLabel } from "@/components/ui/EmbossedLabel";

/** Closed set, not a className passthrough — cn() has no tailwind-merge to resolve two rotations. */
export type TWorkImageRotation =
  "-rotate-2" | "-rotate-1" | "rotate-0" | "rotate-1" | "rotate-2";

export interface IWorkImageTag {
  label: string;
  /** Top corner the tag hangs off — put a pair's tags on their outer corners. */
  side: "left" | "right";
}

/** Corner below md (images stack); centered on the top edge from md up, where the pair sits side by side. */
const TAG_SIDE_CLASSES: Record<IWorkImageTag["side"], string> = {
  left: "-top-3 -left-3 md:left-1/2 md:-translate-x-1/2",
  right: "-top-3 -right-3 md:right-auto md:left-1/2 md:-translate-x-1/2",
};

/** Tilts against the card's own lean so the tag reads as stuck on afterwards. */
const TAG_SIDE_ROTATIONS: Record<IWorkImageTag["side"], string> = {
  left: "-rotate-2",
  right: "rotate-3",
};

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
  /** Embossed label over a top corner, e.g. "Before"/"After" on a comparison pair. */
  tag?: IWorkImageTag;
}

export function WorkImage({
  src,
  alt,
  width,
  height,
  label,
  caption,
  rotation = "-rotate-1",
  tag,
}: IWorkFigureProps) {
  return (
    <figure
      className={cn("relative rounded-lg bg-white p-2 shadow-xl", rotation)}
    >
      <ImagePlaceholder
        src={src}
        alt={alt}
        width={width}
        height={height}
        label={label}
        className="w-full rounded-sm"
      />
      {tag ? (
        <EmbossedLabel
          label={tag.label}
          rotationClass={TAG_SIDE_ROTATIONS[tag.side]}
          className={cn("absolute", TAG_SIDE_CLASSES[tag.side])}
        />
      ) : null}
      {caption ? (
        <figcaption className="type-caption mt-2 px-1 pb-1 text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
