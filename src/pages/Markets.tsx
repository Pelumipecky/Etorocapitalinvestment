import { useState, useEffect } from 'react'
import { fetchDetailedCryptoPrices, formatPrice, formatMarketCap, CryptoPrice } from '@/utils/cryptoPrices'

function Markets() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change'>('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function loadPrices() {
      try {
        setError(null)
        const prices = await fetchDetailedCryptoPrices()
        if (prices.length === 0) {
          setError('Unable to fetch prices. Please try again later.')
        } else {
          setCryptoPrices(prices)
          setLastUpdated(new Date())
        }
      } catch (err) {
        setError('Failed to load cryptocurrency prices')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPrices()
    const interval = setInterval(loadPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const sortedPrices = [...cryptoPrices].sort((a, b) => {
    let aVal, bVal
    switch (sortBy) {
      case 'price':
        aVal = a.current_price
        bVal = b.current_price
        break
      case 'change':
        aVal = a.price_change_percentage_24h
        bVal = b.price_change_percentage_24h
        break
      default:
        aVal = a.market_cap
        bVal = b.market_cap
    }
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  const handleSort = (column: 'market_cap' | 'price' | 'change') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  // Show loading state on initial load
  if (loading && cryptoPrices.length === 0) {
    return (
      <div className="markets-page" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #0b0e11 0%, #1a1d21 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid rgba(240,185,11,0.2)', 
            borderTop: '4px solid #f0b90b', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#f0b90b', fontSize: '18px' }}>Loading live market data...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && cryptoPrices.length === 0) {
    return (
      <div className="markets-page" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #0b0e11 0%, #1a1d21 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          textAlign: 'center',
          background: 'linear-gradient(145deg, #1e2329, #181a20)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid rgba(248,113,113,0.3)'
        }}>
          <i className="icofont-warning" style={{ fontSize: '48px', color: '#f87171', marginBottom: '16px', display: 'block' }}></i>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Unable to Load Prices</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #f0b90b, #d4a00a)',
              color: '#000',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <i className="icofont-refresh" style={{ marginRight: '8px' }}></i> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="markets-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0b0e11 0%, #1a1d21 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: '32px', 
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            <i className="icofont-chart-line-alt" style={{ color: '#f0b90b', marginRight: '12px' }}></i>
            Live Crypto Markets
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>
            Real-time cryptocurrency prices powered by Binance
          </p>
          {lastUpdated && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '8px' }}>
              <i className="icofont-refresh"></i> Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 30s
            </p>
          )}
        </div>

        {/* Market Overview Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          {cryptoPrices.slice(0, 4).map((crypto) => (
            <div key={crypto.id} style={{
              background: 'linear-gradient(145deg, #1e2329, #181a20)',
              border: '1px solid rgba(240, 185, 11, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <img 
                src={crypto.image} 
                alt={crypto.name} 
                style={{ width: '48px', height: '48px', borderRadius: '50%' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>
                  {crypto.symbol.toUpperCase()}
                </div>
                <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700' }}>
                  ${formatPrice(crypto.current_price)}
                </div>
                <div style={{ 
                  color: crypto.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <i className={crypto.price_change_percentage_24h >= 0 ? 'icofont-arrow-up' : 'icofont-arrow-down'}></i>
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Table */}
        <div style={{
          background: 'linear-gradient(145deg, #1e2329, #181a20)',
          border: '1px solid rgba(240, 185, 11, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              All Cryptocurrencies
            </h2>
            {loading && (
              <span style={{ color: '#f0b90b', fontSize: '13px' }}>
                <i className="icofont-refresh icofont-spin"></i> Updating...
              </span>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' }}>#</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' }}>Name</th>
                  <th 
                    style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => handleSort('price')}
                  >
                    Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th 
                    style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => handleSort('change')}
                  >
                    24h Change {sortBy === 'change' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' }}>24h High</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' }}>24h Low</th>
                  <th 
                    style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    onClick={() => handleSort('market_cap')}
                  >
                    Market Cap {sortBy === 'market_cap' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' }}>Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {sortedPrices.map((crypto, idx) => (
                  <tr 
                    key={crypto.id}
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,185,11,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{idx + 1}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={crypto.image} 
                          alt={crypto.name} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <div>
                          <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{crypto.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase' }}>{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#fff', fontWeight: '600', fontSize: '15px' }}>
                      ${formatPrice(crypto.current_price)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span style={{ 
                        color: crypto.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: crypto.price_change_percentage_24h >= 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        <i className={crypto.price_change_percentage_24h >= 0 ? 'icofont-arrow-up' : 'icofont-arrow-down'}></i>
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#4ade80', fontSize: '14px' }}>
                      ${formatPrice(crypto.high_24h)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#f87171', fontSize: '14px' }}>
                      ${formatPrice(crypto.low_24h)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                      {formatMarketCap(crypto.market_cap)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                      {formatMarketCap(crypto.total_volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ 
          color: 'rgba(255,255,255,0.4)', 
          fontSize: '12px', 
          textAlign: 'center',
          marginTop: '24px'
        }}>
          Prices are provided by Binance API. Data may be delayed by a few seconds. 
          This is not financial advice.
        </p>
      </div>
    </div>
  )
}

export default Markets
