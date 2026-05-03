// Generate bcrypt hash for your custom password
// Run this with Node.js to generate your password hash

import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'Admin@2029'; // Replace with your desired password
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('BCrypt Hash:', hash);
    console.log('Use this hash in your SQL UPDATE statement');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();