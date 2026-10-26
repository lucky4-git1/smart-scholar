const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('./src');
const replacements = [
  [/bg-\[#E3BC9A\] text-\[#0A0908\]/g, 'bg-white text-zinc-950 font-semibold'],
  [/bg-\[#E3BC9A\] text-\[#09090b\]/g, 'bg-white text-zinc-950 font-semibold'],
  [/text-\[#E3BC9A\]/g, 'text-emerald-400'],
  [/border-\[#E3BC9A\]/g, 'border-emerald-500/40'],
  [/bg-\[#E3BC9A\]/g, 'bg-emerald-500 text-zinc-950'],
  [/hover:border-\[#E3BC9A\]/g, 'hover:border-emerald-500/50'],
  [/focus:border-\[#E3BC9A\]/g, 'focus:border-emerald-500/50'],
  [/\[#14120F\]/g, '[#121215]'],
  [/\[#27211B\]/g, '[#27272a]'],
  [/\[#181512\]/g, '[#18181b]'],
  [/\[#0B0A08\]/g, '[#09090b]'],
  [/\[#0E0C0A\]/g, '[#09090b]'],
  [/\[#191512\]/g, '[#18181b]'],
  [/\[#2D2620\]/g, '[#27272a]'],
  [/\[#25201A\]/g, '[#27272a]'],
  [/text-\[#A89F91\]/g, 'text-zinc-400'],
  [/text-\[#A89A8C\]/g, 'text-zinc-400'],
  [/text-\[#FAF7F2\]/g, 'text-zinc-100'],
  [/text-\[#F5EDE4\]/g, 'text-zinc-100'],
  [/\[#3D342C\]/g, '[#3f3f46]'],
  [/\[#5C4F43\]/g, '[#71717a]'],
  [/\[#2D251E\]/g, '[#27272a]'],
  [/\[#1C1612\]/g, '[#18181b]'],
  [/\[#0A0908\]/g, '[#09090b]'],
  [/\[#E3BC9A\]/g, '[#34d399]']
];

let modifiedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  for (const [pattern, rep] of replacements) {
    content = content.replace(pattern, rep);
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
}
console.log(`Updated ${modifiedCount} files in src/`);
