'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../supabase'
import TopBar from '../../components/TopBar'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
  borderWarm: 'rgba(201,168,76,0.18)',
  surface: 'rgba(240,235,227,0.03)',
  card: '#0F1107',
}

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }

  .nav-item {
    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
    padding: 11px 16px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${C.secondary};
    border-left: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    display: flex; align-items: center; gap: 10px;
  }
  .nav-item:hover { color: ${C.text}; background: ${C.surface}; }
  .nav-item.active { color: ${C.accent}; border-left-color: ${C.accent}; background: rgba(201,168,76,0.05); }

  .omaisuus-card {
    border: 1px solid ${C.border};
    padding: 28px 24px;
    cursor: pointer;
    background: ${C.surface};
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    position: relative; overflow: hidden;
  }
  .omaisuus-card:hover {
    border-color: ${C.borderWarm};
    background: rgba(201,168,76,0.04);
    transform: translateY(-2px);
  }
  .omaisuus-card.selected {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.06);
  }

  .progress-bar-bg {
    height: 2px; background: ${C.border}; margin-top: 16px;
  }
  .progress-bar-fill {
    height: 2px; background: ${C.accent};
    transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
  }

  .form-input {
    width: 100%;
    background: rgba(240,235,227,0.03);
    border: 1px solid ${C.border};
    color: ${C.text};
    font-family: var(--font-body), sans-serif;
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    color-scheme: dark;
    resize: vertical;
  }
  .form-input::placeholder { color: ${C.secondary}; opacity: 0.5; }
  .form-input:focus {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.06);
  }
  .form-label {
    display: block;
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${C.secondary}; margin-bottom: 7px;
  }

  .btn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: ${C.accent}; background: transparent;
    border: 1px solid rgba(201,168,76,0.35);
    padding: 10px 20px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .btn-gold:hover {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.7);
    box-shadow: 0 0 20px rgba(201,168,76,0.15);
  }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.secondary}; background: transparent;
    border: 1px solid ${C.border};
    padding: 10px 20px; cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover { color: ${C.text}; border-color: rgba(240,235,227,0.2); }

  .item-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid ${C.border};
    font-size: 13px; color: ${C.text};
  }
  .item-row:last-child { border-bottom: none; }
  .delete-btn {
    background: none; border: none; cursor: pointer;
    color: ${C.secondary}; font-size: 18px; line-height: 1;
    opacity: 0.5; transition: opacity 0.2s, color 0.2s;
    padding: 0 4px;
  }
  .delete-btn:hover { opacity: 1; color: #e07070; }

  .badge-done {
    font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
    color: #4ADE80; background: rgba(74,222,128,0.1);
    padding: 3px 8px; border: 1px solid rgba(74,222,128,0.2);
  }
  .badge-empty {
    font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
    color: ${C.secondary}; background: ${C.surface};
    padding: 3px 8px; border: 1px solid ${C.border};
  }

  .section-title {
    font-family: var(--font-display), Georgia, serif;
    font-size: 26px; font-weight: 300; letter-spacing: -0.02em;
    color: ${C.text}; margin-bottom: 6px;
  }
  .section-sub {
    font-size: 13px; color: ${C.secondary}; line-height: 1.7; font-weight: 300;
  }

  .divider { height: 1px; background: ${C.border}; margin: 24px 0; }

  .btn-activate {
    display: inline-flex; align-items: center; justify-content: center; gap: 12px;
    width: 100%;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    color: #0A0806; background: ${C.accent};
    border: none;
    padding: 20px 32px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .btn-activate:hover {
    background: #D4B560;
    box-shadow: 0 8px 40px rgba(201,168,76,0.4);
    transform: translateY(-1px);
  }
  .btn-activate:active { transform: translateY(0); }
  .btn-activate:disabled {
    opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none;
  }

  .checklist-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(240,235,227,0.06);
    font-size: 13px; color: ${C.text};
  }
  .checklist-item:last-child { border-bottom: none; }

  .viesti-preview {
    background: rgba(201,168,76,0.04);
    border: 1px solid rgba(201,168,76,0.18);
    border-left: 3px solid ${C.accent};
    padding: 20px 22px;
    font-size: 14px; color: ${C.text};
    line-height: 1.8; font-style: italic;
    white-space: pre-wrap;
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  .scale-in { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

  .invite-row {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px;
    border: 1px solid ${C.border};
    margin-bottom: 8px;
    background: rgba(240,235,227,0.02);
    font-size: 13px; color: ${C.text};
  }

  .nav-activate {
    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
    padding: 11px 16px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${C.accent};
    border-left: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    display: flex; align-items: center; gap: 10px;
  }
  .nav-activate:hover { background: rgba(201,168,76,0.06); border-left-color: rgba(201,168,76,0.4); }
  .nav-activate.active { border-left-color: ${C.accent}; background: rgba(201,168,76,0.08); }
`

const omaisuusKategoriat = [
  {
    id: 'pankkitilit', nimi: 'Pankkitilit', ikoni: '🏦',
    kuvaus: 'Pankit, tilinumerot, mahdolliset pankkikorttien PIN-koodit säilytyspaikkoineen.',
    kentat: [
      { id: 'pankki', label: 'Pankki', placeholder: 'Esim. OP, Nordea, S-Pankki' },
      { id: 'tilinumero', label: 'Tilinumero (IBAN)', placeholder: 'FI12 3456 7890 1234 56' },
      { id: 'lisatieto', label: 'Lisätietoja', placeholder: 'Esim. käyttötili, säästötili, yritystili' },
    ]
  },
  {
    id: 'sijoitukset', nimi: 'Sijoitukset', ikoni: '📈',
    kuvaus: 'Osakkeet, rahastot, joukkovelkakirjat. Missä palvelussa ja millä tilillä.',
    kentat: [
      { id: 'palvelu', label: 'Palvelu tai välittäjä', placeholder: 'Esim. Nordnet, OP, Danske Bank' },
      { id: 'sisalto', label: 'Mitä sijoituksia', placeholder: 'Esim. Nokian osakkeita, S&P500-rahasto' },
      { id: 'lisatieto', label: 'Lisätietoja', placeholder: 'Esim. tilinumero, käyttäjätunnus' },
    ]
  },
  {
    id: 'kiinteistot', nimi: 'Kiinteistöt ja asunnot', ikoni: '🏠',
    kuvaus: 'Omistamasi asunnot, mökki, maa tai metsätilat. Avainten sijainti.',
    kentat: [
      { id: 'osoite', label: 'Osoite tai sijaintitieto', placeholder: 'Esim. Mannerheimintie 1, Helsinki' },
      { id: 'tyyppi', label: 'Tyyppi', placeholder: 'Esim. omakotitalo, asunto-osake, metsätila, mökki' },
      { id: 'avaimet', label: 'Avainten sijainti', placeholder: 'Esim. keittiön laatikossa, naapurilla Matti Virtasella' },
    ]
  },
  {
    id: 'ajoneuvot', nimi: 'Ajoneuvot', ikoni: '🚗',
    kuvaus: 'Auto, moottoripyörä, vene, mönkijä. Rekisteritunnus ja sijainti.',
    kentat: [
      { id: 'tyyppi', label: 'Ajoneuvo', placeholder: 'Esim. Toyota Corolla 2018' },
      { id: 'rekisteri', label: 'Rekisteritunnus', placeholder: 'Esim. ABC-123' },
      { id: 'sijainti', label: 'Sijainti', placeholder: 'Esim. kotitallin autotalli, Mikkelin keskusta' },
    ]
  },
  {
    id: 'vakuutukset', nimi: 'Vakuutukset', ikoni: '🛡️',
    kuvaus: 'Henkivakuutus, kotivakuutus, tapaturmavakuutus. Yhtiö ja sopimusnumero.',
    kentat: [
      { id: 'yhtio', label: 'Vakuutusyhtiö', placeholder: 'Esim. LähiTapiola, OP, If, Pohjola' },
      { id: 'tyyppi', label: 'Vakuutuksen tyyppi', placeholder: 'Esim. henkivakuutus, kotivakuutus' },
      { id: 'sopimusnumero', label: 'Sopimusnumero', placeholder: 'Esim. 1234567' },
    ]
  },
  {
    id: 'muut', nimi: 'Muu arvo-omaisuus', ikoni: '💎',
    kuvaus: 'Korut, taide, antiikki, käteinen kotona, tallelokero.',
    kentat: [
      { id: 'kuvaus', label: 'Kuvaus', placeholder: 'Esim. kultakello, 1950-luvun öljymaalaus' },
      { id: 'sijainti', label: 'Sijainti', placeholder: 'Esim. makuuhuoneen lipastossa, tallelokerossa OP:ssa' },
      { id: 'arvo', label: 'Arvioitu arvo', placeholder: 'Esim. n. 2000 €' },
    ]
  },
]

function TooltipOhje({ teksti }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignSelf: 'center' }}
      onMouseEnter={e => e.currentTarget.querySelector('[data-tooltip]').style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.querySelector('[data-tooltip]').style.opacity = '0'}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'default', flexShrink: 0,
        color: '#C9A84C', fontSize: '11px', fontWeight: 600,
        fontFamily: 'var(--font-body), sans-serif',
      }}>?</div>
      <div data-tooltip style={{
        position: 'absolute', left: '26px', top: '0',
        width: '360px',
        backgroundColor: '#0D0B09',
        border: '1px solid rgba(201,168,76,0.2)',
        padding: '16px 20px',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.15s ease',
        zIndex: 50,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <p style={{ fontSize: '12px', color: '#A09890', lineHeight: 1.7, margin: 0 }}>{teksti}</p>
      </div>
    </div>
  )
}

const vaiheet = [
  { id: 1, nimi: 'Omat tiedot', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 2, nimi: 'Omaisuus', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 3, nimi: 'Sopimukset', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { id: 4, nimi: 'Dokumentit', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { id: 5, nimi: 'Viimeinen tahto', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
]

export default function ValmisteleDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [aktiivinenVaihe, setAktiivinenVaihe] = useState(0)
  const [ladataan, setLadataan] = useState(true)
  const [aktivoitu, setAktivoitu] = useState(false)
  const [kutsut, setKutsut] = useState([{ sahkoposti: '', rooli: 'osakas' }])

  // Omat tiedot
  const [omatTiedot, setOmatTiedot] = useState({
    nimi: '', syntymaaika: '', osoite: '', puhelin: '', sahkoposti: '',
    laakari: '', lakimies: '', tilitoimisto: '', lisatieto: '',
  })
  const [lahiomainen, setLahiomainen] = useState({ nimi: '', suhde: '', puhelin: '', sahkoposti: '' })
  const [omatTiedotTallennettu, setOmatTiedotTallennettu] = useState(false)

  // Omaisuus
  const [valittuKategoria, setValittuKategoria] = useState(null)

  const navPush = useCallback((vaihe, kategoria = null) => {
    window.history.pushState({ vaihe, kategoria }, '')
    setAktiivinenVaihe(vaihe)
    setValittuKategoria(kategoria)
  }, [])

  useEffect(() => {
    window.history.replaceState({ vaihe: 0, kategoria: null }, '')
    const handlePop = (e) => {
      const s = e.state
      if (!s) return
      setAktiivinenVaihe(s.vaihe ?? 0)
      setValittuKategoria(s.kategoria ?? null)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const [omaisuusItems, setOmaisuusItems] = useState({}) // { kategoriaId: [{kentat}] }
  const [uusiItem, setUusiItem] = useState({})

  // Sopimukset
  const [sopimukset, setSopimukset] = useState('')

  // Dokumentit
  const [dokumentit, setDokumentit] = useState({
    testamentti: '', avioehto: '', vakuutuskirjat: '', passit: '', muut: '',
  })

  // Viimeinen tahto
  const [tahto, setTahto] = useState({
    hautaus: '', musiikki: '', jakotoiveet: '', viesti: '', saateviesti: '',
  })

  useEffect(() => {
    const tarkista = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/kirjaudu'); return }
      if (user.user_metadata?.tili_tyyppi !== 'valmistelu') { router.replace('/dashboard'); return }
      setUser(user)
      setLadataan(false)
    }
    tarkista()
  }, [])

  const omaisuusLukumaara = (katId) => (omaisuusItems[katId] || []).length

  const lisaaOmaisuus = (katId) => {
    if (Object.values(uusiItem).every(v => !v.trim())) return
    setOmaisuusItems(prev => ({
      ...prev,
      [katId]: [...(prev[katId] || []), { ...uusiItem, id: Date.now() }]
    }))
    setUusiItem({})
  }

  const poistaOmaisuus = (katId, itemId) => {
    setOmaisuusItems(prev => ({
      ...prev,
      [katId]: (prev[katId] || []).filter(i => i.id !== itemId)
    }))
  }

  const tallennaTiedot = () => setOmatTiedotTallennettu(true)

  if (ladataan) return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{css}</style>
      <div style={{ color: C.secondary, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Ladataan…</div>
    </div>
  )

  const kat = valittuKategoria ? omaisuusKategoriat.find(k => k.id === valittuKategoria) : null

  const sopimuksetTaytetty = Object.values(JSON.parse(sopimukset || '{}')).some(v => v && v.trim())
  const dokumentitTaytetty = Object.values(dokumentit).some(v => v && v.trim())
  const viestiKirjoitettu = !!(tahto.viesti && tahto.viesti.trim())
  const omaisuusMaaraSidebar = Object.values(omaisuusItems).reduce((s, arr) => s + arr.length, 0)
  const valmisCount = [omatTiedotTallennettu, omaisuusMaaraSidebar > 0, sopimuksetTaytetty, dokumentitTaytetty, viestiKirjoitettu].filter(Boolean).length

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>
      <TopBar />

      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── VASEN NAVIGAATIO ── */}
        <div style={{
          width: '220px', flexShrink: 0,
          borderRight: `1px solid ${C.border}`,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
          {/* Logo / otsikko */}
          <div style={{ padding: '28px 24px 24px', borderBottom: `1px solid rgba(201,168,76,0.28)` }}>
            <button onClick={() => router.push('/')} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase',
              color: C.text, transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = C.text}
            >
              Pesänhoitaja
            </button>
          </div>

          {/* Progress-kaari */}
          {(() => {
            const pct = valmisCount / 5
            const aktiivinen = aktiivinenVaihe === 0
            const r = 28, cx = 32, cy = 32
            const circumference = 2 * Math.PI * r
            const dashOffset = circumference * (1 - pct)
            return (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                width: '100%', padding: '16px 18px',
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{ flexShrink: 0 }}>
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(240,235,227,0.06)" strokeWidth="3" />
                    <circle
                      cx={cx} cy={cy} r={r} fill="none"
                      stroke={C.accent} strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      transform={`rotate(-90 ${cx} ${cy})`}
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                    <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="central"
                      fill={C.accent} fontSize="13" fontFamily="var(--font-body), sans-serif" fontWeight="500" letterSpacing="0.02em"
                    >{Math.round(pct * 100)}%</text>
                    <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central"
                      fill={C.accent} fontSize="7.5" fontFamily="var(--font-body), sans-serif" letterSpacing="0.12em"
                    >VALMIS</text>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-body), sans-serif', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, lineHeight: 1.2, marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.user_metadata?.etunimi || user?.user_metadata?.full_name?.split(' ')[0] || '—'}
                  </div>
                  <div style={{ fontSize: '10px', color: C.secondary, letterSpacing: '0.03em' }}>
                    {valmisCount} / 5 osiota
                  </div>
                </div>
              </div>
            )
          })()}

          <div style={{ paddingTop: '8px' }} />

          <button
            className={`nav-item${aktiivinenVaihe === 0 ? ' active' : ''}`}
            onClick={() => navPush(0, null)}
          >
            <span style={{ flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></span>
            Aloita tästä
          </button>

          {vaiheet.map(v => (
            <button
              key={v.id}
              className={`nav-item${aktiivinenVaihe === v.id ? ' active' : ''}`}
              onClick={() => navPush(v.id, null)}
            >
              <span style={{ flexShrink: 0 }}>{v.icon}</span>
              {v.nimi}
            </button>
          ))}

          {/* Aktivoi-painike */}
          <div style={{ margin: '16px 0 0', borderTop: `1px solid ${C.border}`, paddingTop: '12px' }}>
            <button
              className={`nav-activate${aktiivinenVaihe === 6 ? ' active' : ''}`}
              onClick={() => navPush(6, null)}
            >
              <span style={{ flexShrink: 0 }}>
                {aktivoitu
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                }
              </span>
              {aktivoitu ? 'Pesä aktivoitu' : 'Aktivoi kuolinpesätila'}
            </button>
          </div>

        </div>

        {/* ── PÄÄSISÄLTÖ ── */}
        <div style={{ flex: 1, padding: '48px 56px', maxWidth: '900px' }}>

          {/* ── 0. ALOITA TÄSTÄ ── */}
          {aktiivinenVaihe === 0 && (
            <div className="fade-up" style={{ maxWidth: '560px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '20px', height: '1px', background: C.accent }} />
                Tervetuloa
              </div>
              <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em', color: C.text, lineHeight: 1.1, margin: '0 0 32px' }}>
                Valmistele asioita<br /><em style={{ fontStyle: 'italic', color: C.accent }}>läheisillesi.</em>
              </h1>

              <p style={{ fontSize: '14px', color: '#A09890', lineHeight: 1.9, margin: '0 0 16px' }}>
                Tämä osio on tarkoitettu oman elämän tietojen järjestämiseen etukäteen — jotta omaisesi löytävät kaiken oleellisen nopeasti, kun sitä tarvitaan.
              </p>
              <p style={{ fontSize: '14px', color: '#A09890', lineHeight: 1.9, margin: '0 0 48px' }}>
                Aloita{' '}
                <button onClick={() => navPush(1, null)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '14px', color: C.accent, fontFamily: 'var(--font-body), sans-serif', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(201,168,76,0.4)' }}>Omat tiedot</button>
                {' '}-osiosta ja etene järjestyksessä.
              </p>

              <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', marginBottom: '40px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
                {[
                  { label: 'Omat tiedot', teksti: 'Henkilötietosi, yhteystietosi ja tärkeät yhteyshenkilöt kuten lääkäri ja lakimies.' },
                  { label: 'Omaisuus', teksti: 'Kaikki omaisuutesi kategorioittain — kiinteistöt, ajoneuvot, säästöt, arvo-esineet.' },
                  { label: 'Sopimukset', teksti: 'Palvelut ja sopimukset joihin sinulla on tili tai jatkuva maksu — jotta omaisesi tietävät mitä irtisanoa.' },
                  { label: 'Dokumentit', teksti: 'Missä tärkeät paperit fyysisesti sijaitsevat — testamentti, avioehto, vakuutuskirjat.' },
                  { label: 'Viimeinen tahto', teksti: 'Hautaustoiveet, musiikki, jakotoiveet ja saateviesti läheisille.' },
                ].map(osio => (
                  <div key={osio.label}>
                    <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: '6px', fontFamily: 'var(--font-body), sans-serif' }}>{osio.label}</div>
                    <p style={{ fontSize: '13px', color: '#6A6258', lineHeight: 1.8, margin: 0 }}>{osio.teksti}</p>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)', marginBottom: '40px' }} />

              <button
                onClick={() => navPush(1, null)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: C.accent, background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.35)',
                  padding: '16px 28px', cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.7)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                Aloita omat tiedot
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}

          {/* ── 1. OMAT TIEDOT ── */}
          {aktiivinenVaihe === 1 && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>01 — Omat tiedot</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>Perustietosi</h1>
                <TooltipOhje teksti="Täytä omat perustietosi ja yhteystietosi. Nämä tiedot auttavat omaisiasi löytämään oikeat viranomaiset ja yhteystiedot nopeasti. Kirjaa myös lähiomaisesi tiedot — hänelle lähetetään tieto kun pesä aktivoituu." />
              </div>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Nämä tiedot auttavat omaisiasi löytämään oikeat viranomaiset ja yhteystiedot nopeasti.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { id: 'nimi', label: 'Koko nimesi', placeholder: 'Etunimi Sukunimi', type: 'text' },
                  { id: 'syntymaaika', label: 'Syntymäaika', placeholder: '1.1.1950', type: 'text' },
                  { id: 'osoite', label: 'Osoite', placeholder: 'Katuosoite, postinumero, kaupunki', type: 'text' },
                  { id: 'puhelin', label: 'Puhelinnumero', placeholder: '+358 40 123 4567', type: 'text' },
                  { id: 'sahkoposti', label: 'Sähköpostiosoite', placeholder: 'sinun@email.fi', type: 'email' },
                ].map(k => (
                  <div key={k.id}>
                    <label className="form-label">{k.label}</label>
                    <input className="form-input" type={k.type} placeholder={k.placeholder}
                      value={omatTiedot[k.id]}
                      onChange={e => setOmatTiedot({ ...omatTiedot, [k.id]: e.target.value })} />
                  </div>
                ))}
              </div>

              <div className="divider" />
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '20px' }}>Tärkeät yhteystiedot</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { id: 'laakari', label: 'Oma lääkäri', placeholder: 'Nimi ja vastaanotto' },
                  { id: 'lakimies', label: 'Lakimies / asianajaja', placeholder: 'Nimi ja toimisto' },
                  { id: 'tilitoimisto', label: 'Tilitoimisto', placeholder: 'Nimi ja yhteystieto' },
                ].map(k => (
                  <div key={k.id}>
                    <label className="form-label">{k.label}</label>
                    <input className="form-input" type="text" placeholder={k.placeholder}
                      value={omatTiedot[k.id]}
                      onChange={e => setOmatTiedot({ ...omatTiedot, [k.id]: e.target.value })} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px' }}>
                <label className="form-label">Muuta tärkeää</label>
                <textarea className="form-input" rows={3}
                  placeholder="Esim. allergiat, lääkitys, erikoistoiveet"
                  value={omatTiedot.lisatieto}
                  onChange={e => setOmatTiedot({ ...omatTiedot, lisatieto: e.target.value })} />
              </div>

              <div className="divider" />
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '8px' }}>Lähiomainen</p>
              <p style={{ fontSize: '13px', color: '#6A6258', lineHeight: 1.7, marginBottom: '20px' }}>
                Henkilö, joka todennäköisesti hoitaa kuolinpesän asiat. Hänelle lähetetään tieto aktivointihetkellä.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { id: 'nimi', label: 'Nimi', placeholder: 'Etunimi Sukunimi', type: 'text' },
                  { id: 'suhde', label: 'Suhde', placeholder: 'Esim. tytär, puoliso, poika', type: 'text' },
                  { id: 'puhelin', label: 'Puhelinnumero', placeholder: '+358 40 123 4567', type: 'text' },
                  { id: 'sahkoposti', label: 'Sähköposti', placeholder: 'omainen@email.fi', type: 'email' },
                ].map(k => (
                  <div key={k.id}>
                    <label className="form-label">{k.label}</label>
                    <input className="form-input" type={k.type} placeholder={k.placeholder}
                      value={lahiomainen[k.id]}
                      onChange={e => setLahiomainen({ ...lahiomainen, [k.id]: e.target.value })} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="btn-gold" onClick={tallennaTiedot}>
                  Tallenna tiedot
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                {omatTiedotTallennettu && (
                  <span style={{ fontSize: '11px', color: '#4ADE80', letterSpacing: '0.1em' }}>✓ Tallennettu</span>
                )}
              </div>
            </div>
          )}

          {/* ── 2. OMAISUUS ── */}
          {aktiivinenVaihe === 2 && !valittuKategoria && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>02 — Omaisuus</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>Omaisuutesi</h1>
                <TooltipOhje teksti="Kirjaa kaikki omaisuutesi kategorioittain. Tarkkoja arvoja ei tarvita — suuntaa-antavat tiedot ja sijainti riittävät. Omaisesi löytävät omaisuuden ilman arvailutyötä." />
              </div>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Kirjaa omaisuutesi kategorioittain. Omaisesi näkevät tarkat tiedot heti kun niitä tarvitaan.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: C.border }}>
                {omaisuusKategoriat.map(k => {
                  const maara = omaisuusLukumaara(k.id)
                  return (
                    <div key={k.id} className="omaisuus-card" onClick={() => navPush(aktiivinenVaihe, k.id)}>
                      <div style={{ fontSize: '22px', marginBottom: '12px' }}>{k.ikoni}</div>
                      <div style={{
                        fontFamily: 'var(--font-body), sans-serif',
                        fontSize: '13px', fontWeight: 500, color: C.text,
                        marginBottom: '6px', letterSpacing: '0.02em',
                      }}>
                        {k.nimi}
                      </div>
                      <div style={{ fontSize: '12px', color: C.secondary, lineHeight: 1.6, marginBottom: '16px' }}>
                        {k.kuvaus}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className={maara > 0 ? 'badge-done' : 'badge-empty'}>
                          {maara > 0 ? `${maara} lisätty` : 'Tyhjä'}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" style={{ opacity: 0.6 }}>
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: maara > 0 ? '100%' : '0%' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── 2b. OMAISUUS — KATEGORIA AUKI ── */}
          {aktiivinenVaihe === 2 && valittuKategoria && kat && (
            <div className="fade-up">
              <button className="btn-ghost" onClick={() => window.history.back()} style={{ marginBottom: '28px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Takaisin
              </button>

              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '10px' }}>
                {kat.ikoni} {kat.nimi}
              </p>
              <h1 className="section-title" style={{ marginBottom: '6px' }}>{kat.nimi}</h1>
              <p className="section-sub" style={{ marginBottom: '32px' }}>{kat.kuvaus}</p>

              {/* Lisätyt kohteet */}
              {(omaisuusItems[kat.id] || []).length > 0 && (
                <div style={{ border: `1px solid ${C.border}`, marginBottom: '28px' }}>
                  {(omaisuusItems[kat.id] || []).map(item => (
                    <div key={item.id} className="item-row">
                      <div style={{ lineHeight: 1.6 }}>
                        {kat.kentat.map(k => item[k.id] ? (
                          <div key={k.id} style={{ fontSize: '13px' }}>
                            <span style={{ color: C.secondary, fontSize: '11px' }}>{k.label}: </span>
                            {item[k.id]}
                          </div>
                        ) : null)}
                      </div>
                      <button className="delete-btn" onClick={() => poistaOmaisuus(kat.id, item.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Lisää uusi */}
              <div style={{
                border: `1px solid ${C.borderWarm}`,
                padding: '24px',
                background: 'rgba(201,168,76,0.02)',
              }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: '20px' }}>
                  Lisää kohde
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {kat.kentat.map(k => (
                    <div key={k.id}>
                      <label className="form-label">{k.label}</label>
                      <input className="form-input" type="text" placeholder={k.placeholder}
                        value={uusiItem[k.id] || ''}
                        onChange={e => setUusiItem({ ...uusiItem, [k.id]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <button className="btn-gold" onClick={() => lisaaOmaisuus(kat.id)}>
                  Lisää
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── 3. SOPIMUKSET ── */}
          {aktiivinenVaihe === 3 && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>03 — Sopimukset</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>Sopimukset ja tilaukset</h1>
                <TooltipOhje teksti="Lista palveluista ja sopimuksista joihin sinulla on tili tai jatkuva maksu. Omaisesi tietävät mitä pitää irtisanoa ja missä sinulla on tilejä — säästää heiltä merkittävästi aikaa ja vaivaa." />
              </div>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Lista palveluista joihin sinulla on tili tai sopimus. Omaisesi tietävät mitä pitää irtisanoa.
              </p>

              {[
                { id: 'puhelin', label: 'Puhelinliittymä', placeholder: 'Esim. Elisa, liittymänumero 040 123 4567' },
                { id: 'internet', label: 'Internet / laajakaista', placeholder: 'Esim. DNA Laajakaista, sopimus 12kk' },
                { id: 'sahko', label: 'Sähkösopimus', placeholder: 'Esim. Helen Oy, asiakastunnus 12345' },
                { id: 'vuokra', label: 'Vuokrasopimus', placeholder: 'Esim. vuokra 800 €/kk, irtisanomisaika 1kk' },
                { id: 'vakuutusyhtiö', label: 'Vakuutusyhtiö', placeholder: 'Esim. LähiTapiola, asiakastunnus 67890' },
                { id: 'pankki', label: 'Pankki', placeholder: 'Esim. Nordea, verkkopankkitunnus' },
                { id: 'muut', label: 'Muut sopimukset ja tilaukset', placeholder: 'Esim. Netflix, Spotify, kuntosali, lehtitilaukset...' },
              ].map(k => (
                <div key={k.id} style={{ marginBottom: '20px' }}>
                  <label className="form-label">{k.label}</label>
                  <textarea className="form-input" rows={2} placeholder={k.placeholder}
                    value={(JSON.parse(sopimukset || '{}'))[k.id] || ''}
                    onChange={e => {
                      const obj = JSON.parse(sopimukset || '{}')
                      obj[k.id] = e.target.value
                      setSopimukset(JSON.stringify(obj))
                    }} />
                </div>
              ))}

              <div style={{ marginTop: '8px' }}>
                <button className="btn-gold">
                  Tallenna
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── 4. DOKUMENTIT ── */}
          {aktiivinenVaihe === 4 && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>04 — Dokumentit</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>Tärkeät dokumentit</h1>
                <TooltipOhje teksti="Missä tärkeät paperit fyysisesti sijaitsevat — testamentti, avioehto, vakuutuskirjat, passit. Skannauksia ei tarvita, pelkkä sijainti riittää. Omaisesi löytävät ne nopeasti tarvittaessa." />
              </div>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Missä tärkeät paperit fyysisesti sijaitsevat. Ei tarvita skannauksia — pelkkä sijainti riittää.
              </p>

              {[
                { id: 'testamentti', label: 'Testamentti', placeholder: 'Esim. keittiön yläkaapissa vasemmalla, kirjekuoressa' },
                { id: 'avioehto', label: 'Avioehto', placeholder: 'Esim. ei olemassa / pankin tallelokerossa' },
                { id: 'vakuutuskirjat', label: 'Vakuutuskirjat', placeholder: 'Esim. toimistopöydän alalaatikossa, vihreä kansio' },
                { id: 'passit', label: 'Passit ja henkilöllisyystodistukset', placeholder: 'Esim. makuuhuoneen lipastossa oikealla' },
                { id: 'muut', label: 'Muut tärkeät dokumentit', placeholder: 'Esim. syntymätodistus, vanhat sopimukset — missä sijaitsevat' },
              ].map(k => (
                <div key={k.id} style={{ marginBottom: '20px' }}>
                  <label className="form-label">{k.label}</label>
                  <textarea className="form-input" rows={2} placeholder={k.placeholder}
                    value={dokumentit[k.id]}
                    onChange={e => setDokumentit({ ...dokumentit, [k.id]: e.target.value })} />
                </div>
              ))}

              <button className="btn-gold">
                Tallenna
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── 5. VIIMEINEN TAHTO ── */}
          {aktiivinenVaihe === 5 && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>05 — Viimeinen tahto</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <h1 className="section-title" style={{ margin: 0 }}>Hautaustoiveet ja<br />
                  <em style={{ fontStyle: 'italic', color: C.accent }}>viimeinen tahto.</em>
                </h1>
                <TooltipOhje teksti="Hautaustoiveesi, musiikkitoiveet, jakotoiveet ja saateviesti läheisille. Nämä ovat usein vaikeita selvittää jälkikäteen — kirjaamalla ne etukäteen helpotat läheistesi taakkaa merkittävästi." />
              </div>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Nämä toiveet voivat vähentää omaisten välistä erimielisyyttä merkittävästi. Kirjoita vapaasti.
              </p>

              {[
                { id: 'saateviesti', label: 'Saateviesti pesään', placeholder: 'Lyhyt viesti omaisillesi pesän käytöstä — tämä näytetään heille ensimmäisenä kun he kirjautuvat. Esim. "Löydätte täältä kaikki tiedot omaisuudestani ja sopimuksistani..."', rows: 4 },
                { id: 'hautaus', label: 'Hautaustoiveet', placeholder: 'Esim. arkkuhautaus, tuhkaus, hautausmaa, uskonnollisuus...' },
                { id: 'musiikki', label: 'Toivomasi musiikki tai muistotilaisuus', placeholder: 'Esim. Sibelius Finlandia, ei kirkollista seremoniaa...' },
                { id: 'jakotoiveet', label: 'Toiveet omaisuuden jaosta', placeholder: 'Esim. mökki Pekalle, äidin korut Marialle — nämä eivät ole juridisesti sitovia ilman testamenttia' },
                { id: 'viesti', label: 'Henkilökohtainen viesti omaisille', placeholder: 'Kirjoita mitä haluat omaisillesi sanoa — tämä on yksityinen viestisi, ei liity pesän hoitoon.' },
              ].map((k, i) => (
                <div key={k.id} style={{ marginBottom: '24px' }}>
                  <label className="form-label">{k.label}</label>
                  <textarea className="form-input" rows={k.rows || (k.id === 'viesti' ? 6 : 3)}
                    placeholder={k.placeholder}
                    value={tahto[k.id]}
                    onChange={e => setTahto({ ...tahto, [k.id]: e.target.value })} />
                </div>
              ))}

              {tahto.jakotoiveet && (
                <div style={{
                  border: `1px solid rgba(201,168,76,0.2)`,
                  background: 'rgba(201,168,76,0.04)',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  fontSize: '12px', color: C.secondary, lineHeight: 1.7,
                }}>
                  ⚠️ Jakotoiveet eivät ole juridisesti sitovia. Testamentti tarvitaan sitovaan omaisuuden jakoon.
                </div>
              )}

              <button className="btn-gold">
                Tallenna
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── 6. AKTIVOI KUOLINPESÄTILA ── */}
          {aktiivinenVaihe === 6 && (() => {
            const omaisuusMaara = Object.values(omaisuusItems).reduce((s, arr) => s + arr.length, 0)
            const sopimuksetTaytetty = Object.values(JSON.parse(sopimukset || '{}')).some(v => v && v.trim())
            const dokumentitTaytetty = Object.values(dokumentit).some(v => v && v.trim())
            const viestiKirjoitettu = !!(tahto.viesti && tahto.viesti.trim())
            const valmisCount = [omatTiedotTallennettu, omaisuusMaara > 0, sopimuksetTaytetty, dokumentitTaytetty, viestiKirjoitettu].filter(Boolean).length

            const tarkistuslista = [
              { label: 'Omat tiedot', done: omatTiedotTallennettu, info: omatTiedotTallennettu ? omatTiedot.nimi || 'Tallennettu' : 'Ei täytetty' },
              { label: 'Omaisuus', done: omaisuusMaara > 0, info: omaisuusMaara > 0 ? `${omaisuusMaara} kohdetta lisätty` : 'Ei kohdetta' },
              { label: 'Sopimukset', done: sopimuksetTaytetty, info: sopimuksetTaytetty ? 'Täytetty' : 'Ei täytetty' },
              { label: 'Dokumentit', done: dokumentitTaytetty, info: dokumentitTaytetty ? 'Täytetty' : 'Ei täytetty' },
              { label: 'Viesti omaisille', done: viestiKirjoitettu, info: viestiKirjoitettu ? 'Kirjoitettu' : 'Ei kirjoitettu' },
            ]

            return (
              <div className="fade-up">
                <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>
                  Aktivointi
                </p>
                <h1 className="section-title">
                  Aktivoi<br />
                  <em style={{ fontStyle: 'italic', color: C.accent }}>kuolinpesätila.</em>
                </h1>
                <p className="section-sub" style={{ marginBottom: '40px' }}>
                  Kun aktivoit, omaisesi voivat kirjautua sisään ja nähdä kaiken valmistellun — tiedot, omaisuuden, sopimukset ja viestisi. Aktivointi on kertaluonteinen tapahtuma.
                </p>

                {!aktivoitu ? (
                  <>
                    {/* Mitä tapahtuu */}
                    <div style={{
                      border: `1px solid ${C.border}`,
                      background: C.surface,
                      padding: '24px',
                      marginBottom: '32px',
                    }}>
                      <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '18px' }}>
                        Mitä tapahtuu
                      </div>
                      {[
                        { ikoni: '🔓', teksti: 'Valmisteltu tieto tulee omaisten nähtäville heti aktivoinnin jälkeen' },
                        { ikoni: '📧', teksti: 'Voit kutsua omaiset ja muut osakkaat sähköpostilla — he luovat omat tunnukset' },
                        { ikoni: '🔒', teksti: 'Viestisi omaisille näytetään heille kirjautuessa ensimmäistä kertaa' },
                        { ikoni: '📋', teksti: 'Pesänhoitaja luo yhteisen työtilan kaikille osakkaille' },
                      ].map((k, i) => (
                        <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: i < 3 ? '14px' : 0 }}>
                          <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1.4 }}>{k.ikoni}</span>
                          <span style={{ fontSize: '13px', color: C.secondary, lineHeight: 1.7 }}>{k.teksti}</span>
                        </div>
                      ))}
                    </div>

                    {/* Yhteenveto */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '4px' }}>
                        Mitä olet valmistellut
                      </div>
                      <div style={{ fontSize: '22px', fontFamily: 'var(--font-display), Georgia, serif', color: C.accent, marginBottom: '16px' }}>
                        {valmisCount}<span style={{ fontSize: '14px', color: C.secondary, marginLeft: '6px' }}>/ 5 osiota</span>
                      </div>

                      <div style={{ border: `1px solid ${C.border}` }}>
                        {tarkistuslista.map((k, i) => (
                          <div key={i} className="checklist-item" style={{ padding: '14px 18px' }}>
                            <div style={{
                              width: '22px', height: '22px', flexShrink: 0,
                              border: `1px solid ${k.done ? 'rgba(74,222,128,0.4)' : C.border}`,
                              background: k.done ? 'rgba(74,222,128,0.1)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '12px',
                            }}>
                              {k.done ? <span style={{ color: '#4ADE80' }}>✓</span> : <span style={{ color: C.secondary, opacity: 0.3 }}>—</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', color: k.done ? C.text : C.secondary }}>{k.label}</div>
                            </div>
                            <div style={{ fontSize: '11px', color: k.done ? '#4ADE80' : C.secondary, opacity: k.done ? 1 : 0.6 }}>
                              {k.info}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Viesti omaisille */}
                    {viestiKirjoitettu && (
                      <div style={{ marginBottom: '36px' }}>
                        <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '12px' }}>
                          Viestisi omaisille
                        </div>
                        <div className="viesti-preview">
                          {tahto.viesti}
                        </div>
                      </div>
                    )}

                    {!viestiKirjoitettu && (
                      <div style={{
                        border: `1px solid ${C.border}`,
                        padding: '16px 18px',
                        marginBottom: '32px',
                        display: 'flex', alignItems: 'center', gap: '14px',
                      }}>
                        <span style={{ fontSize: '16px', opacity: 0.5 }}>✉️</span>
                        <div>
                          <div style={{ fontSize: '12px', color: C.secondary, marginBottom: '4px' }}>Viesti omaisille puuttuu</div>
                          <button
                            style={{ background: 'none', border: 'none', color: C.accent, fontSize: '11px', letterSpacing: '0.1em', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                            onClick={() => navPush(5, null)}
                          >
                            Kirjoita viesti →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Aktivointipainike */}
                    <button
                      className="btn-activate"
                      onClick={() => setAktivoitu(true)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                      Aktivoi kuolinpesätila
                    </button>
                    <p style={{ fontSize: '11px', color: C.secondary, textAlign: 'center', marginTop: '12px', lineHeight: 1.6 }}>
                      Aktivoinnin jälkeen voit kutsua omaisia ja osakkaita
                    </p>
                  </>
                ) : (
                  /* ── POST-AKTIVOINTI ── */
                  <div>
                    {/* Vahvistus */}
                    <div className="scale-in" style={{
                      textAlign: 'center',
                      padding: '40px 0',
                      marginBottom: '40px',
                      borderBottom: `1px solid ${C.border}`,
                    }}>
                      <div style={{
                        width: '64px', height: '64px', margin: '0 auto 20px',
                        border: `1px solid rgba(74,222,128,0.4)`,
                        background: 'rgba(74,222,128,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px',
                      }}>
                        ✓
                      </div>
                      <div style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '22px', color: '#4ADE80', marginBottom: '8px', fontWeight: 300 }}>
                        Pesä aktivoitu
                      </div>
                      <div style={{ fontSize: '13px', color: C.secondary, lineHeight: 1.7 }}>
                        Omaisesi voivat nyt kirjautua sisään ja<br />nähdä kaiken valmistellun.
                      </div>
                    </div>

                    {/* Kutsu osakkaat */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '6px' }}>
                        Kutsu osakkaat
                      </div>
                      <p style={{ fontSize: '13px', color: C.secondary, lineHeight: 1.7, marginBottom: '20px' }}>
                        He saavat sähköpostilinkin ja luovat omat tunnuksensa. Lisää kaikki kuolinpesän osakkaat.
                      </p>

                      {kutsut.map((k, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <label className="form-label">Sähköpostiosoite</label>
                            <input
                              className="form-input"
                              type="email"
                              placeholder="etunimi.sukunimi@esimerkki.fi"
                              value={k.sahkoposti}
                              onChange={e => {
                                const uudet = [...kutsut]
                                uudet[i] = { ...uudet[i], sahkoposti: e.target.value }
                                setKutsut(uudet)
                              }}
                            />
                          </div>
                          <div style={{ width: '130px' }}>
                            <label className="form-label">Rooli</label>
                            <select
                              className="form-input"
                              value={k.rooli}
                              onChange={e => {
                                const uudet = [...kutsut]
                                uudet[i] = { ...uudet[i], rooli: e.target.value }
                                setKutsut(uudet)
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <option value="osakas">Osakas</option>
                              <option value="katselija">Katselija</option>
                              <option value="pesanhoitaja">Pesänhoitaja</option>
                            </select>
                          </div>
                          {kutsut.length > 1 && (
                            <button
                              className="delete-btn"
                              style={{ marginTop: '22px' }}
                              onClick={() => setKutsut(kutsut.filter((_, j) => j !== i))}
                            >×</button>
                          )}
                        </div>
                      ))}

                      <button
                        className="btn-ghost"
                        style={{ marginTop: '4px', marginBottom: '24px' }}
                        onClick={() => setKutsut([...kutsut, { sahkoposti: '', rooli: 'osakas' }])}
                      >
                        + Lisää kutsunsaaja
                      </button>

                      <button
                        className="btn-gold"
                        style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                        onClick={() => alert('Kutsut lähetetty! (demo)')}
                      >
                        Lähetä kutsut
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>

                    <div className="divider" />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: C.secondary, marginBottom: '4px' }}>Voit myös jakaa linkin suoraan</div>
                        <div style={{
                          fontSize: '12px', color: C.accent, fontFamily: 'monospace',
                          background: 'rgba(201,168,76,0.06)', padding: '8px 12px',
                          border: `1px solid rgba(201,168,76,0.18)`,
                        }}>
                          pesanhoitaja.fi/liity/demo-xyz
                        </div>
                      </div>
                      <button
                        className="btn-ghost"
                        style={{ flexShrink: 0, marginLeft: '16px' }}
                        onClick={() => navigator.clipboard?.writeText('pesanhoitaja.fi/liity/demo-xyz')}
                      >
                        Kopioi linkki
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

        </div>
      </div>
    </div>
  )
}
