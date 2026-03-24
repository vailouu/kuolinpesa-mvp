'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'

export default function Home() {
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
    <div className="min-h-screen" style={{ backgroundColor: '#0F1E3C', fontFamily: 'Georgia, serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #2D3E5C' }} className="px-8 py-5 flex items-center justify-between">
        <div style={{ color: '#C9A84C', letterSpacing: '3px' }} className="text-lg font-bold uppercase tracking-widest">
          Pesänhoitaja
        </div>
        <div className="flex items-center gap-4">
          {kirjautunut ? (
            <button onClick={() => router.push('/dashboard')}
              style={{ backgroundColor: '#C9A84C', color: '#0F1E3C' }}
              className="px-5 py-2 text-sm font-bold rounded">
              Siirry dashboardille →
            </button>
          ) : (
            <>
              <button onClick={() => router.push('/kirjaudu')}
                style={{ color: '#A0AEC0', background: 'none', border: 'none' }}
                className="text-sm hover:opacity-75">
                Kirjaudu
              </button>
              <button onClick={() => router.push('/valitse')}
                style={{ backgroundColor: '#C9A84C', color: '#0F1E3C' }}
                className="px-5 py-2 text-sm font-bold rounded">
                Aloita ilmaiseksi →
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 py-28">
        <div style={{ color: '#C9A84C', letterSpacing: '4px' }} className="text-xs uppercase mb-8">
          — Kuolinpesän hallinta —
        </div>
        <h1 className="text-white font-bold mb-4 leading-tight" style={{ fontSize: '3.5rem', maxWidth: '700px' }}>
          Et voi poistaa surua.
        </h1>
        <h1 style={{ color: '#C9A84C', fontSize: '3.5rem', maxWidth: '700px' }} className="font-bold mb-10 leading-tight">
          Voit poistaa kaaoksen.
        </h1>
        <p style={{ color: '#A0AEC0', maxWidth: '560px', lineHeight: '1.8', fontSize: '1.1rem' }} className="mb-12">
          Kaikki mitä pitää hoitaa yhdellä alustalla — viranomaisista ja pankeista jokaiseen sopimukseen ja vakuutukseen asti. Selkeät ohjeet jokaiseen vaiheeseen.
        </p>
        <button onClick={() => router.push('/valitse')}
          style={{ backgroundColor: '#C9A84C', color: '#0F1E3C', fontSize: '1rem', padding: '1rem 2.5rem' }}
          className="font-bold rounded hover:opacity-90">
          Aloita kuolinpesän hoito →
        </button>
        <p style={{ color: '#4A5568' }} className="text-sm mt-4">Ilmainen · Ei luottokorttia</p>
      </div>

      {/* Miten toimii */}
      <div style={{ borderTop: '1px solid #2D3E5C' }} className="px-8 py-20">
        <p style={{ color: '#C9A84C', letterSpacing: '3px' }} className="text-xs uppercase text-center mb-12">— Miten se toimii —</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { num: '01', otsikko: 'Ensitoimet', teksti: 'Virkatodistus, pankki, Kela, maistraatti — kaikki tarkistuslistana selkeässä järjestyksessä.' },
            { num: '02', otsikko: 'Omaisuuden selvitys', teksti: 'Varat, velat ja sopimukset kartoitetaan kategorioidusti. Ohjeet jokaiseen kohtaan.' },
            { num: '03', otsikko: 'Perunkirjoitus', teksti: 'Sovellus ohjaa sinut läpi perunkirjoituksen ja auttaa generoimaan perukirjapohjan.' },
          ].map(v => (
            <div key={v.num} className="flex flex-col gap-4">
              <div style={{ color: '#C9A84C', fontSize: '2rem', fontFamily: 'Georgia, serif' }}>{v.num}</div>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C' }} />
              <h3 className="text-white font-bold text-lg">{v.otsikko}</h3>
              <p style={{ color: '#A0AEC0', lineHeight: '1.7' }} className="text-sm">{v.teksti}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kenelle */}
      <div style={{ borderTop: '1px solid #2D3E5C', backgroundColor: '#1B2A4A' }} className="px-8 py-20">
        <p style={{ color: '#C9A84C', letterSpacing: '3px' }} className="text-xs uppercase text-center mb-12">— Kenelle —</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { ikoni: '👨‍👩‍👧', teksti: 'Perheille jotka haluavat selvitä ilman asianajajaa tai minimoida sen käytön' },
            { ikoni: '📋', teksti: 'Kaikille joilla on kuolinpesä hoidettavana ensimmäistä kertaa' },
            { ikoni: '🤝', teksti: 'Kuolinpesän osakkaille jotka haluavat tehdä yhteistyötä selkeästi' },
            { ikoni: '⏱️', teksti: 'Kiireisille jotka tarvitsevat selkeän järjestyksen monimutkaiseen prosessiin' },
          ].map((k, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-lg" style={{ backgroundColor: '#0F1E3C', border: '1px solid #2D3E5C' }}>
              <span style={{ fontSize: '1.5rem' }}>{k.ikoni}</span>
              <p style={{ color: '#A0AEC0', lineHeight: '1.7' }} className="text-sm">{k.teksti}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alaosan CTA */}
      <div style={{ borderTop: '1px solid #2D3E5C' }} className="px-8 py-24 flex flex-col items-center text-center">
        <h2 className="text-white font-bold text-3xl mb-4">Valmis aloittamaan?</h2>
        <p style={{ color: '#A0AEC0' }} className="text-sm mb-8">Aloita kuolinpesän hoito tänään — selkeästi ja rauhallisesti.</p>
        <button onClick={() => router.push('/valitse')}
          style={{ backgroundColor: '#C9A84C', color: '#0F1E3C', padding: '1rem 2.5rem' }}
          className="font-bold rounded text-base hover:opacity-90">
          Aloita ilmaiseksi →
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #2D3E5C', color: '#4A5568' }} className="text-center py-6 text-sm">
        © 2025 Pesänhoitaja — Kaikki oikeudet pidätetään
      </div>

    </div>
  )
}