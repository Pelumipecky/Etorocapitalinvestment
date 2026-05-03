export default function Profile() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">My Profile</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#F0B90B] flex items-center justify-center text-xl sm:text-2xl font-bold text-[#0d0d0d] flex-shrink-0">
            JD
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">John Doe</h2>
            <p className="text-gray-400 text-sm truncate">john@example.com</p>
            <p className="text-xs text-gray-500 mt-1">Member since 2024</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Full Name</label>
              <input type="text" value="John Doe" className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-3 sm:px-4 py-2 rounded-lg text-sm" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Email</label>
              <input type="email" value="john@example.com" className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-3 sm:px-4 py-2 rounded-lg text-sm" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Phone</label>
              <input type="tel" value="+1 234 567 8900" className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-3 sm:px-4 py-2 rounded-lg text-sm" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Country</label>
              <input type="text" value="United States" className="w-full bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-3 sm:px-4 py-2 rounded-lg text-sm" readOnly />
            </div>
          </div>

          <button className="w-full sm:w-auto bg-[#F0B90B] hover:bg-[#d9a509] text-[#0d0d0d] font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors mt-4 sm:mt-6 text-sm sm:text-base">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5">
          <p className="text-gray-400 text-xs sm:text-sm mb-2">Total Invested</p>
          <p className="text-2xl sm:text-3xl font-bold text-white break-words">$28,000</p>
        </div>
        <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5">
          <p className="text-gray-400 text-xs sm:text-sm mb-2">Total Earned</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-400 break-words">+$4,290</p>
        </div>
        <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-5">
          <p className="text-gray-400 text-xs sm:text-sm mb-2">Account Age</p>
          <p className="text-2xl sm:text-3xl font-bold text-white break-words">352 Days</p>
        </div>
      </div>
    </div>
  )
}
