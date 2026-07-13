import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      variant: {
        open: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
        closed: "bg-[#8B949E]/10 text-[#8B949E] border-[#8B949E]/30",
        pending: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
        premium: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30",
        rejected: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
        active: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
        suspended: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
        completed: "bg-[#2D6BE4]/10 text-[#2D6BE4] border-[#2D6BE4]/30",
        cancelled: "bg-[#8B949E]/10 text-[#8B949E] border-[#8B949E]/30",
        paid: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
        failed: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
        refunded: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
        free: "bg-[#8B949E]/10 text-[#8B949E] border-[#8B949E]/20",
        vendor: "bg-[#2D6BE4]/10 text-[#2D6BE4] border-[#2D6BE4]/30",
        driver: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30",
      },
    },
    defaultVariants: {
      variant: "active",
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
