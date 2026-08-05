import { WorkCode } from "../WorkCode";
import { WorkImage } from "../WorkImage";
import { WorkText } from "../WorkText";
import { WorkSection } from "../WorkSection";

export function NewMemberOnTheMap() {
  return (
    <>
      <WorkSection heading="Overview">
        <WorkText
          paragraphs={[
            "Once the new entity type existed in the data layer, it needed a real presence on the map — not just a row in a table.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="The Challenge">
        <WorkText
          paragraphs={[
            "The marker had three states to respect: hidden by default, surfaced only when its parent venue was highlighted, and clickable only for venues that had opted in. Getting any one of those wrong meant either a map that felt cluttered, or a marker that looked interactive but silently did nothing.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Approach & Build">
        <WorkText
          paragraphs={[
            "Visibility and interactivity were split into two independent flags instead of one combined state — so a marker could be visible-but-inert during a highlight preview, and only become clickable once the venue's settings allowed it.",
          ]}
        />
        <WorkCode
          code={`function getMarkerState(venue: Venue, highlightedId: string | null) {
  const isVisible = venue.id === highlightedId;
  const isClickable = isVisible && venue.allowsDirectAccess;

  return { isVisible, isClickable };
}`}
        />
      </WorkSection>

      <WorkSection heading="Details & Variants">
        <WorkText
          paragraphs={[
            "Two marker treatments were tested before landing on the current one — a solid pin that popped in immediately, and a fade-in ring that echoed the venue's own highlight color.",
          ]}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <WorkImage
            alt=""
            width={360}
            height={240}
            label="marker variant — solid pin"
          />
          <WorkImage
            alt=""
            width={360}
            height={240}
            label="marker variant — fade-in ring"
          />
        </div>
      </WorkSection>

      <WorkSection heading="Result">
        <WorkText
          paragraphs={[
            "The fade-in ring shipped — it read as part of the highlight itself instead of a separate UI element competing for attention on an already busy map.",
          ]}
        />
      </WorkSection>
    </>
  );
}
