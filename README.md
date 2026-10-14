# Ættarslóðir v3 – ættingjaskráning

Nýtt: opna einstakling í **Einstaklingar** eða **Ættartengsl**, velja **Skrá barn / maka / föður eða móður / systkini**. Leita að fyrirliggjandi einstaklingi eða stofna nýjan. Við barn er sérstaklega spurt hvort maki eigi að vera hitt foreldrið. Aldurs- og dagsetningaviðvaranir, valfrjáls heimild, og gagnkvæm tengsl. Breytingar vistast í Supabase aðeins ef safnið er lesið úr Supabase og ritstjóri er innskráður; annars aðeins í vaframinni og tapast við endurhleðslu. Þessi útgáfa notar fyrirliggjandi SQL-skema úr v2.

## Uppsetning

1. Afþjappa og setja innihald rótarmöppunnar í GitHub repository (ekki setja ZIP sjálfa inn).
2. Í Supabase SQL Editor keyra `supabase/schema.sql` ef það hefur ekki verið gert áður. **Ekki keyra á óþekktan gagnagrunn án þess að skoða SQL fyrst.**
3. Setja `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` í Vercel Environment Variables og endurbyggja.
4. Stofna ritstjóra í Supabase Authentication og veita honum aðgang í `public.editors` samkvæmt SQL-athugasemdum.
5. Skrá inn í forritið og velja **Lesa úr Supabase** áður en skráð er, til að tryggja varanlega vistun.

## Takmarkanir

Ekki staðfest full Vercel build í þessu umhverfi (npm dependency installation ekki tiltæk). Ekki fullgert öryggis-/persónuverndarmat. Systkinatenging notar skráða foreldra þess einstaklings sem opinn er. Nýjar færslur eru sjálfgefið ekki opinberar. Sumar aðgerðir í v2 eru enn frumgerðir. GEDCOM-skrá ekki innifalin.
