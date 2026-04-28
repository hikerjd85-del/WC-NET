import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto("https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=CA&wtw-filter=ALL", { waitUntil: 'networkidle2' });
  
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('fifa-text.txt', text);
  console.log("Written fifa-text.txt");
  
  await browser.close();
})();
