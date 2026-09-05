// Decorative backdrop: a graffiti-wall texture (the redesign's background
// image) under slow-drifting violet/blue nebula blobs and a constellation of
// tiny stars, sitting behind the whole page. A deterministic pseudo-random
// layout (fixed seed) keeps server and client output identical without
// shipping thousands of literal box-shadow coordinates, and the nebula
// motion is pure CSS (no JS, no extra image assets) — a "living" backdrop
// that costs nothing to ship or animate on top of the static texture.
//
// Positioned absolute (scrolling with the page), not fixed. A `position:
// fixed` background visibly jitters against the content on mobile browsers
// as the address bar collapses/expands during scroll — the viewport used
// for fixed positioning and the one used for layout briefly disagree, so
// the backdrop swims relative to everything else. `absolute` ties it to the
// document instead, so it scrolls in lockstep with no recomposite fighting.
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);
const STARS = Array.from({ length: 240 }, (_, i) => ({
  top: `${(rand() * 100).toFixed(2)}%`,
  left: `${(rand() * 100).toFixed(2)}%`,
  size: rand() > 0.92 ? 2 : 1,
  opacity: (0.2 + rand() * 0.5).toFixed(2),
  // Only ~1 in 12 stars twinkles — animating all 240 would mean 240
  // separate compositor layers for one faint effect. A sparse subset
  // still reads as "the sky is alive" at a fraction of the GPU cost.
  twinkle: i % 12 === 0,
  twinkleDuration: (3 + rand() * 4).toFixed(2),
  twinkleDelay: (rand() * 6).toFixed(2),
}));

const NEBULAE = [
  { top: "-10%", left: "50%", size: "55vh", color: "80,70,228", opacity: 0.16, duration: 34 },
  { top: "20%", left: "-15%", size: "34vh", color: "147,130,255", opacity: 0.12, duration: 26 },
  { top: "55%", left: "85%", size: "38vh", color: "125,211,255", opacity: 0.08, duration: 30 },
  { top: "85%", left: "20%", size: "40vh", color: "16,9,58", opacity: 0.55, duration: 40 },
  { top: "100%", left: "70%", size: "36vh", color: "186,156,255", opacity: 0.09, duration: 22 },
] as const;

export default function StarField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#030014] contain-paint"
      aria-hidden="true"
    >
      {/* Graffiti-wall texture, covering the whole page — not just the top.
          Tiling a non-seamless "wall+floor" image with a plain repeat stacks
          a hard cut at every boundary (floor meeting wall). Instead each
          tile fades in from transparent at its own top edge and fades back
          out before its bottom edge, using a `repeating-linear-gradient`
          mask whose period matches the tile's own rendered height — so
          where one tile's fade-out and the next tile's fade-in overlap,
          both are already near-invisible and blend into the shared flat
          `bg-[#030014]` base instead of clashing. That base color is what
          actually shows at every seam; no edge of the image ever meets
          another edge of the image directly.

          Two separate assets, swapped by breakpoint rather than one image
          reused at both sizes: the desktop art is landscape (1536×1024) and
          reads as a wide wall; a straight scale-down onto a narrow phone
          screen left barely a sliver of it visible per pixel of height, so
          there's a second, purpose-composed portrait version (830×1896)
          for below `md` that shows the same motifs (corner tags, the wheel
          mark, the smoke) at a scale that actually fills a phone screen. */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: "url(/brand/bg-texture.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100vw auto",
          backgroundPosition: "center top",
          maskImage:
            "repeating-linear-gradient(to bottom, transparent 0vw, black 8vw, black 58.7vw, transparent 66.7vw)",
          WebkitMaskImage:
            "repeating-linear-gradient(to bottom, transparent 0vw, black 8vw, black 58.7vw, transparent 66.7vw)",
          opacity: 1,
        }}
      />
      <div
        className="absolute inset-0 block md:hidden"
        style={{
          backgroundImage: "url(/brand/bg-texture-mobile.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100vw auto",
          backgroundPosition: "center top",
          maskImage:
            "repeating-linear-gradient(to bottom, transparent 0vw, black 18vw, black 210.4vw, transparent 228.4vw)",
          WebkitMaskImage:
            "repeating-linear-gradient(to bottom, transparent 0vw, black 18vw, black 210.4vw, transparent 228.4vw)",
          opacity: 1,
        }}
      />
      {NEBULAE.map((n, i) => (
        <div
          key={i}
          className="nebula-blob absolute rounded-full"
          style={{
            top: n.top,
            left: n.left,
            width: n.size,
            height: n.size,
            marginLeft: `calc(${n.size} / -2)`,
            marginTop: `calc(${n.size} / -2)`,
            background: `radial-gradient(circle, rgba(${n.color},${n.opacity}) 0%, transparent 70%)`,
            animationDuration: `${n.duration}s`,
            animationDelay: `${-i * 5}s`,
          }}
        />
      ))}
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-white ${star.twinkle ? "star-twinkle" : ""}`}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            ...(star.twinkle
              ? {
                  ["--twinkle-base" as string]: star.opacity,
                  animationDuration: `${star.twinkleDuration}s`,
                  animationDelay: `${star.twinkleDelay}s`,
                }
              : {}),
          }}
        />
      ))}
    </div>
  );
}
