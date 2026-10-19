# Ættarslóðir v4 – React/Vite + Supabase

Þetta er endurheimta React-viðmótið (græn hliðarstika, kort, ættartré, skyldleiki, skráning og gögn). Gamla HTML-viðmótið `app.js` og `style.css` var fjarlægt.

## Vercel
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: rót þessa verkefnis (þar sem `package.json` er)
- Ef Supabase er notað: `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` í Environment Variables.
- `npm install` og `npm run build` fyrir staðbundna prófun.

## Espólín
`Data/people.json` inniheldur 113.529 einstaklinga í þjöppuðu formi: `[númer, nafn, faðir, móðir, fæðingarstaðartexti]`. Fæðingar- og dánardagar og makar eru ekki í þessari tilteknu skrá. Skráin er í verkefninu til varðveislu en er **ekki afrituð í Vite dist**. Á síðunni: **Gögn og innlestur → Velja Espólín JSON** til að lesa hana staðbundið. Við það tengjast foreldrar og börn sjálfkrafa. Ekki birta óyfirfarin gögn um lifandi fólk opinberlega.

## Athugið
Ekki keyra SQL-skjema án yfirferðar; það er aðeins fyrirmynd. Innlestur í vafra vistar ekki sjálfkrafa í Supabase. Supabase sækir aðeins færslur sem RLS leyfir. Engar breytingar voru gerðar á GitHub/Vercel beint.
