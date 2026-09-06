"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProfileCardItem {
  name: string;
  role: string;
  experience: ReactNode;
  qualifications?: ReactNode;
  specialism: ReactNode;
  projects: string[];
  projectsLabel?: string;
  photoLabel?: string;
  photo?: string;
  photoPosition?: string;
  projectLogos?: (string | undefined)[];
}

interface ExpandingProfileCardsProps {
  people: ProfileCardItem[];
  intervalMs?: number;
  className?: string;
  nameClassName?: string;
  /** Width of the photo column when a card is open. */
  photoWidth?: string;
  activeGrow?: number;
}

const fills = ["bg-[#FFB6B6]", "bg-[#9DD6FF]", "bg-[#DDFF97]"];

/** Expanding profile cards: the active card grows and opens an ink detail panel. */
export function ExpandingProfileCards({ people, intervalMs = 4200, className, nameClassName, photoWidth = "13.5rem", activeGrow = 3.4 }: ExpandingProfileCardsProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % people.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, intervalMs, people.length]);

  return (
    <div className={cn("flex h-[29rem] w-full gap-2.5", className)} onMouseLeave={() => setPaused(false)}>
      {people.map((person, index) => {
        const isActive = index === active;
        return (
          <motion.div
            key={person.name}
            layout
            animate={{ flexGrow: isActive ? activeGrow : 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 26 }}
            onMouseEnter={() => {
              setPaused(true);
              setActive(index);
            }}
            onClick={() => setActive(index)}
            className={cn(
              "relative flex min-w-0 basis-0 cursor-pointer overflow-hidden rounded-[1.5rem] bg-[#151515] transition-shadow duration-500",
              isActive ? "shadow-[0_28px_70px_rgba(21,21,21,0.30)]" : "shadow-[0_10px_30px_rgba(21,21,21,0.12)]"
            )}
          >
            <div className={cn("relative h-full shrink-0 overflow-hidden text-[#151515] transition-[width] duration-500", fills[index % fills.length], !isActive && "w-full")} style={isActive ? { width: photoWidth } : undefined}>
              {person.photo ? (
                <img src={person.photo} alt={person.name} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: person.photoPosition ?? "50% 20%" }} draggable={false} />
              ) : (
                <>
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(21,21,21,0.35) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                  <span className="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[0.18em] opacity-60">{person.photoLabel ?? "Portrait · to add"}</span>
                </>
              )}
              <div className={cn("absolute inset-x-0 bottom-0 p-4", person.photo && "bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-20 text-white")}>
                <p className={cn("text-[1.45rem] leading-none", nameClassName)}>{person.name}</p>
                <p className={cn("mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em]", person.photo ? "text-white/75" : "opacity-60")}>{person.role}</p>
              </div>
            </div>

            <AnimatePresence>
              {isActive ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                  className="flex min-w-0 flex-1 flex-col justify-center gap-4 overflow-hidden p-6 text-white"
                >
                  <Row label="Experience">{person.experience}</Row>
                  {person.qualifications ? <Row label="Qualifications">{person.qualifications}</Row> : null}
                  <Row label="Specialism">{person.specialism}</Row>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DDFF97]">{person.projectsLabel ?? "Featured projects"}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {person.projects.map((project, projectIndex) => {
                        const logo = person.projectLogos?.[projectIndex];
                        return logo ? (
                          <span key={project} className="flex h-9 items-center rounded-lg bg-white px-2.5" title={project}><img src={logo} alt={project} className="h-5 max-w-[5.5rem] object-contain" /></span>
                        ) : (
                          <span key={project} className="rounded-full border border-white/25 px-2.5 py-1 text-[11px] font-medium text-white/90">{project}</span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9DD6FF]">{label}</p>
      <div className="mt-1 text-[13px] leading-relaxed text-white/85">{children}</div>
    </div>
  );
}
