# Pesänhoitaja MVP — Projektistatus

## Tekninen stack
- **Framework:** Next.js (App Router, JavaScript)
- **Tietokanta:** Supabase
- **Tyyli:** Tailwind CSS
- **Polku:** `C:\Users\vilot\Desktop\Kuolinpesä-MVP\kuolinpesa-mvp`
- **GitHub:** `https://github.com/vailouu/kuolinpesa-mvp`
- **Supabase URL:** `https://kykekkrvkttfdpwsgrzj.supabase.co`

## Väripaletti
- Tausta: `#0F1E3C`
- Kulta: `#C9A84C`
- Kortti: `#1B2A4A`
- Teksti: `#FFFFFF` / `#A0AEC0`
- HOIDETTU badge: `#4ADE80` on `#1A3A1A`

## Tiedostorakenne
- `app/page.js` — Etusivu (markkinointisivu)
- `app/dashboard/page.js` — Pääsivu (kaikki toiminnallisuus)
- `app/kirjaudu/page.js` — Kirjautumissivu
- `app/aloita/page.js` — Rekisteröitymissivu
- `app/supabase.js` — Supabase-yhteys

## Supabase-taulut
- `kuolinpesat` — kuolinpesän perustiedot
  - `vainajan_nimi`, `kuolinpaiva`, `kayttaja_email`, `kayttaja_nimi`
  - `esi_tarkistukset` (jsonb)
  - `varat_rastitattu` (jsonb)
  - `varat_kirjaukset` (jsonb)
  - `varat_vahvistetut` (jsonb)
- `tehtavat` — Ensitoimet-tehtävät
- `sopimukset` — Sopimukset-osion tilat
- `jasenet` — tiimin jäsenet
- `kommentit` — tehtäväkohtaiset kommentit
- `tapahtumat` — tapahtumaloki (toteutettu mutta ei käytössä UI:ssa)

## Prosessin rakenne (5 vaihetta)
1. **Ensitoimet** — tehtävälista (virkatodistus, pankki, Kela jne.)
2. **Omaisuuden selvitys** — 3 alivälilehteä:
   - Varat ja velat (Kyllä/Ei + kirjauskenttä + yhteenveto)
   - Sopimukset (5 kategoriaa, 52+ sopimusta)
   - Yhteenveto
3. **Perunkirjoitus** — tehtävälista (9 tehtävää) + "Generoi perukirjapohja" nappi
4. **Hoito ja toimeenpano** — tulossa
5. **Päätös** — tulossa

## UI-arkkitehtuuri

### Sivupaneeli-rakenne (kaikissa osioissa)
- **Vasen puoli:** lista/tehtävät/sopimukset
- **Oikea puoli (sticky):**
  - Yläosa: yleinen ohjekortti (aina näkyvissä)
  - Alaosa: klikatun elementin ohjeet + kommentit (ilmestyy klikkauksesta)

### Ensitoimet
- Tehtävät listattuna järjestyksessä
- Checkmark-boksi vasemmalla
- Klikkaamalla riviä avautuu oikea paneeli (ohjeet + kommentit)
- "Siirry omaisuuden selvitykseen →" nappi listan alla

### Varat ja velat
- Kategoriat: Pankkivarat, Sijoitukset, Kiinteistöt, Omaisuus, Saatavat, Lainat, Luotot, Muut velat
- Jokainen rivi: Kyllä/Ei napit + klikattava rivi
- Kyllä → avautuu oikea paneeli jossa ohje + kirjauskenttä + kommentit
- Kirjatut löydöt näkyvät sekä paneelissa että yhteenvedossa sivun alareunassa

### Sopimukset
- 5 kategoriaa, accordionit
- Klikkaamalla sopimusta avautuu oikea paneeli
- "Oli vainajalla" / "Ei ollut" napit
- "Merkitse hoidetuksi ✓" nappi paneelissa

### Perunkirjoitus
- 9 tehtävää listattuna
- Checkmark-boksi + klikattava rivi → oikea paneeli
- "Generoi perukirjapohja →" nappi listan alla (placeholder)

## Kommentointi
- Tehtäväkohtaiset kommentit (kommentit-taulu)
- Oikean sivupalkin yleinen kommenttikenttä (Ensitoimet-osiossa)
- Kommenteissa näkyy kirjoittajan nimi (ei sähköposti)

## Navigaatio
- Logo vasemmassa yläkulmassa
- "← Etusivu" nappi logon vieressä
- Etusivu tarkistaa kirjautumisen → ohjaa dashboardille jos kirjautunut
- localStorage muistaa aktiivisen vaiheen ja alivaiheen sivun päivityksen yli

## Tärkeät tuotesuunnittelupäätökset
- Ei henkilötunnusten keräystä (arkaluonteinen tieto)
- Perukirjapohja generoidaan ilman tarkkoja summia — toimii muistilistana asianajajalle
- Sopimuksia ei voi irtisanoa yksin — valtakirja tarvitaan
- RLS pois päältä MVP-vaiheessa

## Pending / Tulossa
- Perukirjapohjan generointi (Word/PDF)
- Vaihe 4: Hoito ja toimeenpano (omaisuuden jako, perinnönjakosopimus)
- Vaihe 5: Päätös
- Realtime-kommentit (Supabase Realtime)
- Testamentti-osio Perunkirjoitukseen
- RLS päälle ennen tuotantoa
- Mobiilioptimointi
- Tapahtumaloki sopivampaan paikkaan
