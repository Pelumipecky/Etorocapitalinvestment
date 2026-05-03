import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/dashboard/Sidebar'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navbar */}
        <header className="bg-surface border-b border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4 sticky top-0 z-30 w-full">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-text hover:text-accent transition-colors p-1.5 sm:p-2"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Hidden on mobile, visible on md+ */}
            <h1 className="hidden md:block text-lg sm:text-xl font-semibold text-text truncate">
              Dashboard
            </h1>
            
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
              {/* Notifications */}
              <button className="relative p-1.5 sm:p-2 text-text hover:text-accent transition-colors rounded-lg hover:bg-surface/50">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-accent items-center justify-center text-background font-bold text-sm">
                  JD
                </div>
                {/* Mobile profile icon */}
                <div className="sm:hidden w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background font-bold text-xs">
                  J
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
