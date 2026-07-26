import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GlowBadge,
  LiveStatusPill,
  GlassCard,
  FlagIcon,
  MarqueeRow,
  NoiseOverlay,
} from "@/components/shared";

function Swatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-16 w-16 rounded-xl border border-white/10"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {name}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground/60">
        {color}
      </span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <NoiseOverlay />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-16">
          <h1 className="text-display text-6xl sm:text-8xl">
            Design System
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Pole Position visual language — tokens, components, and shared
            primitives.
          </p>
        </div>

        {/* ─── Theme Tokens ─── */}
        <section className="mb-24">
          <h2 className="text-display mb-8 text-3xl">Theme Tokens</h2>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              F1 Signal Colors
            </h3>
            <div className="flex flex-wrap gap-6">
              <Swatch color="#E10600" name="Racing Red" />
              <Swatch color="#FFFFFF" name="Checkered White" />
              <Swatch color="#FFD400" name="Safety Yellow" />
              <Swatch color="#FF8C00" name="SC Orange" />
              <Swatch color="#00D26A" name="DRS Green" />
              <Swatch color="#C724F5" name="Purple Sector" />
              <Swatch color="#2C8CFF" name="Electric Blue" />
            </div>
          </div>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Surfaces
            </h3>
            <div className="flex flex-wrap gap-6">
              <Swatch color="var(--background)" name="Base" />
              <Swatch color="var(--card)" name="Elevated" />
              <Swatch color="rgba(255,255,255,0.04)" name="Glass" />
            </div>
          </div>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Text
            </h3>
            <div className="flex flex-wrap gap-6">
              <Swatch color="var(--foreground)" name="Primary" />
              <Swatch color="var(--muted-foreground)" name="Secondary" />
              <Swatch color="var(--muted-foreground)" name="Muted" />
            </div>
          </div>
        </section>

        <Separator className="mb-24" />

        {/* ─── Typography ─── */}
        <section className="mb-24">
          <h2 className="text-display mb-8 text-3xl">Typography</h2>
          <div className="space-y-6">
            <div>
              <span className="text-display text-[96px] leading-[0.9]">
                01
              </span>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                display-xl — Hero countdown digits
              </p>
            </div>
            <div>
              <span className="text-display text-6xl">Display Large</span>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                display-lg — Section headlines
              </p>
            </div>
            <div>
              <span className="text-display text-3xl font-semibold">
                Heading
              </span>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                heading — Card titles
              </p>
            </div>
            <div>
              <p className="text-lg">Body Large — Lead paragraphs</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                body-lg
              </p>
            </div>
            <div>
              <p className="text-base">
                Body — Standard UI text for data tables, labels, secondary
                content.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                body
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">
                Caption — Labels, timestamps, badges
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                caption
              </p>
            </div>
            <div>
              <p className="font-mono text-sm tabular-nums">
                1:23.456 — Lap times, gaps, telemetry
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                mono-data
              </p>
            </div>
          </div>
        </section>

        <Separator className="mb-24" />

        {/* ─── shadcn/ui Components ─── */}
        <section className="mb-24">
          <h2 className="text-display mb-8 text-3xl">Components</h2>

          <Tabs defaultValue="buttons" className="mb-12">
            <TabsList>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="buttons" className="mt-8">
              <div className="flex flex-wrap items-center gap-4">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Icon button">
                  🏎️
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="mt-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Glass Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Standard card with glass effect and subtle border.
                    </p>
                  </CardContent>
                </Card>
                <GlassCard>
                  <h3 className="text-lg font-bold">Shared GlassCard</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Reusable glass primitive with hover elevation.
                  </p>
                </GlassCard>
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-primary">Accent Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Card with primary accent border and glow.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="forms" className="mt-8">
              <div className="max-w-md space-y-4">
                <Input placeholder="Email address" type="email" />
                <Input placeholder="Search drivers, circuits..." />
                <div className="flex items-center gap-3">
                  <Switch id="airplane-mode" />
                  <label htmlFor="airplane-mode" className="text-sm">
                    Enable animations
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="mt-8">
              <div className="flex flex-wrap items-center gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Loading Skeletons
                </h4>
                <div className="max-w-md space-y-3">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="mb-24" />

        {/* ─── Shared Primitives ─── */}
        <section className="mb-24">
          <h2 className="text-display mb-8 text-3xl">Shared Primitives</h2>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              GlowBadge
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <GlowBadge variant="red">Racing Red</GlowBadge>
              <GlowBadge variant="green">DRS Green</GlowBadge>
              <GlowBadge variant="yellow">Safety Yellow</GlowBadge>
              <GlowBadge variant="blue">Electric Blue</GlowBadge>
              <GlowBadge variant="purple">Purple Sector</GlowBadge>
              <GlowBadge variant="default">Default</GlowBadge>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              LiveStatusPill
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <LiveStatusPill status="live" />
              <LiveStatusPill status="upcoming" />
              <LiveStatusPill status="finished" />
              <LiveStatusPill status="between" />
            </div>
          </div>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              FlagIcon
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <FlagIcon country="UK" size="sm" />
                <span className="text-xs text-muted-foreground">UK</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FlagIcon country="Italy" size="md" />
                <span className="text-xs text-muted-foreground">Italy</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FlagIcon country="Japan" size="lg" />
                <span className="text-xs text-muted-foreground">Japan</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FlagIcon country="USA" size="md" />
                <span className="text-xs text-muted-foreground">USA</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <FlagIcon country="Monaco" size="md" />
                <span className="text-xs text-muted-foreground">Monaco</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              MarqueeRow
            </h3>
            <MarqueeRow
              items={[
                "Live Timing",
                "Weekend Timeline",
                "Driver Standings",
                "Constructor Standings",
                "Full Calendar",
                "Local Timezone",
              ]}
            />
          </div>
        </section>

        <Separator className="mb-24" />

        {/* ─── Spacing ─── */}
        <section className="mb-24">
          <h2 className="text-display mb-8 text-3xl">Spacing</h2>
          <div className="flex flex-wrap items-end gap-4">
            {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 rounded bg-primary/30"
                  style={{ height: s }}
                />
                <span className="text-[10px] font-mono text-muted-foreground">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-white/10 pt-8 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Pole Position Design System — Phase 1
        </footer>
      </div>
    </div>
  );
}
