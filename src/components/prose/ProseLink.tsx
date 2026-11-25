import NextLink from "next/link";
import type { ReactNode } from "react";

export interface IProseLinkProps {
  /** Internal paths start with "/" (uses next/link), "mailto:" stays in the same tab. Anything else is treated as an external http(s) URL. */
  href: string;
  children: ReactNode;
}

export function ProseLink({ href, children }: IProseLinkProps) {
  const className =
    "text-brand underline underline-offset-2 hover:text-brand-hover";

  if (href.startsWith("/")) {
    return (
      <NextLink href={href} className={className}>
        {children}
      </NextLink>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
