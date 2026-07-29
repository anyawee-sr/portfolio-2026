import { AboutMe } from '@/components/AboutMe';
import { Hero } from '@/components/Hero';
import { Skills } from '@/components/Skills';
import { Work } from '@/components/Work';

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Skills />
      <Work />
      <AboutMe />
    </main>
  );
}
