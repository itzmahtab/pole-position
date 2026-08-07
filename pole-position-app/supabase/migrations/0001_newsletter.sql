-- Phase 8: Newsletter & Email Reminder System
-- Per architecture.md §11. Idempotent migration.

create extension if not exists "pgcrypto";

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  reminder_windows text[] not null default '{24h,1h}',
  favorite_driver text,
  timezone text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists preferences (
  device_id uuid primary key,
  timezone text,
  country text,
  language text,
  theme text,
  favorite_driver text,
  favorite_constructor text,
  favorite_circuit text,
  updated_at timestamptz not null default now()
);

create table if not exists email_logs (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references newsletter_subscribers(id),
  session_key bigint not null,
  reminder_window text not null,
  sent_at timestamptz not null default now(),
  status text not null,
  unique (subscriber_id, session_key, reminder_window)
);

create table if not exists cron_logs (
  id uuid primary key default gen_random_uuid(),
  run_at timestamptz not null default now(),
  emails_sent int not null default 0,
  errors int not null default 0,
  notes text
);
