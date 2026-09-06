import { Children, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Magic UI Orbiting Circles: children revolve around the parent's centre. */
export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 24,
  radius = 160,
  path = true,
  iconSize = 64,
  speed = 1,
}: {
  className?: string;
  children?: ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}) {
  const calculated = duration / speed;
  const count = Children.count(children);
  return (
    <>
      {path && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
          <circle className="stroke-[#151515]/15 stroke-1" cx="50%" cy="50%" r={radius} fill="none" strokeDasharray="4 8" />
        </svg>
      )}
      {Children.map(children, (child, index) => {
        const angle = (360 / count) * index;
        return (
          <div
            style={
              {
                "--duration": calculated,
                "--radius": radius,
                "--angle": angle,
                width: iconSize,
                height: iconSize,
              } as CSSProperties
            }
            className={cn(
              "animate-orbit absolute flex transform-gpu items-center justify-center rounded-full",
              reverse && "[animation-direction:reverse]",
              className
            )}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}

/** Magic UI Ripple: concentric pulsing rings. */
export function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.22,
  numCircles = 6,
  color = "#151515",
  className,
}: {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 select-none", className)}>
      {Array.from({ length: numCircles }, (_, index) => {
        const size = mainCircleSize + index * 70;
        const opacity = Math.max(mainCircleOpacity - index * 0.03, 0.03);
        return (
          <div
            key={index}
            className="animate-ripple absolute left-1/2 top-1/2 rounded-full border"
            style={
              {
                width: size,
                height: size,
                opacity,
                borderColor: color,
                animationDelay: `${index * 0.25}s`,
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
