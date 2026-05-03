
export interface GuideSection {
  title: string;
  content: string;
}

export interface GuideContent {
  id: string;
  title: string;
  subtitle: string;
  sections: GuideSection[];
}

export const GUIDE_CONTENT: Record<string, GuideContent> = {
  'getting-started': {
    id: 'getting-started',
    title: 'Getting Started with eToro Trust Capital',
    subtitle: 'Your journey to financial freedom begins here',
    sections: [
      {
        title: 'Creating Your Account',
        content: `
          <p>Welcome to eToro Trust Capital! Creating an account is the first step towards your investment journey. Follow these simple steps:</p>
          <ol>
            <li>Click on the <strong>"Get Started"</strong> or "Sign Up" button on the homepage.</li>
            <li>Fill in your personal details including your full name, email address, and phone number.</li>
            <li>Choose a secure password. We recommend using a combination of letters, numbers, and special characters.</li>
            <li>Enter a referral code if you were invited by a friend (optional).</li>
            <li>Agree to the Terms of Service and click "Create Account".</li>
          </ol>
          <p>Once registered, check your email for a verification link to activate your account.</p>
        `
      },
      {
        title: 'Verifying Your Identity (KYC)',
        content: `
          <p>To comply with financial regulations and ensure the security of our platform, all users must complete KYC (Know Your Customer) verification before making withdrawals.</p>
          <ul>
            <li>Log in to your dashboard and navigate to the <strong>KYC Verification</strong> tab (or "Verify Identity").</li>
            <li>You will need to upload a valid government-issued ID (Passport, Driver's License, or National ID).</li>
            <li>Upload a clear photo of the front and back of your ID.</li>
            <li>Take a selfie holding your ID and a piece of paper with "eToro Trust Capital" and today's date written on it.</li>
            <li>Submit your documents. Verification typically takes 1-24 hours.</li>
          </ul>
        `
      },
      {
        title: 'Navigating Your Dashboard',
        content: `
          <p>Your user dashboard is the command center for your investments.</p>
          <ul>
            <li><strong>Overview:</strong> See your total balance, active investments, and recent activity at a glance.</li>
            <li><strong>Investments:</strong> View available plans and track your active portfolios.</li>
            <li><strong>Deposit:</strong> Fund your account using various payment methods.</li>
            <li><strong>Withdraw:</strong> Request payouts of your earnings.</li>
            <li><strong>Stocks:</strong> Access the stock trading interface for market speculation.</li>
          </ul>
        `
      }
    ]
  },
  'investment-guide': {
    id: 'investment-guide',
    title: 'Investment Plans & Strategies',
    subtitle: 'Maximize your returns with our tailored investment packages',
    sections: [
      {
        title: 'Understanding Our Plans',
        content: `
          <p>eToro Trust Capital offers a variety of investment plans designed for different goals and capital levels.</p>
          <ul>
            <li><strong>3-Day Plan (Quick Start):</strong> Perfect for beginners. Earn 10% daily for 3 days. Min: $100.</li>
            <li><strong>7-Day Plan (Weekly Growth):</strong> solid returns. Earn 3% daily for 7 days. Min: $599.</li>
            <li><strong>15-Day Plan (Extended Growth):</strong> Our most popular plan. Earn 4% daily for 15 days. Min: $3,000.</li>
            <li><strong>6-Month Plan (Long Term):</strong> For serious investors. Earn 5% daily for 6 months. Min: $15,999.</li>
          </ul>
        `
      },
      {
        title: 'How ROI Works',
        content: `
          <p>ROI (Return on Investment) is credited to your account balance every 24 hours from the time your investment becomes active.</p>
          <p>For example, if you invest <strong>$1,000</strong> in the 15-Day Plan (4% daily):</p>
          <ul>
            <li>You earn <strong>$40</strong> every day.</li>
            <li>Over 15 days, you earn a total profit of <strong>$600</strong>.</li>
            <li>At the end of the term, your initial capital ($1,000) is returned.</li>
            <li><strong>Total Payout: $1,600</strong>.</li>
          </ul>
        `
      },
      {
        title: 'Compounding Strategy',
        content: `
          <p>To maximize your wealth, consider reinvesting your daily earnings. By reinvesting your profits into new plans, you can benefit from compound interest, significantly increasing your total returns over time.</p>
        `
      }
    ]
  },
  'deposit-guide': {
    id: 'deposit-guide',
    title: 'Deposit & Funding Guide',
    subtitle: 'Securely funding your eToro Trust Capital account',
    sections: [
      {
        title: 'Deposit Methods',
        content: `
          <p>We support multiple secure funding options to ensure convenience for all users:</p>
          <ul>
            <li><strong>Cryptocurrency:</strong> Bitcoin (BTC), Ethereum (ETH), USDT (TRC20 & ERC20), BNB, Solana, and more.</li>
            <li><strong>Bank Transfer:</strong> Direct wire transfers for larger amounts (contact support for details).</li>
          </ul>
        `
      },
      {
        title: 'How to Deposit',
        content: `
          <ol>
            <li>Go to the <strong>Deposit</strong> section in your dashboard.</li>
            <li>Select your preferred payment method (e.g., "Crypto Deposit").</li>
            <li>Enter the amount you wish to deposit.</li>
            <li>The system will generate a unique wallet address and QR code.</li>
            <li>Send the exact amount from your crypto wallet or exchange to the address provided.</li>
            <li><strong>Important:</strong> After sending, copy the "Transaction Hash" (TXID) from your wallet.</li>
            <li>Paste the Transaction Hash into the proof field and upload a screenshot of the payment.</li>
            <li>Click "Submit Payment". Your deposit will be credited automatically after blockchain confirmation (usually 10-30 mins).</li>
          </ol>
        `
      }
    ]
  },
  'withdrawal-guide': {
    id: 'withdrawal-guide',
    title: 'Withdrawal Guide',
    subtitle: 'Accessing your profits securely',
    sections: [
      {
        title: 'Withdrawal Rules',
        content: `
          <p>We prioritize the security of your funds. Here are the key rules for withdrawals:</p>
          <ul>
            <li>Withdrawals are processed 24/7.</li>
            <li>Minimum withdrawal amount varies by method (typically $10 or equivalent).</li>
            <li>You must have an active balance (Available Balance) to withdraw. Locked capital in active investments cannot be withdrawn until the plan completes.</li>
            <li>KYC verification may be required for large withdrawals.</li>
          </ul>
        `
      },
      {
        title: 'How to Request a Withdrawal',
        content: `
          <ol>
            <li>Navigate to the "Withdraw" section in your dashboard.</li>
            <li>Select the withdrawal method (e.g., Bitcoin Wallet, USDT Address).</li>
            <li>Enter your destination wallet address clearly. Double-check for typos!</li>
            <li>Enter the amount to withdraw.</li>
            <li>Enter your account password or 2FA code if enabled.</li>
            <li>Click "Request Withdrawal".</li>
          </ol>
          <p>Most withdrawals are processed instantly or within a few hours. In rare cases, unrelated to network congestion, it may take up to 24 hours.</p>
        `
      }
    ]
  },
  'referral-guide': {
    id: 'referral-guide',
    title: 'Referral Program Guide',
    subtitle: 'Earn passive income by inviting friends',
    sections: [
      {
        title: 'How It Works',
        content: `
          <p>The eToro Trust Capital Referral Program rewards you for bringing new investors to the platform.</p>
          <ul>
            <li>You earn a <strong>10% direct commission</strong> on every deposit made by your referrals.</li>
            <li>Commissions are credited instantly to your account balance and can be withdrawn or reinvested immediately.</li>
          </ul>
        `
      },
      {
        title: 'Finding Your Link',
        content: `
          <p>Your unique referral link is located on your dashboard home screen. Click the "Copy" icon next to your link to share it via social media, email, or chat.</p>
        `
      }
    ]
  },
  'loan-guide': {
    id: 'loan-guide',
    title: 'Loan Application Guide',
    subtitle: 'Leverage your assets for short-term liquidity',
    sections: [
      {
        title: 'Eligibility',
        content: `
          <p>Active investors can apply for a loan against their active investment portfolio.</p>
          <ul>
            <li>You must have at least one active investment running for more than 15 days.</li>
            <li>Your account must be fully verified (KYC Approved).</li>
            <li>Loan-to-Value (LTV) ratio is typically up to 50% of your active capital.</li>
          </ul>
        `
      },
      {
        title: 'Application Process',
        content: `
          <ol>
            <li>Go to the "Loans" section in the dashboard.</li>
            <li>Click "Apply for Loan".</li>
            <li>Enter the loan amount required and the reason for the loan.</li>
            <li>Review the interest rate and repayment terms presented.</li>
            <li>Submit your application. Loan requests are typically reviewed within 24-48 hours.</li>
          </ol>
        `
      }
    ]
  },
  'complete-guide': {
    id: 'complete-guide',
    title: 'Complete User Guide',
    subtitle: 'Your all-in-one resource for eToro Trust Capital',
    sections: [
      {
        title: 'Introduction',
        content: '<p>This complete guide combines all specialized guides into one document. Use the table of contents to navigate to specific sections.</p>'
      },
      {
        title: 'Getting Started',
        content: `
          <h3>Creating Your Account</h3>
          <p>Welcome to eToro Trust Capital! Creating an account is the first step towards your investment journey...</p>
          <h3>KYC Verification</h3>
          <p>To comply with financial regulations, all users must complete KYC...</p>
        `
      },
      {
        title: 'Funding Your Account',
        content: `
          <h3>Deposits</h3>
          <p>We support multiple secure funding options including Bitcoin, Ethereum, and USDT...</p>
        `
      },
      {
        title: 'Investment Strategies',
        content: `
          <h3>Choosing a Plan</h3>
          <p>eToro Trust Capital offers a variety of investment plans designed for different goals...</p>
        `
      },
      {
        title: 'Security',
        content: `
          <h3>Protecting Your Assets</h3>
          <p>Enable Two-Factor Authentication (2FA) in your profile settings immediately after signing up...</p>
        `
      }
    ]
  },
    'kyc-guide': {
    id: 'kyc-guide',
    title: 'KYC Verification Guide',
    subtitle: 'Complete Guide to Identity Verification',
    sections: [
       {
        title: 'Why is KYC Required?',
        content: `
          <p>KYC (Know Your Customer) is a mandatory process used to verify the identity of our clients. 
          This helps prevent fraud, money laundering, and ensures compliance with international financial regulations. 
          Your data is encrypted and stored securely.</p>
        `
      },
      {
        title: 'Step-by-Step Verification',
        content: `
          <ol>
            <li><strong>Login:</strong> Access your User Dashboard and find the notification banner or proceed to Profile Settings.</li>
            <li><strong>Start Verification:</strong> Click on "Verify Identity".</li>
            <li><strong>Personal Info:</strong> Ensure your profile details (Name, Address, DOB) match your ID exactly. Update them if necessary.</li>
            <li><strong>Upload ID:</strong> Upload a clear, color photo of your Passport, Driver's License, or National ID Card. 
                Ensure all four corners are visible and text is readable.</li>
            <li><strong>Proof of Address (Optional):</strong> Some regions may require a utility bill or bank statement less than 3 months old.</li>
            <li><strong>Selfie Check:</strong> Take a real-time photo of yourself holding your ID to prove you are the owner of the document.</li>
            <li><strong>Submit:</strong> Click to submit your application.</li>
          </ol>
        `
      },
      {
        title: 'Common Rejection Reasons',
        content: `
          <ul>
            <li>Blurry or cutoff images.</li>
            <li>Expired documents.</li>
            <li>Name on account does not match name on ID.</li>
            <li>Screenshots of IDs are not accepted (must be a photo of the physical document).</li>
          </ul>
        `
      }
    ]
  },
  'roi-calculator': {
    id: 'roi-calculator',
    title: 'ROI & Earnings Calculator',
    subtitle: 'Understanding Your Returns',
    sections: [
      {
        title: 'How ROI is Calculated',
        content: `
          <p>ROI (Return on Investment) represents the profit you earn on your capital.</p>
          <p><strong>Formula:</strong> <code>Daily ROI = Capital × Daily Rate</code></p>
          <p>Example: $1,000 investment in 15-Day Plan (4% daily).</p>
          <p><code>$1,000 × 0.04 = $40 per day</code></p>
        `
      },
      {
        title: 'Total Return Breakdown',
        content: `
          <p>Your total return includes your daily profit plus your returned capital.</p>
          <ul>
            <li><strong>Capital:</strong> $1,000</li>
            <li><strong>Total Profit (15 days):</strong> $40 × 15 = $600</li>
            <li><strong>Total Payout:</strong> $1,600</li>
            <li><strong>Net Profit %:</strong> 60% in 15 days</li>
          </ul>
        `
      }
    ]
  },
  'security-guide': {
    id: 'security-guide',
    title: 'Account Security Guide',
    subtitle: 'Best Practices for Keeping Your Account Safe',
    sections: [
      {
        title: 'Two-Factor Authentication (2FA)',
        content: `
          <p>We strongly recommend enabling 2FA. This adds an extra layer of security by requiring a code from your phone (Google Authenticator) in addition to your password.</p>
        `
      },
      {
        title: 'Password Security',
        content: `
          <ul>
            <li>Use a unique password not used on other sites.</li>
            <li>Include a mix of upper/lowercase letters, numbers, and symbols.</li>
            <li>Change your password periodically.</li>
          </ul>
        `
      },
      {
        title: 'Phishing Awareness',
        content: `
          <p>Always ensure you are visiting the official eToro Trust Capital website. We will never ask for your password or 2FA code through unsolicited messages.</p>
        `
      }
    ]
  }
};
