import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
  {
    variants: {
      variant: {
        default:
          "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20",
        vendor:
          "bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/20",
        driver:
          "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/20",
        premium:
          "bg-gradient-to-r from-[#F5A623] to-[#D4891E] text-[#0B1220] border-transparent",
        success:
          "bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/20",
        warning:
          "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20",
        danger:
          "bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/20",
        // Status aliases
        open: "bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/20",
        closed: "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20",
        pending: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20",
        rejected: "bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/20",
        active: "bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/20",
        suspended: "bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/20",
        completed: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/20",
        cancelled: "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20",
        paid: "bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/20",
        failed: "bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/20",
        refunded: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/20",
        free: "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20",
        approved: "bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
