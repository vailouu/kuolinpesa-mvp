'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'
import GlobalNav from '../components/GlobalNav'
import DashboardLink from '../components/DashboardLink'

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
  .a4 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s both; }

  .top-bar {
    position: fixed; top: 0; left: 0; right: 0;
    display: flex; align-items: center; gap: 36px;
    padding: 0 56px; height: 60px; z-index: 50;
    border-bottom: 1px solid rgba(201,168,76,0.18);
    box-shadow: 0 1px 0 rgba(201,168,76,0.06);
    background: ${C.bg};
  }
  .nav-logo {
    font-family: var(--font-body), sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
    color: ${C.text}; cursor: pointer; background: none; border: none;
    transition: color 0.2s ease; margin-right: 8px;
  }
  .nav-logo:hover { color: ${C.accent}; text-shadow: 0 0 18px rgba(201,168,76,0.45), 0 0 40px rgba(201,168,76,0.18); }
  .nav-item {
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${C.secondary}; cursor: pointer; background: none; border: none; padding: 0;
    transition: color 0.2s ease, text-shadow 0.2s ease;
  }
  .nav-item:hover { color: ${C.accent}; text-shadow: 0 0 12px rgba(201,168,76,0.7), 0 0 28px rgba(201,168,76,0.3); }
  .nav-item.active { color: ${C.accent}; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 32px; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.accent}; background: transparent;
    border: 1px solid rgba(201,168,76,0.35);
    padding: 12px 24px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s, transform 0.15s;
  }
  .btn-primary:hover {
    background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.7);
    box-shadow: 0 0 24px rgba(201,168,76,0.2); transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }

  .profile-block {
    border-top: 1px solid ${C.border};
    padding: 48px 0;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 56px;
    align-items: start;
    transition: border-color 0.2s ease;
  }
  .profile-block:hover { border-top-color: ${C.borderWarm}; }
  .profile-block:last-of-type { border-bottom: 1px solid ${C.border}; }
