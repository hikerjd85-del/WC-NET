import fs from 'fs';
const text = fs.readFileSync('fifa-text.txt', 'utf8');

const regex = /([A-Za-z]+ \d+ [A-Za-z]+ \d{4})\n(?:View groups\n)?([A-Za-z][^\n]+)\n(\d{2}:\d{2})\n([A-Za-z][^\n]+)/g;
let match;
let count = 0;
while ((match = regex.exec(text)) !== null && count < 20) {
  console.log(match[1], "|", match[2], "vs", match[4], "|", match[3]);
  count++;
}
