-- Run once in Supabase SQL Editor. Updated_at changes on every update.
create or replace function public.aett_touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at=clock_timestamp(); return new; end; $$;
drop trigger if exists aett_people_updated_at on public.people;
create trigger aett_people_updated_at before update on public.people for each row execute function public.aett_touch_updated_at();
