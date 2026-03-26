'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

const kategoriat = [
  {
    id: 'asuminen-liikenne', nimi: 'Asuminen ja liikenne', ikoni: '🏠',
    sopimukset: [
      { nimi: 'Sähkösopimus', miksi: 'Sähkösopimus ei pääty automaattisesti — sähköyhtiö ei saa tietoa kuolemasta muualta.', miten: ['Ota yhteyttä sähköyhtiön asiakaspalveluun puhelimitse tai sähköpostilla','Ilmoita vainajan nimi, osoite ja kuolinpäivä','Päätä irtisanotaanko sopimus vai siirretäänkö se jonkun osakkaan nimiin','Irtisanomiseen tarvitaan kaikkien osakkaiden valtakirja'] },
      { nimi: 'Vesisopimus', miksi: 'Koskee lähinnä omakotitaloja — kerrostaloissa vesi sisältyy yleensä yhtiövastikkeeseen.', miten: ['Tarkista onko vainajalla erillinen vesisopimus (löytyy laskuista)','Ota yhteyttä vesiyhtiöön ja ilmoita kuolemasta','Siirrä sopimus tai irtisano tarpeen mukaan'] },
      { nimi: 'Kaukolämpösopimus', miksi: 'Koskee kaukolämpöä käyttäviä kiinteistöjä. Sopimus ei pääty automaattisesti.', miten: ['Ota yhteyttä kaukolämpöyhtiöön','Ilmoita kuolemasta ja sovi sopimuksen jatkosta tai irtisanomisesta','Irtisanomiseen tarvitaan valtakirja kaikilta osakkailta'] },
      { nimi: 'Vuokrasopimus', miksi: 'Vuokrasopimus ei pääty automaattisesti — kuolinpesä vastaa vuokranmaksusta kunnes sopimus irtisanotaan.', miten: ['Irtisano vuokrasopimus kirjallisesti vuokranantajalle','Irtisanomiseen tarvitaan kaikkien osakkaiden allekirjoitukset','Irtisanomisaika on yleensä 1 kuukausi','Myös määräaikainen sopimus voidaan irtisanoa kuoleman perusteella'] },
      { nimi: 'Internet / laajakaista', miksi: 'Internet-sopimus jatkuu ja laskut tulevat kuukausittain kunnes irtisanotaan.', miten: ['Ota yhteyttä operaattorin asiakaspalveluun','Ilmoita kuolemasta — useimmat operaattorit irtisanovat sopimuksen kuolintodistuksella','Irtisanomisaika on yleensä 14-30 päivää'] },
      { nimi: 'Kaapeli-TV', miksi: 'Kaapeli-TV-sopimus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä palveluntarjoajaan (DNA, Elisa, Telia)','Ilmoita kuolemasta ja pyydä sopimuksen päättämistä','Tarvitset kuolintodistuksen'] },
      { nimi: 'Hälytyspalvelu / turvapuhelin', miksi: 'Usein ikäihmisillä on turvapuhelin tai kotihälytyspalvelu — laskutetaan kuukausittain.', miten: ['Ota yhteyttä palveluntarjoajaan','Ilmoita kuolemasta ja pyydä sopimuksen päättämistä','Palauta laitteet jos tarpeen'] },
      { nimi: 'Siivouspalvelu', miksi: 'Jos vainajalla oli säännöllinen siivouspalvelu, se jatkuu kunnes perutaan.', miten: ['Ota yhteyttä siivousyritykseen','Ilmoita kuolemasta ja peru tulevat käynnit'] },
      { nimi: 'Piha- tai lumityöpalvelu', miksi: 'Kausisopimukset jatkuvat automaattisesti ellei niitä irtisanota.', miten: ['Ota yhteyttä palveluntarjoajaan','Ilmoita kuolemasta ja peru sopimus'] },
      { nimi: 'Parkkipaikka / autohalli', miksi: 'Parkkipaikkasopimus jatkuu ja kuukausimaksu juoksee kunnes irtisanotaan.', miten: ['Ota yhteyttä parkkipaikan omistajaan tai taloyhtiöön','Irtisano sopimus kirjallisesti','Palauta mahdollinen avain tai kaukosäädin'] },
      { nimi: 'Säilytystila / varasto', miksi: 'Ulkoinen säilytystila laskutetaan kuukausittain — jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä palveluntarjoajaan','Tyhjennä tila ja irtisano sopimus','Palauta avain'] },
      { nimi: 'Autovakuutus (liikennevakuutus + kasko)', miksi: 'Traficom merkitsee kuolinpesän automaattisesti ajoneuvon omistajaksi. Vakuutukset jäävät voimaan mutta muutokset vaativat kaikkien osakkaiden suostumuksen.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä vakuutus voimassa kunnes ajoneuvo on myyty tai siirretty','Kun ajoneuvo myydään — vakuutus päättyy automaattisesti'] },
      { nimi: 'Moottoripyörän / veneen vakuutus', miksi: 'Sama periaate kuin autovakuutuksessa — vakuutus siirtyy kuolinpesän nimiin automaattisesti.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä voimassa kunnes omaisuus on myyty tai jaettu'] },
      { nimi: 'Autolaina / rahoitussopimus', miksi: 'Autolaina siirtyy kuolinpesälle — se pitää maksaa tai neuvotella uudelleen rahoitusyhtiön kanssa.', miten: ['Ota yhteyttä rahoitusyhtiöön','Selvitä lainan jäljellä oleva summa','Sovi jatkosta — maksetaanko laina pois vai siirretäänkö uudelle omistajalle'] },
      { nimi: 'Leasingsopimus', miksi: 'Leasingauto ei kuulu kuolinpesään — se on leasingyhtiön omaisuutta. Sopimus pitää irtisanoa erikseen.', miten: ['Ota yhteyttä leasingyhtiöön välittömästi','Palauta ajoneuvo sovitusti','Selvitä mahdolliset jäljellä olevat maksut'] },
      { nimi: 'Pysäköintikortti / aluekortti', miksi: 'Kuukausittain laskutettava pysäköintisopimus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä pysäköintiyhtiöön tai taloyhtiöön','Irtisano sopimus ja palauta kortti tai kaukosäädin'] },
      { nimi: 'Kotihoito', miksi: 'Säännölliset kotihoidon käynnit laskutetaan kunnes peruutetaan.', miten: ['Ota yhteyttä palveluntarjoajaan tai kotihoitoon','Peruuta tulevat käynnit','Palauta mahdolliset avaimet'] },
      { nimi: 'Ateriapalvelu', miksi: 'Ateriapalvelu toimittaa ruokaa säännöllisesti ja laskuttaa kuukausittain.', miten: ['Ota yhteyttä palveluntarjoajaan välittömästi','Peruuta tulevat toimitukset'] },
      { nimi: 'Taksikortti / Kela-taksi', miksi: 'Kela-taksi päättyy automaattisesti kun Kela saa tiedon — mutta ilmoitus kannattaa tehdä itse.', miten: ['Ilmoita Kelalle kuolemasta','Palauta mahdollinen taksikortti'] },
      { nimi: 'Autopesusopimus', miksi: 'Kuukausittain laskutettava autopesusopimus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä autopesuyrityksen asiakaspalveluun','Irtisano sopimus'] },
      { nimi: 'Lemmikin hoitopalvelu', miksi: 'Jos vainajalla oli lemmikki ja säännöllinen hoitopalvelu.', miten: ['Peruuta tulevat hoitoajat','Selvitä lemmikin jatkosta'] },
    ]
  },
  {
    id: 'vakuutukset', nimi: 'Vakuutukset', ikoni: '🛡️',
    sopimukset: [
      { nimi: 'Henkivakuutus', miksi: 'Henkivakuutuskorvaus ei tule automaattisesti — se pitää hakea erikseen. Mitään keskitettyä rekisteriä henkivakuutuksista ei ole.', miten: ['Etsi vakuutuskirjat vainajan papereiden joukosta','Ota yhteyttä vakuutusyhtiöön ja hae korvausta','Jos et tiedä missä yhtiössä vakuutus on — kysy kaikilta vakuutusyhtiöiltä','Korvaushakemus pitää tehdä yleensä vuoden sisällä kuolemasta'] },
      { nimi: 'Ryhmähenkivakuutus (työnantajan kautta)', miksi: 'Monilla palkansaajilla on työnantajan ottama ryhmähenkivakuutus — tätä ei aina tiedetä. Korvaus voi olla merkittävä.', miten: ['Kysy vainajan viimeiseltä työnantajalta','Tai tarkista Työntekijäin ryhmähenkivakuutuspoolista: tvk.fi'] },
      { nimi: 'Tapaturmavakuutus', miksi: 'Jos vainaja kuoli tapaturmaisesti tai vakuutuksessa on kuolemantapausturva, siitä voi saada korvausta.', miten: ['Tarkista vakuutuskirjoista onko tapaturmavakuutusta','Ota yhteyttä vakuutusyhtiöön','Hae korvaus vuoden sisällä'] },
      { nimi: 'Matkavakuutus (vuosivakuutus)', miksi: 'Vuosittain uusiutuva matkavakuutus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä vakuutusyhtiöön','Irtisano vakuutus'] },
      { nimi: 'Sairausvakuutus (yksityinen)', miksi: 'Yksityinen sairausvakuutus päättyy kuolinpäivänä automaattisesti — mutta vakuutusyhtiölle pitää silti ilmoittaa.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Selvitä onko avoinna olevia korvauksia joita voi vielä hakea'] },
      { nimi: 'Eläkevakuutus (vapaaehtoinen)', miksi: 'Vapaaehtoinen eläkesäästö kuuluu kuolinpesään ja voidaan nostaa — tai se voi sisältää kuolemanvaraturvan.', miten: ['Ota yhteyttä vakuutusyhtiöön','Selvitä onko kuolemanvaraturvaa tai nostomahdollisuus','Hae korvaus tai nosto'] },
      { nimi: 'Lainaturva', miksi: 'Jos vainajalla oli lainaturva lainassa, se voi kattaa lainan loppusumman kuoleman jälkeen.', miten: ['Tarkista onko lainassa lainaturva — kysy pankista','Ota yhteyttä vakuutusyhtiöön ja hae korvausta','Korvaus voi maksaa koko lainan jäljellä olevan summan'] },
      { nimi: 'Oikeusturvavakuutus', miksi: 'Oikeusturvavakuutus on usein liitetty kotivakuutukseen. Se voi kattaa kuolinpesän oikeudellisia kuluja.', miten: ['Tarkista kotivakuutuksesta onko oikeusturva mukana','Pidä voimassa perunkirjoitukseen asti'] },
      { nimi: 'Kotivakuutus', miksi: 'Kotivakuutus siirtyy automaattisesti kuolinpesän nimiin — pidä voimassa kunnes omaisuus on jaettu tai myyty.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Vakuutus jatkuu pesän nimissä — älä irtisano ennenaikaisesti','Irtisano vasta kun asunto on myyty tai jaettu'] },
      { nimi: 'Kiinteistövakuutus', miksi: 'Koskee omakotitaloa tai muuta kiinteistöä. Pidä voimassa kunnes kiinteistö on myyty.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä vakuutus voimassa kunnes kiinteistö on siirtynyt uudelle omistajalle','Irtisanomiseen tarvitaan kaikkien osakkaiden suostumus'] },
    ]
  },
  {
    id: 'tilaukset-media', nimi: 'Tilaukset ja media', ikoni: '📺',
    sopimukset: [
      { nimi: 'Puhelinliittymät', miksi: 'Puhelinliittymä ei pääty automaattisesti. Tarkista onko vainajalla useampia liittymiä. Kuolemantapauksessa myös määräaikainen liittymä voidaan irtisanoa.', miten: ['Ota yhteyttä operaattorin asiakaspalveluun puhelimitse tai myymälässä','Ilmoita vainajan nimi ja kuolinpäivä','Pyydä listaus kaikista liittymistä saman asiakkaan nimissä','Irtisano kaikki liittymät'] },
      { nimi: 'Lehtitilaukset', miksi: 'Sanomalehdet jatkuvat kunnes irtisanotaan. Käännetty posti paljastaa usein mitkä lehdet vainajalla oli.', miten: ['Ota yhteyttä kustantajaan puhelimitse tai verkkosivujen kautta','Ilmoita kuolemasta ja pyydä tilauksen päättämistä'] },
      { nimi: 'Aikakauslehdet', miksi: 'Vuositilaukset uusiutuvat automaattisesti ellei niitä irtisanota.', miten: ['Ota yhteyttä kustantajaan','Irtisano tilaus'] },
      { nimi: 'Netflix', miksi: 'Kuukausittain laskutettava tilaus jatkuu kunnes peruutetaan.', miten: ['Kirjaudu Netflix-tilille jos tiedät salasanan ja peruuta tilaus asetuksista','Jos salasana ei ole tiedossa — kuoleta luottokortti jolla Netflix laskutetaan'] },
      { nimi: 'Spotify / Apple Music', miksi: 'Kuukausittain laskutettava musiikkipalvelu.', miten: ['Kirjaudu tilille ja peruuta tilaus','Jos salasana ei ole tiedossa — kuoleta luottokortti'] },
      { nimi: 'Disney+ / C More / Viaplay / Elisa Viihde', miksi: 'Striimipalvelut laskutetaan kuukausittain.', miten: ['Kirjaudu tilille ja peruuta tilaus','Jos Elisa Viihde — palauta digiboksi Elisalle','Jos salasana ei ole tiedossa — kuoleta luottokortti'] },
      { nimi: 'Kirjakerho / kirjatilaus', miksi: 'Kirjakerhot lähettävät kirjoja automaattisesti ja laskuttavat säännöllisesti.', miten: ['Ota yhteyttä kirjakerhoon','Irtisano jäsenyys'] },
      { nimi: 'Äänikirjapalvelu (Storytel, BookBeat)', miksi: 'Kuukausittain laskutettava tilaus.', miten: ['Kirjaudu tilille ja peruuta tilaus','Jos salasana ei ole tiedossa — kuoleta luottokortti'] },
    ]
  },
  {
    id: 'jasenydet', nimi: 'Jäsenyydet', ikoni: '🤝',
    sopimukset: [
      { nimi: 'Ammattiliitto', miksi: 'Ammattiliiton jäsenmaksu laskutetaan kuukausittain tai vuosittain. Liitolla voi olla myös kuolemanvaraturva.', miten: ['Ota yhteyttä ammattiliiton jäsenpalveluun','Ilmoita kuolemasta ja pyydä jäsenyyden päättämistä','Selvitä onko liitolla kuolemanvaraturvaa tai muita etuuksia'] },
      { nimi: 'Työttömyyskassa', miksi: 'Työttömyyskassan jäsenyys päättyy kuolemaan mutta ilmoitus pitää tehdä.', miten: ['Ilmoita kuolemasta kassalle','Selvitä onko avoinna olevia korvauksia'] },
      { nimi: 'Urheiluseura / harrastusseura', miksi: 'Vuosittaiset jäsenmaksut uusiutuvat automaattisesti.', miten: ['Ota yhteyttä seuran sihteeriin tai hallitukseen','Ilmoita kuolemasta ja pyydä jäsenyyden päättämistä'] },
      { nimi: 'SPR / Lions / Rotary / muu järjestö', miksi: 'Järjestöjen jäsenmaksut laskutetaan vuosittain.', miten: ['Ota yhteyttä järjestön paikallisosastoon','Ilmoita kuolemasta'] },
      { nimi: 'Eläkeläisjärjestö', miksi: 'Eläkeläisjärjestöjen jäsenmaksut laskutetaan vuosittain.', miten: ['Ota yhteyttä järjestöön','Ilmoita kuolemasta'] },
      { nimi: 'Kuntosalijäsenyys', miksi: 'Kuntosalijäsenyys laskutetaan kuukausittain — ei pääty automaattisesti.', miten: ['Ota yhteyttä kuntosalin asiakaspalveluun','Ilmoita kuolemasta ja pyydä sopimuksen päättämistä','Palauta mahdollinen avainkortti tai kulkukortti'] },
      { nimi: 'Uimahalli / liikuntakeskus', miksi: 'Kausi- tai kuukausijäsenyys jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä palveluntarjoajaan','Irtisano jäsenyys ja palauta kortti'] },
      { nimi: 'Jumppatunnit / ryhmäliikunta', miksi: 'Säännölliset jumppatunnit tai sarjakortit.', miten: ['Ota yhteyttä ohjaajaan tai palveluntarjoajaan','Selvitä onko käyttämättömiä tunteja joista voi saada hyvitystä'] },
      { nimi: 'Hierontapalvelu', miksi: 'Säännölliset hieronta-ajat tai sarjakortit.', miten: ['Peruuta tulevat ajat','Kysy hyvitystä käyttämättömistä sarjakortin kerroista'] },
      { nimi: 'Yksityislääkärisopimus', miksi: 'Jatkuva sopimus yksityislääkäripalveluista.', miten: ['Ota yhteyttä palveluntarjoajaan','Irtisano sopimus'] },
      { nimi: 'Hammaslääkärisopimus', miksi: 'Jatkuva sopimus hammashoitopalveluista tai hammasvakuutus.', miten: ['Ota yhteyttä hammaslääkärille tai palveluntarjoajaan','Irtisano sopimus tai vakuutus'] },
    ]
  },
  {
    id: 'digitaaliset', nimi: 'Digitaaliset tilit', ikoni: '💻',
    sopimukset: [
      { nimi: 'Sähköpostitilit (Gmail, Outlook)', miksi: 'Sähköpostitilit jäävät auki kunnes suljetaan — ne voivat sisältää tärkeitä viestejä.', miten: ['Kirjaudu tilille jos salasana on tiedossa — tallenna tärkeät viestit','Gmail: pyydä tilin sulkemista Googlen kautta kuolintodistuksella','Outlook: ota yhteyttä Microsoftiin'] },
      { nimi: 'Facebook', miksi: 'Facebook-tili voidaan muuttaa muistotilaksi tai poistaa kokonaan.', miten: ['Mene Facebookin erikoispyyntölomakkeelle','Valitse muutako tili muistotilaksi vai poistetaanko se','Tarvitset kuolintodistuksen'] },
      { nimi: 'Instagram', miksi: 'Instagram-tili voidaan muuttaa muistotilaksi tai poistaa.', miten: ['Täytä Instagramin erikoispyyntölomake','Tarvitset kuolintodistuksen'] },
      { nimi: 'X (Twitter)', miksi: 'X-tili jää auki kunnes se suljetaan tai poistetaan.', miten: ['Kirjaudu tilille jos salasana on tiedossa ja poista tili','Tai ota yhteyttä X:n asiakaspalveluun kuolintodistuksella'] },
      { nimi: 'LinkedIn', miksi: 'LinkedIn-profiili jää näkyviin kunnes se poistetaan.', miten: ['Ota yhteyttä LinkedInin asiakaspalveluun','Pyydä profiilin poistamista kuolintodistuksella'] },
      { nimi: 'Pilvipalvelut (iCloud, Google Drive, Dropbox)', miksi: 'Pilvipalveluissa voi olla tärkeitä dokumentteja ja valokuvia — maksulliset tilat laskutetaan kuukausittain.', miten: ['Tallenna tärkeät tiedostot ennen tilin sulkemista','Sulje maksutilit','iCloud vaatii Apple ID:n — ota yhteyttä Appleen'] },
      { nimi: 'Apple ID / iTunes', miksi: 'Apple ID:hen liittyvät tilaukset jatkuvat kunnes peruutetaan.', miten: ['Ota yhteyttä Applen asiakaspalveluun kuolintodistuksella','Pyydä tilin sulkemista ja tilausten peruuttamista'] },
      { nimi: 'Microsoft-tili', miksi: 'Microsoft 365 ja muut tilaukset laskutetaan kuukausittain.', miten: ['Ota yhteyttä Microsoftin asiakaspalveluun','Pyydä tilin sulkemista'] },
      { nimi: 'Verkkokauppojen tilit (Amazon, Zalando)', miksi: 'Verkkokauppojen tilit voivat sisältää tallennettuja maksukortteja ja automaattisia tilauksia.', miten: ['Kirjaudu tilille jos salasana on tiedossa','Peruuta automaattiset tilaukset','Poista maksukorttitiedot'] },
      { nimi: 'Wolt+ / ruoan kotiinkuljetus', miksi: 'Kuukausittain laskutettava tilaus jatkuu kunnes peruutetaan.', miten: ['Kirjaudu tilille ja peruuta tilaus','Jos salasana ei ole tiedossa — kuoleta luottokortti'] },
    ]
  }
]

