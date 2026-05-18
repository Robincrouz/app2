import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-md bg-slate-200",
            className
          )}
        />
      ))}
    </>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-32 rounded-3xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full rounded-2xl" count={3} />
      </div>
    </div>
  );
}
