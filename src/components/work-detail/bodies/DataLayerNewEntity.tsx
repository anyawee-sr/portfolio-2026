import { WorkCode } from "../WorkCode";
import { WorkLink } from "../WorkLink";
import { WorkText } from "../WorkText";
import { WorkSection } from "../WorkSection";

export function DataLayerNewEntity() {
  return (
    <>
      <WorkSection heading="Overview">
        <WorkText
          paragraphs={[
            "A venue needed a new kind of point of interest — one that didn't fit any feature type we had on the platform. I figured the right move was to nail down the data contract first, before any UI existed, then build the admin tooling on top of a schema that wasn't going to move. Not the other way around.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="The problem">
        <WorkText
          paragraphs={[
            "We already had a bunch of feature types. Then one day a new requirement landed: show 'named zones' on the map — stuff like a food-court zone, a menswear zone, a womenswear zone. None of our existing models fit. And this thing didn't exist anywhere yet — not in the schema, not in the admin panel.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Why 'section'">
        <WorkText
          paragraphs={[
            <>
              We talked it over as a team and went back to the{" "}
              <WorkLink href="https://register.apple.com/resources/imdf/">
                Indoor Mapping Data Format (IMDF)
              </WorkLink>
              , which we&apos;d been treating as our standard all along. Turns
              out it has a &apos;section&apos; feature type, and the
              definition matched our problem almost perfectly. Sticking to
              the standard from day one meant the new entity had a proper
              home in the system — not some weird thing we made up and named
              ourselves.
            </>,
          ]}
        />
      </WorkSection>

      <WorkSection heading="Schema first">
        <WorkText
          paragraphs={["Before touching any UI, the data contract had to exist. So schema and validator first. The fields came out of a team brainstorm — to name a few: a flag for whether the section shows up on the map, a flag for whether you can click it, a reference id for generating QR deep-links you can scan from a kiosk, and a keyword field for search. Everything gets validated with the same conventions as our existing content types, so the new entity just blends in with the rest of the system."]}
        />
        <WorkCode
          code={`// Illustrative — not the real schema
const sectionSchema = {
  name: i18nText().required(),
  level: number().required()
  isClickable: boolean().default(true),
  referenceId: string().optional(),   // powers a QR deep-link on kiosk
  keywords: i18nText().optional(),    // searchable, distinct from display name
};`}
        />
      </WorkSection>

      <WorkSection heading="Admin UI, once the contract was settled">
        <WorkText
          paragraphs={[
            "Once the schema was in place, the CMS forms were honestly the easy part — just expose the contract to content editors. Same validation rules, same field shapes, no guessing what the API would accept.",

            "I also took the chance to refactor and clean up the related code in the CMS repo while I was in there, so the existing structure could take on a new feature type without piling on copy-paste. Doing the service side first meant I never had to go back and redo the admin UI when the data model shifted. It was just integration, not discovery.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Result">
        <WorkText
          paragraphs={[
            "Sections are now manageable end to end: content editors create and edit them entirely from the admin panel, and the service enforces the same schema and permissions as every other content type on the platform. Exactly how it should be.",
          ]}
        />
      </WorkSection>
    </>
  );
}