const varatJaVelatMuistilista = {
  varat: [
    { id: 'pankkitilit', teksti: 'Pankkitilit', ohje: 'Pyydä pankista täydellinen tililistaus. Tarkista kaikki pankit joissa vainaja saattoi olla asiakkaana.', esimerkki: 'Esim. OP-tili, Nordea säästötili' },
    { id: 'kateinen', teksti: 'Käteinen kotona', ohje: 'Tarkista kodin yleisimmät piilopaikat — lipasto, kaappi, kassakirja.', esimerkki: 'Esim: käteistä löytyi lipastosta' },
    { id: 'sijoitukset', teksti: 'Sijoitukset (osakkeet, rahastot)', ohje: 'Tarkista OmaVero ja pankin verkkopankki. Sijoitukset näkyvät myös verottajan tiedoissa.', esimerkki: 'Esim: Nordnet-tili, OP-rahasto' },
    { id: 'asunnot', teksti: 'Asunto-osakkeet ja kiinteistöt', ohje: 'Tarkista lainhuutotodistus maanmittauslaitokselta. Asunto-osakkeet näkyvät isännöitsijäntodistuksessa.', esimerkki: 'Esim: 2h+k Helsinki Kallio, As Oy Kallionkatu' },
    { id: 'ajoneuvot', teksti: 'Ajoneuvot (auto, mopo, vene, mönkijä)', ohje: 'Tarkista Traficomin ajoneuvorekisteri. Kaikki vainajan nimissä olevat ajoneuvot siirtyvät kuolinpesälle.', esimerkki: 'Esim: Toyota Corolla 2015' },
    { id: 'metsa', teksti: 'Metsätilat', ohje: 'Tarkista maanmittauslaitoksen kiinteistörekisteri. Metsätilat ovat usein unohdettua omaisuutta.', esimerkki: 'Esim: metsätila Kuopiossa' },
    { id: 'mokki', teksti: 'Kesämökki tai vapaa-ajan kiinteistö', ohje: 'Tarkista maanmittauslaitoksen lainhuutotodistus.', esimerkki: 'Esim: mökki Savonlinnassa' },
    { id: 'tallelokero', teksti: 'Tallelokero pankissa', ohje: 'Kysy kaikilta pankeilta onko vainajalla tallelokeroa. Tallelokero vaatii avaamista pesänselvittäjän läsnäollessa.', esimerkki: 'Esim: tallelokero OP Helsingin konttorissa' },
    { id: 'krypto', teksti: 'Kryptovaluutat', ohje: 'Tarkista vainajan tietokoneen lompakkosovellukset ja sähköpostit kryptopörssien vahvistuksista.', esimerkki: 'Esim: Bitcoin Coinbase-lompakossa' },
    { id: 'osuuskunnat', teksti: 'Osuuskunnat (S-osuus, OP-osuus, HOK)', ohje: 'Osuuskunnan jäsenyys näkyy jäsenkirjeistä tai kysymällä suoraan osuuskunnalta.', esimerkki: 'Esim: S-osuus, OP-osuudet' },
    { id: 'elakesaastot', teksti: 'Eläkesäästöt ja kapitalisaatiosopimukset', ohje: 'Kysy vakuutusyhtiöiltä onko vainajalla vapaaehtoista eläkesäästämistä.', esimerkki: 'Esim: vapaaehtoinen eläkevakuutus LähiTapiolassa' },
    { id: 'veronpalautus', teksti: 'Veronpalautukset', ohje: 'Tarkista OmaVero.fi — avoinna olevat veronpalautukset kuuluvat kuolinpesälle.', esimerkki: 'Esim: veronpalautus OmaVerossa' },
    { id: 'lomarahat', teksti: 'Ansaitsemattomat lomarahat', ohje: 'Kysy viimeiseltä työnantajalta onko maksamattomia palkkoja tai lomarahoja.', esimerkki: 'Esim: maksamattomat lomarahat työnantajalta' },
    { id: 'vakuutuskorvaukset', teksti: 'Keskeneräiset vakuutuskorvaukset', ohje: 'Tarkista onko vainajalla vireillä olevia vakuutuskorvauksia joita ei ole vielä maksettu.', esimerkki: 'Esim: vireillä oleva korvaus If vakuutukselta' },
    { id: 'arvoesineet', teksti: 'Arvoesineet (korut, taide, antiikki)', ohje: 'Arvoesineet pitää arvioida perunkirjoitusta varten. Ota yhteyttä arvioijaan.', esimerkki: 'Esim: kultakello, öljymaalaus' },
  ],
  velat: [
    { id: 'asuntolaina', teksti: 'Asuntolaina', ohje: 'Kysy pankista lainan jäljellä oleva saldo. Tarkista onko lainassa lainaturva.', esimerkki: 'Esim: asuntolaina OP:ssa' },
    { id: 'kulutusluotot', teksti: 'Kulutusluotot ja pikavipit', ohje: 'Tarkista positiivirekisteri.fi — siellä näkyvät kaikki vainajan luotot.', esimerkki: 'Esim: Ferratum-luotto, Visa-luottokortti' },
    { id: 'autolaina', teksti: 'Autolaina / rahoitussopimus', ohje: 'Kysy rahoitusyhtiöltä lainan jäljellä oleva saldo.', esimerkki: 'Esim: Toyota Financial Services rahoitus' },
    { id: 'opintolaina', teksti: 'Opintolaina', ohje: 'Tarkista Kelasta onko opintolainaa jäljellä.', esimerkki: 'Esim: opintolaina Kelasta' },
    { id: 'osamaksut', teksti: 'Osamaksusopimukset (puhelin, kodinkone)', ohje: 'Tarkista laskut ja sopimukset — osamaksut jatkuvat kunnes ne maksetaan pois.', esimerkki: 'Esim: iPhone osamaksu Elisalta' },
    { id: 'takaukset', teksti: 'Takaukset toisten lainoille', ohje: 'Takaukset siirtyvät kuolinpesälle. Kysy pankista onko vainaja taannut jonkun toisen lainaa.', esimerkki: 'Esim: taannut pojan asuntolainan OP:ssa' },
    { id: 'maksamattomat', teksti: 'Maksamattomat laskut', ohje: 'Tarkista vainajan posti ja sähköposti. Maksamattomat laskut ovat kuolinpesän velkoja.', esimerkki: 'Esim: maksamaton sähkölasku, lääkärilasku' },
    { id: 'verorästit', teksti: 'Verorästit', ohje: 'Tarkista OmaVero.fi — avoinna olevat verot ovat kuolinpesän velkoja.', esimerkki: 'Esim: verorästit OmaVerossa' },
  ]
}

