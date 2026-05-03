const templates = require('./emailTemplates');
const { getEmailProviderStatus, sendTransactionalEmail } = require('./mailProvider');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'noreply@etorocapital.online';

console.log('Email Service Provider:', getEmailProviderStatus());

const sendEmail = async (to, subject, html, toName) => {
  const textPart = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  try {
    const result = await sendTransactionalEmail({
      to,
      toName,
      subject,
      html,
      text: textPart,
      replyToEmail: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'noreply@etorocapital.online',
      replyToName: process.env.EMAIL_REPLY_TO_NAME || 'eToro Trust Capital',
    });

    if (!result.sent) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
      return false;
    }

    console.log(`Email sent to ${to} via ${result.provider}: ${result.messageId || 'no-message-id'}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error?.message || error);
    return false;
  }
};

const emailService = {
  async sendWelcome(email, name) {
    const html = templates.welcome(name);
    return sendEmail(email, 'Welcome to eToro Trust Capital', html, name);
  },

  async sendDepositRequest(userEmail, userName, amount, method, currency, txHash, proofUrl) {
    const userHtml = templates.depositRequestUser(userName, amount, method, currency, txHash);
    const userResult = await sendEmail(userEmail, 'Deposit Request Received', userHtml, userName);

    const adminHtml = templates.depositRequestAdmin(userName, amount, `${method} ${currency || ''}`, txHash, proofUrl);
    const adminResult = await sendEmail(ADMIN_EMAIL, `New Deposit: $${amount} from ${userName}`, adminHtml, 'Support');
    return userResult && adminResult;
  },

  async sendDepositStatus(userEmail, userName, amount, status, reason) {
    if (status === 'approved') {
      const html = templates.depositApproved(userName, amount);
      return sendEmail(userEmail, 'Deposit Approved', html, userName);
    }

    const html = templates.depositRejected(userName, amount, reason);
    return sendEmail(userEmail, 'Deposit Rejected', html, userName);
  },

  async sendRoiCredit(userEmail, userName, planName, amount, newBalance) {
    const date = new Date().toLocaleString();
    const html = templates.roiCredited(userName, planName, amount, newBalance, date);
    return sendEmail(userEmail, 'Daily Investment Return Credited', html, userName);
  },

  async sendWithdrawalRequest(userEmail, userName, amount, method, wallet) {
    const userHtml = templates.withdrawalRequestUser(userName, amount, method, wallet);
    const userResult = await sendEmail(userEmail, 'Withdrawal Request Submitted', userHtml, userName);

    const adminHtml = templates.withdrawalRequestAdmin(userName, amount, method, wallet);
    const adminResult = await sendEmail(ADMIN_EMAIL, `New Withdrawal: $${amount} from ${userName || userEmail}`, adminHtml, 'Admin');
    return userResult && adminResult;
  },

  async sendWithdrawalStatus(userEmail, userName, amount, status, reason) {
    const html = templates.withdrawalStatus(userName, amount, status, reason);
    return sendEmail(userEmail, `Withdrawal ${status === 'approved' ? 'Processed' : 'Update'}`, html, userName);
  },

  async sendInvestmentApproved(userEmail, userName, details) {
    const html = templates.investmentApproved(userName, details);
    return sendEmail(userEmail, 'Investment Approved', html, userName);
  },

  async sendWithdrawalApproved(userEmail, userName, amount, method, wallet) {
    const html = templates.withdrawalApproved(userName, amount, method, wallet);
    return sendEmail(userEmail, 'Withdrawal Approved', html, userName);
  },
};

module.exports = emailService;
