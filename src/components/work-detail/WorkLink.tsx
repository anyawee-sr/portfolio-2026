import NextLink from "next/link";
import type { ReactNode } from "react";

export interface IWorkLinkProps {
  /** Internal paths start with "/" (uses next/link). Anything else is treated as an external http(s) URL. */
  href: string;
  children: ReactNode;
}

export function WorkLink({ href, children }: IWorkLinkProps) {
  const className =
    "text-brand underline underline-offset-2 hover:text-brand-hover";

  if (href.startsWith("/")) {
    return (
      <NextLink href={href} className={className}>
        {children}
      </NextLink>
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
