'use client'
import { useState, useEffect } from 'react'
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
`

export default function VaihdaSalasana() {
  const router = useRouter()
  const [salasana, setSalasana] = useState('')
  const [vahvistus, setVahvistus] = useState('')
  const [lataa, setLataa] = useState(false)
  const [virhe, setVirhe] = useState('')
  const [valmis, setValmis] = useState(false)
  const [sessioValmis, setSessioValmis] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSessioValmis(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const vaihda = async () => {
    if (salasana !== vahvistus) { setVirhe('Salasanat eivät täsmää.'); return }
    if (salasana.length < 8) { setVirhe('Salasanan tulee olla vähintään 8 merkkiä.'); return }
    setLataa(true)
    setVirhe('')
    const { error } = await supabase.auth.updateUser({ password: salasana })
    setLataa(false)
    if (error) { setVirhe('Virhe: ' + error.message); return }
    setValmis(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (valmis) {
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
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <div style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: C.accent, marginBottom: '16px' }}>
            Valmis
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em',
            color: C.text, marginBottom: '16px', lineHeight: 1.15,
          }}>
            Salasana vaihdettu
          </h1>

          <p style={{ fontSize: '14px', color: C.secondary, lineHeight: 1.7 }}>
            Sinut ohjataan sovellukseen hetken kuluttua.
          </p>

        </div>
      </div>
    )
  }

  if (!sessioValmis) {
    return (
      <div style={{
        backgroundColor: C.bg, color: C.text,
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px', fontFamily: 'var(--font-body), sans-serif',
      }}>
        <style>{css}</style>
        <div className="a1" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: C.secondary, lineHeight: 1.7, marginBottom: '32px' }}>
            Linkki on vanhentunut tai virheellinen.
          </p>
          <button onClick={() => router.push('/unohdin-salasanani')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: C.accent, fontFamily: 'var(--font-body)',
          }}>
            Pyydä uusi linkki →
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

        <div className="a1" style={{
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        }}>
          <div style={{ width: '20px', height: '1px', background: C.accent }} />
          Salasanan vaihto
        </div>

        <h1 className="a1" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
          color: C.text, marginBottom: '40px', lineHeight: 1.1,
        }}>
          Aseta uusi<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>salasana.</em>
        </h1>

        <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <label className="form-label">Uusi salasana</label>
            <input className="form-input" type="password" placeholder="Vähintään 8 merkkiä"
              value={salasana} onChange={e => setSalasana(e.target.value)} />
          </div>

          <div>
            <label className="form-label">Vahvista salasana</label>
            <input className="form-input" type="password" placeholder="Sama salasana uudelleen"
              value={vahvistus} onChange={e => setVahvistus(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && vaihda()} />
          </div>

          {virhe && (
            <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              {virhe}
            </p>
          )}

          <button className="btn-submit" onClick={vaihda} disabled={lataa || !salasana || !vahvistus}>
            {lataa ? 'Vaihdetaan...' : 'Vaihda salasana'}
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
