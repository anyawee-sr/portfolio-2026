import { WorkCode } from "../WorkCode";
import { WorkText } from "../WorkText";
import { WorkSection } from "../WorkSection";

export function NewMemberOnTheMap() {
  return (
    <>
      <WorkSection heading="The problem">
        <WorkText
          paragraphs={[
            "A section behaves like nothing else on the platform: hidden by default, showing up only when highlighted instead of hanging around all the time, and clickable only if the venue says so. And when it does get highlighted (its active state), a marker pops up with it — and the marker itself is customizable, showing either a category icon or a logo. So getting the data model right was only half the job; the map also had to know how to show, hide, and style the thing.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Hidden until highlighted">
        <WorkText
          paragraphs={[
            "Every section starts out backstage and only steps into the light when highlighted — whether the user taps it right on the map, or searches for it and selects it.",

            "Along the way, a couple of unexpected freebies turned up — a little bug and a typo, both hiding in the code: first, a stale-opacity reset using .find, which only ever reset one object, when there could actually be more — swapped in .filter and done.",

            "Second, a copy-paste typo in the highlight controller's function name itself. These two bombs had been buried there for ages without anyone knowing — just tiny things, but hey, cleaner code always feels nice."
          ]}
        />
      </WorkSection>

      <WorkSection heading="So, how should this look?">
        <WorkText
          paragraphs={[
            "Next problem: a section just didn't fit in with any existing marker. Some come with a logo, others have nothing at all — one design wasn't going to cut it for both. Instead of writing a renderer from scratch, I borrowed marker ideas from existing feature types and remixed them into two flavors: a sprite-based logo card, and a simple icon marker showing the category icon (also the fallback for sections without a logo). Each has its own material and altitude handling, so it floats above its zone just right, every time.",

            "This part was nearly all the way there before a teammate jumped in to carry it across the finish line — credit where credit's due 🙏",
          ]}
        />
        <WorkCode
          code={`// Illustrative — not the real code
function buildSectionMarker(section: Section) {
  return section?.Logo
    ? createLogoMarker(section)
    : createIconMarker(section);
}`}
        />
      </WorkSection>

      <WorkSection heading="Bonus: refactoring the shared utilities">
        <WorkText
          paragraphs={[
            "This work also opened a nice window to refactor a shared utility that draws outlines around extruded shapes on the map — a chance to put some maptalks.three know-how to work, getting the outline to hug the top or bottom face of a shape just right.",

            "Previously, the top and bottom outlines lived under one flag: flip it on and you always got both, like it or not. It's now split into two independent options, with every existing configuration updated so everything behaves exactly as before — nothing old got shaken, but new flexibility came along for free."
          ]}
        />
      </WorkSection>

      <WorkSection heading="Result">
        <WorkText
          paragraphs={[
            "A section now hits every beat the way it should: lying low until its cue, stepping out through the same highlight mechanism the rest of the platform uses, running on its own renderer, and rocking a look of its own — icon marker or logo card, depending on render type."
          ]}
        />
      </WorkSection>
    </>
  );
}
