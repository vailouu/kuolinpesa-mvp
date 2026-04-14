'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
  borderWarm: 'rgba(201,168,76,0.18)',
  surface: 'rgba(240,235,227,0.03)',
}

// Demo-data — näyttää miltä sivu näyttää oikeilla tiedoilla
const demoData = {
  vainaja: {
    nimi: 'Paavo Mäkinen',
    syntymaaika: '12.3.1945',
    osoite: 'Koivukuja 4, 00100 Helsinki',
    puhelin: '+358 40 123 4567',
    laakari: 'Dr. Leena Virtanen, Terveystalo Helsinki',
    lakimies: 'Asianajotoimisto Peltonen & Kumpp.',
    tilitoimisto: 'Tilitoimisto Pohjoinen Oy',
  },
  saateviesti: 'Rakkaat läheiset,\n\nOlen valmistellut tämän pesän teille etukäteen, jotta asioiden hoitaminen olisi helpompaa tässä raskaassa ajassa. Löydätte täältä kaikki tärkeät tiedot omaisuudestani, sopimuksistani ja dokumenttieni sijainneista.\n\nToivon teille voimia.\n\nPaavo',
  omaisuus: {
    pankkitilit: [{ pankki: 'OP Osuuspankki', tilinumero: 'FI12 3456 7890 1234 56', lisatieto: 'Käyttötili' }],
    sijoitukset: [{ palvelu: 'Nordnet', sisalto: 'Nokian osakkeita, S&P500-rahasto', lisatieto: 'Tilinumero 7654321' }],
    kiinteistot: [{ osoite: 'Koivukuja 4, Helsinki', tyyppi: 'Omakotitalo', avaimet: 'Keittiön yläkaapissa vasemmalla' }, { osoite: 'Mökkitie 12, Heinola', tyyppi: 'Kesämökki', avaimet: 'Naapurilla Matti Korhosella' }],
    ajoneuvot: [{ tyyppi: 'Toyota Corolla 2016', rekisteri: 'ABC-123', sijainti: 'Kotitallin autotalli' }],
    vakuutukset: [{ yhtio: 'LähiTapiola', tyyppi: 'Henkivakuutus', sopimusnumero: '1234567' }, { yhtio: 'If', tyyppi: 'Kotivakuutus', sopimusnumero: '9876543' }],
    muut: [{ kuvaus: 'Kultainen kello (isän)', sijainti: 'Makuuhuoneen lipastossa', arvo: 'n. 800 €' }, { kuvaus: '1950-luvun öljymaalaus', sijainti: 'Olohuoneen seinällä', arvo: 'n. 2500 €' }],
  },
  sopimukset: {
    puhelin: 'Elisa, liittymänumero 040 123 4567, sopimus päättyy 31.12.2026',
    internet: 'DNA Laajakaista, asiakastunnus 88321',
    sahko: 'Helen Oy, asiakastunnus 12345',
    vakuutusyhtiö: 'LähiTapiola, asiakastunnus 67890',
    pankki: 'OP, verkkopankki käytössä',
    muut: 'Netflix, Spotify, HS-digilehti, kuntosali Liikuntakeskus Eteläinen',
  },
  dokumentit: {
    testamentti: 'Keittiön yläkaapissa vasemmalla, kirjekuoressa "Testamentti"',
    avioehto: 'Ei olemassa',
    vakuutuskirjat: 'Toimistopöydän alalaatikossa, vihreä kansio',
    passit: 'Makuuhuoneen lipastossa oikealla',
    muut: 'Syntymätodistus ja vanha työsopimus: kirjahyllyn alimmalla tasolla',
  },
  tahto: {
    hautaus: 'Tuhkaus, siroteltavaksi Päijänteen selälle. Ei kirkollista seremoniaa, mutta musiikkia saa olla.',
    musiikki: 'Sibelius: Finlandia, Jean Sibelius',
    jakotoiveet: 'Mökki Pekalle ja Liisalle yhteisesti. Äidin korut Liisalle. Kirjat saa jakaa vapaasti.',
    viesti: 'Rakkaalle perheelleni — olette olleet elämäni suurin rikkaus. Hoitakaa toisianne.',
  },
}

