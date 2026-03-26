const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-\\[#050505\\]': 'bg-bg-base',
  'bg-\\[#0A0A0A\\]': 'bg-bg-panel',
  'border-white/10': 'border-border-subtle',
  'border-white/5': 'border-border-faint',
  'border-white/20': 'border-border-strong',
  'text-white': 'text-text-main',
  'text-neutral-200': 'text-text-secondary',
  'text-neutral-300': 'text-text-tertiary',
  'text-neutral-400': 'text-text-muted',
  'text-neutral-500': 'text-text-faint',
  'text-neutral-600': 'text-text-fainter',
  'text-neutral-700': 'text-text-faintest',
  'bg-white/5': 'bg-bg-subtle',
  'bg-white/10': 'bg-bg-faint',
  'bg-white/20': 'bg-bg-strong',
  'bg-white/\\[0.02\\]': 'bg-bg-hover',
  'hover:bg-white/5': 'hover:bg-bg-subtle',
  'hover:bg-white/\\[0.02\\]': 'hover:bg-bg-hover',
  'hover:border-white/30': 'hover:border-border-strong',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [search, replace] of Object.entries(replacements)) {
        const regex = new RegExp(`(?<=\\s|["'\`])${search}(?=\\s|["'\`])`, 'g');
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
