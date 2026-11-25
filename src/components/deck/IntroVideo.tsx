"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize, Minimize, Play } from "lucide-react";

/* Standard Fullscreen API plus the webkit-prefixed one (older Safari, iPad, some Android WebViews). iPhone browsers
   (all WebKit, Chrome included) have neither for pages: there the button explains instead of doing nothing. */
type WebkitDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void };
type WebkitEl = HTMLElement & { webkitRequestFullscreen?: () => void };
const fullscreenElement = () => document.fullscreenElement ?? (document as WebkitDoc).webkitFullscreenElement ?? null;
export const canFullscreen = () => {
  const el = document.documentElement as WebkitEl;
  return Boolean(el.requestFullscreen || el.webkitRequestFullscreen);
};
/** Enters or leaves full screen. Resolves true if the page ended up full screen when entering (false if refused). */
export const toggleFullscreen = async (): Promise<boolean> => {
  const doc = document as WebkitDoc;
  const el = document.documentElement as WebkitEl;
  try {
    if (fullscreenElement()) {
      await (document.exitFullscreen ? document.exitFullscreen() : doc.webkitExitFullscreen?.());
      return true;
    }
    if (el.requestFullscreen) await el.requestFullscreen().catch(() => el.webkitRequestFullscreen?.());
    else el.webkitRequestFullscreen?.();
  } catch {
    /* refused: checked below */
  }
  await new Promise((r) => setTimeout(r, 300)); // the webkit call doesn't return a promise
  return Boolean(fullscreenElement());
};

/** Opened from a Home Screen app (the website's deck page passes ?app=1): already full screen, nothing to toggle. */
const inHomeScreenApp = () => {
  try {
    return new URLSearchParams(window.location.search).has("app") || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  } catch {
    return false;
  }
};

/** True while the pointer has moved (or a key was pressed) in the last `ms`; utility buttons fade out when it's false. */
export function useActive(ms = 2500) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    let timer = window.setTimeout(() => setActive(false), ms);
    const wake = () => {
      setActive(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setActive(false), ms);
    };
    const events = ["mousemove", "pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [ms]);
  return active;
}

/** Tracks whether the page is full screen, so the button can show the right icon. */
export function useIsFullscreen() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(Boolean(fullscreenElement()));
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);
  return on;
}

export function FullscreenButton({ className = "" }: { className?: string }) {
  const on = useIsFullscreen();
  const [hint, setHint] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Checked after mount (the live decks are prerendered, where there is no window).
  useEffect(() => setHidden(inHomeScreenApp() && !canFullscreen()), []);
  useEffect(() => {
    if (!hint) return;
    const timer = window.setTimeout(() => setHint(false), 7000);
    return () => window.clearTimeout(timer);
  }, [hint]);
  if (hidden) return null;
  return (
<>
<button
  type="button"
  onClick={async (event) => {
    event.stopPropagation();
    if (!canFullscreen() || !(await toggleFullscreen())) setHint(true);
  }}
  aria-label={on ? "Exit full screen" : "Full screen"}
  title={on ? "Exit full screen (F)" : "Full screen (F)"}
  className={`flex h-10 w-10 items-center justify-center rounded-full outline-none ${className}`}
>
  {on ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
</button>
{hint && (
  <div role="status" className="fixed inset-x-4 bottom-20 z-[60] mx-auto max-w-[420px] rounded-2xl bg-[#151515]/90 px-5 py-4 text-center text-[15px] leading-snug text-white shadow-lg backdrop-blur">
    <p className="font-medium">Full screen on iPhone</p>
    <p className="mt-1 text-white/80">Open the deck&rsquo;s link in Safari or Chrome, tap Share, then <b>Add to Home Screen</b>. Open it from your Home Screen and it plays full screen.</p>
  </div>
)}
</>
  );
}

/**
 * Opens a live deck on a start screen. "Start" plays the intro video full screen with sound (the click counts as the
 * user gesture browsers require for audio). Skip, a click or any key ends it early.
 *
 * The hand-off always goes through black, never a cross-fade (that double-exposes the end card's logo over slide 1's).
 * The intro file itself fades to black in its last 0.6s; Skip cuts straight to that black final frame. Only then does
 * the overlay fade out over slide 1. The video is never changed while anything is fading: Chrome re-presents a
 * video's current frame for one frame whenever its layer changes, which showed as a flash.
 */
export function IntroVideo({ src, onReveal, onDone }: { src: string; onReveal: () => void; onDone: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // At its natural end the screen is already black. Skipped mid-video (or before starting): silence it and jump to the
  // black final frame — a clean cut — then reveal once that frame is showing.
  const finish = () => {
const el = video.current;
if (!el || el.ended || !Number.isFinite(el.duration)) return reveal();
el.muted = true;
el.pause();
el.addEventListener("seeked", reveal, { once: true });
window.setTimeout(reveal, 400); // in case the seek never reports back
el.currentTime = Math.max(0, el.duration - 0.02);
  };
  // Once the screen is black: let the deck mount slide 1 underneath, give its first paint time to land, then fade the
  // overlay out. Starting the fade straight away lets that paint eat the fade's first frames, so the slide pops in.
  // The overlay stays mounted with its state until the fade ends.
  const revealing = useRef(false);
  const reveal = () => {
if (revealing.current) return;
revealing.current = true;
onReveal();
// ~0.3s on black covers slide 1's first paint (its photos rasterize on first display) and reads as a deliberate beat.
window.setTimeout(() => setLeaving(true), 320);
  };
  const active = useActive();

  const start = () => {
const el = video.current;
if (!el) return finish();
setPlaying(true);
el.muted = false;
el.play().catch(() => {
  el.muted = true;
  el.play().catch(finish);
});
  };

  useEffect(() => {
// Capture phase, so the keypress belongs to the intro and doesn't also move the deck underneath.
const onKey = (event: KeyboardEvent) => {
  if (event.key === "f") return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (playing) finish();
  else if ([" ", "Enter"].includes(event.key)) start();
};
window.addEventListener("keydown", onKey, true);
return () => window.removeEventListener("keydown", onKey, true);
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const pill = "flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium outline-none transition";

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${leaving ? "pointer-events-none" : ""}`}
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onAnimationComplete={() => leaving && onDone()}
      onClick={() => { if (playing) finish(); }}
    >
      {/* Left in place until the overlay unmounts: removing or hiding it mid-fade would re-present its frame. */}
      <video ref={video} src={src} playsInline preload="auto" onEnded={finish} onError={finish} className="h-full w-full object-contain" />

      <AnimatePresence>
        {!playing && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/55" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); start(); }}
              className="flex h-14 items-center gap-3 rounded-full bg-white px-7 text-[15px] font-medium text-[#1b1a1a] outline-none shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition hover:scale-[1.03] active:scale-[0.97]"
            >
              <Play className="h-4 w-4 fill-current" /> Start
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); finish(); }} className={`${pill} text-white/60 hover:text-white`}>
              Skip to deck
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* While the video plays, Skip and full screen fade away until the mouse moves. */}
      <div className={`absolute bottom-5 right-5 flex gap-2 transition-opacity duration-500 ${!playing || active ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {playing && (
          <button type="button" onClick={(event) => { event.stopPropagation(); finish(); }} className={`${pill} bg-white/15 text-white backdrop-blur hover:bg-white/25`}>
            Skip
          </button>
        )}
        <FullscreenButton className="bg-white/15 text-white backdrop-blur transition hover:bg-white/25" />
      </div>
    </motion.div>
  );
}
