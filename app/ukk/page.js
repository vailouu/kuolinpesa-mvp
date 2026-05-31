'use client'
import { useState, useEffect } from 'react'
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
  borderWarm: 'rgba(201,168,76,0.18)',
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

  .top-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    gap: 36px;
    padding: 0 56px;
    height: 60px;
    z-index: 50;
    border-bottom: 1px solid ${C.borderWarm};
    box-shadow: 0 1px 0 rgba(201,168,76,0.06);
    background: ${C.bg};
  }
  .nav-logo {
    font-family: var(--font-body), sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: ${C.text}; cursor: pointer;
    background: none; border: none;
    transition: color 0.2s ease; margin-right: 8px;
  }
  .nav-logo:hover {
    color: ${C.accent};
    text-shadow: 0 0 18px rgba(201,168,76,0.45), 0 0 40px rgba(201,168,76,0.18);
  }
  .nav-item {
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${C.secondary}; cursor: pointer;
    background: none; border: none; padding: 0;
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

  /* ── FAQ ITEM ── */
  .faq-item {
    border-top: 1px solid ${C.border};
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  .faq-item:last-of-type { border-bottom: 1px solid ${C.border}; }
  .faq-item:hover { border-top-color: rgba(201,168,76,0.15); }

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    padding: 32px 0;
    font-family: var(--font-display), Georgia, serif;
    font-size: clamp(17px, 2vw, 22px);
    font-weight: 400;
    color: ${C.secondary};
    letter-spacing: -0.01em;
    transition: color 0.2s ease;
    user-select: none;
  }
  .faq-item:hover .faq-question,
  .faq-item.open .faq-question {
    color: ${C.text};
  }

  .faq-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    border: 1px solid ${C.border};
    display: flex; align-items: center; justify-content: center;
    color: ${C.accent};
    font-size: 18px; font-weight: 300;
    transition: transform 0.25s ease, border-color 0.2s ease;
    font-family: var(--font-body), sans-serif;
    line-height: 1;
  }
  .faq-item.open .faq-icon {
    transform: rotate(45deg);
    border-color: rgba(201,168,76,0.3);
  }

  .faq-answer {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
    max-height: 0;
    opacity: 0;
  }
  .faq-item.open .faq-answer {
    opacity: 1;
  }
  .faq-answer-inner {
    padding: 0 80px 32px 0;
    font-family: var(--font-body), sans-serif;
    font-size: 15px;
    line-height: 1.9;
    color: ${C.secondary};
    font-weight: 300;
    max-width: 680px;
  }
`

const faqs = [
  {
    q: 'Paljonko Pesänhoitaja maksaa?',
    a: 'Olemme vielä kehitysvaiheessa ja hinnoittelu tarkentuu julkaisun myötä. Tällä hetkellä palvelu on käytettävissä ilmaiseksi — rekisteröitymällä nyt saat tiedon ensimmäisenä.',
  },
  {
    q: 'Tarvitsenko silti lakimiehen?',
    a: 'Pesänhoitaja ei korvaa lakimiestä — se valmistelee sinut lakimiestapaamista varten. Kun saavut lakimiehelle järjesteltyjen tietojen kanssa, säästät sekä aikaa että rahaa.',
  },
  {
    q: 'Ovatko tietoni turvassa?',
    a: 'Kyllä. Kaikki tieto tallennetaan suojatusti eikä sitä jaeta kolmansille osapuolille. Vain sinä ja kutsumasi osakkaat näkevät pesän tiedot.',
  },
  {
    q: 'Toimiiko tämä kaikenlaisissa kuolinpesissä?',
    a: 'Pesänhoitaja sopii tavallisille suomalaisille kuolinpesille. Erittäin monimutkaisissa tapauksissa, kuten yritysomaisuuden sisältävissä pesissä, suosittelemme lakimiehen käyttöä alusta asti.',
  },
  {
    q: 'Voinko jakaa pääsyn muille osakkaille?',
    a: 'Kyllä. Voit kutsua muut osakkaat mukaan sähköpostilla. Jokaisella on oma näkymä ja voitte työskennellä pesän parissa yhdessä.',
  },
  {
    q: 'Mistä aloitan?',
    a: 'Luo tili, syötä vainajan perustiedot ja järjestelmä rakentaa sinulle henkilökohtaisen tarkistuslistan. Ensimmäinen askel vie alle viisi minuuttia.',
  },
]

export default function UKK() {
  const router = useRouter()
  const [open, setOpen] = useState(null)
  const [kirjautunut, setKirjautunut] = useState(false)

  useEffect(() => {
    const tarkista = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKirjautunut(true)
    }
    tarkista()
  }, [])

  const toggle = (i) => setOpen(open === i ? null : i)

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>
      <DashboardLink />

      {/* ── NAV ── */}
      <nav className="top-bar">
        <button className="nav-logo" onClick={() => router.push('/')}>Pesänhoitaja</button>
        <button className="nav-item" onClick={() => router.push('/miten-toimii')}>Miten toimii</button>
        <button className="nav-item" onClick={() => router.push('/kenelle')}>Kenelle</button>
        <button className="nav-item active">UKK</button>
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
          fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.025em',
          color: C.text, marginBottom: '24px',
        }}>
          Vastaukset yleisimpiin<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>kysymyksiin.</em>
        </h1>
        <p className="a3" style={{
          color: C.secondary, fontSize: '15px', lineHeight: 1.85,
          fontWeight: 300, maxWidth: '480px',
        }}>
          Ei löytynyt vastausta? Ota yhteyttä — vastaamme mielellämme.
        </p>
      </div>

      {/* ── FAQ LIST ── */}
      <div style={{ padding: '0 80px 120px', maxWidth: '900px' }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item${open === i ? ' open' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className="faq-question">
              <span>{faq.q}</span>
              <span className="faq-icon">+</span>
            </div>
            <div
              className="faq-answer"
              style={{ maxHeight: open === i ? '300px' : '0' }}
            >
              <div className="faq-answer-inner">{faq.a}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: '80px 80px',
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
