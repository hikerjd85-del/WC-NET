import fs from 'fs';
const text = fs.readFileSync('fifa-text-et.txt', 'utf8');

const lines = text.split('\n');
let printed = 0;
for(let i=0; i<lines.length; i++) {
  if(lines[i].includes('First Stage') || lines[i].match(/\d{2}:\d{2}/)) {
    console.log(lines.slice(Math.max(0, i-2), Math.min(lines.length, i+3)).join('\n'));
    console.log('---');
    printed++;
    if(printed > 15) break;
  }
}
