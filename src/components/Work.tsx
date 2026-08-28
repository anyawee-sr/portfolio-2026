import { caseStudies } from "@/data/caseStudies";
import type { Link } from "@/data/types";

import { cn } from "@/lib/cn";

import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { Pill } from "@/components/ui/Pill";

const viewAllLink: Link = {
  type: "internal",
  label: "View all",
  to: "workAll",
};

const CARD_LAYOUTS = [
  {
    rotation: "-rotate-6",
    stackMobile: "-translate-x-4 sm:translate-x-0",
    fanLg: "lg:translate-y-8 lg:z-10",
  },
  {
    rotation: "rotate-3",
    stackMobile: "translate-x-4 -mt-12 z-20 sm:translate-x-0 sm:mt-0 sm:z-auto",
    fanLg: "lg:-ml-10 lg:-translate-y-4 lg:z-20",
  },
  {
    rotation: "-rotate-3 sm:rotate-6 md:-rotate-3",
    stackMobile:
      "-translate-x-4 -mt-12 z-30 sm:translate-x-0 sm:mt-0 sm:z-auto",
    fanLg: "lg:-ml-10 lg:-translate-y-6 lg:z-30",
  },
  {
    rotation: "rotate-6 sm:-rotate-3 md:rotate-6",
    stackMobile: "translate-x-4 -mt-12 z-40 sm:translate-x-0 sm:mt-0 sm:z-auto",
    fanLg: "lg:-ml-10 lg:-translate-y-3 lg:z-40",
  },
];

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-20 overflow-x-hidden bg-surface-accent px-4 py-16 md:px-11 md:py-20"
    >
      <h2 id="work-title" className="sr-only">
        Work
      </h2>

      <div className="flex flex-col items-center gap-3.5">
        <p className="type-body-m text-center font-bold text-brand">
          from my work logs
          <br />
          notes, lessons, and small discoveries.
        </p>
        {/* TODO: will display when `/work` page is live */}
        {/* <Pill
          link={viewAllLink}
          arrow={<ArrowRightIcon />}
          className="-rotate-3"
        /> */}
      </div>

      <ul className="mx-auto mt-12 grid max-w-290 grid-cols-1 items-center justify-items-center gap-x-4 gap-y-0 sm:grid-cols-2 sm:gap-y-8 md:mt-14 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-6 lg:flex-nowrap lg:gap-0">
        {caseStudies.map((study, i) => {
          const layout = CARD_LAYOUTS[i % CARD_LAYOUTS.length];

          return (
            <li key={study.slug}>
              <CaseStudyCard
                study={study}
                className={cn(
                  layout.rotation,
                  layout.stackMobile,
                  layout.fanLg,
                )}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
