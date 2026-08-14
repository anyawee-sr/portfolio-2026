import Image from "next/image";

import { notFound } from "@/data/notFound";

import { Asterisk } from "./ui/Asterisk";
import { Pill } from "./ui/Pill";

/**
 * The 404 page's content, rendered by `src/app/not-found.tsx` — kept as
 * its own component the same way `Hero`/`Skills`/`Work` are their own
 * sections that `page.tsx` composes, rather than being inlined into
 * the route file.
 *
 * The `<main>`'s `data-notfound` attribute is load-bearing — see the
 * sibling-selector rule in `globals.css` that hides BackToTop's
 * bubble (`[data-back-to-top]`) whenever it follows this element.
 */
export function NotFoundSection() {
  return (
    <main
      data-notfound
      className="flex flex-1 items-center overflow-x-hidden surface-graph px-4 py-16 md:px-11"
    >
      <div className="relative mx-auto w-full max-w-290 text-center">
        <div
          aria-hidden="true"
          className="mx-auto w-15 md:absolute md:-top-4 md:left-2/3 md:mx-0 md:w-44 lg:w-66"
        >
          <Asterisk />
        </div>

        <h1 className="type-tagline font-handwriting rotate-3 uppercase text-text-primary">
          {notFound.code}
        </h1>

        <h2 className="type-h1 font-handwriting -rotate-2 uppercase text-text-primary">
          {notFound.headlineLead}{" "}
          <span className="relative inline-block whitespace-nowrap">
            {notFound.headlineUnderlined}
            <Image
              src="/images/not-found/line.webp"
              alt=""
              aria-hidden="true"
              width={598}
              height={26}
              loading="lazy"
              className="absolute inset-x-0 -bottom-3 h-auto w-full"
            />
          </span>
        </h2>

        <p className="type-body-s mx-auto mt-8 max-w-160 uppercase text-text-primary">
          {notFound.description}
        </p>

        <Pill link={notFound.cta} className="mt-8" />
      </div>
    </main>
  );
}
