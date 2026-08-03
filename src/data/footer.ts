import { nav } from "./nav";
import { email, links } from "./links";

export const footer = {
  navigation: nav,
  contact: [email, ...links],
};

export const copyrightYear = new Date().getFullYear();
