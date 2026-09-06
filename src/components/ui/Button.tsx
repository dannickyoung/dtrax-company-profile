"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-neon-cyan text-surface-deepest hover:brightness-110 active:opacity-80",
  secondary:
    "bg-transparent border border-wire-emphasis text-text-primary hover:bg-surface-raised active:opacity-80",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised active:opacity-80",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:opacity-80",
};

const sizeStyles = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-12 px-5 text-base rounded-xl",
  lg: "h-14 px-6 text-lg rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, className = "", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          transition-all duration-150 ease-out
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
