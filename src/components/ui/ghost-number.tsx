import { cn } from "@/lib/utils";

/** Huge outlined numeral used as a section watermark. */
export function GhostNumber({ children, className, dark = false }: { children: string; className?: string; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none select-none font-black leading-none tracking-[-0.06em]", className)}
      style={{
        color: "transparent",
        WebkitTextStroke: dark ? "1.5px rgba(255,255,255,0.18)" : "1.5px rgba(21,21,21,0.14)",
      }}
    >
      {children}
    </span>
  );
}
