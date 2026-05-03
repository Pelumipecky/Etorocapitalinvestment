export default function Support() {
  const faqItems = [
    { q: 'How do I invest?', a: 'Navigate to the Investments section, choose a plan, and follow the instructions.' },
    { q: 'What is the minimum investment?', a: 'The minimum investment depends on the plan selected, starting from $500.' },
    { q: 'How are profits calculated?', a: 'Profits are calculated based on the ROI percentage and duration of your investment.' },
    { q: 'When do I receive profits?', a: 'Profits are credited to your account after the investment period ends.' },
  ]

  const supportChannels = [
    { channel: 'Support Page', contact: 'Use the website contact form', icon: '📝' },
    { channel: 'Phone', contact: '+1 (800) 123-4567', icon: '📞' },
    { channel: 'Live Chat', contact: 'Available 24/7', icon: '💬' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Support & Help</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Get assistance with your account and investments</p>
      </div>

      {/* Support Channels */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {supportChannels.map((item, idx) => (
            <div key={idx} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-[#F0B90B]/30 transition-all">
              <p className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.icon}</p>
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{item.channel}</h3>
              <p className="text-[#F0B90B] text-xs sm:text-sm break-words">{item.contact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2 sm:space-y-3">
          {faqItems.map((item, idx) => (
            <details key={idx} className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5 group cursor-pointer hover:border-[#F0B90B]/30 transition-all">
              <summary className="flex items-center justify-between font-semibold text-white text-sm sm:text-base gap-2">
                <span className="text-left">{item.q}</span>
                <span className="text-[#F0B90B] group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Submit Ticket */}
      <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Submit a Ticket</h2>
        <form className="space-y-3 sm:space-y-4">
          <input type="text" placeholder="Subject" className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg placeholder-gray-500 text-sm" />
          <textarea placeholder="Describe your issue..." rows={4} className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg placeholder-gray-500 resize-none text-sm" ></textarea>
          <button type="submit" className="w-full bg-[#F0B90B] hover:bg-[#d9a509] text-[#0d0d0d] font-semibold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
