"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117] disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[#F5A623] text-[#0D1117] hover:bg-[#D4891E] active:scale-[0.97] focus-visible:ring-[#F5A623] shadow-lg shadow-[#F5A623]/20",
        secondary:
          "bg-[#21262D] text-[#F0F6FC] border border-[#30363D] hover:bg-[#2D333B] hover:border-[#8B949E] active:scale-[0.97] focus-visible:ring-[#8B949E]",
        ghost:
          "bg-transparent text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC] active:scale-[0.97] focus-visible:ring-[#8B949E]",
        danger:
          "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444] hover:text-white active:scale-[0.97] focus-visible:ring-[#EF4444]",
        success:
          "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E] hover:text-white active:scale-[0.97] focus-visible:ring-[#22C55E]",
        blue:
          "bg-[#2D6BE4] text-white hover:bg-[#2558C4] active:scale-[0.97] focus-visible:ring-[#2D6BE4] shadow-lg shadow-[#2D6BE4]/20",
        outline:
          "bg-transparent text-[#F5A623] border border-[#F5A623] hover:bg-[#F5A623] hover:text-[#0D1117] active:scale-[0.97] focus-visible:ring-[#F5A623]",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-9 w-9",
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
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
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
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
