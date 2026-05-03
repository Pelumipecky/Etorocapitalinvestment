import { useState } from 'react'

interface PortfolioItem {
  id: string
  name: string
  symbol: string
  amount: number
  value: number
  change24h: number
  icon: string
}

function Dashboard() {
  const [totalBalance] = useState(12547.89)
  const [portfolioChange] = useState(+3.24)
  
  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      amount: 0.25,
      value: 10500.00,
      change24h: +2.5,
      icon: '₿'
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      amount: 1.5,
      value: 1800.00,
      change24h: -1.2,
      icon: 'Ξ'
    },
    {
      id: '3',
      name: 'USD Coin',
      symbol: 'USDC',
      amount: 247.89,
      value: 247.89,
      change24h: 0,
      icon: '$'
    }
  ]

  const recentTransactions = [
    { id: '1', type: 'Buy', asset: 'BTC', amount: '0.05', value: '$2,100', date: '2025-12-03', status: 'Completed' },
    { id: '2', type: 'Sell', asset: 'ETH', amount: '0.5', value: '$600', date: '2025-12-02', status: 'Completed' },
    { id: '3', type: 'Buy', asset: 'USDC', amount: '500', value: '$500', date: '2025-12-01', status: 'Completed' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__header">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard__subtitle">Welcome back to your portfolio</p>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="dashboard__overview">
          <div className="dashboard__card dashboard__balance">
            <div className="dashboard__card-header">
              <h3>Total Balance</h3>
              <span className="dashboard__timeframe">24h</span>
            </div>
            <div className="dashboard__balance-amount">
              <h2>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <span className={`dashboard__change ${portfolioChange >= 0 ? 'positive' : 'negative'}`}>
                {portfolioChange >= 0 ? '+' : ''}{portfolioChange}%
              </span>
            </div>
          </div>

          <div className="dashboard__quick-actions">
            <button className="dashboard__action-btn dashboard__action-btn--primary">
              <span className="dashboard__action-icon">💰</span>
              <span>Deposit</span>
            </button>
            <button className="dashboard__action-btn">
              <span className="dashboard__action-icon">💸</span>
              <span>Withdraw</span>
            </button>
            <button className="dashboard__action-btn">
              <span className="dashboard__action-icon">🔄</span>
              <span>Trade</span>
            </button>
          </div>
        </div>

        {/* Portfolio Assets */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Your Assets</h2>
            <button className="dashboard__view-all">View All →</button>
          </div>
          <div className="dashboard__card">
            <div className="dashboard__table">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Value</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="dashboard__asset">
                          <span className="dashboard__asset-icon">{item.icon}</span>
                          <div>
                            <div className="dashboard__asset-name">{item.name}</div>
                            <div className="dashboard__asset-symbol">{item.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.amount.toFixed(4)} {item.symbol}</td>
                      <td>${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`dashboard__change ${item.change24h >= 0 ? 'positive' : 'negative'}`}>
                          {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Recent Transactions</h2>
            <button className="dashboard__view-all">View All →</button>
          </div>
          <div className="dashboard__card">
            <div className="dashboard__table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Value</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span className={`dashboard__tx-type dashboard__tx-type--${tx.type.toLowerCase()}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.asset}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.value}</td>
                      <td>{tx.date}</td>
                      <td>
                        <span className="dashboard__status dashboard__status--completed">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
