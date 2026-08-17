import Image from "next/image";

import { notFound } from "@/data/notFound";
import { cn } from "@/lib/cn";

import { Pill } from "./ui/Pill";
import { PopSparks } from "./ui/PopSparks";
import { Asterisk } from "@/components/ui/Asterisk";

/**
 * Tape strips pinning the 404 card to the page. Config lives at module
 * scope the same way `HERO_TAG_POSITIONS` (Hero.tsx) and `CARD_LAYOUTS`
 * (Work.tsx) do — one array to scan instead of four near-identical
 * `<Image>` blocks. `size` is two steps (md/lg), not a `clamp()`, because
 * the card itself only has two sizes (card-mobile.webp / card.webp) — see
 * the `type-scrawl`/`type-scribble` comment in globals.css for why.
 *
 * Every tape lives inside the card's rotated wrapper, so it tilts with
 * the paper like a real strip pressed onto it. None of these get their
 * own `rotate-*` — the tilt is already baked into each source image
 * (same convention as `Asterisk.tsx`).
 */
const TAPES = [
  {
    side: "top",
    width: 247,
    height: 79,
    size: "w-49 lg:w-56",
    position: "top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-10 lg:top-0 lg:rotate-0",
  },
  {
    side: "right",
    width: 74,
    height: 224,
    size: "w-14 lg:w-15",
    position: "top-1/2 right-0 translate-x-2 -translate-y-1/2",
  },
  {
    side: "bottom",
    width: 462,
    height: 131,
    size: "w-88 lg:w-90",
    position: "bottom-6 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-4 lg:bottom-2",
  },
  {
    side: "left",
    width: 89,
    height: 280,
    size: "w-17 lg:w-18",
    position: "top-1/2 left-0 -translate-x-2 -translate-y-1/2 lg:-left-6",
  },
] as const;

/**
 * The 404 page's content, rendered by `src/app/not-found.tsx` — kept as
 * its own component the same way `Hero`/`Skills`/`Work` are their own
 * sections that `page.tsx` composes, rather than being inlined into
 * the route file.
 *
 * The `<main>`'s `data-notfound` attribute is load-bearing — see the
 * sibling-selector rule in `globals.css` that hides BackToTop's
 * bubble (`[data-back-to-top]`) whenever it follows this element.
 *
 * Content sits on a torn-paper card (card-mobile.webp below `lg`,
 * card.webp at `lg` and up) taped to a dotted background, rather than
 * directly on a full-bleed background photo like the previous draft.
 * Card and text share one rotated wrapper so everything tilts together;
 * tape and the asterisk-clip decoration are `absolute` children of that
 * same wrapper so they tilt with it too. All decoration is `loading="lazy"`
 * behind `hidden`/`md:hidden` toggles, so a phone never fetches the
 * desktop card, tape, or asterisk-clip assets it can't see.
 *
 * `<main>` clips horizontally with `overflow-x-clip`, not the more common
 * `overflow-x-hidden` — `hidden` on one axis while the other stays at its
 * default `visible` makes the browser compute that visible axis as `auto`
 * too (CSS Overflow spec's axis-mismatch quirk), turning `<main>` into its
 * own nested scroll container the moment the rotated card's bounding box
 * exceeded its flex height. That was a real bug here: it trapped the
 * card's tilt-driven overflow behind a scrollbar instead of letting it
 * spill past `<main>` like a note taped over the edge of the page. `clip`
 * was specifically carved out of that quirk (it clips without opting the
 * box into scroll-container semantics), so `overflow-y` stays genuinely
 * `visible` and the card can bleed up into the header and down into the
 * footer. `z-60` on the wrapper clears Header's `z-50` (sticky) so the
 * card paints over it rather than being hidden behind it when a steep
 * tilt pushes the card up past `<main>`'s box; Footer has no z-index of
 * its own, so the wrapper's `position: relative` already paints above it
 * without help.
 *
 * `scale-70` shrinks the whole card 30% uniformly at every breakpoint —
 * applied as a `transform` alongside the rotate, not by shrinking `w-120`/
 * `lg:w-233` (or the tape/text sizing tuned to them). A transform scales
 * the already-laid-out composition as one unit at paint time, so every
 * hand-placed piece (tape offsets, text wrapping/balance, the underline)
 * stays in the exact same proportion to the card without recalculating
 * each one for a smaller card.
 */
export function NotFoundSection() {
  return (
    <main
      data-notfound
      className="flex flex-1 items-center justify-center overflow-x-clip bg-surface-accent surface-dotted px-4 md:px-11"
    >
      <div className="relative z-60 w-135 shrink-0 -rotate-12 lg:w-180 lg:-rotate-6">
        <Image
          src="/images/not-found/card-mobile.webp"
          alt=""
          width={540}
          height={560}
          loading="lazy"
          className="h-auto w-full lg:hidden"
        />
        <Image
          src="/images/not-found/card.webp"
          alt=""
          width={991}
          height={560}
          loading="lazy"
          className="hidden h-auto w-full lg:block"
        />

        {TAPES.map((tape) => (
          <Image
            key={tape.side}
            src={`/images/not-found/tape-${tape.side}.webp`}
            alt=""
            aria-hidden="true"
            width={tape.width}
            height={tape.height}
            loading="lazy"
            className={cn(
              "absolute h-auto",
              tape.size,
              tape.position,
            )}
          />
        ))}
        <div
          aria-hidden="true"
          className="mx-auto w-30 absolute top-16 left-20 hidden md:block lg:-top-9 lg:left-16 lg:w-37"
        >
          <Asterisk />
        </div>
        <Image
          src="/images/not-found/asterisk-clip.webp"
          alt=""
          aria-hidden="true"
          width={122}
          height={64}
          loading="lazy"
          className="absolute w-25 h-auto top-30 left-7.5 -rotate-8 hidden md:block lg:w-30 lg:top-8 lg:left-2.5"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center lg:px-10">
          <h1 className="type-scrawl lg:type-scrawl-l font-handwriting -rotate-6 uppercase text-text-primary">
            {notFound.code}
          </h1>

          <h2 className="type-scribble lg:type-scribble-l font-handwriting -rotate-2 uppercase text-text-primary">
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
                className="absolute inset-x-0 -bottom-4 h-auto w-full "
              />
            </span>
          </h2>

          <p className="type-body-s mt-6 max-w-72 uppercase text-text-primary lg:mt-8 lg:max-w-none">
            {notFound.description}
          </p>

          <div className="group relative mt-4 lg:mt-6">
            <Pill link={notFound.cta} />
            <PopSparks />
          </div>
        </div>
      </div>
    </main>
  );
}
