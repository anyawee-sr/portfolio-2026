import { skills } from "@/data/skills";

import { Asterisk } from "./ui/Asterisk";
import { Sticker } from "./ui/Sticker";

/** Cycled per skill so neighboring stickers never share a tilt. */
const SKILL_ROTATIONS = [
  "-rotate-2",
  "rotate-2",
  "-rotate-6",
  "rotate-6",
  "-rotate-1",
  "rotate-3",
  "-rotate-3",
];

export function Skills() {
  return (
    <section
      aria-labelledby="skills-title"
      className="surface-graph grid grid-cols-2 md:grid-cols-[1fr_2fr] relative overflow-x-hidden px-4 py-16 md:px-11"
    >
      <h2 id="skills-title" className="sr-only">
        Skills
      </h2>

      <div aria-hidden="true" className="relative -left-10 md:-left-20">
        <Asterisk />
      </div>

      <ul className="relative z-10 mt-auto flex max-w-290 flex-wrap items-center justify-center gap-3">
        {skills.map((skill, i) => (
          <Sticker
            key={skill}
            label={skill}
            variant="skill"
            as="li"
            rotationClass={SKILL_ROTATIONS[i % SKILL_ROTATIONS.length]}
          />
        ))}
      </ul>
    </section>
  );
}
