export function SectionDivider() {
  return (
    <div className="relative h-32 sm:h-40 flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="relative w-2 h-2 rounded-full bg-primary/50" />
    </div>
  );
}
