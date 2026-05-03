export default function Portfolio() {
  const investments = [
    { id: 1, plan: 'Gold Plan', amount: '$5,000', roi: '+12%', status: 'Active', daysLeft: 27 },
    { id: 2, plan: 'Silver Plan', amount: '$3,000', roi: '+8%', status: 'Active', daysLeft: 28 },
    { id: 3, plan: 'Platinum Plan', amount: '$20,000', roi: '+18%', status: 'Active', daysLeft: 87 },
  ]

  const completedInvestments = [
    { id: 4, plan: 'Starter Plan', amount: '$1,000', finalRoi: '+5%', completedDate: '2024-11-15' },
    { id: 5, plan: 'Bronze Plan', amount: '$2,500', finalRoi: '+10%', completedDate: '2024-10-20' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">My Portfolio</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Track all your investments</p>
      </div>

      {/* Active Investments */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Active Investments</h2>
        <div className="space-y-2 sm:space-y-3">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-[#F0B90B]/30 transition-all duration-200">
              <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base truncate">{inv.plan}</p>
                  <p className="text-xs text-gray-400">{inv.daysLeft} days remaining</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold text-sm sm:text-base">{inv.amount}</p>
                  <p className="text-green-400 text-xs sm:text-sm font-semibold">{inv.roi}</p>
                </div>
              </div>
              <div className="w-full bg-[#0d0d0d] rounded-full h-1.5 sm:h-2">
                <div className="bg-[#F0B90B] h-1.5 sm:h-2 rounded-full transition-all" style={{ width: `${(30 - inv.daysLeft) / 30 * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Investments */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Completed Investments</h2>
        <div className="space-y-2 sm:space-y-3">
          {completedInvestments.map((inv) => (
            <div key={inv.id} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base truncate">{inv.plan}</p>
                  <p className="text-xs text-gray-400">{inv.completedDate}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold text-sm sm:text-base">{inv.amount}</p>
                  <p className="text-green-400 text-xs sm:text-sm font-semibold">{inv.finalRoi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
