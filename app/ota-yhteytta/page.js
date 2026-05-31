'use client'
import { useRouter } from 'next/navigation'
import GlobalNav from '../components/GlobalNav'
import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

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

  .top-bar {
    position: fixed; top: 0; left: 0; right: 0;
    display: flex; align-items: center; gap: 36px;
    padding: 0 56px; height: 60px; z-index: 50;
    border-bottom: 1px solid rgba(201,168,76,0.18);
  }
  .nav-logo {
    font-size: 11px; font-weight: 500; letter-spacing: 0.22em;
    text-transform: uppercase; color: ${C.text};
    cursor: pointer; background: none; border: none;
    font-family: var(--font-body), sans-serif;
  }
  .nav-item {
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.secondary}; background: none; border: none; cursor: pointer;
    font-family: var(--font-body), sans-serif; transition: color 0.2s;
  }
  .nav-item:hover { color: ${C.text}; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 24px; }
`

export default function OtaYhteytta() {
  const router = useRouter()
  const [kirjautunut, setKirjautunut] = useState(false)

  useEffect(() => {
    const tarkista = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKirjautunut(true)
    }
    tarkista()
  }, [])

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{css}</style>

      <nav className="top-bar">
        <button className="nav-logo" onClick={() => router.push('/')}>Pesänhoitaja</button>
        <button className="nav-item" onClick={() => router.push('/miten-toimii')}>Miten toimii</button>
        <button className="nav-item" onClick={() => router.push('/kenelle')}>Kenelle</button>
        <button className="nav-item" onClick={() => router.push('/ukk')}>UKK</button>
        <button className="nav-item" onClick={() => router.push('/hinnat')}>Hinnat</button>
        <button className="nav-item" onClick={() => router.push('/ota-yhteytta')} style={{ color: C.text }}>Ota yhteyttä</button>
        <div className="nav-right">
          <button className="nav-item">Suomi</button>
          {kirjautunut ? <GlobalNav /> : (
            <button className="nav-item" onClick={() => router.push('/kirjaudu')}>Kirjaudu sisään</button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '120px 24px 80px' }}>

        <div className="a1" style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: C.accent, opacity: 0.7, marginBottom: '10px' }}>
          Yhteystiedot
        </div>
        <h1 className="a1" style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: '40px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '48px' }}>
          Ota yhteyttä.
        </h1>

        <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'rgba(201,168,76,0.2)' }}>
          {[
            { label: 'Nimi', arvo: 'Tommi Vilo' },
            { label: 'Sähköposti', arvo: 'pesanhoitaja@gmail.com', linkki: 'mailto:pesanhoitaja@gmail.com' },
            { label: 'Puhelin', arvo: '044 987 3142', linkki: 'tel:+358449873142' },
          ].map(({ label, arvo, linkki }) => (
            <div key={label} style={{ backgroundColor: '#0D0B09', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.secondary }}>{label}</span>
              {linkki ? (
                <a href={linkki} style={{ fontSize: '14px', color: C.text, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.accent}
                  onMouseLeave={e => e.currentTarget.style.color = C.text}>
                  {arvo}
                </a>
              ) : (
                <span style={{ fontSize: '14px', color: C.text }}>{arvo}</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
