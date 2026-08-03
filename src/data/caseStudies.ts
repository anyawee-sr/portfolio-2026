export interface ICaseStudy {
  /** Kebab-case identifier — doubles as the React list key and the /work/[slug] detail link. */
  slug: string;
  /**
   * Discipline chip shown on the card:
   * 'frontend' → solid "FRONTEND" chip,
   * 'editor' → outline "EDITOR" chip.
   */
  type: "frontend" | "editor";
  title: string;
  subTitle: string;
  imageId: string;
  imageAlt: string;
}

export const caseStudies: ICaseStudy[] = [
  {
    slug: "data-layer-new-entity",
    type: "frontend",
    title: "Designing the Data Layer for a New Entity",
    subTitle: "A new point-of-interest type didn't fit any existing schema.",
    imageId: "case-01",
    imageAlt: "",
  },
  {
    slug: "new-member-on-the-map",
    type: "frontend",
    title: "Section: A New Member on the Map",
    subTitle: "This new entity needed a real life on the map — hidden until its moment, surfacing on highlight, clickable only when the venue allowed.",
    imageId: "case-02",
    imageAlt: "",
  },
  {
    slug: "buildings-refuse-to-fade",
    type: "frontend",
    title: "When Buildings Refuse to Fade ",
    subTitle: "A 3D building model was supposed to fade on zoom, revealing the floor plan inside — but the fade fired inconsistently.",
    imageId: "case-03",
    imageAlt: "",
  },
];
