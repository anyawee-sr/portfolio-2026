export interface ICaseStudy {
  /** Kebab-case identifier — doubles as the React list key and the /work/[slug] detail link. */
  slug: string;
  /**
   * Discipline chip shown on the card:
   * 'frontend' → solid "FRONTEND" chip,
   * 'editor' → outline "EDITOR" chip.
   */
  type: 'frontend' | 'editor';
  title: string;
  subTitle: string;
  imageId: string;
  imageAlt: string;
}

export const caseStudies: ICaseStudy[] = [
  {
    slug: 'fill-out-the-form',
    type: 'frontend',
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    subTitle: 'Share your idea, goals and timeline through a short brief form.',
    imageId: 'case-01',
    imageAlt: '',
  },
  {
    slug: 'you-are-being-contacted',
    type: 'editor',
    title: 'Sed do eiusmod tempor',
    subTitle: "I'll reach out within 48 hours to talk scope, budget and fit.",
    imageId: 'case-02',
    imageAlt: '',
  },
  {
    slug: 'first-meeting',
    type: 'frontend',
    title: 'Ut enim ad minim veniam quis nostrud exercitation ullamco',
    subTitle: 'We meet, align on direction and lock the plan together.',
    imageId: 'case-03',
    imageAlt: '',
  },
  {
    slug: 'you-receive-quality-service',
    type: 'editor',
    title: 'Duis aute irure dolor',
    subTitle: 'Polished work, delivered on time — with care in every detail.',
    imageId: 'case-04',
    imageAlt: '',
  },
];
