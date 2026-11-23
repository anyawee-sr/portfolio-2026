import type { Metadata } from "next";

import { privacy } from "@/data/privacy";
import type { Link } from "@/data/types";

// root layout's title.template appends "— Anyawee Sr." automatically
export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
};

const linkClassName =
  "text-brand underline underline-offset-4 hover:decoration-wavy";

/** Only external and email links appear in privacy.ts. */
function PrivacyLink({ link }: { link: Link }) {
  if (link.type === "email") {
    return (
      <a href={`mailto:${link.email}`} className={linkClassName}>
        {link.label}
      </a>
    );
  }

  if (link.type === "external") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {link.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return null;
}

/**
 * `/privacy/` — plain-text notice for the GA4 setup (no consent banner;
 * see docs/plans/ga4-analytics.md). Linked from the footer's NAVIGATION.
 */
export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-surface-base px-4 py-16 md:py-24">
      <article className="mx-auto flex max-w-160 flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="type-h2 text-text-primary">{privacy.heading}</h1>
          <p className="type-body-m text-text-secondary">{privacy.updated}</p>
          <p className="type-body-l text-text-primary">{privacy.intro}</p>
        </header>

        {privacy.sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`privacy-${section.id}`}
            className="flex flex-col gap-3"
          >
            <h2
              id={`privacy-${section.id}`}
              className="type-h3 text-text-primary"
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="type-body-l text-text-primary">
                {paragraph}
              </p>
            ))}
            {section.list ? (
              <ul className="type-body-l flex list-disc flex-col gap-1 pl-6 text-text-primary">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.links ? (
              <ul className="type-body-l flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <PrivacyLink link={link} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </main>
  );
}