export default function Dashboard() {
  const router = useRouter()
  const [aktiivinenVaihe, setAktiivinenVaihe] = useState(1)
  const [aktiivinenAlivaihe, setAktiivinenAlivaihe] = useState(1)
  const [kuolinpesa, setKuolinpesa] = useState(null)
  const [tehtavaLista, setTehtavaLista] = useState([])
  const [esiTarkistukset, setEsiTarkistukset] = useState({ hautajaiset: false, kuolintodistus: false, laheiset: false })
  const [ladataan, setLadataan] = useState(true)
  const [selvitysHoidettu, setSelvitysHoidettu] = useState(0)
 const [avattuTehtava, setAvattuTehtava] = useState(null)
 const [avattuKohta, setAvattuKohta] = useState(null)
 const [avattuSopimus, setAvattuSopimus] = useState(null)
  const [varatRastitattu, setVaratRastitattu] = useState({})
  const [varatVelatTeksti, setVaratVelatTeksti] = useState('')
  const [varatKirjaukset, setVaratKirjaukset] = useState({})
  const [vahvistetutKirjaukset, setVahvistetutKirjaukset] = useState({})
  const [sopimusTilat, setSopimusTilat] = useState({})
  const [dropdownAuki, setDropdownAuki] = useState(false)
  const selvitysKaikki = kategoriat.reduce((sum, k) => sum + k.sopimukset.length, 0)
  const kaikkiEsiTarkistuksetTehty = Object.values(esiTarkistukset).every(v => v === true)

  const vaiheet = [
    { numero: 1, nimi: 'Ensitoimet' },
    { numero: 2, nimi: 'Omaisuuden selvitys' },
    { numero: 3, nimi: 'Perunkirjoitus' },
    { numero: 4, nimi: 'Hoito ja toimeenpano' },
    { numero: 5, nimi: 'Päätös' },
  ]

  const alivaiheet = [
    { numero: 1, nimi: 'Varat ja velat' },
    { numero: 2, nimi: 'Sopimukset' },
    { numero: 3, nimi: 'Yhteenveto' },
  ]

  const oletusTehtavat = [
    { nimi: 'Tilaa virkatodistus', vaihe: 1 },
    { nimi: 'Selvitä onko testamentti', vaihe: 1 },
    { nimi: 'Ilmoita pankeille', vaihe: 1 },
    { nimi: 'Ilmoita Kelalle', vaihe: 1 },
    { nimi: 'Ilmoita työnantajalle ja taloyhtiölle', vaihe: 1 },
    { nimi: 'Ohjaa posti uuteen osoitteeseen', vaihe: 1 },
    { nimi: 'Hae henkivakuutuskorvaus', vaihe: 1 },
  ]

  useEffect(() => {
    const tallennettuVaihe = localStorage.getItem('aktiivinenVaihe')
    const tallennettuAlivaihe = localStorage.getItem('aktiivinenAlivaihe')
    if (tallennettuVaihe) setAktiivinenVaihe(parseInt(tallennettuVaihe))
    if (tallennettuAlivaihe) setAktiivinenAlivaihe(parseInt(tallennettuAlivaihe))
  }, [])
useEffect(() => {
  const suljeDropdown = (e) => {
    if (!e.target.closest('[data-dropdown]')) setDropdownAuki(false)
  }
  document.addEventListener('mousedown', suljeDropdown)
  return () => document.removeEventListener('mousedown', suljeDropdown)
}, [])
  useEffect(() => {
    const haeData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/kirjaudu'); setLadataan(false); return }
      const { data: pesaData } = await supabase.from('kuolinpesat').select('*').eq('kayttaja_email', user.email).order('created_at', { ascending: false }).limit(1).single()
      if (pesaData) {
        setKuolinpesa(pesaData)
        if (pesaData.esi_tarkistukset) setEsiTarkistukset(pesaData.esi_tarkistukset)
        if (pesaData.varat_velat_teksti) setVaratVelatTeksti(pesaData.varat_velat_teksti)
        if (pesaData.varat_rastitattu) setVaratRastitattu(pesaData.varat_rastitattu)
        if (pesaData.varat_kirjaukset) setVaratKirjaukset(pesaData.varat_kirjaukset)
        if (pesaData.varat_vahvistetut) setVahvistetutKirjaukset(pesaData.varat_vahvistetut)
        if (pesaData.sopimus_tilat) setSopimusTilat(pesaData.sopimus_tilat)
        setLadataan(false)
        const { data: tehtavatData } = await supabase.from('tehtavat').select('*').eq('kuolinpesa_id', pesaData.id).order('created_at', { ascending: true })
        if (tehtavatData && tehtavatData.length > 0) {
          setTehtavaLista(tehtavatData)
        } else {
          const uudetTehtavat = oletusTehtavat.map(t => ({ ...t, tehty: false, kuolinpesa_id: pesaData.id }))
          const { data: luodut } = await supabase.from('tehtavat').insert(uudetTehtavat).select()
          if (luodut) setTehtavaLista(luodut)
        }
      }
    }
    haeData()
  }, [])

  const paivitaEsiTarkistus = async (kentta) => {
    const uudet = { ...esiTarkistukset, [kentta]: !esiTarkistukset[kentta] }
    setEsiTarkistukset(uudet)
    if (kuolinpesa) await supabase.from('kuolinpesat').update({ esi_tarkistukset: uudet }).eq('id', kuolinpesa.id)
  }

  const merkitseTehdyksi = async (id, nykyinenTila) => {
    const { data: { user } } = await supabase.auth.getUser()
    const tehtava = tehtavaLista.find(t => t.id === id)
    const { data } = await supabase.from('tehtavat').update({ tehty: !nykyinenTila }).eq('id', id).select().single()
    if (data) {
      setTehtavaLista(tehtavaLista.map(t => t.id === id ? data : t))
      // Kirjaa tapahtuma
      await supabase.from('tapahtumat').insert({
        kuolinpesa_id: kuolinpesa.id,
        teksti: `${!nykyinenTila ? 'Merkitsi hoidetuksi' : 'Poisti merkinnän'}: ${tehtava?.nimi}`,
        kirjoittaja_email: user?.email
      })
    }
  }

 const tallennaSopimusTila = async (nimi, uusiTila) => {
  const vanhaTila = sopimusTilat[nimi]
  const uudet = { ...sopimusTilat }
  if (vanhaTila === uusiTila) delete uudet[nimi]
  else uudet[nimi] = uusiTila
  setSopimusTilat(uudet)
  if (kuolinpesa?.id) await supabase.from('kuolinpesat').update({ sopimus_tilat: uudet }).eq('id', kuolinpesa.id)
}

 const toggleVaraRasti = async (id, arvo) => {
  const uudet = { ...varatRastitattu, [id]: varatRastitattu[id] === arvo ? null : arvo }
  setVaratRastitattu(uudet)
  const pesaId = kuolinpesa?.id
  console.log('Tallennetaan:', pesaId, uudet)
  if (pesaId) await supabase.from('kuolinpesat').update({ varat_rastitattu: uudet }).eq('id', pesaId)
}
const tallennaKirjaus = async (id, arvo) => {
  const uudet = { ...varatKirjaukset, [id]: arvo }
  setVaratKirjaukset(uudet)
  if (kuolinpesa?.id) await supabase.from('kuolinpesat').update({ varat_kirjaukset: uudet }).eq('id', kuolinpesa.id)
}


