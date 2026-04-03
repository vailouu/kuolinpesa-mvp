'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

const C = {
  bg: '#111009',
  card: '#0D0B09',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.15)',
}

function Rivi({ label, arvo }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid rgba(240,235,227,0.07)` }}>
      <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary }}>{label}</span>
      <span style={{ fontSize: '14px', color: C.text }}>{arvo || '—'}</span>
    </div>
  )
}

export default function Tilini() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [kuolinpesa, setKuolinpesa] = useState(null)

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

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-body), sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>

        <button onClick={() => router.push('/asetukset')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: C.secondary, cursor: 'pointer', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '48px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Asetukset
        </button>

        <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, opacity: 0.7, marginBottom: '10px' }}>Hallinta</div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '40px' }}>Tilini</h1>

        <div style={{ backgroundColor: C.card, border: `1px solid rgba(201,168,76,0.25)`, marginBottom: '20px' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, padding: '16px 24px 0' }}>Kirjautumistiedot</div>
          <Rivi label="Sähköposti" arvo={user?.email} />
          <Rivi label="Tili luotu" arvo={user?.created_at ? new Date(user.created_at).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
        </div>

        <div style={{ backgroundColor: C.card, border: `1px solid rgba(240,235,227,0.15)` }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, padding: '16px 24px 0' }}>Kuolinpesä</div>
          <Rivi label="Vainajan nimi" arvo={kuolinpesa?.vainajan_nimi} />
          <Rivi label="Kuolinpäivä" arvo={kuolinpesa?.kuolinpaiva ? new Date(kuolinpesa.kuolinpaiva).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(240,235,227,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary }}>Pesän ID</span>
            <span style={{ fontSize: '11px', color: '#3A3630', fontFamily: 'monospace' }}>{kuolinpesa?.id || '—'}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
