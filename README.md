# Ættarslóðir – stór prufuútgáfa (18. október 2026)

Inniheldur 113.529 einstaklinga úr Espólín og frumtexta úr TEXTAR.

## Opnun
Ekki opna index.html beint sem file://, því vafrar loka oft á fetch úr staðbundnum skrám.

Leið 1: Hladdu öllu innihaldi ZIP-skrárinnar inn á Vercel sem statískan vef (index.html, style.css, app.js og data/people.json verða að haldast saman).
Leið 2: Í tölvu með Python: keyrðu `python -m http.server 8000` í möppunni og opnaðu http://localhost:8000.

## Virkni
* Leit eftir nafni og Espólín-númeri (fyrstu 2.000 niðurstöður í víðri leit)
* Einstaklingsspjald, foreldrar, börn, ævitexti
* Ættartré 4 kynslóðir
* Stysta tengileið milli einstaklinga í foreldra-/barnaneti
* Uppáhaldsfólk í localStorage

## Takmarkanir
* Gögnin eru afleidd úr áður unnum CSV-skrám; ekki er fullyrt að allir reitir Espólín hafi verið fullafkóðaðir.
* Hjónabönd/sambönd úr POR eru ekki tengd.
* Millinöfn kunna að vanta.
* Staðsetningar eru í frjálsum texta, ekki aðskildum staðfestum reitum.
* Gætið persónuverndar vegna lifandi einstaklinga; ekki birta opinberlega án yfirferðar.
