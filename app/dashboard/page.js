'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'
import TopBar from '../components/TopBar'

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
      { nimi: 'Säilytystila / varasto', miksi: 'Ulkoinen säilytystila laskutetaan kuukausittain — jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä palveluntarjoajaan','Tyhjennä tila ja irtisano sopimus','Palauta avain'] },
      { nimi: 'Parkkipaikka / autohalli', miksi: 'Parkkipaikkasopimus jatkuu ja kuukausimaksu juoksee kunnes irtisanotaan.', miten: ['Ota yhteyttä parkkipaikan omistajaan tai taloyhtiöön','Irtisano sopimus kirjallisesti','Palauta mahdollinen avain tai kaukosäädin'] },
      { nimi: 'Pysäköintikortti / aluekortti', miksi: 'Kuukausittain laskutettava pysäköintisopimus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä pysäköintiyhtiöön tai taloyhtiöön','Irtisano sopimus ja palauta kortti tai kaukosäädin'] },
      { nimi: 'Autopesusopimus', miksi: 'Kuukausittain laskutettava autopesusopimus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä autopesuyrityksen asiakaspalveluun','Irtisano sopimus'] },
      { nimi: 'Autolaina / rahoitussopimus', miksi: 'Autolaina siirtyy kuolinpesälle — se pitää maksaa tai neuvotella uudelleen rahoitusyhtiön kanssa.', miten: ['Ota yhteyttä rahoitusyhtiöön','Selvitä lainan jäljellä oleva summa','Sovi jatkosta — maksetaanko laina pois vai siirretäänkö uudelle omistajalle'] },
      { nimi: 'Leasingsopimus', miksi: 'Leasingauto ei kuulu kuolinpesään — se on leasingyhtiön omaisuutta. Sopimus pitää irtisanoa erikseen.', miten: ['Ota yhteyttä leasingyhtiöön välittömästi','Palauta ajoneuvo sovitusti','Selvitä mahdolliset jäljellä olevat maksut'] },
    ]
  },
  {
    id: 'vakuutukset', nimi: 'Vakuutukset', ikoni: '🛡️',
    sopimukset: [
      { nimi: 'Henkivakuutus', miksi: 'Henkivakuutuskorvaus ei tule automaattisesti — se pitää hakea erikseen. Mitään keskitettyä rekisteriä henkivakuutuksista ei ole.', miten: ['Etsi vakuutuskirjat vainajan papereiden joukosta','Ota yhteyttä vakuutusyhtiöön ja hae korvausta','Jos et tiedä missä yhtiössä vakuutus on — kysy kaikilta vakuutusyhtiöiltä','Korvaushakemus pitää tehdä yleensä vuoden sisällä kuolemasta'] },
      { nimi: 'Ryhmähenkivakuutus (työnantajan kautta)', miksi: 'Monilla palkansaajilla on työnantajan ottama ryhmähenkivakuutus — tätä ei aina tiedetä. Korvaus voi olla merkittävä.', miten: ['Kysy vainajan viimeiseltä työnantajalta','Tai tarkista Työntekijäin ryhmähenkivakuutuspoolista: tvk.fi'] },
      { nimi: 'Tapaturmavakuutus', miksi: 'Jos vainaja kuoli tapaturmaisesti tai vakuutuksessa on kuolemantapausturva, siitä voi saada korvausta.', miten: ['Tarkista vakuutuskirjoista onko tapaturmavakuutusta','Ota yhteyttä vakuutusyhtiöön','Hae korvaus vuoden sisällä'] },
      { nimi: 'Autovakuutus (liikennevakuutus + kasko)', miksi: 'Traficom merkitsee kuolinpesän automaattisesti ajoneuvon omistajaksi. Vakuutukset jäävät voimaan mutta muutokset vaativat kaikkien osakkaiden suostumuksen.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä vakuutus voimassa kunnes ajoneuvo on myyty tai siirretty','Kun ajoneuvo myydään — vakuutus päättyy automaattisesti'] },
      { nimi: 'Moottoripyörän / veneen vakuutus', miksi: 'Sama periaate kuin autovakuutuksessa — vakuutus siirtyy kuolinpesän nimiin automaattisesti.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä voimassa kunnes omaisuus on myyty tai jaettu'] },
      { nimi: 'Kotivakuutus', miksi: 'Kotivakuutus siirtyy automaattisesti kuolinpesän nimiin — pidä voimassa kunnes omaisuus on jaettu tai myyty.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Vakuutus jatkuu pesän nimissä — älä irtisano ennenaikaisesti','Irtisano vasta kun asunto on myyty tai jaettu'] },
      { nimi: 'Kiinteistövakuutus', miksi: 'Koskee omakotitaloa tai muuta kiinteistöä. Pidä voimassa kunnes kiinteistö on myyty.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Pidä vakuutus voimassa kunnes kiinteistö on siirtynyt uudelle omistajalle','Irtisanomiseen tarvitaan kaikkien osakkaiden suostumus'] },
      { nimi: 'Matkavakuutus (vuosivakuutus)', miksi: 'Vuosittain uusiutuva matkavakuutus jatkuu kunnes irtisanotaan.', miten: ['Ota yhteyttä vakuutusyhtiöön','Irtisano vakuutus'] },
      { nimi: 'Sairausvakuutus (yksityinen)', miksi: 'Yksityinen sairausvakuutus päättyy kuolinpäivänä automaattisesti — mutta vakuutusyhtiölle pitää silti ilmoittaa.', miten: ['Ilmoita vakuutusyhtiölle kuolemasta','Selvitä onko avoinna olevia korvauksia joita voi vielä hakea'] },
      { nimi: 'Eläkevakuutus (vapaaehtoinen)', miksi: 'Vapaaehtoinen eläkesäästö kuuluu kuolinpesään ja voidaan nostaa — tai se voi sisältää kuolemanvaraturvan.', miten: ['Ota yhteyttä vakuutusyhtiöön','Selvitä onko kuolemanvaraturvaa tai nostomahdollisuus','Hae korvaus tai nosto'] },
      { nimi: 'Lainaturva', miksi: 'Jos vainajalla oli lainaturva lainassa, se voi kattaa lainan loppusumman kuoleman jälkeen.', miten: ['Tarkista onko lainassa lainaturva — kysy pankista','Ota yhteyttä vakuutusyhtiöön ja hae korvausta','Korvaus voi maksaa koko lainan jäljellä olevan summan'] },
      { nimi: 'Oikeusturvavakuutus', miksi: 'Oikeusturvavakuutus on usein liitetty kotivakuutukseen. Se voi kattaa kuolinpesän oikeudellisia kuluja.', miten: ['Tarkista kotivakuutuksesta onko oikeusturva mukana','Pidä voimassa perunkirjoitukseen asti'] },
    ]
  },
  {
    id: 'tilaukset-media', nimi: 'Tilaukset ja media', ikoni: '📺',
    sopimukset: [
      { nimi: 'Puhelinliittymät', miksi: 'Puhelinliittymä ei pääty automaattisesti. Tarkista onko vainajalla useampia liittymiä. Kuolemantapauksessa myös määräaikainen liittymä voidaan irtisanoa.', miten: ['Ota yhteyttä operaattorin asiakaspalveluun puhelimitse tai myymälässä','Ilmoita vainajan nimi ja kuolinpäivä','Pyydä listaus kaikista liittymistä saman asiakkaan nimissä','Irtisano kaikki liittymät'] },
      { nimi: 'Lehtitilaukset (sanomalehdet ja aikakauslehdet)', miksi: 'Lehdet jatkuvat kunnes irtisanotaan — sekä päivälehdet että vuositilaukset uusiutuvat automaattisesti. Käännetty posti paljastaa usein mitkä lehdet vainajalla oli.', miten: ['Ota yhteyttä kustantajaan puhelimitse tai verkkosivujen kautta','Ilmoita kuolemasta ja pyydä kaikkien tilausten päättämistä'] },
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
    ]
  },
  {
    id: 'hoiva-terveys', nimi: 'Hoiva ja terveys', ikoni: '🏥',
    sopimukset: [
      { nimi: 'Kotihoito', miksi: 'Säännölliset kotihoidon käynnit laskutetaan kunnes peruutetaan.', miten: ['Ota yhteyttä palveluntarjoajaan tai kotihoitoon','Peruuta tulevat käynnit','Palauta mahdolliset avaimet'] },
      { nimi: 'Ateriapalvelu', miksi: 'Ateriapalvelu toimittaa ruokaa säännöllisesti ja laskuttaa kuukausittain.', miten: ['Ota yhteyttä palveluntarjoajaan välittömästi','Peruuta tulevat toimitukset'] },
      { nimi: 'Taksikortti / Kela-taksi', miksi: 'Kela-taksi päättyy automaattisesti kun Kela saa tiedon — mutta ilmoitus kannattaa tehdä itse.', miten: ['Ilmoita Kelalle kuolemasta','Palauta mahdollinen taksikortti'] },
      { nimi: 'Yksityislääkärisopimus', miksi: 'Jatkuva sopimus yksityislääkäripalveluista laskutetaan säännöllisesti.', miten: ['Ota yhteyttä palveluntarjoajaan','Irtisano sopimus'] },
      { nimi: 'Hammaslääkärisopimus', miksi: 'Jatkuva sopimus hammashoitopalveluista tai hammasvakuutus laskutetaan kuukausittain.', miten: ['Ota yhteyttä hammaslääkärille tai palveluntarjoajaan','Irtisano sopimus tai vakuutus'] },
      { nimi: 'Hierontapalvelu', miksi: 'Säännölliset hieronta-ajat tai sarjakortit.', miten: ['Peruuta tulevat ajat','Kysy hyvitystä käyttämättömistä sarjakortin kerroista'] },
      { nimi: 'Jumppatunnit / ryhmäliikunta', miksi: 'Säännölliset jumppatunnit tai sarjakortit.', miten: ['Ota yhteyttä ohjaajaan tai palveluntarjoajaan','Selvitä onko käyttämättömiä tunteja joista voi saada hyvitystä'] },
      { nimi: 'Lemmikin hoitopalvelu', miksi: 'Jos vainajalla oli lemmikki ja säännöllinen hoitopalvelu.', miten: ['Peruuta tulevat hoitoajat','Selvitä lemmikin jatkosta'] },
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
    { id: 'ulkomaantilit', teksti: 'Ulkomaiset pankkitilit', ohje: 'Jos vainaja asui tai työskenteli ulkomailla, tarkista onko ulkomaisia tilejä. Tieto voidaan pyytää suoraan ulkomaiselta pankilta.', esimerkki: 'Esim: tili Ruotsalaisessa pankissa' },
    { id: 'kateinen', teksti: 'Käteinen kotona', ohje: 'Tarkista kodin yleisimmät piilopaikat — lipasto, kaappi, kassakirja.', esimerkki: 'Esim: käteistä löytyi lipastosta' },
    { id: 'sijoitukset', teksti: 'Sijoitukset (osakkeet, rahastot)', ohje: 'Tarkista OmaVero ja pankin verkkopankki. Sijoitukset näkyvät myös verottajan tiedoissa.', esimerkki: 'Esim: Nordnet-tili, OP-rahasto' },
    { id: 'ps-tili', teksti: 'PS-tili (pitkäaikaissäästäminen)', ohje: 'PS-tili on erillinen tili eläkevakuutuksesta. Kysy pankilta tai palveluntarjoajalta saldo ja nostoehdot kuoleman jälkeen.', esimerkki: 'Esim: PS-tili Nordea Säästöpankissa' },
    { id: 'joukkovelkakirjat', teksti: 'Joukkovelkakirjat ja obligaatiot', ohje: 'Tarkista arvo-osuustili ja pankin sijoitustili. Joukkovelkakirjat näkyvät usein erillään osakkeista.', esimerkki: 'Esim: valtion obligaatio, yrityslaina' },
    { id: 'asunnot', teksti: 'Asunto-osakkeet ja kiinteistöt', ohje: 'Tarkista lainhuutotodistus maanmittauslaitokselta. Asunto-osakkeet näkyvät isännöitsijäntodistuksessa.', esimerkki: 'Esim: 2h+k Helsinki Kallio, As Oy Kallionkatu' },
    { id: 'ajoneuvot', teksti: 'Ajoneuvot (auto, mopo, vene, mönkijä)', ohje: 'Tarkista Traficomin ajoneuvorekisteri. Kaikki vainajan nimissä olevat ajoneuvot siirtyvät kuolinpesälle.', esimerkki: 'Esim: Toyota Corolla 2015' },
    { id: 'metsa', teksti: 'Metsätilat', ohje: 'Tarkista maanmittauslaitoksen kiinteistörekisteri. Metsätilat ovat usein unohdettua omaisuutta.', esimerkki: 'Esim: metsätila Kuopiossa' },
    { id: 'mokki', teksti: 'Kesämökki tai vapaa-ajan kiinteistö', ohje: 'Tarkista maanmittauslaitoksen lainhuutotodistus.', esimerkki: 'Esim: mökki Savonlinnassa' },
    { id: 'tontti', teksti: 'Tontti tai rakentamaton maapalsta', ohje: 'Tarkista maanmittauslaitoksen kiinteistörekisteri. Tontit ovat usein unohtuneita, etenkin perintönä saadut.', esimerkki: 'Esim: rakentamaton tontti Espoossa' },
    { id: 'maatila', teksti: 'Maatila tai peltoalue', ohje: 'Tarkista maanmittauslaitoksen kiinteistörekisteri. Maatiloihin voi liittyä myös tukioikeuksia ja koneita.', esimerkki: 'Esim: peltoalue Etelä-Pohjanmaalla' },
    { id: 'autotalli', teksti: 'Autotalli tai osakemuotoinen parkkipaikka', ohje: 'Autotalli voi olla erillinen asunto-osake. Tarkista isännöitsijäntodistuksesta tai taloyhtiöltä.', esimerkki: 'Esim: autotalliosake As Oy Kalliossa' },
    { id: 'tallelokero', teksti: 'Tallelokero pankissa', ohje: 'Kysy kaikilta pankeilta onko vainajalla tallelokeroa. Tallelokero vaatii avaamista pesänselvittäjän läsnäollessa.', esimerkki: 'Esim: tallelokero OP Helsingin konttorissa' },
    { id: 'krypto', teksti: 'Kryptovaluutat', ohje: 'Tarkista vainajan tietokoneen lompakkosovellukset ja sähköpostit kryptopörssien vahvistuksista.', esimerkki: 'Esim: Bitcoin Coinbase-lompakossa' },
    { id: 'osuuskunnat', teksti: 'Osuuskunnat (S-osuus, OP-osuus, HOK)', ohje: 'Osuuskunnan jäsenyys näkyy jäsenkirjeistä tai kysymällä suoraan osuuskunnalta.', esimerkki: 'Esim: S-osuus, OP-osuudet' },
    { id: 'elakesaastot', teksti: 'Eläkesäästöt ja kapitalisaatiosopimukset', ohje: 'Kysy vakuutusyhtiöiltä onko vainajalla vapaaehtoista eläkesäästämistä.', esimerkki: 'Esim: vapaaehtoinen eläkevakuutus LähiTapiolassa' },
    { id: 'veronpalautus', teksti: 'Veronpalautukset', ohje: 'Tarkista OmaVero.fi — avoinna olevat veronpalautukset kuuluvat kuolinpesälle.', esimerkki: 'Esim: veronpalautus OmaVerossa' },
    { id: 'lomarahat', teksti: 'Ansaitsemattomat lomarahat', ohje: 'Kysy viimeiseltä työnantajalta onko maksamattomia palkkoja tai lomarahoja.', esimerkki: 'Esim: maksamattomat lomarahat työnantajalta' },
    { id: 'vakuutuskorvaukset', teksti: 'Keskeneräiset vakuutuskorvaukset', ohje: 'Tarkista onko vainajalla vireillä olevia vakuutuskorvauksia joita ei ole vielä maksettu.', esimerkki: 'Esim: vireillä oleva korvaus If vakuutukselta' },
    { id: 'vuokravakuus', teksti: 'Palautettava vuokravakuus', ohje: 'Jos vainaja asui vuokralla, vuokravakuus palautetaan kuolinpesälle. Ota yhteyttä vuokranantajaan.', esimerkki: 'Esim: kahden kuukauden vuokravakuus' },
    { id: 'myyntisaatavat', teksti: 'Myyntisaatavat (yrittäjille)', ohje: 'Jos vainaja oli yrittäjä, tarkista onko avoimia laskuja tai laskuttamatonta työtä. Nämä ovat kuolinpesän saatavia.', esimerkki: 'Esim: lähettämätön lasku asiakkaalle' },
    { id: 'osuuskunnat', teksti: 'Osuuskunnat (S-osuus, OP-osuus)', ohje: 'Osuuskunnan jäsenyys päättyy kuolemaan ja jäsenpääoma palautetaan kuolinpesälle. Kysy suoraan osuuskunnalta.', esimerkki: 'Esim: S-osuus, OP-osuudet, HOK' },
    { id: 'peravaunu', teksti: 'Perävaunu ja matkailuauto', ohje: 'Tarkista Traficomin ajoneuvorekisteri. Perävaunu ja matkailuauto rekisteröidään erikseen ja siirtyvät kuolinpesälle.', esimerkki: 'Esim: asuntovaunu, veneen perävaunu' },
    { id: 'tyokone', teksti: 'Työkone (traktori, kaivinkone)', ohje: 'Tarkista Traficomin rekisteri ja maatilan omaisuusluettelo. Työkoneet voivat olla merkittävä osa maatilan omaisuutta.', esimerkki: 'Esim: traktori, mönkijä, lumilinkous' },
    { id: 'korut', teksti: 'Korut ja kellot', ohje: 'Tarkista tallelokero, kassalipas ja korurasiat. Arvokkaat korut ja kellot pitää arvioida ammattilaisen toimesta perunkirjoitusta varten.', esimerkki: 'Esim: kultasormus, Rolex-kello, kaulaketjut' },
    { id: 'taide', teksti: 'Taide-esineet ja taulut', ohje: 'Listaa kaikki taulut ja taide-esineet. Arvokkaammat teokset kannattaa arvioida taidehuutokaupassa tai asiantuntijalla.', esimerkki: 'Esim: öljymaalaus, pronssiveistos' },
    { id: 'antiikki', teksti: 'Antiikki ja keräilyesineet', ohje: 'Vanhat esineet, posliini, hopea-astiastot ja keräilytavara voivat olla arvokkaita. Arvioita saa antiikkiliikkeistä.', esimerkki: 'Esim: hopea-astia, keräilyviinat, vanha posliini' },
    { id: 'soittimet', teksti: 'Soittimet', ohje: 'Listaa kaikki soittimet. Laadukkaat soittimet kuten piano tai viulu voivat olla merkittäviä arvoesineitä.', esimerkki: 'Esim: piano, akustinen kitara, viulu' },
    { id: 'arvoesineet', teksti: 'Muut arvoesineet', ohje: 'Kaikki muu arvokas irtain omaisuus joka ei sovi muihin kategorioihin. Arvioita saa alan liikkeistä.', esimerkki: 'Esim: arvokkaat astiastot, käsintehdyt matot, turkikset' },
    { id: 'jalometallit', teksti: 'Jalometallit (kulta, hopea)', ohje: 'Kultaharkot, hopeaset ja muut jalometallit ovat perunkirjoituksessa arvostettavaa omaisuutta. Tarkista tallelokero ja koti.', esimerkki: 'Esim: kultaharkko, hopeakolikot' },
    { id: 'asekokoelma', teksti: 'Asekokoelma', ohje: 'Aseet eivät siirry automaattisesti — kuolinpesän on ilmoitettava aseista poliisille. Aseet pitää luovuttaa tai hakea lupa omistukselle.', esimerkki: 'Esim: metsästyspyssy, antiikkiase' },
    { id: 'viinikokoelma', teksti: 'Viini- tai viskikokoelma', ohje: 'Arvokkaat alkoholikokoelmat voivat olla merkittäviä. Laadi luettelo pullot ja arviot.', esimerkki: 'Esim: vintage-viinejä kellarissa' },
  ],
  velat: [
    { id: 'asuntolaina', teksti: 'Asuntolaina', ohje: 'Kysy pankista lainan jäljellä oleva saldo. Tarkista onko lainassa lainaturva.', esimerkki: 'Esim: asuntolaina OP:ssa' },
    { id: 'kulutusluotot', teksti: 'Kulutusluotot ja pikavipit', ohje: 'Tarkista positiivirekisteri.fi — siellä näkyvät kaikki vainajan luotot.', esimerkki: 'Esim: Ferratum-luotto, Visa-luottokortti' },
    { id: 'autolaina', teksti: 'Autolaina / rahoitussopimus', ohje: 'Kysy rahoitusyhtiöltä lainan jäljellä oleva saldo.', esimerkki: 'Esim: Toyota Financial Services rahoitus' },
    { id: 'opintolaina', teksti: 'Opintolaina', ohje: 'Tarkista Kelasta onko opintolainaa jäljellä.', esimerkki: 'Esim: opintolaina Kelasta' },
    { id: 'osamaksut', teksti: 'Osamaksusopimukset (puhelin, kodinkone)', ohje: 'Tarkista laskut ja sopimukset — osamaksut jatkuvat kunnes ne maksetaan pois.', esimerkki: 'Esim: iPhone osamaksu Elisalta' },
    { id: 'muupankkilaina', teksti: 'Muu pankkilaina', ohje: 'Kysy kaikilta pankeilta täydellinen luetttelo vainajan lainoista. Tarkista myös muut rahoituslaitokset.', esimerkki: 'Esim: henkilökohtainen laina Nordeassa' },
    { id: 'takaukset', teksti: 'Takaukset toisten lainoille', ohje: 'Takaukset siirtyvät kuolinpesälle. Kysy pankista onko vainaja taannut jonkun toisen lainaa.', esimerkki: 'Esim: taannut pojan asuntolainan OP:ssa' },
    { id: 'maksamattomat', teksti: 'Maksamattomat laskut', ohje: 'Tarkista vainajan posti ja sähköposti. Maksamattomat laskut ovat kuolinpesän velkoja.', esimerkki: 'Esim: maksamaton sähkölasku, lääkärilasku' },
    { id: 'verorästit', teksti: 'Verorästit', ohje: 'Tarkista OmaVero.fi — avoinna olevat verot ovat kuolinpesän velkoja.', esimerkki: 'Esim: verorästit OmaVerossa' },
    { id: 'vuokrarästit', teksti: 'Vuokrarästit', ohje: 'Jos vainaja asui vuokralla ja jätti vuokria maksamatta, nämä ovat kuolinpesän velkoja. Kysy vuokranantajalta.', esimerkki: 'Esim: maksamatta jäänyt vuokra' },
    { id: 'yksityisvelat', teksti: 'Velat yksityishenkilöille', ohje: 'Tarkista vainajan paperit ja muistiinpanot. Sukulaisille tai tuttaville olevat velat ovat kuolinpesän velkoja jos ne voidaan todistaa.', esimerkki: 'Esim: lainaa veljeältä, velkakirja ystävälle' },
  ]
}

