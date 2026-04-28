import fs from 'fs';

let dataTs = fs.readFileSync('src/data.ts', 'utf8');

// The times in data.ts are currently UTC times parsed from fifa's site when we first ran it.
// We just need to subtract 4 hours from all times to convert them to ET.

dataTs = dataTs.replace(/date: '([^•]+)• (\d{2}):(\d{2})'/g, (match, datePrefix, h, m) => {
  let hour = parseInt(h, 10) - 4;
  let dayOffset = 0;
  if(hour < 0) {
    hour += 24;
    dayOffset = -1;
  }
  
  // Date shift logic
  const matchDate = datePrefix.match(/([A-Z][a-z]{2}), ([A-Z][a-z]{2}) (\d+)/);
  if(matchDate && dayOffset !== 0) {
    const dow = matchDate[1];
    const month = matchDate[2];
    const day = parseInt(matchDate[3], 10);
    
    const dows = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    const d = new Date(Date.UTC(2026, M.indexOf(month), day + dayOffset));
    const newDow = dows[d.getUTCDay()];
    const newMonth = M[d.getUTCMonth()];
    const newDay = d.getUTCDate();
    
    datePrefix = `${newDow}, ${newMonth} ${newDay} `;
  }
  
  const newTimeStr = hour.toString().padStart(2, '0') + ':' + m;
  return `date: '${datePrefix}• ${newTimeStr}'`;
});

fs.writeFileSync('src/data.ts', dataTs);
console.log("data.ts times shifted by -4 hours");
