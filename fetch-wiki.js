import fs from 'fs';
async function run() {
  const res = await fetch("https://en.wikipedia.org/wiki/2026_FIFA_World_Cup");
  const text = await res.text();
  const times = text.match(/<td[^>]*>(\d{1,2}:\d{2})<\/td>/gi);
  if (times) {
    console.log(times.slice(0, 10));
  } else {
    // Just regex for any HH:MM in text
    const all = text.match(/\b\d{1,2}:\d{2}\b/g);
    console.log([...new Set(all || [])].slice(0, 20));
  }
}
run();
