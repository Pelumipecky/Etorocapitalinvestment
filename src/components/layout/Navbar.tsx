import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Packages', href: '/packages' },
  { label: 'Markets', href: '/markets' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' }
]

const downloadLinks = [
  { label: 'PDF Guide', href: '/downloads/guides', icon: 'icofont-file-pdf' },
  { label: 'Video Guide', href: '/downloads/videos', icon: 'icofont-play-alt-2' }
]

const tickerItems = [
  { icon: 'icofont-shield-alt', text: 'Security-first custody architecture for every account' },
  { icon: 'icofont-chart-growth', text: 'Structured crypto portfolios guided by disciplined market research' },
  { icon: 'icofont-live-support', text: '24/7 onboarding help, KYC guidance, and client support' },
  { icon: 'icofont-stock-mobile', text: 'Flexible funding routes across BTC, ETH, USDT, and bank transfer' },
  { icon: 'icofont-book-alt', text: 'Download platform guides and video walkthroughs anytime' }
]

const tickerLoop = [...tickerItems, ...tickerItems]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const downloadMenuRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const displayRole = user?.role === 'superadmin' ? 'Super Admin' : user?.role || 'Client'
  const userInitial = displayName.charAt(0).toUpperCase()

  const closeMenu = () => {
    setIsOpen(false)
    setDownloadMenuOpen(false)
    setUserMenuOpen(false)
  }

  const handleNavClick = () => {
    closeMenu()
  }

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const handleDashboard = () => {
    closeMenu()
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  const toggleDownloadMenu = () => {
    setDownloadMenuOpen((prev) => {
      const next = !prev
      if (next) setUserMenuOpen(false)
      return next
    })
  }

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => {
      const next = !prev
      if (next) setDownloadMenuOpen(false)
      return next
    })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
      <header className="navbar">
      <div className="navbar__ticker" aria-label="Platform highlights">
        <div className="navbar__ticker-viewport">
          <div className="navbar__ticker-track">
            {tickerLoop.map((item, index) => (
              <span
                className="navbar__ticker-item"
                key={`${item.text}-${index}`}
                aria-hidden={index >= tickerItems.length}
              >
                <i className={item.icon} aria-hidden="true" />
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="navbar__inner">
        <Link
          to="/"
          className="navbar__brand"
          onClick={closeMenu}
          aria-label="eToro Trust Capital"
        >
          <span className="navbar__brand-panel">
            <img
              src="/images/big.png"
              alt="eToro Trust Capital"
              className="navbar__brand-logo"
            />
          </span>
        </Link>

        <nav
          id="navbar-menu"
          className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}
        >
          <div className="navbar__links-list">
            {navLinks.map(({ label, href }) => (
              href.startsWith('/#') ? (
                <a
                  key={label}
                  href={href}
                  onClick={handleNavClick}
                  className="navbar__nav-link"
                >
                  {t(`nav.${label.toLowerCase()}`)}
                </a>
              ) : (
                <NavLink
                  key={label}
                  to={href}
                  onClick={handleNavClick}
                  className={({ isActive }) => `navbar__nav-link${isActive ? ' is-active' : ''}`}
                >
                  {t(`nav.${label.toLowerCase()}`)}
                </NavLink>
              )
            ))}

            <div ref={downloadMenuRef} className="navbar__download-dropdown">
              <button
                type="button"
                onClick={toggleDownloadMenu}
                className={`navbar__dropdown-trigger${downloadMenuOpen ? ' is-open' : ''}`}
                aria-expanded={downloadMenuOpen}
                aria-haspopup="menu"
              >
                <span>{t('nav.downloads', 'Downloads')}</span>
                <i className="icofont-simple-down navbar__dropdown-icon" aria-hidden="true" />
              </button>

              {downloadMenuOpen && (
                <div className="navbar__menu navbar__menu--downloads" role="menu">
                  {downloadLinks.map(({ label, href, icon }) => (
                    <Link
                      key={label}
                      to={href}
                      className="navbar__menu-link"
                      onClick={handleNavClick}
                    >
                      <i className={icon} aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="navbar__cta-group">
            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="navbar__user-dropdown">
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  className={`navbar__profile-btn${userMenuOpen ? ' is-open' : ''}`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="navbar__avatar-shell">
                    <span className="navbar__avatar-fallback">{userInitial}</span>
                    {user.avatar ? (
                      <img
                        src={`/images/${user.avatar}.svg`}
                        alt=""
                        className="navbar__avatar-image"
                        onError={(event) => {
                          const target = event.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : null}
                  </span>

                  <span className="navbar__profile-meta">
                    <span className="navbar__profile-name">{displayName}</span>
                    <span className="navbar__profile-role">{displayRole}</span>
                  </span>

                  <i className="icofont-simple-down navbar__dropdown-icon" aria-hidden="true" />
                </button>

                {userMenuOpen && (
                  <div className="navbar__menu navbar__menu--user" role="menu">
                    <div className="navbar__menu-header">
                      <span className="navbar__menu-user">{displayName}</span>
                      <span className="navbar__menu-email">{user.email}</span>
                    </div>

                    <button type="button" className="navbar__menu-button" onClick={handleDashboard}>
                      <i className="icofont-dashboard-web" aria-hidden="true" />
                      <span>{t('nav.dashboard')}</span>
                    </button>

                    <button type="button" className="navbar__menu-button is-danger" onClick={handleLogout}>
                      <i className="icofont-logout" aria-hidden="true" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="btn btn--primary" to="/signup" onClick={handleNavClick}>
                  {t('nav.signup')}
                </Link>
                <Link className="btn btn--ghost" to="/login" onClick={handleNavClick}>
                  {t('nav.login')}
                </Link>
              </>
            )}

            <div className="navbar__lang-wrap">
              <LanguageSwitcher variant="navbar" />
            </div>
          </div>

          <div className="navbar__mobile-lang">
            <LanguageSwitcher variant="navbar" />
          </div>
        </nav>

        <button
          className="navbar__toggle"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/55 z-[999] md:hidden"
          onClick={closeMenu}
          role="presentation"
          aria-hidden="true"
        />
      )}
    </header>
  )
}

export default Navbar
