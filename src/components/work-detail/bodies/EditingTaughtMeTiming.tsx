import type { Link } from "@/data/types";

import { Pill } from "../../ui/Pill";
import { ArrowRightIcon } from "../../ui/ArrowRightIcon";
import { WorkEmbed } from "../WorkEmbed";
import { WorkList } from "../WorkList";
import { WorkText } from "../WorkText";
import { WorkSection } from "../WorkSection";

const archive: Link[] = [
  {
    type: "external",
    label: "Web portfolio",
    href: "https://portfolio-rho-ten-15.vercel.app/",
  },
  {
    type: "external",
    label: "PDF portfolio (PDF, 88 MB)",
    href: "https://drive.google.com/file/d/1bKjJwpUwVePN4jbFcj8plHj1SoWO1XQJ/view?usp=sharing",
  },
];

export function EditingTaughtMeTiming() {
  return (
    <>
      <WorkSection heading="Overview">
        <WorkText
          paragraphs={[
            "Video editing was never a means to an end — I've loved movies, shooting footage, and telling stories since school, and editing was just where that love went first.",

            "I worked it both ways, full-time and freelance — mostly cutting vlogs for YouTubers, the kind of footage that has to earn every second or someone clicks away.",

            "Somewhere in there I picked up a second dream — frontend development — not because one led to the other, but because I wanted both :)",
          ]}
        />
      </WorkSection>

      <WorkSection heading="The craft">
        <WorkText
          paragraphs={[
            "Editing is mostly a timing problem. Every cut is a bet on how long a viewer's attention holds before the shot needs to change — hold too long and it drags, cut too soon and nothing registers. You don't learn that from a rulebook, you learn it by scrubbing the same ten seconds a hundred times until the rhythm feels right.",
          ]}
        />
        <WorkEmbed
          videoId="wQ65XGhoM78"
          title="Video editing showreel, 2019–2022"
          caption="Showreel — 2:00"
        />
        <WorkText
          paragraphs={[
            "This showreel is two minutes of that. Fair warning: it moves fast — ADHD editing haha. And honestly? Past-me looked pretty hyperactive.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="What carried over">
        <WorkText
          paragraphs={[
            "None of that instinct went away when I switched to writing components. It just changed medium:",
          ]}
        />
        <WorkList
          items={[
            {
              term: "A transition duration",
              text: "isn't a number I copy from a default — it's the same gut check as a cut point.",
            },
            {
              term: "prefers-reduced-motion",
              text: "isn't just a media query to satisfy — it's the same respect for a viewer's patience I learned watching people click away the moment a cut ran long.",
            },
            {
              term: "Most of the job",
              text: "is still deciding what doesn't make it onto the screen.",
            },
          ]}
        />
      </WorkSection>

      <WorkSection heading="The archive">
        <WorkText
          paragraphs={[
            "The rest of that era lives in two places — a site built to walk through the cuts individually, and a PDF for anyone who'd rather flip through it than click.",
            "The web version doubles as something else, too: it's the very first thing I ever coded and shipped myself, back when I was teaching myself just enough to get a portfolio online. Still a little proud of it.",
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {archive.map((link) => (
            <Pill
              key={link.label}
              link={link}
              arrow={<ArrowRightIcon />}
              className="w-fit sm:w-auto"
            />
          ))}
        </div>
      </WorkSection>
    </>
  );
}
