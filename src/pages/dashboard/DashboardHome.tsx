import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export default function DashboardHome() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">Welcome back, John</h1>
        <p className="text-sm sm:text-base text-text-muted mt-1">Here's your investment overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-text-muted text-xs sm:text-sm truncate">Total Balance</p>
              <h3 className="text-xl sm:text-2xl font-bold text-text mt-1 sm:mt-2 break-words">$124,500.00</h3>
              <p className="text-success text-xs sm:text-sm mt-1 sm:mt-2">📈 +12.5% this month</p>
            </div>
            <span className="text-xl sm:text-2xl flex-shrink-0">💰</span>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-text-muted text-xs sm:text-sm truncate">Active Investments</p>
              <h3 className="text-xl sm:text-2xl font-bold text-text mt-1 sm:mt-2">8</h3>
              <p className="text-success text-xs sm:text-sm mt-1 sm:mt-2">✓ All performing well</p>
            </div>
            <span className="text-xl sm:text-2xl flex-shrink-0">📊</span>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-text-muted text-xs sm:text-sm truncate">Monthly Returns</p>
              <h3 className="text-xl sm:text-2xl font-bold text-text mt-1 sm:mt-2">+$3,450</h3>
              <p className="text-success text-xs sm:text-sm mt-1 sm:mt-2">✓ Better than expected</p>
            </div>
            <span className="text-xl sm:text-2xl flex-shrink-0">📈</span>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 md:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-text-muted text-xs sm:text-sm truncate">Risk Score</p>
              <h3 className="text-xl sm:text-2xl font-bold text-text mt-1 sm:mt-2">Medium</h3>
              <p className="text-warning text-xs sm:text-sm mt-1 sm:mt-2">⚡ Balanced portfolio</p>
            </div>
            <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Portfolio Chart */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-text mb-3 sm:mb-4">Portfolio Distribution</h2>
          <div className="w-full h-48 sm:h-64 bg-background rounded-lg flex items-center justify-center">
            <p className="text-text-muted text-sm">Chart would go here</p>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-text mb-3 sm:mb-4">Quick Stats</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Win Rate</span>
              <span className="text-text font-semibold">72%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Avg Return</span>
              <span className="text-accent font-semibold">+8.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total Trades</span>
              <span className="text-text font-semibold">234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Max Drawdown</span>
              <span className="text-error font-semibold">-4.2%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-base sm:text-lg font-bold text-text truncate">Recent Transactions</h2>
          <button className="text-accent text-xs sm:text-sm font-semibold hover:opacity-80 whitespace-nowrap">View All</button>
        </div>
        <div className="space-y-2 sm:space-y-3 overflow-x-auto">
          {[
            { icon: '📥', type: 'Buy Bitcoin', amount: '+$5,000', status: 'Completed', color: 'success' },
            { icon: '📤', type: 'Sell Ethereum', amount: '-$3,200', status: 'Completed', color: 'error' },
            { icon: '💳', type: 'Deposit USD', amount: '+$10,000', status: 'Pending', color: 'warning' },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-border last:border-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg sm:text-xl flex-shrink-0">{tx.icon}</span>
                <div className="min-w-0">
                  <p className="text-text font-semibold text-xs sm:text-sm truncate">{tx.type}</p>
                  <p className="text-text-muted text-xs truncate">{tx.status}</p>
                </div>
              </div>
              <span className={`font-semibold text-xs sm:text-sm text-${tx.color} whitespace-nowrap`}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">Deposit Funds</Button>
        <Button variant="outline" className="w-full sm:w-auto">View Reports</Button>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Deposit Funds">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Amount</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button>Confirm</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
