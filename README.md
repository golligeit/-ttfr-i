# Ættarslóðir – útgáfa 0.1

Prófunarforrit fyrir ættfræðisafn byggt á GEDCOM, React/Vite, Supabase og Vercel.

## Setja á GitHub og Vercel

1. Búðu til nýtt **private** repository á GitHub, t.d. `aettarslodir`.
2. Dragðu allar skrár úr þessari ZIP-skrá inn í repository (rótina), eða notaðu `git init`, `git add .`, `git commit` og `git push`.
3. Opnaðu [vercel.com/new](https://vercel.com/new), veldu GitHub-repository og `Import`.
4. Framework: **Vite**; Build Command: `npm run build`; Output Directory: `dist`.
5. Búðu til nýtt Supabase project á [supabase.com](https://supabase.com). Í SQL Editor keyrirðu `supabase/schema.sql`.
6. Í Vercel > Project > Settings > Environment Variables seturðu `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` (publishable/anon key, **aldrei service_role key**).
7. Redeploy í Vercel.
8. Í Supabase Authentication > Users býrðu til ritstjóra (netfang/lykilorð). Sæktu UUID notandans og keyrðu `insert into public.editors(user_id) values ('UUID');` í SQL Editor.
9. Opnaðu vefinn, farðu í Gögn og innlestur, skráðu þig inn, lestu `.ged`-skrá og veldu síðan að vista í Supabase.

## Keyra í eigin tölvu

`npm install` og síðan `npm run dev`.

## Takmarkanir í þessari fyrstu útgáfu

- GEDCOM 5.5/5.5.1 grunninnlestur: einstaklingar, nöfn, fæðing/dauði, RESI, BURI og fjölskyldutengsl. Sérsniðnar GEDCOM-viðbætur, flóknar heimildir, myndir og fjölskyldutengsl í óstöðluðum útgáfum eru ekki enn fullstudd.
- Búsetukortið notar fáeinar forstilltar staðsetningar í sýnidæmi. **Raunveruleg landfræðileg staðaskrá og örugg staðsetningargreining þarf að bætast við** áður en kortið virkar fyrir allt Espólín-safnið.
- Búsetutímabil eru lesin úr GEDCOM RESI/DATE, t.d. `FROM 1880 TO 1900`. Ekkert er áætlað milli óþekktra ára.
- Innlestur er fyrst staðbundinn. Gögn fara aðeins í Supabase þegar innskráður ritstjóri velur að vista.
- Allar færslur eru **private** í Supabase sjálfgefið. Ekki birta raunveruleg persónugögn opinberlega fyrr en farið hefur verið yfir heimildir, réttindi og upplýsingar um lifandi fólk.
- Fyrsta útgáfan inniheldur ekki fullbúið ættarmót, ítarlega skyldleikaleit, skjalasafn eða nákvæma grafreitaskrá. Þetta eru næstu áfangar.
- Engar aðgangsupplýsingar eða lyklar eru geymdir í ZIP-skránni.

## Öryggi

Supabase Row Level Security er virkt. Ritstjórar eru sérstaklega skráðir í `public.editors`. Aldrei setja `service_role` lykil í Vite/Vercel frontend. Taka regluleg öryggisafrit áður en Espólín-gögn eru flutt inn.