const omaisuusKategoriat = [
  { id: 'pankkitilit', nimi: 'Pankkitilit', ikoni: '🏦', kentat: [{ id: 'pankki', label: 'Pankki' }, { id: 'tilinumero', label: 'Tilinumero' }, { id: 'lisatieto', label: 'Lisätietoja' }] },
  { id: 'sijoitukset', nimi: 'Sijoitukset', ikoni: '📈', kentat: [{ id: 'palvelu', label: 'Palvelu' }, { id: 'sisalto', label: 'Mitä sijoituksia' }, { id: 'lisatieto', label: 'Lisätietoja' }] },
  { id: 'kiinteistot', nimi: 'Kiinteistöt', ikoni: '🏠', kentat: [{ id: 'osoite', label: 'Osoite' }, { id: 'tyyppi', label: 'Tyyppi' }, { id: 'avaimet', label: 'Avainten sijainti' }] },
  { id: 'ajoneuvot', nimi: 'Ajoneuvot', ikoni: '🚗', kentat: [{ id: 'tyyppi', label: 'Ajoneuvo' }, { id: 'rekisteri', label: 'Rekisteri' }, { id: 'sijainti', label: 'Sijainti' }] },
  { id: 'vakuutukset', nimi: 'Vakuutukset', ikoni: '🛡️', kentat: [{ id: 'yhtio', label: 'Yhtiö' }, { id: 'tyyppi', label: 'Tyyppi' }, { id: 'sopimusnumero', label: 'Sopimusnumero' }] },
  { id: 'muut', nimi: 'Muu arvo-omaisuus', ikoni: '💎', kentat: [{ id: 'kuvaus', label: 'Kuvaus' }, { id: 'sijainti', label: 'Sijainti' }, { id: 'arvo', label: 'Arvo' }] },
]

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .fade-up { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-in { animation: fadeIn 0.6s ease both; }

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

  .section-title {
    font-family: var(--font-display), Georgia, serif;
    font-size: 26px; font-weight: 300; letter-spacing: -0.02em;
    color: ${C.text}; margin-bottom: 6px;
  }
  .section-sub {
    font-size: 13px; color: ${C.secondary}; line-height: 1.7; font-weight: 300;
  }
  .divider { height: 1px; background: ${C.border}; margin: 24px 0; }

  .data-block {
    border: 1px solid ${C.border};
    background: ${C.surface};
    margin-bottom: 16px;
  }
  .data-row {
    padding: 13px 18px;
    border-bottom: 1px solid ${C.border};
    display: flex; gap: 16px;
  }
  .data-row:last-child { border-bottom: none; }
  .data-label {
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: ${C.secondary}; min-width: 130px; flex-shrink: 0; padding-top: 1px;
  }
  .data-value {
    font-size: 13px; color: ${C.text}; line-height: 1.6;
  }

  .splash-btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${C.bg}; background: ${C.accent};
    border: none; padding: 16px 36px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    margin-top: 40px;
  }
  .splash-btn:hover {
    background: #D4B560;
    box-shadow: 0 8px 32px rgba(201,168,76,0.3);
    transform: translateY(-1px);
  }
  .splash-btn:active { transform: translateY(0); }
