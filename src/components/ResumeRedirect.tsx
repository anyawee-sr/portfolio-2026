"use client";

import { useEffect } from "react";

import {
  readQrSource,
  RESUME_PDF_PATH,
  trackThenRedirect,
} from "@/lib/resumeQr";

/**
 * Reports `resume_qr_open`, then swaps `/resume/` for the PDF. Renders
 * nothing — the visible status and fallback link live in the server page so
 * they still work with JS off.
 *
 * Deferred by one task: `<GoogleAnalytics>` injects GA's init script from its
 * own effect, which runs *after* this one (it sits after `<body>` in
 * layout.tsx), so `window.gtag` doesn't exist yet on the first effect pass.
 * The cleanup also cancels Strict Mode's throwaway first mount in dev, so
 * only one event is sent.
 */
export function ResumeRedirect() {
  useEffect(() => {
    const id = setTimeout(() => {
      trackThenRedirect(readQrSource(window.location.search), () => {
        window.location.replace(RESUME_PDF_PATH);
      });
    }, 0);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return null;
}
