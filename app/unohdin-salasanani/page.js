'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
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

export default function UnohdinSalasanani() {
  const router = useRouter()
  const [sahkoposti, setSahkoposti] = useState('')
  const [lataa, setLataa] = useState(false)
  const [lahetetty, setLahetetty] = useState(false)
  const [virhe, setVirhe] = useState('')
  const [uudelleenLataa, setUudelleenLataa] = useState(false)
  const [uudelleenViesti, setUudelleenViesti] = useState('')

  const laheta = async () => {
    setLataa(true)
    setVirhe('')
    const { error } = await supabase.auth.resetPasswordForEmail(sahkoposti, {
      redirectTo: window.location.origin + '/vaihda-salasana',
    })
    setLataa(false)
    if (error) { setVirhe('Virhe: ' + error.message); return }
    setLahetetty(true)
  }

  const lahetaUudelleen = async () => {
    setUudelleenLataa(true)
    setUudelleenViesti('')
    const { error } = await supabase.auth.resetPasswordForEmail(sahkoposti, {
      redirectTo: window.location.origin + '/vaihda-salasana',
    })
    setUudelleenLataa(false)
    setUudelleenViesti(error ? 'Virhe lähetyksessä.' : 'Uusi viesti lähetetty.')
  }

  if (lahetetty) {
    return (
      <div style={{
        backgroundColor: C.bg, color: C.text,
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px', fontFamily: 'var(--font-body), sans-serif',
      }}>
        <style>{css}</style>
        <div className="a1" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>

          <div style={{
            width: '56px', height: '56px', margin: '0 auto 32px',
            border: `1px solid rgba(201,168,76,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>

          <div style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: C.accent, marginBottom: '16px' }}>
            Tarkista sähköpostisi
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em',
            color: C.text, marginBottom: '16px', lineHeight: 1.15,
          }}>
            Linkki lähetetty
          </h1>

          <p style={{ fontSize: '14px', color: C.secondary, lineHeight: 1.7, marginBottom: '40px' }}>
            Lähetimme salasanan palautuslinkin osoitteeseen<br />
            <span style={{ color: C.text }}>{sahkoposti}</span>
          </p>

          <div style={{ height: '1px', background: C.border, marginBottom: '28px' }} />

          <p style={{ fontSize: '12px', color: C.secondary, marginBottom: '12px' }}>
            Eikö viesti saapunut?
          </p>

          <button onClick={lahetaUudelleen} disabled={uudelleenLataa} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: C.secondary, fontFamily: 'var(--font-body)', transition: 'color 0.2s',
            opacity: uudelleenLataa ? 0.5 : 1,
          }}
            onMouseEnter={e => e.target.style.color = C.accent}
            onMouseLeave={e => e.target.style.color = C.secondary}
          >
            {uudelleenLataa ? 'Lähetetään...' : 'Lähetä uudelleen'}
          </button>

          {uudelleenViesti && (
            <p style={{ fontSize: '12px', color: uudelleenViesti.includes('Virhe') ? '#e07070' : C.accent, marginTop: '16px' }}>
              {uudelleenViesti}
            </p>
          )}

          <button onClick={() => router.push('/kirjaudu')} style={{
            marginTop: '40px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: C.secondary, fontFamily: 'var(--font-body)', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = C.accent}
            onMouseLeave={e => e.target.style.color = C.secondary}
          >
            ← Takaisin kirjautumiseen
          </button>

        </div>
      </div>
    )
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

        <button className="back-link a1" onClick={() => router.push('/kirjaudu')} style={{ marginBottom: '40px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Takaisin
        </button>

        <div className="a1" style={{
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        }}>
          <div style={{ width: '20px', height: '1px', background: C.accent }} />
          Salasanan palautus
        </div>

        <h1 className="a1" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
          color: C.text, marginBottom: '16px', lineHeight: 1.1,
        }}>
          Unohditko<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>salasanasi?</em>
        </h1>

        <p style={{ fontSize: '14px', color: C.secondary, lineHeight: 1.7, marginBottom: '40px' }}>
          Syötä sähköpostiosoitteesi ja lähetämme sinulle palautuslinkin.
        </p>

        <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <label className="form-label">Sähköpostiosoite</label>
            <input className="form-input" type="email" placeholder="sinun@email.fi"
              value={sahkoposti} onChange={e => setSahkoposti(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && laheta()} />
          </div>

          {virhe && (
            <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              {virhe}
            </p>
          )}

          <button className="btn-submit" onClick={laheta} disabled={lataa || !sahkoposti}>
            {lataa ? 'Lähetetään...' : 'Lähetä palautuslinkki'}
            {!lataa && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>

        </div>
      </div>
    </div>
  )
}
