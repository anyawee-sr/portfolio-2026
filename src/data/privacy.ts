import { email } from "@/data/links";
import type { Link } from "@/data/types";

/**
 * Content for `src/app/privacy/page.tsx`. Every claim here mirrors a real
 * setting — GA Admin (retention, Signals off, ads off) and the events in
 * `src/lib/analytics.ts` — so change this file whenever one of those does.
 */
export interface IPrivacySection {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
  links?: Link[];
}

export interface IPrivacyContent {
  title: string;
  description: string;
  heading: string;
  updated: string;
  intro: string;
  sections: IPrivacySection[];
}

export const privacy: IPrivacyContent = {
  title: "Privacy",
  description:
    "What this portfolio measures with Google Analytics, and how to opt out.",
  heading: "Privacy",
  updated: "Last updated: November 25, 2026",
  intro:
    "This is a personal portfolio. It uses Google Analytics 4 to count visits and see which work people read — that's the only analytics on the site.",
  sections: [
    {
      id: "collect",
      heading: "What this site collects",
      paragraphs: ["Google Analytics records usage data, including:"],
      list: [
        "Pages you visit and how far you scroll",
        "Approximate location (country or city) — Google Analytics doesn't store IP addresses",
        "Device type, browser, and screen size",
        "The site that linked you here",
        "Clicks on email links, case studies, outbound links, and the resume PDF, and when you play a video",
        "When you open the resume through the QR code, and which QR code it was",
      ],
    },
    {
      id: "not-collect",
      heading: "What it doesn't collect",
      paragraphs: [
        "No names, email addresses, or anything you type. There are no forms and no accounts on this site.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      paragraphs: [
        "Google Analytics sets two first-party cookies, _ga and _ga_<ID>, to tell visits apart. They expire after up to 2 years.",
        "There are no advertising cookies. Google Signals and ad personalization are turned off.",
      ],
    },
    {
      id: "why",
      heading: "Why",
      paragraphs: [
        "To learn which work people read and whether the site is easy to use. There are no ads, and the data is never sold.",
      ],
    },
    {
      id: "retention",
      heading: "How long it's kept",
      paragraphs: [
        "Event-level data is deleted automatically after 14 months.",
      ],
    },
    {
      id: "third-parties",
      heading: "Third parties",
      paragraphs: [
        "Google processes the analytics data on this site's behalf.",
        "One case study embeds a YouTube video using privacy-enhanced mode (youtube-nocookie.com). Loading that page connects your browser to YouTube.",
      ],
      links: [
        {
          type: "external",
          label: "How Google uses information from sites that use its services",
          href: "https://policies.google.com/technologies/partner-sites",
        },
      ],
    },
    {
      id: "opt-out",
      heading: "How to opt out",
      paragraphs: [
        "Install Google's opt-out add-on, or block cookies or trackers in your browser. The site works the same either way.",
      ],
      links: [
        {
          type: "external",
          label: "Google Analytics Opt-out Browser Add-on",
          href: "https://tools.google.com/dlpage/gaoptout",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      paragraphs: ["Questions about your data? Send me an email."],
      links: [{ ...email, label: email.email }],
    },
  ],
};
