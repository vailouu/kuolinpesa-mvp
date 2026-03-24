'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export default function Home() {
  const router = useRouter()
const [kirjautunut, setKirjautunut] = useState(false)

useEffect(() => {
  const tarkistaKirjautuminen = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setKirjautunut(true)
  }
  tarkistaKirjautuminen()
}, [])

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0F1E3C'}}>
<div className="px-8 pt-6">
  <button onClick={() => router.push('/')} style={{color: '#C9A84C'}} className="text-sm hover:opacity-75">
    ← Takaisin etusivulle
  </button>
</div>
      <nav style={{borderBottom: '1px solid #C9A84C'}} className="px-8 py-4 flex items-center justify-between">
        <div style={{color: '#C9A84C'}} className="text-xl font-bold tracking-widest uppercase">
          Pesänhoitaja
        </div>
      {kirjautunut ? (
  <button onClick={() => router.push('/dashboard')} style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} className="px-5 py-2 text-sm font-bold rounded">
    Siirry dashboardille →
  </button>
) : (
  <a href="/kirjaudu" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} className="px-5 py-2 text-sm font-bold rounded">
    Kirjaudu sisään
  </a>
)}
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-6 py-24">

        <div style={{color: '#C9A84C', letterSpacing: '4px'}} className="text-sm uppercase mb-6">
          — Valitse, miten aloitat —
        </div>

        <h1 className="text-white text-5xl font-bold mb-4 max-w-2xl leading-tight">
Miten voimme
auttaa sinua tänään?
        </h1>
     

        <p style={{color: '#A0AEC0'}} className="text-lg max-w-2xl mb-16 leading-relaxed">
          Valitse tilanteeseesi sopiva polku. Voit aloittaa kuolinpesän hoidon, valmistella tietoja läheisillesi etukäteen, tai avata vainajan valmiiksi kokoamat tiedot.
        </p>

        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl md:grid-cols-3">

          <div style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}} className="rounded-lg p-8 flex flex-col items-center text-center">
            <div style={{color: '#C9A84C'}} className="text-4xl mb-4">📋</div>
            <h2 className="text-white text-xl font-bold mb-3">Aloita kuolinpesän hoito</h2>
            <p style={{color: '#A0AEC0'}} className="text-sm mb-6">Läheinen on menehtynyt ja haluat aloittaa asioiden hoitamisen.</p>
            <a href="/aloita" style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} className="w-full py-3 font-bold rounded block text-center">
              Aloita tästä →
            </a>
          </div>

          <div style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}} className="rounded-lg p-8 flex flex-col items-center text-center">
            <div style={{color: '#C9A84C'}} className="text-4xl mb-4">🕊️</div>
            <h2 className="text-white text-xl font-bold mb-3">Valmistele asioita läheisillesi</h2>
            <p style={{color: '#A0AEC0'}} className="text-sm mb-6">Haluat helpottaa läheistesi taakkaa valmistelemalla tiedot etukäteen.</p>
            <button style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} className="w-full py-3 font-bold rounded">
              Valmistele →
            </button>
          </div>

          <div style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}} className="rounded-lg p-8 flex flex-col items-center text-center">
            <div style={{color: '#C9A84C'}} className="text-4xl mb-4">🔓</div>
            <h2 className="text-white text-xl font-bold mb-3">Aktivoi kuolinpesätila</h2>
            <p style={{color: '#A0AEC0'}} className="text-sm mb-6">Vainaja on valmistellut tiedot etukäteen — avaa ne nyt.</p>
            <button style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}} className="w-full py-3 font-bold rounded">
              Aktivoi →
            </button>
          </div>

        </div>
      </div>

      <div style={{borderTop: '1px solid #2D3748', color: '#4A5568'}} className="text-center py-6 text-sm">
        © 2025 Pesänhoitaja — Kaikki oikeudet pidätetään
      </div>

    </div>
  )
}