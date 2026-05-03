export default function Settings() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Settings</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Security Settings */}
      <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Security</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] gap-2">
            <div className="min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400 mt-1">Add extra security to your account</p>
            </div>
            <button className="bg-[#F0B90B] text-[#0d0d0d] font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-[#d9a509] transition-colors whitespace-nowrap text-xs sm:text-sm flex-shrink-0">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] gap-2">
            <div className="min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">Password</p>
              <p className="text-xs text-gray-400 mt-1">Change your password regularly</p>
            </div>
            <button className="bg-[#1a1a1a] text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-[#222] transition-colors border border-[rgba(255,255,255,0.1)] whitespace-nowrap text-xs sm:text-sm flex-shrink-0">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Notifications</h2>
        <div className="space-y-3 sm:space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Receive updates via email' },
            { label: 'SMS Alerts', desc: 'Get important alerts via SMS' },
            { label: 'Push Notifications', desc: 'Browser push notifications' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0 gap-3">
              <div className="min-w-0">
                <p className="text-white font-medium text-sm sm:text-base">{item.label}</p>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#F0B90B] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-[#131722] border border-[rgba(255,255,255,0.05)] rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Privacy</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] gap-2">
            <div className="min-w-0">
              <p className="text-white font-medium text-sm sm:text-base">Profile Visibility</p>
              <p className="text-xs text-gray-400 mt-1">Control who can see your profile</p>
            </div>
            <select className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.1)] text-white px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex-shrink-0">
              <option>Private</option>
              <option>Public</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
