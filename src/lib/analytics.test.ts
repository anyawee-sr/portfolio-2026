import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  handleTrackEvent,
  readTrackAttrs,
  track,
  trackAttrs,
} from "@/lib/analytics";

/** Builds an element carrying `attrs`, attached so events reach `document`. */
function mount<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
) {
  const element = document.createElement(tag);

  for (const [name, value] of Object.entries(attrs)) {
    element.setAttribute(name, value);
  }

  document.body.append(element);

  return element;
}

afterEach(() => {
  document.body.replaceChildren();
  delete window.gtag;
});

describe("trackAttrs", () => {
  it("sets data-track to the event name", () => {
    const attrs = trackAttrs("contact_click", { location: "header" });

    expect(attrs["data-track"]).toBe("contact_click");
  });

  it("sets data-track-<key> for every param", () => {
    const attrs = trackAttrs("case_study_open", {
      slug: "new-member-on-the-map",
      location: "work_grid",
    });

    expect(attrs).toEqual({
      "data-track": "case_study_open",
      "data-track-slug": "new-member-on-the-map",
      "data-track-location": "work_grid",
    });
  });
});

describe("readTrackAttrs", () => {
  it("returns null for an element without data-track", () => {
    expect(readTrackAttrs(mount("div"))).toBeNull();
  });

  it("reads back what trackAttrs wrote", () => {
    const element = mount(
      "a",
      trackAttrs("case_study_open", { slug: "abc", location: "detail_nav" }),
    );

    expect(readTrackAttrs(element)).toEqual({
      event: "case_study_open",
      params: { slug: "abc", location: "detail_nav" },
    });
  });
});

describe("track", () => {
  it("sends the event through window.gtag", () => {
    window.gtag = vi.fn();

    track("contact_click", { location: "footer" });

    expect(window.gtag).toHaveBeenCalledWith("event", "contact_click", {
      location: "footer",
    });
  });

  it("passes onSent to GA as event_callback", () => {
    window.gtag = vi.fn();
    const onSent = vi.fn();

    track("contact_click", { location: "footer" }, { onSent });

    expect(window.gtag).toHaveBeenCalledWith("event", "contact_click", {
      location: "footer",
      event_callback: onSent,
    });
  });

  it("does nothing when GA isn't loaded", () => {
    expect(() => track("contact_click", { location: "footer" })).not.toThrow();
  });
});

describe("handleTrackEvent", () => {
  beforeEach(() => {
    window.gtag = vi.fn();
    document.addEventListener("click", handleTrackEvent);
    document.addEventListener("play", handleTrackEvent, true);
  });

  afterEach(() => {
    document.removeEventListener("click", handleTrackEvent);
    document.removeEventListener("play", handleTrackEvent, true);
  });

  it("tracks a click on a child of a tracked element", () => {
    const link = mount(
      "a",
      trackAttrs("contact_click", { location: "header" }),
    );
    const arrow = document.createElement("span");
    link.append(arrow);

    arrow.click();

    expect(window.gtag).toHaveBeenCalledWith("event", "contact_click", {
      location: "header",
    });
  });

  it("ignores clicks outside any tracked element", () => {
    mount("button").click();

    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("tracks play on a tracked video", () => {
    const video = mount("video", trackAttrs("video_play", { slug: "abc" }));

    // `play` doesn't bubble — only the capture-phase listener sees it.
    video.dispatchEvent(new Event("play"));

    expect(window.gtag).toHaveBeenCalledWith("event", "video_play", {
      slug: "abc",
    });
  });

  it("ignores clicks on a tracked video", () => {
    mount("video", trackAttrs("video_play", { slug: "abc" })).click();

    expect(window.gtag).not.toHaveBeenCalled();
  });
});
