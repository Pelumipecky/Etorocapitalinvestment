import { useState } from 'react'
import { Link } from 'react-router-dom'

// All languages available on the website
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
]

// Comprehensive guides covering all website features
const guides = [
  {
    id: 'complete-guide',
    title: 'Complete User Guide',
    description: 'The ultimate guide covering everything from account creation to advanced features. Includes KYC verification, deposits, investments, withdrawals, referrals, and more.',
    pages: 45,
    difficulty: 'All Levels',
    icon: '📚',
    category: 'complete',
    topics: ['Account Setup', 'KYC Verification', 'Deposits', 'Investments', 'Withdrawals', 'Referrals', 'Loans', 'Security']
  },
  {
    id: 'getting-started',
    title: 'Getting Started Guide',
    description: 'Step-by-step guide to creating your account, setting up your profile, completing KYC verification, and navigating the dashboard.',
    pages: 18,
    difficulty: 'Beginner',
    icon: '🚀',
    category: 'beginner',
    topics: ['Sign Up', 'Email Verification', 'Profile Setup', 'Dashboard Navigation', 'Security Settings']
  },
  {
    id: 'kyc-guide',
    title: 'KYC Verification Guide',
    description: 'Complete walkthrough of the identity verification process. Learn what documents are accepted, how to submit them, and what to expect during review.',
    pages: 12,
    difficulty: 'Beginner',
    icon: '🪪',
    category: 'beginner',
    topics: ['Document Requirements', 'ID Verification', 'Address Proof', 'Selfie Verification', 'Approval Process']
  },
  {
    id: 'deposit-guide',
    title: 'Deposit & Funding Guide',
    description: 'Learn all the ways to fund your account including cryptocurrency deposits, bank transfers, and payment methods with step-by-step instructions.',
    pages: 15,
    difficulty: 'Beginner',
    icon: '💳',
    category: 'beginner',
    topics: ['Crypto Deposits', 'Bank Transfers', 'Payment Methods', 'Deposit Limits', 'Processing Times']
  },
  {
    id: 'investment-guide',
    title: 'Investment Plans Guide',
    description: 'Comprehensive guide to understanding all investment plans, ROI calculations, daily earnings, and strategies for maximizing your returns.',
    pages: 25,
    difficulty: 'Intermediate',
    icon: '📈',
    category: 'investment',
    topics: ['Plan Comparison', 'ROI Explained', 'Daily Earnings', 'Capital Requirements', 'Investment Strategies']
  },
  {
    id: 'roi-calculator',
    title: 'ROI & Earnings Calculator',
    description: 'Detailed explanation of how returns are calculated, daily ROI distribution, bonus earnings, and projected earnings for each investment plan.',
    pages: 10,
    difficulty: 'Intermediate',
    icon: '🧮',
    category: 'investment',
    topics: ['ROI Formula', 'Daily Distribution', 'Bonus System', 'Earnings Projection', 'Compound Interest']
  },
  {
    id: 'withdrawal-guide',
    title: 'Withdrawal Guide',
    description: 'Step-by-step instructions on withdrawing your earnings. Covers available methods, processing times, fees, and troubleshooting common issues.',
    pages: 14,
    difficulty: 'Beginner',
    icon: '💸',
    category: 'withdrawal',
    topics: ['Withdrawal Methods', 'Crypto Withdrawals', 'Bank Transfers', 'Processing Times', 'Minimum Amounts']
  },
  {
    id: 'referral-guide',
    title: 'Referral Program Guide',
    description: 'Learn how to earn bonuses by referring friends. Understand the referral system, bonus structure, and tips for maximizing referral earnings.',
    pages: 12,
    difficulty: 'Beginner',
    icon: '👥',
    category: 'referral',
    topics: ['Referral Code', 'Bonus Structure', 'Tracking Referrals', 'Commission Rates', 'Withdrawal of Bonuses']
  },
  {
    id: 'loan-guide',
    title: 'Loan Application Guide',
    description: 'Complete guide to applying for loans on eToro Trust Capital. Understand eligibility requirements, loan terms, interest rates, and repayment options.',
    pages: 16,
    difficulty: 'Intermediate',
    icon: '🏦',
    category: 'loan',
    topics: ['Eligibility', 'Application Process', 'Loan Terms', 'Interest Rates', 'Repayment Schedule']
  },
  {
    id: 'security-guide',
    title: 'Account Security Guide',
    description: 'Best practices for keeping your account secure. Covers two-factor authentication, password management, and recognizing phishing attempts.',
    pages: 10,
    difficulty: 'Beginner',
    icon: '🔒',
    category: 'security',
    topics: ['2FA Setup', 'Password Best Practices', 'Phishing Prevention', 'Account Recovery', 'Security Alerts']
  }
]

