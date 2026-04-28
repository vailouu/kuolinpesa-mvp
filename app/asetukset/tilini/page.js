'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

const C = {
  bg: '#110E0B',
  card: '#0D0B09',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.07)',
  borderWarm: 'rgba(201,168,76,0.2)',
}

function Osio({ id, otsikko, avattu, onToggle, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => onToggle(id)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: avattu ? C.accent : C.text, fontFamily: 'var(--font-body), sans-serif',
          transition: 'color 0.2s',
        }}>
          {otsikko}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={avattu ? C.accent : C.secondary} strokeWidth="1.5"
          style={{ transition: 'transform 0.25s ease, stroke 0.2s', transform: avattu ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {avattu && (
        <div style={{ paddingBottom: '8px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function Rivi({ label, arvo }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
      <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary }}>{label}</span>
      <span style={{ fontSize: '14px', color: C.text }}>{arvo || '—'}</span>
    </div>
  )
}

export default function Tilini() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [kuolinpesa, setKuolinpesa] = useState(null)
  const [avattuOsio, setAvattuOsio] = useState(null)

  const [salasana, setSalasana] = useState({ nykyinen: '', uusi: '', vahvistus: '' })
  const [salasanaLataa, setSalasanaLataa] = useState(false)
  const [salasanaVirhe, setSalasanaVirhe] = useState('')
  const [salasanaOnnistui, setSalasanaOnnistui] = useState(false)

  const [poistoVaihe, setPoistoVaihe] = useState('nappi')
  const [poistoSalasana, setPoistoSalasana] = useState('')
  const [poistoLataa, setPoistoLataa] = useState(false)
  const [poistoVirhe, setPoistoVirhe] = useState('')

  useEffect(() => {
    const haeData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/kirjaudu'); return }
      setUser(user)
      const { data } = await supabase.from('kuolinpesat').select('*').eq('kayttaja_email', user.email).not('vainajan_nimi', 'is', null).neq('vainajan_nimi', '').order('created_at', { ascending: false }).limit(1).single()
      if (data) setKuolinpesa(data)
    }
    haeData()
  }, [])

  const toggleOsio = (id) => setAvattuOsio(prev => prev === id ? null : id)

  const poistaTili = async () => {
    setPoistoVirhe('')
    setPoistoLataa(true)
    const { error: kirjautumisVirhe } = await supabase.auth.signInWithPassword({ email: user.email, password: poistoSalasana })
    if (kirjautumisVirhe) { setPoistoVirhe('Väärä salasana.'); setPoistoLataa(false); return }
    const res = await fetch('/api/delete-account', { method: 'DELETE' })
    if (!res.ok) { setPoistoVirhe('Jokin meni pieleen. Yritä uudelleen.'); setPoistoLataa(false); return }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const vaihdaSalasana = async () => {
    setSalasanaVirhe('')
    setSalasanaOnnistui(false)
    if (salasana.uusi !== salasana.vahvistus) { setSalasanaVirhe('Uudet salasanat eivät täsmää.'); return }
    if (salasana.uusi.length < 8) { setSalasanaVirhe('Salasanan tulee olla vähintään 8 merkkiä.'); return }
    setSalasanaLataa(true)
    const { error: kirjautumisVirhe } = await supabase.auth.signInWithPassword({ email: user.email, password: salasana.nykyinen })
    if (kirjautumisVirhe) { setSalasanaVirhe('Nykyinen salasana on väärä.'); setSalasanaLataa(false); return }
    const { error } = await supabase.auth.updateUser({ password: salasana.uusi })
    setSalasanaLataa(false)
    if (error) { setSalasanaVirhe('Virhe: ' + error.message); return }
    setSalasanaOnnistui(true)
    setSalasana({ nykyinen: '', uusi: '', vahvistus: '' })
  }

  const inputStyle = {
    width: '100%', background: 'rgba(240,235,227,0.03)',
    border: '1px solid rgba(240,235,227,0.08)', color: C.text,
    fontFamily: 'var(--font-body), sans-serif', fontSize: '14px',
    padding: '10px 14px', outline: 'none', colorScheme: 'dark',
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-body), sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>

        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: C.secondary, cursor: 'pointer', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '48px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Takaisin
        </button>

        <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, opacity: 0.7, marginBottom: '10px' }}>Hallinta</div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '40px' }}>Tilini</h1>

        <div style={{ backgroundColor: C.card, border: `1px solid ${C.borderWarm}` }}>

          {/* 1. Profiili */}
          <Osio id="profiili" otsikko="Profiili" avattu={avattuOsio === 'profiili'} onToggle={toggleOsio}>
            <Rivi label="Nimi" arvo={[user?.user_metadata?.etunimi, user?.user_metadata?.sukunimi].filter(Boolean).join(' ') || null} />
            <Rivi label="Sähköposti" arvo={user?.email} />
            <Rivi label="Tili luotu" arvo={user?.created_at ? new Date(user.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
          </Osio>

          {/* 2. Turvallisuus */}
          <Osio id="turvallisuus" otsikko="Turvallisuus" avattu={avattuOsio === 'turvallisuus'} onToggle={toggleOsio}>
            <div style={{ padding: '4px 24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { kentta: 'nykyinen', label: 'Nykyinen salasana' },
                { kentta: 'uusi', label: 'Uusi salasana' },
                { kentta: 'vahvistus', label: 'Vahvista uusi salasana' },
              ].map(({ kentta, label }) => (
                <div key={kentta}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary, marginBottom: '6px' }}>{label}</div>
                  <input
                    type="password"
                    value={salasana[kentta]}
                    onChange={e => setSalasana(prev => ({ ...prev, [kentta]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}

              {salasanaVirhe && <p style={{ fontSize: '12px', color: '#e07070', margin: 0 }}>{salasanaVirhe}</p>}
              {salasanaOnnistui && <p style={{ fontSize: '12px', color: '#7ec994', margin: 0 }}>Salasana vaihdettu onnistuneesti.</p>}

              <button
                onClick={vaihdaSalasana}
                disabled={salasanaLataa || !salasana.nykyinen || !salasana.uusi || !salasana.vahvistus}
                style={{
                  alignSelf: 'flex-start', background: 'none',
                  border: `1px solid rgba(201,168,76,0.3)`, color: C.accent,
                  cursor: 'pointer', padding: '10px 20px',
                  fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', transition: 'border-color 0.2s, background 0.2s',
                  opacity: (salasanaLataa || !salasana.nykyinen || !salasana.uusi || !salasana.vahvistus) ? 0.4 : 1,
                }}
              >
                {salasanaLataa ? 'Vaihdetaan...' : 'Vaihda salasana'}
              </button>
            </div>
          </Osio>

          {/* 3. Kuolinpesä */}
          <Osio id="kuolinpesa" otsikko="Kuolinpesä" avattu={avattuOsio === 'kuolinpesa'} onToggle={toggleOsio}>
            <Rivi label="Vainajan nimi" arvo={kuolinpesa?.vainajan_nimi} />
            <Rivi label="Kuolinpäivä" arvo={kuolinpesa?.kuolinpaiva ? new Date(kuolinpesa.kuolinpaiva).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary }}>Pesän ID</span>
              <span style={{ fontSize: '11px', color: '#3A3630', fontFamily: 'monospace' }}>{kuolinpesa?.id || '—'}</span>
            </div>
          </Osio>

          {/* 4. Tilin hallinta */}
          <Osio id="tilinhallinta" otsikko="Tilin hallinta" avattu={avattuOsio === 'tilinhallinta'} onToggle={toggleOsio}>
            <div style={{ padding: '4px 24px 20px' }}>
              {poistoVaihe === 'nappi' && (
                <>
                  <p style={{ fontSize: '13px', color: C.secondary, lineHeight: 1.7, marginBottom: '16px' }}>
                    Tilin poistaminen poistaa kaikki tietosi pysyvästi. Tätä toimintoa ei voi peruuttaa.
                  </p>
                  <button onClick={() => setPoistoVaihe('vahvistus')} style={{
                    background: 'none', border: '1px solid rgba(224,112,112,0.3)',
                    color: '#e07070', cursor: 'pointer', padding: '10px 20px',
                    fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
                  }}>
                    Poista tili
                  </button>
                </>
              )}

              {poistoVaihe === 'vahvistus' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '13px', color: C.secondary, lineHeight: 1.7, margin: 0 }}>
                    Vahvista poistaminen kirjoittamalla salasanasi.
                  </p>
                  <input
                    type="password"
                    placeholder="Salasanasi"
                    value={poistoSalasana}
                    onChange={e => setPoistoSalasana(e.target.value)}
                    style={inputStyle}
                    autoFocus
                  />
                  {poistoVirhe && <p style={{ fontSize: '12px', color: '#e07070', margin: 0 }}>{poistoVirhe}</p>}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={poistaTili}
                      disabled={poistoLataa || !poistoSalasana}
                      style={{
                        background: 'none', border: '1px solid rgba(224,112,112,0.5)',
                        color: '#e07070', cursor: 'pointer', padding: '10px 20px',
                        fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
                        opacity: (poistoLataa || !poistoSalasana) ? 0.4 : 1,
                      }}
                    >
                      {poistoLataa ? 'Poistetaan...' : 'Vahvista poisto'}
                    </button>
                    <button
                      onClick={() => { setPoistoVaihe('nappi'); setPoistoSalasana(''); setPoistoVirhe('') }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: C.secondary, fontFamily: 'var(--font-body)',
                      }}
                    >
                      Peruuta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Osio>

        </div>
      </div>
    </div>
  )
}
