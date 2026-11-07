import { WorkCode } from "@/components/work-detail/WorkCode";
import { WorkImage } from "@/components/work-detail/WorkImage";
import { WorkList } from "@/components/work-detail/WorkList";
import { WorkText } from "@/components/work-detail/WorkText";
import { WorkSection } from "@/components/work-detail/WorkSection";
import { WorkVideo } from "@/components/work-detail/WorkVideo";

export function BuildingsRefuseToComeBack() {
  return (
    <>
      <WorkSection heading="Overview">
        <WorkText
          paragraphs={[
            "So there's this 3D building model that's supposed to fade away when you zoom in close, letting you see the floor plan inside, then turn solid again when you zoom back out. Cool idea. Except the way back had a mind of its own — sometimes the building came back, sometimes nope.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="The problem">
        <WorkText
          paragraphs={[
            "The setup: below zoom 17.5, building stays solid. Zoom past that toward 18, and it fades out so you can peek at the floor plan inside.",

            "The reality: you'd zoom back out, expecting the building to turn solid again, and it would just stay see-through. A ghost of a building, stuck like that.",

            "But here's the fun part — it only broke one way:",
          ]}
        />
        <WorkList
          items={[
            {
              term: "Zooming in",
              text: "(low → high): fades like a champ ✓",
            },
            {
              term: "Zooming out",
              text: "(high → low): stuck see-through, never turns solid ✗",
            },
          ]}
        />
        <WorkVideo
          src="/videos/work/buildings-refuse-to-fade/zoom-out-stuck-transparent.mp4"
          poster="/images/work/buildings-refuse-to-fade/zoom-out-stuck-transparent-poster.webp"
          label="Zooming out from a floor plan: the 3D buildings appear but stay see-through."
          width={1340}
          height={1736}
          caption="Before the fix: zooming out, the buildings stay see-through."
          className="mx-auto max-w-sm"
        />
      </WorkSection>

      <WorkSection heading="Root cause">
        <WorkText
          paragraphs={[
            "The cause: maptalks, the map library, and how it handles stops. I'd set the opacity up declaratively — basically telling the library 'make this number follow the zoom':",
          ]}
        />
        <WorkCode
          code={`symbol: {
  polygonOpacity: {
    stops: [
      [17.5, 1],  // zoom 17.5 → Opaque
      [18,   0],  // zoom 18   → Transparent
    ],
  },
}
`}
        />

        {/* TODO: maybe remove technical content from this paragraph */}
        <WorkText
          paragraphs={[
            "Sounds like it should just work, right? Well.",

            <>
              Turns out the library evaluates those stops exactly once — when{" "}
              <code>_prepareSymbol</code> runs during symbol setup. Not on every
              zoom change. Once. After that, <code>getUniforms()</code> just
              keeps serving up the same stale number, frozen at whatever zoom
              the marker (3D model) was born at.
            </>,

            "And that explains the one-way weirdness perfectly:",
          ]}
        />
        <WorkList
          items={[
            {
              term: "Created at low zoom, then zooming in",
              text: "The marker might get marked dirty along the way and re-evaluate — so it seems fine. Basically working by accident",
            },
            {
              term: "At high zoom, then zooming out",
              text: "The value's already locked in, and nothing ever pokes it to recalculate. Stuck forever.",
            },
          ]}
        />
      </WorkSection>

      <WorkSection heading="The fix">
        <WorkText
          paragraphs={[
            "Fine. If the library won't recalculate, I'll do it myself.",

            "Ripped the logic out of symbol setup (runs once, ever) and dropped it into handleMapZoomEnd — which fires every time the zoom settles down. Then I set the value by hand with marker.setUniform(), which marks the marker dirty and forces a re-render with the fresh number:",
          ]}
        />
        <WorkCode
          code={`handleMapZoomEnd() {
  const zoom = map.getZoom();

  // zoom = 18, opacity = 0
  // zoom = 17.5, opacity = 1
  const opacity = _.clamp((18 - zoom) / (18 - 17.5), 0, 1)

  marker.setUniform('polygonOpacity', opacity); // dirty → re-render
}`}
        />
      </WorkSection>

      <WorkSection heading="Free math lesson">
        <WorkText
          paragraphs={[
            "The bug wasn't the only thing I walked away with — this task also came with a neat little math trick: turning a zoom level into an opacity, in one line. Here's the fade formula:",
          ]}
        />
        <WorkCode code={`_.clamp((18 - zoom) / (18 - 17.5), 0, 1)`} />
        <WorkText
          paragraphs={[
            "At first glance it looks like a formula that fell out of the sky, but it's really just linear interpolation:",
          ]}
        />
        <WorkCode code={`(hi - zoom) / (hi - lo)`} />
        <WorkText paragraphs={["Easy way to remember it:"]} />
        <WorkList
          items={[
            {
              term: "Bottom",
              text: "the width of the fade range (scales everything so it lands exactly at 1)",
            },
            {
              term: "Top",
              text: "how far you are from the end that should be 0",
            },
          ]}
        />
        <WorkText
          paragraphs={[
            "And clamp just keeps the value from wandering outside 0 – 1.",
          ]}
        />
      </WorkSection>

      <WorkSection heading="Result">
        <WorkText
          paragraphs={[
            "Every time the zoom settles, opacity gets recalculated from the actual current zoom. Zoom in, zoom out, doesn't matter — the building fades on the way in and turns solid again on the way out, and the floor plan shows up right on cue.",
          ]}
        />
        <WorkVideo
          src="/videos/work/buildings-refuse-to-fade/zoom-out-solid-after-fix.mp4"
          poster="/images/work/buildings-refuse-to-fade/zoom-out-solid-after-fix-poster.webp"
          label="Zooming out from a floor plan: the 3D buildings return fully solid."
          width={1340}
          height={1730}
          caption="After the fix: zooming out, the buildings turn solid again."
          className="mx-auto max-w-sm"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <WorkImage
            src="/images/work/buildings-refuse-to-fade/building-stuck-transparent.webp"
            alt="Map zoomed out with the 3D buildings stuck see-through, the streets visible through them."
            width={1630}
            height={1734}
            label="before the fix"
            caption="Before: stuck see-through."
          />
          <WorkImage
            src="/images/work/buildings-refuse-to-fade/building-solid-after-fix.webp"
            alt="The same map view with the 3D buildings fully solid."
            width={1628}
            height={1734}
            label="after the fix"
            rotation="rotate-1"
            caption="After: fully solid."
          />
        </div>
      </WorkSection>
    </>
  );
}
