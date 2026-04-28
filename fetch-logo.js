import fs from 'fs';
fetch('https://cdn.worldvectorlogo.com/logos/fifa-world-cup-2026.svg')
  .then(r => r.text())
  .then(t => {
    fs.mkdirSync('public', {recursive: true});
    fs.writeFileSync('public/logo.svg', t);
    console.log('done!');
  })
  .catch(console.error);
