import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { caseStudies } from "@/data/caseStudies";

import { PaperTear } from "@/components/ui/PaperTear";
import { workDetailBodies } from "@/components/work-detail/bodies";
import { WorkDetailHero } from "@/components/work-detail/WorkDetailHero";
import { WorkDetailNav } from "@/components/work-detail/WorkDetailNav";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    return {};
  }

  return {
    title: `${study.title} — Anyawee Sr.`,
    description: study.subTitle,
  };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = caseStudies.findIndex((item) => item.slug === slug);

  if (index === -1) {
    notFound();
  }

  const study = caseStudies[index];

  const prev = index > 0 ? caseStudies[index - 1] : undefined;
  const next =
    index < caseStudies.length - 1 ? caseStudies[index + 1] : undefined;

  const Body = workDetailBodies[study.slug];

  return (
    <main className="flex-1">
      <WorkDetailHero study={study} />
      <PaperTear variant="header-detail" />
      <div className="bg-surface-base surface-dotted overflow-x-hidden">
        <Body />
        <WorkDetailNav prev={prev} next={next} />
      </div>
    </main>
  );
}
