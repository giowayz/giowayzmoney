// Decorative backdrop: a looping ambient video sits behind the whole page,
// replacing the earlier CSS starfield with the exact CloudFront asset the
// user pointed at. A dim tint sits on top so the site's shimmer-text and
// glass cards keep the contrast they were built against — the video reads
// as atmosphere, not as content competing with the copy.
//
// Positioned absolute (scrolling with the page), not fixed. A `position:
// fixed` background visibly jitters against the content on mobile browsers
// as the address bar collapses/expands during scroll — the viewport used
// for fixed positioning and the one used for layout briefly disagree, so
// the backdrop swims relative to everything else. `absolute` ties it to the
// document instead, so it scrolls in lockstep with no recomposite fighting.
export default function StarField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#030014] contain-paint"
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
      />
      <div className="absolute inset-0 bg-[#030014]/65" />
    </div>
  );
}
