"use client";

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: "default" | "active";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = "default", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={`
          inline-flex items-center justify-center
          w-11 h-11 rounded-xl
          transition-all duration-150
          active:opacity-80 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          ${
            variant === "active"
              ? "bg-neon-cyan/10 text-neon-cyan"
              : "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised"
          }
          ${className}
        `}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
