# Ættarslóðir — prófunarútgáfa v1

Íslenskt ættfræðiforrit fyrir GitHub, Vercel og Supabase.

## Uppsetning

1. Settu **innihald þessarar möppu** í rót GitHub repository (ekki ZIP skrána).
2. Vercel: Import Git Repository, Framework **Vite**, Build command `npm run build`, Output `dist`.
3. Supabase: nýtt project, SQL Editor → keyra `supabase/schema.sql`.
4. Vercel → Settings → Environment Variables: `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` (publishable/anon lykill, **aldrei service_role**).
5. Supabase Authentication: stofna ritstjóra í Users, finna UUID og bæta honum í `public.editors` samkvæmt SQL leiðbeiningum.
6. Endurbirta Vercel eftir að environment variables eru settar.

## Eiginleikar

- GEDCOM innlestur í vafra, leit, persónusíður, foreldrar, makar, börn.
- Búsetulínur (RESI), kort og tímabil, grafreitir (BURI).
- Skyldleikaleit, ættarmótslisti, tölfræði, heimildir og gæðaskoðun.
- Supabase gagnageymsla með RLS og ritstjóraaðgangi. Öll ný innflutt gögn eru **einkamál sjálfgefið**.

## Mikilvægar takmarkanir

- Þetta er **prófunarútgáfa**, ekki fullbúið opinbert ættfræðisafn. Innlestur á GEDCOM er grunnstuðningur; prófa þarf Espólín-útflutning sérstaklega og bera saman fjölda og tengsl.
- Kortið þekkir aðeins staði sem eru í `src/demo.js` → `coords`. Bæta þarf við landfræðilegri staðaskrá fyrir stærri gögn.
- Skráð búsetuár eru ekki ályktuð út frá fæðingar- eða dánarstað.
- Ættarmótsskrá sýnir afkomendur, ekki tengiliðaskrá. Skyldleiki sýnir stystu leiðina, ekki allar mögulegar.
- Ljósmyndaupphleðsla, nákvæm kirkjugarðskort, tvö samtímis tímabil, sjálfvirk ættarslóðaspilun, endurskoðunarsaga og fullkomin stjórnun heimilda eru **ekki fullinnleidd**.
- Ekki birta persónuupplýsingar um lifandi fólk eða börn án viðeigandi heimildar. Athugið einnig að opinberar persónuskrár geta vísað á aðra einstaklinga í tengslafylkjum.
- Ekki geyma lykilorð eða Supabase service_role lykil í GitHub.

## Sími / GitHub

GitHub í síma getur átt erfitt með möppuupphleðslu. Best er að nota GitHub Codespaces eða tölvu til að setja inn allar möppur. Vercel mun endurbyggja sjálfkrafa eftir commit.
