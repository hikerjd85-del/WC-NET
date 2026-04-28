import fs from 'fs';
const text = fs.readFileSync('fifa.html', 'utf8');
const __NEXT_DATA__ = text.match(/<script([^>]*)>(.*?)<\/script>/gi);
if (__NEXT_DATA__) {
  __NEXT_DATA__.forEach((d, i) => console.log(i, d.substring(0, 50)));
}
