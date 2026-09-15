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

export const caseStudies = [
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
    subTitle:
      "This new entity needed a real life on the map — hidden until its moment, surfacing on highlight, clickable only when the venue allowed.",
    imageId: "case-02",
    imageAlt: "",
  },
  {
    slug: "buildings-refuse-to-fade",
    type: "frontend",
    title: "When Buildings Refuse to Fade",
    subTitle:
      "A 3D building model was supposed to fade on zoom, revealing the floor plan inside — but the fade fired inconsistently.",
    imageId: "case-03",
    imageAlt: "",
  },
  {
    slug: "editing-taught-me-timing",
    type: "editor",
    title: "What Editing Taught Me About Timing",
    subTitle:
      "Three years of YouTuber vlogs taught me timing — turns out UI runs on the same instinct.",
    imageId: "case-04",
    imageAlt: "",
  },
] as const satisfies readonly ICaseStudy[];

/**
 * Union of every valid case study slug, derived from `caseStudies` itself —
 * never hand-maintained. Used by the `/work/[slug]` body registry
 * (`Record<TCaseStudySlug, ComponentType>`, see docs/adr/0001) so adding a
 * case study without writing its body component fails at compile time.
 */
export type TCaseStudySlug = (typeof caseStudies)[number]["slug"];
