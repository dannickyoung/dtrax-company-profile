import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag: string;
  stats: string;
  href: string;
  themeColor: string;
  description?: string;
  ctaLabel?: string;
  hideCta?: boolean;
  active?: boolean;
  /** "contain" shows the whole image on a white ground (documents, certificates). */
  imageFit?: "cover" | "contain";
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  (
    {
      className,
      imageUrl,
      location,
      flag,
      stats,
      href,
      themeColor,
      description,
      ctaLabel = "Explore Now",
      hideCta = false,
      active = false,
      imageFit = "cover",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={
          {
            "--theme-color": themeColor,
          } as React.CSSProperties
        }
        className={cn("group h-full w-full", className)}
        {...props}
      >
        <a
          href={href}
          className={cn(
            "relative block h-full w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-in-out",
            active && "scale-[1.02] shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]",
            !active && "group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          )}
          aria-label={`Open details for ${location}`}
          style={{
            boxShadow: "0 0 40px -15px hsl(var(--theme-color) / 0.5)",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-500 ease-in-out",
              imageFit === "cover" ? "bg-cover bg-center" : "bg-white bg-contain bg-top bg-no-repeat",
              active && (imageFit === "cover" ? "scale-110" : "scale-[1.04]"),
              !active && (imageFit === "cover" ? "group-hover:scale-110" : "group-hover:scale-[1.04]")
            )}
            style={{ backgroundImage: `url("${encodeURI(imageUrl)}")` }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(var(--theme-color) / 0.92), hsl(var(--theme-color) / 0.68) 32%, transparent 68%)",
            }}
          />

          <div className="relative flex h-full flex-col justify-end px-6 py-6 pr-4 text-[#151515]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#151515]/60">
              {stats}
            </p>
            <h3 className="mt-3 text-4xl font-bold tracking-tight">
              {location} <span className="ml-1 text-2xl">{flag}</span>
            </h3>
            {description ? (
              <p className="mt-4 max-w-none text-sm leading-relaxed text-[#151515]/80 sm:text-[0.95rem]">
                {description}
              </p>
            ) : null}

            {!hideCta ? (
              <div
                className={cn(
                  "mt-8 flex items-center justify-between rounded-lg border border-[hsl(var(--theme-color)/0.34)] bg-[hsl(var(--theme-color)/0.22)] px-4 py-3 backdrop-blur-md transition-all duration-300",
                  active && "bg-[hsl(var(--theme-color)/0.4)] border-[hsl(var(--theme-color)/0.5)]",
                  !active && "group-hover:bg-[hsl(var(--theme-color)/0.4)] group-hover:border-[hsl(var(--theme-color)/0.5)]"
                )}
              >
                <span className="text-sm font-semibold tracking-wide">{ctaLabel}</span>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transform transition-transform duration-300",
                    active && "translate-x-1",
                    !active && "group-hover:translate-x-1"
                  )}
                />
              </div>
            ) : null}
          </div>
        </a>
      </div>
    );
  }
);

DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
