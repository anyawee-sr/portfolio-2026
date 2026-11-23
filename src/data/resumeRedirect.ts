/**
 * Content for `src/app/resume/page.tsx` — the page the About Me QR stamp
 * points to. It's only on screen for the moment before the PDF opens, so
 * the copy is just a status line plus a manual link for when it doesn't.
 */
export interface IResumeRedirectContent {
  title: string;
  heading: string;
  fallbackLead: string;
  fallbackLabel: string;
}

export const resumeRedirect: IResumeRedirectContent = {
  title: "Resume",
  heading: "Opening resume…",
  fallbackLead: "Not opening?",
  fallbackLabel: "Open the PDF",
};
