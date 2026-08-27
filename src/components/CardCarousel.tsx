"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CATEGORY_LABELS, type OfferSeed } from "@/data/offers";
import { getBankLogo } from "@/data/bankLogos";

// One gradient per card — a cosmic violet-to-blue palette matching the site's
// starlit theme, since we don't have licensed card-face artwork for these
// offers. Each layers two soft, semi-transparent nebula highlights (pink and
// cyan) over a dark violet-to-blue base, so the card reads as a patch of the
// same starfield behind it rather than a flat corporate gradient — while
// staying dark enough at the edges for white text to stay legible.
const CARD_GRADIENTS = [
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 18% 20%, rgba(226,156,255,0.16) 0%, transparent 40%), radial-gradient(circle at 82% 78%, rgba(125,211,255,0.14) 0%, transparent 45%), linear-gradient(135deg, #0d0730 0%, #241a6b 50%, #3d2ba8 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 20% 25%, rgba(226,156,255,0.14) 0%, transparent 42%), radial-gradient(circle at 80% 75%, rgba(147,130,255,0.16) 0%, transparent 45%), linear-gradient(135deg, #10093a 0%, #3b1f8a 50%, #6b3fd6 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 15% 80%, rgba(125,211,255,0.16) 0%, transparent 42%), radial-gradient(circle at 85% 20%, rgba(147,130,255,0.12) 0%, transparent 40%), linear-gradient(135deg, #060420 0%, #1c1550 50%, #2f4fc9 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 20% 20%, rgba(147,130,255,0.16) 0%, transparent 42%), radial-gradient(circle at 80% 80%, rgba(226,156,255,0.12) 0%, transparent 40%), linear-gradient(135deg, #0b0836 0%, #2a1c7a 50%, #5046e4 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 22% 78%, rgba(125,211,255,0.15) 0%, transparent 42%), radial-gradient(circle at 78% 22%, rgba(226,156,255,0.13) 0%, transparent 40%), linear-gradient(135deg, #100a3f 0%, #341f8f 50%, #4f6be8 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 18% 22%, rgba(147,130,255,0.14) 0%, transparent 42%), radial-gradient(circle at 82% 80%, rgba(125,211,255,0.14) 0%, transparent 40%), linear-gradient(135deg, #08051f 0%, #221463 50%, #3557d4 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 20% 78%, rgba(226,156,255,0.15) 0%, transparent 42%), radial-gradient(circle at 80% 20%, rgba(147,130,255,0.14) 0%, transparent 40%), linear-gradient(135deg, #0e0838 0%, #3a1a72 50%, #7d3fd1 100%)",
  "radial-gradient(circle at 50% 4%, rgba(255,255,255,0.10) 0%, transparent 26%), radial-gradient(circle at 18% 20%, rgba(125,211,255,0.14) 0%, transparent 42%), radial-gradient(circle at 82% 78%, rgba(147,130,255,0.12) 0%, transparent 40%), linear-gradient(135deg, #050318 0%, #171050 50%, #2540a8 100%)",
];

// Spreads each card's light-sweep animation out of phase so a full carousel
// or grid never pulses in unison — matches the .card-float stagger pattern.
const sheenDelay = (i: number) => `${(i % 6) * 1.1}s`;

