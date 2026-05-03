import { useParams, Link, useSearchParams } from 'react-router-dom'
import { GUIDE_CONTENT } from '@/data/guideContent'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { applyGoogleTranslateLanguage, normalizeLanguageCode } from '@/i18n'

function GuideReader() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const langCode = normalizeLanguageCode(searchParams.get('lang') || 'en')
  const { i18n } = useTranslation()
  const guide = id ? GUIDE_CONTENT[id] : null
  const [activeSection, setActiveSection] = useState(0)

  // Sync language with i18n if changed via URL
  useEffect(() => {
    if (langCode !== normalizeLanguageCode(i18n.resolvedLanguage || i18n.language)) {
      void i18n.changeLanguage(langCode)
    }

    applyGoogleTranslateLanguage(langCode)
    window.setTimeout(() => applyGoogleTranslateLanguage(langCode), 300)
  }, [langCode, i18n])

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl text-white font-bold mb-4">Guide Not Found</h1>
          <p className="text-gray-400 mb-8">The guide you are looking for does not exist.</p>
          <Link to="/downloads/pdf-guides" className="text-yellow-500 hover:text-yellow-400 font-medium">
            &larr; Back to Guides
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-gray-800 border-r border-gray-700 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <div className="p-6">
          <Link to="/downloads/pdf-guides" className="inline-flex items-center text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to User Guides
          </Link>
          
          <h1 className="text-xl font-bold text-white mb-2">{guide.title}</h1>
          <p className="text-sm text-gray-400 mb-6">{guide.subtitle}</p>
          
          <nav className="space-y-1">
            {guide.sections.map((section, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSection(idx)
                  document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === idx 
                    ? 'bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white border-l-4 border-transparent'
                }`}
              >
                {idx + 1}. {section.title}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-700">
             <button 
               onClick={() => window.print()}
               className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
             >
               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
               </svg>
               Print / Save as PDF
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto">
        <div className="print:hidden mb-6 flex items-center gap-2">
           <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
             User Guide
           </span>
           <span className="text-gray-500 text-sm">
             Reading in {langCode.toUpperCase()}
           </span>
        </div>

        <article className="prose prose-invert prose-lg max-w-none">
           {/* dynamic content rendered here */}
           {guide.sections.map((section, idx) => (
             <div key={idx} id={`section-${idx}`} className="mb-16 scroll-mt-12">
               <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                 <span className="bg-gray-800 text-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 border border-gray-700">
                   {idx + 1}
                 </span>
                 {section.title}
               </h2>
               <div 
                 className="text-gray-300 leading-relaxed bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50"
                 dangerouslySetInnerHTML={{ __html: section.content }}
               />
             </div>
           ))}
        </article>

        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6">Our support team is just a click away.</p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors">
              Contact Support
            </Link>
            <Link to="/downloads/videos" className="px-6 py-2 border border-year-500 text-yellow-500 hover:bg-yellow-500/10 rounded-lg font-medium transition-colors">
              Video Tutorials
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GuideReader
