/**
 * "From my work logs" case study cards.
 * Titles are Lorem Ipsum placeholders — intentionally alternating
 * long/short to stress-test `text-wrap: balance` + `max-w-[Nch]` and
 * card height before real copy is dropped in. Rotation/tape/badge
 * accents are decorative and belong to the component, not this data.
 */
export interface ICaseStudy {
  number: string;
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
  href?: string;
}

export const caseStudies: ICaseStudy[] = [
  {
    number: '01',
    type: 'frontend',
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    subTitle: 'Share your idea, goals and timeline through a short brief form.',
    imageId: 'case-01',
    imageAlt: '',
  },
  {
    number: '02',
    type: 'editor',
    title: 'Sed do eiusmod tempor',
    subTitle: "I'll reach out within 48 hours to talk scope, budget and fit.",
    imageId: 'case-02',
    imageAlt: '',
  },
  {
    number: '03',
    type: 'frontend',
    title: 'Ut enim ad minim veniam quis nostrud exercitation ullamco',
    subTitle: 'We meet, align on direction and lock the plan together.',
    imageId: 'case-03',
    imageAlt: '',
  },
  {
    number: '04',
    type: 'editor',
    title: 'Duis aute irure dolor',
    subTitle: 'Polished work, delivered on time — with care in every detail.',
    imageId: 'case-04',
    imageAlt: '',
  },
];
