'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'
import GlobalNav from './components/GlobalNav'

const C = {
  bg: '#0A0806',
  text: '#F0EBE3',
  secondary: '#7A7268',
  accent: '#C9A84C',
  border: 'rgba(240,235,227,0.06)',
  borderWarm: 'rgba(201,168,76,0.12)',
}

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }

  .a1 { animation: fadeIn  1.2s cubic-bezier(0.22,1,0.36,1) 0.1s  both; }
  .a2 { animation: fadeUp  1.0s cubic-bezier(0.22,1,0.36,1) 0.4s  both; }
  .a3 { animation: fadeUp  1.0s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
  .a4 { animation: fadeUp  0.9s cubic-bezier(0.22,1,0.36,1) 0.7s  both; }
  .a5 { animation: fadeIn  1.0s cubic-bezier(0.22,1,0.36,1) 1.0s  both; }

  /* ── TOP BAR ── */
  .top-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    gap: 36px;
    padding: 0 56px;
    height: 60px;
    z-index: 50;
    border-bottom: 1px solid ${C.border};
  }
  .nav-logo {
    font-family: var(--font-display), Georgia, serif;
    font-size: 19px;
    font-weight: 400;
    letter-spacing: 0.03em;
    color: ${C.text};
    cursor: pointer;
    background: none; border: none;
    transition: color 0.2s ease;
    margin-right: 8px;
    flex-shrink: 0;
  }
  .nav-logo:hover { color: ${C.accent}; }
  .nav-item {
    font-family: var(--font-body), sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${C.secondary};
    cursor: pointer;
    background: none; border: none;
    padding: 0;
    transition: color 0.2s ease;
    white-space: nowrap;
  }
  .nav-item:hover { color: ${C.text}; }
  .nav-item:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 4px; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 32px; }

  /* ── BOTTOM BAR ── */
  .bottom-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 48px;
    z-index: 50;
    border-top: 1px solid ${C.border};
  }
  .bottom-stat {
    font-family: var(--font-body), sans-serif;
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${C.secondary};
  }
  .bottom-stat strong {
    font-family: var(--font-display), Georgia, serif;
    font-size: 13px;
    font-weight: 400;
    color: ${C.text};
    display: block;
    margin-bottom: 2px;
    letter-spacing: 0;
  }

  /* ── PERSPECTIVE FLOOR ── */
  .perspective-scene {
    position: absolute;
    bottom: 60px; left: 0; right: 0;
    height: 42%;
    perspective: 500px;
    pointer-events: none;
    z-index: 3;
  }
  .perspective-floor {
    position: absolute;
    bottom: 0; left: -30%; right: -30%;
    height: 110%;
    transform: rotateX(75deg);
    transform-origin: bottom center;
    background-image:
      linear-gradient(${C.border} 1px, transparent 1px),
      linear-gradient(90deg, ${C.border} 1px, transparent 1px);
    background-size: 72px 72px;
  }
  .floor-fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, ${C.bg} 0%, transparent 35%, ${C.bg} 92%);
  }

  /* ── SERVICE CARDS ── */
  .cards-row {
    position: absolute;
    bottom: 60px; left: 0; right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 14px;
    padding: 0 80px 28px;
    pointer-events: all;
    z-index: 10;
  }
  .service-card {
    background: rgba(18,14,10,0.88);
    border: 1px solid ${C.border};
    padding: 20px 16px;
    cursor: pointer;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    backdrop-filter: blur(12px);
    min-width: 126px;
    position: relative;
    overflow: hidden;
  }
  .service-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .service-card:hover {
    border-color: ${C.borderWarm};
    transform: translateY(-8px) !important;
    box-shadow: 0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1);
  }
  .service-card:hover::before { opacity: 1; }

  .service-card-num {
    font-size: 9px; letter-spacing: 0.2em;
    color: ${C.accent}; opacity: 0.6;
    font-family: var(--font-body), sans-serif;
    margin-bottom: 12px;
  }
  .service-card-title {
    font-family: var(--font-display), Georgia, serif;
    font-size: 13px; font-weight: 400;
    color: ${C.text}; line-height: 1.4;
    margin-bottom: 8px;
  }
  .service-card-sub {
    font-size: 9px; letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${C.secondary};
    font-family: var(--font-body), sans-serif;
  }

  .card-f1 { animation: floatCard 5.5s ease-in-out 0.0s  infinite; }
  .card-f2 { animation: floatCard 5.5s ease-in-out 1.0s  infinite; }
  .card-f3 { animation: floatCard 5.5s ease-in-out 2.0s  infinite; }
  .card-f4 { animation: floatCard 5.5s ease-in-out 3.0s  infinite; }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    color: #0A0806; background: ${C.accent}; border: none;
    padding: 14px 28px; cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .btn-primary:hover {
    background: #d4b55a;
    box-shadow: 0 8px 32px rgba(201,168,76,0.25);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 4px; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-body), sans-serif;
    font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
    color: ${C.secondary}; background: none; border: none;
    padding: 14px 0; cursor: pointer;
    transition: color 0.2s, gap 0.2s;
  }
  .btn-ghost:hover { color: ${C.text}; gap: 12px; }
  .btn-ghost:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 4px; }

  .v-line { width: 1px; height: 28px; background: ${C.border}; flex-shrink: 0; }

  /* ── LETTER RIPPLE ── */
  .letter {
    display: inline-block;
    color: inherit;
    transition: color 0.25s ease, transform 0.25s ease;
    cursor: default;
  }