// Named, documented constants instead of magic numbers scattered through the
// physics loop — the carousel drives its own imperative rAF transform loop
// rather than motion/react (a continuous physics-style drift plus wheel/
// click/drag input doesn't map onto declarative variants), but it still
// borrows the same discipline: every duration and easing choice below is a
// deliberate, named value, not a number that just happened to look right.
// A prior pass pushed these considerably faster (manualEase 0.09->0.13,
// driftSpeed 0.0016->0.0027). On a real phone that read as stutter and
// crooked-looking overshoot rather than "livelier" — the per-zone position
// formulas (see renderLoop) were tuned against the slower original 0.0016,
// and snapping through them faster than they were designed for is exactly
// what exposes a rough transition as a visible glitch instead of hiding it
// in motion. driftSpeed is back at the original calm pace; manualEase stays
// the modest step up (it only governs how fast a click/wheel/swipe target is
// approached, not the ambient drift, so it doesn't fight the zone formulas
// the same way).
const MOTION = {
  manualEase: 0.105, // lerp factor easing toward a clicked/scrolled/swiped target
  driftSpeed: 0.0016, // per-frame progress increment for the idle auto-rotate
  tiltEase: 0.08, // lerp factor for the mouse-parallax tilt
  entranceStaggerMs: 70, // gap between each card's entrance start (50-100ms is the readable band — faster reads as mechanical, slower as sluggish)
  entranceDurationMs: 550, // a single card's fan-in-and-settle
  swipeThresholdPx: 36, // minimum horizontal drag before a touch swipe counts as "flip one card"
  frameIntervalMs: 1000 / 30, // cap the physics loop at 30fps. Tried uncapping this once SplashCursor was removed, expecting the extra headroom to make it safe — measured instead: on /offers with up to 4 of these mounted at once (one per category) under heavy load, uncapped frame time went right back to ~80ms avg, almost as bad as with SplashCursor still in the page. The cap was never about SplashCursor specifically; it's about N simultaneous physics loops each doing real work every tick. This is a slow, continuous drift (see driftSpeed), not fast action, so 30fps reads identically smooth to 60 — the visible motion doesn't change, only the CPU cost per carousel does.
} as const;

interface CardCarouselProps {
  offers: OfferSeed[];
  /** Caps card width so a carousel embedded in a narrow section doesn't grow
   * as large as the full-bleed hero one. */
  maxCardWidth?: number;
  /** Whether scrolling over the carousel captures the wheel to flip cards
   * instead of scrolling the page. Reserve this for a single full-viewport
   * showcase (the hero) — turning it on for several smaller carousels
   * stacked down a page traps the user's scroll gesture at each one. */
  captureWheel?: boolean;
}

