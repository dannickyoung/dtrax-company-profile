"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BASE } from "@/lib/base-path";
import { DeckProvider, Stage, type DeckSlide } from "./Deck";
import { FullscreenButton, IntroVideo, toggleFullscreen, useActive } from "./IntroVideo";

/**
 * Presenter view. → / space / click reveals the next step on the slide,
 * then moves on. ← steps back. Slides that have finished revealing stay
 * revealed when you return to them.
 */
/** Controls float over the slide and fade out after this long without the mouse moving. */
const IDLE_MS = 2500;

/**
 * `size` sets the canvas for every slide; landscape 1920 × 1080 by default (a portrait deck passes its own).
 * `intro` is a video that plays full screen when the deck opens at slide 1, then fades into it. Live decks only.
 */
export function DeckPlayer({ slides, size, intro }: { slides: DeckSlide[]; size?: { width: number; height: number }; intro?: string }) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const steps = slides[index]?.steps ?? 0;
  // "playing": intro covers the screen and slide 1 isn't rendered yet; "revealing": slide 1 renders under the fading
  // curtain so its entrance animation plays from black; "done": intro gone.
  const [introState, setIntroState] = useState<"playing" | "revealing" | "done">(intro ? "playing" : "done");
  const introOn = useRef(introState !== "done");
  introOn.current = introState !== "done";

  const go = useCallback((target: number, atEnd = false) => {
    if (target < 0 || target >= total) return;
    setIndex(target);
    setStep(atEnd ? slides[target].steps ?? 0 : 0);
  }, [slides, total]);

  const next = useCallback(() => (step < steps ? setStep(step + 1) : go(index + 1)), [go, index, step, steps]);
  const prev = useCallback(() => (step > 0 ? setStep(step - 1) : go(index - 1, true)), [go, index, step]);

  useEffect(() => {
    const fromHash = Number.parseInt(window.location.hash.replace("#", ""), 10);
    if (Number.isFinite(fromHash) && fromHash >= 1 && fromHash <= total) go(fromHash - 1);
    // Opening on a later slide (a shared link, a refresh mid-pitch) skips the intro.
    if (Number.isFinite(fromHash) && fromHash > 1) setIntroState("done");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  // Links inside a deck (e.g. a contents page) jump by setting the hash; the player follows without a reload.
  useEffect(() => {
    const onHash = () => {
      const target = Number.parseInt(window.location.hash.replace("#", ""), 10);
      if (Number.isFinite(target) && target >= 1 && target <= total) go(target - 1);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [go, total]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(event.key)) { event.preventDefault(); next(); }
      if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(event.key)) { event.preventDefault(); prev(); }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(total - 1, true);
      if (event.key === "f") toggleFullscreen();
      if (event.key === "Escape") window.location.href = `${BASE}/`;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, next, prev, total]);

  useEffect(() => {
    let startX = 0;
    const onStart = (event: TouchEvent) => { startX = event.touches[0].clientX; };
    const onEnd = (event: TouchEvent) => {
      if (introOn.current) return;
      const dx = event.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [next, prev]);

  // Decode the upcoming slides' photos ahead of time, so they are ready to paint the moment you arrive.
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    root.current?.querySelectorAll<HTMLImageElement>("[data-preload] img").forEach((img) => { img.decode?.().catch(() => {}); });
  }, [index]);

  // Controls show while the mouse moves (or a key is pressed) and fade out when idle, so the slide is unobstructed.
  const controls = useActive(IDLE_MS);

  const slide = slides[index];
  /** The next two slides, rendered out of sight so their photos are already loaded on arrival. */
  // While the intro plays, slide 1 isn't on screen yet, so preload it too: its photos are decoded before the hand-off.
  const upcoming = slides.slice(introState === "playing" ? index : index + 1, index + 3);
  /** Translucent glass so the slide shows through; reads on both light and dark slides. */
  const glass = "border border-white/25 bg-[#1b1a1a]/25 text-white shadow-[0_4px_16px_rgba(0,0,0,0.10)] backdrop-blur-md";
  const button = `pointer-events-auto flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium outline-none transition hover:bg-[#1b1a1a]/45 disabled:opacity-0 ${glass}`;

  return (
    <div ref={root} className="fixed inset-0 select-none overflow-hidden bg-[#2a2827]">
      <Stage width={size?.width} height={size?.height}>
        <DeckProvider step={step} print={false}>
          {/* Slides cut straight to the next one: fading the whole slide showed the empty stage behind it as a blink. Content still arrives with its own motion. */}
          {introState !== "playing" && (
            <div key={slide.id} className="absolute inset-0" onClick={next}>
              {slide.render()}
            </div>
          )}
        </DeckProvider>
        <DeckProvider step={Infinity} print>
          {upcoming.map((next) => <div key={next.id} data-preload="" aria-hidden="true" className="pointer-events-none invisible absolute inset-0">{next.render()}</div>)}
        </DeckProvider>
      </Stage>

      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[68px] items-center justify-between gap-3 px-5 transition-opacity duration-500 ${controls ? "opacity-100" : "opacity-0 [&_*]:pointer-events-none"}`}>
        <div className="flex items-center gap-2">
          <button type="button" className={button} onClick={prev} disabled={index === 0 && step === 0} aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" className={button} onClick={next} disabled={index === total - 1 && step === steps} aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          <span className={`pointer-events-auto rounded-full px-3 py-1.5 font-mono text-[12px] ${glass}`}>
            {index + 1} / {total}{steps ? ` · ${step}/${steps}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FullscreenButton className={`pointer-events-auto transition hover:bg-[#1b1a1a]/45 ${glass}`} />
        </div>
      </div>

      {intro && introState !== "done" && (
        <IntroVideo src={intro} onReveal={() => setIntroState("revealing")} onDone={() => setIntroState("done")} />
      )}

      <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-white/10">
        <motion.div className="h-full bg-[#DDFF97]" animate={{ width: `${((index + (steps ? step / (steps + 1) : 0) + 1) / total) * 100}%` }} transition={{ duration: 0.35 }} />
      </div>
    </div>
  );
}
