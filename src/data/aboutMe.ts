export type TAboutMeFieldId =
  "firstname" | "lastname" | "nickname" | "address" | "nationality";

export interface IAboutMeField {
  id: TAboutMeFieldId;
  label: string;
  value: string;
}

export interface IAboutMeContactRow {
  label: string;
  /** Full `mailto:` or `https://` URL — ready to drop into `href`. */
  href: string;
  text: string;
  /** True → render with `target="_blank" rel="noopener noreferrer"`. */
  external: boolean;
}

export interface IAboutMeContact {
  label: string;
  rows: IAboutMeContactRow[];
}

export interface IAboutMeLookingForOption {
  label: string;
  checked: boolean;
}

export interface IAboutMeLookingFor {
  label: string;
  options: IAboutMeLookingForOption[];
}

export interface IAboutMeResume {
  prefix: string;
  label: string;
  href: string;
}

export interface IAboutMe {
  eyebrow: string;
  subcopy: string;
  fields: IAboutMeField[];
  contact: IAboutMeContact;
  lookingFor: IAboutMeLookingFor;
  resume: IAboutMeResume;
}

export const aboutMe: IAboutMe = {
  eyebrow: "About — TL;DR",
  subcopy:
    "Click anywhere on the card to see more, or click a link in information section to jump straight there.",
  fields: [
    { id: "firstname", label: "Firstname", value: "Anyawee" },
    { id: "lastname", label: "Lastname", value: "Sriruttanachai" },
    { id: "nickname", label: "Nickname", value: "Saly" },
    { id: "address", label: "Address", value: "Bangkok, Thailand" },
    { id: "nationality", label: "Nationality", value: "Thai" },
  ],
  contact: {
    label: "Information",
    rows: [
      {
        label: "Email",
        href: "mailto:anyawee.sr@gmail.com",
        text: "anyawee.sr@gmail.com",
        external: false,
      },
      {
        label: "GitHub",
        href: "https://github.com/anyawee-sr",
        text: "github.com/anyawee-sr",
        external: true,
      },
      {
        label: "GitLab",
        href: "https://gitlab.com/anyawee-sr",
        text: "gitlab.com/anyawee-sr",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/anyawee-sr",
        text: "linkedin.com/in/anyawee-sr",
        external: true,
      },
    ],
  },
  lookingFor: {
    label: "Looking for",
    options: [
      { label: "Part-time", checked: false },
      { label: "Freelance", checked: true },
      { label: "Contract", checked: true },
      { label: "Full-time", checked: true },
    ],
  },
  resume: {
    prefix: "Not a scanner?",
    label: "Click here to open",
    href: "https://drive.google.com/file/d/1GlCmxKA-Uxvd2mcoLBm3lxVuWjJ3LSYN/view",
  },
};
