'use client'

export default function BackgroundGlow() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      zIndex: 0, pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* Vasen yläkulma — lämmin kulta */}
      <div style={{
        position: 'absolute',
        top: '-18%', left: '-12%',
        width: '55vw', height: '55vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.025) 45%, transparent 70%)',
        animation: 'glowPulseA 14s ease-in-out infinite',
        transformOrigin: 'center',
      }} />

      {/* Oikea alakulma — hivenen viileämpi, pienempi */}
      <div style={{
        position: 'absolute',
        bottom: '-20%', right: '-10%',
        width: '45vw', height: '45vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.055) 0%, rgba(201,168,76,0.018) 45%, transparent 70%)',
        animation: 'glowPulseB 18s ease-in-out infinite',
        transformOrigin: 'center',
      }} />

      {/* Keskellä hyvin halea — syvyyttä */}
      <div style={{
        position: 'absolute',
        top: '35%', left: '38%',
        width: '30vw', height: '30vw',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.025) 0%, transparent 65%)',
        animation: 'glowPulseC 22s ease-in-out infinite',
        transformOrigin: 'center',
      }} />
    </div>
  )
}
