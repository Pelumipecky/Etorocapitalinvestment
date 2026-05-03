import { Link } from 'react-router-dom'

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Markets', href: '/markets' },
      { label: 'Packages', href: '/packages' },
      { label: 'FAQ', href: '/faq' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Downloads', href: '/downloads' },
      { label: 'PDF Guides', href: '/downloads/guides' },
      { label: 'Video Guides', href: '/downloads/videos' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign Up', href: '/signup' },
      { label: 'Log In', href: '/login' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Privacy Policy', href: '/privacy' }
    ]
  }
]

const supportItems = [
  { label: 'WhatsApp', value: '+1 730 241 6651', href: 'https://wa.me/17302416651', icon: 'icofont-brand-whatsapp' }
]

function FooterLink({ href, label }: { href: string; label: string }) {
  const isInternal = href.startsWith('/') && !href.endsWith('.html')

  if (isInternal) {
    return <Link to={href}>{label}</Link>
  }

  return <a href={href}>{label}</a>
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__shell">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo" aria-label="eToro Trust Capital">
            <img src="/images/big.png" alt="eToro Trust Capital" />
          </Link>
          <p className="site-footer__lede">
            Disciplined crypto allocation, guided onboarding, and direct support for clients who want clarity before they commit capital.
          </p>
          <ul className="site-footer__support-list">
            {supportItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>
                  <i className={item.icon} aria-hidden="true" />
                  <span>{item.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__columns">
          {footerSections.map((section) => (
            <div key={section.title} className="site-footer__column">
              <p className="site-footer__heading">{section.title}</p>
              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="site-footer__cta">
          <p className="site-footer__eyebrow">Need help fast?</p>
          <h3>Talk to the onboarding desk.</h3>
          <p>
            Ask about deposits, plan selection, verification, or account setup and get directed to the right next step.
          </p>
          <div className="site-footer__cta-actions">
            <Link className="btn btn--primary" to="/signup">
              Open an Account
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              Contact Support
            </Link>
          </div>
          <div className="site-footer__legal-links">
            <FooterLink href="/privacy" label="Privacy Policy" />
            <FooterLink href="/terms.html" label="Terms" />
          </div>
        </div>
      </div>

      <div className="site-footer__meta">
        <p>{'\u00A9'} {new Date().getFullYear()} eToro Trust Capital Investments. All rights reserved.</p>
        <div className="site-footer__meta-links">
          <FooterLink href="/privacy" label="Privacy" />
          <FooterLink href="/faq" label="FAQ" />
          <FooterLink href="/contact" label="Contact" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