export default function Dashboard() {
  const router = useRouter()
  const [aktiivinenVaihe, setAktiivinenVaihe] = useState(1)
  const [aktiivinenAlivaihe, setAktiivinenAlivaihe] = useState(1)
  const [kuolinpesa, setKuolinpesa] = useState(null)
  const [naytaWelcome, setNaytaWelcome] = useState(() => typeof window !== 'undefined' && localStorage.getItem('uusi_kayttaja') === 'true')
  const [welcomeFading, setWelcomeFading] = useState(false)
  const [welcomeNimi, setWelcomeNimi] = useState('')
  const [tehtavaLista, setTehtavaLista] = useState([])
  const [esiTarkistukset, setEsiTarkistukset] = useState({ hautajaiset: false, kuolintodistus: false, laheiset: false })
  const [ladataan, setLadataan] = useState(true)
  const [selvitysHoidettu, setSelvitysHoidettu] = useState(0)
 const [wizardIndeksi, setWizardIndeksi] = useState(0)
 const [wizardAlustettu, setWizardAlustettu] = useState(false)
 const [avattuKohta, setAvattuKohta] = useState(null)
 const [avattuSopimus, setAvattuSopimus] = useState(null)
  const [varatRastitattu, setVaratRastitattu] = useState({})
  const [varatVelatTeksti, setVaratVelatTeksti] = useState('')
  const [varatKirjaukset, setVaratKirjaukset] = useState({})
  const [vahvistetutKirjaukset, setVahvistetutKirjaukset] = useState({})
  const [sopimusTilat, setSopimusTilat] = useState({})
  const [dropdownAuki, setDropdownAuki] = useState(false)
  const [kaikkiKommentit, setKaikkiKommentit] = useState([])
  const [kommenttiPopup, setKommenttiPopup] = useState(null)
  const selvitysKaikki = kategoriat.reduce((sum, k) => sum + k.sopimukset.length, 0)
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
      if (user.user_metadata?.tili_tyyppi === 'valmistelu') { router.replace('/valmistele/dashboard'); return }
      const { data: pesaData } = await supabase.from('kuolinpesat').select('*').eq('kayttaja_email', user.email).not('vainajan_nimi', 'is', null).neq('vainajan_nimi', '').order('created_at', { ascending: false }).limit(1).single()
      if (pesaData) {
        setKuolinpesa(pesaData)
        if (localStorage.getItem('uusi_kayttaja') === 'true') {
          localStorage.removeItem('uusi_kayttaja')
          setWelcomeNimi(pesaData.vainajan_nimi || '')
          setTimeout(() => setWelcomeFading(true), 3800)
          setTimeout(() => setNaytaWelcome(false), 5000)
        }
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
          const sorted = tehtavatData.filter(t => t.vaihe === 1).filter((t, i, arr) => arr.findIndex(x => x.nimi === t.nimi) === i).sort((a, b) => ['Tilaa virkatodistus','Selvitä onko testamentti','Ilmoita pankeille','Ilmoita Kelalle','Ilmoita työnantajalle ja taloyhtiölle','Ohjaa posti uuteen osoitteeseen','Hae henkivakuutuskorvaus'].indexOf(a.nimi) - ['Tilaa virkatodistus','Selvitä onko testamentti','Ilmoita pankeille','Ilmoita Kelalle','Ilmoita työnantajalle ja taloyhtiölle','Ohjaa posti uuteen osoitteeseen','Hae henkivakuutuskorvaus'].indexOf(b.nimi))
          const aloitus = sorted.findIndex(t => !t.tehty)
          setWizardIndeksi(aloitus >= 0 ? aloitus : 0)
          setWizardAlustettu(true)
        } else {
          const uudetTehtavat = oletusTehtavat.map(t => ({ ...t, tehty: false, kuolinpesa_id: pesaData.id }))
          const { data: luodut } = await supabase.from('tehtavat').insert(uudetTehtavat).select()
          if (luodut) { setTehtavaLista(luodut); setWizardIndeksi(0); setWizardAlustettu(true) }
        }
        const { data: kommentitData } = await supabase.from('kommentit').select('*').eq('kuolinpesa_id', pesaData.id).order('created_at', { ascending: false })
        if (kommentitData) setKaikkiKommentit(kommentitData)
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

  const jarjestys = ['Tilaa virkatodistus', 'Selvitä onko testamentti', 'Ilmoita pankeille', 'Ilmoita Kelalle', 'Ilmoita työnantajalle ja taloyhtiölle', 'Ohjaa posti uuteen osoitteeseen', 'Hae henkivakuutuskorvaus']
  const nykyisetTehtavat = tehtavaLista
    .filter(t => t.vaihe === aktiivinenVaihe)
    .filter((t, i, arr) => arr.findIndex(x => x.nimi === t.nimi) === i)
    .sort((a, b) => jarjestys.indexOf(a.nimi) - jarjestys.indexOf(b.nimi))
  const valmiit = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe && t.tehty).length
  const kaikki = tehtavaLista.filter(t => t.vaihe === aktiivinenVaihe).length

  const kommenttiMaara = (tyyppi, id) => kaikkiKommentit.filter(k => k.konteksti_tyyppi === tyyppi && k.konteksti_id === id).length

  const [aktiivisetNav, setAktiivisetNav] = React.useState('aloita')
  const [valittuVaihe, setValittuVaihe] = React.useState(null)

  const navPush = React.useCallback((osioId, extra = {}) => {
    window.history.pushState({ nav: osioId, ...extra }, '')
    setAktiivisetNav(osioId)
    if (extra.vaihe != null) { setAktiivinenVaihe(extra.vaihe); localStorage.setItem('aktiivinenVaihe', extra.vaihe) }
    if (extra.valittuVaihe !== undefined) setValittuVaihe(extra.valittuVaihe)
  }, [])

  React.useEffect(() => {
    window.history.replaceState({ nav: 'aloita' }, '')
    const handlePop = (e) => {
      const s = e.state
      if (!s) return
      if (s.nav) setAktiivisetNav(s.nav)
      if (s.vaihe != null) { setAktiivinenVaihe(s.vaihe); localStorage.setItem('aktiivinenVaihe', s.vaihe) }
      if (s.valittuVaihe !== undefined) setValittuVaihe(s.valittuVaihe)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const navItems = [
    {
      id: 'aloita', label: 'Aloita tästä',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>,
    },
    {
      id: 'tehtavat', label: 'Tehtävät',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9h18M7 13h2M7 16h5"/><circle cx="17" cy="14.5" r="2.5"/></svg>,
    },
    {
      id: 'viestit', label: 'Viestit',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    },
    {
      id: 'osakkaat', label: 'Osakkaat',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      id: 'tapahtumat', label: 'Tapahtumaloki',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
    },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#110E0B', color: '#F0EBE3', fontFamily: 'var(--font-body), sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '220px', flexShrink: 0,
        backgroundColor: '#0D0B09',
        borderRight: '1px solid rgba(201,168,76,0.28)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 40, overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(201,168,76,0.28)' }}>
          <button onClick={() => router.push('/')} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase',
            color: '#F0EBE3',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.color = '#F0EBE3'}
          >
            Pesänhoitaja
          </button>
        </div>

        {/* Navigaatio */}
        <nav style={{ padding: '8px 0', flex: 1 }}>
          {navItems.map(item => {
            const aktiivinen = aktiivisetNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => navPush(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  width: '100%', padding: '11px 20px',
                  background: aktiivinen ? 'rgba(201,168,76,0.08)' : 'none',
                  border: 'none',
                  borderLeft: aktiivinen ? '2px solid #C9A84C' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  textAlign: 'left',
                  color: aktiivinen ? '#C9A84C' : '#5A5248',
                }}
                onMouseEnter={e => { if (!aktiivinen) { e.currentTarget.style.background = 'rgba(240,235,227,0.04)'; e.currentTarget.style.color = '#8A8278' } }}
                onMouseLeave={e => { if (!aktiivinen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#5A5248' } }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                <span style={{
                  fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body), sans-serif',
                  color: aktiivinen ? '#F0EBE3' : 'inherit',
                }}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* ── OTA YHTEYTTÄ ── */}
        <div style={{ padding: '0 12px', marginBottom: '8px' }}>
          <button
            onClick={() => router.push('/ota-yhteytta')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '10px 8px',
              background: 'none', border: 'none', cursor: 'pointer',
              borderTop: '1px solid rgba(240,235,227,0.06)',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4E4840" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4E4840', fontFamily: 'var(--font-body), sans-serif' }}>
              Ota yhteyttä
            </span>
          </button>
        </div>

        {/* ── PESÄNI progress-kaari ── */}
        {kuolinpesa && (() => {
          const pv = Math.max(0, 90 - Math.floor((Date.now() - new Date(kuolinpesa.kuolinpaiva)) / 86400000))
          const tehty = tehtavaLista.filter(t => t.tehty).length
          const kaikki = tehtavaLista.length
          const pct = kaikki > 0 ? tehty / kaikki : 0
          const aktiivinen = aktiivisetNav === 'pesani'
          const r = 28, cx = 32, cy = 32
          const circumference = 2 * Math.PI * r
          const dashOffset = circumference * (1 - pct)
          const pctLabel = `${Math.round(pct * 100)}%`
          return (
            <button
              onClick={() => navPush('pesani')}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                width: '100%', padding: '16px 18px',
                background: aktiivinen ? 'rgba(201,168,76,0.07)' : 'none',
                outline: 'none', border: 'none',
                borderTop: '1px solid rgba(201,168,76,0.28)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.2s, box-shadow 0.2s',
                boxShadow: aktiivinen ? '0 0 32px rgba(201,168,76,0.12)' : 'none',
              }}
              onMouseEnter={e => {
                if (!aktiivinen) {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.06)'
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(201,168,76,0.14)'
                }
              }}
              onMouseLeave={e => {
                if (!aktiivinen) {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(240,235,227,0.06)" strokeWidth="3" />
                  <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="#C9A84C"
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                  <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="central"
                    fill="#C9A84C"
                    fontSize="13" fontFamily="var(--font-body), sans-serif" fontWeight="500" letterSpacing="0.02em"
                  >{pctLabel}</text>
                  <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central"
                    fill="#C9A84C"
                    fontSize="7.5" fontFamily="var(--font-body), sans-serif" letterSpacing="0.12em"
                  >VALMIS</text>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'var(--font-body), sans-serif', fontWeight: 500, marginBottom: '5px' }}>Pesäni</div>
                <div style={{ fontSize: '13px', fontFamily: 'var(--font-display), Georgia, serif', fontWeight: 400, color: '#F0EBE3', lineHeight: 1.2, marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {kuolinpesa.vainajan_nimi}
                </div>
                <div style={{ fontSize: '10px', color: pv < 14 ? '#C9A84C' : '#5A5248', letterSpacing: '0.03em' }}>
                  {kuolinpesa.kuolinpaiva ? `${pv} pv jäljellä` : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          )
        })()}
      </aside>

      {/* ── TOP BAR (kello + profiili) ── */}
      <TopBar />

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: '220px', flex: 1, minHeight: '100vh', padding: '40px 48px', paddingRight: '128px' }}>

        {/* ── ALOITA TÄSTÄ ── */}
        {aktiivisetNav === 'aloita' && (
          <div style={{ maxWidth: '680px' }}>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '10px' }}>Tervetuloa</div>
              <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#F0EBE3', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '16px' }}>
                Ennen kuin aloitat
              </h1>
              <p style={{ fontSize: '14px', color: '#7A7268', lineHeight: 1.85 }}>
                Tämä palvelu ohjaa sinut kuolinpesän hoitamisen läpi vaihe vaiheelta. Alla on lyhyt kuvaus prosessista ja muutama peruskysymys ennen kuin jatkat tehtäviin.
              </p>
            </div>

            {/* Avauskysymykset */}
            <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(201,168,76,0.25)', padding: '28px', marginBottom: '20px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>Tarkista ensin</div>
              <p style={{ fontSize: '13px', color: '#A09890', lineHeight: 1.7, marginBottom: '20px' }}>
                Nämä kolme asiaa hoidetaan yleensä ennen kuin kuolinpesän virallinen selvitys alkaa. Rastita ne jotka on jo hoidettu — näin tiedät mistä aloitat.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { kentta: 'hautajaiset', teksti: 'Hautajaiset on järjestetty', kuvaus: 'Hautaustoimisto tai seurakunta on yleensä auttanut tässä.' },
                  { kentta: 'kuolintodistus', teksti: 'Kuolintodistus on hankittu', kuvaus: 'Sairaala tai lääkäri on laatinut sen automaattisesti. Muista hankkia useampi kopio.' },
                  { kentta: 'laheiset', teksti: 'Läheiset on ilmoitettu', kuvaus: 'Tämä on henkilökohtainen asia jonka jokainen hoitaa omalla tavallaan.' },
                ].map(({ kentta, teksti, kuvaus }) => (
                  <div
                    key={kentta}
                    onClick={() => paivitaEsiTarkistus(kentta)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '14px 18px',
                      backgroundColor: esiTarkistukset[kentta] ? 'rgba(201,168,76,0.04)' : '#110E0B',
                      border: `1px solid ${esiTarkistukset[kentta] ? 'rgba(201,168,76,0.2)' : 'rgba(240,235,227,0.1)'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!esiTarkistukset[kentta]) e.currentTarget.style.borderColor = 'rgba(240,235,227,0.2)' }}
                    onMouseLeave={e => { if (!esiTarkistukset[kentta]) e.currentTarget.style.borderColor = 'rgba(240,235,227,0.1)' }}
                  >
                    <div style={{
                      width: '18px', height: '18px', flexShrink: 0, marginTop: '1px',
                      border: `2px solid ${esiTarkistukset[kentta] ? '#C9A84C' : '#5A5248'}`,
                      backgroundColor: esiTarkistukset[kentta] ? '#C9A84C' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {esiTarkistukset[kentta] && <span style={{ fontSize: '10px', color: '#110E0B', fontWeight: 700 }}>✓</span>}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', color: esiTarkistukset[kentta] ? '#5A5248' : '#D0C8BC', marginBottom: '3px', textDecoration: esiTarkistukset[kentta] ? 'line-through' : 'none' }}>{teksti}</p>
                      <p style={{ fontSize: '11px', color: '#7A7268', lineHeight: 1.5 }}>{kuvaus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Miten navigoida */}
            <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.15)', padding: '28px', marginBottom: '32px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>Miten tämä toimii</div>
              <p style={{ fontSize: '13px', color: '#A09890', lineHeight: 1.7, marginBottom: '20px' }}>
                Kuolinpesän hoitaminen etenee vaiheittain. Vasemmalta löydät <strong style={{ color: '#D0C8BC', fontWeight: 500 }}>Tehtävät</strong>-osion, joka on jaettu viiteen vaiheeseen — Ensitoimista Päätökseen. Etene vaiheesta toiseen omaan tahtiisi.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { num: '1', text: 'Klikkaa tehtävää avataksesi ohjeet ja kommentit oikealle paneelille.' },
                  { num: '2', text: 'Rastita tehtävä valmiiksi kun se on hoidettu — tilanne tallentuu automaattisesti.' },
                  { num: '3', text: 'Voit kutsua muut osakkaat mukaan Osakkaat-osiosta — kaikki näkevät saman tilanteen reaaliajassa.' },
                ].map(({ num, text }) => (
                  <div key={num} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#C9A84C', fontWeight: 600 }}>{num}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#A09890', lineHeight: 1.65, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button
                onClick={() => navPush('tehtavat')}
                style={{
                  fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#110E0B', backgroundColor: '#C9A84C',
                  border: 'none', padding: '15px 32px', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D4B55C'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A84C'}
              >Siirry tehtäviin →</button>
            </div>

          </div>
        )}

        {/* ── PESÄNI YHTEENVETO ── */}
        {aktiivisetNav === 'pesani' && (
          <div style={{ maxWidth: '800px' }}>

            {/* Otsikko */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '10px' }}>Kuolinpesä</div>
              <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#F0EBE3', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '8px' }}>
                {kuolinpesa?.vainajan_nimi || '—'}
              </h1>
              {kuolinpesa?.kuolinpaiva && (
                <div style={{ fontSize: '12px', color: '#7A7268', letterSpacing: '0.05em' }}>
                  {new Date(kuolinpesa.kuolinpaiva).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' · '}
                  <span style={{ color: '#C9A84C' }}>
                    {Math.max(0, 90 - Math.floor((Date.now() - new Date(kuolinpesa.kuolinpaiva)) / 86400000))} päivää perunkirjoitusaikaa jäljellä
                  </span>
                </div>
              )}
            </div>

            {/* Vaiheistatus — data lasketaan ensin, käytetään sekä korteissa että ympyröissä */}
            {(() => {
              const varatKaikki = varatJaVelatMuistilista.varat.length + varatJaVelatMuistilista.velat.length
              const varatKasitelty = Object.entries(varatRastitattu).filter(([, v]) => v === 'kylla' || v === 'ei').length
              const sopimusKasitelty = kategoriat.reduce((sum, k) => sum + k.sopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu' || sopimusTilat[s.nimi] === 'ei').length, 0)
              const sopimusKaikki = selvitysKaikki

              const vaiheetData = [
                {
                  numero: 1, nimi: 'Ensitoimet',
                  tehty: tehtavaLista.filter(t => t.vaihe === 1 && t.tehty).length,
                  kaikki: tehtavaLista.filter(t => t.vaihe === 1).length,
                  kuvaus: null,
                  kortit: [
                    { otsikko: 'Vaihe', arvo: '1 / 5', kuvaus: 'Ensitoimet' },
                    { otsikko: 'Tehtävät', arvo: `${tehtavaLista.filter(t => t.vaihe === 1 && t.tehty).length}/${tehtavaLista.filter(t => t.vaihe === 1).length}`, kuvaus: 'valmiina', pct: tehtavaLista.filter(t => t.vaihe === 1).length > 0 ? Math.round(tehtavaLista.filter(t => t.vaihe === 1 && t.tehty).length / tehtavaLista.filter(t => t.vaihe === 1).length * 100) : 0 },
                    { otsikko: 'Tila', arvo: tehtavaLista.filter(t => t.vaihe === 1 && t.tehty).length === tehtavaLista.filter(t => t.vaihe === 1).length && tehtavaLista.filter(t => t.vaihe === 1).length > 0 ? 'Valmis' : 'Kesken', kuvaus: null },
                  ]
                },
                {
                  numero: 2, nimi: 'Omaisuuden selvitys',
                  tehty: varatKasitelty + sopimusKasitelty,
                  kaikki: varatKaikki + sopimusKaikki,
                  kuvaus: `Varat ja velat ${varatKasitelty}/${varatKaikki} · Sopimukset ${sopimusKasitelty}/${sopimusKaikki}`,
                  kortit: [
                    { otsikko: 'Vaihe', arvo: '2 / 5', kuvaus: 'Omaisuuden selvitys' },
                    { otsikko: 'Varat ja velat', arvo: `${varatKasitelty}/${varatKaikki}`, kuvaus: 'tarkistettu', pct: varatKaikki > 0 ? Math.round(varatKasitelty / varatKaikki * 100) : 0 },
                    { otsikko: 'Sopimukset', arvo: `${sopimusKasitelty}/${sopimusKaikki}`, kuvaus: 'hoidettu', pct: sopimusKaikki > 0 ? Math.round(sopimusKasitelty / sopimusKaikki * 100) : 0 },
                  ]
                },
                {
                  numero: 3, nimi: 'Perunkirjoitus',
                  tehty: tehtavaLista.filter(t => t.vaihe === 3 && t.tehty).length,
                  kaikki: perunkirjoitusTehtavat.length,
                  kuvaus: null,
                  kortit: [
                    { otsikko: 'Vaihe', arvo: '3 / 5', kuvaus: 'Perunkirjoitus' },
                    { otsikko: 'Tehtävät', arvo: `${tehtavaLista.filter(t => t.vaihe === 3 && t.tehty).length}/${perunkirjoitusTehtavat.length}`, kuvaus: 'valmiina', pct: Math.round(tehtavaLista.filter(t => t.vaihe === 3 && t.tehty).length / perunkirjoitusTehtavat.length * 100) },
                    { otsikko: 'Deadline', arvo: kuolinpesa?.kuolinpaiva ? `${Math.max(0, 90 - Math.floor((Date.now() - new Date(kuolinpesa.kuolinpaiva)) / 86400000))} pv` : '—', kuvaus: 'perunkirjoitusaikaa jäljellä' },
                  ]
                },
                {
                  numero: 4, nimi: 'Hoito ja toimeenpano', tehty: 0, kaikki: perintoveroTehtavat.length + toimeenpanoTehtavat.length, kuvaus: null,
                  kortit: [
                    { otsikko: 'Vaihe', arvo: '4 / 5', kuvaus: 'Hoito ja toimeenpano' },
                    { otsikko: 'Tehtävät', arvo: `0/${perintoveroTehtavat.length + toimeenpanoTehtavat.length}`, kuvaus: 'valmiina', pct: 0 },
                    { otsikko: 'Sisältää', arvo: '3 osiota', kuvaus: 'perintövero · jako · toimeenpano' },
                  ]
                },
                {
                  numero: 5, nimi: 'Päätös', tehty: 0, kaikki: 0, kuvaus: null,
                  kortit: [
                    { otsikko: 'Vaihe', arvo: '5 / 5', kuvaus: 'Päätös' },
                    { otsikko: 'Tila', arvo: 'Odottaa', kuvaus: 'aiemmat vaiheet kesken' },
                    { otsikko: 'Toiminto', arvo: 'Sulje pesä', kuvaus: 'viimeinen vaihe' },
                  ]
                },
              ]

              // Kortit — vaihdetaan valitun vaiheen mukaan
              const valittuData = vaiheetData.find(v => v.numero === valittuVaihe)
              const korttiData = valittuData ? valittuData.kortit : [
                { otsikko: 'Aktiivinen vaihe', arvo: vaiheet[aktiivinenVaihe - 1]?.nimi || '—', kuvaus: `vaihe ${aktiivinenVaihe}/${vaiheet.length}` },
                { otsikko: 'Tehtävät', arvo: `${tehtavaLista.filter(t => t.tehty).length}/${tehtavaLista.length}`, kuvaus: 'valmiina', pct: tehtavaLista.length > 0 ? Math.round(tehtavaLista.filter(t => t.tehty).length / tehtavaLista.length * 100) : 0 },
                { otsikko: 'Osakkaat', arvo: '—', kuvaus: 'ei tietoa vielä' },
              ]

              return (<>
              {/* Tilakortit */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'rgba(201,168,76,0.2)', marginBottom: '32px', transition: 'all 0.2s' }}>
                {korttiData.map((kortti, i) => (
                  <div key={i} style={{ backgroundColor: '#0D0B09', padding: '24px 28px' }}>
                    <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>{kortti.otsikko}</div>
                    <div style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '22px', fontWeight: 300, color: '#F0EBE3', marginBottom: '4px', lineHeight: 1.2 }}>{kortti.arvo}</div>
                    <div style={{ fontSize: '11px', color: '#7A7268' }}>{kortti.kuvaus}</div>
                    {kortti.pct !== undefined && kortti.pct !== null && (
                      <div style={{ marginTop: '12px', height: '2px', backgroundColor: 'rgba(240,235,227,0.1)', borderRadius: '1px' }}>
                        <div style={{ height: '2px', backgroundColor: '#C9A84C', width: `${kortti.pct}%`, borderRadius: '1px', transition: 'width 0.4s ease' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(201,168,76,0.25)', padding: '32px 28px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '32px' }}>Prosessin eteneminen</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    {vaiheetData.map((v, i) => {
                      const pct = v.kaikki > 0 ? (v.tehty / v.kaikki) * 100 : 0
                      const valmis = v.kaikki > 0 && v.tehty === v.kaikki
                      const valittu = valittuVaihe === v.numero
                      const r = 30, cx = 34, cy = 34
                      const circumference = 2 * Math.PI * r
                      const dashOffset = circumference * (1 - pct / 100)
                      const nimiVari = valittu ? '#C9A84C' : valmis ? '#5A5248' : '#3A3630'
                      const glow = 'drop-shadow(0 0 14px rgba(201,168,76,0.9)) drop-shadow(0 0 28px rgba(201,168,76,0.5))'

                      return (
                        <React.Fragment key={v.numero}>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative' }}
                            onClick={() => setValittuVaihe(valittu ? null : v.numero)}
                            onMouseEnter={e => { e.currentTarget.querySelector('svg').style.filter = glow }}
                            onMouseLeave={e => { e.currentTarget.querySelector('svg').style.filter = valittu ? glow : 'none' }}
                          >
                            {/* Ympyrä */}
                            <svg width="68" height="68" viewBox="0 0 68 68" style={{ filter: valittu ? glow : 'none', transition: 'filter 0.2s' }}>
                              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(240,235,227,0.06)" strokeWidth="3" />
                              {v.kaikki > 0 && (
                                <circle cx={cx} cy={cy} r={r} fill="none"
                                  stroke={valittu || valmis ? '#C9A84C' : 'rgba(201,168,76,0.3)'}
                                  strokeWidth="3" strokeLinecap="round"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={dashOffset}
                                  transform={`rotate(-90 ${cx} ${cy})`}
                                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                                />
                              )}
                              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                                fill={valittu ? '#C9A84C' : valmis ? '#C9A84C' : '#3A3630'}
                                fontSize="12" fontFamily="var(--font-body), sans-serif" fontWeight="500">
                                {valmis ? '✓' : v.kaikki > 0 ? `${v.tehty}/${v.kaikki}` : '—'}
                              </text>
                            </svg>

                            {/* Nimi */}
                            <span style={{ fontSize: '10px', letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.4, color: nimiVari, transition: 'color 0.2s' }}>
                              {v.nimi}
                            </span>
                          </div>

                          {/* Viiva ympyröiden välissä */}
                          {i < vaiheetData.length - 1 && (
                            <div style={{ flexShrink: 0, width: '20px', height: '1px', backgroundColor: 'rgba(240,235,227,0.08)', marginTop: '34px' }} />
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>

                  {/* Valitun vaiheen nappi */}
                  {valittuVaihe && (() => {
                    const v = vaiheetData.find(v => v.numero === valittuVaihe)
                    if (!v) return null
                    return (
                      <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(240,235,227,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#7A7268' }}>{v.nimi}</span>
                          {v.kaikki > 0 && <span style={{ fontSize: '12px', color: '#4E4840', marginLeft: '10px' }}>{v.tehty}/{v.kaikki} tehty</span>}
                        </div>
                        <button
                          onClick={() => navPush('tehtavat', { vaihe: v.numero, valittuVaihe: null })}
                          style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#110E0B', backgroundColor: '#C9A84C', border: 'none', padding: '9px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D4B55C'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A84C'}
                        >
                          {v.tehty === 0 ? 'Aloita osio →' : v.tehty === v.kaikki ? 'Tarkastele osiota →' : 'Jatka osiota →'}
                        </button>
                      </div>
                    )
                  })()}
                </div>
              </>)
            })()}

          </div>
        )}

        {/* ── TEHTÄVÄT ── */}
        {aktiivisetNav === 'tehtavat' && (
        <div className="flex-1 min-w-0">

            <div className="mb-10 p-6 rounded-lg" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.08)'}}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold">Edistyminen</span>
                <span style={{color: '#C9A84C'}} className="text-sm font-bold">
                  {aktiivinenVaihe === 2 ? `${selvitysHoidettu}/${selvitysKaikki} hoidettu` : `${valmiit}/${kaikki} tehtävää`}
                </span>
              </div>
              <div className="w-full rounded-full h-2" style={{backgroundColor: '#110E0B'}}>
                <div className="h-2 rounded-full transition-all" style={{backgroundColor: '#C9A84C', width: aktiivinenVaihe === 2 ? `${(selvitysHoidettu/selvitysKaikki)*100}%` : kaikki > 0 ? `${(valmiit/kaikki)*100}%` : '0%'}} />
              </div>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto">
              {vaiheet.map(v => (
                <button key={v.numero} onClick={() => { setAktiivinenVaihe(v.numero); localStorage.setItem('aktiivinenVaihe', v.numero) }} className="flex-1 py-3 px-4 rounded text-sm font-bold whitespace-nowrap"
                  style={{backgroundColor: aktiivinenVaihe === v.numero ? '#C9A84C' : '#1C1916', color: aktiivinenVaihe === v.numero ? '#110E0B' : '#8A8278', border: '1px solid', borderColor: aktiivinenVaihe === v.numero ? '#C9A84C' : 'rgba(240,235,227,0.08)'}}>
                  {v.numero}. {v.nimi}
                </button>
              ))}
            </div>

            <div className="rounded-lg p-6" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.08)'}}>
  <h2 className="text-white font-bold text-lg mb-6">Vaihe {aktiivinenVaihe}: {vaiheet[aktiivinenVaihe-1].nimi}</h2>

  {aktiivinenVaihe === 1 && nykyisetTehtavat.length > 0 && (() => {
    const tehtava = nykyisetTehtavat[wizardIndeksi] || nykyisetTehtavat[0]
    const ohje = ohjeet[tehtava?.nimi]
    if (!tehtava || !ohje) return null
    const valmiitMaara = nykyisetTehtavat.filter(t => t.tehty).length
    const kaikkiTehty = valmiitMaara === nykyisetTehtavat.length
    return (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

        {/* Wizard pääsisältö */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Progress pisteet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4E4840', flexShrink: 0 }}>
              {wizardIndeksi + 1} / {nykyisetTehtavat.length}
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {nykyisetTehtavat.map((t, i) => (
                <button key={t.id} onClick={() => setWizardIndeksi(i)} style={{
                  width: i === wizardIndeksi ? '24px' : '8px',
                  height: '8px', borderRadius: '4px',
                  backgroundColor: t.tehty ? '#C9A84C' : i === wizardIndeksi ? 'rgba(201,168,76,0.5)' : 'rgba(240,235,227,0.1)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s ease', padding: 0,
                }} title={t.nimi} />
              ))}
            </div>
          </div>

          {/* Otsikko */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                fontWeight: 300, lineHeight: 1.2,
                color: tehtava.tehty ? '#5A5248' : '#F0EBE3',
                letterSpacing: '-0.02em',
                textDecoration: tehtava.tehty ? 'line-through' : 'none',
              }}>{tehtava.nimi}</h2>
              {ohje.kiireellinen && (
                <span style={{
                  fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
                  backgroundColor: '#7C3333', color: '#FCA5A5',
                  padding: '4px 10px', flexShrink: 0, marginTop: '6px',
                }}>Kiireellinen</span>
              )}
            </div>
          </div>

          {/* Miksi */}
          <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.07)', padding: '20px 24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4E4840', marginBottom: '10px' }}>Miksi tämä tehdään</div>
            <p style={{ fontSize: '14px', color: '#8A8278', lineHeight: 1.8 }}>{ohje.miksi}</p>
          </div>

          {/* Miten */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4E4840', marginBottom: '20px' }}>Miten tehdään</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ohje.miten.map((askel, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '10px', color: '#C9A84C', flexShrink: 0, letterSpacing: '0.1em', fontFamily: 'var(--font-body)', marginTop: '3px', minWidth: '18px' }}>{i + 1}.</span>
                  <span style={{ fontSize: '14px', color: '#D0C8BC', lineHeight: 1.75 }}>{askel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigointipainikkeet */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setWizardIndeksi(Math.max(0, wizardIndeksi - 1))}
              disabled={wizardIndeksi === 0}
              style={{
                fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: wizardIndeksi === 0 ? '#2A2520' : '#5A5248',
                background: 'none',
                border: `1px solid ${wizardIndeksi === 0 ? 'rgba(240,235,227,0.04)' : 'rgba(240,235,227,0.1)'}`,
                padding: '13px 18px', cursor: wizardIndeksi === 0 ? 'default' : 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { if (wizardIndeksi > 0) e.currentTarget.style.borderColor = 'rgba(240,235,227,0.22)' }}
              onMouseLeave={e => { if (wizardIndeksi > 0) e.currentTarget.style.borderColor = 'rgba(240,235,227,0.1)' }}
            >← Edellinen</button>

            <button
              onClick={async () => {
                await merkitseTehdyksi(tehtava.id, tehtava.tehty)
                if (!tehtava.tehty && wizardIndeksi < nykyisetTehtavat.length - 1) {
                  setTimeout(() => setWizardIndeksi(wizardIndeksi + 1), 150)
                }
              }}
              style={{
                flex: 1, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: tehtava.tehty ? '#7A7268' : '#110E0B',
                backgroundColor: tehtava.tehty ? 'transparent' : '#C9A84C',
                border: `1px solid ${tehtava.tehty ? 'rgba(240,235,227,0.1)' : '#C9A84C'}`,
                padding: '13px 24px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!tehtava.tehty) e.currentTarget.style.backgroundColor = '#D4B55C'; else e.currentTarget.style.borderColor = 'rgba(240,235,227,0.2)' }}
              onMouseLeave={e => { if (!tehtava.tehty) e.currentTarget.style.backgroundColor = '#C9A84C'; else e.currentTarget.style.borderColor = 'rgba(240,235,227,0.1)' }}
            >
              {tehtava.tehty ? '↺ Merkitse tekemättömäksi' : '✓ Merkitse tehdyksi'}
            </button>

            {wizardIndeksi < nykyisetTehtavat.length - 1 && (
              <button
                onClick={() => setWizardIndeksi(wizardIndeksi + 1)}
                style={{
                  fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#5A5248', background: 'none',
                  border: '1px solid rgba(240,235,227,0.1)',
                  padding: '13px 18px', cursor: 'pointer', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(240,235,227,0.22)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,235,227,0.1)'}
              >Seuraava →</button>
            )}
          </div>

          {/* Kaikki tehty -banneri */}
          {kaikkiTehty && (
            <div style={{ marginTop: '28px', padding: '20px 24px', backgroundColor: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.18)' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '8px' }}>Kaikki ensitoimet hoidettu</div>
              <p style={{ fontSize: '13px', color: '#8A8278', marginBottom: '16px', lineHeight: 1.6 }}>Hyvää työtä. Seuraavaksi käydään läpi vainajan varat, velat ja sopimukset.</p>
              <button
                onClick={() => { setAktiivinenVaihe(2); localStorage.setItem('aktiivinenVaihe', 2) }}
                style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#110E0B', backgroundColor: '#C9A84C', border: 'none', padding: '13px 24px', cursor: 'pointer' }}
              >Siirry omaisuuden selvitykseen →</button>
            </div>
          )}
        </div>

        {/* Oikea paneeli: tehtäväkartta */}
        <div style={{ width: '228px', flexShrink: 0, position: 'sticky', top: '20px', alignSelf: 'flex-start' }}>
          <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.07)', padding: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4E4840', marginBottom: '4px' }}>Ensitoimet</div>
            <div style={{ fontSize: '11px', color: '#C9A84C', marginBottom: '18px', letterSpacing: '0.04em' }}>
              {valmiitMaara} / {nykyisetTehtavat.length} tehty
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {nykyisetTehtavat.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setWizardIndeksi(i)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '9px 0 9px 10px', width: '100%',
                    background: 'none', border: 'none',
                    borderLeft: `2px solid ${i === wizardIndeksi ? '#C9A84C' : t.tehty ? 'rgba(201,168,76,0.25)' : 'transparent'}`,
                    cursor: 'pointer', textAlign: 'left',
                    borderBottom: i < nykyisetTehtavat.length - 1 ? '1px solid rgba(240,235,227,0.04)' : 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => { if (i !== wizardIndeksi) e.currentTarget.style.borderLeftColor = 'rgba(201,168,76,0.18)' }}
                  onMouseLeave={e => { if (i !== wizardIndeksi) e.currentTarget.style.borderLeftColor = t.tehty ? 'rgba(201,168,76,0.25)' : 'transparent' }}
                >
                  <div style={{
                    width: '13px', height: '13px', flexShrink: 0, marginTop: '2px',
                    border: `1px solid ${t.tehty ? '#C9A84C' : i === wizardIndeksi ? 'rgba(201,168,76,0.45)' : 'rgba(240,235,227,0.12)'}`,
                    backgroundColor: t.tehty ? '#C9A84C' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {t.tehty && <span style={{ fontSize: '8px', color: '#110E0B', fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: '11px', lineHeight: 1.45,
                    color: t.tehty ? '#3A3630' : i === wizardIndeksi ? '#F0EBE3' : '#4E4840',
                    textDecoration: t.tehty ? 'line-through' : 'none',
                  }}>{t.nimi}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    )
  })()}

{aktiivinenVaihe === 2 && (
  <>
    <div className="flex gap-2 mb-6">
      {alivaiheet.map(a => (
        <button key={a.numero} onClick={() => { setAktiivinenAlivaihe(a.numero); localStorage.setItem('aktiivinenAlivaihe', a.numero) }} className="flex-1 py-2 px-4 rounded text-sm font-bold"
          style={{backgroundColor: aktiivinenAlivaihe === a.numero ? '#C9A84C' : '#110E0B', color: aktiivinenAlivaihe === a.numero ? '#110E0B' : '#8A8278', border: '1px solid', borderColor: aktiivinenAlivaihe === a.numero ? '#C9A84C' : 'rgba(240,235,227,0.08)'}}>
          {a.numero}. {a.nimi}
        </button>
      ))}
    </div>
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        {aktiivinenAlivaihe === 1 && <VaratJaVelat rastitattu={varatRastitattu} onToggle={toggleVaraRasti} kirjaukset={varatKirjaukset} onKirjaus={tallennaKirjaus} vahvistetut={vahvistetutKirjaukset} onVahvista={tallennaVahvistettu} onPoista={poistaVahvistettu} avattuKohta={avattuKohta} setAvattuKohta={setAvattuKohta} kommenttiMaara={kommenttiMaara} onAvaPopup={setKommenttiPopup} kuolinpesaId={kuolinpesa?.id} kayttajaEmail={kuolinpesa?.kayttaja_email} onKommenttiLisatty={(k) => setKaikkiKommentit(prev => [k, ...prev])} />}
        {aktiivinenAlivaihe === 2 && <SelvitysOsio onValmis={() => { setAktiivinenAlivaihe(3); localStorage.setItem('aktiivinenAlivaihe', 3) }} onEdistyminen={setSelvitysHoidettu} avattuSopimus={avattuSopimus} setAvattuSopimus={setAvattuSopimus} sopimusTilat={sopimusTilat} tallennaSopimusTila={tallennaSopimusTila} />}
        {aktiivinenAlivaihe === 3 && <Yhteenveto varatRastitattu={varatRastitattu} vahvistetutKirjaukset={vahvistetutKirjaukset} sopimusTilat={sopimusTilat} tallennaSopimusTila={tallennaSopimusTila} onValmis={() => { setAktiivinenVaihe(3); localStorage.setItem('aktiivinenVaihe', 3) }} />}
      </div>
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

{aktiivinenVaihe === 4 && (
  <HoitoJaToimeenpanoOsio
    kuolinpesa={kuolinpesa}
    vahvistetutKirjaukset={vahvistetutKirjaukset}
    varatRastitattu={varatRastitattu}
  />
)}
{aktiivinenVaihe === 5 && (
  <PaatosOsio
    kuolinpesa={kuolinpesa}
    sopimusTilat={sopimusTilat}
    varatRastitattu={varatRastitattu}
    tehtavaLista={tehtavaLista}
  />
)}
            </div>


          </div>

        )}

        {/* ── OSAKKAAT ── */}
        {aktiivisetNav === 'osakkaat' && (
          <div style={{ maxWidth: '680px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '10px' }}>Yhteistyö</div>
              <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#F0EBE3', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '16px' }}>
                Osakkaat
              </h1>
              <p style={{ fontSize: '14px', color: '#7A7268', lineHeight: 1.85 }}>
                Kuolinpesällä voi olla useita osakkaita — leski, lapset, tai muut perilliset. Kutsu heidät mukaan niin kaikki näkevät saman tilanteen reaaliajassa.
              </p>
            </div>

            <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(201,168,76,0.25)', padding: '28px', marginBottom: '20px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Kutsu osakas</div>
              <p style={{ fontSize: '13px', color: '#A09890', lineHeight: 1.7, marginBottom: '20px' }}>
                Lisää sähköpostiosoite — henkilö saa kutsun ja voi kirjautua sisään omilla tunnuksillaan. Jokaisella on täysi pääsy kaikkiin osioihin.
              </p>
              <KutsuJasen kuolinpesaId={kuolinpesa?.id} />
            </div>

            <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.15)', padding: '28px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '10px' }}>Miten jaettu dashboard toimii</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { num: '1', text: 'Jokainen osakas kirjautuu omilla tunnuksillaan — ei jaettuja salasanoja.' },
                  { num: '2', text: 'Kaikki muutokset (tehtävät, kirjaukset, sopimukset) näkyvät kaikille reaaliajassa.' },
                  { num: '3', text: 'Viestit-osiossa voi kommunikoida koko tiimin kesken tai jättää kommentteja yksittäisiin tehtäviin.' },
                ].map(({ num, text }) => (
                  <div key={num} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#C9A84C', fontWeight: 600 }}>{num}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#A09890', lineHeight: 1.65, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VIESTIT ── */}
        {aktiivisetNav === 'viestit' && (
          <ViestitNakyma
            kuolinpesaId={kuolinpesa?.id}
            kayttajaEmail={kuolinpesa?.kayttaja_email}
            onKommenttiLisatty={(k) => setKaikkiKommentit(prev => [k, ...prev])}
            onAvaPopup={setKommenttiPopup}
            kaikkiKommentit={kaikkiKommentit}
          />
        )}

      </main>

      {/* ── WELCOME OVERLAY ── */}
      {naytaWelcome && (
        <>
          <style>{`
            @keyframes welcomeFadeUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes welcomeLineGrow {
              from { width: 0; }
              to   { width: 100%; }
            }
            .welcome-text {
              animation: welcomeFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both;
            }
            .welcome-sub {
              animation: welcomeFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both;
            }
            .welcome-line {
              animation: welcomeLineGrow 0.8s cubic-bezier(0.22,1,0.36,1) 1.1s both;
            }
          `}</style>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            backgroundColor: '#0A0806',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: welcomeFading ? 0 : 1,
            transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
            background: '#0A0806',
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ width: '500px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
              </div>
            {welcomeNimi && (
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px', opacity: 0.7, animation: 'welcomeFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
                  Kuolinpesä luotu
                </div>
                <p className="welcome-text" style={{
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontSize: '28px', fontWeight: 300, color: '#F0EBE3',
                  letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: '0',
                  textShadow: '0 0 40px rgba(201,168,76,0.25)',
                }}>
                  {welcomeNimi} kuolinpesä on luotu.
                </p>
                <div style={{ position: 'relative', height: '1px', marginTop: '16px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div className="welcome-line" style={{ height: '1px', backgroundColor: '#C9A84C', opacity: 0.5, position: 'absolute', left: 0, top: 0 }} />
                </div>
                <p className="welcome-sub" style={{ fontSize: '13px', color: '#5A5248', letterSpacing: '0.04em' }}>
                  Ohjaamme sinut läpi kaiken mitä pitää hoitaa.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── KOMMENTTI POPUP ── */}
      {kommenttiPopup && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setKommenttiPopup(null)}>
          <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(201,168,76,0.3)', maxWidth: '520px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(240,235,227,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '4px' }}>{kommenttiPopup.kategoriaNimi}</div>
                <h3 style={{ fontSize: '15px', color: '#F0EBE3', fontFamily: 'var(--font-display), Georgia, serif', fontWeight: 400 }}>{kommenttiPopup.nimi}</h3>
              </div>
              <button onClick={() => setKommenttiPopup(null)} style={{ color: '#4E4840', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              <KommenttiKentta
                kuolinpesaId={kuolinpesa?.id}
                kayttajaEmail={kuolinpesa?.kayttaja_email}
                kontekstiTyyppi={kommenttiPopup.tyyppi}
                kontekstiId={kommenttiPopup.id}
                onKommenttiLisatty={(k) => setKaikkiKommentit(prev => [k, ...prev])}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KommenttiKentta({ kuolinpesaId, kayttajaEmail, kontekstiTyyppi = 'yleinen', kontekstiId = null, onKommenttiLisatty, kompakti = false }) {
  const [kommentit, setKommentit] = useState([])
  const [uusi, setUusi] = useState('')

  useEffect(() => {
    if (!kuolinpesaId) return
    const hae = async () => {
      let q = supabase.from('kommentit').select('*').eq('kuolinpesa_id', kuolinpesaId).eq('konteksti_tyyppi', kontekstiTyyppi)
      if (kontekstiId) q = q.eq('konteksti_id', kontekstiId)
      else q = q.is('konteksti_id', null)
      const { data } = await q.order('created_at', { ascending: false })
      if (data) setKommentit(data)
    }
    hae()
  }, [kuolinpesaId, kontekstiTyyppi, kontekstiId])

  const laheta = async () => {
    if (!uusi.trim()) return
    const { data } = await supabase.from('kommentit').insert({
      kuolinpesa_id: kuolinpesaId,
      konteksti_tyyppi: kontekstiTyyppi,
      konteksti_id: kontekstiId || null,
      kirjoittaja_email: kayttajaEmail,
      teksti: uusi,
    }).select().single()
    if (data) {
      setKommentit([data, ...kommentit])
      setUusi('')
      if (onKommenttiLisatty) onKommenttiLisatty(data)
    }
  }

  return (
    <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={uusi}
          onChange={e => setUusi(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && laheta()}
          placeholder="Kirjoita viesti..."
          style={{ flex: 1, backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.15)', color: '#F0EBE3', fontSize: '13px', padding: '10px 14px', outline: 'none', fontFamily: 'var(--font-body)' }}
        />
        <button onClick={laheta} style={{ backgroundColor: '#C9A84C', color: '#110E0B', border: 'none', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>→</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: kompakti ? '240px' : '400px', overflowY: 'auto' }}>
        {kommentit.length === 0 && <p style={{ color: '#7A7268', fontSize: '12px' }}>Ei vielä viestejä.</p>}
        {kommentit.map(k => (
          <div key={k.id} style={{ backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.12)', padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: 600 }}>{k.kirjoittaja_email}</span>
              <span style={{ color: '#5A5248', fontSize: '11px' }}>{new Date(k.created_at).toLocaleDateString('fi-FI')} {new Date(k.created_at).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p style={{ color: '#D0C8BC', fontSize: '13px', lineHeight: 1.5 }}>{k.teksti}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ViestitNakyma({ kuolinpesaId, kayttajaEmail, onKommenttiLisatty, onAvaPopup, kaikkiKommentit }) {
  const osioNimiMap = {
    'pankkivarat': '🏦 Pankkivarat',
    'sijoitukset': '📈 Sijoitukset',
    'kiinteistot': '🏠 Kiinteistöt',
    'ajoneuvot': '🚗 Ajoneuvot',
    'muu-arvo-omaisuus': '💎 Muu arvo-omaisuus',
    'saatavat': '📋 Saatavat',
    'asuminen-liikenne': '🏠 Asuminen ja liikenne',
    'vakuutukset': '🛡️ Vakuutukset',
    'tilaukset-media': '📺 Tilaukset ja media',
    'jasenydet': '🤝 Jäsenyydet',
    'hoiva-terveys': '🏥 Hoiva ja terveys',
    'digitaaliset': '💻 Digitaaliset tilit',
  }
  const osiokohtaiset = kaikkiKommentit.filter(k => k.konteksti_tyyppi !== 'yleinen' && k.konteksti_id)
  const ryhmitelty = osiokohtaiset.reduce((acc, k) => {
    const avain = `${k.konteksti_tyyppi}::${k.konteksti_id}`
    if (!acc[avain]) acc[avain] = { tyyppi: k.konteksti_tyyppi, id: k.konteksti_id, nimi: osioNimiMap[k.konteksti_id] || k.konteksti_id, kommentit: [] }
    acc[avain].kommentit.push(k)
    return acc
  }, {})

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '10px' }}>Viestit</div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '28px', fontWeight: 300, color: '#F0EBE3', letterSpacing: '-0.02em' }}>Tiimin viestit</h1>
      </div>

      {/* Yleiset */}
      <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(201,168,76,0.25)', padding: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px' }}>Yleiset viestit</div>
        <p style={{ fontSize: '12px', color: '#A09890', marginBottom: '0' }}>Vapaa viestintä koko tiimille — ei liity tiettyyn osioon</p>
        <KommenttiKentta
          kuolinpesaId={kuolinpesaId}
          kayttajaEmail={kayttajaEmail}
          kontekstiTyyppi="yleinen"
          kontekstiId={null}
          onKommenttiLisatty={onKommenttiLisatty}
        />
      </div>

      {/* Osiokohtaiset */}
      <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.15)', padding: '24px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Osiokohtaiset viestit</div>
        {Object.keys(ryhmitelty).length === 0 ? (
          <p style={{ fontSize: '12px', color: '#7A7268' }}>Ei vielä osiokohtaisia viestejä. Voit jättää viestin suoraan tehtävän tai omaisuuskohdan yhteydessä.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {Object.values(ryhmitelty).map(osio => (
              <button key={`${osio.tyyppi}::${osio.id}`}
                onClick={() => onAvaPopup({ tyyppi: osio.tyyppi, id: osio.id, nimi: osio.nimi, kategoriaNimi: osio.tyyppi === 'tehtava' ? 'Tehtävä' : 'Omaisuuden selvitys' })}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0D0B09', padding: '14px 16px', border: 'none', borderBottom: '1px solid rgba(240,235,227,0.04)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#131109'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0D0B09'}
              >
                <span style={{ fontSize: '13px', color: '#D0C8BC' }}>{osio.nimi}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span style={{ fontSize: '11px', color: '#C9A84C' }}>{osio.kommentit.length}</span>
                </div>
              </button>
            ))}
          </div>
        )}
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
    <div className="rounded-lg p-4" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.08)'}}>
      <h3 className="text-white font-bold mb-4">📋 Tapahtumaloki</h3>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {tapahtumat.length === 0 && <p style={{color: '#4E4840'}} className="text-xs">Ei vielä tapahtumia.</p>}
        {tapahtumat.map((t) => (
          <div key={t.id} className="p-2 rounded" style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}}>
            <p className="text-white text-xs">{t.teksti}</p>
            <div className="flex items-center justify-between mt-1">
              <span style={{color: '#8A7A54'}} className="text-xs">{t.kirjoittaja_email}</span>
              <span style={{color: '#4E4840'}} className="text-xs">{new Date(t.created_at).toLocaleDateString('fi-FI')} {new Date(t.created_at).toLocaleTimeString('fi-FI', {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VaratJaVelat({ rastitattu, onToggle, kirjaukset, onKirjaus, vahvistetut, onVahvista, onPoista, avattuKohta, setAvattuKohta, kommenttiMaara, onAvaPopup, kuolinpesaId, kayttajaEmail, onKommenttiLisatty }) {
  const [valittuKategoria, setValittuKategoria] = useState(null)

  const varatKategoriat = [
    { id: 'pankkivarat', otsikko: '🏦 Pankkivarat', kohteet: ['pankkitilit', 'tallelokero', 'ulkomaantilit'] },
    { id: 'sijoitukset', otsikko: '📈 Sijoitukset', kohteet: ['sijoitukset', 'ps-tili', 'joukkovelkakirjat', 'krypto', 'elakesaastot'] },
    { id: 'kiinteistot', otsikko: '🏠 Kiinteistöt', kohteet: ['asunnot', 'mokki', 'metsa', 'tontti', 'maatila', 'autotalli'] },
    { id: 'ajoneuvot', otsikko: '🚗 Ajoneuvot', kohteet: ['ajoneuvot', 'peravaunu', 'tyokone'] },
    { id: 'muu-arvo-omaisuus', otsikko: '💎 Muu arvo-omaisuus', kohteet: ['kateinen', 'korut', 'jalometallit', 'taide', 'antiikki', 'soittimet', 'asekokoelma', 'viinikokoelma', 'arvoesineet'] },
    { id: 'saatavat', otsikko: '📋 Saatavat', kohteet: ['veronpalautus', 'lomarahat', 'vakuutuskorvaukset', 'vuokravakuus', 'myyntisaatavat', 'osuuskunnat'] },
  ]

  const velatKategoriat = [
    { id: 'lainat', otsikko: '🏦 Lainat', kohteet: ['asuntolaina', 'autolaina', 'opintolaina', 'muupankkilaina'] },
    { id: 'luotot', otsikko: '💳 Luotot', kohteet: ['kulutusluotot', 'osamaksut'] },
    { id: 'muutvelat', otsikko: '📄 Muut velat', kohteet: ['takaukset', 'maksamattomat', 'verorästit', 'vuokrarästit', 'yksityisvelat'] },
  ]

  const renderKorttiRyhma = (ryhmaOtsikko, kategoriat, lista, etuliite = '') => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '14px' }}>{ryhmaOtsikko}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(240,235,227,0.06)' }}>
        {kategoriat.map(kat => {
          const kohteet = lista.filter(k => kat.kohteet.includes(k.id))
          const kyllaMaara = kohteet.filter(k => rastitattu[etuliite + k.id] === 'kylla').length
          const kasitelty = kohteet.filter(k => rastitattu[etuliite + k.id] === 'kylla' || rastitattu[etuliite + k.id] === 'ei').length
          const valmis = kyllaMaara === kohteet.length && kyllaMaara > 0
          const emoji = kat.otsikko.slice(0, 2)
          const nimi = kat.otsikko.slice(3)
          return (
            <div key={kat.id}
              onClick={() => setValittuKategoria({ ...kat, lista, etuliite })}
              style={{ padding: '22px 18px', cursor: 'pointer', backgroundColor: '#110E0B', border: `1px solid ${valmis ? 'rgba(201,168,76,0.35)' : 'transparent'}`, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#161210'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#110E0B'}
            >
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>{emoji}</div>
              <div style={{ fontSize: '13px', color: '#F0EBE3', fontWeight: 500, marginBottom: '6px' }}>{nimi}</div>
              <div style={{ fontSize: '11px', color: kyllaMaara > 0 ? '#C9A84C' : '#4E4840', marginBottom: '14px' }}>
                {kyllaMaara}/{kohteet.length} löytyi
              </div>
              <div style={{ height: '2px', backgroundColor: 'rgba(240,235,227,0.06)' }}>
                <div style={{ height: '2px', backgroundColor: valmis ? '#C9A84C' : 'rgba(201,168,76,0.4)', width: `${kohteet.length > 0 ? (kasitelty / kohteet.length) * 100 : 0}%`, transition: 'width 0.4s' }} />
              </div>
              {valmis && <div style={{ fontSize: '9px', color: '#C9A84C', letterSpacing: '0.12em', marginTop: '8px' }}>✓ VALMIS</div>}
            </div>
          )
        })}
      </div>
    </div>
  )

  // Yksityisnäkymä — valittu kategoria auki
  if (valittuKategoria) {
    const { lista, etuliite, otsikko, id: katId } = valittuKategoria
    const kohteet = lista.filter(k => valittuKategoria.kohteet.includes(k.id))
    return (
      <div>
        <button
          onClick={() => { setValittuKategoria(null); setAvattuKohta(null) }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#7A7268', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '24px', padding: 0, transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#F0EBE3'}
          onMouseLeave={e => e.currentTarget.style.color = '#7A7268'}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Takaisin
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', color: '#F0EBE3', fontWeight: 500 }}>{otsikko}</div>
          {kommenttiMaara && onAvaPopup && (
            <button onClick={() => onAvaPopup({ tyyppi: 'omaisuus', id: katId, nimi: otsikko.replace(/^.{2}/, '').trim(), kategoriaNimi: 'Omaisuuden selvitys' })}
              style={{ fontSize: '11px', color: kommenttiMaara('omaisuus', katId) > 0 ? '#C9A84C' : '#4E4840', background: 'none', border: '1px solid', borderColor: kommenttiMaara('omaisuus', katId) > 0 ? 'rgba(201,168,76,0.3)' : 'rgba(240,235,227,0.08)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              💬 {kommenttiMaara('omaisuus', katId) || '+'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {kohteet.map(kohta => {
                const id = etuliite + kohta.id
                const onValittu = avattuKohta === id
                const onKylla = rastitattu[id] === 'kylla'
                const onEi = rastitattu[id] === 'ei'
                return (
                  <div key={kohta.id}
                    style={{ backgroundColor: '#110E0B', border: `1px solid ${onValittu ? '#C9A84C' : 'rgba(240,235,227,0.06)'}`, opacity: onEi ? 0.5 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', gap: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#D0C8BC', flex: 1, cursor: 'pointer' }}
                        onClick={() => setAvattuKohta(onValittu ? null : id)}>
                        {kohta.teksti}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => { onToggle(id, 'kylla'); setAvattuKohta(id) }}
                          style={{ fontSize: '11px', padding: '5px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', backgroundColor: onKylla ? '#C9A84C' : '#1C1916', color: onKylla ? '#110E0B' : '#6A6258', transition: 'background 0.15s' }}>
                          Kyllä
                        </button>
                        <button onClick={() => { onToggle(id, 'ei'); setAvattuKohta(null) }}
                          style={{ fontSize: '11px', padding: '5px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', backgroundColor: onEi ? '#4E4840' : '#1C1916', color: onEi ? '#8A8278' : '#6A6258', transition: 'background 0.15s' }}>
                          Ei
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '24px', alignSelf: 'flex-start' }}>
            {avattuKohta ? (
              <VaratJaVelatPaneeli
                kohta={avattuKohta}
                kirjaukset={kirjaukset}
                onKirjaus={onKirjaus}
                vahvistetut={vahvistetut}
                onVahvista={onVahvista}
                onSulje={() => setAvattuKohta(null)}
                onPoista={onPoista}
              />
            ) : (
              <div className="rounded-lg p-5" style={{ backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.12)' }}>
                <h3 className="text-white font-bold text-base mb-3">Näin Varat ja velat toimii</h3>
                <p style={{ color: '#8A8278' }} className="text-sm mb-3">Käy jokainen kohta läpi ja merkitse <strong style={{ color: 'white' }}>Kyllä</strong> jos se koskee vainajaa, tai <strong style={{ color: 'white' }}>Ei</strong> jos ei koske.</p>
                <p style={{ color: '#8A8278' }} className="text-sm mb-3">Klikkaa kohdan nimeä nähdäksesi ohjeet ja kirjauskentän löydöille.</p>
                <p style={{ color: '#8A8278' }} className="text-sm">Kirjatut löydöt siirtyvät automaattisesti perukirjapohjaan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Korttinäkymä
  return (
    <div>
      {renderKorttiRyhma('Varat', varatKategoriat, varatJaVelatMuistilista.varat)}
      {renderKorttiRyhma('Velat', velatKategoriat, varatJaVelatMuistilista.velat, 'velat_')}

      {(varatJaVelatMuistilista.varat.some(k => rastitattu[k.id] === 'kylla' && vahvistetut[k.id]) ||
        varatJaVelatMuistilista.velat.some(k => rastitattu['velat_' + k.id] === 'kylla' && vahvistetut['velat_' + k.id])) && (
        <div style={{ backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)', padding: '20px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>📊 Yhteenveto löydöistä</div>
          {varatJaVelatMuistilista.varat.filter(k => rastitattu[k.id] === 'kylla' && vahvistetut[k.id]?.length > 0).flatMap(k =>
            (vahvistetut[k.id] || []).map((v, i) => (
              <p key={k.id + i} style={{ fontSize: '13px', color: '#F0EBE3', marginBottom: '4px' }}>— {k.teksti}: {v}</p>
            ))
          )}
          {varatJaVelatMuistilista.velat.filter(k => rastitattu['velat_' + k.id] === 'kylla' && vahvistetut['velat_' + k.id]).map(k => (
            <p key={k.id} style={{ fontSize: '13px', color: '#F0EBE3', marginBottom: '4px' }}>— {k.teksti}: {vahvistetut['velat_' + k.id]}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function SelvitysOsio({ onValmis, onEdistyminen, avattuSopimus, setAvattuSopimus, sopimusTilat, tallennaSopimusTila }) {
  const [valittuKategoria, setValittuKategoria] = useState(null)
  const [muistiinpanot, setMuistiinpanot] = useState({})

  useEffect(() => {
    const kasitelty = kategoriat.reduce((sum, k) => sum + k.sopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu' || sopimusTilat[s.nimi] === 'ei').length, 0)
    onEdistyminen?.(kasitelty)
  }, [sopimusTilat])

  const sopimusDetailPanel = (
    avattuSopimus ? (
      <div className="rounded-lg p-5 flex flex-col gap-4" style={{backgroundColor: '#1C1916', border: '1px solid #C9A84C'}}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-bold text-base">{avattuSopimus.nimi}</h3>
            {sopimusTilat[avattuSopimus.nimi] === 'kesken' && <span className="text-xs" style={{color: '#8A8278'}}>⏳ Kesken</span>}
            {sopimusTilat[avattuSopimus.nimi] === 'hoidettu' && <span className="text-xs" style={{color: '#C9A84C'}}>✓ Hoidettu</span>}
          </div>
          <button onClick={() => setAvattuSopimus(null)} style={{color: '#4E4840'}} className="text-sm hover:opacity-75">✕</button>
        </div>
        <p style={{color: '#8A8278'}} className="text-sm">{avattuSopimus.miksi}</p>
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
            style={{backgroundColor: '#110E0B', color: 'white', border: '1px solid rgba(240,235,227,0.08)'}}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => { tallennaSopimusTila(avattuSopimus.nimi, 'ei'); setAvattuSopimus(null) }}
            className="w-full py-2 rounded text-sm font-bold" style={{backgroundColor: 'transparent', color: '#4E4840', border: '1px solid rgba(240,235,227,0.08)'}}>
            Ei kuulu tähän pesään
          </button>
          <button onClick={() => { tallennaSopimusTila(avattuSopimus.nimi, 'kesken'); setAvattuSopimus(null) }}
            className="w-full py-2 rounded text-sm font-bold" style={{backgroundColor: 'rgba(240,235,227,0.08)', color: '#8A8278'}}>
            ⏳ Merkitse kesken
          </button>
          <button onClick={() => { tallennaSopimusTila(avattuSopimus.nimi, 'hoidettu'); setAvattuSopimus(null) }}
            className="w-full py-2 rounded text-sm font-bold" style={{backgroundColor: '#C9A84C', color: '#110E0B'}}>
            ✓ Merkitse hoidetuksi
          </button>
        </div>
      </div>
    ) : (
      <div className="rounded-lg p-5" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.12)'}}>
        <h3 className="text-white font-bold text-base mb-3">Näin Sopimukset toimii</h3>
        <p style={{color: '#8A8278'}} className="text-sm mb-4">Klikkaa sopimusta nähdäksesi ohjeet miten se hoidetaan.</p>
        <p style={{color: '#8A8278'}} className="text-sm mb-4">Kun olet hoitanut asian, paina <strong style={{color: 'white'}}>"Merkitse hoidetuksi"</strong> paneelissa.</p>
        <p style={{color: '#8A8278'}} className="text-sm">Paina <strong style={{color: 'white'}}>"Ei kuulu"</strong> jos sopimusta ei ollut, tai se on jo hoidettu.</p>
      </div>
    )
  )

  // Kategoriakortit — päänäkymä
  if (!valittuKategoria) {
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(240,235,227,0.06)', marginBottom: '32px' }}>
          {kategoriat.map(kat => {
            const kasitelty = kat.sopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu' || sopimusTilat[s.nimi] === 'ei').length
            const hoidettu = kat.sopimukset.filter(s => sopimusTilat[s.nimi] === 'hoidettu').length
            const kesken = kat.sopimukset.filter(s => sopimusTilat[s.nimi] === 'kesken').length
            const kasittelematta = kat.sopimukset.length - kasitelty - kesken
            const kaikki = kat.sopimukset.length
            const valmis = kasitelty === kaikki && kaikki > 0
            return (
              <div key={kat.id}
                onClick={() => setValittuKategoria(kat.id)}
                style={{ padding: '22px 18px', cursor: 'pointer', backgroundColor: '#110E0B', border: `1px solid ${valmis ? 'rgba(201,168,76,0.35)' : 'transparent'}`, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#161210'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#110E0B'}
              >
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>{kat.ikoni}</div>
                <div style={{ fontSize: '13px', color: '#F0EBE3', fontWeight: 500, marginBottom: '8px' }}>{kat.nimi}</div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  {hoidettu > 0 && <span style={{ fontSize: '11px', color: '#C9A84C' }}>✓ {hoidettu} hoidettu</span>}
                  {kesken > 0 && <span style={{ fontSize: '11px', color: '#8A8278' }}>⏳ {kesken} kesken</span>}
                  {kasittelematta > 0 && <span style={{ fontSize: '11px', color: '#4E4840' }}>{kasittelematta} käsittelemättä</span>}
                  {kasitelty === 0 && kesken === 0 && <span style={{ fontSize: '11px', color: '#4E4840' }}>{kaikki} käsittelemättä</span>}
                </div>
                <div style={{ height: '2px', backgroundColor: 'rgba(240,235,227,0.06)' }}>
                  <div style={{ height: '2px', backgroundColor: valmis ? '#C9A84C' : 'rgba(201,168,76,0.4)', width: `${kaikki > 0 ? (kasitelty / kaikki) * 100 : 0}%`, transition: 'width 0.4s' }} />
                </div>
                {valmis && <div style={{ fontSize: '9px', color: '#C9A84C', letterSpacing: '0.12em', marginTop: '8px' }}>✓ VALMIS</div>}
              </div>
            )
          })}
        </div>
        <button className="w-full py-3 rounded font-bold" style={{backgroundColor: 'transparent', color: '#C9A84C', border: '1px solid rgba(240,235,227,0.08)'}} onClick={onValmis}>Siirry yhteenvetoon →</button>
      </div>
    )
  }

  // Kategoria auki — sopimus-lista + detail-paneeli
  const kategoria = kategoriat.find(k => k.id === valittuKategoria)
  return (
    <div>
      <button
        onClick={() => { setValittuKategoria(null); setAvattuSopimus(null) }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#7A7268', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '24px', padding: 0, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#F0EBE3'}
        onMouseLeave={e => e.currentTarget.style.color = '#7A7268'}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Takaisin
      </button>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', color: '#F0EBE3', fontWeight: 500 }}>{kategoria.ikoni} {kategoria.nimi}</div>
            <button
              onClick={() => { kategoria.sopimukset.forEach(s => tallennaSopimusTila(s.nimi, 'ei')); setAvattuSopimus(null) }}
              style={{ fontSize: '11px', color: '#4E4840', background: 'none', border: '1px solid rgba(240,235,227,0.08)', padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.04em', fontFamily: 'var(--font-body)', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#8A8278'}
              onMouseLeave={e => e.currentTarget.style.color = '#4E4840'}
            >
              Ei koske tätä pesää
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {kategoria.sopimukset.map(sopimus => {
              const tila = sopimusTilat[sopimus.nimi]
              const onHoidettu = tila === 'hoidettu'
              const onOhitettu = tila === 'ei'
              const onKesken = tila === 'kesken'
              const onValittu = avattuSopimus?.nimi === sopimus.nimi
              return (
                <div key={sopimus.nimi}
                  style={{ backgroundColor: '#110E0B', border: `1px solid ${onValittu ? '#C9A84C' : 'rgba(240,235,227,0.06)'}`, opacity: onOhitettu ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: onOhitettu ? '#6A6258' : '#D0C8BC', flex: 1, cursor: 'pointer' }}
                      onClick={() => setAvattuSopimus(onValittu ? null : { ...sopimus, kategoriaId: kategoria.id })}>
                      {sopimus.nimi}
                      {onKesken && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#8A8278' }}>⏳</span>}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => { tallennaSopimusTila(sopimus.nimi, 'hoidettu'); setAvattuSopimus(null) }}
                        style={{ fontSize: '11px', padding: '5px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', backgroundColor: onHoidettu ? '#C9A84C' : '#1C1916', color: onHoidettu ? '#110E0B' : '#6A6258', transition: 'background 0.15s' }}>
                        Kyllä
                      </button>
                      <button onClick={() => { tallennaSopimusTila(sopimus.nimi, 'ei'); setAvattuSopimus(null) }}
                        style={{ fontSize: '11px', padding: '5px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', backgroundColor: onOhitettu ? '#4E4840' : '#1C1916', color: onOhitettu ? '#8A8278' : '#6A6258', transition: 'background 0.15s' }}>
                        Ei
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="lg:w-80 flex-shrink-0 flex flex-col gap-4" style={{position: 'sticky', top: '24px', alignSelf: 'flex-start'}}>
          {sopimusDetailPanel}
        </div>
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
      <div className="rounded-lg p-5" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.08)'}}>
        <h3 className="text-white font-bold mb-4">Löydetyt varat</h3>
        {varatLoydetyt.length === 0 ? (
          <p style={{color: '#4E4840'}} className="text-sm">Ei kirjattuja varalöytöjä. Lisää tietoja Varat ja velat -osiossa.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {varatLoydetyt.map(k => (
              <div key={k.id}>
                <p style={{color: '#C9A84C'}} className="text-xs font-bold uppercase tracking-wider mb-1">{k.teksti}</p>
                {vahvistetutKirjaukset[k.id].map((v, i) => (
                  <p key={i} style={{color: '#8A8278'}} className="text-sm">— {v}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Velat */}
      <div className="rounded-lg p-5" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.08)'}}>
        <h3 className="text-white font-bold mb-4">Löydetyt velat</h3>
        {velatLoydetyt.length === 0 ? (
          <p style={{color: '#4E4840'}} className="text-sm">Ei kirjattuja velkalöytöjä. Lisää tietoja Varat ja velat -osiossa.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {velatLoydetyt.map(k => (
              <div key={k.id}>
                <p style={{color: '#C9A84C'}} className="text-xs font-bold uppercase tracking-wider mb-1">{k.teksti}</p>
                {vahvistetutKirjaukset['velat_' + k.id].map((v, i) => (
                  <p key={i} style={{color: '#8A8278'}} className="text-sm">— {v}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sopimukset */}
      <div className="rounded-lg p-5" style={{backgroundColor: '#1C1916', border: '1px solid rgba(240,235,227,0.08)'}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Sopimukset</h3>
          {hoidetutSopimukset.length > 0 && (
            <span style={{color: '#C9A84C'}} className="text-xs">{hoidetutSopimukset.length} hoidettu</span>
          )}
        </div>
        {avoimet.length === 0 ? (
          <p style={{color: '#4E4840'}} className="text-sm">Ei avoimia sopimuksia. Käy Sopimukset-osio läpi ensin.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p style={{color: '#8A8278'}} className="text-xs mb-2">Nämä sopimukset odottavat hoitamista ennen perunkirjoitusta:</p>
            {avoimet.map(s => (
              <div key={s.nimi} className="rounded p-3 flex items-center justify-between gap-3"
                style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}}>
                <div>
                  <p className="text-white text-sm">{s.nimi}</p>
                  <p style={{color: '#4E4840'}} className="text-xs">{s.kategoriaNimi}</p>
                </div>
                <button
                  onClick={() => tallennaSopimusTila(s.nimi, 'hoidettu')}
                  className="text-xs px-3 py-1 rounded font-bold flex-shrink-0"
                  style={{backgroundColor: '#C9A84C', color: '#110E0B'}}>
                  ✓ Hoidettu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="w-full py-4 rounded font-bold text-lg" style={{backgroundColor: '#C9A84C', color: '#110E0B'}} onClick={onValmis}>
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
      style={{backgroundColor: onAuki ? '#1C1916' : '#110E0B', border: `1px solid ${onAuki ? '#C9A84C' : 'rgba(240,235,227,0.08)'}`}}
      onClick={() => setAvattuTehtava(onAuki ? null : tehtava.id)}>
      <div className="flex items-center gap-4 p-4">
        <div onClick={(e) => { e.stopPropagation(); onMerkitse() }} className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{backgroundColor: tehtava.tehty ? '#C9A84C' : 'transparent', border: `2px solid ${tehtava.tehty ? '#C9A84C' : '#4E4840'}`}}>
          {tehtava.tehty && <span style={{color: '#110E0B'}} className="text-xs font-bold">✓</span>}
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
    <div className="rounded-lg p-5 flex flex-col gap-5" style={{backgroundColor: '#1C1916', border: '1px solid #C9A84C'}}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-base mb-1">{tehtava.nimi}</h3>
          {ohje.kiireellinen && <span className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: '#7C3333', color: '#FCA5A5'}}>⏰ Kiireellinen</span>}
        </div>
        <button onClick={onSulje} style={{color: '#4E4840'}} className="text-sm hover:opacity-75">✕ Sulje</button>
      </div>

      <div>
        <p style={{color: '#8A8278'}} className="text-sm">{ohje.miksi}</p>
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

      <div className="border-t pt-4" style={{borderColor: 'rgba(240,235,227,0.08)'}}>
        <div style={{color: 'white'}} className="text-xs uppercase tracking-widest mb-3">💬 Kommentit</div>
        <div className="flex flex-col gap-2 mb-3">
          {kommentit.length === 0 && <p style={{color: '#4E4840'}} className="text-xs">Ei vielä kommentteja.</p>}
          {kommentit.map((k) => (
            <div key={k.id} className="p-2 rounded" style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}}>
              <span style={{color: '#C9A84C'}} className="text-xs font-bold">{k.kirjoittaja_email}: </span>
              <span className="text-white text-xs">{k.teksti}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={uusiKommentti} onChange={(e) => setUusiKommentti(e.target.value)} placeholder="Kirjoita kommentti..." className="flex-1 px-3 py-2 rounded text-sm text-white placeholder-gray-500 outline-none" style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}} onKeyDown={(e) => e.key === 'Enter' && lisaaKommentti()} />
          <button onClick={lisaaKommentti} className="px-3 py-2 rounded text-sm font-bold" style={{backgroundColor: '#C9A84C', color: '#110E0B'}}>→</button>
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

const varatKategoriatMeta = [
  { id: 'pankkitilit', teksti: 'Pankkitilit' },
  { id: 'kateinen', teksti: 'Käteinen' },
  { id: 'sijoitukset', teksti: 'Sijoitukset (osakkeet, rahastot)' },
  { id: 'asunnot', teksti: 'Asunto-osakkeet ja kiinteistöt' },
  { id: 'ajoneuvot', teksti: 'Ajoneuvot' },
  { id: 'metsa', teksti: 'Metsätilat' },
  { id: 'mokki', teksti: 'Kesämökki / vapaa-ajan kiinteistö' },
  { id: 'tallelokero', teksti: 'Tallelokero pankissa' },
  { id: 'ulkomaantilit', teksti: 'Ulkomaiset pankkitilit' },
  { id: 'ps-tili', teksti: 'PS-tili (pitkäaikaissäästäminen)' },
  { id: 'joukkovelkakirjat', teksti: 'Joukkovelkakirjat ja obligaatiot' },
  { id: 'krypto', teksti: 'Kryptovaluutat' },
  { id: 'elakesaastot', teksti: 'Eläkesäästöt / kapitalisaatiosopimukset' },
  { id: 'tontti', teksti: 'Tontti tai rakentamaton maapalsta' },
  { id: 'maatila', teksti: 'Maatila tai peltoalue' },
  { id: 'autotalli', teksti: 'Autotalli tai osakemuotoinen parkkipaikka' },
  { id: 'veronpalautus', teksti: 'Veronpalautukset' },
  { id: 'lomarahat', teksti: 'Ansaitsemattomat lomarahat' },
  { id: 'vakuutuskorvaukset', teksti: 'Vakuutuskorvaukset (kesken)' },
  { id: 'vuokravakuus', teksti: 'Palautettava vuokravakuus' },
  { id: 'myyntisaatavat', teksti: 'Myyntisaatavat' },
  { id: 'osuuskunnat', teksti: 'Osuuskunnat (S-osuus, OP-osuus)' },
  { id: 'peravaunu', teksti: 'Perävaunu ja matkailuauto' },
  { id: 'tyokone', teksti: 'Työkone (traktori, kaivinkone)' },
  { id: 'korut', teksti: 'Korut ja kellot' },
  { id: 'jalometallit', teksti: 'Jalometallit (kulta, hopea)' },
  { id: 'taide', teksti: 'Taide-esineet ja taulut' },
  { id: 'antiikki', teksti: 'Antiikki ja keräilyesineet' },
  { id: 'soittimet', teksti: 'Soittimet' },
  { id: 'asekokoelma', teksti: 'Asekokoelma' },
  { id: 'viinikokoelma', teksti: 'Viini- tai viskikokoelma' },
  { id: 'arvoesineet', teksti: 'Muut arvoesineet' },
]
const velatKategoriatMeta = [
  { id: 'asuntolaina', teksti: 'Asuntolaina' },
  { id: 'kulutusluotot', teksti: 'Kulutusluotot ja pikavipit' },
  { id: 'autolaina', teksti: 'Autolaina / rahoitussopimus' },
  { id: 'opintolaina', teksti: 'Opintolaina' },
  { id: 'osamaksut', teksti: 'Osamaksusopimukset' },
  { id: 'muupankkilaina', teksti: 'Muu pankkilaina' },
  { id: 'takaukset', teksti: 'Takaukset' },
  { id: 'maksamattomat', teksti: 'Maksamattomat laskut' },
  { id: 'verorästit', teksti: 'Verorästit' },
  { id: 'vuokrarästit', teksti: 'Vuokrarästit' },
  { id: 'yksityisvelat', teksti: 'Velat yksityishenkilöille' },
]

function PerukirjaModal({ kuolinpesa, vahvistetutKirjaukset, onSulje }) {
  const [lataamassa, setLataamassa] = useState(false)
  const vahv = vahvistetutKirjaukset || {}

  const varatLoydetyt = varatKategoriatMeta.filter(k => Array.isArray(vahv[k.id]) && vahv[k.id].length > 0)
  const velatLoydetyt = velatKategoriatMeta.filter(k => Array.isArray(vahv['velat_' + k.id]) && vahv['velat_' + k.id].length > 0)

  const kuolinpaivaFormatted = kuolinpesa?.kuolinpaiva
    ? new Date(kuolinpesa.kuolinpaiva).toLocaleDateString('fi-FI')
    : null

  async function lataaWord() {
    setLataamassa(true)
    try {
      const res = await fetch('/api/generate-perukirja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kuolinpesa, vahvistetutKirjaukset }),
      })
      if (!res.ok) throw new Error('Generointi epäonnistui')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeNimi = (kuolinpesa?.vainajan_nimi || 'Perukirja').replace(/[^a-zA-Z0-9_\-äöåÄÖÅ]/g, '_')
      a.download = `Perukirja_${safeNimi}_${new Date().toISOString().slice(0, 10)}.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Virhe tiedoston luomisessa: ' + e.message)
    } finally {
      setLataamassa(false)
    }
  }

  const TK = () => (
    <span style={{ color: '#8A8278', fontStyle: 'italic', fontSize: '12px' }}>[täydennettävä]</span>
  )

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: '1px solid rgba(240,235,227,0.05)' }}>
      <span style={{ color: '#8A8278', fontSize: '12px', minWidth: '180px', flexShrink: 0 }}>{label}:</span>
      {value ? <span style={{ color: '#E0DAD2', fontSize: '12px' }}>{value}</span> : <TK />}
    </div>
  )

  const SectionTitle = ({ num, title }) => (
    <div style={{ marginTop: '20px', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(201,168,76,0.3)' }}>
      <span style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
        {num}. {title}
      </span>
    </div>
  )

  const SubTitle = ({ title }) => (
    <div style={{ marginTop: '12px', marginBottom: '4px' }}>
      <span style={{ color: '#A09284', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onSulje() }}
    >
      <div style={{
        backgroundColor: '#110E0B', border: '1px solid rgba(201,168,76,0.4)',
        borderRadius: '12px', width: '100%', maxWidth: '720px',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(240,235,227,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>Perukirjapohja — esikatselu</div>
            <div style={{ color: '#8A8278', fontSize: '12px', marginTop: '2px' }}>
              Tarkista sisältö. <span style={{ color: '#C9A84C' }}>[täydennettävä]</span>-kohdat täytetään ennen allekirjoitusta.
            </div>
          </div>
          <button onClick={onSulje} style={{ color: '#4E4840', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Scrollable preview */}
        <div style={{ overflowY: 'auto', padding: '20px 24px', flex: 1 }}>

          {/* 1. Johdanto */}
          <SectionTitle num="1" title="Johdanto" />
          <Row label="Toimituspaikka" value={null} />
          <Row label="Toimitusaika" value={null} />
          <SubTitle title="Pesän ilmoittaja" />
          <Row label="Nimi" value={kuolinpesa?.kayttaja_nimi} />
          <Row label="Osoite" value={null} />
          <SubTitle title="Uskottu mies 1" />
          <Row label="Nimi" value={null} />
          <Row label="Osoite" value={null} />
          <SubTitle title="Uskottu mies 2" />
          <Row label="Nimi" value={null} />
          <Row label="Osoite" value={null} />
          <SubTitle title="Liiteasiakirjat" />
          <div style={{ color: '#8A8278', fontSize: '12px', paddingLeft: '8px', lineHeight: '1.8' }}>
            ☐ Virkatodistus vainajasta &nbsp;·&nbsp; ☐ Sukuselvitys &nbsp;·&nbsp; ☐ Testamentti &nbsp;·&nbsp; ☐ Avioehto
          </div>

          {/* 2. Vainajan tiedot */}
          <SectionTitle num="2" title="Vainajan tiedot" />
          <Row label="Täydellinen nimi" value={kuolinpesa?.vainajan_nimi} />
          <Row label="Henkilötunnus" value={null} />
          <Row label="Kuolinpäivä" value={kuolinpaivaFormatted} />
          <Row label="Kotikunta" value={null} />
          <Row label="Viimeinen osoite" value={null} />
          <Row label="Siviilisääty" value={null} />
          <Row label="Ammatti / Eläkeläinen" value={null} />

          {/* 3. Osakkaat */}
          <SectionTitle num="3" title="Kuolinpesän osakkaat" />
          <div style={{ color: '#8A8278', fontSize: '12px', fontStyle: 'italic', marginBottom: '6px' }}>
            Perillinen 1, 2, 3… sekä mahdollinen leski ja testamentinsaajat — kaikki täydennetään asiakirjaan.
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <SubTitle title={`Perillinen ${i}`} />
              <Row label="Nimi" value={null} />
              <Row label="Sukulaissuhde" value={null} />
              <Row label="Henkilötunnus" value={null} />
              <Row label="Osoite" value={null} />
            </div>
          ))}

          {/* 4. Varallisuusluettelo */}
          <SectionTitle num="4" title="Varallisuusluettelo" />

          <SubTitle title="Varat — kirjatut löydöt" />
          {varatLoydetyt.length === 0 ? (
            <div style={{ color: '#8A8278', fontSize: '12px', fontStyle: 'italic' }}>Ei kirjattuja varoja Omaisuuden selvitys -osiossa.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(240,235,227,0.12)' }}>
                  <th style={{ textAlign: 'left', color: '#C9A84C', padding: '4px 8px 4px 0', fontWeight: 600, fontSize: '11px' }}>Kategoria</th>
                  <th style={{ textAlign: 'left', color: '#C9A84C', padding: '4px 8px', fontWeight: 600, fontSize: '11px' }}>Kuvaus</th>
                  <th style={{ textAlign: 'right', color: '#C9A84C', padding: '4px 0 4px 8px', fontWeight: 600, fontSize: '11px' }}>Arvo</th>
                </tr>
              </thead>
              <tbody>
                {varatLoydetyt.flatMap(k =>
                  vahv[k.id].map((v, i) => (
                    <tr key={k.id + i} style={{ borderBottom: '1px solid rgba(240,235,227,0.04)' }}>
                      <td style={{ color: '#E0DAD2', padding: '4px 8px 4px 0', verticalAlign: 'top' }}>{i === 0 ? k.teksti : ''}</td>
                      <td style={{ color: '#A09284', padding: '4px 8px', verticalAlign: 'top' }}>{v}</td>
                      <td style={{ color: '#8A8278', padding: '4px 0 4px 8px', textAlign: 'right', fontStyle: 'italic', verticalAlign: 'top' }}>[täydennettävä]</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <SubTitle title="Velat — kirjatut löydöt" />
          {velatLoydetyt.length === 0 ? (
            <div style={{ color: '#8A8278', fontSize: '12px', fontStyle: 'italic' }}>Ei kirjattuja velkoja Omaisuuden selvitys -osiossa.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(240,235,227,0.12)' }}>
                  <th style={{ textAlign: 'left', color: '#C9A84C', padding: '4px 8px 4px 0', fontWeight: 600, fontSize: '11px' }}>Kategoria</th>
                  <th style={{ textAlign: 'left', color: '#C9A84C', padding: '4px 8px', fontWeight: 600, fontSize: '11px' }}>Kuvaus</th>
                  <th style={{ textAlign: 'right', color: '#C9A84C', padding: '4px 0 4px 8px', fontWeight: 600, fontSize: '11px' }}>Arvo</th>
                </tr>
              </thead>
              <tbody>
                {velatLoydetyt.flatMap(k =>
                  vahv['velat_' + k.id].map((v, i) => (
                    <tr key={k.id + i} style={{ borderBottom: '1px solid rgba(240,235,227,0.04)' }}>
                      <td style={{ color: '#E0DAD2', padding: '4px 8px 4px 0', verticalAlign: 'top' }}>{i === 0 ? k.teksti : ''}</td>
                      <td style={{ color: '#A09284', padding: '4px 8px', verticalAlign: 'top' }}>{v}</td>
                      <td style={{ color: '#8A8278', padding: '4px 0 4px 8px', textAlign: 'right', fontStyle: 'italic', verticalAlign: 'top' }}>[täydennettävä]</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <SubTitle title="Hautauskulut" />
          <Row label="Hautajaiskulut" value={null} />
          <Row label="Muistotilaisuus" value={null} />
          <Row label="Hautakivi / hautapaikka" value={null} />

          <SubTitle title="Yhteenveto" />
          {['Varat yhteensä', 'Velat yhteensä', 'Hautauskulut', 'Nettovarallisuus'].map(r => (
            <Row key={r} label={r} value={null} />
          ))}

          {/* 5. Vakuutukset */}
          <SectionTitle num="5" title="Vakuutukset ja allekirjoitukset" />
          <div style={{ color: '#8A8278', fontSize: '12px', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '8px' }}>
            Pesän ilmoittajan vakuutus + uskottujen miesten vakuutukset allekirjoituksineen.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Pesän ilmoittaja', 'Uskottu mies 1', 'Uskottu mies 2'].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#8A8278', fontSize: '12px', minWidth: '140px' }}>{r}:</span>
                <div style={{ flex: 1, borderBottom: '1px solid rgba(240,235,227,0.15)', height: '20px' }} />
              </div>
            ))}
          </div>

        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(240,235,227,0.08)', display: 'flex', gap: '12px', flexShrink: 0 }}>
          <button onClick={onSulje} style={{
            flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid rgba(240,235,227,0.15)',
            backgroundColor: 'transparent', color: '#8A8278', fontSize: '14px', cursor: 'pointer', fontWeight: 600,
          }}>
            Sulje
          </button>
          <button
            onClick={lataaWord}
            disabled={lataamassa}
            style={{
              flex: 2, padding: '12px', borderRadius: '6px', border: 'none',
              backgroundColor: lataamassa ? '#8A7030' : '#C9A84C',
              color: '#110E0B', fontSize: '14px', fontWeight: 700, cursor: lataamassa ? 'default' : 'pointer',
              transition: 'background-color 0.15s',
            }}
          >
            {lataamassa ? 'Luodaan tiedostoa…' : '⬇ Lataa Word-tiedostona (.docx)'}
          </button>
        </div>
      </div>
    </div>
  )
}
function PerunkirjoitusOsio({ kuolinpesa, vahvistetutKirjaukset, kayttajaEmail, kayttajaNimi }) {
  const [avattuTehtava, setAvattuTehtava] = useState(null)
  const [perunkirjoitusTehty, setPerunkirjoitusTehty] = useState({})
  const [modalAuki, setModalAuki] = useState(false)
  const togglePerunkirjoitusTehty = (id) => setPerunkirjoitusTehty(prev => ({...prev, [id]: !prev[id]}))
  const avattuOhje = perunkirjoitusTehtavat.find(t => t.id === avattuTehtava)

  return (
    <div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-3 flex-1">
          {perunkirjoitusTehtavat.map(tehtava => (
            <div key={tehtava.id} className="rounded cursor-pointer transition-all"
              style={{backgroundColor: avattuTehtava === tehtava.id ? '#1C1916' : '#110E0B', border: `1px solid ${avattuTehtava === tehtava.id ? '#C9A84C' : 'rgba(240,235,227,0.08)'}`}}
              onClick={() => setAvattuTehtava(avattuTehtava === tehtava.id ? null : tehtava.id)}>
              <div className="flex items-center gap-4 p-4">
                <div onClick={(e) => { e.stopPropagation(); togglePerunkirjoitusTehty(tehtava.id) }}
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                  style={{backgroundColor: perunkirjoitusTehty[tehtava.id] ? '#C9A84C' : 'transparent', border: `2px solid ${perunkirjoitusTehty[tehtava.id] ? '#C9A84C' : '#4E4840'}`}}>
                  {perunkirjoitusTehty[tehtava.id] && <span style={{color: '#110E0B'}} className="text-xs font-bold">✓</span>}
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
            <div className="rounded-lg p-5 flex flex-col gap-5" style={{backgroundColor: '#1C1916', border: '1px solid #C9A84C'}}>
              <div className="flex items-start justify-between">
                <h3 className="text-white font-bold text-base">{avattuOhje.nimi}</h3>
                <button onClick={() => setAvattuTehtava(null)} style={{color: '#4E4840'}} className="text-sm hover:opacity-75">✕</button>
              </div>
              <p style={{color: '#8A8278'}} className="text-sm">{avattuOhje.miksi}</p>
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

      <button className="w-full py-4 rounded font-bold text-lg mt-8" style={{backgroundColor: '#C9A84C', color: '#110E0B'}}
        onClick={() => setModalAuki(true)}>
        Generoi valmis perukirjapohja →
      </button>

      {modalAuki && (
        <PerukirjaModal
          kuolinpesa={kuolinpesa}
          vahvistetutKirjaukset={vahvistetutKirjaukset}
          onSulje={() => setModalAuki(false)}
        />
      )}
    </div>
  )
}

function PaatosOsio({ kuolinpesa, sopimusTilat, varatRastitattu, tehtavaLista }) {
  const [ohitettu, setOhitettu] = useState({})
  const [suljettu, setSuljettu] = useState(false)
  const [sulkemisPvm, setSulkemisPvm] = useState(null)
  const [vahvistaModal, setVahvistaModal] = useState(false)

  const ohita = (avain) => setOhitettu(prev => ({ ...prev, [avain]: true }))

  // Kerää kesken jääneet
  const keskenTehtavat = (tehtavaLista || []).filter(t => !t.tehty)

  const keskenVarat = (varatJaVelatMuistilista.varat || []).filter(v => {
    const tila = (varatRastitattu || {})[v.id]
    return tila === null || tila === undefined
  })

  const keskenSopimukset = []
  kategoriat.forEach(kat => {
    kat.sopimukset.forEach(s => {
      const tila = (sopimusTilat || {})[s.nimi]
      if (!tila) keskenSopimukset.push({ nimi: s.nimi, kategoria: kat.nimi })
    })
  })

  const kaikki = [
    ...keskenTehtavat.map(t => ({ avain: `tehtava_${t.id}`, teksti: t.nimi, kategoria: 'Tehtävät' })),
    ...keskenVarat.map(v => ({ avain: `vara_${v.id}`, teksti: v.teksti, kategoria: 'Varat ja velat' })),
    ...keskenSopimukset.map(s => ({ avain: `sopimus_${s.nimi}`, teksti: s.nimi, kategoria: s.kategoria })),
  ].filter(item => !ohitettu[item.avain])

  // Ryhmittele kategorian mukaan
  const ryhmat = {}
  kaikki.forEach(item => {
    if (!ryhmat[item.kategoria]) ryhmat[item.kategoria] = []
    ryhmat[item.kategoria].push(item)
  })

  const sulkePesa = () => {
    const pvm = new Date().toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })
    setSuljettu(true)
    setSulkemisPvm(pvm)
    setVahvistaModal(false)
  }

  if (suljettu) {
    return (
      <div style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', padding: '80px 0 48px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
            <span style={{ color: '#C9A84C', fontSize: '22px' }}>✓</span>
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.6, marginBottom: '14px' }}>Valmis</div>
          <h2 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '26px', fontWeight: 300, color: '#F0EBE3', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '16px' }}>
            {kuolinpesa?.vainajan_nimi
              ? `${kuolinpesa.vainajan_nimi} kuolinpesä on suljettu.`
              : 'Pesä on suljettu.'}
          </h2>
          <p style={{ fontSize: '13px', color: '#3A3630', lineHeight: 1.7 }}>Suljettu {sulkemisPvm}.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px' }}>

      {/* Tarkasta vielä nämä */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '8px' }}>Tarkasta vielä nämä</div>
          <p style={{ fontSize: '13px', color: '#5A5248', lineHeight: 1.7 }}>
            {kaikki.length > 0
              ? `Näitä ${kaikki.length} asiaa ei ole käsitelty sovelluksessa. Hoida ne tai merkitse "Ei koske meitä" jos ne eivät ole relevantteja.`
              : 'Kaikki on käsitelty — voit sulkea pesän.'}
          </p>
        </div>

        {kaikki.length > 0 && Object.entries(ryhmat).map(([kategoria, items]) => (
          <div key={kategoria} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3A3630', marginBottom: '8px', paddingLeft: '4px' }}>
              {kategoria}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {items.map(item => (
                <div key={item.avain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '13px 16px', backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.06)' }}>
                  <span style={{ fontSize: '13px', color: '#8A8278' }}>{item.teksti}</span>
                  <button
                    onClick={() => ohita(item.avain)}
                    style={{ flexShrink: 0, fontSize: '10px', letterSpacing: '0.08em', color: '#3A3630', backgroundColor: 'transparent', border: '1px solid #2A2620', padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4E4840'; e.currentTarget.style.color = '#7A7268' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2620'; e.currentTarget.style.color = '#3A3630' }}
                  >
                    Ei koske meitä
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {kaikki.length === 0 && (
          <div style={{ padding: '20px', backgroundColor: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#4ADE80', fontSize: '14px' }}>✓</span>
            <span style={{ fontSize: '13px', color: '#4ADE80' }}>Kaikki asiat on käsitelty</span>
          </div>
        )}
      </div>

      {/* Sulkemisnappi */}
      <div style={{ borderTop: '1px solid rgba(240,235,227,0.06)', paddingTop: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '8px' }}>Viimeinen vaihe</div>
          <p style={{ fontSize: '13px', color: '#5A5248', lineHeight: 1.7 }}>
            Kun kaikki on hoidettu, merkitse pesä suljetuksi. Tämä on kirjaus sinulle — ei juridinen toimenpide.
          </p>
        </div>
        <button
          onClick={() => setVahvistaModal(true)}
          style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#110E0B', backgroundColor: '#C9A84C', border: 'none', padding: '16px 40px', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D4B55C'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A84C'}
        >
          Merkitse pesä suljetuksi →
        </button>
      </div>

      {/* Vahvistusmodal */}
      {vahvistaModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(201,168,76,0.3)', padding: '40px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#F0EBE3', marginBottom: '16px' }}>Suljetaanko pesä?</h3>
            <p style={{ fontSize: '13px', color: '#7A7268', lineHeight: 1.7, marginBottom: '32px' }}>
              Kaikki tiedot säilyvät — voit palata katsomaan niitä myöhemmin.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={sulkePesa} style={{ flex: 1, padding: '13px', backgroundColor: '#C9A84C', color: '#110E0B', border: 'none', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                Kyllä, sulje pesä
              </button>
              <button onClick={() => setVahvistaModal(false)} style={{ flex: 1, padding: '13px', backgroundColor: 'transparent', color: '#5A5248', border: '1px solid rgba(240,235,227,0.1)', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Peruuta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const toimeenpanoTehtavat = [
  { id: 'tp1', nimi: 'Siirrä pankkivarat osakkaiden tileille', miksi: 'Kun perinnönjako on sovittu, pankkitilit suljetaan ja varat siirretään. Pankki vaatii perukirjan ja perinnönjakosopimuksen.', miten: ['Toimita perukirja ja perinnönjakosopimus pankkiin', 'Pyydä pankkia tekemään siirrot sovitusti', 'Kuolinpesän pankkitilit suljetaan siirron jälkeen', 'Pyydä tilitteet kaikista tileistä arkistoon'] },
  { id: 'tp2', nimi: 'Hae lainhuuto kiinteistöille', miksi: 'Jos kiinteistö siirtyy osakkaalle eikä myydä, uuden omistajan on haettava lainhuutoa 6 kuukauden kuluessa saannosta.', miten: ['Täytä lainhuutohakemus Maanmittauslaitoksella (maanmittauslaitos.fi)', 'Liitä perukirja ja perinnönjakosopimus hakemukseen', 'Maksa lainhuutomaksu (noin 119 € per kiinteistö)', 'Jos kiinteistö myydään ulkopuoliselle, lainhuuto haetaan kaupanteon yhteydessä'] },
  { id: 'tp3', nimi: 'Siirrä arvo-osuustilit (sijoitukset)', miksi: 'Osakkeet ja rahastot eivät siirry automaattisesti — arvo-osuustili pitää siirtää erikseen.', miten: ['Ota yhteyttä arvo-osuustilin ylläpitäjään (esim. Nordnet, OP)', 'Toimita perukirja ja perinnönjakosopimus', 'Pyydä siirtoa osakkaan omalle tilille', 'Huomioi mahdolliset myyntivoittoverot jos myyt heti siirron jälkeen'] },
  { id: 'tp4', nimi: 'Siirrä tai myy ajoneuvot', miksi: 'Ajoneuvo siirtyy Traficomin rekisterissä automaattisesti kuolinpesälle, mutta siirto osakkaalle vaatii erillisen toimenpiteen.', miten: ['Jos siirretään osakkaalle: tee omistusoikeuden siirto Traficom-palvelussa (traficom.fi)', 'Jos myydään: normaali autokauppa, kuolinpesä on myyjä', 'Muista päivittää vakuutukset omistajan vaihtuessa'] },
  { id: 'tp5', nimi: 'Päätä jäljellä olevat sopimukset', miksi: 'Kaikki sopimukset jotka eivät päättyneet vaiheessa 2 pitää nyt päättää kun pesä suljetaan.', miten: ['Tarkista Sopimukset-osiosta mitkä ovat vielä auki', 'Irtisano tai siirrä jäljellä olevat sopimukset', 'Varmista ettei kuukausittaisia laskuja tule enää kuolinpesän tilille'] },
  { id: 'tp6', nimi: 'Hae Y-tunnuksen lakkauttaminen (jos tarpeen)', miksi: 'Jos kuolinpesälle on haettu Y-tunnus esim. yritystoiminnan jatkamista varten, se pitää lakkauttaa kun pesä suljetaan.', miten: ['Tarkista onko pesällä Y-tunnus — yleensä tarpeen vain jos vainajalla oli yritystoimintaa', 'Jos on: ilmoita lopettamisesta Patentti- ja rekisterihallitukselle (ytj.fi)', 'Jos ei ole: tätä vaihetta ei tarvita'] },
]

const perintoveroTehtavat = [
  { id: 'pv1', nimi: 'Tarkista perintöveroilmoituksen deadline', miksi: 'Perintöveroilmoitus on toimitettava Verohallinnolle 9 kuukauden kuluessa kuolinpäivästä. Myöhästymisestä seuraa viivästysmaksu.', miten: ['Laske deadline: kuolinpäivä + 9 kuukautta', 'Merkitse päivämäärä kalenteriin', 'Jos tarvitset lisäaikaa, hae sitä Verohallinnolta ennen deadlinea'] },
  { id: 'pv2', nimi: 'Selvitä veroluokka kullekin osakkaalle', miksi: 'Perintöveroluokka määrää verokannan. I luokka on huomattavasti edullisempi kuin II luokka.', miten: ['I veroluokka: aviopuoliso, lapset, lapsenlapset, vanhemmat, isovanhemmat', 'II veroluokka: kaikki muut — sisarukset, serkut, tuttavat, puolison lapset ilman adoptiota', 'Kunkin osakkaan veroluokka selvitetään erikseen'] },
  { id: 'pv3', nimi: 'Laske verotettava osuus kullekin osakkaalle', miksi: 'Perintövero lasketaan jokaisen osakkaan saaman osuuden perusteella erikseen. Alle 20 000 € osuuksista ei peritä veroa.', miten: ['Käytä Verohallinnon laskuria osoitteessa vero.fi', 'Laske kunkin osakkaan osuus pesän varoista miinus velat', 'Huomioi mahdolliset testamentin määräykset ja avio-oikeus'] },
  { id: 'pv4', nimi: 'Toimita perintöveroilmoitus Verohallinnolle', miksi: 'Perintöveroilmoitus on erillinen asiakirja — perukirja ei korvaa sitä, vaikka perukirja olisi jo toimitettu.', miten: ['Täytä perintöveroilmoitus OmaVerossa (vero.fi)', 'Tai pyydä lomake 3630 verotoimistosta', 'Liitä perukirja ilmoituksen liitteeksi', 'Lähetä OmaVerossa sähköisesti tai kirjattuna kirjeenä'] },
  { id: 'pv5', nimi: 'Maksa perintövero', miksi: 'Verohallinto lähettää verotuspäätöksen ja maksuohjeet postitse. Vero on maksettava eräpäivään mennessä.', miten: ['Odota Verohallinnon verotuspäätöstä — tulee yleensä muutaman kuukauden sisällä', 'Vero voidaan jakaa kahteen erään jos se ylittää 500 €', 'Maksa viitteellä joka löytyy verotuspäätöksestä', 'Maksuviivästyksestä peritään viivästyskorkoa'] },
]

function HoitoJaToimeenpanoOsio({ kuolinpesa, vahvistetutKirjaukset, varatRastitattu }) {
  const [aktiivinenAlivaihe, setAktiivinenAlivaihe] = useState(1)
  const [avattuTehtava, setAvattuTehtava] = useState(null)
  const [perintoveroTehty, setPerintoveroTehty] = useState({})
  const [toimeenpanoTehty, setToimeenpanoTehty] = useState({})
  const [jakoTilat, setJakoTilat] = useState({})
  const [avattuKohde, setAvattuKohde] = useState(null)

  const toggleTehty = (id) => setPerintoveroTehty(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleToimeenpanoTehty = (id) => setToimeenpanoTehty(prev => ({ ...prev, [id]: !prev[id] }))
  const avattuOhje = perintoveroTehtavat.find(t => t.id === avattuTehtava)

  // Kerää kirjatut omaisuuserät Phase 2:sta
  const omaisuusErat = []
  Object.entries(vahvistetutKirjaukset || {}).forEach(([id, kirjaukset]) => {
    const lista = Array.isArray(kirjaukset) ? kirjaukset : kirjaukset ? [kirjaukset] : []
    lista.forEach((kirjaus, i) => {
      if (kirjaus && kirjaus.trim()) {
        const kategoriaTiedot = varatJaVelatMuistilista.varat.find(k => k.id === id) || varatJaVelatMuistilista.velat.find(k => k.id === id)
        omaisuusErat.push({ avain: `${id}_${i}`, nimi: kirjaus, kategoriaLabel: kategoriaTiedot?.teksti || id })
      }
    })
  })

  const paivitaJako = (avain, kentta, arvo) => {
    setJakoTilat(prev => ({ ...prev, [avain]: { ...(prev[avain] || {}), [kentta]: arvo } }))
  }

  const tehtyMaara = perintoveroTehtavat.filter(t => perintoveroTehty[t.id]).length
  const jaettuMaara = omaisuusErat.filter(e => jakoTilat[e.avain]?.kuka?.trim()).length

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        {[{ num: 1, nimi: 'Perintövero' }, { num: 2, nimi: 'Omaisuuden jako' }, { num: 3, nimi: 'Toimeenpano' }].map(a => (
          <button key={a.num}
            onClick={() => { setAktiivinenAlivaihe(a.num); setAvattuTehtava(null); setAvattuKohde(null) }}
            className="flex-1 py-2 px-4 rounded text-sm font-bold"
            style={{ backgroundColor: aktiivinenAlivaihe === a.num ? '#C9A84C' : '#110E0B', color: aktiivinenAlivaihe === a.num ? '#110E0B' : '#8A8278', border: '1px solid', borderColor: aktiivinenAlivaihe === a.num ? '#C9A84C' : 'rgba(240,235,227,0.08)' }}>
            {a.num}. {a.nimi}
          </button>
        ))}
      </div>

      {/* ── 4.1 PERINTÖVERO ── */}
      {aktiivinenAlivaihe === 1 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: '#7A7268', fontSize: '12px' }}>Perintöveroilmoitus on pakollinen — deadline on 9 kuukautta kuolinpäivästä.</p>
            <span style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '0.08em' }}>{tehtyMaara}/{perintoveroTehtavat.length} tehty</span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-3 flex-1">
              {perintoveroTehtavat.map(tehtava => (
                <div key={tehtava.id} className="rounded cursor-pointer transition-all"
                  style={{ backgroundColor: avattuTehtava === tehtava.id ? '#1C1916' : '#110E0B', border: `1px solid ${avattuTehtava === tehtava.id ? '#C9A84C' : 'rgba(240,235,227,0.08)'}` }}
                  onClick={() => setAvattuTehtava(avattuTehtava === tehtava.id ? null : tehtava.id)}>
                  <div className="flex items-center gap-4 p-4">
                    <div onClick={(e) => { e.stopPropagation(); toggleTehty(tehtava.id) }}
                      className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: perintoveroTehty[tehtava.id] ? '#C9A84C' : 'transparent', border: `2px solid ${perintoveroTehty[tehtava.id] ? '#C9A84C' : '#4E4840'}` }}>
                      {perintoveroTehty[tehtava.id] && <span style={{ color: '#110E0B' }} className="text-xs font-bold">✓</span>}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium" style={{ color: perintoveroTehty[tehtava.id] ? '#5A5248' : 'white', textDecoration: perintoveroTehty[tehtava.id] ? 'line-through' : 'none' }}>{tehtava.nimi}</span>
                    </div>
                    <span style={{ color: '#C9A84C' }} className="text-xs">{avattuTehtava === tehtava.id ? '▲' : '▼'}</span>
                  </div>
                </div>
              ))}
            </div>

            {avattuTehtava && avattuOhje && (
              <div className="w-80 flex-shrink-0">
                <div className="rounded-lg p-5 flex flex-col gap-5" style={{ backgroundColor: '#1C1916', border: '1px solid #C9A84C', position: 'sticky', top: '24px' }}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-bold text-base">{avattuOhje.nimi}</h3>
                    <button onClick={() => setAvattuTehtava(null)} style={{ color: '#4E4840' }} className="text-sm hover:opacity-75">✕</button>
                  </div>
                  <p style={{ color: '#8A8278' }} className="text-sm">{avattuOhje.miksi}</p>
                  <div>
                    <div style={{ color: '#C9A84C' }} className="text-xs uppercase tracking-widest mb-3">Miten tehdään</div>
                    <ul className="flex flex-col gap-2">
                      {avattuOhje.miten.map((askel, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white">
                          <span style={{ color: '#C9A84C' }} className="flex-shrink-0">{i + 1}.</span>{askel}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── 4.2 OMAISUUDEN JAKO ── */}
      {aktiivinenAlivaihe === 2 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: '#7A7268', fontSize: '12px' }}>Merkitse kenelle kukin omaisuuserä siirtyy — tai että se myydään.</p>
            {omaisuusErat.length > 0 && (
              <span style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '0.08em' }}>{jaettuMaara}/{omaisuusErat.length} kirjattu</span>
            )}
          </div>

          {omaisuusErat.length === 0 ? (
            <div className="rounded p-6" style={{ backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.08)' }}>
              <p style={{ color: '#4E4840' }} className="text-sm">Ei kirjattuja omaisuuseriä. Käy Omaisuuden selvitys → Varat ja velat läpi ensin ja kirjaa löydöt.</p>
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="flex flex-col gap-3 flex-1">
                {omaisuusErat.map(era => {
                  const onKirjattu = !!jakoTilat[era.avain]?.kuka?.trim()
                  const onAvattu = avattuKohde === era.avain
                  return (
                    <div key={era.avain} className="rounded cursor-pointer transition-all"
                      style={{ backgroundColor: onAvattu ? '#1C1916' : '#110E0B', border: `1px solid ${onAvattu ? '#C9A84C' : 'rgba(240,235,227,0.08)'}` }}
                      onClick={() => setAvattuKohde(onAvattu ? null : era.avain)}>
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: onKirjattu ? 'rgba(74,222,128,0.15)' : 'transparent', border: `2px solid ${onKirjattu ? '#4ADE80' : '#4E4840'}` }}>
                          {onKirjattu && <span style={{ color: '#4ADE80' }} className="text-xs font-bold">✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{era.nimi}</p>
                          <p style={{ color: '#5A5248', fontSize: '11px' }}>{era.kategoriaLabel}</p>
                        </div>
                        {onKirjattu && (
                          <span className="text-xs px-2 py-1 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(74,222,128,0.08)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }}>
                            {jakoTilat[era.avain].kuka}
                          </span>
                        )}
                        <span style={{ color: '#C9A84C' }} className="text-xs flex-shrink-0">{onAvattu ? '▲' : '▼'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {avattuKohde && (() => {
                const era = omaisuusErat.find(e => e.avain === avattuKohde)
                if (!era) return null
                return (
                  <div className="w-80 flex-shrink-0">
                    <div className="rounded-lg p-5 flex flex-col gap-4" style={{ backgroundColor: '#1C1916', border: '1px solid #C9A84C', position: 'sticky', top: '24px' }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-bold text-base">{era.nimi}</h3>
                          <p style={{ color: '#5A5248', fontSize: '11px', marginTop: '2px' }}>{era.kategoriaLabel}</p>
                        </div>
                        <button onClick={() => setAvattuKohde(null)} style={{ color: '#4E4840' }} className="text-sm hover:opacity-75">✕</button>
                      </div>

                      <div>
                        <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: '#C9A84C' }}>Kuka saa?</label>
                        <input
                          value={jakoTilat[era.avain]?.kuka || ''}
                          onChange={(e) => paivitaJako(era.avain, 'kuka', e.target.value)}
                          placeholder="Esim: Maija / Jaetaan tasan / Myydään"
                          className="w-full px-3 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
                          style={{ backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.1)' }}
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: '#7A7268' }}>Lisätietoa (vapaaehtoinen)</label>
                        <input
                          value={jakoTilat[era.avain]?.lisatieto || ''}
                          onChange={(e) => paivitaJako(era.avain, 'lisatieto', e.target.value)}
                          placeholder="Esim: rahaksi muuttaminen sovittu, tulos jaetaan tasan"
                          className="w-full px-3 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
                          style={{ backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.1)' }}
                        />
                      </div>

                      <p style={{ color: '#5A5248', fontSize: '11px', lineHeight: 1.6 }}>
                        Tarkat eurosummat löytyvät perukirjastanne. Tässä kirjataan vain jako-päätös — se toimii pohjana perinnönjakosopimukselle.
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {omaisuusErat.length > 0 && (
            <button className="w-full py-4 rounded font-bold text-lg mt-8"
              style={{ backgroundColor: jaettuMaara === omaisuusErat.length ? '#C9A84C' : '#1C1916', color: jaettuMaara === omaisuusErat.length ? '#110E0B' : '#5A5248', border: jaettuMaara === omaisuusErat.length ? 'none' : '1px solid rgba(240,235,227,0.08)', cursor: jaettuMaara === omaisuusErat.length ? 'pointer' : 'default' }}
              onClick={() => { if (jaettuMaara === omaisuusErat.length) alert('Perinnönjakosopimuspohja tulossa pian') }}>
              {jaettuMaara === omaisuusErat.length ? 'Generoi perinnönjakosopimuspohja →' : `Kirjaa ensin kaikki omaisuuserät (${jaettuMaara}/${omaisuusErat.length})`}
            </button>
          )}
        </>
      )}

      {/* ── 4.3 TOIMEENPANO ── */}
      {aktiivinenAlivaihe === 3 && (() => {
        const toimeenpanoTehtyMaara = toimeenpanoTehtavat.filter(t => toimeenpanoTehty[t.id]).length
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <p style={{ color: '#7A7268', fontSize: '12px' }}>Konkreettiset toimet kun jako on sovittu — omaisuuden siirrot ja pesän sulkeminen.</p>
              <span style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '0.08em' }}>{toimeenpanoTehtyMaara}/{toimeenpanoTehtavat.length} tehty</span>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col gap-3 flex-1">
                {toimeenpanoTehtavat.map(tehtava => {
                  const onAvattu = avattuTehtava === tehtava.id
                  const onTehty = toimeenpanoTehty[tehtava.id]
                  return (
                    <div key={tehtava.id} className="rounded cursor-pointer transition-all"
                      style={{ backgroundColor: onAvattu ? '#1C1916' : '#110E0B', border: `1px solid ${onAvattu ? '#C9A84C' : 'rgba(240,235,227,0.08)'}` }}
                      onClick={() => setAvattuTehtava(onAvattu ? null : tehtava.id)}>
                      <div className="flex items-center gap-4 p-4">
                        <div onClick={(e) => { e.stopPropagation(); toggleToimeenpanoTehty(tehtava.id) }}
                          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: onTehty ? '#C9A84C' : 'transparent', border: `2px solid ${onTehty ? '#C9A84C' : '#4E4840'}` }}>
                          {onTehty && <span style={{ color: '#110E0B' }} className="text-xs font-bold">✓</span>}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium" style={{ color: onTehty ? '#5A5248' : 'white', textDecoration: onTehty ? 'line-through' : 'none' }}>{tehtava.nimi}</span>
                        </div>
                        <span style={{ color: '#C9A84C' }} className="text-xs">{onAvattu ? '▲' : '▼'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {avattuTehtava && (() => {
                const ohje = toimeenpanoTehtavat.find(t => t.id === avattuTehtava)
                if (!ohje) return null
                return (
                  <div className="w-80 flex-shrink-0">
                    <div className="rounded-lg p-5 flex flex-col gap-5" style={{ backgroundColor: '#1C1916', border: '1px solid #C9A84C', position: 'sticky', top: '24px' }}>
                      <div className="flex items-start justify-between">
                        <h3 className="text-white font-bold text-base">{ohje.nimi}</h3>
                        <button onClick={() => setAvattuTehtava(null)} style={{ color: '#4E4840' }} className="text-sm hover:opacity-75">✕</button>
                      </div>
                      <p style={{ color: '#8A8278' }} className="text-sm">{ohje.miksi}</p>
                      <div>
                        <div style={{ color: '#C9A84C' }} className="text-xs uppercase tracking-widest mb-3">Miten tehdään</div>
                        <ul className="flex flex-col gap-2">
                          {ohje.miten.map((askel, i) => (
                            <li key={i} className="flex gap-3 text-sm text-white">
                              <span style={{ color: '#C9A84C' }} className="flex-shrink-0">{i + 1}.</span>{askel}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </>
        )
      })()}
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
    <div className="rounded-lg p-5 flex flex-col gap-4" style={{backgroundColor: '#1C1916', border: '1px solid #C9A84C', position: 'sticky', top: '24px'}}>
      <div className="flex items-start justify-between">
        <h3 className="text-white font-bold text-base">{kohtatiedot.teksti}</h3>
        <button onClick={onSulje} style={{color: '#4E4840'}} className="text-sm hover:opacity-75">✕</button>
      </div>
      <p style={{color: '#8A8278'}} className="text-sm">{kohtatiedot.ohje}</p>
      <div className="border-t pt-4" style={{borderColor: 'rgba(240,235,227,0.08)'}}>
        <p className="text-white font-bold text-sm mb-3">Kirjaa löydöt</p>
        <div className="flex flex-col gap-1 mb-3">
          {(Array.isArray(vahvistetut[kohta]) ? vahvistetut[kohta] : vahvistetut[kohta] ? [vahvistetut[kohta]] : []).map((v, i) => (
  <div key={i} className="flex items-center justify-between">
    <p className="text-white text-sm">- {v}</p>
    <button onClick={() => onPoista(kohta, i)} style={{color: 'rgba(240,100,100,0.85)'}} className="text-xs hover:opacity-75 flex-shrink-0 ml-2">Poista</button>
  </div>
))}
        </div>
        <div className="flex gap-2">
          <input value={kirjaukset[kohta] || ''} onChange={(e) => onKirjaus(kohta, e.target.value)}
            placeholder={kohtatiedot.esimerkki || "Esim: kirjaa löytö..."}
            className="flex-1 px-3 py-1 rounded text-xs text-white placeholder-gray-500 outline-none"
            style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}} />
          <button onClick={() => onVahvista(kohta)} className="text-xs px-3 py-1 rounded font-bold"
            style={{backgroundColor: '#C9A84C', color: '#110E0B'}}>
            Kirjaa
          </button>
        </div>
      </div>
      <div className="border-t pt-4" style={{borderColor: 'rgba(240,235,227,0.08)'}}>
        <div style={{color: 'white'}} className="text-xs uppercase tracking-widest mb-3">💬 Kommentit</div>
        <p style={{color: '#4E4840'}} className="text-xs">Kommentointi tulossa pian.</p>
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
        <input type="email" placeholder="sahkoposti@email.fi" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded text-white placeholder-gray-500 outline-none" style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}} />
        <button onClick={kutsuJasen} style={{backgroundColor: '#C9A84C', color: '#110E0B'}} className="px-6 py-3 font-bold rounded hover:opacity-90">Lisää →</button>
      </div>
      {viesti && <p className="text-sm mb-4" style={{color: '#C9A84C'}}>{viesti}</p>}
      {jasenet.length > 0 && (
        <div className="flex flex-col gap-2">
          {jasenet.map((j, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded" style={{backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.08)'}}>
              <span className="text-white text-sm">{j.email}</span>
              <span className="text-xs px-2 py-1 rounded" style={{backgroundColor: '#1C1916', color: '#C9A84C'}}>{j.rooli}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}