import type { JSX } from 'react';

import { cn } from '@/lib/cn';

export type TStickerVariant = 'tag' | 'skill';

export interface IStickerProps {
  label: string;
  /**
   * 'tag' = solid brand pill (hero)
   * 'skill' = outlined pink pill (skill wall)
   */
  variant: TStickerVariant;
  /** One of Tailwind's built-in `rotate-*`/`-rotate-*` utilities — sets the resting tilt. */
  rotationClass: string;
  /** HTML tag to render — e.g. 'li' when the parent is a <ul> (skill wall), 'span' for absolutely-positioned hero tags. */
  as?: keyof JSX.IntrinsicElements;
  /** Caller-supplied positioning (e.g. `absolute top-8 left-2/3`) — Sticker only owns its own shape/color. */
  className?: string;
}

const VARIANT_CLASSES: Record<TStickerVariant, string> = {
  tag: 'bg-brand text-surface-base shadow-md',
  skill: 'bg-surface-accent text-brand border border-brand shadow-sm',
};

export function Sticker({ label, variant, rotationClass, as = 'span', className }: IStickerProps) {
  const Tag = as;

  return (
    <Tag
      className={cn(
        'type-label inline-flex items-center whitespace-nowrap rounded-full px-4 py-2.5 transition-transform duration-200 ease-out hover:rotate-0 hover:scale-105',
        VARIANT_CLASSES[variant],
        rotationClass,
        className
      )}
    >
      {label}
    </Tag>
  );
}
