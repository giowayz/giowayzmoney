// Site backdrop — a single graffiti texture, nothing layered on top of it
// (no nebula glow, no star canvas, no separate mobile/desktop asset, no
// fade mask). One image, tiled vertically down the page, visible from the
// moment the page loads.
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
      style={{
        backgroundImage: "url(/brand/bg-texture.png)",
        backgroundRepeat: "repeat-y",
        backgroundSize: "100vw auto",
        backgroundPosition: "center top",
      }}
    />
  );
}
