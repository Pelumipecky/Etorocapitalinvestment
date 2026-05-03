import 'dotenv/config';
import { getEmailProviderStatus } from './api/mailProvider.js';

console.log('=== Email Provider Status Check ===\n');

const provider = getEmailProviderStatus();

console.log('Requested Provider:', provider.requestedProvider || 'auto');
console.log('Active Provider:', provider.activeProvider || 'none');
console.log('From Email:', provider.fromEmail || 'Not configured');
console.log('From Name:', provider.fromName || 'Not configured');
console.log('SMTP Host:', provider.smtpHost || 'Not configured');

console.log('\n=== Provider Availability ===');
console.log('SMTP:', provider.hasSmtp ? 'Configured' : 'Not configured');

console.log('\n=== Current Status ===');
if (!provider.activeProvider) {
  console.log('No email provider is active.');
  console.log('Set TurboSMTP SMTP credentials to activate email sending.');
  process.exit(1);
}

console.log(`TurboSMTP is currently active as: ${provider.activeProvider}`);

console.log('\n=== Required TurboSMTP Variables ===');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'Missing');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'Missing');
console.log('SMTP_USER:', process.env.SMTP_USER ? 'Present' : 'Missing');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Present' : 'Missing');
console.log('SMTP_FROM:', process.env.SMTP_FROM || process.env.EMAIL_FROM || 'Missing');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Missing');
