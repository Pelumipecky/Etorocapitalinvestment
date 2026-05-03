import { useState } from 'react'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign Up" in the navigation, complete identity verification (KYC), and fund your account via bank transfer, wire, or supported stablecoins.'
      },
      {
        q: 'What is the minimum investment?',
        a: 'Our Genesis Starter package begins at $5,000. Higher-tier packages range from $15,000 to $250,000 depending on mandate complexity.'
      },
      {
        q: 'How long does account approval take?',
        a: 'Most accounts are approved within 24–48 hours after submitting KYC documents. Institutional clients may require additional compliance review.'
      }
    ]
  },
  {
    category: 'Security & Custody',
    questions: [
      {
        q: 'Where are my assets stored?',
        a: 'All assets are held with institutional-grade custody partners meeting SOC 2 Type II and insurance standards. We never commingle client funds.'
      },
      {
        q: 'Are funds insured?',
        a: 'Yes. Our custody partners maintain crime insurance and specie policies covering digital assets up to $500M aggregate.'
      },
      {
        q: 'Can I withdraw anytime?',
        a: 'Each package has a specified lockup period. After lockup, most accounts offer quarterly redemption windows with 30-day notice.'
      }
    ]
  },
  {
    category: 'Fees & Pricing',
    questions: [
      {
        q: 'What fees does eToro Trust Capital charge?',
        a: 'Management fees range from 0.75%–2% AUM annually depending on package. Performance fees apply to certain growth strategies (typically 15–20% above high-water mark).'
      },
      {
        q: 'Are there deposit or withdrawal fees?',
        a: 'No deposit fees. Wire transfers and on-chain withdrawals incur network costs only (typically $10–$50).'
      },
      {
        q: 'How are returns calculated?',
        a: 'Returns are net of management fees and reflect actual NAV performance. Projections are illustrative; past performance does not guarantee future results.'
      }
    ]
  },
  {
    category: 'Investment Strategy',
    questions: [
      {
        q: 'Who manages the portfolios?',
        a: 'Our research desk includes quant analysts, former DeFi protocol leads, and risk managers from traditional finance. All strategies undergo monthly audits.'
      },
      {
        q: 'Can I customize my allocation?',
        a: 'Institutional Prime clients ($250K+) can request custom mandates. Standard packages follow preset allocations to maintain risk parity.'
      },
      {
        q: 'How often are portfolios rebalanced?',
        a: 'Conservative packages rebalance monthly. Growth strategies may rebalance weekly based on momentum signals and volatility thresholds.'
      }
    ]
  },
  {
    category: 'Support & Reporting',
    questions: [
      {
        q: 'How do I contact support?',
        a: 'Use our 24/7 live chat, the support page, or schedule a call with your dedicated advisor (available for accounts $50K+).'
      },
      {
        q: 'What reporting do I receive?',
        a: 'Real-time dashboard access, monthly performance letters, quarterly custody attestations, and annual tax documents (1099, K-1 for US clients).'
      },
      {
        q: 'Is there a mobile app?',
        a: 'Yes. Download from the App Store, Google Play, or APK for Android. Desktop clients available for Windows, macOS, and Linux.'
      }
    ]
  }
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="faq-page">
      <div className="faq-page__header">
        <h1>Frequently Asked Questions</h1>
        <p className="lead">
            Find answers to common questions about eToro Trust Capital accounts, custody, fees, and investment strategies.
          </p>
      </div>
      <div className="faq-page__content">
        {faqs.map((category, catIndex) => (
          <section key={category.category} className="faq-category">
            <h2>{category.category}</h2>
            <div className="faq-list">
              {category.questions.map((faq, qIndex) => {
                const key = `${catIndex}-${qIndex}`
                const isOpen = openIndex === key
                return (
                  <div key={qIndex} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
                    <button
                      className="faq-item__question"
                      onClick={() => toggleQuestion(catIndex, qIndex)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <span className="faq-item__icon">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-item__answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="faq-page__footer">
        <h3>Still have questions?</h3>
        <p>Our team is available 24/7 to help you get started.</p>
        <div className="faq-page__footer-actions">
          <a className="btn btn--primary" href="/contact.html">
            Contact Support
          </a>
          <a className="btn btn--ghost" href="/chat.html">
            Live Chat
          </a>
        </div>
      </div>
    </div>
  )
}

export default FAQ
