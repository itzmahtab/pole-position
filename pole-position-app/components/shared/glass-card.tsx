import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 shadow-elevated",
        hover && "transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]",
        className
      )}
    >
      {children}
    </div>
  );
}
