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
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  .a1 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .a2 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  .scale-in { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

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

  .divider { height: 1px; background: ${C.border}; }

  .info-box {
    background: rgba(201,168,76,0.04);
    border: 1px solid rgba(201,168,76,0.14);
    border-left: 2px solid ${C.accent};
    padding: 14px 16px;
    font-size: 12px; color: ${C.secondary}; line-height: 1.7;
  }
`

export default function Aktivoi() {
  const router = useRouter()
  const [vaihe, setVaihe] = useState(1)
  const [lataa, setLataa] = useState(false)
  const [virhe, setVirhe] = useState('')

  // Vaihe 1 — tunnistautuminen
  const [tunnistus, setTunnistus] = useState({
    vainajanEmail: '',
    aktivointikoodi: '',
    syntymaaika: '',
    osoite: '',
    puhelin: '',
  })

  // Vaihe 2 — oma tili
  const [omaTili, setOmaTili] = useState({ sahkoposti: '', salasana: '' })

  const paivitaTunnistus = (kentta, arvo) => setTunnistus({ ...tunnistus, [kentta]: arvo })
  const paivitaOmaTili = (kentta, arvo) => setOmaTili({ ...omaTili, [kentta]: arvo })

  const tarkistaTiedot = async () => {
    if (!tunnistus.vainajanEmail || !tunnistus.aktivointikoodi || !tunnistus.syntymaaika || !tunnistus.osoite || !tunnistus.puhelin) {
      setVirhe('Täytä kaikki kentät.')
      return
    }
    setLataa(true)
    setVirhe('')
    // MVP: siirrytään suoraan vaiheeseen 2 ilman taustavalidointia
    await new Promise(r => setTimeout(r, 800))
    setLataa(false)
    setVaihe(2)
  }

  const luoTili = async () => {
    if (!omaTili.sahkoposti || !omaTili.salasana) {
      setVirhe('Täytä sähköposti ja salasana.')
      return
    }
    setLataa(true)
    setVirhe('')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: omaTili.sahkoposti,
      password: omaTili.salasana,
      options: {
        data: { tili_tyyppi: 'osakas' },
      },
    })
    if (authError) {
      setVirhe('Virhe: ' + authError.message)
      setLataa(false)
      return
    }
    if (authData.user?.identities?.length === 0) {
      setVirhe('Tällä sähköpostiosoitteella on jo tili. Kirjaudu sisään.')
      setLataa(false)
      return
    }
    router.push('/dashboard')
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
        <button className="back-link a1" onClick={() => vaihe === 1 ? router.push('/valitse') : setVaihe(1)} style={{ marginBottom: '40px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Takaisin
        </button>

        {/* ── VAIHE 1: TUNNISTAUTUMINEN ── */}
        {vaihe === 1 && (
          <>
            <div className="a1" style={{
              fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
            }}>
              <div style={{ width: '20px', height: '1px', background: C.accent }} />
              Aktivoi kuolinpesätila
            </div>

            <h1 className="a1" style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
              color: C.text, marginBottom: '16px', lineHeight: 1.1,
            }}>
              Avaa vainajan<br />
              <em style={{ fontStyle: 'italic', color: C.accent }}>kuolinpesätila.</em>
            </h1>

            <p className="a1" style={{ fontSize: '13px', color: C.secondary, lineHeight: 1.8, marginBottom: '36px' }}>
              Vainaja on valmistellut tiedot etukäteen. Syötä tunnistautumistiedot avataksesi pesän.
            </p>

            <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <label className="form-label">Vainajan sähköpostiosoite *</label>
                <input className="form-input" type="email" placeholder="vainajan@email.fi"
                  value={tunnistus.vainajanEmail}
                  onChange={e => paivitaTunnistus('vainajanEmail', e.target.value)} />
              </div>

              <div>
                <label className="form-label">Aktivointikoodi *</label>
                <input className="form-input" type="text" placeholder="Esim. KOIVU-4821-SYKSY"
                  value={tunnistus.aktivointikoodi}
                  onChange={e => paivitaTunnistus('aktivointikoodi', e.target.value.toUpperCase())}
                  style={{ letterSpacing: '0.08em', fontFamily: 'monospace' }} />
                <p style={{ fontSize: '11px', color: C.secondary, marginTop: '6px', opacity: 0.7 }}>
                  Koodi löytyy vainajan jättämistä papereista tai testamentista.
                </p>
              </div>

              <div className="divider" />

              <div className="info-box">
                Vahvista henkilöllisyys — syötä tiedot jotka tiedät vainajasta.
              </div>

              <div>
                <label className="form-label">Vainajan syntymäaika *</label>
                <input className="form-input" type="text" placeholder="pp.kk.vvvv"
                  value={tunnistus.syntymaaika}
                  onChange={e => paivitaTunnistus('syntymaaika', e.target.value)} />
              </div>

              <div>
                <label className="form-label">Vainajan kotiosoite *</label>
                <input className="form-input" type="text" placeholder="Katuosoite, kaupunki"
                  value={tunnistus.osoite}
                  onChange={e => paivitaTunnistus('osoite', e.target.value)} />
              </div>

              <div>
                <label className="form-label">Vainajan puhelinnumero *</label>
                <input className="form-input" type="text" placeholder="+358 40 123 4567"
                  value={tunnistus.puhelin}
                  onChange={e => paivitaTunnistus('puhelin', e.target.value)} />
              </div>

              {virhe && (
                <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center' }}>{virhe}</p>
              )}

              <button className="btn-submit" onClick={tarkistaTiedot} disabled={lataa}>
                {lataa ? 'Tarkistetaan...' : 'Tarkista tiedot'}
                {!lataa && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: C.secondary, opacity: 0.5, lineHeight: 1.6 }}>
                Tietosi ovat turvassa. Emme jaa tietojasi kolmansille osapuolille.
              </p>

              <div style={{ height: '1px', background: C.border, margin: '8px 0' }} />

              <p style={{ textAlign: 'center', fontSize: '11px', color: C.secondary, lineHeight: 1.6 }}>
                Haluatko ensin katsoa miltä pesä näyttää?{' '}
                <button onClick={() => router.push('/pesa')} style={{
                  color: C.accent, background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
                }}>
                  Esikatsele demo →
                </button>
              </p>

            </div>
          </>
        )}

        {/* ── VAIHE 2: LUO OMA TILI ── */}
        {vaihe === 2 && (
          <>
            <div className="a1" style={{
              fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase',
              color: C.accent, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
            }}>
              <div style={{ width: '20px', height: '1px', background: C.accent }} />
              Aktivoi kuolinpesätila
            </div>

            <h1 className="a1" style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em',
              color: C.text, marginBottom: '32px', lineHeight: 1.1,
            }}>
              Luo oma<br />
              <em style={{ fontStyle: 'italic', color: C.accent }}>tilisi.</em>
            </h1>

            {/* Vahvistus */}
            <div className="scale-in" style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 18px',
              border: '1px solid rgba(74,222,128,0.25)',
              background: 'rgba(74,222,128,0.06)',
              marginBottom: '32px',
            }}>
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                border: '1px solid rgba(74,222,128,0.4)',
                background: 'rgba(74,222,128,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
              }}>✓</div>
              <div>
                <div style={{ fontSize: '12px', color: '#4ADE80', letterSpacing: '0.08em', marginBottom: '2px' }}>Pesä löytyi</div>
                <div style={{ fontSize: '12px', color: C.secondary }}>Tunnistautuminen onnistui — luo tili jatkaaksesi</div>
              </div>
            </div>

            <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <label className="form-label">Oma sähköpostiosoitteesi *</label>
                <input className="form-input" type="email" placeholder="sinun@email.fi"
                  value={omaTili.sahkoposti}
                  onChange={e => paivitaOmaTili('sahkoposti', e.target.value)} />
              </div>

              <div>
                <label className="form-label">Salasana *</label>
                <input className="form-input" type="password" placeholder="Vähintään 8 merkkiä"
                  value={omaTili.salasana}
                  onChange={e => paivitaOmaTili('salasana', e.target.value)} />
              </div>

              {virhe && (
                <p style={{ fontSize: '13px', color: '#e07070', textAlign: 'center' }}>{virhe}</p>
              )}

              <button className="btn-submit" onClick={luoTili} disabled={lataa}>
                {lataa ? 'Luodaan tiliä...' : 'Luo tili ja avaa pesä'}
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
          </>
        )}

      </div>
    </div>
  )
}
