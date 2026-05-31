'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export default function DashboardLink() {
  const router = useRouter()
  const [tiliTyyppi, setTiliTyyppi] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setTiliTyyppi(user.user_metadata?.tili_tyyppi || 'kuolinpesa')
    })
  }, [])

  if (!tiliTyyppi) return null

  const kohde = tiliTyyppi === 'valmistelu' ? '/valmistele/dashboard' : '/dashboard'

  return (
    <button
      onClick={() => router.push(kohde)}
      style={{
        position: 'fixed',
        top: '72px',
        right: '56px',
        zIndex: 40,
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        fontFamily: 'var(--font-body), sans-serif',
        fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#C9A84C',
        background: 'rgba(10,8,6,0.82)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(201,168,76,0.28)',
        padding: '9px 18px', cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(10,8,6,0.82)'
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.28)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      Siirry dashboardille
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  )
}
