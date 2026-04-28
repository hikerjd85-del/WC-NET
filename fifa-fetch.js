import fs from 'fs';
async function run() {
  const res = await fetch("https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=CA&wtw-filter=ALL");
  const text = await res.text();
  fs.writeFileSync('fifa.html', text);
}
run();
