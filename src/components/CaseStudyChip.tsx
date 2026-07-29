import type { ICaseStudy } from '@/data/caseStudies';
import { cn } from '@/lib/cn';

/**
 * Discipline chip on each case study card — 'frontend' solid, 'editor' outline.
 * Lives alongside CaseStudyCard.tsx (not `ui/`) since only that card uses it.
 */
export interface ICaseStudyChipProps {
  variant: ICaseStudy['type'];
}

export function CaseStudyChip({ variant }: ICaseStudyChipProps) {
  return (
    <span
      className={cn(
        'type-chip mb-4 inline-block w-max rounded-full border px-3 py-1 uppercase',
        variant === 'frontend' ? 'border-brand bg-brand text-surface-base' : 'border-brand text-brand'
      )}
    >
      {variant}
    </span>
  );
}
