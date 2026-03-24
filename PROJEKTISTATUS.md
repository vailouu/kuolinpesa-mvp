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
- HOIDETTU/LÖYTYI badge: `#4ADE80` on `#1A3A1A`

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
   - Varat ja velat
   - Sopimukset
   - Yhteenveto
3. **Perunkirjoitus** — tehtävälista (9 tehtävää) + "Generoi perukirjapohja" nappi
4. **Hoito ja toimeenpano** — tulossa
5. **Päätös** — tulossa

## UI-arkkitehtuuri

### Sivupaneeli-rakenne (kaikissa osioissa sama)
- **Vasen puoli:** lista/tehtävät/sopimukset — pysyy aina samankokoisena
- **Oikea puoli (sticky):**
  - Yläosa: yleinen ohjekortti (aina näkyvissä, kultainen reunus)
  - Alaosa: klikatun elementin ohjeet + kommentit (ilmestyy klikkauksesta)

### Ensitoimet
- Tehtävät listattuna järjestyksessä
- Checkmark-boksi vasemmalla
- Klikkaamalla riviä avautuu oikea paneeli (ohjeet + kommentit)
- Oikealla oletuksena "Näin Ensitoimet toimii" -ohjekortti
- "Siirry omaisuuden selvitykseen →" nappi listan alla

### Varat ja velat
- Kategoriat accordioneina: Pankkivarat, Sijoitukset, Kiinteistöt, Omaisuus, Saatavat / Lainat, Luotot, Muut velat
- X/Y löytyi laskuri kategorian alla
- Jokainen rivi: Kyllä/Ei napit + klikattava rivi
- Klikatessa avautuu oikea paneeli: ohje + kirjauskenttä (esimerkki-placeholder per kohde) + kommentit
- Kirjatut löydöt näkyvät paneelissa, poistettavissa Poista-napilla
- Yhteenveto-blokki sivun alareunassa
- Oikealla oletuksena "Näin Varat ja velat toimii" -ohjekortti (sticky)

### Sopimukset
- 9 kategoriaa accordioneina, X/Y hoidettu laskuri
- Klikkaamalla sopimusta avautuu oikea paneeli: ohjeet + "Merkitse hoidetuksi ✓" nappi
- "Oli vainajalla" / "Ei ollut" napit
- Oikealla oletuksena "Näin Sopimukset toimii" -ohjekortti (sticky)

### Perunkirjoitus
- 9 tehtävää listattuna
- Checkmark-boksi + klikattava rivi → oikea paneeli
- "Generoi perukirjapohja →" nappi listan alla (placeholder, alert)

## Dashboard-statet (tärkeimmät)
```js
const [aktiivinenVaihe, setAktiivinenVaihe] = useState(1) // localStorage
const [aktiivinenAlivaihe, setAktiivinenAlivaihe] = useState(1) // localStorage
const [avattuTehtava, setAvattuTehtava] = useState(null) // Ensitoimet
const [avattuKohta, setAvattuKohta] = useState(null) // Varat ja velat
const [avattuSopimus, setAvattuSopimus] = useState(null) // Sopimukset
const [varatRastitattu, setVaratRastitattu] = useState({}) // Supabase
const [varatKirjaukset, setVaratKirjaukset] = useState({}) // Supabase
const [vahvistetutKirjaukset, setVahvistetutKirjaukset] = useState({}) // Supabase
```

## Komponentit
- `TehtavaKortti` — rivi Ensitoimissa
- `TehtavaPaneeli` — oikea paneeli Ensitoimissa (ohjeet + kommentit)
- `VaratJaVelat` — Varat ja velat -osio (accordion-rakenne)
- `VaratJaVelatPaneeli` — oikea paneeli Varat ja velat -osiossa
- `SelvitysOsio` — Sopimukset-osio (sisältää oman sivupaneelin)
- `PerunkirjoitusOsio` — Perunkirjoitus-osio
- `Yhteenveto` — Yhteenveto-alivälilehti
- `KutsuJasen` — tiimin jäsenten lisäys

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
- Kommenteissa näkyy kirjoittajan nimi (ei sähköposti)
- Sovelluksen kohdeyleisö: perheet jotka haluavat selvitä ilman asianajajaa tai minimoida asianajajan käyttöä

## Pending / Tulossa
- Perukirjapohjan generointi (Word/PDF) — docx-skill käytettävissä
- Vaihe 4: Hoito ja toimeenpano (omaisuuden jako, perinnönjakosopimus, äänestysrakenne per omaisuuserä)
- Vaihe 5: Päätös
- Kommentointi Varat ja velat + Sopimukset -osioihin (nyt "tulossa pian")
- Realtime-kommentit (Supabase Realtime)
- RLS päälle ennen tuotantoa
- Mobiilioptimointi
- Tapahtumaloki sopivampaan paikkaan