export default function CardCarousel({
  offers,
  maxCardWidth = 336,
  captureWheel = true,
}: CardCarouselProps) {
  const cardCount = offers.length;
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const frameId = useRef<number>(0);
  const progress = useRef<number>(0);
  const manualTarget = useRef<number | null>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const containerSize = useRef({ w: 1200, h: 600 });

  const [metrics, setMetrics] = useState({ cardW: 260, cardH: 163 });

  // Nearest equivalent (accounting for wraparound) of card index `i` to the
  // carousel's current position — used both to decide whether a click should
  // navigate (center card) or recenter (side card).
  const wrappedOffset = (i: number, from: number) => {
    let offset = i - from;
    const half = cardCount / 2;
    while (offset > half) offset -= cardCount;
    while (offset < -half) offset += cardCount;
    return offset;
  };

  // Ease the carousel toward card `i` without resetting the continuous
  // auto-rotation — it simply resumes from the new position once it arrives.
  const bringToCenter = (i: number) => {
    manualTarget.current = progress.current + wrappedOffset(i, progress.current);
  };

  const handleCardClick = (e: React.MouseEvent, i: number) => {
    if (cardCount <= 1) return;
    const offset = wrappedOffset(i, progress.current);
    if (Math.abs(offset) > 0.5) {
      e.preventDefault();
      bringToCenter(i);
    }
  };

  const lastWheelAt = useRef(0);

  // Reduced-motion users still get a fully interactive carousel (wheel and
  // click navigation stay intact — those are direct responses to input, not
  // ambient motion) but lose the two purely decorative pieces: the idle
  // auto-drift and the entrance fan-in both check this before running.
  const reducedMotion = useRef(false);
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = performance.now();
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onChange = () => {
      reducedMotion.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion.current) return;
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };
    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Measures the carousel's own container (not the viewport), so the exact
  // same component works full-bleed in the hero and boxed inside a category
  // section without either overflowing or shrinking to nothing.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      containerSize.current = { w, h };

      let cardW = Math.round(w * 0.16 + 130);
      const heightFactor = Math.min(1.0, Math.max(0.65, h / 850));
      cardW = Math.round(cardW * heightFactor);
      cardW = Math.min(maxCardWidth, Math.max(150, cardW));
      const cardH = Math.round(cardW / 1.5925);
      setMetrics({ cardW, cardH });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [maxCardWidth]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || cardCount <= 1 || !captureWheel) return;
    const onWheel = (e: WheelEvent) => {
      // Always capture — scrolling over the carousel flips cards only, it
      // never also scrolls the page underneath it. Only ever wired up for
      // the one carousel this is meant for (see captureWheel above).
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4) return;
      const now = performance.now();
      if (now - lastWheelAt.current < 300) return;
      lastWheelAt.current = now;
      const base = manualTarget.current ?? progress.current;
      manualTarget.current = base + (e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [cardCount, captureWheel]);

  // Touch equivalent of the wheel handler — a horizontal swipe flips one
  // card, exactly like one wheel tick. The direction check on the first few
  // pixels of movement is what keeps this from breaking normal page
  // scrolling: a mostly-vertical drag is released back to the browser
  // untouched (no preventDefault ever called on it), so a phone scrolls
  // straight through the carousel the same as it scrolls past any other
  // section. Only once a gesture reveals itself as horizontal do we take
  // over — and only for that one gesture.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || cardCount <= 1 || !captureWheel) return;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let axis: "pending" | "horizontal" | "vertical" = "pending";
    const decideAt = 8; // px of movement before committing to an axis

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = lastX = t.clientX;
      startY = t.clientY;
      axis = "pending";
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      lastX = t.clientX;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (axis === "pending") {
        if (Math.abs(dx) < decideAt && Math.abs(dy) < decideAt) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }
      if (axis === "horizontal") e.preventDefault();
      // axis === "vertical": never call preventDefault — the page scrolls.
    };

    const onTouchEnd = () => {
      if (axis === "horizontal") {
        const dx = lastX - startX;
        if (Math.abs(dx) >= MOTION.swipeThresholdPx) {
          const base = manualTarget.current ?? progress.current;
          manualTarget.current = base + (dx < 0 ? 1 : -1);
        }
      }
      axis = "pending";
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [cardCount, captureWheel]);

  // dtScale = 1 means "exactly the 60fps frame time the constants above were
  // tuned against". Now that the loop is capped at 30fps (see frameIntervalMs),
  // each call covers roughly twice that gap, so dtScale lands near 2 and the
  // per-call increments below scale up to match — the drift and easing speed
  // read the same in real time regardless of how often renderLoop actually
  // runs. Clamped so a backgrounded tab regaining focus after a long pause
  // doesn't fling the carousel forward in one jump.
  const renderLoop = (dtScale: number) => {
    if (manualTarget.current !== null) {
      const remaining = manualTarget.current - progress.current;
      if (Math.abs(remaining) < 0.002) {
        progress.current = manualTarget.current;
        manualTarget.current = null;
      } else {
        progress.current += remaining * Math.min(0.9, MOTION.manualEase * dtScale);
      }
    } else if (cardCount > 1 && !reducedMotion.current) {
      progress.current += MOTION.driftSpeed * dtScale;
    }
    const tilt = Math.min(0.9, MOTION.tiltEase * dtScale);
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * tilt;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * tilt;

    const cards = cardsRefs.current;
    const h = containerSize.current.h;

    // Entrance: cards fan into their spread positions rather than snapping
    // there on mount — each starts faded and slightly shrunk, staggered by
    // index, then settles with a smoothstep ease. Skipped entirely once
    // every card has finished (cheap early-out) or under reduced motion.
    const entranceElapsed = reducedMotion.current ? Infinity : performance.now() - mountedAt.current;
    const entranceTotalMs = (cardCount - 1) * MOTION.entranceStaggerMs + MOTION.entranceDurationMs;
    const entranceActive = entranceElapsed < entranceTotalMs;

    const continuousProgress = progress.current;
    const roundedIndex = Math.round(continuousProgress);
    const diffFromRound = continuousProgress - roundedIndex;
    const easedDiff =
      Math.sign(diffFromRound) * Math.pow(Math.abs(diffFromRound) * 2, 4.2) / 2;
    const virtualActiveIndex = roundedIndex + easedDiff;

    // Read once, before any card style is written this frame — every card in
    // a carousel shares the same height (they're all sized off the same
    // metrics.cardH), so measuring it per-card inside the loop below bought
    // nothing except forced synchronous layout: read offsetHeight from card
    // i right after card i-1's transform/opacity write invalidates layout,
    // and the browser must flush that write before it can answer the read.
    // Across cardCount cards, every frame, on up to 4 carousels mounted at
    // once (one per category on /offers), that's real, avoidable thrashing.
    // A single read up front still stays live (no stale-metrics bug — see
    // the note on the tick effect below) without repeating it per card.
    let cardH = 0;
    for (let j = 0; j < cardCount; j++) {
      if (cards[j]) {
        cardH = cards[j]!.offsetHeight;
        break;
      }
    }

    for (let i = 0; i < cardCount; i++) {
      const card = cards[i];
      if (!card) continue;

      let offset = i - virtualActiveIndex;
      const halfCount = cardCount / 2;
      while (offset > halfCount) offset -= cardCount;
      while (offset < -halfCount) offset += cardCount;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset > 3.0) {
        card.style.visibility = "hidden";
        continue;
      } else {
        card.style.visibility = "visible";
      }

      const gap = 36;
      const peekAmount = -55;
      const D = 1350;

      let y = 0;
      let z = 0;
      let rot = 0;

      if (absOffset <= 1) {
        const t = absOffset;
        const easedT = t * t * (3 - 2 * t);
        const targetY = cardH + gap;
        y = -sign * (easedT * targetY);
        z = 400 + easedT * (220 - 400);
        rot = easedT * 132;
      } else if (absOffset <= 2) {
        const t = absOffset - 1;
        const easedT = t * t * (3 - 2 * t);
        const yStart = cardH + gap;
        const zStart = 220;
        const rotStart = 132;
        const zEnd = -60;
        const rotEnd = 175;
        const sEnd = D / (D - zEnd);
        const yEnd = (h / 2 - peekAmount) / sEnd - cardH / 2;
        const currentY = yStart + easedT * (yEnd - yStart);
        y = -sign * currentY;
        z = zStart + easedT * (zEnd - zStart);
        rot = rotStart + easedT * (rotEnd - rotStart);
      } else {
        const t = Math.min(absOffset - 2, 1);
        const easedT = t * t * (3 - 2 * t);
        const zStart = -60;
        const rotStart = 175;
        const zEnd3 = -250;
        const rotEnd3 = 195;
        const sEnd2 = D / (D - zStart);
        const yEnd2 = (h / 2 - peekAmount) / sEnd2 - cardH / 2;
        const sEnd3 = D / (D - zEnd3);
        const yEnd3 = (h / 2 + 100) / sEnd3 + cardH / 2;
        const currentY = yEnd2 + easedT * (yEnd3 - yEnd2);
        y = -sign * currentY;
        z = zStart + easedT * (zEnd3 - zStart);
        rot = rotStart + easedT * (rotEnd3 - rotStart);
      }

      const localCardRotation = -sign * rot;
      const centerFactor = Math.max(0, 1 - absOffset);
      const maxTiltY = 15;
      const maxTiltX = 12;
      const activeTiltX = -mouse.current.y * maxTiltX * centerFactor;
      const activeTiltY = mouse.current.x * maxTiltY * centerFactor;
      const totalRotX = localCardRotation + activeTiltX;
      const totalRotY = activeTiltY;

      // In the absOffset<=1 zone, rot = easedT*132 (easedT the smoothstep of
      // absOffset). The card's front face has backface-visibility:hidden, so
      // once rot passes 90deg the BACK face is what's actually on screen —
      // that crossover lands at absOffset≈0.63 (solving easedT=90/132 through
      // the smoothstep). Dense offer text (bank name, description, price) at
      // that shallow, foreshortened rotation never reads as clean — mirrored,
      // squashed, overlapping whatever's behind it — no matter how visible
      // it is, so it needs to thin out fast, not ease gently over the whole
      // remaining range. But it shouldn't vanish to nothing either: a card
      // that drops to full 0 and stays invisible for the rest of its arc
      // reads as popping out of existence, then popping back in once it
      // wraps around toward becoming the next centered card. Settling at a
      // low "ghost" floor instead — always faintly present, never gone —
      // means the only real transition left is that ghost solidifying back
      // into a sharp, readable card as it approaches center, exactly once,
      // with nothing in between to look like a glitch.
      const readableUntil = 0.63;
      const ghostBy = 1.15;
      const ghostOpacity = 0.15;
      let opacity = 1;
      if (absOffset > readableUntil) {
        const t = Math.min(1, (absOffset - readableUntil) / (ghostBy - readableUntil));
        const eased = t * t * (3 - 2 * t);
        opacity = 1 - eased * (1 - ghostOpacity);
      }

      // The ghost floor only makes sense near center, where it's actually
      // reading as "the next/previous card, about to solidify" — it should
      // NOT still be lingering, even faintly, all the way out toward the
      // far side. So it holds briefly, then eases the rest of the way down
      // to genuinely 0 (not just faint) well before the visibility cutoff
      // at absOffset 3.0, leaving a full stretch where the card is
      // completely gone rather than a barely-visible trace someone can
      // still spot.
      const farFadeStart = 1.6;
      const farFadeEnd = 2.0;
      if (absOffset > farFadeStart) {
        const tf = Math.min(1, (absOffset - farFadeStart) / (farFadeEnd - farFadeStart));
        const easedf = tf * tf * (3 - 2 * tf);
        opacity *= 1 - easedf;
      }

      let entranceScale = 1;
      if (entranceActive) {
        const cardStart = i * MOTION.entranceStaggerMs;
        const t = Math.min(1, Math.max(0, (entranceElapsed - cardStart) / MOTION.entranceDurationMs));
        const eased = t * t * (3 - 2 * t); // smoothstep
        opacity *= eased;
        entranceScale = 0.72 + 0.28 * eased;
      }

      card.style.zIndex = Math.round(z).toString();
      card.style.opacity = opacity.toFixed(3);
      card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(
        2
      )}px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(
        2
      )}deg) rotateZ(-3deg) scale(${entranceScale.toFixed(3)})`;
    }
  };

  // Several of these can be mounted at once on a page (one per category) —
  // only the one actually on screen needs to spend a render pass every
  // frame. The rAF request itself stays scheduled either way (that part is
  // free); this only skips the per-card transform writes while scrolled out
  // of view.
  const isVisible = useRef(true);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let lastFrameAt = 0;
    const tick = (now: number) => {
      if (isVisible.current && now - lastFrameAt >= MOTION.frameIntervalMs - 1) {
        const dtMs = lastFrameAt === 0 ? 1000 / 60 : now - lastFrameAt;
        const dtScale = Math.min(4, Math.max(0.2, dtMs / (1000 / 60)));
        lastFrameAt = now;
        renderLoop(dtScale);
      }
      frameId.current = requestAnimationFrame(tick);
    };
    frameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId.current);
    // renderLoop reads card size straight from the DOM (offsetHeight) each
    // frame now, not from `metrics` — the loop never needs to restart when
    // metrics changes, so this mounts once and keeps ticking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real volumetric 3D thickness — five stacked slices instead of a flat
  // front+back pair, so a card rotated near edge-on reads as an object with
  // depth rather than a sheet of paper. The sliver-under-the-card artifact
  // this used to cause turned out not to be about these layers at all: it
  // was the back face of an entirely different card (one in the 1-2 offset
  // "edge-on" zone) overlapping the near card's screen region, since sibling
  // 3D elements only stack by z-index, not true occlusion. That's fixed
  // directly below via the near-fade opacity zone, so it's safe to bring the
  // full stack back.
  const thicknessLayers = [-1.47, -0.73, 0, 0.73, 1.47];

  // Card copy is sized off the card's actual rendered pixel width, not
  // viewport breakpoints — a category carousel's cards can render far
  // smaller than the hero's even at the same browser width, and text sized
  // purely by Tailwind's sm:/md: classes doesn't know that, so it overflows
  // ("text sliding off" the card). 336px is the hero's own default width —
  // everything scales relative to that reference.
  const textScale = metrics.cardW / 336;
  const fs = (base: number, min: number) => Math.max(min, Math.round(base * textScale * 10) / 10);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 bg-transparent text-[#f4f0ff] flex items-center justify-center overflow-hidden select-none contain-layout"
    >
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{ perspective: "1350px" }}
      >
        <div
          className="absolute"
          style={{
            width: `${metrics.cardW}px`,
            height: `${metrics.cardH}px`,
            transformStyle: "preserve-3d",
          }}
        >
          {offers.map((offer, i) => (
            <div
              key={offer.slug}
              ref={(el) => {
                cardsRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{
                width: `${metrics.cardW}px`,
                height: `${metrics.cardH}px`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "visible",
              }}
            >
              {thicknessLayers.map((zOffset, layerIdx) => {
                const isFrontFace = layerIdx === thicknessLayers.length - 1;
                const isBackFace = layerIdx === 0;
                const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];

                // Middle structural slices — inert, non-interactive filler
                // that gives the card physical edge thickness when it's
                // rotated far enough to show its side. Never intercepts
                // clicks; only the front and back faces are interactive.
                if (!isFrontFace && !isBackFace) {
                  return (
                    <div
                      key={layerIdx}
                      className="absolute inset-0 rounded-[16px] border border-white/10 pointer-events-none overflow-hidden"
                      style={{
                        backgroundColor: "#1c1450",
                        transform: `translateZ(${zOffset}px)`,
                      }}
                    />
                  );
                }

                if (isFrontFace) {
                  return (
                    <Link
                      href={`/offers/${offer.slug}`}
                      key={layerIdx}
                      onClick={(e) => handleCardClick(e, i)}
                      className="absolute inset-0 rounded-[16px] border border-white/20 pointer-events-auto overflow-hidden block cursor-pointer"
                      style={{
                        background: gradient,
                        transform: `translateZ(${zOffset}px)`,
                        backfaceVisibility: "hidden",
                        // Layered like a real card catching light rather than
                        // a flat gradient rectangle: a bevel highlight along
                        // the top inner edge, a soft inner shadow pooling at
                        // the bottom for weight, and an outer drop shadow
                        // that grounds it against whatever's behind it.
                        boxShadow: [
                          "inset 0 1px 1px rgba(255,255,255,0.2)",
                          "inset 0 -14px 22px -10px rgba(0,0,0,0.4)",
                          "0 20px 34px -14px rgba(0,0,0,0.55)",
                          "0 0 0 1px rgba(147,130,255,0.1)",
                        ].join(", "),
                      }}
                    >
                      <div
                        className="card-sheen"
                        style={{ "--sheen-delay": sheenDelay(i) } as React.CSSProperties}
                      />
                      <div
                        className="absolute inset-0 text-white h-full w-full font-sans z-10 flex flex-col justify-between"
                        style={{ padding: fs(20, 10) }}
                      >
                        {/* Bank identity, top */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="flex shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm"
                              style={{ width: fs(36, 20), height: fs(36, 20) }}
                            >
                              {getBankLogo(offer.bankKey) ? (
                                <img
                                  src={getBankLogo(offer.bankKey)}
                                  alt=""
                                  className="h-full w-full object-contain"
                                  draggable={false}
                                />
                              ) : (
                                <span className="text-xs font-bold text-black">
                                  {offer.bank.slice(0, 1)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div
                                className="truncate whitespace-nowrap font-display leading-tight text-white"
                                style={{ textShadow: "0 0 12px rgba(147,130,255,0.7)", fontSize: fs(18, 10) }}
                              >
                                {offer.bank}
                              </div>
                              <div
                                className="truncate whitespace-nowrap uppercase tracking-wider text-[#c9b7ff]"
                                style={{ fontSize: fs(12, 7) }}
                              >
                                {CATEGORY_LABELS[offer.category]}
                              </div>
                            </div>
                          </div>
                          <span
                            className="shrink-0 whitespace-nowrap rounded-[32px] bg-[#9382ff]/25 px-2.5 py-1 font-semibold text-white backdrop-blur-sm ring-1 ring-[#9382ff]/40"
                            style={{ fontSize: fs(10, 7) }}
                          >
                            {offer.defaultHoldDays} дн. холд
                          </span>
                        </div>

                        {/* Offer detail, middle */}
                        <p
                          className="line-clamp-2 leading-snug text-white/85"
                          style={{ fontSize: fs(12, 8) }}
                        >
                          {offer.action}
                        </p>

                        {/* Price + chip, bottom */}
                        <div className="flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <div
                              className="truncate whitespace-nowrap text-[#c9b7ff]"
                              style={{ fontSize: fs(12, 7) }}
                            >
                              Ваша цена
                            </div>
                            <div
                              className="truncate whitespace-nowrap font-display tabular-nums text-white"
                              style={{ textShadow: "0 0 18px rgba(125,211,255,0.55)", fontSize: fs(28, 14) }}
                            >
                              {offer.price.toLocaleString("ru-RU")} ₽
                            </div>
                          </div>
                          <svg
                            className="shrink-0 opacity-90"
                            style={{ width: fs(29, 16), height: fs(29, 16) }}
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M20 8H40V14C40.0016 14.5299 40.2128 15.0377 40.5875 15.4125C40.9623 15.7872 41.4701 15.9984 42 16H59V24H42C41.4701 24.0016 40.9623 24.2128 40.5875 24.5875C40.2128 24.9623 40.0016 25.4701 40 26V52H20V8ZM18 8H8.00039C4.47435 8 1.56576 10.6083 1.08 14H18V8ZM1 16V24V26V34V36V44H18V36H1V34H18V26H1V24H18V16H1ZM1.08 46C1.56576 49.3917 4.47435 52 8.00039 52H18V46H1.08ZM42 14V8H52.0004C55.5264 8 58.4342 10.6084 58.92 14H42ZM59 26H42V34H59V26ZM59 36H42V44H59V36ZM52.0004 52H42V46H58.92C58.4342 49.3916 55.5264 52 52.0004 52Z"
                              fill={`url(#chipGradient${i})`}
                            />
                            <defs>
                              <linearGradient id={`chipGradient${i}`} x1="30" y1="8" x2="30" y2="52" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" />
                                <stop offset="1" stopColor="#999999" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Back face — clicking a card shown edge-on/back-on recenters it too.
                return (
                  <div
                    key={layerIdx}
                    role="button"
                    tabIndex={-1}
                    onClick={() => bringToCenter(i)}
                    className="absolute inset-0 rounded-[16px] border border-white/15 pointer-events-auto overflow-hidden cursor-pointer"
                    style={{
                      background: gradient,
                      transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                      backfaceVisibility: "hidden",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
                    }}
                  >
                    <div className="absolute left-0 right-0 top-4 sm:top-5 h-7 sm:h-9 bg-black/85 backdrop-blur-md z-10 flex items-center px-4">
                      {getBankLogo(offer.bankKey) && (
                        <img
                          src={getBankLogo(offer.bankKey)}
                          alt=""
                          className="h-4 w-4 sm:h-5 sm:w-5 object-contain rounded-full bg-white/90 p-0.5"
                          draggable={false}
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 sm:pb-6 gap-1 sm:gap-1.5 z-20 text-center px-4">
                      <div
                        className="line-clamp-2 max-w-[90%] font-mono text-[11px] sm:text-[13px] font-semibold tracking-[0.06em] text-white"
                        style={{ textShadow: "0 0 10px rgba(147,130,255,0.6)" }}
                      >
                        {offer.name}
                      </div>
                      <div className="font-mono text-[9px] sm:text-[10px] text-[#c9b7ff] line-clamp-2 max-w-[85%]">
                        {offer.action}
                      </div>
                      <div className="mt-1 flex items-center gap-3 font-mono text-[9px] sm:text-[10px] text-white/90">
                        <span className="font-semibold">
                          {offer.price.toLocaleString("ru-RU")} ₽
                        </span>
                        <span className="text-[#9382ff]">·</span>
                        <span>холд {offer.defaultHoldDays} дн.</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
