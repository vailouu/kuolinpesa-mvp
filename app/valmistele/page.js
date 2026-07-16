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

export default function Valmistele() {
  const router = useRouter()
  const [tiedot, setTiedot] = useState({ nimi: '', puhelin: '', sahkoposti: '', salasana: '', salasanaVahvistus: '' })
  const [lataa, setLataa] = useState(false)
  const [virhe, setVirhe] = useState('')
  const [tarkistaEmail, setTarkistaEmail] = useState(false)
  const [onSessio, setOnSessio] = useState(false)
  const [uudelleenLataa, setUudelleenLataa] = useState(false)
  const [uudelleenViesti, setUudelleenViesti] = useState('')

  const paivita = (kentta, arvo) => setTiedot({ ...tiedot, [kentta]: arvo })

  // Jos käyttäjällä on jo voimassa oleva istunto (esim. selaimen Takaisin-nappia
  // painettu rekisteröitymisen jälkeen), ohjaa suoraan sovellukseen sen sijaan että
  // näytetään harhaanjohtavasti tyhjä rekisteröitymislomake.
  useEffect(() => {
    const tarkistaIstunto = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const tiliTyyppi = user.user_metadata?.tili_tyyppi
      router.replace(tiliTyyppi === 'valmistelu' ? '/valmistele/dashboard' : '/dashboard')
    }
    tarkistaIstunto()
  }, [])

  const laheta = async () => {
    if (!tiedot.nimi || !tiedot.sahkoposti || !tiedot.salasana || !tiedot.salasanaVahvistus) {
      setVirhe('Täytä kaikki pakolliset kentät.')
      return
    }
    if (tiedot.salasana !== tiedot.salasanaVahvistus) {
      setVirhe('Salasanat eivät täsmää.')
      return
    }
    setLataa(true)
    setVirhe('')

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: tiedot.sahkoposti,
      password: tiedot.salasana,
      options: {
        data: {
          tili_tyyppi: 'valmistelu',
          full_name: tiedot.nimi,
          puhelin: tiedot.puhelin || null,
        },
      },
    })

    if (authError) { setVirhe('Virhe: ' + authError.message); setLataa(false); return }
    if (authData.user?.identities?.length === 0) {
      setVirhe('Tällä sähköpostiosoitteella on jo tili. Kirjaudu sisään.')
      setLataa(false)
      return
    }

    // Näytä sähköpostin vahvistusruutu aina — jos sessio syntyi jo heti,
    // ruudulla tarjotaan lisäksi suora jatkonappi sovellukseen.
    setOnSessio(!!authData.session)
    setVirhe('')
    setTarkistaEmail(true)
    setLataa(false)
  }

  const lahetaUudelleen = async () => {
    setUudelleenLataa(true)
    setUudelleenViesti('')
    const { error } = await supabase.auth.resend({ type: 'signup', email: tiedot.sahkoposti })
    setUudelleenLataa(false)
    setUudelleenViesti(error ? 'Virhe lähetyksessä.' : 'Uusi viesti lähetetty.')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') laheta()
  }

  if (tarkistaEmail) return (
    <div style={{
      backgroundColor: C.bg, color: C.text,
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', fontFamily: 'var(--font-body), sans-serif',
      textAlign: 'center',
    }}>
      <style>{css}</style>
      <div style={{ maxWidth: '400px' }}>
        <div style={{
          fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
          color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '14px', marginBottom: '24px',
        }}>
          <div style={{ width: '24px', height: '1px', background: C.accent }} />
          Tili luotu
          <div style={{ width: '24px', height: '1px', background: C.accent }} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '32px', fontWeight: 300, color: C.text,
          marginBottom: '16px', lineHeight: 1.1,
        }}>
          Tarkista<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>sähköpostisi.</em>
        </h1>
        <p style={{ color: C.secondary, fontSize: '14px', lineHeight: 1.8, marginBottom: '32px' }}>
          Lähetimme vahvistuslinkin osoitteeseen <strong style={{ color: C.text }}>{tiedot.sahkoposti}</strong>. Klikkaa linkkiä ja pääset kirjautumaan sisään.
        </p>

        <div style={{ height: '1px', background: C.border, marginBottom: '32px' }} />

        {onSessio ? (
          <>
            <button className="btn-submit" onClick={() => router.replace('/valmistele/dashboard')} style={{ marginTop: 0 }}>
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
            <button className="btn-submit" onClick={() => router.push('/kirjaudu')} style={{ marginTop: 0 }}>
              Kirjaudu sisään
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
        )}

        {uudelleenViesti && (
          <p style={{ fontSize: '12px', color: uudelleenViesti.includes('Virhe') ? '#e07070' : C.accent, marginTop: '16px' }}>
            {uudelleenViesti}
          </p>
        )}
      </div>
    </div>
  )

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
          Valmistelu
        </div>

        <h1 className="a1" style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
          color: C.text, marginBottom: '16px', lineHeight: 1.1,
        }}>
          Lahjoita omaisillesi<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>selkeys.</em>
        </h1>

        <p className="a1" style={{
          fontSize: '14px', color: C.secondary, lineHeight: 1.8,
          marginBottom: '40px', fontWeight: 300,
        }}>
          Täytä tietosi etukäteen. Omaisesi löytävät kaiken tarvitsemansa yhdestä paikasta.
        </p>

        {/* Form */}
        <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <label className="form-label">Koko nimesi *</label>
            <input className="form-input" type="text" placeholder="Etunimi Sukunimi"
              autoComplete="name"
              value={tiedot.nimi} onChange={e => paivita('nimi', e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          <div>
            <label className="form-label">
              Puhelinnumero{' '}
              <span style={{ opacity: 0.5, letterSpacing: '0.1em' }}>(valinnainen)</span>
            </label>
            <input className="form-input" type="tel" placeholder="+358 40 123 4567"
              autoComplete="tel"
              value={tiedot.puhelin} onChange={e => paivita('puhelin', e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          <div style={{ height: '1px', background: C.border }} />

          <div>
            <label className="form-label">Sähköpostiosoite *</label>
            <input className="form-input" type="email" placeholder="sinun@email.fi"
              autoComplete="email"
              value={tiedot.sahkoposti} onChange={e => paivita('sahkoposti', e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          <div>
            <label className="form-label">Salasana *</label>
            <input className="form-input" type="password" placeholder="Vähintään 8 merkkiä"
              autoComplete="new-password"
              value={tiedot.salasana} onChange={e => paivita('salasana', e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          <div>
            <label className="form-label">Vahvista salasana *</label>
            <input className="form-input" type="password" placeholder="Kirjoita salasana uudelleen"
              autoComplete="new-password"
              value={tiedot.salasanaVahvistus} onChange={e => paivita('salasanaVahvistus', e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          {virhe && (
            <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
              {virhe}
            </p>
          )}

          <button className="btn-submit" onClick={laheta} disabled={lataa}>
            {lataa ? 'Luodaan tiliä...' : 'Luo tili'}
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

          <p style={{ textAlign: 'center', fontSize: '11px', color: C.secondary, opacity: 0.5, lineHeight: 1.6 }}>
            Tietosi ovat turvassa. Emme jaa tietojasi kolmansille osapuolille.
          </p>

        </div>
      </div>
    </div>
  )
}
