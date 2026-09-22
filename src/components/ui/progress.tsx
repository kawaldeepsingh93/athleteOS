import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "success" | "warning";
}) {
  const colors = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/6", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", colors[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
