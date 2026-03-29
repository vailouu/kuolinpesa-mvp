'use client'
import { useRouter } from 'next/navigation'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
  borderWarm: 'rgba(201,168,76,0.12)',
  surface: 'rgba(240,235,227,0.03)',
}

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .a1 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .a2 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  .a3 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both; }

  /* ── NAV ── */
  .top-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    gap: 36px;
    padding: 0 56px;
    height: 60px;
    z-index: 50;
    border-bottom: 1px solid rgba(201,168,76,0.18);
    box-shadow: 0 1px 0 rgba(201,168,76,0.06);
    background: ${C.bg};
  }
  .nav-logo {
    font-family: var(--font-body), sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${C.text};
    cursor: pointer;
    background: none; border: none;
    transition: color 0.2s ease;
    margin-right: 8px;
  }
  .nav-logo:hover {
    color: ${C.accent};
    text-shadow: 0 0 18px rgba(201,168,76,0.45), 0 0 40px rgba(201,168,76,0.18);
  }
  .nav-item {
    font-family: var(--font-body), sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${C.secondary};
    cursor: pointer;
    background: none; border: none;
    padding: 0;
    transition: color 0.2s ease, text-shadow 0.2s ease;
  }
  .nav-item:hover {
    color: ${C.accent};
    text-shadow: 0 0 12px rgba(201,168,76,0.7), 0 0 28px rgba(201,168,76,0.3);
    box-shadow: 0 0 16px rgba(201,168,76,0.15);
  }
  .nav-item.active { color: ${C.accent}; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 32px; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.accent};
    background: transparent;
    border: 1px solid rgba(201,168,76,0.35);
    padding: 12px 24px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s, transform 0.15s;
  }
  .btn-primary:hover {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.7);
    box-shadow: 0 0 24px rgba(201,168,76,0.2);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }

  /* ── STEP CARD ── */
  .step-card {
    border-top: 1px solid ${C.border};
    padding: 56px 0;
    display: grid;
    grid-template-columns: 80px 1fr 1fr;
    gap: 48px;
    align-items: start;
    transition: border-color 0.2s ease;
  }
  .step-card:hover { border-top-color: ${C.borderWarm}; }
  .step-card:last-of-type { border-bottom: 1px solid ${C.border}; }

  /* ── FEATURE GRID ── */
  .feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: ${C.border};
  }
  .feature-cell {
    background: ${C.bg};
    padding: 40px 36px;
    transition: background 0.2s ease;
  }
  .feature-cell:hover { background: ${C.surface}; }
