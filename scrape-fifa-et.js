import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Fake timezone to America/New_York (ET)
  await page.emulateTimezone('America/New_York');
  
  await page.goto("https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=CA&wtw-filter=ALL", { waitUntil: 'networkidle2' });
  
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('fifa-text-et.txt', text);
  console.log("Written fifa-text-et.txt");
  
  await browser.close();
})();
