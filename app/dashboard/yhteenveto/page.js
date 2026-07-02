'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../supabase'
import TopBar from '../../components/TopBar'

export default function YhteenvetoPage() {
  const router = useRouter()
  const [kuolinpesa, setKuolinpesa] = useState(null)
  const [tehtavat, setTehtavat] = useState([])
  const [tapahtumat, setTapahtumat] = useState([])
  const [jasenet, setJasenet] = useState([])
  const [ladataan, setLadataan] = useState(true)

  useEffect(() => {
    const hae = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/kirjaudu'); return }

      let pesaData = null
      const { data: omaPesa } = await supabase.from('kuolinpesat').select('*').eq('kayttaja_email', user.email).not('vainajan_nimi', 'is', null).neq('vainajan_nimi', '').order('created_at', { ascending: false }).limit(1).single()
      if (omaPesa) {
        pesaData = omaPesa
      } else {
        const { data: jasenRivi } = await supabase.from('jasenet').select('kuolinpesa_id').eq('email', user.email).single()
        if (jasenRivi) {
          const { data: jasenPesa } = await supabase.from('kuolinpesat').select('*').eq('id', jasenRivi.kuolinpesa_id).single()
          if (jasenPesa) pesaData = jasenPesa
        }
      }

      if (!pesaData) { router.push('/dashboard'); return }
      setKuolinpesa(pesaData)

      const [{ data: tehtavatData }, { data: tapahtumatData }, { data: jasenData }] = await Promise.all([
        supabase.from('tehtavat').select('*').eq('kuolinpesa_id', pesaData.id).order('created_at', { ascending: true }),
        supabase.from('tapahtumat').select('*').eq('kuolinpesa_id', pesaData.id).order('created_at', { ascending: false }),
        supabase.from('jasenet').select('email, rooli').eq('kuolinpesa_id', pesaData.id),
      ])

      if (tehtavatData) setTehtavat(tehtavatData)
      if (tapahtumatData) setTapahtumat(tapahtumatData)
      if (jasenData) setJasenet(jasenData)
      setLadataan(false)
    }
    hae()
  }, [])

  if (ladataan) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0B09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#3A3630', fontSize: '13px' }}>Ladataan...</span>
    </div>
  )

  const sopimus_tilat = (() => {
    const raw = kuolinpesa?.sopimus_tilat || {}
    const tilat = {}
    Object.entries(raw).forEach(([k, v]) => { if (!k.startsWith('_m_')) tilat[k] = v })
    return tilat
  })()

  const varat_rastitattu = kuolinpesa?.varat_rastitattu || {}
  const perintovero_tehty = kuolinpesa?.perintovero_tehty || {}
  const perinnonjako_tehty = kuolinpesa?.perinnonjako_tehty || {}

  const ensitoimetTehty = tehtavat.filter(t => t.tehty).length
  const ensitoimetKaikki = tehtavat.length

  const varatTarkistettu = Object.values(varat_rastitattu).filter(v => v === 'kylla' || v === 'ei').length
  const varatKaikki = Object.keys(varat_rastitattu).length || '—'

  const sopimusHoidettu = Object.values(sopimus_tilat).filter(v => v === 'hoidettu').length
  const sopimusKesken = Object.values(sopimus_tilat).filter(v => v === 'kesken').length
  const sopimusEiKoske = Object.values(sopimus_tilat).filter(v => v === 'ei').length

  const perintoveroTehtyMaara = Object.values(perintovero_tehty).filter(Boolean).length
  const perintoveroKaikki = 4
  const perinnonjakoTehtyMaara = Object.values(perinnonjako_tehty).filter(Boolean).length
  const perinnonjakoKaikki = 5

  const pesaAvattu = kuolinpesa?.created_at
    ? new Date(kuolinpesa.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const sulkemisTapahtuma = tapahtumat.find(t => t.teksti === 'Sulki pesän')
  const pesaSuljettu = sulkemisTapahtuma
    ? new Date(sulkemisTapahtuma.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const vaiheKortit = [
    {
      numero: 1, nimi: 'Ensitoimet',
      rivit: [
        { label: 'Tehty', arvo: `${ensitoimetTehty} / ${ensitoimetKaikki}` },
      ]
    },
    {
      numero: 2, nimi: 'Varat ja velat',
      rivit: [
        { label: 'Tarkistettu', arvo: typeof varatKaikki === 'number' ? `${varatTarkistettu} / ${varatKaikki}` : '—' },
      ]
    },
    {
      numero: 3, nimi: 'Sopimukset',
      rivit: [
        { label: 'Hoidettu', arvo: String(sopimusHoidettu) },
        { label: 'Kesken', arvo: String(sopimusKesken) },
        { label: 'Ei koske', arvo: String(sopimusEiKoske) },
      ]
    },
    {
      numero: 5, nimi: 'Perintövero',
      rivit: [
        { label: 'Tehty', arvo: `${perintoveroTehtyMaara} / ${perintoveroKaikki}` },
      ]
    },
    {
      numero: 5, nimi: 'Perinnönjako',
      rivit: [
        { label: 'Tehty', arvo: `${perinnonjakoTehtyMaara} / ${perinnonjakoKaikki}` },
      ]
    },
  ]

  const paivaMuoto = (iso) => new Date(iso).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })
  const aikaMusto = (iso) => new Date(iso).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })

  const tapahtumatRyhmat = []
  tapahtumat.forEach(t => {
    const pvm = paivaMuoto(t.created_at)
    const viimein = tapahtumatRyhmat[tapahtumatRyhmat.length - 1]
    if (viimein && viimein.pvm === pvm) {
      viimein.tapahtumat.push(t)
    } else {
      tapahtumatRyhmat.push({ pvm, tapahtumat: [t] })
    }
  })

  const kayttaja = [kuolinpesa?.kayttaja_email, ...jasenet.map(j => j.email)].filter(Boolean)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0B09' }}>
      <TopBar />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 96px' }}>

        {/* Takaisin */}
        <button
          onClick={() => router.push('/dashboard?vaihe=6')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4E4840', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginBottom: '48px', fontFamily: 'var(--font-body), sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.color = '#8A8278'}
          onMouseLeave={e => e.currentTarget.style.color = '#4E4840'}
        >
          ← Takaisin
        </button>

        {/* Otsikko */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', opacity: 0.7, marginBottom: '16px' }}>Pesän yhteenveto</div>
          <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, color: '#F0EBE3', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '24px' }}>
            {kuolinpesa?.vainajan_nimi || 'Kuolinpesä'}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {kuolinpesa?.kuolinpaiva && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#3A3630', width: '100px', flexShrink: 0 }}>Kuolinpäivä</span>
                <span style={{ fontSize: '11px', color: '#7A7268' }}>{new Date(kuolinpesa.kuolinpaiva).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ fontSize: '11px', color: '#3A3630', width: '100px', flexShrink: 0 }}>Avattu</span>
              <span style={{ fontSize: '11px', color: '#7A7268' }}>{pesaAvattu}</span>
            </div>
            {pesaSuljettu && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#3A3630', width: '100px', flexShrink: 0 }}>Suljettu</span>
                <span style={{ fontSize: '11px', color: '#C9A84C' }}>{pesaSuljettu}</span>
              </div>
            )}
            {kayttaja.length > 0 && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#3A3630', width: '100px', flexShrink: 0 }}>Osakkaat</span>
                <span style={{ fontSize: '11px', color: '#7A7268' }}>{kayttaja.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vaihekortit */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3630', marginBottom: '20px' }}>Vaiheiden tila</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {vaiheKortit.map((vaihe, i) => (
              <div key={i} style={{ backgroundColor: '#110E0B', border: '1px solid rgba(240,235,227,0.06)', padding: '20px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3A3630', marginBottom: '12px' }}>{vaihe.nimi}</div>
                {vaihe.rivit.map((rivi, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#3A3630' }}>{rivi.label}</span>
                    <span style={{ fontSize: '15px', color: '#C9A84C', fontFamily: 'var(--font-display), Georgia, serif', fontWeight: 300 }}>{rivi.arvo}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tapahtumaloki */}
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3630', marginBottom: '20px' }}>Tapahtumaloki</div>
          {tapahtumat.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#3A3630' }}>Ei kirjattuja tapahtumia.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {tapahtumatRyhmat.map((ryhma, i) => (
                <div key={i}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2A2620', marginBottom: '8px', paddingLeft: '4px' }}>{ryhma.pvm}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    {ryhma.tapahtumat.map((t, j) => (
                      <div key={j} style={{ display: 'flex', gap: '16px', padding: '10px 14px', backgroundColor: '#0D0B09', border: '1px solid rgba(240,235,227,0.04)' }}>
                        <span style={{ fontSize: '10px', color: '#2A2620', flexShrink: 0, width: '38px', paddingTop: '1px' }}>{aikaMusto(t.created_at)}</span>
                        <span style={{ fontSize: '12px', color: '#5A5248', flex: 1 }}>{t.teksti}</span>
                        <span style={{ fontSize: '10px', color: '#2A2620', flexShrink: 0 }}>{t.kirjoittaja_email?.split('@')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
