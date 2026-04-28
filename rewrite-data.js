import fs from 'fs';

const text = fs.readFileSync('fifa-text-et.txt', 'utf8');

const GROUPS = [
  { id: 'A', teams: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'] },
  { id: 'B', teams: ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'] },
  { id: 'C', teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { id: 'D', teams: ['United States', 'Paraguay', 'Australia', 'Turkey'] },
  { id: 'E', teams: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'] },
  { id: 'F', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { id: 'G', teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  { id: 'H', teams: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  { id: 'I', teams: ['France', 'Senegal', 'Norway', 'Iraq'] },
  { id: 'J', teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K', teams: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'] },
  { id: 'L', teams: ['England', 'Croatia', 'Ghana', 'Panama'] }
];

const teamNameMap = {
  'Korea Republic': 'South Korea',
  'Czechia': 'Czech Republic',
  'USA': 'United States',
  'IR Iran': 'Iran',
  'Türkiye': 'Turkey',
  'Congo DR': 'DR Congo',
  'Côte d\'Ivoire': 'Ivory Coast'
};

const getGroupMatches = (group) => {
  const [t1, t2, t3, t4] = group.teams;
  return [
    { id: `${group.id}-1`, home: t1, away: t2 },
    { id: `${group.id}-2`, home: t3, away: t4 },
    { id: `${group.id}-3`, home: t1, away: t3 },
    { id: `${group.id}-4`, home: t2, away: t4 },
    { id: `${group.id}-5`, home: t1, away: t4 },
    { id: `${group.id}-6`, home: t2, away: t3 }
  ];
};

const allMatches = GROUPS.flatMap(getGroupMatches);

// Build list from scraping
let extracted = [];
const lines = text.split('\\n').map(l => l.trim()).filter(Boolean);

let currentDate = 'Thu 11 June 2026';
for(let i=0; i<lines.length; i++) {
  const line = lines[i];
  if(line.match(/^[A-Za-z]+ \d+ [A-Za-z]+ \d{4}$/)) {
    currentDate = line;
  } else if (line.match(/^\d{2}:\d{2}$/)) {
    // Found a time. Assume the previous line is team1, and next is team2
    const time = line;
    let t1 = lines[i-1];
    let t2 = lines[i+1];
    
    // There might be a "(Location)" line before team1, which is fine, t1 is i-1
    if(t1 === 'View groups' || t1.startsWith('(')) {
       // if we hit structural artifacts, skip or look back further
       t1 = lines[i-2] && !lines[i-2].startsWith('(') ? lines[i-2] : t1; 
    }
    
    extracted.push({ date: currentDate, team1: t1, time, team2: t2 });
  }
}

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

extracted.forEach(ex => {
  const t1 = teamNameMap[ex.team1] || ex.team1;
  const t2 = teamNameMap[ex.team2] || ex.team2;
  
  const m = allMatches.find(m => (m.home === t1 && m.away === t2) || (m.home === t2 && m.away === t1));
  if (m) {
    const dateParts = ex.date.split(' ');
    // e.g. Thursday 11 June 2026 => Thu, Jun 11
    const shortDay = dateParts[0].substring(0, 3);
    const shortMonth = dateParts[2].substring(0, 3);
    const dateStr = `${shortDay}, ${shortMonth} ${dateParts[1]} • ${ex.time}`;
    
    const replaceRegex = new RegExp(`'${m.id}': \\{ date: '[^']+', venue: '([^']+)' \\}`);
    if(replaceRegex.test(dataTs)) {
        dataTs = dataTs.replace(replaceRegex, `'${m.id}': { date: '${dateStr}', venue: '$1' }`);
    } else {
        console.log("Could not find line for", m.id);
    }
  } else {
    // maybe it's knockout stage? Or just didn't parse team
  }
});

// Since the previous naive UTC extraction corrupted the file for a few lines, 
// let's do a hard reset of data.ts from a known good state or just let this replace it?
// The replaceRegex looks for `{ date: '...', venue: '...' }` so it will overwrite whatever's in there.
fs.writeFileSync('src/data.ts', dataTs);
console.log("data.ts updated with ET times!");
