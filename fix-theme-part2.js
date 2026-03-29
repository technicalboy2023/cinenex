const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk(path.join(__dirname, 'src/components'), (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace bg-white/opacity with bg-card
  content = content.replace(/bg-white\/(5|10|15|20|30)/g, 'bg-card');
  // Replace hover:bg-white/opacity with hover:bg-card-hover
  content = content.replace(/hover:bg-white\/(10|15|20|30)/g, 'hover:bg-card-hover');
  
  // Clean up duplicate bg-cards that might happen
  content = content.replace(/bg-card bg-card/g, 'bg-card');

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Cleaned up remaining transluscent white classes in components.');
