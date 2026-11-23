"use client";

import { useEffect } from "react";

import { handleTrackEvent } from "@/lib/analytics";

/**
 * One document-level listener for every `data-track` element on the site, so
 * tracked components stay server components. `play` is captured because it
 * doesn't bubble. Renders nothing.
 */
export function AnalyticsListener() {
  useEffect(() => {
    document.addEventListener("click", handleTrackEvent);
    document.addEventListener("play", handleTrackEvent, true);

    return () => {
      document.removeEventListener("click", handleTrackEvent);
      document.removeEventListener("play", handleTrackEvent, true);
    };
  }, []);

  return null;
}
