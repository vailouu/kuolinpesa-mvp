'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabase'
import GlobalNav from './components/GlobalNav'
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
    <div style={{ backgroundColor: '#0F1E3C', fontFamily: 'Georgia, serif', color: 'white', minHeight: '100vh' }}>

      {/* Nav */}
 <nav style={{ borderBottom: '1px solid #C9A84C', padding: '16px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div onClick={() => router.push('/')} style={{ color: '#C9A84C', letterSpacing: '3px', cursor: 'pointer' }} className="text-xl font-bold tracking-widest uppercase">
    Pesänhoitaja
  </div>
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    {kirjautunut ? (
      <GlobalNav />
    ) : (
      <>
        <button onClick={() => router.push('/kirjaudu')}
          style={{ color: '#A0AEC0', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          Kirjaudu
        </button>
        <button onClick={() => router.push('/valitse')}
          style={{ backgroundColor: '#C9A84C', color: '#0F1E3C', border: 'none', padding: '10px 22px', fontSize: '13px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          Aloita ilmaiseksi →
        </button>
      </>
    )}
  </div>
</nav>

      {/* Hero — keskitetty */}
      <div style={{ padding: '100px 64px 88px', textAlign: 'center', borderBottom: '1px solid #2D3E5C', position: 'relative', overflow: 'hidden' }}>
     
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '80px', background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)', pointerEvents: 'none' }} />
        <div style={{ color: '#C9A84C', letterSpacing: '5px', fontSize: '11px', textTransform: 'uppercase', marginBottom: '28px', position: 'relative' }}>
          — Kuolinpesän hallinta —
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: '1.15', marginBottom: '8px', position: 'relative' }}>
          Et voi poistaa surua.
        </h1>
        <h1 style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: '1.15', color: '#C9A84C', marginBottom: '28px', position: 'relative' }}>
          Voit poistaa kaaoksen.
        </h1>
        <p style={{ color: '#A0AEC0', maxWidth: '600px', margin: '0 auto 44px', lineHeight: '1.85', fontSize: '17px', position: 'relative' }}>
          Kaikki mitä pitää hoitaa yhdellä alustalla — viranomaisista ja pankeista jokaiseen liittymään, sopimukseen ja vakuutukseen asti. Jaettu dashboard kaikille osakkaille, selkeät ohjeet jokaiseen vaiheeseen. Täysi varmuus siitä, että kaikki on hoidettu.
        </p>
        <button onClick={() => router.push('/valitse')}
          style={{ backgroundColor: '#C9A84C', color: '#0F1E3C', border: 'none', padding: '18px 44px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Georgia, serif', position: 'relative' }}>
          Aloita kuolinpesän hoito →
        </button>
        <p style={{ color: '#4A5568', fontSize: '13px', marginTop: '14px', position: 'relative' }}>Ilmainen · Ei luottokorttia</p>
      </div>

      {/* Miten toimii */}
      <div style={{ padding: '88px 64px' }}>
        <div style={{ color: '#C9A84C', letterSpacing: '4px', fontSize: '11px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '56px' }}>
          — Miten se toimii —
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto 64px' }}>
          {[
            { num: '01', otsikko: 'Ensitoimet', teksti: 'Virkatodistus, pankki, Kela, maistraatti — kaikki tarkistuslistana selkeässä järjestyksessä.' },
            { num: '02', otsikko: 'Omaisuuden selvitys', teksti: 'Varat, velat ja sopimukset kartoitetaan kategorioidusti. Ohjeet jokaiseen kohtaan.' },
            { num: '03', otsikko: 'Perunkirjoitus', teksti: 'Sovellus ohjaa sinut läpi perunkirjoituksen ja auttaa generoimaan perukirjapohjan.' },
          ].map(v => (
            <div key={v.num} style={{ backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C', borderRadius: '12px', padding: '40px 36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: '#C9A84C' }} />
              <div style={{ color: '#C9A84C', fontSize: '44px', fontWeight: 'bold', lineHeight: 1, marginBottom: '20px' }}>{v.num}</div>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A84C', marginBottom: '20px' }} />
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '14px' }}>{v.otsikko}</h3>
              <p style={{ color: '#A0AEC0', fontSize: '15px', lineHeight: '1.75' }}>{v.teksti}</p>
            </div>
          ))}
        </div>

        {/* Dashboard-esimerkki */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#1B2A4A', border: '1px solid #C9A84C', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0F1E3C', padding: '13px 24px', borderBottom: '1px solid #2D3E5C', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: '#C9A84C', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>Sopimukset</div>
              <div style={{ color: '#4A5568', fontSize: '11px' }}>3 / 21 hoidettu</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>

              {/* Vasen — kategoriat + digitaaliset auki */}
              <div style={{ borderRight: '1px solid #2D3E5C' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '16px' }}>
                  {[
                    { nimi: '🏠 Asuminen', meta: '1/9', active: false },
                    { nimi: '📱 Viestintä', meta: '1/5', active: false },
                    { nimi: '💻 Digitaaliset', meta: '1/8 ▲', active: true },
                    { nimi: '🛡️ Vakuutukset', meta: '0/6', active: false },
                    { nimi: '🏥 Terveys', meta: '0/4', active: false },
                    { nimi: '🎬 Viihde', meta: '0/5', active: false },
                  ].map((k, i) => (
                    <div key={i} style={{ backgroundColor: k.active ? 'rgba(201,168,76,0.06)' : '#0F1E3C', border: `1px solid ${k.active ? '#C9A84C' : '#2D3E5C'}`, borderRadius: '8px', padding: '9px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: k.active ? '#C9A84C' : '#A0AEC0' }}>{k.nimi}</span>
                      <span style={{ fontSize: '10px', color: k.active ? '#C9A84C' : '#4A5568' }}>{k.meta}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #152238', backgroundColor: '#0a1628' }}>
                  <div style={{ padding: '9px 16px', borderBottom: '1px solid #152238', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase' }}>💻 Digitaaliset palvelut</div>
                    <div style={{ fontSize: '10px', color: '#C9A84C' }}>1 / 8 hoidettu</div>
                  </div>
                  {[
                    { nimi: 'Netflix', tila: 'hoidettu' },
                    { nimi: 'Spotify', tila: 'kylla' },
                    { nimi: 'Google / Gmail', tila: null },
                    { nimi: 'Apple ID / iCloud', tila: 'ei' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: i < 3 ? '1px solid #111e33' : 'none' }}>
                      <span style={{ fontSize: '12px', color: '#A0AEC0' }}>{s.nimi}</span>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {[['kylla','Kyllä'], ['ei','Ei'], ['hoidettu','✓ Hoidettu']].map(([t, label]) => (
                          <button key={t} style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '4px', fontFamily: 'Georgia, serif', cursor: 'pointer', border: s.tila === t ? (t === 'hoidettu' ? '1px solid #4ADE80' : '1px solid #C9A84C') : '1px solid #2D3E5C', backgroundColor: s.tila === t ? (t === 'hoidettu' ? 'rgba(74,222,128,0.08)' : '#C9A84C') : '#1B2A4A', color: s.tila === t ? (t === 'hoidettu' ? '#4ADE80' : '#0F1E3C') : '#6B7280' }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Oikea — Ensitoimet */}
              <div>
                <div style={{ padding: '9px 16px', borderBottom: '1px solid #152238', display: 'flex', justifyContent: 'space-between', backgroundColor: '#0F1E3C' }}>
                  <div style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '1px', textTransform: 'uppercase' }}>Ensitoimet</div>
                  <div style={{ fontSize: '11px', color: '#C9A84C' }}>6 / 9 valmis</div>
                </div>
                <div style={{ padding: '8px 0' }}>
                  {[
                    { nimi: 'Virkatodistus haettu', valmis: true },
                    { nimi: 'Pankkitilit jäädytetty', valmis: true },
                    { nimi: 'Ilmoitus Kelalle', valmis: true },
                    { nimi: 'Hautausjärjestelyt', valmis: false },
                    { nimi: 'Testamentin etsiminen', valmis: false },
                    { nimi: 'Edunvalvontavaltuutus', valmis: false },
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: i < 5 ? '1px solid #111e33' : 'none' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '3px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: t.valmis ? '#C9A84C' : 'transparent', border: t.valmis ? '1px solid #C9A84C' : '1px solid #4A5568' }}>
                        {t.valmis && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#0F1E3C" strokeWidth="2"/></svg>}
                      </div>
                      <span style={{ fontSize: '13px', color: t.valmis ? '#C9A84C' : '#A0AEC0', textDecoration: t.valmis ? 'line-through' : 'none', opacity: t.valmis ? 0.65 : 1 }}>{t.nimi}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid #2D3E5C', display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '3px', backgroundColor: '#2D3E5C', borderRadius: '2px', marginRight: '12px', overflow: 'hidden' }}>
                    <div style={{ width: '66%', height: '100%', backgroundColor: '#C9A84C', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#C9A84C' }}>66% valmis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kenelle */}
      <div style={{ backgroundColor: '#0d1a33', borderTop: '1px solid #2D3E5C', borderBottom: '1px solid #2D3E5C', padding: '88px 64px' }}>
        <div style={{ color: '#C9A84C', letterSpacing: '4px', fontSize: '11px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '56px' }}>— Kenelle —</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { teksti: 'Perheille jotka haluavat selvitä ilman asianajajaa tai minimoida sen käytön', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
            { teksti: 'Kaikille joilla on kuolinpesä hoidettavana ensimmäistä kertaa', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8' },
            { teksti: 'Kuolinpesän osakkaille jotka haluavat tehdä yhteistyötä selkeästi', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
            { teksti: 'Kiireisille jotka tarvitsevat selkeän järjestyksen monimutkaiseen prosessiin', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2' },
          ].map((k, i) => (
            <div key={i} style={{ backgroundColor: '#1B2A4A', border: '1px solid #2D3E5C', borderRadius: '10px', padding: '28px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d={k.icon} /></svg>
              </div>
              <p style={{ color: '#A0AEC0', fontSize: '15px', lineHeight: '1.75', paddingTop: '4px' }}>{k.teksti}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '100px 64px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '14px' }}>Valmis aloittamaan?</h2>
        <p style={{ color: '#A0AEC0', fontSize: '15px', marginBottom: '36px' }}>Aloita kuolinpesän hoito tänään — selkeästi ja rauhallisesti.</p>
        <button onClick={() => router.push('/valitse')}
          style={{ backgroundColor: '#C9A84C', color: '#0F1E3C', border: 'none', padding: '18px 44px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
          Aloita ilmaiseksi →
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #2D3E5C', color: '#4A5568', textAlign: 'center', padding: '20px 64px', fontSize: '13px' }}>
        © 2025 Pesänhoitaja — Kaikki oikeudet pidätetään
      </div>

    </div>
  )
}