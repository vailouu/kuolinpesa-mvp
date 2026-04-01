'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

const C = {
  bg: '#0E0B08',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
  borderWarm: 'rgba(201,168,76,0.18)',
}

function paivaaSitten(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min} min sitten`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} t sitten`
  return `${Math.floor(h / 24)} pv sitten`
}

export default function NotificationBell() {
  const [auki, setAuki] = useState(false)
  const [ilmoitukset, setIlmoitukset] = useState([])
  const [luettu, setLuettu] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const hae = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const lista = []

      // Hae kuolinpesät
      const { data: pesat } = await supabase
        .from('kuolinpesat')
        .select('id, vainajan_nimi, kuolinpaiva')
        .eq('kayttaja_id', user.id)

      if (pesat?.length) {
        const pesa = pesat[0]

        // Perunkirjoitus-muistutus (90 pv kuolemasta)
        if (pesa.kuolinpaiva) {
          const kuolema = new Date(pesa.kuolinpaiva)
          const deadline = new Date(kuolema)
          deadline.setDate(deadline.getDate() + 90)
          const paiviaJaljella = Math.floor((deadline - Date.now()) / 86400000)

          if (paiviaJaljella <= 30 && paiviaJaljella > 0) {
            lista.push({
              id: 'deadline-perunkirjoitus',
              tyyppi: 'varoitus',
              otsikko: 'Perunkirjoituksen deadline lähestyy',
              teksti: `${paiviaJaljella} päivää jäljellä — ${deadline.toLocaleDateString('fi-FI')} mennessä.`,
              aika: null,
            })
          } else if (paiviaJaljella <= 0) {
            lista.push({
              id: 'deadline-ylitetty',
              tyyppi: 'kiireellinen',
              otsikko: 'Perunkirjoituksen määräaika on ylitetty',
              teksti: 'Ota yhteyttä lakimieheen mahdollisimman pian.',
              aika: null,
            })
          }
        }

        // Valmiit tehtävät (viimeiset 3)
        const { data: valmiit } = await supabase
          .from('tehtavat')
          .select('id, nimi, updated_at')
          .eq('kuolinpesa_id', pesa.id)
          .eq('tehty', true)
          .order('updated_at', { ascending: false })
          .limit(3)

        if (valmiit?.length) {
          valmiit.forEach(t => {
            lista.push({
              id: `tehty-${t.id}`,
              tyyppi: 'info',
              otsikko: 'Tehtävä merkitty valmiiksi',
              teksti: t.nimi,
              aika: t.updated_at,
            })
          })
        }
      }

      setIlmoitukset(lista)
    }

    hae()
  }, [])

  useEffect(() => {
    const sulje = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAuki(false)
    }
    document.addEventListener('mousedown', sulje)
    return () => document.removeEventListener('mousedown', sulje)
  }, [])

  const lukematon = ilmoitukset.length > 0 && !luettu

  const ikonit = {
    varoitus: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    kiireellinen: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E07070" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    info: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,235,227,0.35)" strokeWidth="1.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Kellokuvake */}
      <button
        onClick={() => { setAuki(prev => !prev); setLuettu(true) }}
        style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: auki ? 'rgba(201,168,76,0.08)' : 'transparent',
          border: `1px solid ${auki ? 'rgba(201,168,76,0.4)' : C.borderWarm}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
          boxShadow: auki ? '0 0 18px rgba(201,168,76,0.2)' : 'none',
        }}
        onMouseEnter={e => {
          if (!auki) {
            e.currentTarget.style.background = 'rgba(201,168,76,0.06)'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
            e.currentTarget.style.boxShadow = '0 0 14px rgba(201,168,76,0.2)'
          }
        }}
        onMouseLeave={e => {
          if (!auki) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = C.borderWarm
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#C9A84C" strokeWidth="1.5"
>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {/* Badge */}
        {lukematon && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: '#C9A84C',
            border: '1.5px solid #0A0806',
            animation: 'badgePulse 2s ease-in-out infinite',
          }} />
        )}
      </button>

      {/* Dropdown */}
      {auki && (
        <div style={{
          position: 'absolute',
          right: 0, top: '44px',
          width: '300px',
          background: '#0E0B08',
          border: `1px solid ${C.borderWarm}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.04)',
          overflow: 'hidden',
          animation: 'dropIn 0.18s cubic-bezier(0.22,1,0.36,1) both',
          zIndex: 100,
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px 12px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: C.secondary, fontFamily: 'var(--font-body), sans-serif',
            }}>Ilmoitukset</span>
            {ilmoitukset.length > 0 && (
              <span style={{
                fontSize: '9px', letterSpacing: '0.1em',
                color: C.accent, opacity: 0.7,
                fontFamily: 'var(--font-body), sans-serif',
              }}>{ilmoitukset.length} uutta</span>
            )}
          </div>

          {/* Lista */}
          {ilmoitukset.length === 0 ? (
            <div style={{
              padding: '28px 18px', textAlign: 'center',
              fontSize: '11px', color: C.secondary,
              fontFamily: 'var(--font-body), sans-serif',
              letterSpacing: '0.05em',
            }}>
              Ei uusia ilmoituksia
            </div>
          ) : (
            ilmoitukset.map((ilm, i) => (
              <div key={ilm.id} style={{
                padding: '14px 18px',
                borderBottom: i < ilmoitukset.length - 1 ? `1px solid ${C.border}` : 'none',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,235,227,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ flexShrink: 0, marginTop: '1px', opacity: 0.9 }}>
                  {ikonit[ilm.tyyppi]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px', letterSpacing: '0.04em',
                    color: ilm.tyyppi === 'kiireellinen' ? 'rgba(224,112,112,0.9)' : C.text,
                    fontFamily: 'var(--font-body), sans-serif',
                    marginBottom: '3px', lineHeight: 1.4,
                  }}>{ilm.otsikko}</div>
                  <div style={{
                    fontSize: '10px', color: C.secondary,
                    fontFamily: 'var(--font-body), sans-serif',
                    lineHeight: 1.5, letterSpacing: '0.02em',
                  }}>{ilm.teksti}</div>
                  {ilm.aika && (
                    <div style={{
                      fontSize: '9px', color: '#3A3530',
                      fontFamily: 'var(--font-body), sans-serif',
                      marginTop: '4px', letterSpacing: '0.05em',
                    }}>{paivaaSitten(ilm.aika)}</div>
                  )}
                </div>
              </div>
            ))
          )}

        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50% { box-shadow: 0 0 0 4px rgba(201,168,76,0); }
        }
      `}</style>
    </div>
  )
}
