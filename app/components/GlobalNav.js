'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../supabase'

export default function GlobalNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [kayttaja, setKayttaja] = useState(null)
  const [dropdownAuki, setDropdownAuki] = useState(false)

  useEffect(() => {
    const haeKayttaja = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKayttaja(user)
    }
    haeKayttaja()
  }, [])

  useEffect(() => {
    const suljeDropdown = (e) => {
      if (!e.target.closest('[data-dropdown]')) setDropdownAuki(false)
    }
    document.addEventListener('mousedown', suljeDropdown)
    return () => document.removeEventListener('mousedown', suljeDropdown)
  }, [])

  if (!kayttaja) return null

  return (
    <div data-dropdown style={{ position: 'relative' }}>
      <div
        onClick={() => setDropdownAuki(prev => !prev)}
        style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 'bold', color: '#0F1E3C', cursor: 'pointer', border: '2px solid #C9A84C', userSelect: 'none', fontFamily: 'Georgia, serif' }}>
        {(kayttaja.email || '')[0]?.toUpperCase() || ''}
      </div>

      {dropdownAuki && (
        <div style={{ position: 'absolute', right: 0, top: '48px', backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C', borderRadius: '10px', width: '240px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2D3E5C' }}>
            <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{kayttaja.email}</div>
          </div>
          <div
            onClick={() => { setDropdownAuki(false); router.push('/dashboard') }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', cursor: 'pointer', borderBottom: '1px solid #152238' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.08)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <span style={{ color: '#A0AEC0', fontSize: '13px', fontFamily: 'Georgia, serif' }}>Dashboard</span>
          </div>
          <div
            onClick={async () => { setDropdownAuki(false); await supabase.auth.signOut(); router.push('/') }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(252,129,129,0.06)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FC8181" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            <span style={{ color: '#FC8181', fontSize: '13px', fontFamily: 'Georgia, serif' }}>Kirjaudu ulos</span>
          </div>
        </div>
      )}
    </div>
  )
}