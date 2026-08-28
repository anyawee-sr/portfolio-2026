import { nav } from "@/data/nav";
import { email, links } from "@/data/links";

export const footer = {
  navigation: nav,
  contact: [email, ...links],
};

export const copyrightYear = new Date().getFullYear();
