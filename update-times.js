import fs from 'fs';

const times = {
  'Mexico vs South Africa': '19:00',
  'Korea Republic vs Czechia': '02:00', // T2 vs T3... wait Korea Republic is T3 and Czechia T4 ?
  'USA vs Paraguay': '01:00',
  'Haiti vs Scotland': '01:00',
  // Actually, I can just use a regex over fifa-text.txt and map to all games.
};

const text = fs.readFileSync('fifa-text.txt', 'utf8');
const regex = /([A-Za-z]+ \d+ [A-Za-z]+ \d{4})\n(?:View groups\n)?([A-Za-z \-]+?)\n(\d{2}:\d{2})\n([A-Za-z \-]+)/g;
let extracted = [];
let match;
while ((match = regex.exec(text)) !== null) {
  extracted.push({
    date: match[1],
    team1: match[2].trim(),
    time: match[3],
    team2: match[4].trim()
  });
}

// Now map to our dataset.
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
  'Congo DR': 'DR Congo'
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

// Read data.ts
let dataTs = fs.readFileSync('src/data.ts', 'utf8');

extracted.forEach(ex => {
  const t1 = teamNameMap[ex.team1] || ex.team1;
  const t2 = teamNameMap[ex.team2] || ex.team2;
  
  // Find match ID
  const m = allMatches.find(m => (m.home === t1 && m.away === t2) || (m.home === t2 && m.away === t1));
  if (m) {
    // format date string. "Thursday 11 June 2026" -> "Thu, Jun 11"
    const dateParts = ex.date.split(' ');
    const shortDay = dateParts[0].substring(0, 3);
    const shortMonth = dateParts[2].substring(0, 3);
    const dateStr = `${shortDay}, ${shortMonth} ${dateParts[1]} • ${ex.time}`;
    
    // Replace in data.ts
    const replaceRegex = new RegExp(`'${m.id}': \\{ date: '[^']+', venue: '([^']+)' \\}`);
    if(replaceRegex.test(dataTs)) {
        console.log(`Updating ${m.id} to ${dateStr}`);
        dataTs = dataTs.replace(replaceRegex, `'${m.id}': { date: '${dateStr}', venue: '$1' }`);
    }
  }
});

fs.writeFileSync('src/data.ts', dataTs);
