"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Aceternity Glare Card: holographic foil that shifts with the pointer. Ink base, pastel foil. */
export function GlareCard({ children, className, containerClassName }: { children: ReactNode; className?: string; containerClassName?: string }) {
  const inside = useRef(false);
  const element = useRef<HTMLDivElement>(null);
  const state = useRef({ glare: { x: 50, y: 50 }, background: { x: 50, y: 50 }, rotate: { x: 0, y: 0 } });

  const containerStyle = {
    "--m-x": "50%", "--m-y": "50%", "--r-x": "0deg", "--r-y": "0deg", "--bg-x": "50%", "--bg-y": "50%",
    "--duration": "300ms", "--foil-size": "100%", "--opacity": "0", "--radius": "28px", "--easing": "ease",
    "--transition": "var(--duration) var(--easing)",
  } as CSSProperties;

  const backgroundStyle = {
    "--step": "5%",
    "--pattern": "none",
    "--rainbow":
      "repeating-linear-gradient(0deg, #FFB6B6 calc(var(--step) * 1), #DDFF97 calc(var(--step) * 2), #9DD6FF calc(var(--step) * 3), #FFB6B6 calc(var(--step) * 4)) 0% var(--bg-y)/200% 700% no-repeat",
    "--diagonal":
      "repeating-linear-gradient(128deg, #151515 0%, hsl(180,10%,60%) 3.8%, hsl(180,10%,60%) 4.5%, hsl(180,10%,60%) 5.2%, #151515 10%, #151515 12%) var(--bg-x) var(--bg-y)/300% no-repeat",
    "--shade":
      "radial-gradient(farthest-corner circle at var(--m-x) var(--m-y), rgba(255,255,255,0.1) 12%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.25) 120%) var(--bg-x) var(--bg-y)/300% no-repeat",
    backgroundBlendMode: "hue, hue, hue, overlay",
  } as CSSProperties;

  const update = () => {
    const node = element.current;
    if (!node) return;
    const { background, rotate, glare } = state.current;
    node.style.setProperty("--m-x", `${glare.x}%`);
    node.style.setProperty("--m-y", `${glare.y}%`);
    node.style.setProperty("--r-x", `${rotate.x}deg`);
    node.style.setProperty("--r-y", `${rotate.y}deg`);
    node.style.setProperty("--bg-x", `${background.x}%`);
    node.style.setProperty("--bg-y", `${background.y}%`);
  };

  return (
    <div
      style={containerStyle}
      className={cn("relative isolate w-full transition-transform delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] will-change-transform [contain:layout_style] [perspective:600px]", containerClassName)}
      ref={element}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const percentage = { x: (100 / rect.width) * (event.clientX - rect.left), y: (100 / rect.height) * (event.clientY - rect.top) };
        const delta = { x: percentage.x - 50, y: percentage.y - 50 };
        const { background, rotate, glare } = state.current;
        background.x = 50 + percentage.x / 4 - 12.5;
        background.y = 50 + percentage.y / 3 - 16.67;
        rotate.x = -(delta.x / 3.5) * 0.4;
        rotate.y = (delta.y / 2) * 0.4;
        glare.x = percentage.x;
        glare.y = percentage.y;
        update();
      }}
      onPointerEnter={() => {
        inside.current = true;
        window.setTimeout(() => {
          if (inside.current) element.current?.style.setProperty("--duration", "0s");
        }, 300);
      }}
      onPointerLeave={() => {
        inside.current = false;
        element.current?.style.removeProperty("--duration");
        element.current?.style.setProperty("--r-x", "0deg");
        element.current?.style.setProperty("--r-y", "0deg");
      }}
    >
      <div className="grid h-full origin-center overflow-hidden rounded-[var(--radius)] border border-white/10 transition-transform delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] will-change-transform [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] hover:filter-none hover:[--duration:200ms] hover:[--easing:linear] hover:[--opacity:0.55]">
        <div className="grid h-full w-full [clip-path:inset(0_0_0_0_round_var(--radius))] [grid-area:1/1]">
          <div className={cn("h-full w-full bg-[#151515]", className)}>{children}</div>
        </div>
        <div className="grid h-full w-full opacity-[var(--opacity)] mix-blend-soft-light transition-opacity delay-[var(--delay)] duration-[var(--duration)] ease-[var(--easing)] [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)] [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1]" />
        <div
          className="relative grid h-full w-full opacity-[var(--opacity)] mix-blend-color-dodge transition-opacity [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] [background-blend-mode:hue_hue_hue_overlay] [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1] after:bg-[inherit] after:content-[''] after:[background-blend-mode:soft-light,_hue,_hard-light] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-size:var(--foil-size),_200%_400%,_800%,_200%] after:[grid-area:inherit] after:mix-blend-exclusion"
          style={backgroundStyle}
        />
      </div>
    </div>
  );
}