`

const profiles = [
  {
    otsikko: 'Olet ainoa lapsi.',
    teksti: 'Pesä on sinun vastuullasi — eikä kenenkään muun. Et tiedä mistä aloittaa, mitkä viranomaiset pitää ilmoittaa tai mitä kaikkea kuuluu hoitaa. Pesänhoitaja rakentaa sinulle henkilökohtaisen tarkistuslistan ja pitää asiat järjestyksessä alusta loppuun.',
  },
  {
    otsikko: 'Pesässä on useampi osakas.',
    teksti: 'Sisaruksia, puoliso, muita perillisiä — ja jokaisella on mielipide. Pesänhoitajan jaettu dashboard pitää kaikki samalla sivulla: jokainen näkee missä mennään, kukaan ei putoa kärryiltä, ja päätökset syntyvät yhteisellä tiedolla.',
  },
  {
    otsikko: 'Haluat säästää lakimieskuluissa.',
    teksti: 'Lakimies on kallis, eikä kaikkeen tarvita juristia. Pesänhoitaja tekee pohjatyön — kartoittaa omaisuuden, kokoaa tiedot ja pitää deadlinet mielessä. Kun lakimiestä tarvitaan, saavut valmistautuneena ja säästät tunteja laskutettavaa aikaa.',
  },
]

export default function Kenelle() {
  const router = useRouter()
  const [kirjautunut, setKirjautunut] = useState(false)
  const [juristiAuki, setJuristiAuki] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setKirjautunut(true)
    })
  }, [])

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>
      <DashboardLink />

      {/* ── NAV ── */}
      <nav className="top-bar">
        <button className="nav-logo" onClick={() => router.push('/')}>Pesänhoitaja</button>
        <button className="nav-item" onClick={() => router.push('/miten-toimii')}>Miten toimii</button>
        <button className="nav-item active">Kenelle</button>
        <button className="nav-item" onClick={() => router.push('/ukk')}>UKK</button>
        <button className="nav-item" onClick={() => router.push('/hinnat')}>Hinnat</button>
        <button className="nav-item" onClick={() => router.push('/ota-yhteytta')}>Ota yhteyttä</button>
        <div className="nav-right">
          <button className="nav-item">Suomi</button>
          {kirjautunut ? (
            <GlobalNav />
          ) : (
            <button className="btn-primary" onClick={() => router.push('/valitse')}>
              Aloita ilmaiseksi
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ padding: '140px 80px 80px', maxWidth: '900px' }}>
        <h1 className="a2" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: 'clamp(40px, 5.5vw, 76px)',
          fontWeight: 300, lineHeight: 1.08, letterSpacing: '-0.025em',
          color: C.text, marginBottom: '36px',
        }}>
          Surulla on oma aikansa.<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>Paperitöillä on deadline.</em>
        </h1>

        <p className="a3" style={{
          color: C.secondary, fontSize: '16px', lineHeight: 1.85,
          maxWidth: '540px', fontWeight: 300,
        }}>
          Kuolinpesän hoito ei odota. Kolme kuukautta perukirjaan, sopimukset juoksevat, osakkaat odottavat päätöksiä — ja sinä olet juuri menettänyt jonkun tärkeän. Pesänhoitaja on tehty tätä hetkeä varten.
        </p>
      </div>

      {/* ── PROFIILIT ── */}
      <div className="a4" style={{ padding: '0 80px 80px', maxWidth: '900px' }}>

        {/* Osion otsikko */}
        <div style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: C.accent, display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
          <div style={{ width: '24px', height: '1px', background: C.accent }} />
          Kenelle tarkoitettu
        </div>

        {profiles.map((p, i) => (
          <div key={i} className="profile-block">
            <h2 style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: 'clamp(22px, 2.5vw, 30px)',
              fontWeight: 400, letterSpacing: '-0.02em',
              color: C.text, lineHeight: 1.2,
            }}>
              {p.otsikko}
            </h2>
            <div>
              <p style={{ color: C.secondary, fontSize: '15px', lineHeight: 1.85, fontWeight: 300 }}>
                {p.teksti}
              </p>
              {i === profiles.length - 1 && (
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => setJuristiAuki(v => !v)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      fontSize: '14px', color: '#C9A84C',
                      fontFamily: 'var(--font-body), sans-serif',
                      textDecoration: 'none',
                    }}
                  >
                    Milloin tarvitaan juristi?
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: juristiAuki ? '200px' : '0',
                    opacity: juristiAuki ? 1 : 0,
                    transition: 'max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease',
                  }}>
                    <p style={{
                      fontSize: '14px', color: C.secondary, lineHeight: 1.85,
                      fontWeight: 300, paddingTop: '16px',
                    }}>
                      Pesänhoitaja sopii tavallisiin suomalaisiin kuolinpesiin. Erittäin monimutkaisissa tapauksissa — kuten yritysomaisuutta sisältävissä pesissä, riitaisissa testamenteissa tai kansainvälisissä perintöasioissa — suosittelemme lakimiestä alusta asti. Kerromme matkan varrella, milloin raja tulee vastaan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* ── CTA ── */}
      <div style={{
        borderTop: `1px solid ${C.border}`, padding: '80px 80px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '40px',
        maxWidth: '900px',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 300, letterSpacing: '-0.02em',
            color: C.text, marginBottom: '10px',
          }}>
            Valmis aloittamaan?
          </h2>
          <p style={{ color: C.secondary, fontSize: '14px', fontWeight: 300 }}>
            Ilmainen. Ei luottokorttia. Aloita heti.
          </p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/valitse')} style={{ padding: '15px 36px', fontSize: '11px' }}>
          Aloita ilmaiseksi
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: '24px 80px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary }}>
          © 2026 Pesänhoitaja
        </span>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Tietosuoja', 'Käyttöehdot'].map(l => (
            <span key={l} style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
