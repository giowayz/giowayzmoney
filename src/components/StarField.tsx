// Site backdrop — two separate texture assets, swapped by breakpoint, each
// tiled vertically down the page. Nothing else layered on top (no nebula
// glow, no star canvas, no fade mask) — the texture is visible immediately
// on load.
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
      {/* Desktop asset is a letterboxed 1200×630 (black bars baked into the
          left/right edges of the source file) — sized wider than the
          viewport (130vw, aspect ratio preserved) and centered, so those
          bars land off-screen instead of showing as ugly stripes down the
          page. */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: "url(/brand/bg-texture-desktop.jpg)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "130vw auto",
          backgroundPosition: "center top",
        }}
      />
      <div
        className="absolute inset-0 block md:hidden"
        style={{
          backgroundImage: "url(/brand/bg-texture-mobile.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100vw auto",
          backgroundPosition: "center top",
        }}
      />
    </div>
  );
}
