'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../supabase'

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

  .form-input {
    width: 100%;
    background: rgba(240,235,227,0.03);
    border: 1px solid ${C.border};
    color: ${C.text};
    font-family: var(--font-body), sans-serif;
    font-size: 14px;
    padding: 14px 16px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
    color-scheme: dark;
  }
  .form-input::placeholder { color: ${C.secondary}; opacity: 0.6; }
  .form-input:focus {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.06);
  }

  .form-label {
    display: block;
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${C.secondary}; margin-bottom: 8px;
  }

  .btn-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    color: ${C.accent}; background: transparent;
    border: 1px solid rgba(201,168,76,0.35);
    padding: 16px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
    margin-top: 8px;
  }
  .btn-submit:hover:not(:disabled) {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.7);
    box-shadow: 0 0 24px rgba(201,168,76,0.2);
  }
  .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .back-link {
    font-family: var(--font-body), sans-serif;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.secondary}; background: none; border: none;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: color 0.2s ease;
  }
  .back-link:hover { color: ${C.accent}; }
`

export default function Kirjaudu() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const istuntoVanhentunut = searchParams.get('syy') === 'istunto'
  const [tiedot, setTiedot] = useState({ sahkoposti: '', salasana: '' })
  const [virhe, setVirhe] = useState('')
  const [lataa, setLataa] = useState(false)

  const paivita = (kentta, arvo) => setTiedot({ ...tiedot, [kentta]: arvo })

  const kirjauduSisaan = async () => {
    setLataa(true)
    setVirhe('')
    const { error } = await supabase.auth.signInWithPassword({
      email: tiedot.sahkoposti,
      password: tiedot.salasana,
    })
    if (error) { setVirhe('Väärä sähköposti tai salasana'); setLataa(false) }
    else {
      const { data: { user } } = await supabase.auth.getUser()
      const tiliTyyppi = user?.user_metadata?.tili_tyyppi
      if (tiliTyyppi === 'valmistelu') {
        router.push('/valmistele/dashboard')
      } else {
        localStorage.setItem('tervetuloa_takaisin', 'true')
        router.push('/dashboard')
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') kirjauduSisaan()
  }

  return (
    <div style={{
      backgroundColor: C.bg, color: C.text,
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', fontFamily: 'var(--font-body), sans-serif',
    }}>
      <style>{css}</style>

      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Takaisin */}
        <button className="back-link a1" onClick={() => router.push('/')} style={{ marginBottom: '40px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Etusivulle
        </button>

        {/* Header */}
        <div className="a1" style={{
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        }}>
          <div style={{ width: '20px', height: '1px', background: C.accent }} />
          Tervetuloa takaisin
        </div>

        <h1 className="a1" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
          color: C.text, marginBottom: '40px', lineHeight: 1.1,
        }}>
          Kirjaudu<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>sisään.</em>
        </h1>

        {/* Form */}
        <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {istuntoVanhentunut && (
            <div style={{
              padding: '14px 16px',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.2)',
              fontSize: '13px', color: '#C9A84C', lineHeight: 1.6,
            }}>
              Istuntosi on vanhentunut. Kirjaudu uudelleen sisään.
            </div>
          )}

          <div>
            <label className="form-label">Sähköpostiosoite</label>
            <input className="form-input" type="email" placeholder="sinun@email.fi"
              value={tiedot.sahkoposti} onChange={e => paivita('sahkoposti', e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          <div>
            <label className="form-label">Salasana</label>
            <input className="form-input" type="password" placeholder="Salasanasi"
              value={tiedot.salasana} onChange={e => paivita('salasana', e.target.value)}
              onKeyDown={handleKeyDown} />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <button onClick={() => router.push('/unohdin-salasanani')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '11px', letterSpacing: '0.08em',
                color: C.secondary, fontFamily: 'var(--font-body)', transition: 'color 0.2s',
                opacity: 0.7,
              }}
                onMouseEnter={e => e.target.style.color = C.accent}
                onMouseLeave={e => e.target.style.color = C.secondary}
              >
                Unohdin salasanani
              </button>
            </div>
          </div>

          {virhe && (
            <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              {virhe}
            </p>
          )}

          <button className="btn-submit" onClick={kirjauduSisaan} disabled={lataa}>
            {lataa ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
            {!lataa && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: C.secondary, lineHeight: 1.7 }}>
            Ei vielä tiliä?{' '}
            <button onClick={() => router.push('/aloita')} style={{
              color: C.accent, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
            }}>
              Aloita tästä
            </button>
          </p>

          <p style={{ textAlign: 'center', fontSize: '11px', color: C.secondary, opacity: 0.4, lineHeight: 1.7 }}>
            <button onClick={() => router.push('/tietosuoja')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'inherit', fontFamily: 'var(--font-body)' }}>Tietosuoja</button>
            {' · '}
            <button onClick={() => router.push('/kayttoehdot')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'inherit', fontFamily: 'var(--font-body)' }}>Käyttöehdot</button>
          </p>

        </div>
      </div>
    </div>
  )
}
