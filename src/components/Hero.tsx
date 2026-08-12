import NextLink from "next/link";

import { heroTags } from "@/data/heroTags";
import { links } from "@/data/links";
import { routes } from "@/data/routes";

import { Eye } from "./ui/Eye";
import { Sticker } from "./ui/Sticker";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";

/**
 * TODO: will update tag position later
 */
const HERO_TAG_POSITIONS = [
  "top-0 left-2/3", // TypeScript
  "top-1/9 right-1/8 lg:right-1/5 xl:right-1/6", // Coding
  "top-1/4 left-1/4", // Movie
  "top-3/5 right-4/5 lg:right-3/4 xl:right-3/4", // Travel
  "top-3/5 right-1/14 lg:right-1/8 xl:right-1/6", // Eating
  "bottom-1/5 right-6/9", // Storyteller
];

const HERO_TAG_ROTATIONS = [
  "rotate-6",
  "rotate-1",
  "-rotate-7",
  "-rotate-3",
  "rotate-4",
  "rotate-2",
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative surface-dotted overflow-x-hidden px-4 py-18 md:px-11 md:py-20"
    >
      <div
        aria-hidden="true"
        className="mb-8 flex items-center justify-center gap-6 md:hidden"
      >
        <Eye size="sm" className="absolute right-6 bottom-3 sm:right-1/7 sm:bottom-1/3" />
        <Eye size="md" className="absolute left-3 top-1/5 sm:left-1/8" />
        <Eye size="lg" className="absolute z-11 right-1/10 bottom-1/7 sm:bottom-4 sm:right-1/5" />
      </div>

      <div className="relative mx-auto max-w-290 md:min-h-100">
        <div aria-hidden="true" className="hidden md:contents">
          <div className="absolute -bottom-4 right-1/8 lg:right-1/7 xl:right-1/5">
            <Eye size="sm" />
          </div>
          <div className="absolute top-0 left-1/8">
            <Eye size="md" />
          </div>
          <div className="absolute z-11 top-3/5 right-1/6 lg:right-1/5 xl:right-1/4">
            <Eye size="lg" />
          </div>
        </div>

        <div className="hidden md:contents">
          {heroTags.map((tag, i) => (
            <Sticker
              key={tag}
              label={tag}
              variant="tag"
              rotationClass={HERO_TAG_ROTATIONS[i]}
              className={`uppercase absolute z-10 ${HERO_TAG_POSITIONS[i]}`}
            />
          ))}
        </div>

        <h1
          id="hero-name"
          className="type-display relative z-0 text-center text-text-primary md:absolute md:inset-0 md:flex md:flex-col md:items-center md:justify-center"
        >
          Anyawee Sr.
          <span className="block type-h3 md:type-h2">Frontend Engineer</span>
        </h1>
      </div>

      <div className="mx-auto mt-8 flex max-w-290 items-center justify-between px-1 md:mt-12">
        <NextLink
          href={routes.work}
          className="hidden type-body-m font-bold text-brand underline-offset-2 hover:underline md:inline-flex md:items-center md:gap-1"
        >
          from my work logs <ArrowRightIcon />
        </NextLink>
        <ul
          className="hidden items-center gap-6 md:flex"
          aria-label="Social links"
        >
          {links.map((link) =>
            link.type === "external" ? (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-body-m font-bold text-brand underline-offset-2 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </section>
  );
}
