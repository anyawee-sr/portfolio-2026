import NextLink from "next/link";

import { heroTags } from "@/data/heroTags";
import { links } from "@/data/links";
import { routes } from "@/data/routes";

import { Eye } from "./ui/Eye";
import { Sticker } from "./ui/Sticker";

/**
 * TODO: will update tag position later
 */
const HERO_TAG_POSITIONS = [
  "top-8 left-2/3", // TypeScript
  "top-20 left-3/4", // Coding
  "top-1/3 left-1/4", // Movie
  "top-1/2 left-2/3", // Travel
  "top-2/3 right-8", // Eating
  "bottom-12 left-1/4", // Storyteller
];

const HERO_TAG_ROTATIONS = [
  "-rotate-3",
  "rotate-3",
  "-rotate-6",
  "rotate-2",
  "-rotate-2",
  "-rotate-1",
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative overflow-x-hidden px-4 py-16 md:px-11 md:py-20"
    >
      <div
        aria-hidden="true"
        className="mb-8 flex items-center justify-center gap-6 md:hidden"
      >
        <Eye size="md" className="absolute right-18 top-4" />
        <Eye size="lg" className="absolute top-4 left-4" />
        <Eye size="md" className="absolute right-10 top-6" />
      </div>

      {/* TODO: will remove `bg-yellow-100` */}
      <div className="relative mx-auto max-w-290 md:min-h-140">
        <div aria-hidden="true" className="hidden md:contents">
          <div className="absolute top-0 left-1/8">
            <Eye size="md" />
          </div>
          <div className="absolute top-3/5 right-1/5">
            <Eye size="lg" />
          </div>
          <div className="absolute bottom-8 right-1/7">
            <Eye size="md" />
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
          <span className="block type-h1">Frontend Engineer</span>
        </h1>
      </div>

      <div className="mx-auto mt-8 flex max-w-290 items-center justify-between px-1 md:mt-12">
        <NextLink
          href={routes.work}
          className="hidden type-body-m font-bold text-brand md:inline-flex md:items-center md:gap-2"
        >
          {/* TODO: will update `↗` to use `<ArrowRightIcon />` */}
          from my work logs <span aria-hidden="true">↗</span>
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
                  className="type-body-m font-bold text-brand"
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
