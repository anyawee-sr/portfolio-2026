import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  readQrSource,
  REDIRECT_TIMEOUT_MS,
  trackThenRedirect,
} from "@/lib/resumeQr";

/** The `event_callback` GA was handed on its last call. */
function lastEventCallback() {
  const params = vi.mocked(window.gtag!).mock.lastCall?.[2] as
    { event_callback?: () => void } | undefined;

  return params?.event_callback;
}

describe("readQrSource", () => {
  it("returns the src param", () => {
    expect(readQrSource("?src=site-qr")).toBe("site-qr");
  });

  it("falls back to unknown when src is missing", () => {
    expect(readQrSource("")).toBe("unknown");
  });

  it("falls back to unknown when src is empty", () => {
    expect(readQrSource("?src=")).toBe("unknown");
  });
});

describe("trackThenRedirect", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.gtag;
  });

  it("sends resume_qr_open with the src", () => {
    window.gtag = vi.fn();

    trackThenRedirect("site-qr", vi.fn());

    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "resume_qr_open",
      expect.objectContaining({ src: "site-qr" }),
    );
  });

  it("redirects as soon as GA confirms the hit", () => {
    window.gtag = vi.fn();
    const redirect = vi.fn();

    trackThenRedirect("site-qr", redirect);
    lastEventCallback()?.();

    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("redirects when GA confirms synchronously", () => {
    window.gtag = vi.fn((...args: unknown[]) => {
      (args[2] as { event_callback?: () => void }).event_callback?.();
    });
    const redirect = vi.fn();

    trackThenRedirect("site-qr", redirect);

    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("redirects after the timeout when GA isn't loaded", () => {
    const redirect = vi.fn();

    trackThenRedirect("site-qr", redirect);

    vi.advanceTimersByTime(REDIRECT_TIMEOUT_MS - 1);
    expect(redirect).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("redirects after the timeout when GA never confirms", () => {
    window.gtag = vi.fn();
    const redirect = vi.fn();

    trackThenRedirect("site-qr", redirect);
    vi.advanceTimersByTime(REDIRECT_TIMEOUT_MS);

    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("redirects only once when GA confirms after the timeout", () => {
    window.gtag = vi.fn();
    const redirect = vi.fn();

    trackThenRedirect("site-qr", redirect);
    vi.advanceTimersByTime(REDIRECT_TIMEOUT_MS);
    lastEventCallback()?.();

    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("redirects only once when the timeout passes after GA confirms", () => {
    window.gtag = vi.fn();
    const redirect = vi.fn();

    trackThenRedirect("site-qr", redirect);
    lastEventCallback()?.();
    vi.advanceTimersByTime(REDIRECT_TIMEOUT_MS);

    expect(redirect).toHaveBeenCalledTimes(1);
  });
});
