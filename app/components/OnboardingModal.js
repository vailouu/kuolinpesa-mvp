'use client'
import { useState, useEffect } from 'react'

const SECTIONS = [
  {
    id: 'prosessi',
    title: 'Prosessi kolmessa vaiheessa',
    bullets: [
      { label: 'Valmistelu', text: 'Kerää asiakirjat, lisää osakkaat ja kartoita varat ja velat.' },
      { label: 'Perukirja ja sopimukset', text: 'Valmistaudu perunkirjoitukseen ja selvitä vainajan avoimet sopimukset.' },
      { label: 'Jako ja verotus', text: 'Jaa pesän omaisuus osakkaiden kesken ja hoida perintöverotus.' },
    ],
  },
  {
    id: 'dashboard',
    title: 'Yhteinen dashboard kaikille osakkaille',
    content: 'Kaikilla kuolinpesän osakkailla on pääsy samalle dashboardille. Jokainen voi seurata tilannetta ja nähdä toistensa tekemät muutokset reaaliajassa. Ketään ei jätetä tiedottomaksi.',
  },
  {
    id: 'tiedot',
    title: 'Sinun ei tarvitse syöttää tarkkoja tietoja',
    content: 'Sovellus ei vaadi sinua kirjaamaan omaisuuden tarkkoja arvoja euroina. Voit merkitä esimerkiksi ‘asunto’ ilman hinta-arviota. Tiedot ovat vain sinua varten — auttamaan hahmottamaan kokonaistilanne.',
  },
  {
    id: 'aika',
    title: 'Sinulla on 3 kuukautta aikaa',
    content: 'Perunkirjoitus on lain mukaan toimitettava 3 kuukauden sisällä kuolemasta. Tämä saattaa tuntua tiukalta, mutta etenemme rauhassa askel kerrallaan. Sovellus pitää kirjaa jäljellä olevasta ajasta.',
  },
  {
    id: 'lakimies',
    title: 'Emme korvaa lakimiestä',
    content: 'Pesänhoitaja auttaa sinua järjestelyissä, mutta ei ole oikeudellinen neuvonantaja. Kerromme matkan varrella milloin lakimiehen konsultointi kannattaa — esimerkiksi jos pesässä on yritysomaisuutta tai osakkaat ovat erimielisiä.',
  },
]

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false)
  const [readSet, setReadSet] = useState(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem('onboarding_complete')) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const allRead = readSet.size === SECTIONS.length

  function handleRead(idx) {
    const next = new Set(readSet)
    next.add(idx)
    setReadSet(next)
    if (idx + 1 < SECTIONS.length) setCurrentIndex(idx + 1)
  }

  function handleStart() {
    if (!allRead) return
    localStorage.setItem('onboarding_complete', '1')
    setVisible(false)
  }

  return (
    <>
    <style>{`
      .onb-luettu-btn {
        transition: box-shadow 0.2s ease;
      }
      .onb-luettu-btn:hover {
        box-shadow: 0 0 14px rgba(201,168,76,0.28);
      }
      .onb-aloitetaan-btn {
        transition: box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease;
      }
      .onb-aloitetaan-btn:hover:not(:disabled) {
        box-shadow: 0 0 16px rgba(201,168,76,0.28);
      }
    `}</style>
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#0C0C0C',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: '#C9A84C',
            margin: '0 0 6px',
            textTransform: 'uppercase',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
          }}>
            Pesänhoitaja
          </p>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 400,
            color: '#F4F4F4',
            margin: '0 0 0.75rem',
            lineHeight: 1.2,
            fontFamily: 'var(--font-display)',
          }}>
            Olemme pahoillamme<br />menetyksestäsi.
          </h1>
          <div style={{
            marginTop: '5px',
            fontSize: '13px',
            color: '#858685',
            fontFamily: 'var(--font-body)',
            lineHeight: '1.5',
          }}>
            Käy läpi viisi lyhyttä osiota ennen kuin aloitat.
          </div>
        </div>

        {/* Sections */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {SECTIONS.map((section, idx) => {
            const isRead = readSet.has(idx)
            const isCurrent = idx === currentIndex
            const isLocked = idx > currentIndex

            return (
              <div
                key={section.id}
                style={{
                  border: (isRead || isCurrent) ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '8px',
                  background: 'transparent',
                  opacity: isLocked ? 0.4 : 1,
                  transition: 'opacity 0.25s ease, background 0.25s ease, border-color 0.25s ease',
                }}
              >
                {/* Row: number + title */}
                <div style={{
                  padding: (isCurrent || isRead) ? '14px 16px 0' : '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{
                    width: '22px', height: '22px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '11px',
                    fontFamily: 'var(--font-body)',
                    color: '#C9A84C',
                  }}>
                    {isRead ? '✓' : idx + 1}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '-0.01em',
                    color: isCurrent ? '#F4F4F4' : isRead ? '#F4F4F4' : '#858685',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {section.title}
                  </div>
                </div>

                {/* Content — only when current or already read */}
                {(isCurrent || isRead) && (
                  <div style={{ padding: '10px 16px 14px', paddingLeft: '48px' }}>
                    {section.bullets ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {section.bullets.map((b, bi) => (
                          <div key={bi} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '4px', height: '4px', borderRadius: '50%',
                              background: isRead ? '#C9A84C' : '#4a4540',
                              marginTop: '8px', flexShrink: 0,
                            }} />
                            <div style={{
                              fontSize: '13px',
                              color: '#858685',
                              lineHeight: '1.65',
                              fontFamily: 'var(--font-body)',
                            }}>
                              <span style={{ color: '#F4F4F4', fontWeight: '500' }}>
                                {b.label}:
                              </span>{' '}
                              {b.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        fontSize: '13px',
                        color: '#858685',
                        lineHeight: '1.7',
                        fontFamily: 'var(--font-body)',
                      }}>
                        {section.content}
                      </div>
                    )}

                    {/* Luettu-button — only on current, unread section */}
                    {!isRead && isCurrent && (
                      <div style={{ marginTop: '12px' }}>
                        <button
                          className="onb-luettu-btn"
                          onClick={() => handleRead(idx)}
                          style={{
                            padding: '5px 15px',
                            border: '1px solid rgba(201,168,76,0.4)',
                            borderRadius: '6px',
                            background: 'transparent',
                            color: '#C9A84C',
                            fontSize: '12px',
                            fontFamily: 'var(--font-body)',
                            letterSpacing: '0.02em',
                            cursor: 'pointer',
                          }}
                        >
                          Luettu
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: '12px',
            color: '#858685',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.01em',
          }}>
            {readSet.size} / 5 luettu
          </div>
          <button
            className="onb-aloitetaan-btn"
            onClick={handleStart}
            disabled={!allRead}
            style={{
              padding: '9px 26px',
              borderRadius: '8px',
              border: allRead ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.07)',
              background: 'transparent',
              color: allRead ? '#C9A84C' : '#3a3530',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.01em',
              cursor: allRead ? 'pointer' : 'not-allowed',
            }}
          >
            Aloitetaan
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
