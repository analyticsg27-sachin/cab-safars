import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Truck,
  Bell,
  Search,
  CreditCard,
  Bookmark,
  PackageOpen,
  type LucideIcon,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Variant = "trips" | "notifications" | "search" | "payments" | "saved" | "generic";

interface EmptyStateProps {
  /** Override the icon for any variant */
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: Variant;
  className?: string;
}

// ── Variant config ───────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
  Variant,
  { icon: LucideIcon; title: string; description: string }
> = {
  trips: {
    icon: Truck,
    title: "No trips yet",
    description: "Your trips will appear here once you book or post one.",
  },
  notifications: {
    icon: Bell,
    title: "All caught up",
    description: "You have no new notifications right now.",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your filters or search with different keywords.",
  },
  payments: {
    icon: CreditCard,
    title: "No payments yet",
    description: "Your payment history will show up here after your first transaction.",
  },
  saved: {
    icon: Bookmark,
    title: "No saved searches",
    description: "Bookmark a search to quickly reuse it later.",
  },
  generic: {
    icon: PackageOpen,
    title: "Nothing here",
    description: "There is nothing to show right now.",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export function EmptyState({
  icon: IconOverride,
  title,
  description,
  action,
  variant = "generic",
  className,
}: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = IconOverride ?? config.icon;
  const resolvedTitle = title ?? config.title;
  const resolvedDesc = description ?? config.description;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon circle */}
      <div className="w-20 h-20 rounded-full bg-[#1C2128] border border-[#30363D] flex items-center justify-center mb-5 shadow-inner">
        <Icon
          size={36}
          strokeWidth={1.5}
          className="text-[#F5A623]"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-[#F0F6FC] mb-2 leading-snug">
        {resolvedTitle}
      </h3>
      <p className="text-sm text-[#8B949E] max-w-xs leading-relaxed">
        {resolvedDesc}
      </p>

      {/* CTA */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold",
            "bg-[#F5A623] text-[#0D1117]",
            "hover:bg-[#e09520] active:scale-95",
            "transition-all duration-150 focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2",
            "focus-visible:ring-offset-[#0D1117]"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
