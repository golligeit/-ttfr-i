# Ættarslóðir – heildargrunnur v2

Íslenskt ættfræðiforrit með GEDCOM-innlestri, ættartrjám, skyldleikaleit, tímakorti, lífshlaupi, samanburði tveggja ára, grafreitum, ættarmótum, tölfræði, heimildayfirliti og gæðaskoðun.

## Uppsetning
1. Settu innihald ZIP í rót GitHub repository (möppurnar `src` og `supabase` þurfa að haldast).
2. Tengdu GitHub við Vercel. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. Keyrðu `supabase/schema.sql` í Supabase SQL Editor.
4. Settu `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` í Vercel Environment Variables. Aldrei setja service_role í vafrann.
5. Stofnaðu ritstjóra í Supabase Auth og bættu UUID hans í `public.editors`.

## Öryggi og gögn
Færslur sem eru fluttar inn í Supabase eru sjálfgefið óopinberar. Aðeins ritstjórar mega breyta gögnum. Ekki opna gögn um lifandi einstaklinga án heimildar. Fyrir 20–50 þúsund færslur þarf síðuskiptingu við gagnalestur og að prófa innflutning á raunverulegri Espólín-skrá.

## Enn ekki fullbúið
Nákvæm staðsetning allra íslenskra bæja (nú er takmörkuð `coords`-skrá), myndaupphleðsla, fullkomin heimildastjórnun, grafreitakort með leiðisnúmerum, aðgangsstýring á einstaka persónu, sjálfvirk tillögusamruni og sjónræn hreyfimynd af flutningum. Þetta er umfangsmikill virkni-grunnur, ekki fullprófað framleiðslukerfi.
