declare global {
  interface Window {
    /** Defined by the GA init script — absent whenever NEXT_PUBLIC_GA_ID is unset. */
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Every custom GA4 event and its parameters — the single list of what the
 * site tracks (see docs/plans/ga4-analytics.md). Param keys stay single
 * lowercase words: they round-trip through `data-track-<key>` attributes,
 * and HTML lowercases attribute names.
 */
export interface ITrackEvents {
  contact_click: { location: "header" | "about_me" | "footer" };
  case_study_open: { slug: string; location: "work_grid" | "detail_nav" };
  video_play: { slug: string };
  resume_qr_open: { src: string };
}

export type TrackEventName = keyof ITrackEvents;

const EVENT_ATTR = "data-track";
const PARAM_PREFIX = `${EVENT_ATTR}-`;

/**
 * Data attributes that mark an element for tracking. Plain props, so server
 * components can spread them without becoming client components —
 * `AnalyticsListener` picks the event up from the DOM at runtime.
 */
export function trackAttrs<E extends TrackEventName>(
  event: E,
  params: ITrackEvents[E],
) {
  const attrs: Record<string, string> = { [EVENT_ATTR]: event };

  for (const [key, value] of Object.entries(params)) {
    attrs[`${PARAM_PREFIX}${key}`] = value;
  }

  return attrs;
}

/** Reverse of `trackAttrs` — null when the element isn't marked. */
export function readTrackAttrs(element: Element) {
  const event = element.getAttribute(EVENT_ATTR);

  if (!event) {
    return null;
  }

  const params: Record<string, string> = {};

  for (const name of element.getAttributeNames()) {
    if (name.startsWith(PARAM_PREFIX)) {
      params[name.slice(PARAM_PREFIX.length)] = element.getAttribute(name)!;
    }
  }

  return { event: event as TrackEventName, params };
}

/** Sends an event to GA4. No-op when GA isn't loaded (env unset, blocked). */
export function track<E extends TrackEventName>(
  event: E,
  params: ITrackEvents[E],
) {
  window.gtag?.("event", event, params);
}

/**
 * Document-level handler for `click` and `play` (capture phase — `play`
 * doesn't bubble). Walks up from the target so a click on a link's inner
 * `<span>` still counts. Media elements report on `play` only, so clicking a
 * tracked video's controls doesn't double-count it.
 */
export function handleTrackEvent(domEvent: Event) {
  if (!(domEvent.target instanceof Element)) {
    return;
  }

  const element = domEvent.target.closest(`[${EVENT_ATTR}]`);

  if (!element) {
    return;
  }

  const trigger = element instanceof HTMLMediaElement ? "play" : "click";

  if (domEvent.type !== trigger) {
    return;
  }

  const tracked = readTrackAttrs(element);

  if (tracked) {
    window.gtag?.("event", tracked.event, tracked.params);
  }
}
