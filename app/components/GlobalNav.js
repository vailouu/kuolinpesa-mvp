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

export default function GlobalNav() {
  const router = useRouter()
  const [kayttaja, setKayttaja] = useState(null)
  const [auki, setAuki] = useState(false)
  const [asetuksetAuki, setAsetuksetAuki] = useState(false)

  useEffect(() => {
    const haeKayttaja = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKayttaja(user)
    }
    haeKayttaja()
  }, [])

  useEffect(() => {
    const sulje = (e) => {
      if (!e.target.closest('[data-dropdown]')) setAuki(false)
    }
    document.addEventListener('mousedown', sulje)
    return () => document.removeEventListener('mousedown', sulje)
  }, [])

  if (!kayttaja) return null

  const initial = (kayttaja.email || '')[0]?.toUpperCase() || '?'

  const menuItems = [
    {
      label: 'Pesäni',
      sub: 'Dashboard',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>,
      onClick: () => { setAuki(false); router.push('/dashboard') },
      danger: false,
    },
    {
      label: 'Asetukset',
      sub: null,
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
      onClick: () => setAsetuksetAuki(prev => !prev),
      danger: false,
      alakohdat: [
        { label: 'Tilini', onClick: () => { setAuki(false); setAsetuksetAuki(false); router.push('/asetukset/tilini') } },
      ],
    },
    {
      label: 'Kirjaudu ulos',
      sub: null,
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,227,0.35)" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
      onClick: async () => { setAuki(false); await supabase.auth.signOut(); router.push('/') },
      danger: true,
    },
  ]

  return (
    <div data-dropdown style={{ position: 'relative' }}>

      {/* Avatar */}
      <button
        onClick={() => setAuki(prev => !prev)}
        style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: auki ? 'rgba(201,168,76,0.12)' : 'transparent',
          border: `1px solid ${auki ? 'rgba(201,168,76,0.5)' : C.borderWarm}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: '500',
          color: C.accent,
          cursor: 'pointer',
          fontFamily: 'var(--font-body), sans-serif',
          letterSpacing: '0.05em',
          boxShadow: auki ? '0 0 18px rgba(201,168,76,0.25)' : 'none',
          transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          if (!auki) {
            e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
            e.currentTarget.style.boxShadow = '0 0 18px rgba(201,168,76,0.3)'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
          }
        }}
        onMouseLeave={e => {
          if (!auki) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = C.borderWarm
          }
        }}
      >
        {initial}
      </button>

      {/* Dropdown */}
      {auki && (
        <div style={{
          position: 'absolute',
          right: 0, top: '44px',
          width: '220px',
          background: '#0E0B08',
          border: `1px solid ${C.borderWarm}`,
          boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.05)',
          overflow: 'hidden',
          animation: 'dropIn 0.18s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* Email header */}
          <div style={{
            padding: '14px 18px 12px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{
              fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: C.secondary, fontFamily: 'var(--font-body), sans-serif',
            }}>
              {kayttaja.email}
            </div>
          </div>

          {/* Menu items */}
          {menuItems.map((item, i) => (
            <div key={i}>
              <div
                onClick={item.onClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: '13px',
                  padding: '13px 18px',
                  cursor: 'pointer',
                  borderBottom: (!item.alakohdat || !asetuksetAuki) && i < menuItems.length - 1 ? `1px solid ${C.border}` : 'none',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = item.danger ? 'rgba(240,235,227,0.03)' : 'rgba(201,168,76,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0, opacity: item.danger ? 0.5 : 1 }}>{item.icon}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-body), sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: item.danger ? C.secondary : C.text }}>
                  {item.label}
                </span>
                {item.alakohdat && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="2" style={{ transition: 'transform 0.2s', transform: asetuksetAuki ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                )}
              </div>

              {item.alakohdat && asetuksetAuki && (
                <div style={{ borderBottom: `1px solid ${C.border}` }}>
                  {item.alakohdat.map((alakohta, j) => (
                    <div
                      key={j}
                      onClick={alakohta.onClick}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px 10px 44px', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.secondary }}>
                        {alakohta.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
