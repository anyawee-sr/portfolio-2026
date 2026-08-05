import { WorkCode } from "../WorkCode";
import { WorkText } from "../WorkText";
import { WorkSection } from "../WorkSection";

export function DataLayerNewEntity() {
  return (
    <>
      <WorkSection heading="Overview">
        <WorkText
          paragraphs={[
            "Product wanted to list a new point-of-interest type on the map — one that didn't map cleanly onto any entity already in the schema.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="The Challenge">
        <WorkText
          paragraphs={[
            "The existing entity table assumed a single set of opening hours and a single location per record. This new type could have several access points active on different schedules, and none of the current consumers of the schema were built to expect that.",
            "Any change had to keep every existing entity — and every screen that already read from that table — working exactly as before.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Approach & Build">
        <WorkText
          paragraphs={[
            "Rather than widening the shared entity type, the new fields were modeled as an additive discriminated union member — invisible to code that only knew the old shape.",
          ]}
        />
        <WorkCode
          code={`type Entity =
  | { kind: "venue"; hours: Hours }
  | { kind: "poi-multi-access"; accessPoints: AccessPoint[] };

function isMultiAccess(
  entity: Entity,
): entity is Extract<Entity, { kind: "poi-multi-access" }> {
  return entity.kind === "poi-multi-access";
}`}
        />
      </WorkSection>

      <WorkSection heading="Result">
        <WorkText
          paragraphs={[
            "The new entity type shipped without touching a single existing query or component — every consumer that only handled the old shape kept compiling and kept working.",
          ]}
        />
      </WorkSection>
    </>
  );
}
