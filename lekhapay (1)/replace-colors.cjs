const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/#0d6e6e/g, '#0B0F19');
content = content.replace(/#043d3d/g, '#111827');
fs.writeFileSync('src/App.tsx', content);

let content2 = fs.readFileSync('src/index.css', 'utf8');
content2 = content2.replace(/#0d6e6e/g, '#0B0F19');
content2 = content2.replace(/#043d3d/g, '#111827');
fs.writeFileSync('src/index.css', content2);