`

const services = [
  { num: '01', title: 'Ensitoimet',         sub: 'Heti kuoleman jälkeen' },
  { num: '02', title: 'Perunkirjoitus',     sub: 'Omaisuuden inventaario' },
  { num: '03', title: 'Omaisuuden selvitys',sub: 'Varat & velat' },
  { num: '04', title: 'Osakkaat',           sub: 'Yhteistyö & päätökset' },
]
const floatClasses = ['card-f1','card-f2','card-f3','card-f4']

/* ── PARTICLE CANVAS HOOK ── */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = canvas.width  = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf

    // Each particle: position, size, opacity, speed, drift
    const COUNT = 120
    const particles = Array.from({ length: COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.5,        // 0.5–2.3 px
      vy:   -(Math.random() * 0.18 + 0.04),   // slow upward
      vx:   (Math.random() - 0.5) * 0.06,     // gentle horizontal drift
      op:   Math.random() * 0.55 + 0.15,      // max opacity 0.15–0.70
      life: Math.random(),                     // 0–1 phase offset
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)

      particles.forEach(p => {
        // pulse opacity gently
        p.life += 0.003
        const pulse = 0.55 + 0.45 * Math.sin(p.life * Math.PI * 2)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        // warm gold tint for larger, near-white for smallest
        const warm = p.r > 0.9
        ctx.fillStyle = warm
          ? `rgba(201,168,76,${p.op * pulse})`
          : `rgba(240,235,227,${p.op * pulse * 0.7})`
        ctx.fill()

        // move
        p.x += p.vx
        p.y += p.vy

        // slight horizontal wander
        p.vx += (Math.random() - 0.5) * 0.004

        // wrap: when particle leaves top, respawn at bottom
        if (p.y < -4) {
          p.y = H + 4
          p.x = Math.random() * W
          p.vx = (Math.random() - 0.5) * 0.06
        }
        if (p.x < -4)  p.x = W + 4
        if (p.x > W+4) p.x = -4
      })

      raf = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [canvasRef])
}

export default function Home() {
  const router = useRouter()
  const [kirjautunut, setKirjautunut] = useState(false)
  const canvasRef = useRef(null)
  const heroRef  = useRef(null)
  useParticles(canvasRef)

  const handleLetterMove = (e) => {
    const spans = heroRef.current?.querySelectorAll('.letter')
    if (!spans) return
    spans.forEach(span => {
      const rect = span.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top  + rect.height / 2
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2)
      const intensity = Math.max(0, 1 - dist / 140)
      if (intensity > 0.02) {
        span.style.color     = `rgba(201,168,76,${0.35 + intensity * 0.65})`
        span.style.transform = `translateY(${-intensity * 10}px) scale(${1 + intensity * 0.07})`
      } else {
        span.style.color     = ''
        span.style.transform = ''
      }
    })
  }

  const handleLetterLeave = () => {
    heroRef.current?.querySelectorAll('.letter').forEach(span => {
      span.style.color     = ''
      span.style.transform = ''
    })
  }

  useEffect(() => {
    const tarkista = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKirjautunut(true)
    }
    tarkista()
  }, [])

  return (
    <div style={{
      backgroundColor: C.bg,
      color: C.text,
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      fontFamily: 'var(--font-body), sans-serif',
    }}>
      <style>{css}</style>

      {/* ── PARTICLE CANVAS ── */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── ATMOSPHERE ── */}
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)',
      }} />
      {/* Warm centre-bottom glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 50% 32% at 50% 90%, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }} />
      {/* Top fade so nav sits clean */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '160px',
        pointerEvents: 'none', zIndex: 4,
        background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 100%)`,
      }} />

      {/* ── TOP BAR ── */}
      <nav className="top-bar a1">
        <button className="nav-logo" onClick={() => router.push('/')}>Pesänhoitaja</button>
        <button className="nav-item" onClick={() => router.push('/miten-toimii')}>Miten toimii</button>
        <button className="nav-item" onClick={() => router.push('/hinnat')}>Hinnat</button>
        <div className="nav-right">
          <button className="nav-item">Suomi</button>
          {kirjautunut ? (
            <GlobalNav />
          ) : (
            <button className="btn-primary" onClick={() => router.push('/valitse')}>
              Aloita ilmaiseksi
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO TITLE ── */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '0', right: '0',
        transform: 'translateY(-60%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        zIndex: 10,
      }}>
        <h1
          ref={heroRef}
          className="a2"
          onMouseMove={handleLetterMove}
          onMouseLeave={handleLetterLeave}
          style={{
            fontFamily: 'var(--font-display), Georgia, serif',
            fontSize: 'clamp(64px, 11vw, 170px)',
            fontWeight: 300, lineHeight: 0.88,
            letterSpacing: '-0.03em', textTransform: 'uppercase',
            color: C.text, userSelect: 'none', marginBottom: '28px',
          }}
        >
          {'Pesänhoitaja'.split('').map((char, i) => (
            <span key={i} className="letter">{char}</span>
          ))}
        </h1>

        <p className="a3" style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '14px', lineHeight: 1.85,
          color: C.secondary, maxWidth: '400px',
          fontWeight: 300, marginBottom: '36px',
        }}>
          Kaikki kuolinpesän vaiheet yhdellä alustalla —
          viranomaisista ja pankeista perunkirjoitukseen asti.
        </p>

        <div className="a4" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button className="btn-primary" onClick={() => router.push('/valitse')}>
            Aloita ilmaiseksi
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button className="btn-ghost" onClick={() => router.push('/miten-toimii')}>
            Miten toimii
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── PERSPECTIVE FLOOR ── */}
      <div className="perspective-scene a1">
        <div className="perspective-floor" />
        <div className="floor-fade" />
      </div>

      {/* ── SERVICE CARDS ── */}
      <div className="cards-row a5">
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`service-card ${floatClasses[i]}`}
            onClick={() => router.push('/aloita')}
          >
            <div className="service-card-num">{s.num}</div>
            <div className="service-card-title">{s.title}</div>
            <div className="service-card-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="bottom-bar a5" style={{ zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div className="bottom-stat"><strong>Ilmainen</strong>Ei luottokorttia</div>
          <div className="v-line" />
          <div className="bottom-stat"><strong>Kaikki osakkaalle</strong>Jaettu dashboard</div>
          <div className="v-line" />
          <div className="bottom-stat"><strong>Suomenkielinen</strong>Selkeät ohjeet</div>
        </div>
        <span className="top-bar-label" style={{ opacity: 0.3, fontSize: '9px' }}>
          Inspiraatio: forthetimes.law
        </span>
      </div>

    </div>
  )
}
