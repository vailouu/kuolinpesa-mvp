'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [aktiivisuVaihe, setAktiivinenVaihe] = useState(1)

  const vaiheet = [
    { numero: 1, nimi: 'Ensitoimet' },
    { numero: 2, nimi: 'Selvitys' },
    { numero: 3, nimi: 'Perunkirjoitus' },
    { numero: 4, nimi: 'Hoito' },
    { numero: 5, nimi: 'Päätös' },
  ]

  const tehtavat = [
    { id: 1, nimi: 'Ilmoita kuolemasta Digi- ja väestötietovirastolle', vaihe: 1, tehty: false },
    { id: 2, nimi: 'Järjestä perunkirjoitus', vaihe: 1, tehty: false },
    { id: 3, nimi: 'Ilmoita pankeille', vaihe: 1, tehty: false },
    { id: 4, nimi: 'Tarkista vakuutukset', vaihe: 1, tehty: false },
    { id: 5, nimi: 'Irtisano palvelusopimukset', vaihe: 2, tehty: false },
    { id: 6, nimi: 'Selvitä varat ja velat', vaihe: 2, tehty: false },
  ]

  const [tehtavaLista, setTehtavaLista] = useState(tehtavat)

  const merkitseTehdyksi = (id) => {
    setTehtavaLista(tehtavaLista.map(t => 
      t.id === id ? {...t, tehty: !t.tehty} : t
    ))
  }

  const nykyisetTehtavat = tehtavaLista.filter(t => t.vaihe === aktiivisuVaihe)
  const valmiit = tehtavaLista.filter(t => t.tehty).length
  const kaikki = tehtavaLista.length

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0F1E3C'}}>

      {/* Navigaatio */}
      <nav style={{borderBottom: '1px solid #C9A84C'}} className="px-8 py-4 flex items-center justify-between">
        <div style={{color: '#C9A84C'}} className="text-xl font-bold tracking-widest uppercase">
          Pesänhoitaja
        </div>
        <div className="text-white text-sm">
          Matti Virtanen
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Otsikko */}
        <div className="mb-8">
          <div style={{color: '#C9A84C', letterSpacing: '3px'}} className="text-xs uppercase mb-2">
            — Kuolinpesä —
          </div>
          <h1 className="text-white text-3xl font-bold">Matti Virtanen</h1>
          <p style={{color: '#A0AEC0'}} className="text-sm mt-1">Kuolinpesän hallinta</p>
        </div>

        {/* Edistymispalkki */}
        <div className="mb-10 p-6 rounded-lg" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold">Edistyminen</span>
            <span style={{color: '#C9A84C'}} className="text-sm font-bold">{valmiit}/{kaikki} tehtävää</span>
          </div>
          <div className="w-full rounded-full h-2" style={{backgroundColor: '#0F1E3C'}}>
            <div 
              className="h-2 rounded-full transition-all"
              style={{backgroundColor: '#C9A84C', width: `${(valmiit/kaikki)*100}%`}}
            />
          </div>
        </div>

        {/* Vaihepalkki */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {vaiheet.map(v => (
            <button
              key={v.numero}
              onClick={() => setAktiivinenVaihe(v.numero)}
              className="flex-1 py-3 px-4 rounded text-sm font-bold whitespace-nowrap"
              style={{
                backgroundColor: aktiivisuVaihe === v.numero ? '#C9A84C' : '#1B2A4A',
                color: aktiivisuVaihe === v.numero ? '#0F1E3C' : '#A0AEC0',
                border: '1px solid',
                borderColor: aktiivisuVaihe === v.numero ? '#C9A84C' : '#2D3E5C'
              }}
            >
              {v.numero}. {v.nimi}
            </button>
          ))}
        </div>

        {/* Tehtävälista */}
        <div className="rounded-lg p-6" style={{backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C'}}>
          <h2 className="text-white font-bold text-lg mb-6">
            Vaihe {aktiivisuVaihe}: {vaiheet[aktiivisuVaihe-1].nimi}
          </h2>

          {nykyisetTehtavat.length === 0 ? (
            <p style={{color: '#4A5568'}} className="text-sm">Ei tehtäviä tässä vaiheessa vielä.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {nykyisetTehtavat.map(tehtava => (
                <div
                  key={tehtava.id}
                  onClick={() => merkitseTehdyksi(tehtava.id)}
                  className="flex items-center gap-4 p-4 rounded cursor-pointer hover:opacity-80"
                  style={{backgroundColor: '#0F1E3C', border: `1px solid ${tehtava.tehty ? '#C9A84C' : '#2D3E5C'}`}}
                >
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: tehtava.tehty ? '#C9A84C' : 'transparent',
                      border: `2px solid ${tehtava.tehty ? '#C9A84C' : '#4A5568'}`
                    }}
                  >
                    {tehtava.tehty && <span style={{color: '#0F1E3C'}} className="text-xs font-bold">✓</span>}
                  </div>
                  <span 
                    className="text-sm"
                    style={{
                      color: tehtava.tehty ? '#C9A84C' : 'white',
                      textDecoration: tehtava.tehty ? 'line-through' : 'none'
                    }}
                  >
                    {tehtava.nimi}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}