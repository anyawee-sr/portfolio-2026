import type { ReactNode } from "react";
import { slugify } from "@/lib/slugify";

export interface IWorkSectionProps {
  heading: string;
  children: ReactNode;
}

export function WorkSection({ heading, children }: IWorkSectionProps) {
  const headingId = `work-section-${slugify(heading)}`;

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-160 px-4 py-10 md:px-0"
    >
      <h2 id={headingId} className="type-h2 text-brand">
        {heading}
      </h2>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}
