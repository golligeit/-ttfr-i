-- Keyrðu einu sinni í Supabase SQL Editor áður en þú vistar gögnin.
-- Eyðir engu og breytir ekki núverandi einstaklingum.
alter table public.people add column if not exists birth_place text not null default '';
alter table public.people add column if not exists espolin_text text not null default '';
alter table public.people add column if not exists source_note text not null default '';
