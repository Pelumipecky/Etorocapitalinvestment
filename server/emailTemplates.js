
const DEFAULT_SITE_URL = 'https://etorocapitalinvestment.vercel.app';
const SITE_URL = (process.env.EMAIL_SITE_URL || process.env.VITE_APP_URL || `https://${process.env.APP_DOMAIN || 'etorocapitalinvestment.vercel.app'}` || DEFAULT_SITE_URL).replace(/\/$/, '');
const EMAIL_LOGO_PATH = '/images/email-logo.png';
const LOGO_IMAGE = process.env.EMAIL_LOGO_URL || `${SITE_URL}${EMAIL_LOGO_PATH}`;
const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/?sl=en&tl=auto&op=translate';

const styles = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #eee; }
  .header { background-color: #ffffff; color: #0f172a; padding: 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; }
  .content { padding: 30px 20px; }
  .footer { background-color: #ffffff; color: #666; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #eee; }
  .button { display: inline-block; padding: 10px 20px; background-color: #f0b90b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
  .translate-box { margin: 24px 0 0; padding: 16px; text-align: center; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; }
  .translate-box p { margin: 0 0 10px; color: #475569; font-size: 13px; }
  .translate-link { display: inline-block; padding: 9px 16px; background: #ffffff; color: #0f172a; text-decoration: none; border: 1px solid #d1d5db; border-radius: 6px; font-weight: 600; font-size: 13px; }
  .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
  .info-table td:first-child { font-weight: bold; color: #555; width: 40%; }
  .highlight { color: #f0b90b; font-weight: bold; }
`;

const wrapTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <div class="header" style="text-align: center; padding: 25px 0; background-color: #ffffff;">
      <!-- Logo Image (Remote URL) -->
      <a href="${SITE_URL}" target="_blank" style="text-decoration: none;">
        <img src="${LOGO_IMAGE}" alt="eToro Trust Capital" width="180" style="display: inline-block; max-width: 100%; height: auto; border: 0; font-family: sans-serif; font-size: 24px; color: #0f172a; font-weight: bold;" />
      </a>
    </div>
    <div class="content">
      ${bodyContent}
      <div class="translate-box">
        <p>Need this notification in another language?</p>
        <a href="${GOOGLE_TRANSLATE_URL}" class="translate-link" target="_blank">Open Google Translate</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} eToro Trust Capital. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  welcome: (name) => wrapTemplate('Welcome to eToro Trust Capital', `
    <h2>Welcome, ${name}!</h2>
    <p>Thank you for joining eToro Trust Capital. We are thrilled to have you on board.</p>
    <p>Your account has been successfully created. You can now access your dashboard, explore our investment plans, and start your journey to financial freedom.</p>
    <p><strong>Next Steps:</strong></p>
    <ul>
      <li>Complete your KYC verification.</li>
      <li>Explore our tailored investment plans.</li>
      <li>Make your first deposit.</li>
    </ul>
    <center><a href="${SITE_URL}/login" class="button">Login to Dashboard</a></center>
  `),

  depositRequestUser: (name, amount, method, currency, txHash) => wrapTemplate('Deposit Confirmation', `
    <h2>Deposit Request Received</h2>
    <p>Hello ${name},</p>
    <p>We have received your deposit request. It is currently <strong>Pending</strong> waiting for blockchain confirmation and admin approval.</p>
    <table class="info-table">
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method} ${currency ? `(${currency})` : ''}</td></tr>
      ${txHash ? `<tr><td>Transaction Hash:</td><td><small>${txHash.substring(0, 20)}...</small></td></tr>` : ''}
      <tr><td>Status:</td><td>Pending</td></tr>
    </table>
    <p>You will receive another email once your deposit is approved.</p>
  `),

  depositRequestAdmin: (userName, amount, method, txHash, proofUrl) => wrapTemplate('New Deposit Request', `
    <h2>New Deposit Action Required</h2>
    <p>A new deposit request has been submitted by <strong>${userName}</strong>.</p>
    <table class="info-table">
      <tr><td>User:</td><td>${userName}</td></tr>
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Tx Hash:</td><td><small>${txHash}</small></td></tr>
    </table>
    <p>Please log in to the admin panel to review and approve/reject this request.</p>
    ${proofUrl ? `<p><a href="${proofUrl}" target="_blank">View Payment Proof</a></p>` : ''}
    <center><a href="${SITE_URL}/admin" class="button">Go to Admin Panel</a></center>
  `),

  depositApproved: (name, amount) => wrapTemplate('Deposit Approved', `
    <h2>Deposit Approved!</h2>
    <p>Hello ${name},</p>
    <p>Great news! Your deposit of <span class="highlight">$${amount}</span> has been successfully approved and credited to your account balance.</p>
    <p>You can now use these funds to purchase an investment plan.</p>
    <center><a href="${SITE_URL}/dashboard" class="button">View Balance</a></center>
  `),
  
  depositRejected: (name, amount, reason) => wrapTemplate('Deposit Rejected', `
    <h2>Deposit Rejected</h2>
    <p>Hello ${name},</p>
    <p>We regret to inform you that your deposit request for <span class="highlight">$${amount}</span> has been rejected.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>If you believe this is an error, please contact support.</p>
  `),

  roiCredited: (name, planName, amount, newBalance, date) => wrapTemplate('Daily ROI Credited', `
    <h2>Daily Profit Received</h2>
    <p>Hello ${name},</p>
    <p>Your daily ROI for the plan <strong>${planName}</strong> has been credited.</p>
    <table class="info-table">
      <tr><td>Amount Credited:</td><td class="highlight">+$${amount}</td></tr>
      <tr><td>Plan:</td><td>${planName}</td></tr>
      <tr><td>Date:</td><td>${date}</td></tr>
      <tr><td>Current Balance:</td><td>$${newBalance}</td></tr>
    </table>
    <p>Keep your investment active to continue earning daily returns!</p>
  `),

  withdrawalRequestUser: (name, amount, method, wallet) => wrapTemplate('Withdrawal Request Submitted', `
    <h2>Withdrawal Request Pending</h2>
    <p>Hello ${name},</p>
    <p>Your withdrawal request has been received and is being processed.</p>
    <table class="info-table">
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Destination:</td><td><small>${wallet}</small></td></tr>
      <tr><td>Status:</td><td>Pending</td></tr>
    </table>
    <p>Processing times may vary. We will notify you once the funds are sent.</p>
  `),

  withdrawalRequestAdmin: (userName, amount, method, wallet) => wrapTemplate('New Withdrawal Request', `
    <h2>New Withdrawal Request</h2>
    <p>User <strong>${userName}</strong> has requested a withdrawal.</p>
    <table class="info-table">
      <tr><td>User:</td><td>${userName}</td></tr>
      <tr><td>Amount:</td><td>$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Wallet:</td><td><small>${wallet}</small></td></tr>
    </table>
    <center><a href="${SITE_URL}/admin" class="button">Review Request</a></center>
  `),

  withdrawalStatus: (name, amount, status, reason) => wrapTemplate(`Withdrawal ${status}`, `
    <h2>Withdrawal Update</h2>
    <p>Hello ${name},</p>
    <p>Your withdrawal request for <strong>$${amount}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
    ${status === 'rejected' && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    ${status === 'approved' ? '<p>The funds should appear in your wallet shortly.</p>' : ''}
  `),

  withdrawalApproved: (name, amount, method, wallet) => wrapTemplate('Withdrawal Approved', `
    <h2>Withdrawal Approved</h2>
    <p>Hello ${name},</p>
    <p>Your withdrawal request has been approved and is now being processed.</p>
    <table class="info-table">
      <tr><td>Amount:</td><td class="highlight">$${amount}</td></tr>
      <tr><td>Method:</td><td>${method}</td></tr>
      <tr><td>Destination:</td><td><small>${wallet || 'N/A'}</small></td></tr>
      <tr><td>Status:</td><td>Approved</td></tr>
    </table>
    <p>The funds should reflect in your destination wallet or account shortly.</p>
  `),

  investmentApproved: (name, details) => wrapTemplate('Investment Approved', `
    <h2>Investment Approved</h2>
    <p>Hello ${name},</p>
    <p>Great news! Your investment has been reviewed and activated.</p>
    <table class="info-table">
      <tr><td>Investment ID:</td><td>${details.id}</td></tr>
      <tr><td>Plan:</td><td>${details.plan}</td></tr>
      <tr><td>Amount:</td><td class="highlight">$${Number(details.amount || 0).toLocaleString()}</td></tr>
      <tr><td>Start Date:</td><td>${details.startDate}</td></tr>
      <tr><td>Status:</td><td style="color: #22c55e;">${details.status || 'Active'}</td></tr>
    </table>
    <p>You will now begin earning daily returns based on your selected plan. You can track progress anytime from your dashboard.</p>
    <center><a href="${SITE_URL}/dashboard" class="button">View My Investment</a></center>
  `)
};
