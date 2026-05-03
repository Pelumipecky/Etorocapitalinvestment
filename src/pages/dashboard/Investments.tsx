export default function Investments() {
  const plans = [
    { id: 1, name: 'Starter Plan', roi: '5%', duration: '30 Days', min: '$500', max: '$5,000', status: 'Available' },
    { id: 2, name: 'Silver Plan', roi: '8%', duration: '60 Days', min: '$1,000', max: '$10,000', status: 'Available' },
    { id: 3, name: 'Gold Plan', roi: '12%', duration: '90 Days', min: '$5,000', max: '$50,000', status: 'Available' },
    { id: 4, name: 'Platinum Plan', roi: '18%', duration: '180 Days', min: '$10,000', max: '$100,000', status: 'Available' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Investment Plans</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Choose an investment plan that fits your needs</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-[#F0B90B]/30 transition-all duration-200 flex flex-col">
            <h3 className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">{plan.name}</h3>
            <div className="space-y-2 sm:space-y-2 mb-3 sm:mb-4 flex-1">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">ROI</span>
                <span className="text-[#F0B90B] font-bold">{plan.roi}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Duration</span>
                <span className="text-white text-sm">{plan.duration}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Min-Max</span>
                <span className="text-white text-xs sm:text-sm whitespace-nowrap ml-1">{plan.min} - {plan.max}</span>
              </div>
            </div>
            <button className="w-full bg-[#F0B90B] hover:bg-[#d9a509] text-[#0d0d0d] font-semibold py-2 px-4 rounded-lg transition-colors text-xs sm:text-sm mt-auto">
              Invest Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
