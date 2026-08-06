export interface IWorkEmbedProps {
  /** YouTube video ID only — not the full watch URL. */
  videoId: string;
  /** Accessible name for the iframe — describe the video, not a generic label. */
  title: string;
  caption?: string;
}

/**
 * Video sibling of WorkFigure — same paper-card shell (bg-surface-card,
 * shadow-xl), but deliberately NOT rotated: a video is a screen, not a
 * sheet of paper, so it doesn't take the site's tilt language.
 */
export function WorkEmbed({ videoId, title, caption }: IWorkEmbedProps) {
  return (
    <figure className="bg-surface-card p-2 shadow-xl">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      {caption ? (
        <figcaption className="type-caption mt-2 px-1 pb-1 text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
