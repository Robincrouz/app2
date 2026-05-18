const fs = require('fs');
const glob = require('fs').readdirSync('./src/screens').filter(f => f.endsWith('.tsx'));

for (const file of glob) {
  const path = './src/screens/' + file;
  let content = fs.readFileSync(path, 'utf8');
  
  // Exclude PinLockScreen
  if (file === 'PinLockScreen.tsx') continue;

  // Replace various max-w-..., mx-auto, and extra paddings
  content = content.replace(/max-w-7xl mx-auto (pb-[0-9]+ )?(pt-[0-9]+ )?(px-[0-9]+ )?/g, '');
  content = content.replace(/max-w-2xl mx-auto (pb-[0-9]+ )?(pt-[0-9]+ )?(px-[0-9]+ )?/g, '');
  content = content.replace(/max-w-3xl mx-auto (pb-[0-9]+ )?(pt-[0-9]+ )?(px-[0-9]+ )?(sm:px-[0-9]+ )?/g, '');
  content = content.replace(/max-w-xl mx-auto (pb-[0-9]+ )?(pt-[0-9]+ )?(px-[0-9]+ )?/g, '');
  
  // also fix some instances where it might be inverted
  content = content.replace(/pt-4 px-4 /g, '');
  content = content.replace(/pb-24 /g, '');
  content = content.replace(/pb-32 /g, '');
  
  fs.writeFileSync(path, content, 'utf8');
}
console.log('Fixed paddings!');
