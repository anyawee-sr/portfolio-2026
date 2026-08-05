import NextLink from "next/link";

import type { ICaseStudy } from "@/data/caseStudies";
import { workDetailPath } from "@/data/routes";
import { cn } from "@/lib/cn";

import { CaseStudyChip } from "./ui/CaseStudyChip";
import { ImagePlaceholder } from "./ui/ImagePlaceholder";

export interface ICaseStudyCardProps {
  study: ICaseStudy;
  className?: string;
}

export function CaseStudyCard({ study, className }: ICaseStudyCardProps) {
  return (
    <article
      className={cn(
        "relative flex max-h-112.5 w-64 flex-col rounded-lg bg-surface-card p-5 shadow-xl transition-transform duration-200 hover:-translate-y-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand",
        className,
      )}
    >
      <CaseStudyChip variant={study.type} />
      <h3 className="type-h3 line-clamp-4 text-center text-brand">
        <NextLink
          href={workDetailPath(study.slug)}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {study.title}
        </NextLink>
      </h3>
      <p className="type-body-s line-clamp-3 mt-3 text-center uppercase text-text-secondary">
        {study.subTitle}
      </p>
      <ImagePlaceholder
        alt={study.imageAlt}
        width={216}
        height={151}
        label={`illustration ${study.slug}`}
        className="mt-auto w-full"
      />
    </article>
  );
}
