# Ættarslóðir v5 – React/Vite

**Einkagögn fylgja ekki vefkóðanum.** Allt Espólín-safnið er í sérstöku `espolin_full.json` sem er afhent í einkagagnapakka. Aldrei setja þessa JSON skrá í GitHub, `public/`, `Data/` eða Vercel.

1. Settu eingöngu skrár úr **vefkerfis-ZIP** í GitHub. Settu Vercel build command `npm run build`, output `dist`.
2. Opnaðu vefinn, farðu í **Gögn og innlestur** og veldu `espolin_full.json` úr einkagagnapakkanum til að prófa öll gögn staðbundið.
3. Til að þið pabbi getið unnið samtímis og vistað varanlega þarf Supabase Auth og RLS; það er **ekki sjálfkrafa fulluppsett** í þessari útgáfu. Ekki nota hnappinn „Vista núverandi safn í Supabase“ fyrr en aðgangsstýring og gagnaskema hafa verið sannprófuð.
4. Gagnasafnið inniheldur 113.529 einstaklinga, foreldratengingar, möguleg makatengsl, frumtexta og staðavísbendingar. Óvissar tengingar eru ekki hjónabandsstaðfestingar. Sumir þekktir fæðingardagar eru merktir notandastaðfestir.

Athugið: Kort sýnir aðeins staði sem hafa samsvörun í yfirfarinni staðaskrá. Staðir án staðfestar staðsetningar birtast sem texti.
