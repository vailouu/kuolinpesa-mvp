'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const C = {
  bg: '#111009',
  card: '#0D0B09',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.15)',
}

export default function Asetukset() {
  const router = useRouter()
  const [ladataan, setLadataan] = useState(true)

  useEffect(() => {
    const tarkista = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/kirjaudu'); return }
      setLadataan(false)
    }
    tarkista()
  }, [])

  if (ladataan) return null

  const kategoriat = [
    {
      id: 'tilini',
      otsikko: 'Tilini',
      kuvaus: 'Sähköposti ja kirjautumistiedot',
      ikoni: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
      polku: '/asetukset/tilini',
    },
  ]

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-body), sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>

        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: C.secondary, cursor: 'pointer', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '48px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Takaisin
        </button>

        <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, opacity: 0.7, marginBottom: '10px' }}>Hallinta</div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '40px' }}>Asetukset</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'rgba(201,168,76,0.2)' }}>
          {kategoriat.map(k => (
            <button
              key={k.id}
              onClick={() => router.push(k.polku)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: C.card, padding: '20px 24px',
                border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#111009'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = C.card}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: C.accent }}>{k.ikoni}</div>
                <div>
                  <div style={{ fontSize: '14px', color: C.text, marginBottom: '2px' }}>{k.otsikko}</div>
                  <div style={{ fontSize: '11px', color: C.secondary }}>{k.kuvaus}</div>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: C.secondary, flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
