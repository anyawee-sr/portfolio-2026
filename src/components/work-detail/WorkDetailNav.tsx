import NextLink from "next/link";

import type { ICaseStudy } from "@/data/caseStudies";
import { workDetailPath } from "@/data/routes";

import { ArrowLeftIcon } from "../ui/ArrowLeftIcon";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";

export interface IWorkDetailNavProps {
  prev: ICaseStudy | undefined;
  next: ICaseStudy | undefined;
}

export function WorkDetailNav({ prev, next }: IWorkDetailNavProps) {
  return (
    <nav aria-label="Case studies" className="mx-auto max-w-160">
      <div className="flex flex-col items-start justify-between gap-4 mx-4 py-10 border-t border-dashed border-text-secondary/60 sm:flex-row md:mx-0">
        {prev && (
          <NextLink
            href={workDetailPath(prev.slug)}
            className="group flex min-h-11 min-w-0 w-full flex-col justify-center gap-1 sm:max-w-1/2"
          >
            <span className="type-caption inline-flex items-center gap-1 text-text-secondary">
              <ArrowLeftIcon /> PREVIOUS
            </span>
            <span className="type-body-m line-clamp-2 font-bold text-brand group-hover:underline">
              {prev.title}
            </span>
          </NextLink>
        )}

        {next && (
          <NextLink
            href={workDetailPath(next.slug)}
            className="group flex min-h-11 min-w-0 w-full flex-col items-end justify-center gap-1 text-right ml-auto sm:max-w-1/2"
          >
            <span className="type-caption inline-flex items-center gap-1 text-text-secondary">
              NEXT <ArrowRightIcon />
            </span>
            <span className="type-body-m line-clamp-2 font-bold text-brand group-hover:underline">
              {next.title}
            </span>
          </NextLink>
        )}
      </div>
    </nav>
  );
}