// Category filter options
const categories = [
  { id: 'all', name: 'All Guides', icon: '📖' },
  { id: 'complete', name: 'Complete Guide', icon: '📚' },
  { id: 'beginner', name: 'Getting Started', icon: '🚀' },
  { id: 'investment', name: 'Investments', icon: '📈' },
  { id: 'withdrawal', name: 'Withdrawals', icon: '💸' },
  { id: 'referral', name: 'Referrals', icon: '👥' },
  { id: 'loan', name: 'Loans', icon: '🏦' },
  { id: 'security', name: 'Security', icon: '🔒' },
]

function PDFGuides() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-600'
      case 'Intermediate': return 'from-yellow-500 to-orange-500'
      case 'Advanced': return 'from-red-500 to-pink-600'
      case 'All Levels': return 'from-purple-500 to-indigo-600'
      default: return 'from-blue-500 to-cyan-600'
    }
  }

  const selectedLang = LANGUAGES.find(l => l.code === selectedLanguage)

  return (
    <div className="pdf-guides-page min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-yellow-500 hover:text-yellow-400 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            eToro Trust Capital <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">User Guides</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
            Comprehensive documentation to help you master every feature of eToro Trust Capital
          </p>
          <p className="text-gray-400">
            Available in <span className="text-yellow-500 font-semibold">{LANGUAGES.length} languages</span>
          </p>
        </div>

        {/* Language Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">Select Language:</span>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-3 text-white pr-12 appearance-none focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 cursor-pointer min-w-[200px]"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {selectedLang && (
                  <span className="text-3xl">{selectedLang.flag}</span>
                )}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-3 text-white pl-12 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 border border-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <div 
                key={guide.id} 
                className="bg-gray-800/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-yellow-500/10"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {guide.icon}
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getDifficultyColor(guide.difficulty)} shadow-lg`}>
                      {guide.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {guide.description}
                  </p>

                  {/* Topics Preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {guide.topics.slice(0, 3).map((topic, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gray-700/60 text-gray-300 text-xs rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                    {guide.topics.length > 3 && (
                      <button
                        onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
                        className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md hover:bg-yellow-500/30 transition-colors"
                      >
                        +{guide.topics.length - 3} more
                      </button>
                    )}
                  </div>

                  {/* Expanded Topics */}
                  {expandedGuide === guide.id && (
                    <div className="flex flex-wrap gap-1.5 mb-4 pt-2 border-t border-gray-700/50">
                      {guide.topics.map((topic, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-gray-700/60 text-gray-300 text-xs rounded-md"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4 py-3 border-t border-b border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                      </svg>
                      <span className="text-sm">{guide.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                      <span className="text-lg">{selectedLang?.flag}</span>
                      <span className="text-sm font-medium">{selectedLang?.name}</span>
                    </div>
                  </div>

                  <Link
                    to={`/guide/${guide.id}?lang=${selectedLanguage}`}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    View Guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No guides found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Links Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/guide/getting-started?lang=en" 
                className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all border border-gray-700/50 hover:border-yellow-500/50"
              >
                <span className="text-3xl mb-2">🚀</span>
                <span className="text-white font-medium text-sm text-center">Quick Start</span>
              </Link>
              <Link 
                to="/guide/investment-guide?lang=en" 
                className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all border border-gray-700/50 hover:border-yellow-500/50"
              >
                <span className="text-3xl mb-2">📈</span>
                <span className="text-white font-medium text-sm text-center">Investments</span>
              </Link>
              <Link 
                to="/guide/withdrawal-guide?lang=en" 
                className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all border border-gray-700/50 hover:border-yellow-500/50"
              >
                <span className="text-3xl mb-2">💸</span>
                <span className="text-white font-medium text-sm text-center">Withdrawals</span>
              </Link>
              <Link 
                to="/guide/referral-guide?lang=en" 
                className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all border border-gray-700/50 hover:border-yellow-500/50"
              >
                <span className="text-3xl mb-2">👥</span>
                <span className="text-white font-medium text-sm text-center">Referrals</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-8 border border-yellow-500/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is available 24/7 to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-yellow-500/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </Link>
                <Link
                  to="/downloads/videos"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-yellow-500 text-yellow-500 font-semibold rounded-xl hover:bg-yellow-500/10 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Video Guides
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Available Languages Grid */}
        <div className="max-w-6xl mx-auto mt-12">
          <h3 className="text-xl font-semibold text-white text-center mb-6">Available in {LANGUAGES.length} Languages</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedLanguage === lang.code
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFGuides