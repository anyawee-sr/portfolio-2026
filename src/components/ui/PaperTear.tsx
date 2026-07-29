import Image from 'next/image';

export type TPaperTearVariant = 'hero-skills' | 'skills-work' | 'header-detail';

export interface IPaperTearProps {
  variant: TPaperTearVariant;
}

const variantSrc = (variant: TPaperTearVariant) => `/images/paper-tear/${variant}.webp`;

export function PaperTear({ variant }: IPaperTearProps) {
  return (
    <div aria-hidden="true" className="relative z-10 h-0">
      <Image
        src={variantSrc(variant)}
        alt=""
        width={1902}
        height={80}
        className="absolute inset-x-0 top-0 h-auto w-full -translate-y-1/2"
        loading="lazy"
      />
    </div>
  );
}
