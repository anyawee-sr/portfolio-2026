import type { ICaseStudy } from "@/data/caseStudies";
import { cn } from "@/lib/cn";

/**
 * Discipline chip — 'frontend' solid, 'editor' outline. Shared between
 * CaseStudyCard.tsx (Work section grid) and WorkDetailHero.tsx (/work/[slug]
 * hero band), both driven by the same `study.type` value.
 */
export interface ICaseStudyChipProps {
  variant: ICaseStudy["type"];
}

// TODO: maybe change name?
export function CaseStudyChip({ variant }: ICaseStudyChipProps) {
  return (
    <span
      className={cn(
        "type-chip mb-4 inline-block w-max rounded-full border px-3 py-1 uppercase",
        variant === "frontend"
          ? "border-brand bg-brand text-surface-base"
          : "border-brand text-brand",
      )}
    >
      {variant}
    </span>
  );
}
