import { WorkCode } from "../WorkCode";
import { WorkImage } from "../WorkImage";
import { WorkText } from "../WorkText";
import { WorkSection } from "../WorkSection";

export function BuildingsRefuseToFade() {
  return (
    <>
      <WorkSection heading="Overview">
        <WorkText
          paragraphs={[
            "A 3D building model was supposed to fade out as the camera zoomed in, revealing the floor plan underneath — a small detail that turned out to be the hardest part of the feature.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="The Challenge">
        <WorkText
          paragraphs={[
            "The fade fired inconsistently: sometimes smooth, sometimes an instant pop, sometimes not at all until the next zoom step. It only reproduced on real devices under load, never reliably in a quiet local build — which made it very easy to mark 'fixed' and very easy to be wrong.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Approach & Build">
        <WorkText
          paragraphs={[
            "The opacity update was being driven from the render loop, but the zoom level it read was coming from a separate camera-state update running on its own schedule — under load, the two could fall out of sync for a frame or several. Reading the zoom directly from that frame's camera transform instead of a cached value removed the gap entirely.",
          ]}
        />
        <WorkCode
          code={`function getBuildingOpacity(transform: CameraTransform) {
  const fadeStart = 15;
  const fadeEnd = 18;
  const t = clamp(
    (transform.zoom - fadeStart) / (fadeEnd - fadeStart),
    0,
    1,
  );

  return 1 - easeInOutCubic(t);
}`}
        />
      </WorkSection>

      <WorkSection heading="Details & Variants">
        <WorkText
          paragraphs={[
            "Two easing curves were compared side by side before shipping — a linear fade read as mechanical against the floor plan underneath, while the eased version matched the pace of the camera move itself.",
          ]}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <WorkImage alt="" width={360} height={240} label="linear fade" />
          <WorkImage alt="" width={360} height={240} label="eased fade" />
        </div>
      </WorkSection>

      <WorkSection heading="Result">
        <WorkText
          paragraphs={[
            "The fade now holds steady across every device tested, including the lower-end phones where the bug reproduced most often.",
          ]}
        />
      </WorkSection>
    </>
  );
}
