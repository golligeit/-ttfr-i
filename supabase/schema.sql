-- Run in Supabase SQL editor. Public data MUST be reviewed for privacy before publication.
create table if not exists public.editors (
 user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.people (
 id uuid primary key default gen_random_uuid(),
 ged_id text not null unique,
 name text not null,
 birth text not null default '',
 death text not null default '',
 sex text not null default '',
 events jsonb not null default '[]'::jsonb,
 parents jsonb not null default '[]'::jsonb,
 children jsonb not null default '[]'::jsonb,
 spouses jsonb not null default '[]'::jsonb,
 public_visible boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists people_name_idx on public.people (name);
alter table public.editors enable row level security;
alter table public.people enable row level security;
-- Only approved public profiles can be read anonymously. Editors can see all.
create policy "Public reads approved records" on public.people for select using (
 public_visible = true or exists (select 1 from public.editors where user_id = (select auth.uid()))
);
create policy "Editors insert" on public.people for insert to authenticated with check (
 exists (select 1 from public.editors where user_id = (select auth.uid()))
);
create policy "Editors update" on public.people for update to authenticated using (
 exists (select 1 from public.editors where user_id = (select auth.uid()))
) with check (exists (select 1 from public.editors where user_id = (select auth.uid())));
create policy "Editors delete" on public.people for delete to authenticated using (
 exists (select 1 from public.editors where user_id = (select auth.uid()))
);
-- editor table: no public read policy; referenced via owner-executed helper to avoid RLS recursion
create or replace function public.is_editor() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.editors where user_id = (select auth.uid()));
$$;
revoke all on function public.is_editor() from public;
grant execute on function public.is_editor() to anon, authenticated;
-- Replace policy expressions with the helper (avoids editors RLS subquery denial).
drop policy if exists "Public reads approved records" on public.people;
drop policy if exists "Editors insert" on public.people;
drop policy if exists "Editors update" on public.people;
drop policy if exists "Editors delete" on public.people;
create policy "Public reads approved records" on public.people for select using (public_visible = true or public.is_editor());
create policy "Editors insert" on public.people for insert to authenticated with check (public.is_editor());
create policy "Editors update" on public.people for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Editors delete" on public.people for delete to authenticated using (public.is_editor());
-- After creating an Auth user, assign editor manually in SQL editor:
-- insert into public.editors(user_id) values ('AUTH_USER_UUID');
-- Do not set public_visible=true in bulk without a legal/privacy review.

-- v6: varðveitir Espólín-frumtexta og fæðingarstað við vistun.
alter table public.people add column if not exists birth_place text not null default '';
alter table public.people add column if not exists espolin_text text not null default '';
alter table public.people add column if not exists source_note text not null default '';
