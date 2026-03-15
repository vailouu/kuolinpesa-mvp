'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export default function Dashboard() {
  const router = useRouter()
  const [aktiivisuVaihe, setAktiivinenVaihe] = useState(1)
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
    { nimi: 'Irtisano palvelusopimukset', vaihe: 2 },
    { nimi: 'Selvitä varat ja velat', vaihe: 2 },
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

  const nykyisetTehtavat = tehtavaLista.filter(t => t.vaihe === aktiivisuVaihe)
  const valmiit = tehtavaLista.filter(t => t.vaihe === aktiivisuVaihe && t.tehty).length
  const kaikki = tehtavaLista.filter(t => t.vaihe === aktiivisuVaihe).length

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
            <span style={{color: '#C9A84C'}} className="text-sm font-bold">{valmiit}/{kaikki} tehtävää</span>
          </div>
          <div className="w-full rounded-full h-2" style={{backgroundColor: '#0F1E3C'}}>
            <div
              className="h-2 rounded-full transition-all"
              style={{backgroundColor: '#C9A84C', width: kaikki > 0 ? `${(valmiit/kaikki)*100}%` : '0%'}}
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
                backgroundColor: aktiivisuVaihe === v.numero ? '#C9A84C' : '#1B2A4A',
                color: aktiivisuVaihe === v.numero ? '#0F1E3C' : '#A0AEC0',
                border: '1px solid',
                borderColor: aktiivisuVaihe === v.numero ? '#C9A84C' : '#2D3E5C'
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
            Vaihe {aktiivisuVaihe}: {vaiheet[aktiivisuVaihe-1].nimi}
          </h2>
          {nykyisetTehtavat.length === 0 ? (
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

function TehtavaKortti({ tehtava, onMerkitse }) {
  const [auki, setAuki] = useState(false)

  const ohjeet = {
    'Tilaa virkatodistus': {
      kiireellinen: true,
      miksi: 'Toimituksessa kestää 4-10 viikkoa — tarvitaan pankeissa, vakuutuksissa ja perunkirjoituksessa. Tee tämä ensimmäisenä.',
      miten: [
        'Jos vainaja kuului ev.lut. kirkkoon → mene osoitteeseen tilaavirkatodistus.fi',
        'Jos vainaja ei kuulunut kirkkoon → mene osoitteeseen dvv.fi',
        'Tilaa useampi kopio kerralla — tarvitset niitä monessa paikassa',
        'Hinta noin 35-100 €'
      ]
    },
    'Ilmoita pankeille': {
      kiireellinen: false,
      miksi: 'Pankki jäädyttää tilit automaattisesti mutta oma ilmoitus nopeuttaa asioita. Samalla sovitaan kuka hoitaa kuolinpesän pankkiasioita.',
      miten: [
        'Soita vainajan pankin asiakaspalveluun',
        'Ilmoita vainajan nimi ja henkilötunnus',
        'Kerro kuka toimii kuolinpesän hoitajana',
        'Pankki antaa ohjeet kirjallisen ilmoituksen tekemiseen',
        'Huom: Vainajan tililtä voi silti maksaa arjen laskuja ennen perunkirjoitusta'
      ]
    },
    'Ilmoita Kelalle': {
      kiireellinen: false,
      miksi: 'Jos vainaja sai Kela-etuuksia, ilmoita pian — muuten ylimääräiset maksut peritään takaisin. Selvitä samalla onko sinulla oikeus leskeneläkkeeseen.',
      miten: [
        'Soita Kelan palvelunumeroon 020 692 201 (ma-pe 9-16)',
        'Kysy onko sinulla oikeus leskeneläkkeeseen tai lapseneläkkeeseen',
        'Jos sinulla on alle 17-vuotiaita lapsia, kysy lapsilisän yksinhuoltajakorotuksesta'
      ]
    },
    'Hae henkivakuutuskorvaus': {
      kiireellinen: false,
      miksi: 'Henkivakuutuskorvaus ei tule automaattisesti — se pitää hakea erikseen. Voidaan hakea jo ennen perunkirjoitusta ja summa voi olla merkittävä.',
      miten: [
        'Selvitä oliko vainajalla henkivakuutus — tarkista vakuutuskirjoista tai kysy vakuutusyhtiöltä',
        'Selvitä myös oliko vainajalla ryhmähenkivakuutus työnantajan kautta',
        'Ota yhteyttä vakuutusyhtiöön ja pyydä korvaushakemuslomake',
        'Korvaus maksetaan vakuutuksen edunsaajamääräyksen mukaan'
      ]
    },
    'Ilmoita työnantajalle ja taloyhtiölle': {
      kiireellinen: false,
      miksi: 'Työnantajalla voi olla maksamattomia palkkoja tai ryhmähenkivakuutus. Vuokrasopimus ei pääty automaattisesti — se täytyy irtisanoa erikseen.',
      miten: [
        'Soita tai kirjoita vainajan viimeiselle työnantajalle — kysy maksamattomista palkoista',
        'Ilmoita taloyhtiön isännöitsijälle',
        'Jos vainaja asui vuokralla: irtisano vuokrasopimus kirjallisesti — tähän tarvitaan kaikkien osakkaiden allekirjoitukset'
      ]
    },
    'Ohjaa posti uuteen osoitteeseen': {
      kiireellinen: false,
      miksi: 'Vainajalle tuleva posti paljastaa missä palveluissa hän oli asiakkaana — tästä on hyötyä kun aletaan kartoittamaan sopimuksia.',
      miten: [
        'Tee muuttoilmoitus osoitteessa muuttoilmoitus.fi tai Postin toimipisteessä',
        'Ohjaa posti kuolinpesän hoitajan osoitteeseen',
        'Ilmoita uusi osoite myös Verohallinnolle kirjallisesti — tähän tarvitaan kaikkien osakkaiden hyväksyntä'
      ]
    },
  }

  const ohje = ohjeet[tehtava.nimi]

  return (
    <div
      className="rounded transition-all"
      style={{
        backgroundColor: '#0F1E3C',
        border: `1px solid ${auki ? '#C9A84C' : tehtava.tehty ? '#C9A84C' : '#2D3E5C'}`
      }}
    >
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:opacity-80"
        onClick={() => setAuki(!auki)}
      >
        <div
          onClick={(e) => { e.stopPropagation(); onMerkitse() }}
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: tehtava.tehty ? '#C9A84C' : 'transparent',
            border: `2px solid ${tehtava.tehty ? '#C9A84C' : '#4A5568'}`
          }}
        >
          {tehtava.tehty && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
        </div>

        <div className="flex-1 flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{
              color: tehtava.tehty ? '#C9A84C' : 'white',
              textDecoration: tehtava.tehty ? 'line-through' : 'none'
            }}
          >
            {tehtava.nimi}
          </span>
          {ohje?.kiireellinen && (
            <span className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: '#7C3333', color: '#FCA5A5'}}>
              ⏰ Kiireellinen
            </span>
          )}
        </div>

        <span style={{color: '#C9A84C'}} className="text-xs">
          {auki ? '▲ Piilota' : '▼ Näytä ohjeet'}
        </span>
      </div>

      {auki && ohje && (
        <div className="px-4 pb-4 border-t" style={{borderColor: '#2D3E5C'}}>
          <div className="mt-4 mb-4">
            <p style={{color: '#A0AEC0'}} className="text-sm">{ohje.miksi}</p>
          </div>
          <div style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">
            Miten tehdään
          </div>
          <ul className="flex flex-col gap-2 mb-6">
            {ohje.miten.map((askel, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{color: 'white'}}>
                <span style={{color: '#C9A84C'}} className="flex-shrink-0">{i + 1}.</span>
                {askel}
              </li>
            ))}
          </ul>
          <div style={{color: '#C9A84C'}} className="text-xs uppercase tracking-widest mb-2">
            💬 Kommentit tiimille
          </div>
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
          className="px-6 py-3 font-bold rounded hover:opacity-90"
        >
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