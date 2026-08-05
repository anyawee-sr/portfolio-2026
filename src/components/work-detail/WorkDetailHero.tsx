import NextLink from "next/link";

import type { ICaseStudy } from "@/data/caseStudies";
import { routes } from "@/data/routes";

import { ArrowLeftIcon } from "../ui/ArrowLeftIcon";
import { CaseStudyChip } from "../ui/CaseStudyChip";
import { Eye } from "../ui/Eye";

export interface IWorkDetailHeroProps {
  study: ICaseStudy;
}

export function WorkDetailHero({ study }: IWorkDetailHeroProps) {
  return (
    <section
      aria-labelledby="work-detail-title"
      className="surface-graph relative overflow-x-hidden px-4 pt-3 pb-4 md:px-11 md:pb-10"
    >
      <div className="relative flex flex-col mx-auto max-w-290">
        <Eye size="md" className="absolute right-8 top-10" />
        <Eye
          size="md"
          className="absolute right-24 top-4 sm:right-30 md:right-36"
        />

        <NextLink
          href={routes.work}
          className="type-label -ml-2 inline-flex min-h-11 items-center gap-2 rounded-sm px-2 uppercase text-text-primary transition-colors hover:text-brand"
        >
          <ArrowLeftIcon /> Work
        </NextLink>

        <CaseStudyChip variant={study.type} />

        <h1
          id="work-detail-title"
          className="type-h1 text-brand line-clamp-3 sm:line-clamp-2 lg:max-w-4/5"
        >
          {study.title}
        </h1>
        <p className="type-body-l mt-4 max-w-160 text-text-primary line-clamp-5 md:line-clamp-2">
          {study.subTitle}
        </p>
      </div>
    </section>
  );
}
