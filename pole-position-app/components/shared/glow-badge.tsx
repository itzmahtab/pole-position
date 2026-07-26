import { cn } from "@/lib/utils";

interface GlowBadgeProps {
  children: React.ReactNode;
  variant?: "red" | "green" | "yellow" | "blue" | "purple" | "default";
  className?: string;
}

const glowMap = {
  red: "border-racing-red/40 bg-racing-red/10 text-racing-red shadow-[var(--glow-red)]",
  green: "border-drs-green/40 bg-drs-green/10 text-drs-green shadow-[var(--glow-green)]",
  yellow: "border-safety-yellow/40 bg-safety-yellow/10 text-safety-yellow",
  blue: "border-electric-blue/40 bg-electric-blue/10 text-electric-blue",
  purple: "border-purple-sector/40 bg-purple-sector/10 text-purple-sector",
  default: "border-white/10 bg-white/5 text-muted-foreground",
};

export function GlowBadge({
  children,
  variant = "default",
  className,
}: GlowBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
        glowMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
