'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'
export default function Aloita() {
  const router = useRouter()
  const [vaihe, setVaihe] = useState(1)
  const [tiedot, setTiedot] = useState({
    vainajanNimi: '',
    kuolinpaiva: '',
    sahkoposti: '',
    salasana: ''
  })

  const paivita = (kentta, arvo) => {
    setTiedot({...tiedot, [kentta]: arvo})
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{backgroundColor: '#0F1E3C'}}>
      
      {/* Takaisin-linkki */}
      <div className="w-full max-w-md mb-6">
        <button onClick={() => router.push('/')} style={{color: '#C9A84C'}} className="text-sm hover:opacity-75">
          ← Takaisin etusivulle
        </button>
      </div>

      {/* Kortti */}
      <div className="w-full max-w-md rounded-lg p-8" style={{backgroundColor: '#1B2A4A', border: '1px solid #C9A84C'}}>
        
        <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2 text-center">
          — Uusi kuolinpesä —
        </div>
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Aloita kuolinpesän hoito
        </h1>

        {/* Lomake */}
        <div className="flex flex-col gap-5">
          
          <div>
            <label className="text-sm mb-1 block" style={{color: '#A0AEC0'}}>Vainajan nimi *</label>
            <input
              type="text"
              placeholder="Etunimi Sukunimi"
              value={tiedot.vainajanNimi}
              onChange={(e) => paivita('vainajanNimi', e.target.value)}
              className="w-full px-4 py-3 rounded text-white placeholder-gray-500 outline-none"
              style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block" style={{color: '#A0AEC0'}}>Kuolinpäivä <span style={{color: '#4A5568'}}>(valinnainen)</span></label>
            <input
              type="date"
              value={tiedot.kuolinpaiva}
              onChange={(e) => paivita('kuolinpaiva', e.target.value)}
              className="w-full px-4 py-3 rounded text-white outline-none"
              style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block" style={{color: '#A0AEC0'}}>Sähköpostiosoitteesi *</label>
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
            <label className="text-sm mb-1 block" style={{color: '#A0AEC0'}}>Salasana *</label>
            <input
              type="password"
              placeholder="Vähintään 8 merkkiä"
              value={tiedot.salasana}
              onChange={(e) => paivita('salasana', e.target.value)}
              className="w-full px-4 py-3 rounded text-white placeholder-gray-500 outline-none"
              style={{backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C'}}
            />
          </div>

          <button
            style={{backgroundColor: '#C9A84C', color: '#0F1E3C'}}
            className="w-full py-4 font-bold rounded mt-2 hover:opacity-90"
            onClick={async () => {
  const { error: authError } = await supabase.auth.signUp({
  email: tiedot.sahkoposti,
  password: tiedot.salasana
})
if (authError) {
  alert('Virhe: ' + authError.message)
  return
}

const { error } = await supabase
  .from('kuolinpesat')
  .insert({
    vainajan_nimi: tiedot.vainajanNimi,
    kuolinpaiva: tiedot.kuolinpaiva || null,
    kayttaja_email: tiedot.sahkoposti
  })
if (error) {
  alert('Virhe: ' + error.message)
} else {
  router.push('/dashboard')
}
}}
          >
            Luo kuolinpesä →
          </button>

        </div>

        <p className="text-center mt-6 text-s" style={{color: '#4A5568'}}>
          Tietosi ovat turvassa. Emme jaa tietojasi kolmansille osapuolille.
        </p>

      </div>
    </div>
  )
}