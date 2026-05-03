import { useState } from 'react'
import { Link } from 'react-router-dom'

const videoCategories = [
  { id: 'all', name: 'All Videos', count: 3 },
  { id: 'beginner', name: 'Getting Started', count: 1 },
  { id: 'investment', name: 'Investment Guides', count: 1 },
  { id: 'withdrawal', name: 'Withdrawals', count: 1 }
]

// Replace 'YOUR_VIDEO_ID' with actual YouTube video IDs from your channel
const videos = [
  {
    id: 1,
    title: 'How to Create an Account & Get Started',
    description: 'Complete step-by-step guide on creating your eToro Trust Capital account, verifying your identity (KYC), and navigating the dashboard for the first time.',
    duration: '8:45',
    views: '15.2K',
    likes: '1.2K',
    thumbnail: 'https://img.youtube.com/vi/YOUR_VIDEO_ID_1/maxresdefault.jpg',
    category: 'beginner',
    publishedAt: '2025-12-01',
    youtubeId: 'YOUR_VIDEO_ID_1' // Replace with actual YouTube video ID
  },
  {
    id: 2,
    title: 'How to Make Your First Investment',
    description: 'Learn how to deposit funds, choose the right investment plan, and start earning returns on eToro Trust Capital. Covers all available plans and expected ROI.',
    duration: '12:30',
    views: '22.8K',
    likes: '2.1K',
    thumbnail: 'https://img.youtube.com/vi/YOUR_VIDEO_ID_2/maxresdefault.jpg',
    category: 'investment',
    publishedAt: '2025-12-05',
    youtubeId: 'YOUR_VIDEO_ID_2' // Replace with actual YouTube video ID
  },
  {
    id: 3,
    title: 'How to Withdraw Your Earnings',
    description: 'Step-by-step tutorial on withdrawing your profits from eToro Trust Capital. Covers withdrawal methods, processing times, and tips for smooth transactions.',
    duration: '10:15',
    views: '18.5K',
    likes: '1.8K',
    thumbnail: 'https://img.youtube.com/vi/YOUR_VIDEO_ID_3/maxresdefault.jpg',
    category: 'withdrawal',
    publishedAt: '2025-12-10',
    youtubeId: 'YOUR_VIDEO_ID_3' // Replace with actual YouTube video ID
  }
]

function YouTubeVideos() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatViews = (views: string) => {
    const num = parseInt(views.replace('K', '000'))
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return views
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div className="youtube-videos-page">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/downloads" className="inline-flex items-center text-red-500 hover:text-red-400 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Downloads
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Video Tutorials</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch our comprehensive video series covering trading strategies, platform features, and market analysis.
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white pl-12 focus:border-red-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {videoCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map(video => (
            <a 
              key={video.id} 
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300 group block"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-700 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="text-white text-sm font-medium">Click to Watch</div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>

              {/* Video Info */}
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg mb-3 leading-tight group-hover:text-red-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {formatViews(video.views)}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {video.likes}
                    </span>
                  </div>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Subscribe to Channel CTA */}
        {filteredVideos.length > 0 && (
          <div className="text-center mt-12">
            <a 
              href="https://www.youtube.com/@YourChannelName" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe to Our YouTube Channel
            </a>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-8 border border-red-500/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified when we release new video tutorials and educational content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YouTubeVideos