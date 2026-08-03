import NextLink from "next/link";

import { copyrightYear, footer } from "@/data/footer";
import { routes } from "@/data/routes";

import { Eye } from "./ui/Eye";

export function Footer() {
  return (
    <footer className="on-brand bg-brand px-4 py-10 text-surface-base md:px-11">
      <div className="mx-auto grid max-w-290 grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-10 md:gap-11">
        <div className="col-span-2 flex justify-between gap-4 md:col-span-3 md:block">
          <div>
            <div className="type-h2 max-w-74">ANYAWEE SR.</div>
            <p className="type-caption mt-2 text-surface-base/75">
              © {copyrightYear} ANYAWEE SR.
              <br />
              ALL RIGHTS RESERVED
            </p>
          </div>
          <div aria-hidden="true" className="flex md:hidden relative">
            <Eye size="md" className="absolute right-18 -bottom-4" />
            <Eye size="md" />
          </div>
        </div>

        <div className="md:col-span-2">
          <h3
            id="footer-nav-title"
            className="type-caption mb-3 text-surface-base/55"
          >
            NAVIGATION
          </h3>
          <ul
            aria-labelledby="footer-nav-title"
            className="flex flex-col gap-1"
          >
            {footer.navigation.map((link) =>
              link.type === "internal" ? (
                <li key={link.label}>
                  <NextLink
                    href={routes[link.to]}
                    className="type-body-m text-surface-base uppercase"
                  >
                    {link.label}
                  </NextLink>
                </li>
              ) : null,
            )}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3
            id="footer-contact-title"
            className="type-caption mb-3 text-surface-base/55"
          >
            CONTACT
          </h3>
          <ul
            aria-labelledby="footer-contact-title"
            className="flex flex-col gap-1"
          >
            {footer.contact.map((link) => {
              if (link.type === "email") {
                return (
                  <li key={link.label}>
                    <a
                      href={`mailto:${link.email}`}
                      className="type-body-m text-surface-base uppercase"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              }

              if (link.type !== "external") {
                return null;
              }

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-body-m text-surface-base uppercase"
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="hidden md:col-span-3 md:flex md:justify-end relative mt-10"
        >
          <Eye size="md" className="absolute right-22 -bottom-4" />
          <Eye size="md" className="absolute" />
        </div>
      </div>
    </footer>
  );
}
