const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const excludes = [
  path.join(__dirname, 'src/app/page.tsx'),
  path.join(__dirname, 'src/app/layout.tsx'),
  path.join(__dirname, 'src/app/movie/[id]/page.tsx'),
  path.join(__dirname, 'src/app/anime/[id]/page.tsx'),
];

walk(path.join(__dirname, 'src/app'), (filePath) => {
  if (!filePath.endsWith('page.tsx')) return;
  if (excludes.some(ex => filePath.includes(ex))) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Find max-w-... mx-auto ... py-10
  content = content.replace(/className="(max-w-[a-zA-Z0-9\-]+ mx-auto px-4 sm:px-6 lg:px-8 py-10)"/, 'className="$1 pt-28"');
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Added pt-28 to subpages.');
