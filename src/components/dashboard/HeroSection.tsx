'use client';

import { motion } from 'framer-motion';
import { useRaceWeekend } from '@/hooks/useRaceWeekend';
import { useSettingsStore } from '@/stores/settingsStore';
import { FlipCountdown } from '@/components/countdown/FlipCountdown';
import { FadeIn } from '@/components/animations/FadeIn';
import { GlowEffect } from '@/components/animations/GlowEffect';
import { formatInTimezone, getSessionStatus } from '@/lib/utils/date';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import Image from 'next/image';

export function HeroSection() {
  const { data: weekend, isLoading } = useRaceWeekend();
  const { timezone } = useSettingsStore();

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (!weekend) return null;

  const { meeting, sessions, next_session, status, progress } = weekend;
  const targetSession = weekend.current_session || next_session || sessions[0];
  const sessionStatus = targetSession
    ? getSessionStatus(targetSession.date_start, targetSession.date_end, timezone)
    : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <FadeIn delay={0}>
              <div className="flex items-center gap-3">
                {status === 'live' && <LiveIndicator />}
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: sessionStatus
                      ? `${sessionStatus.color}20`
                      : 'rgba(255,255,255,0.1)',
                    color: sessionStatus?.color || '#fff',
                    border: `1px solid ${sessionStatus?.color || 'rgba(255,255,255,0.2)'}`,
                  }}
                >
                  {status === 'upcoming'
                    ? 'Next Race'
                    : status === 'live'
                      ? 'Live Now'
                      : 'Race Weekend'}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]">
                <span className="text-gradient">{meeting.meeting_name}</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex items-center gap-4 text-lg text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Image
                    src={meeting.country_flag}
                    alt={meeting.country_name}
                    width={24}
                    height={16}
                    className="rounded-sm"
                  />
                  {meeting.country_name}
                </span>
                <span>•</span>
                <span>{meeting.location}</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground uppercase tracking-widest">
                  {targetSession
                    ? formatInTimezone(targetSession.date_start, timezone, 'EEEE, MMMM d, yyyy')
                    : 'TBA'}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {targetSession
                    ? formatInTimezone(targetSession.date_start, timezone, 'h:mm a zzz')
                    : 'TBA'}
                </p>
              </div>
            </FadeIn>

            {targetSession && status !== 'completed' && (
              <FadeIn delay={0.4}>
                <GlowEffect color="#e10600" intensity={0.3} pulse={status !== 'live'}>
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4 text-center">
                      {status === 'live' ? 'Session Time Remaining' : 'Starts In'}
                    </p>
                    <FlipCountdown targetDate={targetSession.date_start} />
                  </div>
                </GlowEffect>
              </FadeIn>
            )}

            <FadeIn delay={0.5}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekend Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                  />
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-6">
            <FadeIn delay={0.3} direction="left">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card">
                <Image
                  src={meeting.circuit_image}
                  alt={meeting.circuit_short_name}
                  fill
                  className="object-contain p-8"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </FadeIn>

            <FadeIn delay={0.5} direction="left">
              <WeatherWidget lat={0} lng={0} location={meeting.location} />
            </FadeIn>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-8 w-full max-w-4xl">
        <div className="h-8 bg-muted rounded w-32" />
        <div className="h-20 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-1/2" />
        <div className="h-32 bg-muted rounded" />
      </div>
    </section>
  );
}