`

const nav = [
  { id: 'tiedot', nimi: 'Vainajan tiedot', ikoni: '👤' },
  { id: 'omaisuus', nimi: 'Omaisuus', ikoni: '💼' },
  { id: 'sopimukset', nimi: 'Sopimukset', ikoni: '📋' },
  { id: 'dokumentit', nimi: 'Dokumentit', ikoni: '📁' },
  { id: 'tahto', nimi: 'Viimeinen tahto', ikoni: '✉️' },
]

export default function PesaPage() {
  const router = useRouter()
  const [naytaSaate, setNaytaSaate] = useState(() =>
    typeof window !== 'undefined' ? !new URLSearchParams(window.location.search).get('skip') : true
  )
  const [aktiivinenOsio, setAktiivinenOsio] = useState('tiedot')

  if (naytaSaate) {
    return (
      <div style={{
        backgroundColor: C.bg, color: C.text, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px', fontFamily: 'var(--font-body), sans-serif',
        position: 'relative',
      }}>
        <style>{css}</style>

        {/* Hienovarainen taustakuvio */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }} />

        <div className="fade-in" style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

          <div style={{
            fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '14px', marginBottom: '32px', opacity: 0.8,
          }}>
            <div style={{ width: '24px', height: '1px', background: C.accent }} />
            {demoData.vainaja.nimi}
            <div style={{ width: '24px', height: '1px', background: C.accent }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300,
            letterSpacing: '-0.025em', lineHeight: 1.15,
            color: C.text, marginBottom: '48px',
          }}>
            Viesti sinulle
          </h1>

          {/* Viesti */}
          <div style={{
            textAlign: 'left',
            background: 'rgba(201,168,76,0.03)',
            border: `1px solid rgba(201,168,76,0.14)`,
            borderLeft: `3px solid ${C.accent}`,
            padding: '28px 32px',
            marginBottom: '8px',
          }}>
            <p style={{
              fontSize: '15px', lineHeight: 1.9,
              color: C.text, fontStyle: 'italic',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-display), Georgia, serif',
              fontWeight: 300,
            }}>
              {demoData.saateviesti}
            </p>
          </div>

          <button className="splash-btn" onClick={() => setNaytaSaate(false)}>
            Siirry pesään
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <p style={{ fontSize: '11px', color: C.secondary, marginTop: '16px', opacity: 0.5, letterSpacing: '0.06em' }}>
            Voit palata tähän viestiin myöhemmin
          </p>

        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── VASEN NAV ── */}
        <div style={{
          width: '220px', flexShrink: 0,
          borderRight: `1px solid ${C.border}`,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
          <div style={{ padding: '28px 24px 24px', borderBottom: `1px solid rgba(201,168,76,0.28)` }}>
            <button onClick={() => router.push('/')} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase',
              color: C.text, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.accent}
            onMouseLeave={e => e.currentTarget.style.color = C.text}
            >
              Pesänhoitaja
            </button>
            <div style={{ marginTop: '20px', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, opacity: 0.7 }}>
              Kuolinpesä
            </div>
            <div style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '15px', fontWeight: 300, color: C.text,
              marginTop: '6px', lineHeight: 1.3,
            }}>
              {demoData.vainaja.nimi}
            </div>
          </div>

          <div style={{ paddingTop: '8px' }} />

          {nav.map(v => (
            <button
              key={v.id}
              className={`nav-item${aktiivinenOsio === v.id ? ' active' : ''}`}
              onClick={() => setAktiivinenOsio(v.id)}
            >
              <span style={{ fontSize: '14px', opacity: 0.8 }}>{v.ikoni}</span>
              {v.nimi}
            </button>
          ))}

          {/* Saateviesti uudelleen */}
          <div style={{ margin: '16px 0 0', borderTop: `1px solid ${C.border}`, paddingTop: '12px' }}>
            <button
              className="nav-item"
              onClick={() => setNaytaSaate(true)}
              style={{ color: C.accent, fontSize: '11px' }}
            >
              <span style={{ fontSize: '14px' }}>✉️</span>
              Lue saateviesti
            </button>
          </div>
        </div>

        {/* ── PÄÄSISÄLTÖ ── */}
        <div style={{ flex: 1, padding: '48px 56px', maxWidth: '860px' }}>

          {/* TIEDOT */}
          {aktiivinenOsio === 'tiedot' && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>Vainajan tiedot</p>
              <h1 className="section-title">Perustiedot</h1>
              <p className="section-sub" style={{ marginBottom: '32px' }}>Henkilötiedot ja tärkeät yhteystiedot.</p>

              <div className="data-block">
                {[
                  { label: 'Nimi', value: demoData.vainaja.nimi },
                  { label: 'Syntymäaika', value: demoData.vainaja.syntymaaika },
                  { label: 'Kotiosoite', value: demoData.vainaja.osoite },
                  { label: 'Puhelinnumero', value: demoData.vainaja.puhelin },
                ].map((r, i) => (
                  <div key={i} className="data-row">
                    <span className="data-label">{r.label}</span>
                    <span className="data-value">{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '16px' }}>Tärkeät yhteystiedot</p>

              <div className="data-block">
                {[
                  { label: 'Lääkäri', value: demoData.vainaja.laakari },
                  { label: 'Lakimies', value: demoData.vainaja.lakimies },
                  { label: 'Tilitoimisto', value: demoData.vainaja.tilitoimisto },
                ].map((r, i) => (
                  <div key={i} className="data-row">
                    <span className="data-label">{r.label}</span>
                    <span className="data-value">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OMAISUUS */}
          {aktiivinenOsio === 'omaisuus' && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>Omaisuus</p>
              <h1 className="section-title">Omaisuus</h1>
              <p className="section-sub" style={{ marginBottom: '32px' }}>Kaikki omaisuuskohteet kategorioittain.</p>

              {omaisuusKategoriat.map(kat => {
                const items = demoData.omaisuus[kat.id] || []
                if (items.length === 0) return null
                return (
                  <div key={kat.id} style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.secondary, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{kat.ikoni}</span> {kat.nimi}
                    </div>
                    <div className="data-block">
                      {items.map((item, i) => (
                        <div key={i} style={{ padding: '14px 18px', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                          {kat.kentat.map(k => item[k.id] ? (
                            <div key={k.id} style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
                              <span className="data-label" style={{ minWidth: '110px' }}>{k.label}</span>
                              <span className="data-value">{item[k.id]}</span>
                            </div>
                          ) : null)}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* SOPIMUKSET */}
          {aktiivinenOsio === 'sopimukset' && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>Sopimukset</p>
              <h1 className="section-title">Sopimukset ja tilaukset</h1>
              <p className="section-sub" style={{ marginBottom: '32px' }}>Palvelut jotka tulee irtisanoa tai siirtää.</p>

              <div className="data-block">
                {[
                  { label: 'Puhelinliittymä', value: demoData.sopimukset.puhelin },
                  { label: 'Internet', value: demoData.sopimukset.internet },
                  { label: 'Sähkösopimus', value: demoData.sopimukset.sahko },
                  { label: 'Vakuutusyhtiö', value: demoData.sopimukset.vakuutusyhtiö },
                  { label: 'Pankki', value: demoData.sopimukset.pankki },
                  { label: 'Muut', value: demoData.sopimukset.muut },
                ].filter(r => r.value).map((r, i, arr) => (
                  <div key={i} className="data-row" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span className="data-label">{r.label}</span>
                    <span className="data-value">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOKUMENTIT */}
          {aktiivinenOsio === 'dokumentit' && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>Dokumentit</p>
              <h1 className="section-title">Dokumenttien sijainnit</h1>
              <p className="section-sub" style={{ marginBottom: '32px' }}>Missä tärkeät paperit fyysisesti sijaitsevat.</p>

              <div className="data-block">
                {[
                  { label: 'Testamentti', value: demoData.dokumentit.testamentti },
                  { label: 'Avioehto', value: demoData.dokumentit.avioehto },
                  { label: 'Vakuutuskirjat', value: demoData.dokumentit.vakuutuskirjat },
                  { label: 'Passit', value: demoData.dokumentit.passit },
                  { label: 'Muut', value: demoData.dokumentit.muut },
                ].filter(r => r.value).map((r, i, arr) => (
                  <div key={i} className="data-row" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span className="data-label">{r.label}</span>
                    <span className="data-value">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAHTO */}
          {aktiivinenOsio === 'tahto' && (
            <div className="fade-up">
              <p style={{ fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, marginBottom: '12px' }}>Viimeinen tahto</p>
              <h1 className="section-title">Hautaustoiveet ja<br /><em style={{ fontStyle: 'italic', color: C.accent }}>viimeinen tahto.</em></h1>
              <p className="section-sub" style={{ marginBottom: '32px' }}>Vainajan omat toiveet.</p>

              <div className="data-block" style={{ marginBottom: '28px' }}>
                {[
                  { label: 'Hautaustoiveet', value: demoData.tahto.hautaus },
                  { label: 'Musiikki / muistotilaisuus', value: demoData.tahto.musiikki },
                  { label: 'Omaisuuden jako', value: demoData.tahto.jakotoiveet },
                ].filter(r => r.value).map((r, i, arr) => (
                  <div key={i} className="data-row" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span className="data-label">{r.label}</span>
                    <span className="data-value">{r.value}</span>
                  </div>
                ))}
              </div>

              {demoData.tahto.viesti && (
                <>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, marginBottom: '12px' }}>Henkilökohtainen viesti</p>
                  <div style={{
                    background: 'rgba(201,168,76,0.03)',
                    border: `1px solid rgba(201,168,76,0.14)`,
                    borderLeft: `3px solid rgba(201,168,76,0.4)`,
                    padding: '22px 24px',
                  }}>
                    <p style={{ fontSize: '14px', lineHeight: 1.9, color: C.text, fontStyle: 'italic', fontFamily: 'var(--font-display), Georgia, serif', fontWeight: 300 }}>
                      {demoData.tahto.viesti}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
