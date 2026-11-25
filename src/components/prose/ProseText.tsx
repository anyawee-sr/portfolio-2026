import type { ReactNode } from "react";

// TODO: will refactor for stronger type safety in the future
export interface IProseTextProps {
  paragraphs: readonly ReactNode[];
}

export function ProseText({ paragraphs }: IProseTextProps) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="type-body-l text-text-primary">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
