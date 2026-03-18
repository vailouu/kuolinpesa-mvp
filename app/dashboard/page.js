'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

// ─── SELVITYS-DATA ───────────────────────────────────────────────────────────

const kategoriat = [
  {
    id: 'asuminen',
    nimi: 'Asuminen',
    ikoni: '🏠',
    sopimukset: [
      {
        nimi: 'Sähkösopimus',
        miksi: 'Sähkösopimus ei pääty automaattisesti — sähköyhtiö ei saa tietoa kuolemasta muualta. Sopimus voi pysyä kuolinpesän nimissä perunkirjoitukseen asti.',
        miten: ['Ota yhteyttä sähköyhtiön asiakaspalveluun puhelimitse tai sähköpostilla','Ilmoita vainajan nimi, osoite ja kuolinpäivä','Päätä irtisanotaanko sopimus vai siirretäänkö se jonkun osakkaan nimiin','Irtisanomiseen tarvitaan kaikkien osakkaiden valtakirja']
      },
      {
        nimi: 'Vesisopimus',
        miksi: 'Koskee lähinnä omakotitaloja — kerrostaloissa vesi sisältyy yleensä yhtiövastikkeeseen.',
        miten: ['Tarkista onko vainajalla erillinen vesisopimus (löytyy laskuista)','Ota yhteyttä vesiyhtiöön ja ilmoita kuolemasta','Siirrä sopimus tai irtisano tarpeen mukaan']
      },
      {
        nimi: 'Kaukolämpösopimus',
        miksi: 'Koskee kaukolämpöä käyttäviä kiinteistöjä. Sopimus ei pääty automaattisesti.',
        miten: ['Ota yhteyttä kaukolämpöyhtiöön','Ilmoita kuolemasta ja sovi sopimuksen jatkosta tai irtisanomisesta','Irtisanomiseen tarvitaan valtakirja kaikilta osakkailta']
      },
      {
        nimi: 'Vuokrasopimus',
        miksi: 'Vuokrasopimus ei pääty automaattisesti — kuolinpesä vastaa vuokranmaksusta kunnes sopimus irtisanotaan.',
        miten: ['Irtisano vuokrasopimus kirjallisesti vuokranantajalle','Irtisanomiseen tarvitaan kaikkien osakkaiden allekirjoitukset','Irtisanomisaika on yleensä 1 kuukausi','Myös määräaikainen sopimus voidaan irtisanoa kuoleman perusteella']
      },
      {
        nimi: 'Internet / laajakaista',
        miksi: 'Internet-sopimus jatkuu ja laskut tulevat kuukausittain kunnes irtisanotaan.',
        miten: ['Ota yhteyttä operaattorin asiakaspalveluun','Ilmoita kuolemasta — useimmat operaattorit irtisanovat sopimuksen kuolintodistuksella','Irtisanomisaika on yleensä 14-30 päivää']
      },
      {
        nimi: 'Kaapeli-TV',
        miksi: 'Kaapeli-TV-sopimus jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä palveluntarjoajaan (DNA, Elisa, Telia)','Ilmoita kuolemasta ja pyydä sopimuksen päättämistä','Tarvitset kuolintodistuksen']
      },
      {
        nimi: 'Kotivakuutus',
        miksi: 'Kotivakuutus siirtyy automaattisesti kuolinpesän nimiin — pidä voimassa kunnes omaisuus on jaettu tai myyty.',
        miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Vakuutus jatkuu pesän nimissä — älä irtisano ennenaikaisesti','Irtisano vasta kun asunto on myyty tai jaettu']
      },
      {
        nimi: 'Kiinteistövakuutus',
        miksi: 'Koskee omakotitaloa tai muuta kiinteistöä. Pidä voimassa kunnes kiinteistö on myyty.',
        miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä vakuutus voimassa kunnes kiinteistö on siirtynyt uudelle omistajalle','Irtisanomiseen tarvitaan kaikkien osakkaiden suostumus']
      },
      {
        nimi: 'Hälytyspalvelu / turvapuhelin',
        miksi: 'Usein ikäihmisillä on turvapuhelin tai kotihälytyspalvelu — laskutetaan kuukausittain.',
        miten: ['Ota yhteyttä palveluntarjoajaan','Ilmoita kuolemasta ja pyydä sopimuksen päättämistä','Palauta laitteet jos tarpeen']
      },
      {
        nimi: 'Siivouspalvelu',
        miksi: 'Jos vainajalla oli säännöllinen siivouspalvelu, se jatkuu kunnes perutaan.',
        miten: ['Ota yhteyttä siivousyritykseen','Ilmoita kuolemasta ja peru tulevat käynnit']
      },
      {
        nimi: 'Piha- tai lumityöpalvelu',
        miksi: 'Kausisopimukset jatkuvat automaattisesti ellei niitä irtisanota.',
        miten: ['Ota yhteyttä palveluntarjoajaan','Ilmoita kuolemasta ja peru sopimus']
      },
      {
        nimi: 'Parkkipaikka / autohalli',
        miksi: 'Parkkipaikkasopimus jatkuu ja kuukausimaksu juoksee kunnes irtisanotaan.',
        miten: ['Ota yhteyttä parkkipaikan omistajaan tai taloyhtiöön','Irtisano sopimus kirjallisesti','Palauta mahdollinen avain tai kaukosäädin']
      },
      {
        nimi: 'Säilytystila / varasto',
        miksi: 'Ulkoinen säilytystila laskutetaan kuukausittain — jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä palveluntarjoajaan','Tyhjennä tila ja irtisano sopimus','Palauta avain']
      }
    ]
  },
  {
    id: 'liikenne',
    nimi: 'Liikenne',
    ikoni: '🚗',
    sopimukset: [
      {
        nimi: 'Autovakuutus (liikennevakuutus + kasko)',
        miksi: 'Traficom merkitsee kuolinpesän automaattisesti ajoneuvon omistajaksi. Vakuutukset jäävät voimaan mutta muutokset vaativat kaikkien osakkaiden suostumuksen.',
        miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä vakuutus voimassa kunnes ajoneuvo on myyty tai siirretty','Kun ajoneuvo myydään — vakuutus päättyy automaattisesti']
      },
      {
        nimi: 'Moottoripyörän / veneen vakuutus',
        miksi: 'Sama periaate kuin autovakuutuksessa — vakuutus siirtyy kuolinpesän nimiin automaattisesti.',
        miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä voimassa kunnes omaisuus on myyty tai jaettu']
      },
      {
        nimi: 'Autolaina / rahoitussopimus',
        miksi: 'Autolaina siirtyy kuolinpesälle — se pitää maksaa tai neuvotella uudelleen rahoitusyhtiön kanssa.',
        miten: ['Ota yhteyttä rahoitusyhtiöön','Selvitä lainan jäljellä oleva summa','Sovi jatkosta — maksetaanko laina pois vai siirretäänkö uudelle omistajalle']
      },
      {
        nimi: 'Leasingsopimus',
        miksi: 'Leasingauto ei kuulu kuolinpesään — se on leasingyhtiön omaisuutta. Sopimus pitää irtisanoa erikseen.',
        miten: ['Ota yhteyttä leasingyhtiöön välittömästi','Palauta ajoneuvo sovitusti','Selvitä mahdolliset jäljellä olevat maksut']
      },
      {
        nimi: 'Pysäköintikortti / aluekortti',
        miksi: 'Kuukausittain laskutettava pysäköintisopimus jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä pysäköintiyhtiöön tai taloyhtiöön','Irtisano sopimus ja palauta kortti tai kaukosäädin']
      }
    ]
  },
  {
    id: 'viestinta',
    nimi: 'Viestintä',
    ikoni: '📱',
    sopimukset: [
      {
        nimi: 'Puhelinliittymä',
        miksi: 'Puhelinliittymä ei pääty automaattisesti. Kuolemantapauksessa myös määräaikainen liittymä voidaan irtisanoa.',
        miten: ['Ota yhteyttä operaattorin asiakaspalveluun puhelimitse tai myymälässä','Ilmoita vainajan nimi ja kuolinpäivä','Pyydä kirjallinen vahvistus irtisanomisesta','Tarkista onko samalla laskulla muita palveluita jotka pitää irtisanoa erikseen']
      },
      {
        nimi: 'Toinen puhelinliittymä / kiinteä linja',
        miksi: 'Monella vanhemmalla ihmisellä on sekä matkapuhelin että kiinteä kotipuhelin — molemmat pitää irtisanoa erikseen.',
        miten: ['Ota yhteyttä operaattorin asiakaspalveluun','Irtisano molemmat liittymät erikseen']
      },
      {
        nimi: 'Tabletti-liittymä',
        miksi: 'Erillinen dataliittymä tabletille jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä operaattorin asiakaspalveluun','Irtisano liittymä']
      },
      {
        nimi: 'Postilokero',
        miksi: 'Postin vuokralaatikko laskutetaan kuukausittain tai vuosittain.',
        miten: ['Ota yhteyttä Postiin','Irtisano postilokero','Tyhjennä lokero ja palauta avain']
      }
    ]
  },
  {
    id: 'vakuutukset',
    nimi: 'Vakuutukset',
    ikoni: '🛡️',
    sopimukset: [
      {
        nimi: 'Henkivakuutus',
        miksi: 'Henkivakuutuskorvaus ei tule automaattisesti — se pitää hakea erikseen. Mitään keskitettyä rekisteriä henkivakuutuksista ei ole.',
        miten: ['Etsi vakuutuskirjat vainajan papereiden joukosta','Ota yhteyttä vakuutusyhtiöön ja hae korvausta','Jos et tiedä missä yhtiössä vakuutus on — kysy kaikilta vakuutusyhtiöiltä','Korvaushakemus pitää tehdä yleensä vuoden sisällä kuolemasta']
      },
      {
        nimi: 'Ryhmähenkivakuutus (työnantajan kautta)',
        miksi: 'Monilla palkansaajilla on työnantajan ottama ryhmähenkivakuutus — tätä ei aina tiedetä. Korvaus voi olla merkittävä.',
        miten: ['Kysy vainajan viimeiseltä työnantajalta','Tai tarkista Työntekijäin ryhmähenkivakuutuspoolista: tvk.fi']
      },
      {
        nimi: 'Tapaturmavakuutus',
        miksi: 'Jos vainaja kuoli tapaturmaisesti tai vakuutuksessa on kuolemantapausturva, siitä voi saada korvausta.',
        miten: ['Tarkista vakuutuskirjoista onko tapaturmavakuutusta','Ota yhteyttä vakuutusyhtiöön','Hae korvaus vuoden sisällä']
      },
      {
        nimi: 'Matkavakuutus (vuosivakuutus)',
        miksi: 'Vuosittain uusiutuva matkavakuutus jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä vakuutusyhtiöön','Irtisano vakuutus']
      },
      {
        nimi: 'Sairausvakuutus (yksityinen)',
        miksi: 'Yksityinen sairausvakuutus päättyy kuolinpäivänä automaattisesti — mutta vakuutusyhtiölle pitää silti ilmoittaa.',
        miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Selvitä onko avoinna olevia korvauksia joita voi vielä hakea']
      },
      {
        nimi: 'Eläkevakuutus (vapaaehtoinen)',
        miksi: 'Vapaaehtoinen eläkesäästö kuuluu kuolinpesään ja voidaan nostaa — tai se voi sisältää kuolemanvaraturvan.',
        miten: ['Ota yhteyttä vakuutusyhtiöön','Selvitä onko kuolemanvaraturvaa tai nostomahdollisuus','Hae korvaus tai nosto']
      },
      {
        nimi: 'Lainaturva',
        miksi: 'Jos vainajalla oli lainaturva lainassa, se voi kattaa lainan loppusumman kuoleman jälkeen.',
        miten: ['Tarkista onko lainassa lainaturva — kysy pankista','Ota yhteyttä vakuutusyhtiöön ja hae korvausta','Korvaus voi maksaa koko lainan jäljellä olevan summan']
      },
      {
        nimi: 'Oikeusturvavakuutus',
        miksi: 'Oikeusturvavakuutus on usein liitetty kotivakuutukseen. Se voi kattaa kuolinpesän oikeudellisia kuluja.',
        miten: ['Tarkista kotivakuutuksesta onko oikeusturva mukana','Pidä voimassa perunkirjoitukseen asti']
      }
    ]
  },
  {
    id: 'terveys',
    nimi: 'Terveys ja hyvinvointi',
    ikoni: '🏃',
    sopimukset: [
      {
        nimi: 'Kuntosalijäsenyys',
        miksi: 'Kuntosalijäsenyys laskutetaan kuukausittain — ei pääty automaattisesti.',
        miten: ['Ota yhteyttä kuntosalin asiakaspalveluun','Ilmoita kuolemasta ja pyydä sopimuksen päättämistä','Palauta mahdollinen avainkortti tai kulkukortti']
      },
      {
        nimi: 'Uimahalli / liikuntakeskus',
        miksi: 'Kausi- tai kuukausijäsenyys jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä palveluntarjoajaan','Irtisano jäsenyys ja palauta kortti']
      },
      {
        nimi: 'Jumppatunnit / ryhmäliikunta',
        miksi: 'Säännölliset jumppatunnit tai sarjakortit.',
        miten: ['Ota yhteyttä ohjaajaan tai palveluntarjoajaan','Selvitä onko käyttämättömiä tunteja joista voi saada hyvitystä']
      },
      {
        nimi: 'Hierontapalvelu',
        miksi: 'Säännölliset hieronta-ajat tai sarjakortit.',
        miten: ['Peruuta tulevat ajat','Kysy hyvitystä käyttämättömistä sarjakortin kerroista']
      },
      {
        nimi: 'Yksityislääkärisopimus',
        miksi: 'Jatkuva sopimus yksityislääkäripalveluista.',
        miten: ['Ota yhteyttä palveluntarjoajaan','Irtisano sopimus']
      },
      {
        nimi: 'Hammaslääkärisopimus',
        miksi: 'Jatkuva sopimus hammashoitopalveluista tai hammasvakuutus.',
        miten: ['Ota yhteyttä hammaslääkärille tai palveluntarjoajaan','Irtisano sopimus tai vakuutus']
      }
    ]
  },
  {
    id: 'viihde',
    nimi: 'Viihde ja media',
    ikoni: '📺',
    sopimukset: [
      {
        nimi: 'Lehtitilaukset',
        miksi: 'Sanomalehdet jatkuvat kunnes irtisanotaan. Käännetty posti paljastaa usein mitkä lehdet vainajalla oli.',
        miten: ['Ota yhteyttä kustantajaan puhelimitse tai verkkosivujen kautta','Ilmoita kuolemasta ja pyydä tilauksen päättämistä']
      },
      {
        nimi: 'Aikakauslehdet',
        miksi: 'Vuositilaukset uusiutuvat automaattisesti ellei niitä irtisanota.',
        miten: ['Ota yhteyttä kustantajaan','Irtisano tilaus']
      },
      {
        nimi: 'Netflix',
        miksi: 'Kuukausittain laskutettava tilaus jatkuu kunnes peruutetaan.',
        miten: ['Kirjaudu Netflix-tilille jos tiedät salasanan ja peruuta tilaus asetuksista','Jos salasana ei ole tiedossa — kuoleta luottokortti jolla Netflix laskutetaan']
      },
      {
        nimi: 'Spotify / Apple Music',
        miksi: 'Kuukausittain laskutettava musiikkipalvelu.',
        miten: ['Kirjaudu tilille ja peruuta tilaus','Jos salasana ei ole tiedossa — kuoleta luottokortti']
      },
      {
        nimi: 'Disney+ / C More / Viaplay / Elisa Viihde',
        miksi: 'Striimipalvelut laskutetaan kuukausittain.',
        miten: ['Kirjaudu tilille ja peruuta tilaus','Jos Elisa Viihde — palauta digiboksi Elisalle','Jos salasana ei ole tiedossa — kuoleta luottokortti']
      },
      {
        nimi: 'Kirjakerho / kirjatilaus',
        miksi: 'Kirjakerhot lähettävät kirjoja automaattisesti ja laskuttavat säännöllisesti.',
        miten: ['Ota yhteyttä kirjakerhoon','Irtisano jäsenyys']
      },
      {
        nimi: 'Äänikirjapalvelu (Storytel, BookBeat)',
        miksi: 'Kuukausittain laskutettava tilaus.',
        miten: ['Kirjaudu tilille ja peruuta tilaus','Jos salasana ei ole tiedossa — kuoleta luottokortti']
      }
    ]
  },
  {
    id: 'jasenydet',
    nimi: 'Jäsenyydet ja järjestöt',
    ikoni: '🤝',
    sopimukset: [
      {
        nimi: 'Ammattiliitto',
        miksi: 'Ammattiliiton jäsenmaksu laskutetaan kuukausittain tai vuosittain. Liitolla voi olla myös kuolemanvaraturva.',
        miten: ['Ota yhteyttä ammattiliiton jäsenpalveluun','Ilmoita kuolemasta ja pyydä jäsenyyden päättämistä','Selvitä onko liitolla kuolemanvaraturvaa tai muita etuuksia']
      },
      {
        nimi: 'Työttömyyskassa',
        miksi: 'Työttömyyskassan jäsenyys päättyy kuolemaan mutta ilmoitus pitää tehdä.',
        miten: ['Ilmoita kuolemasta kassalle','Selvitä onko avoinna olevia korvauksia']
      },
      {
        nimi: 'Urheiluseura / harrastusseura',
        miksi: 'Vuosittaiset jäsenmaksut uusiutuvat automaattisesti.',
        miten: ['Ota yhteyttä seuran sihteeriin tai hallitukseen','Ilmoita kuolemasta ja pyydä jäsenyyden päättämistä']
      },
      {
        nimi: 'SPR / Lions / Rotary / muu järjestö',
        miksi: 'Järjestöjen jäsenmaksut laskutetaan vuosittain.',
        miten: ['Ota yhteyttä järjestön paikallisosastoon','Ilmoita kuolemasta']
      },
      {
        nimi: 'Eläkeläisjärjestö',
        miksi: 'Eläkeläisjärjestöjen jäsenmaksut laskutetaan vuosittain.',
        miten: ['Ota yhteyttä järjestöön','Ilmoita kuolemasta']
      }
    ]
  },
  {
    id: 'digitaaliset',
    nimi: 'Digitaaliset palvelut',
    ikoni: '💻',
    sopimukset: [
      {
        nimi: 'Sähköpostitilit (Gmail, Outlook)',
        miksi: 'Sähköpostitilit jäävät auki kunnes suljetaan — ne voivat sisältää tärkeitä viestejä.',
        miten: ['Kirjaudu tilille jos salasana on tiedossa — tallenna tärkeät viestit','Gmail: pyydä tilin sulkemista Googlen kautta kuolintodistuksella','Outlook: ota yhteyttä Microsoftiin']
      },
      {
        nimi: 'Facebook',
        miksi: 'Facebook-tili voidaan muuttaa muistotilaksi tai poistaa kokonaan.',
        miten: ['Mene Facebookin erikoispyyntölomakkeelle','Valitse muutako tili muistotilaksi vai poistetaanko se','Tarvitset kuolintodistuksen']
      },
      {
        nimi: 'Instagram',
        miksi: 'Instagram-tili voidaan muuttaa muistotilaksi tai poistaa.',
        miten: ['Täytä Instagramin erikoispyyntölomake','Tarvitset kuolintodistuksen']
      },
      {
        nimi: 'LinkedIn',
        miksi: 'LinkedIn-profiili jää näkyviin kunnes se poistetaan.',
        miten: ['Ota yhteyttä LinkedInin asiakaspalveluun','Pyydä profiilin poistamista kuolintodistuksella']
      },
      {
        nimi: 'Pilvipalvelut (iCloud, Google Drive, Dropbox)',
        miksi: 'Pilvipalveluissa voi olla tärkeitä dokumentteja ja valokuvia — maksulliset tilat laskutetaan kuukausittain.',
        miten: ['Tallenna tärkeät tiedostot ennen tilin sulkemista','Sulje maksutilit','iCloud vaatii Apple ID:n — ota yhteyttä Appleen']
      },
      {
        nimi: 'Apple ID / iTunes',
        miksi: 'Apple ID:hen liittyvät tilaukset jatkuvat kunnes peruutetaan.',
        miten: ['Ota yhteyttä Applen asiakaspalveluun kuolintodistuksella','Pyydä tilin sulkemista ja tilausten peruuttamista']
      },
      {
        nimi: 'Microsoft-tili',
        miksi: 'Microsoft 365 ja muut tilaukset laskutetaan kuukausittain.',
        miten: ['Ota yhteyttä Microsoftin asiakaspalveluun','Pyydä tilin sulkemista']
      },
      {
        nimi: 'Verkkokauppojen tilit (Amazon, Zalando)',
        miksi: 'Verkkokauppojen tilit voivat sisältää tallennettuja maksukortteja ja automaattisia tilauksia.',
        miten: ['Kirjaudu tilille jos salasana on tiedossa','Peruuta automaattiset tilaukset','Poista maksukorttitiedot']
      }
    ]
  },
  {
    id: 'muut',
    nimi: 'Muut palvelut',
    ikoni: '📦',
    sopimukset: [
      {
        nimi: 'Kotihoidon palvelut',
        miksi: 'Säännölliset kotihoidon käynnit laskutetaan kunnes peruutetaan.',
        miten: ['Ota yhteyttä palveluntarjoajaan tai kotihoitoon','Peruuta tulevat käynnit','Palauta mahdolliset avaimet']
      },
      {
        nimi: 'Ateriapalvelu',
        miksi: 'Ateriapalvelu toimittaa ruokaa säännöllisesti ja laskuttaa kuukausittain.',
        miten: ['Ota yhteyttä palveluntarjoajaan välittömästi','Peruuta tulevat toimitukset']
      },
      {
        nimi: 'Kotiinkuljetuspalvelut (ruoka, kauppa)',
        miksi: 'Jatkuvat tilaukset kuten Wolt+ jatkuvat kunnes peruutetaan.',
        miten: ['Kirjaudu tilille ja peruuta tilaus','Jos salasana ei ole tiedossa — kuoleta luottokortti']
      },
      {
        nimi: 'Taksikortti / Kela-taksi',
        miksi: 'Kela-taksi päättyy automaattisesti kun Kela saa tiedon — mutta ilmoitus kannattaa tehdä itse.',
        miten: ['Ilmoita Kelalle kuolemasta','Palauta mahdollinen taksikortti']
      },
      {
        nimi: 'Autopesusopimus',
        miksi: 'Kuukausittain laskutettava autopesusopimus jatkuu kunnes irtisanotaan.',
        miten: ['Ota yhteyttä autopesuyrityksen asiakaspalveluun','Irtisano sopimus']
      },
      {
        nimi: 'Lemmikin hoitopalvelu',
        miksi: 'Jos vainajalla oli lemmikki ja säännöllinen hoitopalvelu.',
        miten: ['Peruuta tulevat hoitoajat','Selvitä lemmikin jatkosta']
      }
    ]
  }
]

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter()
  const [aktiivinenVaihe, setAktiivinenVaihe] = useState(1)
  const [kuolinpesa, setKuolinpesa] = useState(null)
  const [tehtavaLista, setTehtavaLista] = useState([])
  const [esiTarkistukset, setEsiTarkistukset] = useState({
    hautajaiset: false,
    kuolintodistus: false,
    laheiset: false
  })
  const [ladataan, setLadataan] = useState(true)
  const kaikkiEsiTarkistuksetTehty = Object.values(esiTarkistukset).every(v => v === true)

  const vaiheet = [
    { numero: 1, nimi: 'Ensitoimet' },
    { numero: 2, nimi: 'Selvitys' },
    { numero: 3, nimi: 'Perunkirjoitus' },
    { numero: 4, nimi: 'Hoito' },
    { numero: 5, nimi: 'Päätös' },
  ]

  const oletusTehtavat = [
    { nimi: 'Tilaa virkatodistus', vaihe: 1 },
    { nimi: 'Ilmoita pankeille', vaihe: 1 },
    { nimi: 'Ilmoita Kelalle', vaihe: 1 },
    { nimi: 'Hae henkivakuutuskorvaus', vaihe: 1 },
    { nimi: 'Ilmoita työnantajalle ja taloyhtiölle', vaihe: 1 },
    { nimi: 'Ohjaa posti uuteen osoitteeseen', vaihe: 1 },
  ]

  useEffect(() => {
    const haeData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/kirjaudu')
        setLadataan(false)
        return
      }

      const { data: pesaData } = await supabase
        .from('kuolinpesat')
        .select('*')
        .eq('kayttaja_email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (pesaData) {
        setKuolinpesa(pesaData)
        if (pesaData.esi_tarkistukset) {
          setEsiTarkistukset(pesaData.esi_tarkistukset)
        }
        setLadataan(false)
        const { data: tehtavatData } = await supabase
          .from('tehtavat')
          .select('*')
          .eq('kuolinpesa_id', pesaData.id)

        if (tehtavatData && tehtavatData.length > 0) {
          setTehtavaLista(tehtavatData)
        } else {
          const uudetTehtavat = oletusTehtavat.map(t => ({
            ...t,
            tehty: false,
            kuolinpesa_id: pesaData.id
          }))
          const { data: luodut } = await supabase
            .from('tehtavat')
            .insert(uudetTehtavat)
            .select()
          if (luodut) setTehtavaLista(luodut)
        }
      }
    }
    haeData()
  }, [])

  const paivitaEsiTarkistus = async (kentta) => {
    const uudet = { ...esiTarkistukset, [kentta]: !esiTarkistukset[kentta] }
    setEsiTarkistukset(uudet)
    if (kuolinpesa) {
      await supabase
        .from('kuolinpesat')
        .update({ esi_tarkistukset: uudet })
        .eq('id', kuolinpesa.id)
    }
  }

  const merkitseTehdyksi = async (id, nykyinenTila) => {
    const { data } = await supabase
      .from('tehtavat')
      .update({ tehty: !nykyinenTila })
      .eq('id', id)
      .select()
      .single()
    if (data) {
      setTehtavaLista(tehtavaLista.map(t => t.id === id ? data : t))
    }
  }

  const nykyisetTehtavat = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe)
  const valmiit = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe && t.tehty).length
  const kaikki = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe).length

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0F1E3C'}}>

      <nav style={{borderBottom: '1px solid #C9A84C'}} className="px-8 py-4 flex items-center justify-between">
        <div style={{color: '#C9A84C'}} className="text-xl font-bold tracking-widest uppercase">
          Pesänhoitaja
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white text-sm">{kuolinpesa?.kayttaja_email || ''}</div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            style={{color: '#C9A84C', border: '1px solid #C9A84C'}}
            className="px-3 py-1 text-sm rounded hover:opacity-75"
          >
            Kirjaudu ulos
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2">— Kuolinpesä —</div>
          <h1 className="text-white text-3xl font-bold">{kuolinpesa?.vainajan_nimi || 'Ladataan...'}</h1>
          <p style={{color: '#A0AEC0'}} className="text-sm mt-1">
            {kuolinpesa?.kuolinpaiva ? `Kuolinpäivä: ${kuolinpesa.kuolinpaiva}` : 'Kuolinpesän hallinta'}
          </p>
        </div>

        {!ladataan && !kaikkiEsiTarkistuksetTehty && (
          <div className="mb-8 p-6 rounded-lg" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}}>
            <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2">— Ennen kuin aloitat —</div>
            <h2 className="text-white font-bold text-lg mb-2">Oletko hoitanut nämä?</h2>
            <p style={{color: '#A0AEC0'}} className="text-sm mb-6">Nämä asiat hoidetaan yleensä ensimmäisten päivien aikana. Ruksaa ne jos ne on jo hoidettu.</p>
            <div className="flex flex-col gap-3">
              {[
                { kentta: 'hautajaiset', teksti: 'Hautajaiset on järjestetty', kuvaus: 'Hautaustoimisto tai seurakunta on yleensä auttanut tässä.' },
                { kentta: 'kuolintodistus', teksti: 'Kuolintodistus on hankittu', kuvaus: 'Sairaala tai lääkäri on laatinut sen automaattisesti. Muista hankkia useampi kopio.' },
                { kentta: 'laheiset', teksti: 'Läheiset ja sukulaiset on ilmoitettu', kuvaus: 'Tämä on henkilökohtainen asia jonka jokainen hoitaa omalla tavallaan.' },
              ].map(({ kentta, teksti, kuvaus }) => (
                <div
                  key={kentta}
                  onClick={() => paivitaEsiTarkistus(kentta)}
                  className="flex items-start gap-4 p-4 rounded cursor-pointer hover:opacity-80"
                  style={{backgroundColor: '#0F1E3C', border: `1px solid ${esiTarkistukset[kentta] ? '#C9A84C' : '#2D3E5C'}`}}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor: esiTarkistukset[kentta] ? '#C9A84C' : 'transparent',
                      border: `2px solid ${esiTarkistukset[kentta] ? '#C9A84C' : '#4A5568'}`
                    }}
                  >
                    {esiTarkistukset[kentta] && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{teksti}</p>
                    <p style={{color: '#A0AEC0'}} className="text-xs mt-1">{kuvaus}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{color: '#4A5568'}} className="text-xs mt-6 text-center">
              Suorita ensin yllä olevat kohdat jatkaaksesi
            </p>
          </div>
        )}

        <div
          className="mb-10 p-6 rounded-lg transition-all"
          style={{
            backgroundColor: '#1B2A4A',
            border: '1px solid #2D3E5C',
            opacity: kaikkiEsiTarkistuksetTehty ? 1 : 0.3,
            pointerEvents: kaikkiEsiTarkistuksetTehty ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold">Edistyminen</span>
            <span style={{color: '#C9A84C'}} className="text-sm font-bold">
              {aktiivinenVaihe === 2 ? '' : `${valmiit}/${kaikki} tehtävää`}
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{backgroundColor: '#0F1E3C'}}>
            <div
              className="h-2 rounded-full transition-all"
              style={{backgroundColor: '#C9A84C', width: kaikki > 0 && aktiivinenVaihe !== 2 ? `${(valmiit/kaikki)*100}%` : '0%'}}
            />
          </div>
        </div>

        <div
          className="flex gap-2 mb-8 overflow-x-auto transition-all"
          style={{
            opacity: kaikkiEsiTarkistuksetTehty ? 1 : 0.3,
            pointerEvents: kaikkiEsiTarkistuksetTehty ? 'auto' : 'none'
          }}
        >
          {vaiheet.map(v => (
            <button
              key={v.numero}
              onClick={() => setAktiivinenVaihe(v.numero)}
              className="flex-1 py-3 px-4 rounded text-sm font-bold whitespace-nowrap"
              style={{
                backgroundColor: aktiivinenVaihe === v.numero ? '#C9A84C' : '#1B2A4A',
                color: aktiivinenVaihe === v.numero ? '#0F1E3C' : '#A0AEC0',
                border: '1px solid',
                borderColor: aktiivinenVaihe === v.numero ? '#C9A84C' : '#2D3E5C'
              }}
            >
              {v.numero}. {v.nimi}
            </button>
          ))}
        </div>

        <div
          className="rounded-lg p-6 transition-all"
          style={{
            backgroundColor: '#1B2A4A',
            border: '1px solid #2D3E5C',
            opacity: kaikkiEsiTarkistuksetTehty ? 1 : 0.3,
            pointerEvents: kaikkiEsiTarkistuksetTehty ? 'auto' : 'none'
          }}
        >
<h2 className="text-white font-bold text-lg mb-6">
  Vaihe {aktiivinenVaihe}: {vaiheet[aktiivinenVaihe-1].nimi}
</h2>

{aktiivinenVaihe === 1 && (
  <div className="mb-6 p-4 rounded-lg" style={{backgroundColor: '#0F1E3C', border: '1px solid #4A7ACC'}}>
    <p style={{color: '#A0AEC0'}} className="text-sm">
      ℹ️ Käy nämä läpi ja merkitse hoidetuksi sitä mukaa kun ne valmistuvat. Virkatodistuksen tilaaminen kannattaa tehdä ensimmäisenä — toimituksessa kestää viikkoja.
    </p>
  </div>
)}

{aktiivinenVaihe === 2 ? (
            <SelvitysOsio kuolinpesaId={kuolinpesa?.id} onValmis={() => setAktiivinenVaihe(3)} />
          ) : nykyisetTehtavat.length === 0 ? (
            <p style={{color: '#4A5568'}} className="text-sm">Ei tehtäviä tässä vaiheessa vielä.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {nykyisetTehtavat.map(tehtava => (
                <TehtavaKortti
                  key={tehtava.id}
                  tehtava={tehtava}
                  onMerkitse={() => merkitseTehdyksi(tehtava.id, tehtava.tehty)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg p-6 mt-6" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
          <h2 className="text-white font-bold text-lg mb-6">Tiimi</h2>
          <KutsuJasen kuolinpesaId={kuolinpesa?.id} />
        </div>

      </div>
    </div>
  )
}

// ─── SELVITYS-KOMPONENTTI ────────────────────────────────────────────────────

function SelvitysOsio({ kuolinpesaId, onValmis }) {
  const [tilat, setTilat] = useState({})
  const [avatutKategoriat, setAvatutKategoriat] = useState({})
  const [avatutSopimukset, setAvatutSopimukset] = useState({})

  useEffect(() => {
    if (!kuolinpesaId) return
    const haeSopimukset = async () => {
      const { data } = await supabase
        .from('sopimukset')
        .select('*')
        .eq('kuolinpesa_id', kuolinpesaId)
      if (data) {
        const map = {}
        data.forEach(s => { map[s.nimi] = s.tila })
        setTilat(map)
      }
    }
    haeSopimukset()
  }, [kuolinpesaId])

  const paivitaTila = async (nimi, uusiTila, kategoriaId) => {
    const vanhaTila = tilat[nimi]
    const lopullinenTila = vanhaTila === uusiTila ? null : uusiTila
    setTilat(prev => ({ ...prev, [nimi]: lopullinenTila }))

    if (lopullinenTila) {
      await supabase.from('sopimukset').upsert({
        kuolinpesa_id: kuolinpesaId,
        nimi,
        tila: lopullinenTila,
        kategoria: kategoriaId
      }, { onConflict: 'kuolinpesa_id,nimi' })
    } else {
      await supabase.from('sopimukset')
        .delete()
        .eq('kuolinpesa_id', kuolinpesaId)
        .eq('nimi', nimi)
    }
  }

  const toggleKategoria = (id) => setAvatutKategoriat(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleSopimus = (nimi) => setAvatutSopimukset(prev => ({ ...prev, [nimi]: !prev[nimi] }))

  const kokonaisHoidettu = kategoriat.reduce((sum, k) =>
    sum + k.sopimukset.filter(s => tilat[s.nimi] === 'hoidettu').length, 0)
  const kokonaisKaikki = kategoriat.reduce((sum, k) => sum + k.sopimukset.length, 0)

  const avoimet = kategoriat.flatMap(k =>
    k.sopimukset.filter(s => tilat[s.nimi] === 'avoinna').map(s => ({ kategoria: k.nimi, sopimus: s.nimi }))
  )

  return (
    <div>
      {/* Valtakirjahuomio */}
      <div className="mb-6 p-4 rounded-lg" style={{backgroundColor: '#0F1E3C', border: '1px solid #4A7ACC'}}>
        <p style={{color: '#A0AEC0'}} className="text-sm">
          ⚠️ <strong style={{color: 'white'}}>Huom:</strong> Kuolinpesän sopimuksia ei voi irtisanoa yksin. Tähän tarvitaan kaikkien osakkaiden allekirjoittama valtakirja. Suosittelemme tekemään valtakirjan heti alussa.
        </p>
      </div>

      {/* Kokonaisedistyminen */}
      <div className="mb-6 p-4 rounded-lg" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-bold">Kokonaisedistyminen</span>
          <span style={{color: '#C9A84C'}} className="text-sm">{kokonaisHoidettu}/{kokonaisKaikki} hoidettu</span>
        </div>
        <div className="w-full rounded-full h-2" style={{backgroundColor: '#1B2A4A'}}>
          <div className="h-2 rounded-full transition-all"
            style={{backgroundColor: '#C9A84C', width: kokonaisKaikki > 0 ? `${(kokonaisHoidettu/kokonaisKaikki)*100}%` : '0%'}} />
        </div>
      </div>

      {/* Kategoriat */}
      <div className="flex flex-col gap-3 mb-6">
        {kategoriat.map(kategoria => {
          const hoidettu = kategoria.sopimukset.filter(s => tilat[s.nimi] === 'hoidettu').length
          const kaikki = kategoria.sopimukset.length
          const auki = avatutKategoriat[kategoria.id]
          const kaikkiValmis = hoidettu === kaikki

          return (
            <div key={kategoria.id} className="rounded-lg overflow-hidden"
              style={{backgroundColor: '#0F1E3C', border: `1px solid ${kaikkiValmis && hoidettu > 0 ? '#C9A84C' : '#2D3E5C'}`}}>

              <div className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80"
                onClick={() => toggleKategoria(kategoria.id)}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{kategoria.ikoni}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{kategoria.nimi}</p>
                    <p style={{color: hoidettu > 0 ? '#C9A84C' : '#4A5568'}} className="text-xs">
                      {hoidettu === 0 ? 'Ei käyty läpi' : `${hoidettu}/${kaikki} hoidettu`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {kaikkiValmis && hoidettu > 0 && <span style={{color: '#C9A84C'}} className="text-xs">✓ Valmis</span>}
                  <span style={{color: '#C9A84C'}} className="text-xs">{auki ? '▲' : '▼'}</span>
                </div>
              </div>

              {auki && (
                <div className="px-4 pb-4 border-t flex flex-col gap-2" style={{borderColor: '#2D3E5C'}}>
                  <div className="mt-3 flex flex-col gap-2">
                    {kategoria.sopimukset.map(sopimus => {
                      const tila = tilat[sopimus.nimi]
                      const onHoidettu = tila === 'hoidettu'
                      const onAvoinna = tila === 'avoinna'
                      const ohjeAuki = avatutSopimukset[sopimus.nimi]

                      return (
                        <div key={sopimus.nimi} className="rounded overflow-hidden"
                          style={{backgroundColor: '#1B2A4A', border: `1px solid ${onHoidettu ? '#C9A84C' : onAvoinna ? '#4A7ACC' : '#2D3E5C'}`}}>

                          <div className="flex items-center justify-between p-3 gap-3">
                            <span className="text-sm flex-1" style={{color: onHoidettu ? '#C9A84C' : onAvoinna ? 'white' : '#6B7280'}}>
                              {sopimus.nimi}
                            </span>
                            {onHoidettu && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                                style={{backgroundColor: '#1A3A1A', color: '#4ADE80', border: '1px solid #4ADE80'}}>
                                HOIDETTU
                              </span>
                            )}
                            <div className="flex gap-2 flex-shrink-0">
                              {!onHoidettu && (
                                <>
                                  <button
                                    onClick={() => paivitaTila(sopimus.nimi, 'avoinna', kategoria.id)}
                                    className="text-xs px-3 py-1 rounded whitespace-nowrap"
                                    style={{backgroundColor: onAvoinna ? '#2D4A7A' : '#0F1E3C', color: onAvoinna ? 'white' : '#6B7280', border: `1px solid ${onAvoinna ? '#4A7ACC' : '#2D3E5C'}`}}>
                                    {onAvoinna ? '✓ Löytyi' : 'Löytyi'}
                                  </button>
                                  <button
                                    onClick={() => paivitaTila(sopimus.nimi, 'hoidettu', kategoria.id)}
                                    className="text-xs px-3 py-1 rounded whitespace-nowrap"
                                    style={{backgroundColor: '#0F1E3C', color: '#6B7280', border: '1px solid #2D3E5C'}}>
                                    Ei löytynyt
                                  </button>
                                  {onAvoinna && (
                                    <button
                                      onClick={() => toggleSopimus(sopimus.nimi)}
                                      className="text-xs px-3 py-1 rounded whitespace-nowrap"
                                      style={{backgroundColor: '#0F1E3C', color: '#C9A84C', border: '1px solid #C9A84C'}}>
                                      {ohjeAuki ? 'Piilota' : 'Ohjeet →'}
                                    </button>
                                  )}
                                </>
                              )}
                              {onHoidettu && (
                                <button
                                  onClick={() => paivitaTila(sopimus.nimi, null, kategoria.id)}
                                  className="text-xs px-3 py-1 rounded"
                                  style={{color: '#4A5568', border: '1px solid #2D3E5C', backgroundColor: '#0F1E3C'}}>
                                  Peruuta
                                </button>
                              )}
                            </div>
                          </div>

                          {onAvoinna && ohjeAuki && (
                            <div className="px-3 pb-3 border-t" style={{borderColor: '#2D3E5C'}}>
                              <p style={{color: '#A0AEC0'}} className="text-xs mt-3 mb-3">{sopimus.miksi}</p>
                              <div style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">Miten hoidetaan</div>
                              <ul className="flex flex-col gap-1 mb-4">
                                {sopimus.miten.map((askel, i) => (
                                  <li key={i} className="flex gap-2 text-xs" style={{color: 'white'}}>
                                    <span style={{color: '#C9A84C'}} className="flex-shrink-0">{i + 1}.</span>
                                    {askel}
                                  </li>
                                ))}
                              </ul>
                              <button
                                onClick={() => paivitaTila(sopimus.nimi, 'hoidettu', kategoria.id)}
                                className="w-full py-2 rounded text-sm font-bold"
                                style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>
                                Merkitse hoidetuksi ✓
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Yhteenveto ja valmis-nappi */}
      <div className="p-4 rounded-lg" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
        {avoimet.length > 0 && (
          <div className="mb-4 p-3 rounded-lg" style={{backgroundColor: '#2D1A1A', border: '1px solid #FC8181'}}>
            <p style={{color: '#FC8181'}} className="text-sm font-bold mb-2">
              ⚠️ {avoimet.length} kohtaa merkitty "Löytyi" mutta ei vielä hoidettu:
            </p>
            <ul className="flex flex-col gap-1">
              {avoimet.map((item, i) => (
                <li key={i} style={{color: '#FCA5A5'}} className="text-xs">• {item.kategoria}: {item.sopimus}</li>
              ))}
            </ul>
          </div>
        )}

        {kokonaisHoidettu === kokonaisKaikki ? (
          <div className="text-center">
            <p style={{color: '#C9A84C'}} className="text-sm font-bold mb-4">✓ Kaikki kohdat käyty läpi!</p>
            <button
              className="w-full py-4 rounded font-bold text-lg"
              style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}
              onClick={onValmis}>
              Merkitse selvitys valmiiksi →
            </button>
          </div>
        ) : (
          <div>
            <p style={{color: '#4A5568'}} className="text-sm mb-4">
              {kokonaisHoidettu}/{kokonaisKaikki} kohtaa hoidettu. Voit myös merkitä selvityksen valmiiksi kesken prosessin.
            </p>
            <button
              className="w-full py-3 rounded font-bold"
              style={{backgroundColor: 'transparent', color: '#C9A84C', border: '1px solid #C9A84C'}}
              onClick={onValmis}>
              Merkitse selvitys valmiiksi silti →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TEHTÄVÄKORTTI ───────────────────────────────────────────────────────────

function TehtavaKortti({ tehtava, onMerkitse }) {
  const [auki, setAuki] = useState(false)

  const ohjeet = {
    'Tilaa virkatodistus': {
      kiireellinen: true,
      miksi: 'Toimituksessa kestää 4-10 viikkoa — tarvitaan pankeissa, vakuutuksissa ja perunkirjoituksessa. Tee tämä ensimmäisenä.',
      miten: ['Jos vainaja kuului ev.lut. kirkkoon → mene osoitteeseen tilaavirkatodistus.fi','Jos vainaja ei kuulunut kirkkoon → mene osoitteeseen dvv.fi','Tilaa useampi kopio kerralla — tarvitset niitä monessa paikassa','Hinta noin 35-100 €']
    },
    'Ilmoita pankeille': {
      kiireellinen: false,
      miksi: 'Pankki jäädyttää tilit automaattisesti mutta oma ilmoitus nopeuttaa asioita. Samalla sovitaan kuka hoitaa kuolinpesän pankkiasioita.',
      miten: ['Soita vainajan pankin asiakaspalveluun','Ilmoita vainajan nimi ja henkilötunnus','Kerro kuka toimii kuolinpesän hoitajana','Pankki antaa ohjeet kirjallisen ilmoituksen tekemiseen','Huom: Vainajan tililtä voi silti maksaa arjen laskuja ennen perunkirjoitusta']
    },
    'Ilmoita Kelalle': {
      kiireellinen: false,
      miksi: 'Jos vainaja sai Kela-etuuksia, ilmoita pian — muuten ylimääräiset maksut peritään takaisin. Selvitä samalla onko sinulla oikeus leskeneläkkeeseen.',
      miten: ['Soita Kelan palvelunumeroon 020 692 201 (ma-pe 9-16)','Kysy onko sinulla oikeus leskeneläkkeeseen tai lapseneläkkeeseen','Jos sinulla on alle 17-vuotiaita lapsia, kysy lapsilisän yksinhuoltajakorotuksesta']
    },
    'Hae henkivakuutuskorvaus': {
      kiireellinen: false,
      miksi: 'Henkivakuutuskorvaus ei tule automaattisesti — se pitää hakea erikseen. Voidaan hakea jo ennen perunkirjoitusta ja summa voi olla merkittävä.',
      miten: ['Selvitä oliko vainajalla henkivakuutus — tarkista vakuutuskirjoista tai kysy vakuutusyhtiöltä','Selvitä myös oliko vainajalla ryhmähenkivakuutus työnantajan kautta','Ota yhteyttä vakuutusyhtiöön ja pyydä korvaushakemuslomake','Korvaus maksetaan vakuutuksen edunsaajamääräyksen mukaan']
    },
    'Ilmoita työnantajalle ja taloyhtiölle': {
      kiireellinen: false,
      miksi: 'Työnantajalla voi olla maksamattomia palkkoja tai ryhmähenkivakuutus. Vuokrasopimus ei pääty automaattisesti — se täytyy irtisanoa erikseen.',
      miten: ['Soita tai kirjoita vainajan viimeiselle työnantajalle — kysy maksamattomista palkoista','Ilmoita taloyhtiön isännöitsijälle','Jos vainaja asui vuokralla: irtisano vuokrasopimus kirjallisesti — tähän tarvitaan kaikkien osakkaiden allekirjoitukset']
    },
    'Ohjaa posti uuteen osoitteeseen': {
      kiireellinen: false,
      miksi: 'Vainajalle tuleva posti paljastaa missä palveluissa hän oli asiakkaana — tästä on hyötyä kun aletaan kartoittamaan sopimuksia.',
      miten: ['Tee muuttoilmoitus osoitteessa muuttoilmoitus.fi tai Postin toimipisteessä','Ohjaa posti kuolinpesän hoitajan osoitteeseen','Ilmoita uusi osoite myös Verohallinnolle kirjallisesti — tähän tarvitaan kaikkien osakkaiden hyväksyntä']
    },
  }

  const ohje = ohjeet[tehtava.nimi]

  return (
    <div className="rounded transition-all"
      style={{backgroundColor: '#0F1E3C', border: `1px solid ${auki ? '#C9A84C' : tehtava.tehty ? '#C9A84C' : '#2D3E5C'}`}}>
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:opacity-80" onClick={() => setAuki(!auki)}>
        <div
          onClick={(e) => { e.stopPropagation(); onMerkitse() }}
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{backgroundColor: tehtava.tehty ? '#C9A84C' : 'transparent', border: `2px solid ${tehtava.tehty ? '#C9A84C' : '#4A5568'}`}}>
          {tehtava.tehty && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
        </div>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-medium" style={{color: tehtava.tehty ? '#C9A84C' : 'white', textDecoration: tehtava.tehty ? 'line-through' : 'none'}}>
            {tehtava.nimi}
          </span>
          {ohje?.kiireellinen && (
            <span className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: '#7C3333', color: '#FCA5A5'}}>⏰ Kiireellinen</span>
          )}
        </div>
        <span style={{color: '#C9A84C'}} className="text-xs">{auki ? '▲ Piilota' : '▼ Näytä ohjeet'}</span>
      </div>

      {auki && ohje && (
        <div className="px-4 pb-4 border-t" style={{borderColor: '#2D3E5C'}}>
          <div className="mt-4 mb-4">
            <p style={{color: '#A0AEC0'}} className="text-sm">{ohje.miksi}</p>
          </div>
          <div style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">Miten tehdään</div>
          <ul className="flex flex-col gap-2 mb-6">
            {ohje.miten.map((askel, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{color: 'white'}}>
                <span style={{color: '#C9A84C'}} className="flex-shrink-0">{i + 1}.</span>
                {askel}
              </li>
            ))}
          </ul>
          <div style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">💬 Kommentit tiimille</div>
          <textarea
            placeholder="Kirjoita kommentti tai muistiinpano tiimille..."
            className="w-full px-3 py-2 rounded text-sm text-white placeholder-gray-500 outline-none resize-none"
            style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}
            rows={2}
          />
        </div>
      )}
    </div>
  )
}

// ─── KUTSU JÄSEN ─────────────────────────────────────────────────────────────

function KutsuJasen({ kuolinpesaId }) {
  const [email, setEmail] = useState('')
  const [viesti, setViesti] = useState('')
  const [jasenet, setJasenet] = useState([])

  useEffect(() => {
    if (!kuolinpesaId) return
    const haeJasenet = async () => {
      const { data } = await supabase
        .from('jasenet')
        .select('*')
        .eq('kuolinpesa_id', kuolinpesaId)
      if (data) setJasenet(data)
    }
    haeJasenet()
  }, [kuolinpesaId])

  const kutsuJasen = async () => {
    if (!email) return
    const { error } = await supabase
      .from('jasenet')
      .insert({ kuolinpesa_id: kuolinpesaId, email: email, rooli: 'osakas' })
    if (error) {
      setViesti('Virhe: ' + error.message)
    } else {
      setViesti('Jäsen lisätty!')
      setJasenet([...jasenet, { email, rooli: 'osakas' }])
      setEmail('')
    }
  }

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input
          type="email"
          placeholder="sahkoposti@email.fi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded text-white placeholder-gray-500 outline-none"
          style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}
        />
        <button
          onClick={kutsuJasen}
          style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}
          className="px-6 py-3 font-bold rounded hover:opacity-90">
          Lisää →
        </button>
      </div>
      {viesti && <p className="text-sm mb-4" style={{color: '#C9A84C'}}>{viesti}</p>}
      {jasenet.length > 0 && (
        <div className="flex flex-col gap-2">
          {jasenet.map((j, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
              <span className="text-white text-sm">{j.email}</span>
              <span className="text-xs px-2 py-1 rounded" style={{backgroundColor: '#1B2A4A', color: '#C9A84C'}}>{j.rooli}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}