`

const steps = [
  {
    num: '01',
    title: 'Ensitoimet',
    sub: 'Heti kuoleman jälkeen',
    desc: 'Ensimmäiset viikot ovat kiireisimpiä. Pesänhoitaja listaa kaikki välttämättömät toimenpiteet selkeässä järjestyksessä — virkatodistuksen hakeminen, pankkitilien jäädyttäminen, ilmoitukset Kelalle ja maistraatille sekä hautausjärjestelyt.',
    items: ['Virkatodistus ja sukuselvitys', 'Pankkitilit ja suoraveloitukset', 'Ilmoitus Kelalle ja maistraatille', 'Testamentin ja edunvalvontavaltuutuksen etsiminen', 'Hautausjärjestelyt'],
  },
  {
    num: '02',
    title: 'Omaisuuden selvitys',
    sub: 'Varat, velat & sopimukset',
    desc: 'Kaikki vainajan omaisuus, velat ja voimassaolevat sopimukset kartoitetaan kategorioidusti. Jokainen osa-alue — asuminen, viestintä, vakuutukset, digitaaliset palvelut — käydään läpi yksi kerrallaan selkeiden toimintaohjeiden kanssa.',
    items: ['Kiinteä omaisuus ja ajoneuvot', 'Pankkitilit ja sijoitukset', 'Vakuutukset ja eläkkeet', 'Tilaukset ja digitaaliset palvelut', 'Velat ja takaajuudet'],
  },
  {
    num: '03',
    title: 'Perunkirjoitus',
    sub: 'Omaisuuden inventaario',
    desc: 'Perunkirjoitus on toimitettava kolmen kuukauden kuluessa kuolemasta. Pesänhoitaja ohjaa sinut läpi koko prosessin ja auttaa kokoamaan tarvittavat tiedot perukirjaa varten. Valmiin perukirjapohjan voi ladata täytettäväksi.',
    items: ['Perukirjan sisältövaatimukset', 'Pesänhoitajan määrääminen', 'Omaisuuden arvostaminen', 'Perukirjapohjan generointi', 'Toimittaminen verottajalle'],
  },
]

const features = [
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: 'Jaettu dashboard',
    desc: 'Kaikki pesän osakkaat näkevät saman tilanteen reaaliajassa. Yksi osakas avaa pesän ja kutsuu muut sähköpostikutsulla. Tehtävät, dokumentit ja kommentit yhdessä paikassa — ei enää päällekkäisiä puheluita siitä missä mennään.',
  },
  {
    icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    title: 'Selkeät ohjeet jokaiseen vaiheeseen',
    desc: 'Jokainen tehtävä sisältää yksityiskohtaisen ohjeistuksen: mitä tehdä, mihin ottaa yhteyttä ja missä järjestyksessä. Ei oikeudellista jargonia — selkokielistä suomea joka vaiheessa.',
  },
  {
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    title: 'Edistymisen seuranta',
    desc: 'Tarkistuslista näyttää aina missä vaiheessa ollaan ja mitä seuraavaksi pitää tehdä. Jokainen hoidettu tehtävä merkitään valmiiksi — kokonaisedistyminen näkyy yhdellä silmäyksellä.',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: 'Tietoturvallinen',
    desc: 'Arkaluonteinen tieto tallennetaan turvallisesti. Vain kutsutut osakkaat pääsevät näkemään pesän tiedot. Dokumentit säilyvät tallessa koko prosessin ajan.',
  },
]

export default function MitenToimii() {
  const router = useRouter()

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="top-bar">
        <button className="nav-logo" onClick={() => router.push('/')}>Pesänhoitaja</button>
        <button className="nav-item active" onClick={() => router.push('/miten-toimii')}>Miten toimii</button>
        <button className="nav-item" onClick={() => router.push('/ukk')}>UKK</button>
        <button className="nav-item" onClick={() => router.push('/hinnat')}>Hinnat</button>
        <div className="nav-right">
          <button className="nav-item">Suomi</button>
          <button className="btn-primary" onClick={() => router.push('/valitse')}>
            Aloita ilmaiseksi
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ padding: '140px 80px 80px', maxWidth: '1200px' }}>
        <div className="a1" style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '10px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: C.accent,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '32px',
        }}>
          <div style={{ width: '24px', height: '1px', background: C.accent }} />
          Miten toimii
        </div>
        <h1 className="a2" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: 'clamp(44px, 6vw, 84px)',
          fontWeight: 300,
          lineHeight: 1.0,
          letterSpacing: '-0.025em',
          color: C.text,
          maxWidth: '700px',
          marginBottom: '28px',
        }}>
          Kolme vaihetta.<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>Yksi selkeä polku.</em>
        </h1>
        <p className="a3" style={{
          color: C.secondary,
          fontSize: '16px',
          lineHeight: 1.85,
          maxWidth: '520px',
          fontWeight: 300,
        }}>
          Pesänhoitaja pilkkoo kuolinpesän monimutkaisuuden hallittaviksi askelmerkeiksi — alusta loppuun saakka.
        </p>
      </div>

      {/* ── STEPS ── */}
      <div style={{ padding: '0 80px 100px', maxWidth: '1200px' }}>
        {steps.map((step) => (
          <div key={step.num} className="step-card">
            {/* Numero */}
            <div style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '13px',
              color: C.accent,
              letterSpacing: '0.1em',
              paddingTop: '6px',
            }}>
              {step.num}
            </div>

            {/* Otsikko + kuvaus */}
            <div>
              <div style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: C.secondary,
                marginBottom: '14px',
              }}>
                {step.sub}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontSize: 'clamp(28px, 3vw, 42px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: C.text,
                marginBottom: '20px',
                lineHeight: 1.1,
              }}>
                {step.title}
              </h2>
              <p style={{
                color: C.secondary,
                fontSize: '15px',
                lineHeight: 1.85,
                fontWeight: 300,
                maxWidth: '380px',
              }}>
                {step.desc}
              </p>
            </div>

            {/* Tarkistuslista */}
            <div style={{ paddingTop: '36px' }}>
              {step.items.map((item, j) => (
                <div key={j} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 0',
                  borderBottom: j < step.items.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div style={{
                    width: '16px', height: '16px',
                    border: `1px solid ${C.borderWarm}`,
                    flexShrink: 0,
                    marginTop: '1px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: '4px', height: '4px', background: C.accent, opacity: 0.5 }} />
                  </div>
                  <span style={{ color: C.secondary, fontSize: '14px', lineHeight: 1.6, fontWeight: 300 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '100px 80px' }}>
        <div style={{ maxWidth: '1200px' }}>
          <div style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: C.accent,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '32px',
          }}>
            <div style={{ width: '24px', height: '1px', background: C.accent }} />
            Yhteistyö & seuranta
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: C.text,
            marginBottom: '64px',
            maxWidth: '600px',
          }}>
            Kaikki osakkaat samalla sivulla — kirjaimellisesti.
          </h2>

          <div className="feature-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-cell">
                <div style={{
                  width: '36px', height: '36px',
                  border: `1px solid ${C.borderWarm}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display), Georgia, serif',
                  fontSize: '22px',
                  fontWeight: 400,
                  color: C.text,
                  marginBottom: '14px',
                  letterSpacing: '-0.01em',
                }}>
                  {f.title}
                </h3>
                <p style={{ color: C.secondary, fontSize: '14px', lineHeight: 1.85, fontWeight: 300 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: '100px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '40px',
        maxWidth: '1200px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: C.text,
            marginBottom: '12px',
          }}>
            Valmis aloittamaan?
          </h2>
          <p style={{ color: C.secondary, fontSize: '15px', fontWeight: 300 }}>
            Ilmainen. Ei luottokorttia. Aloita heti.
          </p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/valitse')} style={{ padding: '16px 40px', fontSize: '12px' }}>
          Aloita ilmaiseksi
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: '24px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary }}>
          © 2026 Pesänhoitaja
        </span>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Tietosuoja', 'Käyttöehdot'].map(l => (
            <span key={l} style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary, cursor: 'pointer' }}>
              {l}
            </span>
          ))}
        </div>
      </footer>

    </div>
  )
}
