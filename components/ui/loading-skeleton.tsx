import { cn } from "@/lib/utils";

// ── Primitives ──────────────────────────────────────────────────────────────

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonLine({ width, height, className }: SkeletonLineProps) {
  return (
    <div
      className={cn("skeleton rounded-md", className)}
      style={{ width: width ?? "100%", height: height ?? "0.875rem" }}
    />
  );
}

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

// ── Trip Card Skeleton ───────────────────────────────────────────────────────

export function SkeletonTripCard() {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 flex flex-col gap-4">
      {/* Route row */}
      <div className="flex items-stretch gap-3">
        {/* Dots + line */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <div className="skeleton w-3 h-3 rounded-full flex-shrink-0" />
          <div className="skeleton w-0.5 flex-1 rounded-full" style={{ minHeight: "2.5rem" }} />
          <div className="skeleton w-3 h-3 rounded-full flex-shrink-0" />
        </div>
        {/* City names */}
        <div className="flex flex-col justify-between flex-1 gap-1">
          <SkeletonLine width="55%" height="1rem" />
          <SkeletonLine width="45%" height="1rem" />
        </div>
      </div>

      {/* Vehicle / load type */}
      <div className="flex items-center gap-2">
        <SkeletonBlock className="w-5 h-5 rounded-md flex-shrink-0" />
        <SkeletonLine width="40%" height="0.75rem" />
      </div>

      {/* Date / weight row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 flex-1">
          <SkeletonBlock className="w-4 h-4 rounded flex-shrink-0" />
          <SkeletonLine width="60%" height="0.75rem" />
        </div>
        <div className="flex items-center gap-1.5 flex-1">
          <SkeletonBlock className="w-4 h-4 rounded flex-shrink-0" />
          <SkeletonLine width="50%" height="0.75rem" />
        </div>
      </div>

      {/* Divider */}
      <div className="skeleton h-px w-full rounded-full" />

      {/* Price + button row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <SkeletonLine width="3.5rem" height="0.65rem" />
          <SkeletonLine width="5rem" height="1.25rem" />
        </div>
        <SkeletonBlock className="w-24 h-9 rounded-xl flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Dashboard Skeleton ───────────────────────────────────────────────────────

export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <SkeletonLine width="9rem" height="1.25rem" />
          <SkeletonLine width="6rem" height="0.75rem" />
        </div>
        <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <SkeletonLine width="60%" height="0.75rem" />
              <SkeletonBlock className="w-8 h-8 rounded-lg flex-shrink-0" />
            </div>
            <SkeletonLine width="40%" height="1.5rem" />
            <SkeletonLine width="55%" height="0.65rem" />
          </div>
        ))}
      </div>

      {/* Section heading */}
      <SkeletonLine width="8rem" height="1rem" />

      {/* Trip cards */}
      <SkeletonList count={3} />
    </div>
  );
}

// ── List of Trip Card Skeletons ──────────────────────────────────────────────

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTripCard key={i} />
      ))}
    </div>
  );
}

// ── Legacy exports (keep existing consumers working) ────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <SkeletonLine width="7rem" height="1rem" />
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
      </div>
      <SkeletonLine width="6rem" height="2rem" />
      <SkeletonLine width="5rem" height="0.75rem" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLine />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonLine width="8rem" height="1rem" />
          <SkeletonLine width="6rem" height="0.75rem" />
        </div>
      </div>
      <SkeletonLine />
      <SkeletonLine width="75%" />
    </div>
  );
}
