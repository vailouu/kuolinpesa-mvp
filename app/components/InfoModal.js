'use client'

const SECTIONS = [
  {
    id: 'prosessi',
    label: 'Prosessi',
    title: 'Prosessi kolmessa vaiheessa',
    bullets: [
      {
        label: 'Valmistelu',
        text: 'Kuolinpesän ensimmäinen tehtävä on koota tieto yhteen paikkaan. Lisää vainajan tiedot, kutsu osakkaat mukaan sovellukseen ja kartoita omaisuus — asunnot, ajoneuvot, pankkitilit, velat. Tarkkoja arvoja ei tarvita, pelkkä lista riittää alkuun.',
      },
      {
        label: 'Perukirja ja sopimukset',
        text: 'Perunkirjoitus on pidettävä 3 kuukauden sisällä. Sopimukset-osiosta löydät listan vainajan tyypillisistä jatkuvista sopimuksista — sähkö, puhelin, tilaukset — jotka pitää irtisanoa. Perukirja-osiossa on ohjeet sen toimittamiseen.',
      },
      {
        label: 'Jako ja verotus',
        text: 'Kun perukirja on tehty, omaisuus jaetaan osakkaiden kesken. Jaosta voidaan sopia vapaasti — tasaosuuksia ei ole pakko tehdä. Perintöveroilmoitus pitää jättää 3 kuukauden sisällä perunkirjoituksesta.',
      },
    ],
  },
  {
    id: 'dashboard',
    label: 'Osakkaat',
    title: 'Yhteinen näkymä kaikille osakkaille',
    text: 'Lisää osakkaat dashboardin vasemmasta valikosta kohdasta Osakkaat. Syötä sähköpostiosoite — osakas saa kutsun ja pääsee suoraan samaan näkymään. Kaikki muutokset näkyvät kaikille reaaliajassa: tehtävät, varat, sopimukset. Kukaan ei jää tiedottomaksi eikä tarvitse lähettää päivityksiä sähköpostilla.',
  },
  {
    id: 'tiedot',
    label: 'Varat ja velat',
    title: 'Tarkkoja arvoja ei vaadita',
    text: 'Varat ja velat -osiossa voit merkitä omaisuuden vapaalla tekstillä: "kesämökki Pertunmaalla", "Volkswagen Golf 2015", "OP:n säästötili". Euroarvoja ei vaadita — voit lisätä ne myöhemmin jos tarvitset, tai jättää kokonaan. Sovellus auttaa hahmottamaan kokonaistilanteen, ei tee virallista arvonmääritystä.',
  },
  {
    id: 'aika',
    label: 'Aikataulu',
    title: 'Sinulla on 3 kuukautta aikaa',
    text: 'Sovellus laskee automaattisesti perunkirjoituksen määräpäivän vainajan kuolinpäivästä ja näyttää jäljellä olevat päivät dashboardin yläreunassa. Jos määräaika uhkaa ylittyä, voit hakea maistraatilta lisäaikaa — se myönnetään lähes aina perustelluista syistä.',
  },
  {
    id: 'lakimies',
    label: 'Rajoitukset',
    title: 'Emme korvaa lakimiestä',
    text: 'Pesänhoitaja sopii hyvin tavalliseen, riidattomaan kuolinpesään. Suosittelemme lakimiestä jos pesässä on yritysomaisuutta tai maatila, osakkaat ovat erimielisiä jaosta, joku osakas on alaikäinen tai edunvalvonnan alainen, tai vainajalla oli ulkomailla omaisuutta. Sovellus ilmoittaa näissä tilanteissa erikseen.',
  },
]

export default function InfoModal({ onClose }) {
  return (
    <>
      <style>{`
        .info-sulje-btn {
          transition: box-shadow 0.2s ease;
        }
        .info-sulje-btn:hover {
          box-shadow: 0 0 16px rgba(201,168,76,0.28);
        }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0C0C0C',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '32px 40px 24px',
            borderBottom: '1px solid rgba(201,168,76,0.15)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
          }}>
            <div>
              <p style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(201,168,76,0.7)',
                margin: '0 0 10px',
                textTransform: 'uppercase',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
              }}>
                Pesänhoitaja — Käyttöohje
              </p>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 400,
                color: '#F4F4F4',
                margin: 0,
                lineHeight: 1.15,
                fontFamily: 'var(--font-display)',
              }}>
                Miten tämä toimii?
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4a4540', padding: '4px', flexShrink: 0, marginTop: '2px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#858685'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a4540'}
              aria-label="Sulje"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '0 40px',
          }}>
            {SECTIONS.map((section, idx) => (
              <div
                key={section.id}
                style={{
                  padding: '28px 0',
                  borderBottom: idx < SECTIONS.length - 1
                    ? '1px solid rgba(201,168,76,0.15)'
                    : 'none',
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  gap: '0 32px',
                }}
              >
                {/* Left: label */}
                <div style={{ paddingTop: '3px' }}>
                  <span style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.55)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                  }}>
                    {section.label}
                  </span>
                </div>

                {/* Right: content */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#F4F4F4',
                    margin: '0 0 12px',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '-0.01em',
                  }}>
                    {section.title}
                  </h3>

                  {section.bullets ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {section.bullets.map((b, bi) => (
                        <div key={bi}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#C9A84C',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            marginBottom: '4px',
                            fontFamily: 'var(--font-body)',
                            opacity: 0.75,
                          }}>
                            {b.label}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: '#858685',
                            lineHeight: '1.7',
                            fontFamily: 'var(--font-body)',
                          }}>
                            {b.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '13px',
                      color: '#858685',
                      lineHeight: '1.75',
                      margin: 0,
                      fontFamily: 'var(--font-body)',
                    }}>
                      {section.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 40px',
            borderTop: '1px solid rgba(201,168,76,0.15)',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}>
            <button
              className="info-sulje-btn"
              onClick={onClose}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(201,168,76,0.4)',
                background: 'transparent',
                color: '#C9A84C',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'var(--font-body)',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
              }}
            >
              Sulje
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