const tallennaVahvistettu = async (id) => {
  const uudet = { ...vahvistetutKirjaukset, [id]: [...(vahvistetutKirjaukset[id] || []), varatKirjaukset[id]] }
  setVahvistetutKirjaukset(uudet)
  setVaratKirjaukset(prev => ({...prev, [id]: ''}))
  if (kuolinpesa?.id) await supabase.from('kuolinpesat').update({ varat_vahvistetut: uudet }).eq('id', kuolinpesa.id)
}
const poistaVahvistettu = async (id, index) => {
  const lista = Array.isArray(vahvistetutKirjaukset[id]) ? vahvistetutKirjaukset[id] : [vahvistetutKirjaukset[id]]
  const uudet = { ...vahvistetutKirjaukset, [id]: lista.filter((_, i) => i !== index) }
  setVahvistetutKirjaukset(uudet)
  if (kuolinpesa?.id) await supabase.from('kuolinpesat').update({ varat_vahvistetut: uudet }).eq('id', kuolinpesa.id)
}
  const tallennaTeksti = async (teksti) => {
    setVaratVelatTeksti(teksti)
    if (kuolinpesa) await supabase.from('kuolinpesat').update({ varat_velat_teksti: teksti }).eq('id', kuolinpesa.id)
  }

  const jarjestys = ['Tilaa virkatodistus', 'Ilmoita pankeille', 'Ilmoita Kelalle', 'Ilmoita työnantajalle ja taloyhtiölle', 'Ohjaa posti uuteen osoitteeseen', 'Hae henkivakuutuskorvaus']
  const nykyisetTehtavat = tehtavaLista
    .filter(t => t.vaihe === aktiivinenVaihe)
    .sort((a, b) => jarjestys.indexOf(a.nimi) - jarjestys.indexOf(b.nimi))
  const valmiit = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe && t.tehty).length
  const kaikki = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe).length

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0F1E3C'}}>
    <nav style={{borderBottom: '1px solid #C9A84C'}} className="px-8 py-4 flex items-center justify-between">
  <div className="flex items-center gap-6">
    <div onClick={() => router.push('/')} style={{color: '#C9A84C', cursor: 'pointer'}} className="text-xl font-bold tracking-widest uppercase">Pesänhoitaja</div>
    
  </div>

  {/* Avatar dropdown */}
  <div style={{position: 'relative'}}>
    <div
      onClick={() => setDropdownAuki(prev => !prev)}
      style={{width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 'bold', color: '#0F1E3C', cursor: 'pointer', border: '2px solid #C9A84C', userSelect: 'none', fontFamily: 'Georgia, serif'}}>
      {(kuolinpesa?.kayttaja_nimi || kuolinpesa?.kayttaja_email || 'K')[0].toUpperCase()}
    </div>

    {dropdownAuki && (
      <div style={{position: 'absolute', right: 0, top: '48px', backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C', borderRadius: '10px', width: '240px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 100}}>
        <div style={{padding: '14px 16px', borderBottom: '1px solid #2D3E5C'}}>
          <div style={{color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '2px'}}>{kuolinpesa?.kayttaja_nimi || ''}</div>
          <div style={{color: '#4A5568', fontSize: '12px'}}>{kuolinpesa?.kayttaja_email || ''}</div>
        </div>
        <div
          onClick={() => { setDropdownAuki(false); router.push('/dashboard') }}
          style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', cursor: 'pointer', borderBottom: '1px solid #152238'}}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.08)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <span style={{color: '#A0AEC0', fontSize: '13px', fontFamily: 'Georgia, serif'}}>Dashboard</span>
        </div>
        <div
          onClick={async () => { setDropdownAuki(false); await supabase.auth.signOut(); router.push('/') }}
          style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', cursor: 'pointer', borderTop: '1px solid #2D3E5C'}}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(252,129,129,0.06)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FC8181" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span style={{color: '#FC8181', fontSize: '13px', fontFamily: 'Georgia, serif'}}>Kirjaudu ulos</span>
        </div>
      </div>
    )}
  </div>
</nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2">— Kuolinpesä —</div>
          <h1 className="text-white text-3xl font-bold">{kuolinpesa?.vainajan_nimi || ''}</h1>
          <p style={{color: '#A0AEC0'}} className="text-sm mt-1">{kuolinpesa?.kuolinpaiva ? `Kuolinpäivä: ${kuolinpesa.kuolinpaiva}` : 'Kuolinpesän hallinta'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Vasen pääsisältö */}
          <div className="flex-1 min-w-0">

            {!ladataan && !kaikkiEsiTarkistuksetTehty && (
              <div className="mb-8 p-6 rounded-lg" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
                <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2">— Ennen kuin aloitat —</div>
                <h2 className="text-white font-bold text-lg mb-2">Oletko hoitanut nämä?</h2>
                <p style={{color: '#A0AEC0'}} className="text-sm mb-6">Nämä asiat hoidetaan yleensä ensimmäisten päivien aikana. Ruksaa ne jos ne on jo hoidettu.</p>
                <div className="flex flex-col gap-3">
                  {[
                    { kentta: 'hautajaiset', teksti: 'Hautajaiset on järjestetty', kuvaus: 'Hautaustoimisto tai seurakunta on yleensä auttanut tässä.' },
                    { kentta: 'kuolintodistus', teksti: 'Kuolintodistus on hankittu', kuvaus: 'Sairaala tai lääkäri on laatinut sen automaattisesti. Muista hankkia useampi kopio.' },
                    { kentta: 'laheiset', teksti: 'Läheiset ja sukulaiset on ilmoitettu', kuvaus: 'Tämä on henkilökohtainen asia jonka jokainen hoitaa omalla tavallaan.' },
                  ].map(({ kentta, teksti, kuvaus }) => (
                    <div key={kentta} onClick={() => paivitaEsiTarkistus(kentta)} className="flex items-start gap-4 p-4 rounded cursor-pointer hover:opacity-80" style={{backgroundColor: '#0F1E3C', border: `1px solid ${esiTarkistukset[kentta] ? '#C9A84C' : '#2D3E5C'}`}}>
                      <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-1" style={{backgroundColor: esiTarkistukset[kentta] ? '#C9A84C' : 'transparent', border: `2px solid ${esiTarkistukset[kentta] ? '#C9A84C' : '#4A5568'}`}}>
                        {esiTarkistukset[kentta] && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{teksti}</p>
                        <p style={{color: '#A0AEC0'}} className="text-xs mt-1">{kuvaus}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{color: '#4A5568'}} className="text-xs mt-6 text-center">Suorita ensin yllä olevat kohdat jatkaaksesi</p>
              </div>
            )}

            <div className="mb-10 p-6 rounded-lg transition-all" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C', opacity: kaikkiEsiTarkistuksetTehty ? 1 : 0.3, pointerEvents: kaikkiEsiTarkistuksetTehty ? 'auto' : 'none'}}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold">Edistyminen</span>
                <span style={{color: '#C9A84C'}} className="text-sm font-bold">
                  {aktiivinenVaihe === 2 ? `${selvitysHoidettu}/${selvitysKaikki} hoidettu` : `${valmiit}/${kaikki} tehtävää`}
                </span>
              </div>
              <div className="w-full rounded-full h-2" style={{backgroundColor: '#0F1E3C'}}>
                <div className="h-2 rounded-full transition-all" style={{backgroundColor: '#C9A84C', width: aktiivinenVaihe === 2 ? `${(selvitysHoidettu/selvitysKaikki)*100}%` : kaikki > 0 ? `${(valmiit/kaikki)*100}%` : '0%'}} />
              </div>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto transition-all" style={{opacity: kaikkiEsiTarkistuksetTehty ? 1 : 0.3, pointerEvents: kaikkiEsiTarkistuksetTehty ? 'auto' : 'none'}}>
              {vaiheet.map(v => (
                <button key={v.numero} onClick={() => { setAktiivinenVaihe(v.numero); localStorage.setItem('aktiivinenVaihe', v.numero) }} className="flex-1 py-3 px-4 rounded text-sm font-bold whitespace-nowrap"
                  style={{backgroundColor: aktiivinenVaihe === v.numero ? '#C9A84C' : '#1B2A4A', color: aktiivinenVaihe === v.numero ? '#0F1E3C' : '#A0AEC0', border: '1px solid', borderColor: aktiivinenVaihe === v.numero ? '#C9A84C' : '#2D3E5C'}}>
                  {v.numero}. {v.nimi}
                </button>
              ))}
            </div>

            <div className="rounded-lg p-6 transition-all" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C', opacity: kaikkiEsiTarkistuksetTehty ? 1 : 0.3, pointerEvents: kaikkiEsiTarkistuksetTehty ? 'auto' : 'none'}}>
  <h2 className="text-white font-bold text-lg mb-6">Vaihe {aktiivinenVaihe}: {vaiheet[aktiivinenVaihe-1].nimi}</h2>

  {aktiivinenVaihe === 1 && (
  <>
    <div className="flex gap-6">
      <div className="flex flex-col gap-3 flex-1">
        {nykyisetTehtavat.map(tehtava => (
          <TehtavaKortti
            key={tehtava.id}
            tehtava={tehtava}
            onMerkitse={() => merkitseTehdyksi(tehtava.id, tehtava.tehty)}
            avattuTehtava={avattuTehtava}
            setAvattuTehtava={setAvattuTehtava}
          />
        ))}
      </div>
      {aktiivinenVaihe === 1 && (
  <div className="lg:w-80 flex-shrink-0" style={{position: 'sticky', top: '20px', alignSelf: 'flex-start'}}>
    {avattuTehtava ? (
      <TehtavaPaneeli
        tehtava={nykyisetTehtavat.find(t => t.id === avattuTehtava)}
        kuolinpesaId={kuolinpesa?.id}
        kayttajaEmail={kuolinpesa?.kayttaja_email}
        kayttajaNimi={kuolinpesa?.kayttaja_nimi}
        onSulje={() => setAvattuTehtava(null)}
      />
    ) : (
      <div className="rounded-lg p-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
        <h3 className="text-white font-bold text-base mb-3">Näin Ensitoimet toimii</h3>
        <p style={{color: '#A0AEC0'}} className="text-sm mb-4">Käy tehtävät läpi järjestyksessä ylhäältä alas. Virkatodistuksen tilaaminen on kiireellisin — toimituksessa kestää viikkoja.</p>
        <p style={{color: '#A0AEC0'}} className="text-sm mb-4">Klikkaa tehtävää nähdäksesi tarkemmat ohjeet ja jättääksesi kommentin tiimille.</p>
        <p style={{color: '#A0AEC0'}} className="text-sm">Kun olet hoitanut tehtävän, rastita se valmiiksi klikkaamalla ruutua tehtävän vasemmassa reunassa. Voit siirtyä seuraavaan vaiheeseen alapuolella olevasta painikkeesta kun olet valmis.</p>
      </div>
    )}
  </div>
)}
  
    </div>
    <button className="w-full py-4 rounded font-bold text-lg mt-6" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} onClick={() => { setAktiivinenVaihe(2); localStorage.setItem('aktiivinenVaihe', 2) }}>
      Siirry omaisuuden selvitykseen →
    </button>
  </>
)}

{aktiivinenVaihe === 2 && (
  <>
    <div className="flex gap-2 mb-6">
      {alivaiheet.map(a => (
        <button key={a.numero} onClick={() => { setAktiivinenAlivaihe(a.numero); localStorage.setItem('aktiivinenAlivaihe', a.numero) }} className="flex-1 py-2 px-4 rounded text-sm font-bold"
          style={{backgroundColor: aktiivinenAlivaihe === a.numero ? '#C9A84C' : '#0F1E3C', color: aktiivinenAlivaihe === a.numero ? '#0F1E3C' : '#A0AEC0', border: '1px solid', borderColor: aktiivinenAlivaihe === a.numero ? '#C9A84C' : '#2D3E5C'}}>
          {a.numero}. {a.nimi}
        </button>
      ))}
    </div>
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        {aktiivinenAlivaihe === 1 && <VaratJaVelat rastitattu={varatRastitattu} onToggle={toggleVaraRasti} kirjaukset={varatKirjaukset} onKirjaus={tallennaKirjaus} vahvistetut={vahvistetutKirjaukset} onVahvista={tallennaVahvistettu} avattuKohta={avattuKohta} setAvattuKohta={setAvattuKohta} />}
        {aktiivinenAlivaihe === 2 && <SelvitysOsio onValmis={() => { setAktiivinenAlivaihe(3); localStorage.setItem('aktiivinenAlivaihe', 3) }} onEdistyminen={setSelvitysHoidettu} avattuSopimus={avattuSopimus} setAvattuSopimus={setAvattuSopimus} sopimusTilat={sopimusTilat} tallennaSopimusTila={tallennaSopimusTila} />}
        {aktiivinenAlivaihe === 3 && <Yhteenveto varatRastitattu={varatRastitattu} vahvistetutKirjaukset={vahvistetutKirjaukset} sopimusTilat={sopimusTilat} tallennaSopimusTila={tallennaSopimusTila} onValmis={() => { setAktiivinenVaihe(3); localStorage.setItem('aktiivinenVaihe', 3) }} />}
      </div>
       {aktiivinenAlivaihe === 1 && (
 <div className="lg:w-80 flex-shrink-0" style={{marginTop: '60px'}}>
          <div className="flex flex-col gap-4" style={{position: 'sticky', top: '20px'}}>
  <div className="rounded-lg p-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C', position: 'sticky', top: '20px'}}>
    <h3 className="text-white font-bold text-base mb-3">Näin Varat ja velat toimii</h3>
    <p style={{color: '#A0AEC0'}} className="text-sm mb-4">Käy lista läpi ja merkitse Kyllä tai Ei jokaiselle kohdalle.</p>
    <p style={{color: '#A0AEC0'}} className="text-sm mb-4">Klikkaa riviä nähdäksesi ohjeet ja kirjauskentän. Merkitse Kyllä jos asia koskee vainajaa, Ei jos ei koske.</p>
    <p style={{color: '#A0AEC0'}} className="text-sm">Löydöt kerääntyvät automaattisesti yhteenvetoon sivun alareunaan.</p>
  </div>
  {avattuKohta && (
    <VaratJaVelatPaneeli
      kohta={avattuKohta}
      kirjaukset={varatKirjaukset}
      onKirjaus={tallennaKirjaus}
      vahvistetut={vahvistetutKirjaukset}
      onVahvista={tallennaVahvistettu}
      onSulje={() => setAvattuKohta(null)}
      onPoista={poistaVahvistettu}
    />
  )}
</div>
        </div>
      )}
    </div>
  </>
)}

              {aktiivinenVaihe === 3 && (
  <PerunkirjoitusOsio
    kuolinpesa={kuolinpesa}
    vahvistetutKirjaukset={vahvistetutKirjaukset}
    kayttajaEmail={kuolinpesa?.kayttaja_email}
    kayttajaNimi={kuolinpesa?.kayttaja_nimi}
  />
)}

{aktiivinenVaihe > 3 && (
  <p style={{color: '#4A5568'}} className="text-sm">Tämä osio on tulossa pian.</p>
)}
            </div>

            <div className="rounded-lg p-6 mt-6" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
              <h2 className="text-white font-bold text-lg mb-6">Tiimi</h2>
              <KutsuJasen kuolinpesaId={kuolinpesa?.id} />
            </div>

          </div>

{/* Oikea sivupalkki - näytetään muissa vaiheissa */}
         
        </div>
      </div>
    </div>
  )
}

