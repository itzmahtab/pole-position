create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  race_id text not null,
  reminder_time timestamptz not null,
  sent boolean not null default false,
  created_at timestamptz not null default now()
);
