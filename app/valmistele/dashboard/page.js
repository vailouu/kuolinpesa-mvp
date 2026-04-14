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
    font-size: 12px; letter-spacing: 0.08em;
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

const vaiheet = [
  { id: 1, nimi: 'Omat tiedot', ikoni: '👤' },
  { id: 2, nimi: 'Omaisuus', ikoni: '💼' },
  { id: 3, nimi: 'Sopimukset', ikoni: '📋' },
  { id: 4, nimi: 'Dokumentit', ikoni: '📁' },
  { id: 5, nimi: 'Viimeinen tahto', ikoni: '✉️' },
]

export default function ValmisteleDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [aktiivinenVaihe, setAktiivinenVaihe] = useState(1)
  const [ladataan, setLadataan] = useState(true)

  // Omat tiedot
  const [omatTiedot, setOmatTiedot] = useState({
    nimi: '', syntymaaika: '', osoite: '', puhelin: '',
    laakari: '', lakimies: '', tilitoimisto: '', lisatieto: '',
  })
  const [omatTiedotTallennettu, setOmatTiedotTallennettu] = useState(false)

  // Omaisuus
  const [valittuKategoria, setValittuKategoria] = useState(null)

  const navPush = useCallback((vaihe, kategoria = null) => {
    window.history.pushState({ vaihe, kategoria }, '')
    setAktiivinenVaihe(vaihe)
    setValittuKategoria(kategoria)
  }, [])

  useEffect(() => {
    window.history.replaceState({ vaihe: 1, kategoria: null }, '')
    const handlePop = (e) => {
      const s = e.state
      if (!s) return
      setAktiivinenVaihe(s.vaihe ?? 1)
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
    hautaus: '', musiikki: '', jakotoiveet: '', viesti: '',
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
            <div style={{ marginTop: '20px', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, opacity: 0.7 }}>
              Valmistelu
            </div>
            <div style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '16px', fontWeight: 300, color: C.text,
              marginTop: '6px', lineHeight: 1.3,
            }}>
              {user?.user_metadata?.full_name?.split(' ')[0] || 'Sinun'} tietosi
            </div>
          </div>

          <div style={{ paddingTop: '8px' }} />

          {vaiheet.map(v => (
            <button
              key={v.id}
              className={`nav-item${aktiivinenVaihe === v.id ? ' active' : ''}`}
              onClick={() => navPush(v.id, null)}
            >
              <span style={{ fontSize: '14px', opacity: 0.8 }}>{v.ikoni}</span>
              {v.nimi}
            </button>
          ))}

          {/* Edistyminen */}
          <div style={{ padding: '24px 20px', marginTop: 'auto' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.secondary, marginBottom: '8px' }}>
              Täytetty
            </div>
            <div style={{ fontSize: '20px', fontFamily: 'var(--font-display), Georgia, serif', color: C.accent }}>
              {Object.values(omaisuusItems).reduce((s, arr) => s + arr.length, 0) + (omatTiedotTallennettu ? 1 : 0)}
              <span style={{ fontSize: '13px', color: C.secondary, marginLeft: '4px' }}>kohdetta</span>
            </div>
          </div>
        </div>

        {/* ── PÄÄSISÄLTÖ ── */}
        <div style={{ flex: 1, padding: '48px 56px', maxWidth: '900px' }}>

          {/* ── 1. OMAT TIEDOT ── */}
          {aktiivinenVaihe === 1 && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>01 — Omat tiedot</p>
              <h1 className="section-title">Perustietosi</h1>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Nämä tiedot auttavat omaisiasi löytämään oikeat viranomaiset ja yhteystiedot nopeasti.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { id: 'nimi', label: 'Koko nimesi', placeholder: 'Etunimi Sukunimi', type: 'text' },
                  { id: 'syntymaaika', label: 'Syntymäaika', placeholder: '1.1.1950', type: 'text' },
                  { id: 'osoite', label: 'Osoite', placeholder: 'Katuosoite, postinumero, kaupunki', type: 'text' },
                  { id: 'puhelin', label: 'Puhelinnumero', placeholder: '+358 40 123 4567', type: 'text' },
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
              <h1 className="section-title">Omaisuutesi</h1>
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
              <h1 className="section-title">Sopimukset ja tilaukset</h1>
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
              <h1 className="section-title">Tärkeät dokumentit</h1>
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
              <h1 className="section-title">Hautaustoiveet ja<br />
                <em style={{ fontStyle: 'italic', color: C.accent }}>viimeinen tahto.</em>
              </h1>
              <p className="section-sub" style={{ marginBottom: '36px' }}>
                Nämä toiveet voivat vähentää omaisten välistä erimielisyyttä merkittävästi. Kirjoita vapaasti.
              </p>

              {[
                { id: 'hautaus', label: 'Hautaustoiveet', placeholder: 'Esim. arkkuhautaus, tuhkaus, hautausmaa, uskonnollisuus...' },
                { id: 'musiikki', label: 'Toivomasi musiikki tai muistotilaisuus', placeholder: 'Esim. Sibelius Finlandia, ei kirkollista seremoniaa...' },
                { id: 'jakotoiveet', label: 'Toiveet omaisuuden jaosta', placeholder: 'Esim. mökki Pekalle, äidin korut Marialle — nämä eivät ole juridisesti sitovia ilman testamenttia' },
                { id: 'viesti', label: 'Viesti omaisille', placeholder: 'Kirjoita mitä haluat omaisillesi sanoa...' },
              ].map((k, i) => (
                <div key={k.id} style={{ marginBottom: '24px' }}>
                  <label className="form-label">{k.label}</label>
                  <textarea className="form-input" rows={k.id === 'viesti' ? 6 : 3}
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

        </div>
      </div>
    </div>
  )
}
