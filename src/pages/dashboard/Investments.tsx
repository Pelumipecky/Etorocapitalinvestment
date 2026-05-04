import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Modal } from '@/components/ui/Modal'

export default function Investments() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const plans = [
    { id: 1, name: 'Starter Plan', roi: '5%', duration: '30 Days', min: 500, max: 5000, status: 'Available', durationDays: 30 },
    { id: 2, name: 'Silver Plan', roi: '8%', duration: '60 Days', min: 1000, max: 10000, status: 'Available', durationDays: 60 },
    { id: 3, name: 'Gold Plan', roi: '12%', duration: '90 Days', min: 5000, max: 50000, status: 'Available', durationDays: 90 },
    { id: 4, name: 'Platinum Plan', roi: '18%', duration: '180 Days', min: 10000, max: 100000, status: 'Available', durationDays: 180 },
  ]

  const handleInvestClick = (plan: any) => {
    setSelectedPlan(plan)
    setInvestmentAmount('')
    setError('')
    setSuccess('')
    setIsModalOpen(true)
  }

  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) {
      setError('You must be logged in to invest')
      return
    }

    const amount = parseFloat(investmentAmount)

    if (!amount || isNaN(amount)) {
      setError('Please enter a valid amount')
      return
    }

    if (amount < selectedPlan.min) {
      setError(`Minimum investment is $${selectedPlan.min}`)
      return
    }

    if (amount > selectedPlan.max) {
      setError(`Maximum investment is $${selectedPlan.max}`)
      return
    }

    const availableBalance = user.balance || 0
    if (amount > availableBalance) {
      setError(`Insufficient balance. Available: $${availableBalance.toFixed(2)}`)
      return
    }

    setLoading(true)
    try {
      // Create investment record
      const response = await fetch('/api/investments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amount: amount,
          roi: parseFloat(selectedPlan.roi),
          durationDays: selectedPlan.durationDays,
          status: 'pending',
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create investment')
      }

      const result = await response.json()
      setSuccess('Investment created successfully! Waiting for approval.')
      setInvestmentAmount('')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create investment')
    } finally {
      setLoading(false)
    }
  }

  const availableBalance = user?.balance || 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Investment Plans</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Choose an investment plan that fits your needs</p>
        <p className="text-xs sm:text-sm text-[#F0B90B] mt-2 font-semibold">
          Available Balance: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
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
                <span className="text-white text-xs sm:text-sm whitespace-nowrap ml-1">${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={() => handleInvestClick(plan)}
              disabled={availableBalance < plan.min}
              className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors text-xs sm:text-sm mt-auto ${
                availableBalance < plan.min
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#F0B90B] hover:bg-[#d9a509] text-[#0d0d0d]'
              }`}
            >
              {availableBalance < plan.min ? 'Insufficient Balance' : 'Invest Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? `Invest in ${selectedPlan.name}` : 'Make Investment'}
        size="md"
      >
        <div className="p-6 space-y-4">
          {selectedPlan && (
            <>
              {/* Plan Details */}
              <div className="bg-[#1e2633] rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ROI</span>
                  <span className="text-[#F0B90B] font-semibold">{selectedPlan.roi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">{selectedPlan.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min-Max Amount</span>
                  <span className="text-white font-semibold">${selectedPlan.min.toLocaleString()} - ${selectedPlan.max.toLocaleString()}</span>
                </div>
              </div>

              {/* Available Balance Info */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 text-sm">
                <p className="text-blue-200">
                  <span className="font-semibold">Available Balance:</span> ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Investment Form */}
              <form onSubmit={handleInvestmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter amount between $${selectedPlan.min} and $${selectedPlan.max}`}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={selectedPlan.min}
                    max={Math.min(selectedPlan.max, availableBalance)}
                    step="0.01"
                    className="w-full px-4 py-2 bg-[#1e2633] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F0B90B] focus:ring-1 focus:ring-[#F0B90B]/20"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    You can invest up to ${Math.min(selectedPlan.max, availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Projected Returns */}
                {investmentAmount && !isNaN(parseFloat(investmentAmount)) && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-sm">
                    <p className="text-green-200">
                      <span className="font-semibold">Projected Return:</span> ${(parseFloat(investmentAmount) * (parseFloat(selectedPlan.roi) / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-sm text-green-200">
                    {success}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
                    loading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-[#F0B90B] hover:bg-[#d9a509] text-[#0d0d0d]'
                  }`}
                >
                  {loading ? 'Processing...' : 'Confirm Investment'}
                </button>
              </form>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
