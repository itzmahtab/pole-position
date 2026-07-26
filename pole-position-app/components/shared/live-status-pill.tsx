import { cn } from "@/lib/utils";

interface LiveStatusPillProps {
  status: "live" | "upcoming" | "finished" | "between";
  label?: string;
  className?: string;
}

const statusConfig = {
  live: {
    dot: "bg-racing-red animate-pulse-dot",
    ring: "border-racing-red/40 bg-racing-red/10",
    text: "text-racing-red",
    defaultLabel: "LIVE",
  },
  upcoming: {
    dot: "bg-electric-blue",
    ring: "border-electric-blue/40 bg-electric-blue/10",
    text: "text-electric-blue",
    defaultLabel: "UPCOMING",
  },
  finished: {
    dot: "bg-muted-foreground",
    ring: "border-white/10 bg-white/5",
    text: "text-muted-foreground",
    defaultLabel: "FINISHED",
  },
  between: {
    dot: "bg-safety-yellow",
    ring: "border-safety-yellow/40 bg-safety-yellow/10",
    text: "text-safety-yellow",
    defaultLabel: "BETWEEN SESSIONS",
  },
};

export function LiveStatusPill({
  status,
  label,
  className,
}: LiveStatusPillProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        config.ring,
        config.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            config.dot,
            status === "live" && "animate-pulse-dot"
          )}
        />
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", config.dot)} />
      </span>
      {displayLabel}
    </span>
  );
}
