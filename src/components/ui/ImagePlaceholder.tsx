import Image from 'next/image';

import { cn } from '@/lib/cn';

export interface IImagePlaceholderProps {
  /** Omit to render the placeholder box; pass once a real asset exists. */
  src?: string;
  /** Real description, or "" for a purely decorative image (CLAUDE.md image rules). */
  alt: string;
  width: number;
  height: number;
  /** Dev-facing hint shown only in the placeholder state, e.g. "illustration 01". */
  label: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  label,
  className,
  loading = 'lazy',
}: IImagePlaceholderProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={cn('object-cover', className)}
      />
    );
  }

  const isDecorative = alt === '';

  return (
    <div
      aria-hidden={isDecorative || undefined}
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : alt || label}
      className={cn(
        'flex items-center justify-center rounded-sm border border-dashed border-text-secondary/40 bg-surface-accent/40 type-caption text-text-secondary text-center',
        className
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {label}
    </div>
  );
}
