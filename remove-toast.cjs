const fs = require('fs');
const filePath = 'src/pages/dashboard/UserDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Find the line with "Floating Profit Notification Toast"
let startLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Floating Profit Notification Toast')) {
    startLine = i - 1; // Include the indentation line before the comment
    break;
  }
}

if (startLine !== -1) {
  // Find the closing })()}
  let endLine = -1;
  
  for (let i = startLine + 1; i < lines.length; i++) {
    if (lines[i].includes('})()}')) {
      endLine = i;
      break;
    }
  }
  
  if (endLine !== -1) {
    // Remove the lines
    lines.splice(startLine, endLine - startLine + 1);
    
    // Also remove the @keyframes toastSlideIn and toastFadeOut
    let toastKeyframesStartLines = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('@keyframes toastSlideIn') || 
          lines[i].includes('@keyframes toastFadeOut')) {
        toastKeyframesStartLines.push(i);
      }
    }
    
    // Remove from highest index first to avoid index shifting
    for (let idx of toastKeyframesStartLines.reverse()) {
      let keyframeEnd = idx;
      for (let i = idx; i < lines.length; i++) {
        if (lines[i].includes('}') && !lines[i].includes('@keyframes')) {
          keyframeEnd = i;
          break;
        }
      }
      lines.splice(idx, keyframeEnd - idx + 1);
    }
    
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log('Successfully removed profit notification and toast animations');
  } else {
    console.log('Could not find end of toast section');
  }
} else {
  console.log('Could not find Floating Profit Notification Toast');
}