function Kommentit({ kuolinpesaId, kayttajaEmail }) {
  const [kommentit, setKommentit] = useState([])
  const [uusiKommentti, setUusiKommentti] = useState('')
  const [muokkausId, setMuokkausId] = useState(null)
  const [muokkausteksti, setMuokkausteksti] = useState('')

  useEffect(() => {
    if (!kuolinpesaId) return
    const haeKommentit = async () => {
      const { data } = await supabase.from('kommentit').select('*').eq('kuolinpesa_id', kuolinpesaId).order('created_at', { ascending: false })
      if (data) setKommentit(data)
    }
    haeKommentit()
  }, [kuolinpesaId])

  const lisaaKommentti = async () => {
    if (!uusiKommentti.trim()) return
    const { data } = await supabase.from('kommentit').insert({
      kuolinpesa_id: kuolinpesaId,
      tehtava_nimi: 'Yleinen',
    kirjoittaja_email: kayttajaNimi || kayttajaEmail,
      teksti: uusiKommentti
    }).select().single()
    if (data) { setKommentit([data, ...kommentit]); setUusiKommentti('') }
  }

  const poistaKommentti = async (id) => {
    await supabase.from('kommentit').delete().eq('id', id)
    setKommentit(kommentit.filter(k => k.id !== id))
  }

  const muokkaaKommentti = async (id) => {
    const { data } = await supabase.from('kommentit').update({ teksti: muokkausteksti }).eq('id', id).select().single()
    if (data) { setKommentit(kommentit.map(k => k.id === id ? data : k)); setMuokkausId(null) }
  }

  return (
    <div className="rounded-lg p-4" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
      <h3 className="text-white font-bold mb-4">💬 Kommentit</h3>
      <div className="mb-4">
        <textarea value={uusiKommentti} onChange={(e) => setUusiKommentti(e.target.value)} placeholder="Kirjoita kommentti tiimille..." className="w-full px-3 py-2 rounded text-sm text-white placeholder-gray-500 outline-none resize-none mb-2" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}} rows={3} />
        <button onClick={lisaaKommentti} className="w-full py-2 rounded text-sm font-bold" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>Lähetä</button>
      </div>
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
        {kommentit.length === 0 && <p style={{color: '#4A5568'}} className="text-xs">Ei vielä kommentteja.</p>}
        {kommentit.map((k) => (
          <div key={k.id} className="p-3 rounded" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
            <div className="flex items-center justify-between mb-1">
              <span style={{color: '#C9A84C'}} className="text-xs font-bold">{k.kirjoittaja_email}</span>
              <span style={{color: '#4A5568'}} className="text-xs">{new Date(k.created_at).toLocaleDateString('fi-FI')}</span>
            </div>
            
            {muokkausId === k.id ? (
              <div>
                <textarea value={muokkausteksti} onChange={(e) => setMuokkausteksti(e.target.value)} className="w-full px-2 py-1 rounded text-sm text-white outline-none resize-none mb-2" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}} rows={2} />
                <div className="flex gap-2">
                  <button onClick={() => muokkaaKommentti(k.id)} className="text-xs px-2 py-1 rounded" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>Tallenna</button>
                  <button onClick={() => setMuokkausId(null)} className="text-xs px-2 py-1 rounded" style={{color: '#4A5568', border: '1px solid #2D3E5C'}}>Peruuta</button>
                </div>
              </div>
            ) : (
              <p className="text-white text-sm">{k.teksti}</p>
            )}
            {k.kirjoittaja_email === kayttajaEmail && muokkausId !== k.id && (
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setMuokkausId(k.id); setMuokkausteksti(k.teksti) }} style={{color: '#A0AEC0'}} className="text-xs hover:opacity-75">Muokkaa</button>
                <button onClick={() => poistaKommentti(k.id)} style={{color: '#FC8181'}} className="text-xs hover:opacity-75">Poista</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Tapahtumaloki({ kuolinpesaId }) {
  const [tapahtumat, setTapahtumat] = useState([])

  useEffect(() => {
    if (!kuolinpesaId) return
    const haeTapahtumat = async () => {
      const { data } = await supabase.from('tapahtumat').select('*').eq('kuolinpesa_id', kuolinpesaId).order('created_at', { ascending: false }).limit(20)
      if (data) setTapahtumat(data)
    }
    haeTapahtumat()
  }, [kuolinpesaId])

  return (
    <div className="rounded-lg p-4" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
      <h3 className="text-white font-bold mb-4">📋 Tapahtumaloki</h3>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {tapahtumat.length === 0 && <p style={{color: '#4A5568'}} className="text-xs">Ei vielä tapahtumia.</p>}
        {tapahtumat.map((t) => (
          <div key={t.id} className="p-2 rounded" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
            <p className="text-white text-xs">{t.teksti}</p>
            <div className="flex items-center justify-between mt-1">
              <span style={{color: '#4A7ACC'}} className="text-xs">{t.kirjoittaja_email}</span>
              <span style={{color: '#4A5568'}} className="text-xs">{new Date(t.created_at).toLocaleDateString('fi-FI')} {new Date(t.created_at).toLocaleTimeString('fi-FI', {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VaratJaVelat({ rastitattu, onToggle, kirjaukset, onKirjaus, vahvistetut, onVahvista, avattuKohta, setAvattuKohta }) {
  const [avatutKategoriat, setAvatutKategoriat] = useState({})

  const toggleKategoria = (id) => setAvatutKategoriat(prev => ({ ...prev, [id]: !prev[id] }))

  const varatKategoriat = [
    { id: 'pankkivarat', otsikko: '🏦 Pankkivarat', kohteet: ['pankkitilit', 'kateinen', 'tallelokero'] },
    { id: 'sijoitukset', otsikko: '📈 Sijoitukset', kohteet: ['sijoitukset', 'krypto', 'elakesaastot', 'osuuskunnat'] },
    { id: 'kiinteistot', otsikko: '🏠 Kiinteistöt', kohteet: ['asunnot', 'mokki', 'metsa'] },
    { id: 'omaisuus', otsikko: '🚗 Omaisuus', kohteet: ['ajoneuvot', 'arvoesineet'] },
    { id: 'saatavat', otsikko: '📋 Saatavat', kohteet: ['veronpalautus', 'lomarahat', 'vakuutuskorvaukset'] },
  ]

  const velatKategoriat = [
    { id: 'lainat', otsikko: '🏦 Lainat', kohteet: ['asuntolaina', 'autolaina', 'opintolaina'] },
    { id: 'luotot', otsikko: '💳 Luotot', kohteet: ['kulutusluotot', 'osamaksut'] },
    { id: 'muutvelat', otsikko: '📄 Muut velat', kohteet: ['takaukset', 'maksamattomat', 'verorästit'] },
  ]

  const renderKategoria = (kategoria, lista, etuliite = '') => {
    const auki = avatutKategoriat[kategoria.id]
    const kohteet = lista.filter(k => kategoria.kohteet.includes(k.id))
    const kyllaMaara = kohteet.filter(k => rastitattu[etuliite + k.id] === 'kylla').length

    return (
      <div key={kategoria.id} className="rounded-lg overflow-hidden" style={{backgroundColor: '#0F1E3C', border: `1px solid ${kyllaMaara === kohteet.length && kyllaMaara > 0 ? '#C9A84C' : '#2D3E5C'}`}}>
        <div className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80" onClick={() => toggleKategoria(kategoria.id)}>
    <div>
  <p className="text-white font-bold text-sm">{kategoria.otsikko}</p>
  <p style={{color: kyllaMaara > 0 ? '#C9A84C' : '#4A5568'}} className="text-xs">{kyllaMaara}/{kohteet.length} löytyi</p>
</div>
          <div className="flex items-center gap-2">
  {kyllaMaara === kohteet.length && kyllaMaara > 0 && <span style={{color: '#C9A84C'}} className="text-xs">✓ Valmis</span>}
  <span style={{color: '#C9A84C'}} className="text-xs">{auki ? '▲' : '▼'}</span>
</div>
        </div>
        {auki && (
          <div className="px-4 pb-4 border-t flex flex-col gap-2" style={{borderColor: '#2D3E5C'}}>
            <div className="mt-3 flex flex-col gap-2">
              {kohteet.map(kohta => {
                const id = etuliite + kohta.id
                const onValittu = avattuKohta === id
                const onKylla = rastitattu[id] === 'kylla'
                const onEi = rastitattu[id] === 'ei'
                const handleRiviClick = () => {
                  if (onEi) return
                  if (onKylla) { setAvattuKohta(onValittu ? null : id); return }
                  setAvattuKohta(onValittu ? null : id)
                }
                return (
                  <div key={kohta.id} className="rounded"
                    style={{backgroundColor: '#1B2A4A', border: `1px solid ${onValittu ? '#C9A84C' : '#2D3E5C'}`, opacity: onEi ? 0.5 : 1, cursor: onEi ? 'default' : 'pointer'}}
                    onClick={handleRiviClick}>
                    <div className="flex items-center justify-between p-3 gap-3">
                      <span className="text-sm flex-1 text-white">{kohta.teksti}</span>

                      <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { onToggle(id, 'kylla'); setAvattuKohta(onKylla ? null : id) }} className="text-xs px-3 py-1 rounded font-bold"
                          style={{backgroundColor: onKylla ? '#C9A84C' : '#0F1E3C', color: onKylla ? '#0F1E3C' : '#6B7280', border: '1px solid #2D3E5C'}}>
                          Kyllä
                        </button>
                        <button onClick={() => { onToggle(id, 'ei'); setAvattuKohta(null) }} className="text-xs px-3 py-1 rounded font-bold"
                          style={{backgroundColor: onEi ? '#4A5568' : '#0F1E3C', color: onEi ? '#9CA3AF' : '#6B7280', border: '1px solid #2D3E5C'}}>
                          Ei
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-white font-bold mb-4">Varat</h3>
        <div className="flex flex-col gap-3">
          {varatKategoriat.map(k => renderKategoria(k, varatJaVelatMuistilista.varat))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-bold mb-4">Velat</h3>
        <div className="flex flex-col gap-3">
          {velatKategoriat.map(k => renderKategoria(k, varatJaVelatMuistilista.velat, 'velat_'))}
        </div>
      </div>

      {(varatJaVelatMuistilista.varat.some(k => rastitattu[k.id] === 'kylla' && vahvistetut[k.id]) ||
        varatJaVelatMuistilista.velat.some(k => rastitattu['velat_' + k.id] === 'kylla' && vahvistetut['velat_' + k.id])) && (
        <div className="p-4 rounded-lg" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
          <h3 className="text-white font-bold mb-4">📊 Yhteenveto löydöistä</h3>
          {varatJaVelatMuistilista.varat.some(k => rastitattu[k.id] === 'kylla' && vahvistetut[k.id]) && (
            <div className="mb-4">
              <p style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">Varat</p>
              {varatJaVelatMuistilista.varat.filter(k => rastitattu[k.id] === 'kylla' && vahvistetut[k.id]?.length > 0).flatMap(k =>
                (vahvistetut[k.id] || []).map((v, i) => (
                  <p key={k.id + i} className="text-white text-sm mb-1">- {k.teksti} — {v}</p>
                ))
              )}
            </div>
          )}
          {varatJaVelatMuistilista.velat.some(k => rastitattu['velat_' + k.id] === 'kylla' && vahvistetut['velat_' + k.id]) && (
            <div>
              <p style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">Velat</p>
              {varatJaVelatMuistilista.velat.filter(k => rastitattu['velat_' + k.id] === 'kylla' && vahvistetut['velat_' + k.id]).map(k => (
                <p key={k.id} className="text-white text-sm mb-1">- {k.teksti} — {vahvistetut['velat_' + k.id]}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SelvitysOsio({ onValmis, onEdistyminen, avattuSopimus, setAvattuSopimus, sopimusTilat, tallennaSopimusTila }) {
  const [avatutKategoriat, setAvatutKategoriat] = useState({})
  const [muistiinpanot, setMuistiinpanot] = useState({})

  useEffect(() => {
    const kasitelty = kategoriat.reduce((sum, k) => sum + k.sopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu' || sopimusTilat[s.nimi] === 'ei').length, 0)
    onEdistyminen?.(kasitelty)
  }, [sopimusTilat])

  const toggleKategoria = (id) => setAvatutKategoriat(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-3 mb-6">
          {kategoriat.map(kategoria => {
            const kasitelty = kategoria.sopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu' || sopimusTilat[s.nimi] === 'ei').length
            const kaikki = kategoria.sopimukset.length
            const auki = avatutKategoriat[kategoria.id]
            return (
              <div key={kategoria.id} className="rounded-lg overflow-hidden" style={{backgroundColor: '#0F1E3C', border: `1px solid ${kasitelty === kaikki && kasitelty > 0 ? '#C9A84C' : '#2D3E5C'}`}}>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:opacity-80" onClick={() => toggleKategoria(kategoria.id)}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{kategoria.ikoni}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{kategoria.nimi}</p>
                      <p style={{color: kasitelty > 0 ? '#C9A84C' : '#4A5568'}} className="text-xs">{`${kasitelty}/${kaikki} käsitelty`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {kasitelty === kaikki && kasitelty > 0 && <span style={{color: '#C9A84C'}} className="text-xs">✓ Valmis</span>}
                    <span style={{color: '#C9A84C'}} className="text-xs">{auki ? '▲' : '▼'}</span>
                  </div>
                </div>
                {auki && (
                  <div className="px-4 pb-4 border-t flex flex-col gap-2" style={{borderColor: '#2D3E5C'}}>
                    <div className="mt-3 flex flex-col gap-2">
                      {kategoria.sopimukset.map(sopimus => {
                        const tila = sopimusTilat[sopimus.nimi]
                        const onHoidettu = tila === 'hoidettu'
                        const onOhitettu = tila === 'ei'
                        const onKesken = tila === 'kesken'
                        const onValittu = avattuSopimus?.nimi === sopimus.nimi
                        return (
                          <div key={sopimus.nimi} className="rounded cursor-pointer"
                            style={{backgroundColor: '#1B2A4A', border: `1px solid ${onValittu ? '#C9A84C' : '#2D3E5C'}`}}
                            onClick={() => setAvattuSopimus(onValittu ? null : { ...sopimus, kategoriaId: kategoria.id })}>
                            <div className="flex items-center justify-between p-3 gap-3">
                              <span className="text-sm flex-1 min-w-0 truncate text-white">{sopimus.nimi}</span>
                              {onHoidettu && <span className="text-xs px-2 py-1 rounded font-bold flex-shrink-0" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>✓ Hoidettu</span>}
                              {onKesken && <span className="text-xs px-2 py-1 rounded font-bold flex-shrink-0" style={{backgroundColor: '#2D3E5C', color: '#A0AEC0'}}>⏳ Kesken</span>}
                              {onOhitettu && <span className="text-xs px-2 py-1 rounded font-bold flex-shrink-0" style={{backgroundColor: '#2D3E5C', color: '#6B7280'}}>Ei kuulu</span>}
                              {!tila && (
                                <button onClick={e => { e.stopPropagation(); tallennaSopimusTila(sopimus.nimi, 'ei'); setAvattuSopimus(null) }}
                                  className="text-xs px-3 py-1 rounded font-bold flex-shrink-0"
                                  style={{backgroundColor: '#0F1E3C', color: '#6B7280', border: '1px solid #2D3E5C'}}>
                                  Ei kuulu
                                </button>
                              )}
                            </div>
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
        <button className="w-full py-3 rounded font-bold" style={{backgroundColor: 'transparent', color: '#C9A84C', border: '1px solid #2D3E5C'}} onClick={onValmis}>Siirry yhteenvetoon →</button>
      </div>

      <div className="lg:w-80 flex-shrink-0 flex flex-col gap-4" style={{position: 'sticky', top: '20px', alignSelf: 'flex-start'}}>
        <div className="rounded-lg p-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C', position: 'sticky', top: '20px'}}>
          <h3 className="text-white font-bold text-base mb-3">Näin Sopimukset toimii</h3>
          <p style={{color: '#A0AEC0'}} className="text-sm mb-4">Klikkaa sopimusta nähdäksesi ohjeet miten se hoidetaan.</p>
          <p style={{color: '#A0AEC0'}} className="text-sm mb-4">Kun olet hoitanut asian, paina <strong style={{color: 'white'}}>"Merkitse hoidetuksi"</strong> paneelissa.</p>
          <p style={{color: '#A0AEC0'}} className="text-sm">Paina <strong style={{color: 'white'}}>"Ei kuulu"</strong> jos sopimusta ei ollut, tai se on jo hoidettu.</p>
        </div>
        {avattuSopimus && (
          <div className="rounded-lg p-5 flex flex-col gap-4" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-base">{avattuSopimus.nimi}</h3>
                {sopimusTilat[avattuSopimus.nimi] === 'kesken' && (
                  <span className="text-xs" style={{color: '#A0AEC0'}}>⏳ Kesken</span>
                )}
                {sopimusTilat[avattuSopimus.nimi] === 'hoidettu' && (
                  <span className="text-xs" style={{color: '#C9A84C'}}>✓ Hoidettu</span>
                )}
              </div>
              <button onClick={() => setAvattuSopimus(null)} style={{color: '#4A5568'}} className="text-sm hover:opacity-75">✕</button>
            </div>
            <p style={{color: '#A0AEC0'}} className="text-sm">{avattuSopimus.miksi}</p>
            <div>
              <p className="text-white font-bold text-sm mb-3">Miten hoidetaan</p>
              <ul className="flex flex-col gap-2">
                {avattuSopimus.miten.map((askel, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white">
                    <span className="flex-shrink-0">{i + 1}.</span>{askel}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-2">Muistiinpano</p>
              <textarea
                value={muistiinpanot[avattuSopimus.nimi] || ''}
                onChange={e => setMuistiinpanot(prev => ({ ...prev, [avattuSopimus.nimi]: e.target.value }))}
                placeholder="Esim. Soitin ti 25.3, odotan kirjallista vahvistusta..."
                rows={3}
                className="w-full rounded p-2 text-sm resize-none"
                style={{backgroundColor: '#0F1E3C', color: 'white', border: '1px solid #2D3E5C'}}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { tallennaSopimusTila(avattuSopimus.nimi, 'kesken'); setAvattuSopimus(null) }}
                className="w-full py-2 rounded text-sm font-bold" style={{backgroundColor: '#2D3E5C', color: '#A0AEC0'}}>
                ⏳ Merkitse kesken
              </button>
              <button onClick={() => { tallennaSopimusTila(avattuSopimus.nimi, 'hoidettu'); setAvattuSopimus(null) }}
                className="w-full py-2 rounded text-sm font-bold" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>
                ✓ Merkitse hoidetuksi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Yhteenveto({ varatRastitattu, vahvistetutKirjaukset, sopimusTilat, tallennaSopimusTila, onValmis }) {
  const kaikkiSopimukset = kategoriat.flatMap(k => k.sopimukset.map(s => ({ ...s, kategoriaId: k.id, kategoriaNimi: k.nimi })))
  const hoidetutSopimukset = kaikkiSopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu')
  const avoimet = kaikkiSopimukset.filter(s => sopimusTilat[s.nimi] === 'kesken')

  const varatLoydetyt = varatJaVelatMuistilista.varat.filter(k => varatRastitattu?.[k.id] === 'kylla' && vahvistetutKirjaukset?.[k.id]?.length > 0)
  const velatLoydetyt = varatJaVelatMuistilista.velat.filter(k => varatRastitattu?.['velat_' + k.id] === 'kylla' && vahvistetutKirjaukset?.['velat_' + k.id]?.length > 0)

  return (
    <div className="flex flex-col gap-6">

      {/* Varat */}
      <div className="rounded-lg p-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
        <h3 className="text-white font-bold mb-4">Löydetyt varat</h3>
        {varatLoydetyt.length === 0 ? (
          <p style={{color: '#4A5568'}} className="text-sm">Ei kirjattuja varalöytöjä. Lisää tietoja Varat ja velat -osiossa.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {varatLoydetyt.map(k => (
              <div key={k.id}>
                <p style={{color: '#C9A84C'}} className="text-xs font-bold uppercase tracking-wider mb-1">{k.teksti}</p>
                {vahvistetutKirjaukset[k.id].map((v, i) => (
                  <p key={i} style={{color: '#A0AEC0'}} className="text-sm">— {v}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Velat */}
      <div className="rounded-lg p-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
        <h3 className="text-white font-bold mb-4">Löydetyt velat</h3>
        {velatLoydetyt.length === 0 ? (
          <p style={{color: '#4A5568'}} className="text-sm">Ei kirjattuja velkalöytöjä. Lisää tietoja Varat ja velat -osiossa.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {velatLoydetyt.map(k => (
              <div key={k.id}>
                <p style={{color: '#C9A84C'}} className="text-xs font-bold uppercase tracking-wider mb-1">{k.teksti}</p>
                {vahvistetutKirjaukset['velat_' + k.id].map((v, i) => (
                  <p key={i} style={{color: '#A0AEC0'}} className="text-sm">— {v}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sopimukset */}
      <div className="rounded-lg p-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Sopimukset</h3>
          {hoidetutSopimukset.length > 0 && (
            <span style={{color: '#C9A84C'}} className="text-xs">{hoidetutSopimukset.length} hoidettu</span>
          )}
        </div>
        {avoimet.length === 0 ? (
          <p style={{color: '#4A5568'}} className="text-sm">Ei avoimia sopimuksia. Käy Sopimukset-osio läpi ensin.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p style={{color: '#A0AEC0'}} className="text-xs mb-2">Nämä sopimukset odottavat hoitamista ennen perunkirjoitusta:</p>
            {avoimet.map(s => (
              <div key={s.nimi} className="rounded p-3 flex items-center justify-between gap-3"
                style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
                <div>
                  <p className="text-white text-sm">{s.nimi}</p>
                  <p style={{color: '#4A5568'}} className="text-xs">{s.kategoriaNimi}</p>
                </div>
                <button
                  onClick={() => tallennaSopimusTila(s.nimi, 'hoidettu')}
                  className="text-xs px-3 py-1 rounded font-bold flex-shrink-0"
                  style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>
                  ✓ Hoidettu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="w-full py-4 rounded font-bold text-lg" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} onClick={onValmis}>
        Siirry perunkirjoitukseen →
      </button>
    </div>
  )
}

function TehtavaKortti({ tehtava, onMerkitse, avattuTehtava, setAvattuTehtava }) {
  const ohje = ohjeet[tehtava.nimi]
  const onAuki = avattuTehtava === tehtava.id

  return (
    <div className="rounded transition-all cursor-pointer" 
      style={{backgroundColor: onAuki ? '#1B2A4A' : '#0F1E3C', border: `1px solid ${onAuki ? '#C9A84C' : '#2D3E5C'}`}}
      onClick={() => setAvattuTehtava(onAuki ? null : tehtava.id)}>
      <div className="flex items-center gap-4 p-4">
        <div onClick={(e) => { e.stopPropagation(); onMerkitse() }} className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{backgroundColor: tehtava.tehty ? '#C9A84C' : 'transparent', border: `2px solid ${tehtava.tehty ? '#C9A84C' : '#4A5568'}`}}>
          {tehtava.tehty && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
        </div>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-medium" style={{color: 'white'}}>{tehtava.nimi}</span>
          {ohje?.kiireellinen && <span className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: '#7C3333', color: '#FCA5A5'}}>⏰ Kiireellinen</span>}
        </div>
        <span style={{color: '#C9A84C'}} className="text-xs">{onAuki ? '▲' : '▼'}</span>
      </div>
    </div>
  )
}
const ohjeet = {
  'Tilaa virkatodistus': { kiireellinen: true, miksi: 'Toimituksessa kestää 4-10 viikkoa — tarvitaan pankeissa, vakuutuksissa ja perunkirjoituksessa. Tee tämä ensimmäisenä.', miten: ['Jos vainaja kuului ev.lut. kirkkoon → mene osoitteeseen tilaavirkatodistus.fi','Jos vainaja ei kuulunut kirkkoon → mene osoitteeseen dvv.fi','Tilaa useampi kopio kerralla — tarvitset niitä monessa paikassa','Hinta noin 35-100 €'] },
  'Selvitä onko testamentti': { kiireellinen: false, miksi: 'Testamentti vaikuttaa siihen kuka perii mitä. Se pitää löytää ja antaa tiedoksi kaikille perillisille 6 kuukauden kuluessa — muuten se menettää voimansa.', miten: ['Tarkista vainajan paperit, tallelokero ja kirjoituspöytä','Kysy asianajajalta tai pankista onko testamentti tallessa','Jos testamentti löytyy — säilytä se turvassa ja vie se perunkirjoitukseen','Testamentti pitää antaa tiedoksi kaikille perillisille kirjallisesti'] },
  'Ilmoita pankeille': { kiireellinen: false, miksi: 'Pankki jäädyttää tilit automaattisesti mutta oma ilmoitus nopeuttaa asioita. Samalla sovitaan kuka hoitaa kuolinpesän pankkiasioita.', miten: ['Soita vainajan pankin asiakaspalveluun','Ilmoita vainajan nimi ja henkilötunnus','Kerro kuka toimii kuolinpesän hoitajana','Pankki antaa ohjeet kirjallisen ilmoituksen tekemiseen','Huom: Vainajan tililtä voi silti maksaa arjen laskuja ennen perunkirjoitusta'] },
  'Ilmoita Kelalle': { kiireellinen: false, miksi: 'Jos vainaja sai Kela-etuuksia, ilmoita pian — muuten ylimääräiset maksut peritään takaisin.', miten: ['Soita Kelan palvelunumeroon 020 692 201 (ma-pe 9-16)','Kysy onko sinulla oikeus leskeneläkkeeseen tai lapseneläkkeeseen','Jos sinulla on alle 17-vuotiaita lapsia, kysy lapsilisän yksinhuoltajakorotuksesta'] },
  'Hae henkivakuutuskorvaus': { kiireellinen: false, miksi: 'Henkivakuutuskorvaus ei tule automaattisesti — se pitää hakea erikseen.', miten: ['Selvitä oliko vainajalla henkivakuutus — tarkista vakuutuskirjoista tai kysy vakuutusyhtiöltä','Selvitä myös oliko vainajalla ryhmähenkivakuutus työnantajan kautta','Ota yhteyttä vakuutusyhtiöön ja pyydä korvaushakemuslomake','Korvaus maksetaan vakuutuksen edunsaajamääräyksen mukaan'] },
  'Ilmoita työnantajalle ja taloyhtiölle': { kiireellinen: false, miksi: 'Työnantajalla voi olla maksamattomia palkkoja tai ryhmähenkivakuutus.', miten: ['Soita tai kirjoita vainajan viimeiselle työnantajalle — kysy maksamattomista palkoista','Ilmoita taloyhtiön isännöitsijälle','Jos vainaja asui vuokralla: irtisano vuokrasopimus kirjallisesti — tähän tarvitaan kaikkien osakkaiden allekirjoitukset'] },
  'Ohjaa posti uuteen osoitteeseen': { kiireellinen: false, miksi: 'Vainajalle tuleva posti paljastaa missä palveluissa hän oli asiakkaana.', miten: ['Tee muuttoilmoitus osoitteessa muuttoilmoitus.fi tai Postin toimipisteessä','Ohjaa posti kuolinpesän hoitajan osoitteeseen','Ilmoita uusi osoite myös Verohallinnolle kirjallisesti — tähän tarvitaan kaikkien osakkaiden hyväksyntä'] },
}

function TehtavaPaneeli({ tehtava, kuolinpesaId, kayttajaEmail, kayttajaNimi, onSulje }) {
  const [kommentit, setKommentit] = useState([])
  const [uusiKommentti, setUusiKommentti] = useState('')
  const ohje = ohjeet[tehtava?.nimi]

  useEffect(() => {
    if (!kuolinpesaId || !tehtava) return
    const haeKommentit = async () => {
      const { data } = await supabase.from('kommentit').select('*').eq('kuolinpesa_id', kuolinpesaId).eq('tehtava_nimi', tehtava.nimi).order('created_at', { ascending: true })
      if (data) setKommentit(data)
    }
    haeKommentit()
  }, [kuolinpesaId, tehtava])

  const lisaaKommentti = async () => {
    if (!uusiKommentti.trim()) return
    const { data } = await supabase.from('kommentit').insert({
      kuolinpesa_id: kuolinpesaId,
      tehtava_nimi: tehtava.nimi,
      kirjoittaja_email: kayttajaNimi || kayttajaEmail,
      teksti: uusiKommentti
    }).select().single()
    if (data) { setKommentit([...kommentit, data]); setUusiKommentti('') }
  }

  if (!tehtava || !ohje) return null

  return (
    <div className="rounded-lg p-5 flex flex-col gap-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-base mb-1">{tehtava.nimi}</h3>
          {ohje.kiireellinen && <span className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: '#7C3333', color: '#FCA5A5'}}>⏰ Kiireellinen</span>}
        </div>
        <button onClick={onSulje} style={{color: '#4A5568'}} className="text-sm hover:opacity-75">✕ Sulje</button>
      </div>

      <div>
        <p style={{color: '#A0AEC0'}} className="text-sm">{ohje.miksi}</p>
      </div>

      <div>
        <div style={{color: 'white'}} className="text-xs uppercase tracking-widest mb-3">Miten tehdään</div>
        <ul className="flex flex-col gap-2">
          {ohje.miten.map((askel, i) => (
            <li key={i} className="flex gap-3 text-sm" style={{color: 'white'}}>
              <span style={{color: 'white'}} className="flex-shrink-0">{i + 1}.</span>{askel}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4" style={{borderColor: '#2D3E5C'}}>
        <div style={{color: 'white'}} className="text-xs uppercase tracking-widest mb-3">💬 Kommentit</div>
        <div className="flex flex-col gap-2 mb-3">
          {kommentit.length === 0 && <p style={{color: '#4A5568'}} className="text-xs">Ei vielä kommentteja.</p>}
          {kommentit.map((k) => (
            <div key={k.id} className="p-2 rounded" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}>
              <span style={{color: '#C9A84C'}} className="text-xs font-bold">{k.kirjoittaja_email}: </span>
              <span className="text-white text-xs">{k.teksti}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={uusiKommentti} onChange={(e) => setUusiKommentti(e.target.value)} placeholder="Kirjoita kommentti..." className="flex-1 px-3 py-2 rounded text-sm text-white placeholder-gray-500 outline-none" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}} onKeyDown={(e) => e.key === 'Enter' && lisaaKommentti()} />
          <button onClick={lisaaKommentti} className="px-3 py-2 rounded text-sm font-bold" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>→</button>
        </div>
      </div>
    </div>
  )
}
const perunkirjoitusTehtavat = [
  { id: 'pk1', nimi: 'Määritä pesänilmoittaja', miksi: 'Pesänilmoittaja on se henkilö joka ottaa vetovastuun perunkirjoituksesta. Yleensä leski tai vanhin perillinen.', miten: ['Sopikaa osakkaiden kesken kuka ottaa vetovastuun','Pesänilmoittaja allekirjoittaa perukirjan ja vastaa sen oikeellisuudesta','Ilmoittakaa valinnasta muille osakkaille'] },
  { id: 'pk2', nimi: 'Hanki uskottu mies', miksi: 'Perunkirjoituksessa täytyy olla kaksi uskottua miestä — he eivät voi olla perillisiä tai puoliso.', miten: ['Pyydä kaksi ulkopuolista henkilöä toimimaan uskottuina miehinä','He voivat olla esim. naapureita tai tuttavia','He allekirjoittavat perukirjan ja todistevat sen oikeellisuuden'] },
  { id: 'pk3', nimi: 'Kutsu kaikki osakkaat', miksi: 'Kaikille osakkaille on annettava tieto perunkirjoituksen ajankohdasta.', miten: ['Ilmoita kaikille perillisille kirjallisesti','Kirjaa ylös kenelle on ilmoitettu ja milloin','Osakkaiden ei ole pakko osallistua — ilmoitus riittää'] },
  { id: 'pk4', nimi: 'Kerää virkatodistukset osakkaista', miksi: 'Perukirjaan tarvitaan virkatodistukset kaikista osakkaista sukuselvityksen varmistamiseksi.', miten: ['Tilaa virkatodistus jokaisesta osakkaasta','Ev.lut. kirkon jäsenet: tilaavirkatodistus.fi','Muut: dvv.fi'] },
  { id: 'pk5', nimi: 'Tarkista aviokirja tai avioehtosopimus', miksi: 'Jos vainaja oli naimisissa, aviokirja tai avioehtosopimus vaikuttaa siihen mitä kuuluu kuolinpesään.', miten: ['Tarkista vainajan paperit','Aviokirja tai avioehtosopimus liitetään perukirjaan','Jos ei löydy — se tarkoittaa että avio-oikeus on voimassa'] },
  { id: 'pk6', nimi: 'Pidä perunkirjoitustilaisuus', miksi: 'Perunkirjoitus on pidettävä 3 kuukauden kuluessa kuolemasta. Määräaikaa voi hakea jatkoa Verohallinnolta.', miten: ['Sovi aika ja paikka kaikkien osakkaiden ja uskottujen miesten kanssa','Käykää läpi kaikki varat ja velat','Uskotut miehet allekirjoittavat perukirjan'] },
  { id: 'pk7', nimi: 'Laadi perukirja', miksi: 'Perukirja on virallinen asiakirja joka listaa kaikki vainajan varat ja velat kuolinhetkellä.', miten: ['Käytä alla olevaa "Generoi perukirjapohja" -nappia pohjana','Täytä puuttuvat tiedot kuten henkilötunnukset','Uskotut miehet ja pesänilmoittaja allekirjoittavat'] },
  { id: 'pk8', nimi: 'Toimita perukirja Verohallinnolle', miksi: 'Perukirja on toimitettava Verohallinnolle kuukauden kuluessa perunkirjoitustilaisuudesta.', miten: ['Lähetä perukirja osoitteeseen: Verohallinto, PL 700, 00052 VERO','Tai toimita OmaVero-palvelussa','Liitä mukaan testamentti jos sellainen on'] },
  { id: 'pk9', nimi: 'Toimita perukirja pankille', miksi: 'Pankki tarvitsee perukirjan ennen kuin kuolinpesän tilejä voidaan käyttää tai sulkea.', miten: ['Toimita perukirja kaikkiin pankkeihin joissa vainajalla oli tilejä','Pyydä pankista tiliotteet kuolinpäivältä','Sovi pankin kanssa tilien jatkosta'] },
]

function PerunkirjoitusOsio({ kuolinpesa, vahvistetutKirjaukset, kayttajaEmail, kayttajaNimi }) {
  const [avattuTehtava, setAvattuTehtava] = useState(null)
  const [perunkirjoitusTehty, setPerunkirjoitusTehty] = useState({})
const togglePerunkirjoitusTehty = (id) => setPerunkirjoitusTehty(prev => ({...prev, [id]: !prev[id]}))
  const avattuOhje = perunkirjoitusTehtavat.find(t => t.id === avattuTehtava)

  return (
    <div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-3 flex-1">
          {perunkirjoitusTehtavat.map(tehtava => (
            <div key={tehtava.id} className="rounded cursor-pointer transition-all"
  style={{backgroundColor: avattuTehtava === tehtava.id ? '#1B2A4A' : '#0F1E3C', border: `1px solid ${avattuTehtava === tehtava.id ? '#C9A84C' : '#2D3E5C'}`}}
  onClick={() => setAvattuTehtava(avattuTehtava === tehtava.id ? null : tehtava.id)}>
  <div className="flex items-center gap-4 p-4">
    <div onClick={(e) => { e.stopPropagation(); togglePerunkirjoitusTehty(tehtava.id) }}
      className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
      style={{backgroundColor: perunkirjoitusTehty[tehtava.id] ? '#C9A84C' : 'transparent', border: `2px solid ${perunkirjoitusTehty[tehtava.id] ? '#C9A84C' : '#4A5568'}`}}>
      {perunkirjoitusTehty[tehtava.id] && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
    </div>
    <div className="flex-1">
      <span className="text-sm font-medium" style={{color: 'white'}}>{tehtava.nimi}</span>
    </div>
    <span style={{color: '#C9A84C'}} className="text-xs">{avattuTehtava === tehtava.id ? '▲' : '▼'}</span>
  </div>
</div>
          ))}
        </div>

        {avattuTehtava && avattuOhje && (
          <div className="w-80 flex-shrink-0">
            <div className="rounded-lg p-5 flex flex-col gap-5" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}}>
              <div className="flex items-start justify-between">
                <h3 className="text-white font-bold text-base">{avattuOhje.nimi}</h3>
                <button onClick={() => setAvattuTehtava(null)} style={{color: '#4A5568'}} className="text-sm hover:opacity-75">✕</button>
              </div>
              <p style={{color: '#A0AEC0'}} className="text-sm">{avattuOhje.miksi}</p>
              <div>
                <div style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-3">Miten tehdään</div>
                <ul className="flex flex-col gap-2">
                  {avattuOhje.miten.map((askel, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white">
                      <span style={{color: '#C9A84C'}} className="flex-shrink-0">{i + 1}.</span>{askel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="w-full py-4 rounded font-bold text-lg mt-8" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}
        onClick={() => alert('Perukirjapohja tulossa pian!')}>
        Generoi perukirjapohja →
      </button>
    </div>
  )
}
function VaratJaVelatPaneeli({ kohta, kirjaukset, onKirjaus, vahvistetut, onVahvista, onSulje, onPoista }) {
  const isVelat = kohta.startsWith('velat_')
  const puhtaastiId = isVelat ? kohta.replace('velat_', '') : kohta
  const lista = isVelat ? varatJaVelatMuistilista.velat : varatJaVelatMuistilista.varat
  const kohtatiedot = lista.find(k => k.id === puhtaastiId)

  if (!kohtatiedot) return null

  return (
    <div className="rounded-lg p-5 flex flex-col gap-4" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C', position: 'sticky', top: '20px'}}>
      <div className="flex items-start justify-between">
        <h3 className="text-white font-bold text-base">{kohtatiedot.teksti}</h3>
        <button onClick={onSulje} style={{color: '#4A5568'}} className="text-sm hover:opacity-75">✕</button>
      </div>
      <p style={{color: '#A0AEC0'}} className="text-sm">{kohtatiedot.ohje}</p>
      <div className="border-t pt-4" style={{borderColor: '#2D3E5C'}}>
        <p className="text-white font-bold text-sm mb-3">Kirjaa löydöt</p>
        <div className="flex flex-col gap-1 mb-3">
          {(Array.isArray(vahvistetut[kohta]) ? vahvistetut[kohta] : vahvistetut[kohta] ? [vahvistetut[kohta]] : []).map((v, i) => (
  <div key={i} className="flex items-center justify-between">
    <p className="text-white text-sm">- {v}</p>
    <button onClick={() => onPoista(kohta, i)} style={{color: '#FC8181'}} className="text-xs hover:opacity-75 flex-shrink-0 ml-2">Poista</button>
  </div>
))}
        </div>
        <div className="flex gap-2">
          <input value={kirjaukset[kohta] || ''} onChange={(e) => onKirjaus(kohta, e.target.value)}
            placeholder={kohtatiedot.esimerkki || "Esim: kirjaa löytö..."}
            className="flex-1 px-3 py-1 rounded text-xs text-white placeholder-gray-500 outline-none"
            style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}} />
          <button onClick={() => onVahvista(kohta)} className="text-xs px-3 py-1 rounded font-bold"
            style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}>
            Kirjaa
          </button>
        </div>
      </div>
      <div className="border-t pt-4" style={{borderColor: '#2D3E5C'}}>
        <div style={{color: 'white'}} className="text-xs uppercase tracking-widest mb-3">💬 Kommentit</div>
        <p style={{color: '#4A5568'}} className="text-xs">Kommentointi tulossa pian.</p>
      </div>
    </div>
  )
}
function KutsuJasen({ kuolinpesaId }) {
  const [email, setEmail] = useState('')
  const [viesti, setViesti] = useState('')
  const [jasenet, setJasenet] = useState([])

  useEffect(() => {
    if (!kuolinpesaId) return
    const haeJasenet = async () => {
      const { data } = await supabase.from('jasenet').select('*').eq('kuolinpesa_id', kuolinpesaId)
      if (data) setJasenet(data)
    }
    haeJasenet()
  }, [kuolinpesaId])

  const kutsuJasen = async () => {
    if (!email) return
    const { error } = await supabase.from('jasenet').insert({ kuolinpesa_id: kuolinpesaId, email, rooli: 'osakas' })
    if (error) { setViesti('Virhe: ' + error.message) }
    else { setViesti('Jäsen lisätty!'); setJasenet([...jasenet, { email, rooli: 'osakas' }]); setEmail('') }
  }

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input type="email" placeholder="sahkoposti@email.fi" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded text-white placeholder-gray-500 outline-none" style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}} />
        <button onClick={kutsuJasen} style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} className="px-6 py-3 font-bold rounded hover:opacity-90">Lisää →</button>
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