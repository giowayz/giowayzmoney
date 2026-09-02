"use client";

// Decorative backdrop: a looping ambient video sits behind the whole page.
// A dim tint sits on top so the site's shimmer-text and glass cards keep
// the contrast they were built against — the video reads as atmosphere,
// not as content competing with the copy.
//
// This round's source is a Mux HLS stream (.m3u8), not a plain mp4 — most
// browsers (everything but Safari) can't play that natively, so hls.js
// feeds it into the <video> element via MediaSource; Safari gets the URL
// assigned directly since it understands HLS out of the box.
//
// Positioned absolute (scrolling with the page), not fixed. A `position:
// fixed` background visibly jitters against the content on mobile browsers
// as the address bar collapses/expands during scroll — the viewport used
// for fixed positioning and the one used for layout briefly disagree, so
// the backdrop swims relative to everything else. `absolute` ties it to the
// document instead, so it scrolls in lockstep with no recomposite fighting.
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLS_SRC = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export default function StarField() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
    }
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#030014] contain-paint"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#030014]/65" />
    </div>
  );
}
