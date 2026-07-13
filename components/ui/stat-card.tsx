import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  iconColor = "text-[#F5A623]",
  className,
  prefix,
  suffix,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div
      className={cn(
        "bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col gap-3",
        "hover:border-[#30363D]/80 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#8B949E] font-medium">{title}</p>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center bg-[#21262D]",
            iconColor
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#F0F6FC] leading-none">
          {prefix}
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          {suffix}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded-md mb-0.5",
              isPositive
                ? "bg-[#22C55E]/10 text-[#22C55E]"
                : "bg-[#EF4444]/10 text-[#EF4444]"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      {change !== undefined && (
        <p className="text-xs text-[#8B949E]">vs last month</p>
      )}
    </div>
  );
}
