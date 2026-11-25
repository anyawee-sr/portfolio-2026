import type { Metadata } from "next";

import { privacy } from "@/data/privacy";
import type { Link } from "@/data/types";

import { ProseLink } from "@/components/prose/ProseLink";
import { ProseList } from "@/components/prose/ProseList";
import { ProseSection } from "@/components/prose/ProseSection";
import { ProseText } from "@/components/prose/ProseText";

// root layout's title.template appends "— Anyawee Sr." automatically
export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
};

/** Only external and email links appear in privacy.tsx. */
function PrivacyLink({ link }: { link: Link }) {
  if (link.type === "email") {
    return <ProseLink href={`mailto:${link.email}`}>{link.label}</ProseLink>;
  }

  if (link.type === "external") {
    return <ProseLink href={link.href}>{link.label}</ProseLink>;
  }

  return null;
}

/**
 * `/privacy/` — notice for the GA4 setup (no consent banner; see
 * docs/plans/ga4-analytics.md). Linked from the footer's NAVIGATION.
 */
export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-surface-base surface-dotted overflow-x-hidden py-10 md:py-16">
      <article>
        <header className="mx-auto flex max-w-180 flex-col gap-4 px-4 pb-6 md:px-0">
          <h1 className="type-h1 text-brand">{privacy.heading}</h1>
          <p className="type-body-m text-text-secondary">{privacy.updated}</p>
          <p className="type-body-l text-text-primary">{privacy.intro}</p>
        </header>

        {privacy.sections.map((section) => (
          <ProseSection key={section.id} heading={section.heading}>
            <ProseText paragraphs={section.paragraphs} />
            {section.list ? <ProseList items={section.list} /> : null}
            {section.links ? (
              <ul className="type-body-l flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <PrivacyLink link={link} />
                  </li>
                ))}
              </ul>
            ) : null}
          </ProseSection>
        ))}
      </article>
    </main>
  );
}
