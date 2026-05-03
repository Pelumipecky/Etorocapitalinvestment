import { Link } from 'react-router-dom'

const policySections = [
  {
    title: 'Information We Collect',
    body: [
      'We collect information you provide directly when you create an account, contact support, complete identity verification, submit forms, or use account features on the platform.',
      'Depending on how you use the service, this may include your name, email address, phone number, account credentials, government-issued verification documents, wallet or transaction details, support messages, and any other information you choose to share with us.'
    ],
    bullets: [
      'Account and profile information you enter during registration or onboarding.',
      'Verification and compliance records required to review identity, payments, or withdrawals.',
      'Usage, device, and browser data such as IP address, pages visited, referral source, and session activity.',
      'Communications you send to us through forms, live chat, or WhatsApp.'
    ]
  },
  {
    title: 'How We Use Information',
    body: [
      'We use personal information to operate the website, secure user accounts, process transactions, respond to support requests, and improve platform performance.'
    ],
    bullets: [
      'Provide, maintain, and personalize the services you request.',
      'Verify identity, detect fraud, prevent abuse, and protect the platform.',
      'Process deposits, withdrawals, investment actions, and related account notifications.',
      'Send transactional emails, support responses, and service updates.',
      'Comply with legal, regulatory, tax, audit, and record-keeping obligations.'
    ]
  },
  {
    title: 'Cookies and Similar Technologies',
    body: [
      'We may use cookies, local storage, analytics tools, and similar technologies to remember preferences, keep you signed in, understand traffic patterns, and improve site reliability.',
      'You can control cookies through your browser settings, but some features may not function properly if essential storage technologies are disabled.'
    ]
  },
  {
    title: 'When We Share Information',
    body: [
      'We do not sell your personal information. We may share data only when it is needed to run the service, meet legal obligations, or protect our users and business.'
    ],
    bullets: [
      'Service providers that help us with hosting, infrastructure, communications, security, analytics, customer support, and compliance operations.',
      'Professional advisers, regulators, law enforcement, or courts when disclosure is legally required or reasonably necessary.',
      'A successor or acquiring entity if the business is reorganized, merged, sold, or transferred.'
    ]
  },
  {
    title: 'Data Retention and Security',
    body: [
      'We retain personal information for as long as reasonably necessary to provide the service, maintain accurate records, resolve disputes, enforce our agreements, and satisfy legal or regulatory requirements.',
      'We use administrative, technical, and organizational safeguards designed to protect personal data, but no internet-based service can guarantee absolute security.'
    ]
  },
  {
    title: 'Your Rights and Choices',
    body: [
      'Depending on your location, you may have rights to access, correct, delete, or restrict certain uses of your personal information.'
    ],
    bullets: [
      'Update profile details inside your account where available.',
      'Request access, correction, or deletion by contacting our support team.',
      'Opt out of non-essential marketing communications by using the unsubscribe link or contacting us directly.',
      'Ask questions about how your information is collected, used, or retained.'
    ]
  },
  {
    title: 'Children’s Privacy',
    body: [
      'This website and its services are intended for adults. We do not knowingly collect personal information from children or anyone under the age required to legally use financial services in their jurisdiction.'
    ]
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory changes. When we make material updates, we will revise the effective date on this page and, when appropriate, provide additional notice within the platform.'
    ]
  }
]

const supportChannels = [
  {
    label: 'WhatsApp',
    value: '+1 730 241 6651',
    href: 'https://wa.me/17302416651'
  }
]

function PrivacyPolicy() {
  return (
    <div className="about legal-page">
      <div className="about__hero">
        <span className="legal-page__tag">Privacy Policy</span>
        <h1>Your personal information, handled with clarity.</h1>
        <p className="lead">
          This Privacy Policy explains how eToro Trust Capital Investments collects, uses, stores, and shares
          personal information when you visit our website, create an account, contact support, or use services
          available through the platform.
        </p>
        <div className="legal-page__meta">
          <span>Effective date: April 26, 2026</span>
          <span>Applies to website, accounts, support, and transaction workflows</span>
        </div>
      </div>

      <div className="about__content">
        <div className="about__main legal-page__main">
          {policySections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section>
            <h3>Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy or want to make a privacy-related request, contact
              our team using the details below.
            </p>
            <ul className="legal-page__contact-list">
              {supportChannels.map((channel) => (
                <li key={channel.label}>
                  <strong>{channel.label}:</strong>{' '}
                  <a href={channel.href} target="_blank" rel="noreferrer">
                    {channel.value}
                  </a>
                </li>
              ))}
              <li>
                <strong>Contact form:</strong> <Link to="/contact">Use the support page</Link>
              </li>
            </ul>
          </section>

          <p className="legal-page__note">
            This page provides a working privacy notice for the site. If you operate in a regulated market or need
            jurisdiction-specific wording, have counsel review the policy before publishing it as final legal text.
          </p>

          <div className="about__cta">
            <Link className="btn btn--primary" to="/contact">
              Contact Support
            </Link>
            <Link className="btn btn--ghost" to="/signup">
              Create an Account
            </Link>
          </div>
        </div>

        <aside className="about__sidebar">
          <div className="info-card">
            <h5>Quick Summary</h5>
            <p>
              We collect account, transaction, verification, device, and support information so we can operate the
              platform securely and meet compliance obligations.
            </p>
          </div>

          <div className="info-card">
            <h5>Privacy Requests</h5>
            <p>
              To request access, correction, or deletion, use the contact page and include the details associated
              with your account so we can verify the request safely.
            </p>
          </div>

          <div className="info-card">
            <h5>Need Help Fast?</h5>
            <p>
              Use the contact page for formal support requests, or reach out through WhatsApp for guided assistance.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default PrivacyPolicy
