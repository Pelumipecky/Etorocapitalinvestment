export default function Transactions() {
  const transactions = [
    { id: 1, type: 'Deposit', amount: '+$10,000', date: '2024-12-03', status: 'Completed' },
    { id: 2, type: 'Investment', amount: '-$5,000', date: '2024-12-02', status: 'Completed' },
    { id: 3, type: 'Profit', amount: '+$450', date: '2024-12-01', status: 'Completed' },
    { id: 4, type: 'Withdrawal', amount: '-$2,000', date: '2024-11-30', status: 'Pending' },
    { id: 5, type: 'Deposit', amount: '+$5,000', date: '2024-11-29', status: 'Completed' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Transactions</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">View all your transaction history</p>
      </div>

      {/* Transactions List - Mobile Card View on small screens, Table on larger */}
      <div className="hidden sm:block bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Type</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Amount</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Date</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(240,185,11,0.05)] transition-colors">
                <td className="py-3 px-2 sm:py-4 sm:px-4 text-white font-medium text-xs sm:text-sm">{tx.type}</td>
                <td className={`py-3 px-2 sm:py-4 sm:px-4 font-semibold text-xs sm:text-sm ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount}
                </td>
                <td className="py-3 px-2 sm:py-4 sm:px-4 text-gray-400 text-xs sm:text-sm">{tx.date}</td>
                <td className="py-3 px-2 sm:py-4 sm:px-4">
                  <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.status === 'Completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div>
                <p className="text-white font-semibold text-sm">{tx.type}</p>
                <p className="text-gray-400 text-xs">{tx.date}</p>
              </div>
              <span className={`text-sm font-bold whitespace-nowrap ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount}
              </span>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              tx.status === 'Completed' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {tx.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
