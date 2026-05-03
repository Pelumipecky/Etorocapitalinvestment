export default function Wallet() {
  const wallets = [
    { currency: 'USD', balance: '45,892.50', available: '42,392.50', locked: '3,500.00', icon: '💵' },
    { currency: 'BTC', balance: '2.45678', available: '2.45678', locked: '0.00000', icon: '₿' },
    { currency: 'ETH', balance: '15.8923', available: '14.8923', locked: '1.0000', icon: 'Ξ' },
    { currency: 'USDT', balance: '12,500.00', available: '12,500.00', locked: '0.00', icon: '₮' },
  ]

  const recentTransactions = [
    { type: 'Deposit', currency: 'USD', amount: '+$5,000.00', time: '2 hours ago', status: 'Completed' },
    { type: 'Withdrawal', currency: 'BTC', amount: '-0.5 BTC', time: '1 day ago', status: 'Pending' },
    { type: 'Transfer', currency: 'ETH', amount: '-2.0 ETH', time: '2 days ago', status: 'Completed' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">My Wallet</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your funds and view balances</p>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-[#F0B90B] to-[#d9a509] rounded-lg sm:rounded-xl p-4 sm:p-6 text-[#0d0d0d]">
        <p className="text-xs sm:text-sm font-medium mb-2 opacity-90">Total Balance (USD)</p>
        <p className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 break-words">$58,392.50</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button className="bg-[#0d0d0d] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors text-sm sm:text-base">
            Deposit
          </button>
          <button className="bg-white/20 backdrop-blur px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm sm:text-base">
            Withdraw
          </button>
        </div>
      </div>

      {/* Wallets Grid */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Currency Balances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {wallets.map((wallet) => (
            <div key={wallet.currency} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-[#F0B90B]/30 transition-all duration-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">{wallet.icon}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase">{wallet.currency}</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white mb-1 break-words">{wallet.balance}</p>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="text-green-400 font-semibold">{wallet.available}</span>
                </div>
                <div className="flex justify-between">
                  <span>Locked:</span>
                  <span className="text-yellow-400 font-semibold">{wallet.locked}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-5">Recent Transactions</h2>
        <div className="space-y-3 sm:space-y-4 overflow-x-auto">
          {recentTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0 gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{tx.type}</p>
                <p className="text-xs text-gray-400 truncate">{tx.currency} • {tx.time}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-xs sm:text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'} whitespace-nowrap`}>
                  {tx.amount}
                </p>
                <span className={`text-xs ${tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 sm:mt-4 w-full py-2 sm:py-3 text-[#F0B90B] hover:text-[#d9a509] font-medium text-xs sm:text-sm transition-colors">
          View All Transactions →
        </button>
      </div>
    </div>
  )
}
