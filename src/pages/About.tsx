import { Link } from 'react-router-dom'
import { PLAN_CONFIG, formatPercent } from '@/utils/planConfig'

const packages = PLAN_CONFIG.map(plan => ({
  name: plan.name,
  description: plan.subtitle,
  bullets: [
    `Duration: ${plan.durationLabel}`,
    `Daily ROI: ${formatPercent(plan.dailyRate)}`,
    `Min Investment: $${plan.minCapital.toLocaleString()}`,
    `Max Investment: ${plan.maxCapital ? `$${plan.maxCapital.toLocaleString()}` : 'Unlimited'}`,
    `Total Return: ${plan.totalReturnPercent}%`
  ],
  footer: `Sample earnings: $${plan.sampleEarning.toLocaleString()} on minimum investment`
}))

function About() {
  return (
    <div className="about">
      <div className="about__hero">
        <h1>About eToro Trust Capital Investments</h1>
        <p className="lead">
          eToro Trust Capital Investments is a digital asset investment firm focused on secure, data-driven crypto portfolios. 
          We deliver risk-managed funds, tokenized asset strategies, and institutional-grade advisory services for 
          institutions and high-net-worth investors.
        </p>
      </div>

      <div className="about__content">
        <div className="about__main">
          <section>
            <h3>Our Mission</h3>
            <p>To unlock long-term financial growth through secure and intelligent exposure to blockchain markets.</p>
          </section>

          <section>
            <h3>What We Do</h3>
            <ul>
              <li>Advanced risk analytics and portfolio construction.</li>
              <li>Security-first custody and verification protocols for all holdings.</li>
              <li>AI-enhanced trading models and quantitative research.</li>
              <li>Tokenization and structured crypto fund management.</li>
              <li>Regulatory-aware advisory for institutional clients.</li>
            </ul>
          </section>

          <section>
            <h3>Core Values</h3>
            <ul>
              <li><strong>Security First:</strong> Every investment is vetted for security, compliance, and legitimacy.</li>
              <li><strong>Data-Driven Strategy:</strong> Decisions are backed by analytics, not hype.</li>
              <li><strong>Transparency:</strong> Full investor reporting and traceable blockchain audits.</li>
              <li><strong>Long-Term Growth:</strong> Focus on sustainable returns instead of gambling on short-term spikes.</li>
            </ul>
          </section>

          <section>
            <h3>Our Story</h3>
            <p>
              eToro Trust Capital was founded by financial analysts, cybersecurity engineers, and blockchain strategists who saw 
              the same problem in crypto: investing driven by hype, and fragile security that harmed investors' trust. 
              The firm's origin traces to 2020 after a founder lost assets in a platform breach. That experience led to 
              a mission: build an investment model where every asset is secured and verified — like storing value in a 
              vault — and invest with intelligence and discipline.
            </p>
          </section>

          <section>
            <h3>Why Choose eToro Trust Capital?</h3>
            <p>
              We combine institutional controls, encryption-aware custody practices, and AI-powered research to deliver 
              investment solutions that prioritize capital preservation and measurable, long-term growth.
            </p>
          </section>

          <div className="about__cta">
            <Link className="btn btn--primary" to="/signup">
              Get Started — Sign Up
            </Link>
            <a className="btn btn--ghost" href="/contact.html">
              Contact Sales
            </a>
          </div>
        </div>

        <aside className="about__sidebar">
          <div className="info-card">
            <h5>Institutional Services</h5>
            <p>
              Fund structuring, custody audits, portfolio management, and compliance support for institutions and family offices.
            </p>
          </div>

          <div className="info-card">
            <h5>Risk & Security</h5>
            <p>
              We run continuous security assessments and blockchain verification prior to allocation.
            </p>
          </div>
        </aside>
      </div>

      <section className="about__packages">
        <h3>Investment Packages</h3>
          <p className="lead">
          Choose from six curated portfolios that balance risk and opportunity across DeFi, blue-chip assets, and 
          tokenized real-world exposure. Each package is monitored daily by eToro Trust Capital's research desk.
        </p>
        
        <div className="package-grid">
          {packages.map((pkg) => (
            <article key={pkg.name} className="package-card">
              <h5>{pkg.name}</h5>
              <p>{pkg.description}</p>
              <ul>
                {pkg.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <footer className="package-card__footer">{pkg.footer}</footer>
            </article>
          ))}
        </div>

        <div className="about__packages-cta">
          <Link className="btn btn--primary" to="/packages">
            View Full Package Details
          </Link>
          <a className="btn btn--ghost" href="/contact.html">
            Talk to an Advisor
          </a>
        </div>
      </section>
    </div>
  )
}

export default About
