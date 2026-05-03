import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Downloads() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-4 border border-blue-500/20">
            Resource Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Downloads & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Resources</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Access our comprehensive guides, video tutorials, and trading applications to maximize your financial potential.
          </p>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-16"
      >
        {/* Main Resource Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* PDF Guides Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-yellow-500/10"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-yellow-500/20">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-yellow-500/20">Updated</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">PDF User Guides</h3>
              <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                Comprehensive documentation covering everything from account setup to advanced trading strategies. Available in 20+ languages for our global community.
              </p>
              
              <Link 
                to="/downloads/guides" 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40"
              >
                <span>Browse Guides</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* YouTube Videos Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-red-500/10"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-red-500/20">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-500/20">New Series</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">Video Tutorials</h3>
              <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                Visual learning made easy. Watch our expert traders break down market analysis, platform features, and investment tips in high-definition video.
              </p>
              
              <Link 
                to="/downloads/videos" 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40"
              >
                <span>Watch Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Desktop Applications Section */}
        <motion.div variants={itemVariants} className="pt-12 border-t border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-10">
            <h2 className="text-3xl font-bold text-white">Desktop Trading App</h2>
            <span className="bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded font-mono">v2.4.0</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Windows */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.449L24 3.449v9.451H10.949m-2.099 10.1L0 20.551V11.1h8.85m13.101-2.55L24 20.551V11.1H21.951"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">Windows</h3>
                  <p className="text-gray-500 text-sm">64-bit</p>
                </div>
              </div>
              <button disabled className="w-full py-3 bg-gray-700/50 text-gray-400 rounded-lg font-medium cursor-not-allowed border border-gray-700 hover:bg-gray-700 transition flex items-center justify-center gap-2">
                <span>Coming Soon</span>
              </button>
            </div>

            {/* macOS */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 hover:border-gray-400/50 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-gray-300 transition-colors">macOS</h3>
                  <p className="text-gray-500 text-sm">Intel & M-Series</p>
                </div>
              </div>
              <button disabled className="w-full py-3 bg-gray-700/50 text-gray-400 rounded-lg font-medium cursor-not-allowed border border-gray-700 hover:bg-gray-700 transition flex items-center justify-center gap-2">
                <span>Coming Soon</span>
              </button>
            </div>

            {/* Linux */}
            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.23 12.004a2.236 2.236 0 0 0 .055-1.015c-.153-.67-.665-1.207-1.298-1.203-.298.002-.539.112-.793.29-.406.286-.628.64-.628 1.106 0 .52.184.927.564 1.242.256.21.564.316.854.316.387 0 .693-.145.95-.406.23-.234.346-.54.296-.83zm-1.406-6.254c.0.0-.097-.015-.293-.027-.484-.03-1.133.178-1.605.533-.624.47-.964 1.086-.964 1.72 0 .37.13.706.376.97.118.127.25.23.39.305.0.0-.096-.034-.23-.08-.244-.086-.455-.214-.455-.214s-.096.034-.23.08c-.244.086-.455.214-.455.214.14-.075.272-.178.39-.305.246-.264.376-.6.376-.97 0-.634-.34-1.25-.964-1.72-.472-.355-1.12-.563-1.605-.533-.196.012-.293.027-.293.027s.293-1.254.293-1.254c.472-.355 1.12-.563 1.605-.533.196.012.293.027.293.027s-.293 1.254-.293 1.254z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">Linux</h3>
                  <p className="text-gray-500 text-sm">Ubuntu/Debian</p>
                </div>
              </div>
              <button disabled className="w-full py-3 bg-gray-700/50 text-gray-400 rounded-lg font-medium cursor-not-allowed border border-gray-700 hover:bg-gray-700 transition flex items-center justify-center gap-2">
                <span>Coming Soon</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )

}

export default Downloads