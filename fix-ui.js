const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Global theme fixes
  content = content.replace(/text-white(?!(\/| space))/g, 'text-gray-900 dark:text-white');
  content = content.replace(/text-gray-300/g, 'text-gray-600 dark:text-gray-300');
  content = content.replace(/text-gray-400/g, 'text-gray-500 dark:text-gray-400');
  content = content.replace(/bg-gray-950/g, 'bg-white dark:bg-gray-950');
  content = content.replace(/bg-gray-900/g, 'bg-gray-50 dark:bg-gray-900');
  content = content.replace(/bg-black\/40/g, 'bg-white/80 dark:bg-black/40');
  content = content.replace(/bg-black\/60/g, 'bg-white/90 dark:bg-black/60');
  content = content.replace(/border-white\/10/g, 'border-gray-200 dark:border-white/10');
  content = content.replace(/border-white\/5/g, 'border-gray-100 dark:border-white/5');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Theme styling replaced.');
