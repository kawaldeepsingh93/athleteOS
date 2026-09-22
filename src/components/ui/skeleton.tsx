import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/6", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Skeleton className="h-72 lg:col-span-7" />
      <Skeleton className="h-72 lg:col-span-5" />
      <Skeleton className="h-56 lg:col-span-4" />
      <Skeleton className="h-56 lg:col-span-4" />
      <Skeleton className="h-56 lg:col-span-4" />
    </div>
  );
}
