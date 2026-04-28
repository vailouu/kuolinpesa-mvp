'use client'
import { useRouter } from 'next/navigation'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
}

export default function Tietosuoja() {
  const router = useRouter()

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--font-body), sans-serif' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>

        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: C.secondary, cursor: 'pointer', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '48px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Takaisin
        </button>

        <div style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, opacity: 0.7, marginBottom: '12px' }}>
          Juridinen
        </div>
        <h1 style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '36px', fontWeight: 300, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Tietosuojaseloste
        </h1>
        <p style={{ fontSize: '12px', color: C.secondary, marginBottom: '48px' }}>
          Päivitetty viimeksi: —
        </p>

        <div style={{ padding: '40px', background: 'rgba(240,235,227,0.03)', border: '1px solid rgba(240,235,227,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: C.secondary, lineHeight: 1.8 }}>
            Tietosuojaselosteen sisältö päivitetään ennen palvelun julkaisua.
          </p>
        </div>

      </div>
    </div>
  )
}
