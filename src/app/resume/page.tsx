import type { Metadata } from "next";

import { resumeRedirect } from "@/data/resumeRedirect";
import { RESUME_PDF_PATH } from "@/lib/resumeQr";

import { ResumeRedirect } from "@/components/ResumeRedirect";

// root layout's title.template appends "— Anyawee Sr." automatically
export const metadata: Metadata = {
  title: resumeRedirect.title,
  // QR landing page only — never a search result. Also left out of sitemap.ts.
  robots: { index: false },
};

/**
 * `/resume/?src=site-qr` — where the About Me QR stamp lands. Sends
 * `resume_qr_open`, then replaces itself with the PDF (see `ResumeRedirect`).
 * The fallback link covers JS being off or the redirect being blocked.
 */
export default function ResumePage() {
  return (
    <main
      data-no-back-to-top
      className="flex flex-1 flex-col items-center justify-center gap-1 bg-surface-accent surface-dotted px-4 py-24 text-center"
    >
      <ResumeRedirect />
      <h1 className="type-h2 text-text-primary">{resumeRedirect.heading}</h1>
      <p className="type-body-l text-text-secondary">
        {resumeRedirect.fallbackLead}{" "}
        <a
          href={RESUME_PDF_PATH}
          className="inline-flex min-h-11 items-center text-brand underline underline-offset-4 hover:decoration-wavy"
        >
          {resumeRedirect.fallbackLabel}
        </a>
      </p>
    </main>
  );
}
