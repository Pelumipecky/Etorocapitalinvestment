import templates from './emailTemplates.js';
import { getEmailProviderStatus, sendTransactionalEmail } from './mailProvider.js';

// Configuration
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
    
    console.log(`📧 Email sent to ${to} via ${result.provider}: ${result.messageId || 'no-message-id'}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error?.message || error);
    return false;
  }
};

const emailService = {
  async sendInvestmentSubmitted(userEmail, userName, plan, capital, roi, duration) {
    console.log('[InvestmentEmail] sendInvestmentSubmitted called with:', { userEmail, userName, plan, capital, roi, duration });
    const html = templates.investmentSubmitted(userName, plan, capital, roi, duration);
    const userResult = await sendEmail(userEmail, 'Investment Submitted', html, userName || 'Investor');
    const adminResult = await sendEmail(ADMIN_EMAIL, `New Investment: $${capital} from ${userName || userEmail}`, html, 'Admin');
    return userResult && adminResult;
  },
  async sendWelcome(email, name) {
    console.log('[WelcomeEmail] sendWelcome called with:', { email, name });
    const html = templates.welcome(name);
    const result = await sendEmail(email, 'Welcome to eToro Trust Capital', html, name);
    console.log('[WelcomeEmail] sendWelcome result:', { email, success: result });
    return result;
  },

  async sendDepositRequest(userEmail, userName, amount, method, currency, txHash, proofUrl) {
    console.log('[DepositEmail] sendDepositRequest called with:', { userEmail, userName, amount, method, currency, txHash, proofUrl });
    // 1. Notify User
    const userHtml = templates.depositRequestUser(userName, amount, method, currency, txHash);
    const userResult = await sendEmail(userEmail, 'Deposit Request Received', userHtml, userName);
    console.log('[DepositEmail] User email result:', userResult);
    
    // 2. Notify Admin
    const adminHtml = templates.depositRequestAdmin(userName, amount, `${method} ${currency || ''}`, txHash, proofUrl);
    const adminResult = await sendEmail(ADMIN_EMAIL, `New Deposit: $${amount} from ${userName}`, adminHtml);
    console.log('[DepositEmail] Admin email result:', adminResult);
    return userResult && adminResult;
  },

  async sendDepositStatus(userEmail, userName, amount, status, reason) {
    console.log('[DepositEmail] sendDepositStatus called with:', { userEmail, userName, amount, status, reason });
    if (status === 'approved') {
      const html = templates.depositApproved(userName, amount);
      const result = await sendEmail(userEmail, 'Deposit Approved', html, userName);
      console.log('[DepositEmail] Approved email result:', result);
      return result;
    } else {
      const html = templates.depositRejected(userName, amount, reason);
      const result = await sendEmail(userEmail, 'Deposit Rejected', html, userName);
      console.log('[DepositEmail] Rejected email result:', result);
      return result;
    }
  },

  async sendRoiCredit(userEmail, userName, planName, amount, newBalance) {
    const date = new Date().toLocaleString();
    const html = templates.roiCredited(userName, planName, amount, newBalance, date);
    return await sendEmail(userEmail, 'Daily Investment Return Credited', html, userName);
  },

  async sendWithdrawalRequest(userEmail, userName, amount, method, wallet) {
    // 1. Notify User
    const userHtml = templates.withdrawalRequestUser(userName, amount, method, wallet);
    const userResult = await sendEmail(userEmail, 'Withdrawal Request Submitted', userHtml, userName);

    // 2. Notify Admin
    const adminHtml = templates.withdrawalRequestAdmin(userName, amount, method, wallet);
    const adminResult = await sendEmail(ADMIN_EMAIL, `New Withdrawal: $${amount} from ${userName || userEmail}`, adminHtml, 'Admin');
    return userResult && adminResult;
  },

  async sendWithdrawalStatus(userEmail, userName, amount, status, reason) {
    const html = templates.withdrawalStatus(userName, amount, status, reason);
    return await sendEmail(userEmail, `Withdrawal ${status === 'approved' ? 'Processed' : 'Update'}`, html, userName);
  },

  async sendInvestmentCreated(userEmail, userName, plan, capital, roi, duration) {
    const html = templates.investmentCreated(userName, plan, capital, roi, duration);
    return await sendEmail(userEmail, 'Investment Activated Successfully', html, userName);
  },

  async sendInvestmentApproved(userEmail, userName, details) {
    const html = templates.investmentApproved(userName, details);
    return await sendEmail(userEmail, 'Investment Approved', html, userName);
  },

  async sendInvestmentCompleted(userEmail, userName, planName, totalROI, bonusAmount, currentBalance) {
    const html = templates.investmentCompleted(userName, planName, totalROI, bonusAmount, currentBalance);
    return await sendEmail(userEmail, 'Investment Completed Successfully', html, userName);
  },

  async sendWithdrawalApproved(userEmail, userName, amount, method, wallet) {
    const html = templates.withdrawalApproved(userName, amount, method, wallet);
    return await sendEmail(userEmail, 'Withdrawal Approved', html, userName);
  }
};

export default emailService;

