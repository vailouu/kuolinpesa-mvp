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

export default function Aloita() {
  const router = useRouter()
  const [tiedot, setTiedot] = useState({ etunimi: '', sukunimi: '', vainajanNimi: '', kuolinpaiva: '', sahkoposti: '', salasana: '' })
  const [lataa, setLataa] = useState(false)
  const [virhe, setVirhe] = useState('')
  const [vahvistuslahetetty, setVahvistuslahetetty] = useState(false)
  const [onSessio, setOnSessio] = useState(false)
  const [uudelleenLataa, setUudelleenLataa] = useState(false)
  const [uudelleenViesti, setUudelleenViesti] = useState('')

  const paivita = (kentta, arvo) => setTiedot({ ...tiedot, [kentta]: arvo })

  const laheta = async () => {
    setLataa(true)
    setVirhe('')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: tiedot.sahkoposti,
      password: tiedot.salasana,
      options: {
        data: {
          tili_tyyppi: 'kuolinpesa',
          etunimi: tiedot.etunimi,
          sukunimi: tiedot.sukunimi,
        },
      },
    })
    if (authError) { setVirhe('Virhe: ' + authError.message); setLataa(false); return }
    if (authData.user?.identities?.length === 0) {
      setVirhe('Tällä sähköpostiosoitteella on jo tili. Kirjaudu sisään.')
      setLataa(false)
      return
    }
    const { error } = await supabase.from('kuolinpesat').insert({
      vainajan_nimi: tiedot.vainajanNimi,
      kuolinpaiva: tiedot.kuolinpaiva || null,
      kayttaja_email: tiedot.sahkoposti,
    })
    if (error) { setVirhe('Virhe: ' + error.message); setLataa(false); return }
    localStorage.setItem('uusi_kayttaja', 'true')
    setOnSessio(!!authData.session)
    setVahvistuslahetetty(true)
    setLataa(false)
  }

  const lahetaUudelleen = async () => {
    setUudelleenLataa(true)
    setUudelleenViesti('')
    const { error } = await supabase.auth.resend({ type: 'signup', email: tiedot.sahkoposti })
    setUudelleenLataa(false)
    setUudelleenViesti(error ? 'Virhe lähetyksessä.' : 'Uusi viesti lähetetty.')
  }

  if (vahvistuslahetetty) {
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
            Lähes valmis
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em',
            color: C.text, marginBottom: '16px', lineHeight: 1.15,
          }}>
            Tarkista sähköpostisi
          </h1>

          <p style={{ fontSize: '14px', color: C.secondary, lineHeight: 1.7, marginBottom: '40px' }}>
            Lähetimme vahvistuslinkin osoitteeseen<br />
            <span style={{ color: C.text }}>{tiedot.sahkoposti}</span>
          </p>

          <div style={{ height: '1px', background: C.border, marginBottom: '32px' }} />

          {onSessio ? (
            <>
              <button className="btn-submit" onClick={() => router.push('/dashboard')} style={{ marginTop: 0 }}>
                Siirry sovellukseen
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <div style={{ marginTop: '28px' }}>
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
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: '12px', color: C.secondary, marginBottom: '16px' }}>
                Eikö viesti saapunut?
              </p>
              <button className="btn-submit" onClick={lahetaUudelleen} disabled={uudelleenLataa} style={{ marginTop: 0 }}>
                {uudelleenLataa ? 'Lähetetään...' : 'Lähetä uudelleen'}
              </button>
            </>
          )}

          {uudelleenViesti && (
            <p style={{ fontSize: '12px', color: uudelleenViesti.includes('Virhe') ? '#e07070' : C.accent, marginTop: '16px' }}>
              {uudelleenViesti}
            </p>
          )}

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

        {/* Takaisin */}
        <button className="back-link a1" onClick={() => router.push('/valitse')} style={{ marginBottom: '40px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Takaisin
        </button>

        {/* Header */}
        <div className="a1" style={{
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        }}>
          <div style={{ width: '20px', height: '1px', background: C.accent }} />
          Uusi kuolinpesä
        </div>

        <h1 className="a1" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
          color: C.text, marginBottom: '40px', lineHeight: 1.1,
        }}>
          Aloita kuolinpesän<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>hoito.</em>
        </h1>

        {/* Form */}
        <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <label className="form-label">Vainajan nimi *</label>
            <input className="form-input" type="text" placeholder="Etunimi Sukunimi"
              autoComplete="off"
              value={tiedot.vainajanNimi} onChange={e => paivita('vainajanNimi', e.target.value)} />
          </div>

          <div>
            <label className="form-label">
              Kuolinpäivä{' '}
              <span style={{ opacity: 0.5, letterSpacing: '0.1em' }}>(valinnainen)</span>
            </label>
            <input className="form-input" type="date"
              autoComplete="off"
              value={tiedot.kuolinpaiva} onChange={e => paivita('kuolinpaiva', e.target.value)} />
          </div>

          <div style={{ height: '1px', background: C.border }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Etunimi *</label>
              <input className="form-input" type="text" placeholder="Anna"
                autoComplete="given-name"
                value={tiedot.etunimi} onChange={e => paivita('etunimi', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Sukunimi *</label>
              <input className="form-input" type="text" placeholder="Korhonen"
                autoComplete="family-name"
                value={tiedot.sukunimi} onChange={e => paivita('sukunimi', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="form-label">Sähköpostiosoitteesi *</label>
            <input className="form-input" type="email" placeholder="sinun@email.fi"
              autoComplete="email"
              value={tiedot.sahkoposti} onChange={e => paivita('sahkoposti', e.target.value)} />
          </div>

          <div>
            <label className="form-label">Salasana *</label>
            <input className="form-input" type="password" placeholder="Vähintään 8 merkkiä"
              autoComplete="new-password"
              value={tiedot.salasana} onChange={e => paivita('salasana', e.target.value)} />
          </div>

          {virhe && (
            <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              {virhe}
            </p>
          )}

          <button className="btn-submit" onClick={laheta} disabled={lataa}>
            {lataa ? 'Luodaan...' : 'Luo kuolinpesä'}
            {!lataa && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: C.secondary, lineHeight: 1.7 }}>
            Onko sinulla jo tili?{' '}
            <button onClick={() => router.push('/kirjaudu')} style={{
              color: C.accent, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
            }}>
              Kirjaudu sisään
            </button>
          </p>

          <p style={{ textAlign: 'center', fontSize: '11px', color: C.secondary, opacity: 0.6, lineHeight: 1.7 }}>
            Rekisteröitymällä hyväksyt{' '}
            <button onClick={() => router.push('/kayttoehdot')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'inherit', fontFamily: 'var(--font-body)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>käyttöehdot</button>
            {' '}ja{' '}
            <button onClick={() => router.push('/tietosuoja')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'inherit', fontFamily: 'var(--font-body)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>tietosuojaselosteen</button>
            .
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