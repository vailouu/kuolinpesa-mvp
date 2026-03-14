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

        {/* Esitarkistukset */}
        {!kaikkiEsiTarkistuksetTehty && (
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

        {/* Edistymispalkki */}
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

        {/* Vaihepalkki */}
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

        {/* Tehtävälista */}
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
                <div
                  key={tehtava.id}
                  onClick={() => merkitseTehdyksi(tehtava.id, tehtava.tehty)}
                  className="flex items-center gap-4 p-4 rounded cursor-pointer hover:opacity-80"
                  style={{backgroundColor: '#0F1E3C', border: `1px solid ${tehtava.tehty ? '#C9A84C' : '#2D3E5C'}`}}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: tehtava.tehty ? '#C9A84C' : 'transparent',
                      border: `2px solid ${tehtava.tehty ? '#C9A84C' : '#4A5568'}`
                    }}
                  >
                    {tehtava.tehty && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: tehtava.tehty ? '#C9A84C' : 'white',
                      textDecoration: tehtava.tehty ? 'line-through' : 'none'
                    }}
                  >
                    {tehtava.nimi}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tiimi */}
        <div className="rounded-lg p-6 mt-6" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
          <h2 className="text-white font-bold text-lg mb-6">Tiimi</h2>
          <KutsuJasen kuolinpesaId={kuolinpesa?.id} />
        </div>

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