import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchDetailedCryptoPrices, formatPrice, CryptoPrice } from '@/utils/cryptoPrices'
// packages data handled in Packages page
import Packages from './Packages'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'

// `stats` will be built inside the component to ensure translations are applied via `t()`

// The packages view will also be built inside the component so labels can be localized.

// Help tiles will be built inside the component and localized using `t()`.

function Home() {
  console.log('🏠 Home component rendering...')
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  
  // Live crypto prices
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [cryptoError, setCryptoError] = useState(false)
  const [cryptoLoading, setCryptoLoading] = useState(true)
  
  useEffect(() => {
    async function loadPrices() {
      try {
        setCryptoLoading(true);
        console.log('🏠 Loading real-time crypto prices...');
        const prices = await fetchDetailedCryptoPrices();
        if (prices && prices.length > 0) {
          setCryptoPrices(prices);
          setCryptoError(false);
          console.log(`✅ Loaded ${prices.length} cryptocurrencies with real-time data`);
        } else {
          console.warn('⚠️ No crypto prices received, will retry...');
          setCryptoError(true);
          setCryptoPrices([]);
        }
      } catch (error) {
        console.error('❌ Failed to load crypto prices:', error);
        setCryptoError(true);
        setCryptoPrices([]);
      } finally {
        setCryptoLoading(false);
      }
    }

    // Initial load
    loadPrices();

    // Update every 60 seconds for real-time data (reduced from 30s for better performance)
    const interval = setInterval(loadPrices, 60000);

    return () => clearInterval(interval);
  }, []);
  // Build slider & UI content using translations and localized labels
  const localizedStats = [
    { label: t('home.stats.volume'), value: '$38B', detail: t('home.stats.volumeDetail') },
    { label: t('home.stats.assets'), value: '350+', detail: t('home.stats.listedAssetsDetail') },
    { label: t('home.stats.clients'), value: '120M', detail: t('home.stats.clientsDetail') },
    { label: t('home.stats.fees'), value: '0.10%', detail: t('home.stats.feesDetail') }
  ]

  // Packages are rendered via the canonical Packages page component

  const localizedHelpTiles = [
    {
      title: t('home.help.desk.title'),
      copy: t('home.help.desk.copy'),
      cta: { label: t('home.help.desk.cta'), href: '/contact.html' }
    },
    {
      title: t('home.help.faq.title'),
      copy: t('home.help.faq.copy'),
      cta: { label: t('home.help.faq.cta'), href: '/#faq' }
    },
    {
      title: t('home.help.blog.title'),
      copy: t('home.help.blog.copy'),
      cta: { label: t('home.help.blog.cta'), href: '/blog.html' }
    }
  ]

  const guideSteps = [
    {
      number: '01',
      icon: '/images/card.svg',
      title: t('home.guide.steps.verify.title'),
      copy: t('home.guide.steps.verify.copy')
    },
    {
      number: '02',
      icon: '/images/person.svg',
      title: t('home.guide.steps.fund.title'),
      copy: t('home.guide.steps.fund.copy')
    },
    {
      number: '03',
      icon: '/images/money.svg',
      title: t('home.guide.steps.start.title'),
      copy: t('home.guide.steps.start.copy')
    }
  ]

  return (
    <div className="home">
      {/* Live Crypto Ticker */}
      {cryptoLoading ? (
        <div style={{
          background: 'linear-gradient(90deg, #181a20 0%, #1e2329 100%)',
          borderBottom: '1px solid rgba(240, 185, 11, 0.1)',
          padding: '10px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            gap: '40px',
            paddingLeft: '20px'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(240, 185, 11, 0.2)',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{
                  width: '40px',
                  height: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{
                  width: '60px',
                  height: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{
                  width: '50px',
                  height: '14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              </div>
            ))}
          </div>
        </div>
      ) : cryptoPrices.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #181a20 0%, #1e2329 100%)',
          borderBottom: '1px solid rgba(240, 185, 11, 0.1)',
          padding: '10px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            animation: 'scroll 30s linear infinite',
            gap: '40px',
            paddingLeft: '100%'
          }}>
            {[...cryptoPrices, ...cryptoPrices].map((crypto, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <img 
                  src={crypto.image} 
                  alt={crypto.symbol || 'crypto'} 
                  style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>
                  {crypto.symbol ? crypto.symbol.toUpperCase() : 'N/A'}
                </span>
                <span style={{ color: '#fff', fontSize: '13px' }}>
                  ${crypto.current_price ? formatPrice(crypto.current_price) : 'N/A'}
                </span>
                <span style={{ 
                  color: (crypto.price_change_percentage_24h && !isNaN(crypto.price_change_percentage_24h)) 
                    ? (crypto.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171') 
                    : '#64748b',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {(crypto.price_change_percentage_24h && !isNaN(crypto.price_change_percentage_24h))
                    ? `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
                    : 'N/A'
                  }
                </span>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      <section className="hero" id="hero">
        <div className="hero__inner">
        <div className="hero__content">
          <p className="eyebrow">{t('home.hero.eyebrow')}</p>
          <h1>{t('home.hero.title')}</h1>
          <p className="lead">
            {t('home.hero.subtitle')}
          </p>
          <div className="hero__actions">
            {isAuthenticated ? (
              <Link className="btn btn--primary btn--lg" to="/dashboard">
                {t('home.hero.ctaDashboard')}
              </Link>
            ) : (
              <Link className="btn btn--primary btn--lg" to="/signup">
                {t('home.hero.cta')}
              </Link>
            )}
            <Link className="btn btn--ghost btn--lg" to="/packages">
              {t('home.hero.ctaExplore')}
            </Link>
          </div>
          <div className="hero__pill">
            <img src="/images/gift.svg" alt="gift" height={40} className="hero__pill-icon" />
            <div>
              <p className="hero__pill-title">{t('home.hero.pillTitle')}</p>
              <p className="hero__pill-copy">{t('home.hero.pillCopy')}</p>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__visual-shell">
            <article className="hero__visual-card hero__visual-card--top">
              <span className="hero__card-label">{localizedStats[0].label}</span>
              <strong className="hero__card-value">{localizedStats[0].value}</strong>
              <span className="hero__card-copy">{localizedStats[0].detail}</span>
            </article>

            <div className="hero__visual-frame">
              <img
                src="/images/vecteezy_finance-and-business-investment-concept-stock-and-crypto_7287393.jpg"
                alt="eToro Trust Capital investment strategy"
              />
            </div>

            <article className="hero__visual-card hero__visual-card--bottom">
              <span className="hero__card-label">{localizedStats[2].label}</span>
              <strong className="hero__card-value">{localizedStats[2].value}</strong>
              <span className="hero__card-copy">{localizedStats[2].detail}</span>
            </article>
          </div>
        </div>
        </div>
      </section>

      {/* Packages section — use canonical Packages page component */}
      <div className="home__container">
      <section id="packages" aria-label="Investment plans">
        <Packages compact />
      </section>

      <section className="stats" aria-label="Key metrics">
        {localizedStats.map((item) => (
          <article key={item.label}>
            <p className="stats__value">{item.value}</p>
            <p className="stats__label">{item.label}</p>
            <p className="stats__detail">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel" id="about">
        <div>
          <p className="eyebrow">{t('home.about.eyebrow')}</p>
          <h2>{t('home.about.title')}</h2>
          <p>{t('home.about.lead')}</p>
          <ul className="checklist">
            <li>{t('home.about.checklist.custody')}</li>
            <li>{t('home.about.checklist.quantResearch')}</li>
            <li>{t('home.about.checklist.advisors')}</li>
          </ul>
          <div className="panel__cta">
            <Link className="btn btn--primary" to="/signup">
              {t('home.about.ctaAdvisor')}
            </Link>
            <a className="btn btn--ghost" href="/about.html">
              {t('home.about.ctaMore')}
            </a>
          </div>
        </div>
        <div className="mission-card">
            <p className="eyebrow">{t('home.about.mission.eyebrow')}</p>
          <h3>{t('home.about.mission.title')}</h3>
          <p>
            We pair rigorous risk analytics with insurance-backed custody so teams can deploy capital confidently — even during volatility.
          </p>
          <div className="mission-grid">
            <div>
              <p className="mission-grid__title">{t('home.about.mission.grid.security.title')}</p>
              <p>{t('home.about.mission.grid.security.copy')}</p>
            </div>
            <div>
              <p className="mission-grid__title">{t('home.about.mission.grid.data.title')}</p>
              <p>{t('home.about.mission.grid.data.copy')}</p>
            </div>
            <div>
              <p className="mission-grid__title">{t('home.about.mission.grid.transparent.title')}</p>
              <p>{t('home.about.mission.grid.transparent.copy')}</p>
            </div>
          </div>
        </div>
      </section>


      <section className="investment-guide" id="investment-guide">
        <div className="guide-content">
          <div className="guide-header">
            <div>
              <p className="eyebrow">Quick flow</p>
              <h2 className="guide-title">{t('home.guide.title')}</h2>
              <p className="guide-lead">{t('home.guide.lead')}</p>
            </div>
            <div className="guide-cta">
              <Link className="btn btn--primary" to="/signup">
                {t('home.guide.ctaGetStarted')}
              </Link>
            </div>
          </div>
          <div className="guide-steps">
            {guideSteps.map((step) => (
              <article key={step.number} className="guide-step">
                <span className="guide-step__number">{step.number}</span>
                <div className="guide-step__icon-shell">
                  <img src={step.icon} alt="" width="22" height="22" aria-hidden="true" />
                </div>
                <div className="guide-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="help" id="faq">
        <div className="section-heading">
          <p className="eyebrow">{t('home.helpSection2.title')}</p>
          <h2>{t('home.helpSection2.title')}</h2>
        </div>
        <div className="help-grid">
          {localizedHelpTiles.map((tile) => (
            <article key={tile.title}>
              <h3>{tile.title}</h3>
              <p>{tile.copy}</p>
              <a className="btn btn--link" href={tile.cta.href}>
                {tile.cta.label} →
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Mobile apps section removed per request */}

      {/* Second help section removed per request */}

      <section className="contact" id="contact">
        <div className="contact__card">
          <p className="eyebrow">Talk with us</p>
          <h2>Get paired with an advisor in under 24 hours.</h2>
          <p>
            Share your mandate, risk tolerances, and reporting needs. We will follow up with a tailored allocation plan and onboarding checklist.
          </p>
          <div className="contact__actions">
            <Link className="btn btn--primary btn--lg" to="/signup">
              Book intro call
            </Link>
            <a className="btn btn--ghost btn--lg" href="/contact.html">
              Contact form
            </a>
          </div>
        </div>
      </section>

      {/* Floating social icons removed — chat widgets handled by dedicated components */}
      </div>
    </div>
  )
}

export default Home
