import { track } from "@/lib/analytics";

/** Where `/resume/` finally sends the visitor. */
export const RESUME_PDF_PATH = "/resume.pdf";

/** Longest wait for GA before leaving anyway (blocked, slow, or not loaded). */
export const REDIRECT_TIMEOUT_MS = 1000;

/** `?src=site-qr` → `"site-qr"`; missing or empty → `"unknown"`. */
export function readQrSource(search: string): string {
  return new URLSearchParams(search).get("src") || "unknown";
}

/**
 * Reports `resume_qr_open`, then calls `redirect` exactly once — as soon as GA
 * confirms the hit, or after `timeoutMs` if it never does.
 */
export function trackThenRedirect(
  src: string,
  redirect: () => void,
  timeoutMs = REDIRECT_TIMEOUT_MS,
): void {
  let done = false;

  const finish = () => {
    if (done) {
      return;
    }

    done = true;

    clearTimeout(timer);
    redirect();
  };

  const timer = setTimeout(finish, timeoutMs);

  track("resume_qr_open", { src }, { onSent: finish });
}
