-- AETTARSLODIR v14: keyra i Hallgrimuroli eftir fyrri grunnuppsetningu.
-- Samraemir tomt public.people (id/data/version) vid v13 forritid.
-- Eyðir engum gögnum.
CREATE TABLE IF NOT EXISTS public.editors (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.editors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS ged_id text;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS birth text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS death text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS sex text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS events jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS parents jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS children jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS spouses jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS birth_place text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS espolin_text text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS source_note text NOT NULL DEFAULT '';
ALTER TABLE public.people ADD COLUMN IF NOT EXISTS public_visible boolean NOT NULL DEFAULT false;
UPDATE public.people SET ged_id=id WHERE ged_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS aett_people_ged_id_unique ON public.people (ged_id);
CREATE INDEX IF NOT EXISTS aett_people_updated_idx ON public.people (updated_at);
CREATE OR REPLACE FUNCTION public.aett_is_editor() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS(SELECT 1 FROM public.editors WHERE user_id=(SELECT auth.uid()));
$$;
REVOKE ALL ON FUNCTION public.aett_is_editor() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aett_is_editor() TO authenticated;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Aett editors read" ON public.people;
DROP POLICY IF EXISTS "Aett editors insert" ON public.people;
DROP POLICY IF EXISTS "Aett editors update" ON public.people;
DROP POLICY IF EXISTS "Aett editors delete" ON public.people;
CREATE POLICY "Aett editors read" ON public.people FOR SELECT TO authenticated USING (public.aett_is_editor());
CREATE POLICY "Aett editors insert" ON public.people FOR INSERT TO authenticated WITH CHECK (public.aett_is_editor());
CREATE POLICY "Aett editors update" ON public.people FOR UPDATE TO authenticated USING (public.aett_is_editor()) WITH CHECK (public.aett_is_editor());
CREATE POLICY "Aett editors delete" ON public.people FOR DELETE TO authenticated USING (public.aett_is_editor());
-- Eftir að Auth notandi er stofnaður: veittu honum ritstjóraréttindi
-- INSERT INTO public.editors(user_id) VALUES ('UUID-UR-AUTH-USERS');
-- Aldrei setja service_role lykil i VITE_ breytu.
