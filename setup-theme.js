const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

// 1. Rewrite globals.css
const cssPath = path.join(__dirname, 'src/app/globals.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newThemeCSS = `@import "tailwindcss";

@theme {
  --color-background: var(--bg);
  --color-foreground: var(--text);
  --color-card: var(--card);
  --color-card-hover: var(--card-hover);
  --color-border: var(--border);
  --color-border-hover: var(--border-hover);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
}

:root {
  --bg: #f8fafc;
  --text: #0f172a;
  --card: rgba(255, 255, 255, 0.7);
  --card-hover: rgba(255, 255, 255, 0.9);
  --border: rgba(15, 23, 42, 0.05);
  --border-hover: rgba(15, 23, 42, 0.15);
  --accent: #3b82f6;
  --muted: #64748b;
}

.dark {
  --bg: #030712;
  --text: #f8fafc;
  --card: rgba(3, 7, 18, 0.4);
  --card-hover: rgba(3, 7, 18, 0.7);
  --border: rgba(255, 255, 255, 0.05);
  --border-hover: rgba(255, 255, 255, 0.15);
  --accent: #8b5cf6;
  --muted: #94a3b8;
}

html { scroll-behavior: smooth; color-scheme: dark; }
body { background-color: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; min-height: 100vh; }
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(150, 150, 150, 0.2); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(150, 150, 150, 0.4); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.ad-container:empty { display: none; }
`;

fs.writeFileSync(cssPath, newThemeCSS, 'utf8');

// 2. Rewrite tsx components
walk(path.join(__dirname, 'src'), (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace text colors
  content = content.replace(/text-gray-900 dark:text-white/g, 'text-foreground');
  content = content.replace(/text-gray-800 dark:text-gray-200/g, 'text-foreground');
  content = content.replace(/text-gray-600 dark:text-gray-300/g, 'text-muted');
  content = content.replace(/text-gray-500 dark:text-gray-400/g, 'text-muted');
  
  // Replace backgrounds
  content = content.replace(/bg-white(-[0-9\/]+)? dark:bg-gray-[0-9]+\/?[0-9]*/g, 'glass bg-card hover:bg-card-hover');
  content = content.replace(/bg-gray-50 dark:bg-gray-900\/?[0-9]*/g, 'glass bg-card hover:bg-card-hover');
  
  // Clean up old classes
  content = content.replace(/dark:border-white\/[0-9]+/g, 'border-border');
  content = content.replace(/border-gray-[0-9]+/g, 'border-border transition-colors hover:border-border-hover');
  
  // Add Outfit + Inter
  if (filePath.includes('layout.tsx')) {
    if (!content.includes('Outfit')) {
      content = content.replace(
        "import { Inter } from 'next/font/google';",
        "import { Inter, Outfit } from 'next/font/google';"
      );
      content = content.replace(
        "const inter = Inter({",
        "const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });\nconst inter = Inter({"
      );
      content = content.replace(
        "${inter.variable}",
        "${inter.variable} ${outfit.variable}"
      );
    }
  }

  // Deduplicate fix for all fetch setters
  if (content.match(/setMovies.*append.*\.\.\./) && !content.includes('dedupeById')) {
    if (!content.includes("import { dedupeById }")) {
      content = "import { dedupeById } from '@/lib/utils';\n" + content;
    }
    content = content.replace(
      /setMovies\(prev => append \? \[\.\.\.prev, \.\.\.data\.results\] \: data\.results\);/g,
      "setMovies(prev => append ? dedupeById([...prev, ...data.results]) : dedupeById([...data.results]));"
    );
  }

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Advanced UI Script Completed.');
