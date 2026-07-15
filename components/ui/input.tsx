import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, placeholder, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#94A3B8] pointer-events-none z-10">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            placeholder={placeholder ?? (label ? `Enter ${label.toLowerCase()}` : undefined)}
            className={cn(
              "w-full h-11 rounded-xl border bg-[#111827] px-4 py-2.5 text-sm text-white",
              "placeholder:text-[#94A3B8] outline-none",
              "border-[#243042]",
              "transition-all duration-[150ms]",
              "focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/15 focus:bg-[#111827]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              error && "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-[#94A3B8] pointer-events-none z-10">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#DC2626] flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#94A3B8]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
