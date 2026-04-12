'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'
import GlobalNav from '../components/GlobalNav'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
  borderWarm: 'rgba(201,168,76,0.18)',
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

  .top-bar {
    position: fixed; top: 0; left: 0; right: 0;
    display: flex; align-items: center; gap: 36px;
    padding: 0 56px; height: 60px; z-index: 50;
    border-bottom: 1px solid ${C.borderWarm};
    box-shadow: 0 1px 0 rgba(201,168,76,0.06);
    background: ${C.bg};
  }
  .nav-logo {
    font-family: var(--font-body), sans-serif;
    font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
    color: ${C.text}; cursor: pointer; background: none; border: none;
    transition: color 0.2s ease, text-shadow 0.2s ease; margin-right: 8px;
  }
  .nav-logo:hover { color: ${C.accent}; text-shadow: 0 0 12px rgba(201,168,76,0.7); }
  .nav-item {
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${C.secondary}; cursor: pointer; background: none; border: none; padding: 0;
    transition: color 0.2s ease, text-shadow 0.2s ease, box-shadow 0.2s ease;
  }
  .nav-item:hover {
    color: ${C.accent};
    text-shadow: 0 0 12px rgba(201,168,76,0.7), 0 0 28px rgba(201,168,76,0.3);
    box-shadow: 0 0 16px rgba(201,168,76,0.15);
  }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 32px; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.accent}; background: transparent;
    border: 1px solid rgba(201,168,76,0.35);
    padding: 12px 24px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .btn-primary:hover {
    background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.7);
    box-shadow: 0 0 24px rgba(201,168,76,0.2); transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }

  .choice-card {
    border: 1px solid ${C.border};
    padding: 48px 40px;
    display: flex; flex-direction: column;
    background: transparent;
    cursor: pointer;
    transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
    position: relative; overflow: hidden;
  }
  .choice-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.25s ease;
  }
  .choice-card:hover {
    border-color: ${C.borderWarm};
    background: ${C.surface};
    transform: translateY(-4px);
  }
  .choice-card:hover::before { opacity: 1; }
  .choice-card.featured { border-color: rgba(201,168,76,0.3); }

  .card-num {
    font-family: var(--font-body), sans-serif;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: ${C.accent}; opacity: 0.6; margin-bottom: 24px;
  }
  .card-title {
    font-family: var(--font-display), Georgia, serif;
    font-size: 22px; font-weight: 400; letter-spacing: -0.01em;
    color: ${C.text}; margin-bottom: 14px; line-height: 1.25;
  }
  .card-desc {
    font-family: var(--font-body), sans-serif;
    font-size: 14px; line-height: 1.8; color: ${C.secondary};
    font-weight: 300; flex: 1; margin-bottom: 36px;
  }
  .card-action {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: ${C.accent}; transition: gap 0.2s ease;
  }
  .choice-card:hover .card-action { gap: 12px; }
`

export default function Valitse() {
  const router = useRouter()
  const [kirjautunut, setKirjautunut] = useState(false)

  useEffect(() => {
    const tarkista = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKirjautunut(true)
    }
    tarkista()
  }, [])

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="top-bar">
        <button className="nav-logo" onClick={() => router.push('/')}>Pesänhoitaja</button>
        <button className="nav-item" onClick={() => router.push('/miten-toimii')}>Miten toimii</button>
        <button className="nav-item" onClick={() => router.push('/ukk')}>UKK</button>
        <button className="nav-item" onClick={() => router.push('/hinnat')}>Hinnat</button>
        <button className="nav-item" onClick={() => router.push('/ota-yhteytta')}>Ota yhteyttä</button>
        <div className="nav-right">
          <button className="nav-item">Suomi</button>
          {kirjautunut ? <GlobalNav /> : (
            <button className="btn-primary" onClick={() => router.push('/kirjaudu')}>
              Kirjaudu sisään
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ padding: '140px 80px 72px', textAlign: 'center' }}>
        <div className="a1" style={{
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '14px', marginBottom: '28px',
        }}>
          <div style={{ width: '24px', height: '1px', background: C.accent }} />
          Valitse polku
          <div style={{ width: '24px', height: '1px', background: C.accent }} />
        </div>
        <h1 className="a2" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.025em',
          color: C.text, marginBottom: '20px',
        }}>
          Miten voimme auttaa<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>sinua tänään?</em>
        </h1>
        <p className="a3" style={{
          color: C.secondary, fontSize: '15px', lineHeight: 1.85,
          maxWidth: '480px', margin: '0 auto', fontWeight: 300,
        }}>
          Valitse tilanteeseesi sopiva polku.
        </p>
      </div>

      {/* ── CARDS ── */}
      <div style={{
        padding: '0 80px 120px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        maxWidth: '1100px',
        margin: '0 auto',
        backgroundColor: C.border,
      }}>

        <div className="choice-card featured a3" style={{ backgroundColor: C.bg }}
          onClick={() => router.push('/aloita')}>
          <div className="card-num">01</div>
          <h2 className="card-title">Aloita kuolinpesän hoito</h2>
          <p className="card-desc">Läheinen on menehtynyt ja haluat aloittaa asioiden hoitamisen järjestelmällisesti.</p>
          <span className="card-action">
            Aloita tästä
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>

        <div className="choice-card a3" style={{ backgroundColor: C.bg, animationDelay: '0.5s' }}
          onClick={() => router.push('/valmistele')}>
          <div className="card-num">02</div>
          <h2 className="card-title">Valmistele asioita läheisillesi</h2>
          <p className="card-desc">Haluat helpottaa läheistesi taakkaa valmistelemalla tiedot etukäteen.</p>
          <span className="card-action">
            Aloita tästä
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>

        <div className="choice-card a3" style={{ backgroundColor: C.bg, animationDelay: '0.6s' }}>
          <div className="card-num">03</div>
          <h2 className="card-title">Aktivoi kuolinpesätila</h2>
          <p className="card-desc">Vainaja on valmistellut tiedot etukäteen — avaa ne nyt käyttöösi.</p>
          <span className="card-action" style={{ color: C.secondary, cursor: 'default' }}>
            Tulossa pian
          </span>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: '24px 80px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary }}>
          © 2026 Pesänhoitaja
        </span>
      </footer>
    </div>
  )
}
