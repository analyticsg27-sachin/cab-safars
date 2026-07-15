"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#F5A623] to-[#D4891E] text-[#0B1220] hover:from-[#D4891E] hover:to-[#B8751A] active:scale-[0.97] focus-visible:ring-[#F5A623] shadow-[0_4px_14px_rgba(245,166,35,0.3)] hover:shadow-[0_4px_18px_rgba(245,166,35,0.45)]",
        secondary:
          "bg-[#1A2332] text-white border border-[#243042] hover:bg-[#1E2A3D] hover:border-[#2E3D54] active:scale-[0.97] focus-visible:ring-[#243042]",
        outline:
          "bg-transparent text-[#F5A623] border border-[#F5A623] hover:bg-[#F5A623]/10 active:scale-[0.97] focus-visible:ring-[#F5A623]",
        ghost:
          "bg-transparent text-[#94A3B8] hover:bg-[#111827] hover:text-white active:scale-[0.97] focus-visible:ring-[#243042]",
        danger:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:scale-[0.97] focus-visible:ring-[#DC2626] shadow-[0_4px_14px_rgba(220,38,38,0.3)]",
        success:
          "bg-[#16A34A] text-white hover:bg-[#15803D] active:scale-[0.97] focus-visible:ring-[#16A34A] shadow-[0_4px_14px_rgba(22,163,74,0.3)]",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-lg font-medium",
        sm: "h-8 px-3 text-sm rounded-lg font-medium",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-11 px-6 text-base rounded-xl",
        xl: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      children,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="opacity-70">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
