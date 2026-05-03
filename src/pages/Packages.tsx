import { Link } from 'react-router-dom'
import { PLAN_CONFIG, formatPercent } from '@/utils/planConfig'
import { useAuth } from '@/context/AuthContext'

const packages = PLAN_CONFIG.map(plan => ({
  name: plan.name,
  badge: plan.featured ? 'Featured' : 'Standard',
  badgeColor: plan.featured ? 'success' : 'primary',
  description: plan.subtitle,
  minimum: `$${plan.minCapital.toLocaleString()}`,
  maximum: plan.maxCapital ? `$${plan.maxCapital.toLocaleString()}` : 'Unlimited',
  dailyRoi: formatPercent(plan.dailyRate),
  duration: plan.durationLabel,
  totalReturn: `${plan.totalReturnPercent}%`,
  sample: `$${plan.sampleEarning.toLocaleString()}`
}))

interface PackagesProps {
  compact?: boolean
}

function Packages({ compact = false }: PackagesProps) {
  const { isAuthenticated } = useAuth()
  const HeadingTag = compact ? 'h2' : 'h1'
  const title = compact
    ? 'Investment plans built for short, medium, and long cycles'
    : 'Six investment plans for every growth strategy'
  const eyebrow = compact ? 'Investment plans' : 'eToro Trust Capital portfolios'
  const lead = compact
    ? 'Compare entry size, daily ROI, and time horizon at a glance, then move straight into onboarding or allocation.'
    : 'Pick the mix that matches your risk tolerance and liquidity needs. Each package is rebalanced by our research desk, comes with audited custody partners, and includes real-time reporting.'

  return (
    <div className={`packages-page${compact ? ' packages-page--compact' : ''}`}>
      <header className="packages-page__header">
        <div className="packages-page__header-shell">
          <div className="packages-page__copy">
            <p className="eyebrow">{eyebrow}</p>
            <HeadingTag>{title}</HeadingTag>
            <p className="lead">{lead}</p>
          </div>
          <div className="packages-page__actions">
            {isAuthenticated ? (
              <Link className="btn btn--primary" to="/dashboard">
                Go to Dashboard
              </Link>
            ) : (
              <Link className="btn btn--primary" to="/signup">
                Open an Account
              </Link>
            )}
            <Link className="btn btn--ghost" to="/contact">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </header>

      {!compact && (
        <div className="packages-page__access">
          <div>
            <h2>Already investing with eToro Trust Capital?</h2>
            <p>Launch your dashboard to allocate instantly, or spin up a new account in minutes.</p>
          </div>
          <div className="packages-page__access-actions">
            <Link className="btn btn--primary" to="/dashboard">
              Go to Dashboard
            </Link>
            <Link className="btn btn--ghost" to="/signup">
              Create an Account
            </Link>
          </div>
        </div>
      )}

      <div className="package-grid">
        {packages.map((pkg) => (
          <article key={pkg.name} className={`package-card${pkg.badgeColor === 'success' ? ' is-featured' : ''}`}>
            <div className="package-card__topbar">
              <span className={`package-badge package-badge--${pkg.badgeColor}`}>{pkg.badge}</span>
              <span className="package-card__duration">{pkg.duration}</span>
            </div>
            <div className="package-card__body">
              <h3>{pkg.name}</h3>
              <p className="package-card__description">{pkg.description}</p>

              <div className="package-card__stats">
                <div className="package-card__stat">
                  <span>Minimum</span>
                  <strong>{pkg.minimum}</strong>
                </div>
                <div className="package-card__stat">
                  <span>Daily ROI</span>
                  <strong>{pkg.dailyRoi}</strong>
                </div>
                <div className="package-card__stat">
                  <span>Maximum</span>
                  <strong>{pkg.maximum}</strong>
                </div>
              </div>

              <ul className="package-card__specs">
                <li>
                  <strong>Duration</strong>
                  <span>{pkg.duration}</span>
                </li>
                <li>
                  <strong>Total Return</strong>
                  <span>{pkg.totalReturn}</span>
                </li>
                <li>
                  <strong>Sample Earnings</strong>
                  <span>{pkg.sample}</span>
                </li>
              </ul>

              <div className="package-card__actions">
                {isAuthenticated ? (
                  <Link className="btn btn--primary" to="/dashboard">
                    Allocate Now
                  </Link>
                ) : (
                  <Link className="btn btn--primary" to="/signup">
                    Create an Account
                  </Link>
                )}
                <Link className="btn btn--ghost" to="/contact">
                  Talk to Support
                </Link>
                {!compact && !isAuthenticated ? (
                  <Link className="btn btn--ghost" to="/signup">
                    Compare with an Advisor
                  </Link>
                ) : null}
              </div>
            </div>
            <footer className="package-card__footer">
              <div>
                <span>Range</span>
                <strong>{pkg.minimum} - {pkg.maximum}</strong>
              </div>
              <div>
                <span>Best fit</span>
                <strong>{pkg.badge === 'Featured' ? 'Priority allocation' : 'Standard growth'}</strong>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Packages
