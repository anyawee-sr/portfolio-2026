import { nav } from "@/data/nav";
import { email, links } from "@/data/links";
import type { Link } from "@/data/types";

export const footer = {
  // Privacy is footer-only — the header nav stays just the homepage sections.
  navigation: [
    ...nav,
    { type: "internal", label: "Privacy", to: "privacy" },
  ] satisfies Link[],
  contact: [email, ...links],
};

export const copyrightYear = new Date().getFullYear();
