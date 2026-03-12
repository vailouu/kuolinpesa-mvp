'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export default function Kirjaudu() {
  const router = useRouter()
  const [tiedot, setTiedot] = useState({ sahkoposti: '', salasana: '' })
  const [virhe, setVirhe] = useState('')
  const [lataa, setLataa] = useState(false)

  const paivita = (kentta, arvo) => {
    setTiedot({...tiedot, [kentta]: arvo})
  }

  const kirjauduSisaan = async () => {
    setLataa(true)
    setVirhe('')
    const { error } = await supabase.auth.signInWithPassword({
      email: tiedot.sahkoposti,
      password: tiedot.salasana
    })
    if (error) {
      setVirhe('Väärä sähköposti tai salasana')
      setLataa(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{backgroundColor: '#0F1E3C'}}>
      
      <div className="w-full max-w-md mb-6">
        <button onClick={() => router.push('/')} style={{color: '#C9A84C'}} className="text-sm hover:opacity-75">
          ← Takaisin etusivulle
        </button>
      </div>

      <div className="w-full max-w-md rounded-lg p-8" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}}>
        
        <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2 text-center">
          — Tervetuloa takaisin —
        </div>
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Kirjaudu sisään
        </h1>

        <div className="flex flex-col gap-5">
          
          <div>
            <label className="text-sm mb-1 block" style={{color: '#A0AEC0'}}>Sähköpostiosoite</label>
            <input
              type="email"
              placeholder="sinun@email.fi"
              value={tiedot.sahkoposti}
              onChange={(e) => paivita('sahkoposti', e.target.value)}
              className="w-full px-4 py-3 rounded text-white placeholder-gray-500 outline-none"
              style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block" style={{color: '#A0AEC0'}}>Salasana</label>
            <input
              type="password"
              placeholder="Salasanasi"
              value={tiedot.salasana}
              onChange={(e) => paivita('salasana', e.target.value)}
              className="w-full px-4 py-3 rounded text-white placeholder-gray-500 outline-none"
              style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}
            />
          </div>

          {virhe && (
            <p className="text-sm text-center" style={{color: '#FC8181'}}>{virhe}</p>
          )}

          <button
            style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}
            className="w-full py-4 font-bold rounded mt-2 hover:opacity-90"
            onClick={kirjauduSisaan}
            disabled={lataa}
          >
            {lataa ? 'Kirjaudutaan...' : 'Kirjaudu sisään →'}
          </button>

        </div>

        <p className="text-center mt-6 text-xs" style={{color: '#4A5568'}}>
          Ei vielä tiliä?{' '}
          <button onClick={() => router.push('/aloita')} style={{color: '#C9A84C'}}>
            Aloita tästä
          </button>
        </p>

      </div>
    </div>
  )
}