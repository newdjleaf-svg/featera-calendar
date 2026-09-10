-- FEATERA Calendar cloud schema
create table if not exists public.featera_calendar_state (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.featera_calendar_state(id,payload)
values ('main','{}'::jsonb)
on conflict (id) do nothing;

alter table public.featera_calendar_state enable row level security;

-- 簡化部署版本：持有 anon key 的 App 可讀寫。
-- 若要更高安全性，請改用 Supabase Auth + RLS 使用者角色。
drop policy if exists "featera_read" on public.featera_calendar_state;
drop policy if exists "featera_write" on public.featera_calendar_state;
create policy "featera_read" on public.featera_calendar_state for select using (true);
create policy "featera_write" on public.featera_calendar_state for all using (true) with check (true);
