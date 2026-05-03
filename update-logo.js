const fs = require('fs');
const path = require('path');

// Read the PNG image
const imagePath = path.join(__dirname, 'public/images/ciphervaultlogobig.png');
const data = fs.readFileSync(imagePath);
const base64 = data.toString('base64');
const dataUri = `data:image/png;base64,${base64}`;

// Read current emailTemplates.js
let emailTemplatesContent = fs.readFileSync('./api/emailTemplates.js', 'utf8');

// Replace the incomplete LOGO_BASE64 with the complete one
const oldConstant = /const LOGO_BASE64 = "data:image\/png;base64,[^"]*";/;
const newConstant = `const LOGO_BASE64 = "${dataUri}";`;

emailTemplatesContent = emailTemplatesContent.replace(oldConstant, newConstant);

// Write back
fs.writeFileSync('./api/emailTemplates.js', emailTemplatesContent);
console.log('✓ Updated emailTemplates.js with complete base64 logo');
console.log('Base64 length:', base64.length);
