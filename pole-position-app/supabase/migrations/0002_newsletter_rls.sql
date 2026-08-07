-- Phase 8: RLS policies for newsletter tables.
-- Public: insert-only on newsletter_subscribers (self-service signup).
-- Service role only: email_logs + cron_logs (written by the cron handler).

alter table newsletter_subscribers enable row level security;
alter table preferences enable row level security;
alter table email_logs enable row level security;
alter table cron_logs enable row level security;

create policy "public_insert_subscriber"
  on newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

create policy "service_read_email_logs"
  on email_logs
  for select
  to service_role
  using (true);

create policy "service_insert_email_logs"
  on email_logs
  for insert
  to service_role
  with check (true);

create policy "service_read_cron_logs"
  on cron_logs
  for select
  to service_role
  using (true);

create policy "service_insert_cron_logs"
  on cron_logs
  for insert
  to service_role
  with check (true);
