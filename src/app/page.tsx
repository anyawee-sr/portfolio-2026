import { AboutMe } from "@/components/AboutMe";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { PaperTear } from "@/components/ui/PaperTear";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <PaperTear variant="hero-skills" />
      <Skills />
      <PaperTear variant="skills-work" />
      <Work />
      <AboutMe />
    </main>
  );
}
