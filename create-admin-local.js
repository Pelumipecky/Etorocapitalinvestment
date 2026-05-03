// Create Admin User in LocalStorage (Run in Browser Console)
// This creates a test admin account without needing the database

const adminUser = {
  id: 'USR' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
  idnum: 'USR' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
  name: 'Admin User',
  userName: 'admin',
  email: 'admin@ciphervault.com',
  password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // "Admin123!" hashed
  balance: 10000,
  bonus: 500,
  referralCount: 0,
  referralCode: 'REF' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
  phoneNumber: '+1234567890',
  country: 'United States',
  city: 'New York',
  address: '123 Admin Street',
  admin: true,
  avatar: '👨‍💼',
  createdAt: new Date().toISOString()
};

// Save to localStorage
localStorage.setItem('activeUser', JSON.stringify(adminUser));
sessionStorage.setItem('activeUser', JSON.stringify(adminUser));

console.log('✅ Admin user created successfully!');
console.log('📧 Email: admin@etorotroptrustcapital.com');
console.log('🔑 Password: Admin123!');
console.log('💰 Balance: $10,000');
console.log('👨‍💼 Admin: true');
console.log('\n🚀 Reloading page...');

// Reload to apply changes
setTimeout(() => {
  window.location.href = '/dashboard';
}, 1000);
