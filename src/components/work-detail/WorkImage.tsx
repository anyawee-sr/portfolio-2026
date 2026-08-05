import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export interface IWorkFigureProps {
  /** Omit to render the placeholder box; pass once a real asset exists. */
  src?: string;
  /** Real description, or "" for a purely decorative image (CLAUDE.md image rules). */
  alt: string;
  width: number;
  height: number;
  label: string;
  caption?: string;
}

export function WorkImage({
  src,
  alt,
  width,
  height,
  label,
  caption,
}: IWorkFigureProps) {
  return (
    <figure className="-rotate-1 bg-surface-card p-2 shadow-xl">
      <ImagePlaceholder
        src={src}
        alt={alt}
        width={width}
        height={height}
        label={label}
        className="w-full"
      />
      {caption ? (
        <figcaption className="type-caption mt-2 px-1 pb-1 text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
