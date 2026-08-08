"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { scrollToSection } from "@/lib/lenis";
import { SearchIcon } from "lucide-react";
import { useSearchIndex } from "@/hooks/use-search-index";
import { cn } from "@/lib/utils";

const GROUP_ICON: Record<string, string> = {
  Driver: "🏎️",
  Constructor: "🏭",
  Race: "🏁",
  Circuit: "🛣️",
  Country: "🌍",
  Season: "📅",
};

function targetSection(group: string) {
  return group === "Driver" ||
    group === "Constructor" ||
    group === "Race" ||
    group === "Country" ||
    group === "Season"
    ? "calendar"
    : "circuit-explorer";
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { entries, isLoading } = useSearchIndex();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const groups = useMemo(() => {
    const order = ["Driver", "Constructor", "Race", "Circuit", "Country", "Season"] as const;
    return order
      .map((g) => ({ g, items: entries.filter((e) => e.group === g) }))
      .filter((x) => x.items.length > 0);
  }, [entries]);

  return (
    <>
      <MagneticButton>
        <Button
          variant="outline"
          size="default"
          onClick={() => setOpen(true)}
          className="gap-2 text-muted-foreground"
          aria-label="Search drivers, circuits, races"
        >
          <SearchIcon />
          <span className="hidden sm:inline">Search F1</span>
          <kbd className="ml-2 rounded border border-border bg-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
      </MagneticButton>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Pole Position"
        description="Search drivers, circuits, constructors, races, countries and seasons."
      >
        <CommandInput placeholder="Search drivers, circuits, races..." />
        <CommandList>
          {isLoading && (
            <div className="flex flex-col gap-2 p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-elevated" />
              ))}
            </div>
          )}
          {!isLoading && entries.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {groups.map(({ g, items }) => (
            <CommandGroup key={g} heading={g}>
              {items.map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.title} ${entry.subtitle} ${entry.keywords}`.toLowerCase()}
                  onSelect={() => {
                    scrollToSection(targetSection(entry.group));
                    setOpen(false);
                  }}
                >
                  <span aria-hidden className={cn("text-base")}>
                    {GROUP_ICON[entry.group] ?? "•"}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm text-foreground">{entry.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {entry.subtitle}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
