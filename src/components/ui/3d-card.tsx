"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const MouseEnterContext = createContext<boolean>(false);

/** Aceternity 3D Card: perspective tilt following the pointer; children with CardItem pop on Z. */
export function CardContainer({
  children,
  className,
  containerClassName,
  idle = false,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Gentle continuous tilt when nobody is hovering, for presentation mode. */
  idle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) / 22;
    const y = (event.clientY - top - height / 2) / 22;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  return (
    <MouseEnterContext.Provider value={entered}>
      <div className={cn("flex items-center justify-center", containerClassName)} style={{ perspective: "1200px" }}>
        <div
          ref={ref}
          onMouseEnter={() => setEntered(true)}
          onMouseMove={onMove}
          onMouseLeave={() => {
            setEntered(false);
            if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
          }}
          className={cn(
            "relative flex items-center justify-center transition-transform duration-200 ease-linear",
            idle && !entered && "animate-idle-tilt",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>{children}</div>
  );
}

export function CardItem({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useContext(MouseEnterContext);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = entered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
  }, [entered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
}
