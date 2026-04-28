import { Group, MatchInfo } from './types';

export const GROUPS: Group[] = [
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

export const TEAM_CODES: Record<string, string> = {
  'Mexico': 'MX', 'South Africa': 'ZA', 'South Korea': 'KR', 'Czech Republic': 'CZ',
  'Canada': 'CA', 'Bosnia & Herzegovina': 'BA', 'Qatar': 'QA', 'Switzerland': 'CH',
  'Brazil': 'BR', 'Morocco': 'MA', 'Haiti': 'HT', 'Scotland': 'GB-SCT',
  'United States': 'US', 'Paraguay': 'PY', 'Australia': 'AU', 'Turkey': 'TR',
  'Germany': 'DE', 'Curaçao': 'CW', 'Ivory Coast': 'CI', 'Ecuador': 'EC',
  'Netherlands': 'NL', 'Japan': 'JP', 'Sweden': 'SE', 'Tunisia': 'TN',
  'Belgium': 'BE', 'Egypt': 'EG', 'Iran': 'IR', 'New Zealand': 'NZ',
  'Spain': 'ES', 'Cape Verde': 'CV', 'Saudi Arabia': 'SA', 'Uruguay': 'UY',
  'France': 'FR', 'Senegal': 'SN', 'Norway': 'NO', 'Iraq': 'IQ',
  'Argentina': 'AR', 'Algeria': 'DZ', 'Austria': 'AT', 'Jordan': 'JO',
  'Portugal': 'PT', 'DR Congo': 'CD', 'Uzbekistan': 'UZ', 'Colombia': 'CO',
  'England': 'GB-ENG', 'Croatia': 'HR', 'Ghana': 'GH', 'Panama': 'PA'
};

export const getGroupMatches = (group: Group): MatchInfo[] => {
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

export const ALL_GROUP_MATCHES = GROUPS.flatMap(getGroupMatches);

export const R32_MATCH_CONFIG: Record<string, { home: string; away: string }> = {
  L_R32_1: { home: 'A2', away: 'B2' }, // Match 73
  L_R32_2: { home: 'C1', away: 'F2' }, // Match 74
  L_R32_3: { home: 'E1', away: '3RD_1' }, // Match 75
  L_R32_4: { home: 'I1', away: '3RD_2' }, // Match 76
  L_R32_5: { home: 'D1', away: '3RD_3' }, // Match 77
  L_R32_6: { home: 'G1', away: '3RD_4' }, // Match 78
  L_R32_7: { home: 'K1', away: 'L2' }, // Match 79
  L_R32_8: { home: 'H1', away: 'J2' }, // Match 80

  R_R32_1: { home: 'A1', away: '3RD_5' }, // Match 81
  R_R32_2: { home: 'B1', away: '3RD_6' }, // Match 82
  R_R32_3: { home: 'F1', away: '2C' }, // Match 83
  R_R32_4: { home: 'E2', away: 'I2' }, // Match 84
  R_R32_5: { home: 'J1', away: '2H' }, // Match 85
  R_R32_6: { home: 'L1', away: '3RD_7' }, // Match 86
  R_R32_7: { home: 'K2', away: '2G' }, // Match 87
  R_R32_8: { home: 'D2', away: 'G2' }, // Match 88
};

export const TIMEZONES = ['ET', 'CT', 'MT', 'PT'] as const;
export type Timezone = typeof TIMEZONES[number];

const VENUE_COUNTRIES: Record<string, string> = {
  'Estadio Azteca, Mexico City': 'MX',
  'Estadio Azteca': 'MX',
  'Estadio Guadalajara, Zapopan': 'MX',
  'Estadio Guadalajara': 'MX',
  'Estadio BBVA, Guadalupe': 'MX',
  'Estadio BBVA': 'MX',
  'BMO Field, Toronto': 'CA',
  'BMO Field': 'CA',
  'BC Place, Vancouver': 'CA',
  'BC Place': 'CA',
  'AT&T Stadium, Arlington': 'US',
  'AT&T Stadium': 'US',
  'Arrowhead Stadium, Kansas City': 'US',
  'Arrowhead Stadium': 'US',
  'NRG Stadium, Houston': 'US',
  'NRG Stadium': 'US',
  'Q2 Stadium, Austin': 'US',
  'Mercedes-Benz Stadium, Atlanta': 'US',
  'Mercedes-Benz Stadium': 'US',
  'Hard Rock Stadium, Miami': 'US',
  'Hard Rock Stadium': 'US',
  'MetLife Stadium, New York': 'US',
  'MetLife Stadium': 'US',
  'Lincoln Financial Field, Philadelphia': 'US',
  'Lincoln Financial Field': 'US',
  'Gillette Stadium, Foxborough': 'US',
  'Gillette Stadium': 'US',
  'SoFi Stadium, Inglewood': 'US',
  'SoFi Stadium': 'US',
  "Levi's Stadium": 'US',
  'Lumen Field, Seattle': 'US',
  'Lumen Field': 'US',
};

export function getVenueCountryCode(venue: string) {
  return VENUE_COUNTRIES[venue] || 'US';
}

const VENUE_TZ: Record<string, 'ET' | 'CT' | 'MT' | 'PT'> = {
  'Estadio Azteca, Mexico City': 'CT',
  'Estadio Azteca': 'CT',
  'Estadio Guadalajara, Zapopan': 'CT',
  'Estadio Guadalajara': 'CT',
  'Estadio BBVA, Guadalupe': 'CT',
  'Estadio BBVA': 'CT',
  'AT&T Stadium, Arlington': 'CT',
  'AT&T Stadium': 'CT',
  'Arrowhead Stadium, Kansas City': 'CT',
  'Arrowhead Stadium': 'CT',
  'NRG Stadium, Houston': 'CT',
  'NRG Stadium': 'CT',
  'Q2 Stadium, Austin': 'CT',
  'Mercedes-Benz Stadium, Atlanta': 'ET',
  'Mercedes-Benz Stadium': 'ET',
  'Hard Rock Stadium, Miami': 'ET',
  'Hard Rock Stadium': 'ET',
  'MetLife Stadium, New York': 'ET',
  'MetLife Stadium': 'ET',
  'Lincoln Financial Field, Philadelphia': 'ET',
  'Lincoln Financial Field': 'ET',
  'Gillette Stadium, Foxborough': 'ET',
  'Gillette Stadium': 'ET',
  'BMO Field, Toronto': 'ET',
  'BMO Field': 'ET',
  'SoFi Stadium, Inglewood': 'PT',
  'SoFi Stadium': 'PT',
  "Levi's Stadium": 'PT',
  'Lumen Field, Seattle': 'PT',
  'Lumen Field': 'PT',
  'BC Place, Vancouver': 'PT',
  'BC Place': 'PT',
};

const TZ_OFFSETS = { ET: 0, CT: -1, MT: -2, PT: -3 };

export function formatTimeWithTz(dateStr: string, venue: string, targetTz: Timezone): string {
  // Assume base times are scheduled in Eastern Time (ET) for uniformity in source data
  const vTz = 'ET';
  let offsetDiff = TZ_OFFSETS[targetTz] - TZ_OFFSETS[vTz];
  if (offsetDiff === 0 && dateStr.match(/AM|PM/i)) {
    // Already in correct timezone and formatted with AM/PM
    return dateStr;
  }

  const match = dateStr.match(/([A-Za-z]+),?\s*([A-Za-z]+)\s*(\d+)\s*•\s*(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return dateStr;
  
  let [_, dow, month, dayStr, hourStr, minStr, ampm] = match;
  let day = parseInt(dayStr, 10);
  let hour = parseInt(hourStr, 10);
  let min = parseInt(minStr, 10);

  if (ampm) {
    if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
  }

  hour += offsetDiff;

  // quick date shift
  let dayShift = 0;
  if (hour < 0) {
    hour += 24;
    dayShift = -1;
  } else if (hour >= 24) {
    hour -= 24;
    dayShift = 1;
  }

  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(Date.UTC(2026, M.indexOf(month.substring(0,3)), day + dayShift));
  const newDow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()];
  const newMonth = M[d.getUTCMonth()];
  const newDay = d.getUTCDate();

  const newAmpm = hour >= 12 ? 'PM' : 'AM';
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;

  // e.g. "Sun, Jun 28 • 1:00 PM"
  return `${newDow}, ${newMonth} ${newDay} • ${h12}:${min.toString().padStart(2, '0')} ${newAmpm}`;
}

export function parseDateToUTC(dateStr: string): number {
  const match = dateStr.match(/([A-Za-z]+),?\s*([A-Za-z]+)\s*(\d+)\s*•\s*(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  
  let [_, dow, month, dayStr, hourStr, minStr, ampm] = match;
  let day = parseInt(dayStr, 10);
  let hour = parseInt(hourStr, 10);
  let min = parseInt(minStr, 10);

  if (ampm) {
    if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
  }
  
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return Date.UTC(2026, M.indexOf(month.substring(0,3)), day, hour, min);
}

export const GROUP_MATCH_DETAILS: Record<string, { date: string; venue: string }> = {
  'A-1': { date: 'Thu, Jun 11 • 15:00', venue: 'Estadio Azteca, Mexico City' },
  'A-2': { date: 'Thu, Jun 11 • 22:00', venue: 'Estadio Guadalajara, Zapopan' },
  'A-3': { date: 'Thu, Jun 18 • 21:00', venue: 'SoFi Stadium, Inglewood' },
  'A-4': { date: 'Mon, Jun 15 • 11:00', venue: 'AT&T Stadium, Arlington' },
  'A-5': { date: 'Wed, Jun 24 • 21:00', venue: 'Estadio Azteca, Mexico City' },
  'A-6': { date: 'Wed, Jun 24 • 15:00', venue: 'Estadio Guadalajara, Zapopan' },
  'B-1': { date: 'Fri, Jun 12 • 15:00', venue: 'BMO Field, Toronto' },
  'B-2': { date: 'Fri, Jun 12 • 12:00', venue: 'Hard Rock Stadium, Miami' },
  'B-3': { date: 'Wed, Jun 17 • 08:00', venue: 'AT&T Stadium, Arlington' },
  'B-4': { date: 'Wed, Jun 17 • 14:00', venue: 'SoFi Stadium, Inglewood' },
  'B-5': { date: 'Fri, Jun 26 • 15:00', venue: 'BC Place, Vancouver' },
  'B-6': { date: 'Fri, Jun 26 • 15:00', venue: 'BMO Field, Toronto' },
  'C-1': { date: 'Sat, Jun 13 • 08:00', venue: 'Lincoln Financial Field, Philadelphia' },
  'C-2': { date: 'Sat, Jun 13 • 21:00', venue: 'Hard Rock Stadium, Miami' },
  'C-3': { date: 'Fri, Jun 19 • 20:30', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'C-4': { date: 'Thu, Jun 18 • 17:00', venue: 'SoFi Stadium, Inglewood' },
  'C-5': { date: 'Tue, Jun 23 • 08:00', venue: 'Lumen Field, Seattle' },
  'C-6': { date: 'Tue, Jun 23 • 14:00', venue: 'BC Place, Vancouver' },
  'D-1': { date: 'Fri, Jun 12 • 21:00', venue: 'SoFi Stadium, Inglewood' },
  'D-2': { date: 'Sat, Jun 13 • 14:00', venue: 'AT&T Stadium, Arlington' },
  'D-3': { date: 'Tue, Jun 16 • 08:00', venue: 'Q2 Stadium, Austin' },
  'D-4': { date: 'Wed, Jun 17 • 11:00', venue: 'BMO Field, Toronto' },
  'D-5': { date: 'Thu, Jun 25 • 14:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'D-6': { date: 'Thu, Jun 25 • 14:00', venue: 'BC Place, Vancouver' },
  'E-1': { date: 'Sun, Jun 14 • 08:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'E-2': { date: 'Sun, Jun 14 • 11:00', venue: 'BMO Field, Toronto' },
  'E-3': { date: 'Fri, Jun 19 • 15:00', venue: 'Lumen Field, Seattle' },
  'E-4': { date: 'Fri, Jun 19 • 17:00', venue: 'BC Place, Vancouver' },
  'E-5': { date: 'Sun, Jun 28 • 12:00', venue: 'Hard Rock Stadium, Miami' },
  'E-6': { date: 'Sun, Jun 28 • 12:00', venue: 'MetLife Stadium, New York' },
  'F-1': { date: 'Mon, Jun 15 • 11:00', venue: 'Hard Rock Stadium, Miami' },
  'F-2': { date: 'Sun, Jun 14 • 22:00', venue: 'Lincoln Financial Field, Philadelphia' },
  'F-3': { date: 'Sat, Jun 20 • 08:00', venue: 'AT&T Stadium, Arlington' },
  'F-4': { date: 'Sat, Jun 20 • 11:00', venue: 'NRG Stadium, Houston' },
  'F-5': { date: 'Sun, Jun 28 • 15:00', venue: 'BC Place, Vancouver' },
  'F-6': { date: 'Sun, Jun 28 • 15:00', venue: 'Lumen Field, Seattle' },
  'G-1': { date: 'Tue, Jun 16 • 11:00', venue: 'Lumen Field, Seattle' },
  'G-2': { date: 'Mon, Jun 15 • 21:00', venue: 'BC Place, Vancouver' },
  'G-3': { date: 'Sun, Jun 21 • 11:00', venue: 'MetLife Stadium, New York' },
  'G-4': { date: 'Sun, Jun 21 • 21:00', venue: 'Gillette Stadium, Foxborough' },
  'G-5': { date: 'Mon, Jun 29 • 15:00', venue: 'BC Place, Vancouver' },
  'G-6': { date: 'Mon, Jun 29 • 15:00', venue: 'SoFi Stadium, Inglewood' },
  'H-1': { date: 'Wed, Jun 17 • 08:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'H-2': { date: 'Wed, Jun 17 • 11:00', venue: 'NRG Stadium, Houston' },
  'H-3': { date: 'Mon, Jun 22 • 08:00', venue: 'SoFi Stadium, Inglewood' },
  'H-4': { date: 'Mon, Jun 22 • 11:00', venue: 'Lincoln Financial Field, Philadelphia' },
  'H-5': { date: 'Mon, Jun 29 • 12:00', venue: 'AT&T Stadium, Arlington' },
  'H-6': { date: 'Mon, Jun 29 • 12:00', venue: 'NRG Stadium, Houston' },
  'I-1': { date: 'Thu, Jun 18 • 08:00', venue: 'MetLife Stadium, New York' },
  'I-2': { date: 'Thu, Jun 18 • 11:00', venue: 'Gillette Stadium, Foxborough' },
  'I-3': { date: 'Tue, Jun 23 • 11:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'I-4': { date: 'Tue, Jun 23 • 17:00', venue: 'Hard Rock Stadium, Miami' },
  'I-5': { date: 'Tue, Jun 30 • 17:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'I-6': { date: 'Mon, Jun 22 • 20:00', venue: 'Hard Rock Stadium, Miami' },
  'J-1': { date: 'Tue, Jun 16 • 21:00', venue: 'Lincoln Financial Field, Philadelphia' },
  'J-2': { date: 'Fri, Jun 19 • 14:00', venue: 'Gillette Stadium, Foxborough' },
  'J-3': { date: 'Wed, Jun 24 • 08:00', venue: 'BMO Field, Toronto' },
  'J-4': { date: 'Wed, Jun 24 • 11:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  'J-5': { date: 'Wed, Jul 1 • 15:00', venue: 'BC Place, Vancouver' },
  'J-6': { date: 'Sat, Jun 27 • 22:00', venue: 'SoFi Stadium, Inglewood' },
  'K-1': { date: 'Sat, Jun 20 • 08:00', venue: 'MetLife Stadium, New York' },
  'K-2': { date: 'Wed, Jun 17 • 22:00', venue: 'Gillette Stadium, Foxborough' },
  'K-3': { date: 'Thu, Jun 25 • 08:00', venue: 'Arrowhead Stadium, Kansas City' },
  'K-4': { date: 'Tue, Jun 23 • 22:00', venue: 'Lincoln Financial Field, Philadelphia' },
  'K-5': { date: 'Thu, Jul 2 • 12:00', venue: 'AT&T Stadium, Arlington' },
  'K-6': { date: 'Thu, Jul 2 • 12:00', venue: 'NRG Stadium, Houston' },
  'L-1': { date: 'Sun, Jun 21 • 08:00', venue: 'Hard Rock Stadium, Miami' },
  'L-2': { date: 'Sun, Jun 21 • 11:00', venue: 'NRG Stadium, Houston' },
  'L-3': { date: 'Fri, Jun 26 • 08:00', venue: 'SoFi Stadium, Inglewood' },
  'L-4': { date: 'Fri, Jun 26 • 11:00', venue: 'Lincoln Financial Field, Philadelphia' },
  'L-5': { date: 'Fri, Jul 3 • 15:00', venue: 'Arrowhead Stadium, Kansas City' },
  'L-6': { date: 'Fri, Jul 3 • 15:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
};

export const KO_MATCH_DETAILS: Record<string, { date: string; venue: string }> = {
  'L_R32_1': { date: 'Sun Jun 28 • 1:00 PM', venue: 'SoFi Stadium' },
  'L_R32_2': { date: 'Mon Jun 29 • 11:00 AM', venue: 'NRG Stadium' },
  'L_R32_3': { date: 'Mon Jun 29 • 2:30 PM', venue: 'Gillette Stadium' },
  'L_R32_4': { date: 'Tue Jun 30 • 11:00 AM', venue: 'AT&T Stadium' },
  'L_R32_5': { date: 'Wed Jul 1 • 6:00 PM', venue: "Levi's Stadium" },
  'L_R32_6': { date: 'Wed Jul 1 • 2:00 PM', venue: 'Lumen Field' },
  'L_R32_7': { date: 'Thu Jul 2 • 5:00 PM', venue: 'BMO Field' },
  'L_R32_8': { date: 'Thu Jul 2 • 1:00 PM', venue: 'SoFi Stadium' },
  'R_R32_1': { date: 'Tue Jun 30 • 7:00 PM', venue: 'Estadio Azteca' },
  'R_R32_2': { date: 'Thu Jul 2 • 9:00 PM', venue: 'BC Place' },
  'R_R32_3': { date: 'Mon Jun 29 • 7:00 PM', venue: 'Estadio BBVA' },
  'R_R32_4': { date: 'Tue Jun 30 • 3:00 PM', venue: 'MetLife Stadium' },
  'R_R32_5': { date: 'Fri Jul 3 • 4:00 PM', venue: 'Hard Rock Stadium' },
  'R_R32_6': { date: 'Fri Jul 3 • 7:30 PM', venue: 'Arrowhead Stadium' },
  'R_R32_7': { date: 'Sat Jul 4 • 12:00 PM', venue: 'Lincoln Financial Field' },
  'R_R32_8': { date: 'Sat Jul 4 • 4:00 PM', venue: 'NRG Stadium' },
  'L_R16_1': { date: 'Sat Jul 4 • 3:00 PM', venue: 'Lincoln Financial Field' },
  'L_R16_2': { date: 'Sun Jul 5 • 11:00 AM', venue: 'NRG Stadium' },
  'L_R16_3': { date: 'Mon Jul 6 • 1:00 PM', venue: 'AT&T Stadium' },
  'L_R16_4': { date: 'Mon Jul 6 • 6:00 PM', venue: 'Lumen Field' },
  'R_R16_1': { date: 'Sun Jul 5 • 2:00 PM', venue: 'MetLife Stadium' },
  'R_R16_2': { date: 'Sun Jul 5 • 6:00 PM', venue: 'Estadio Azteca' },
  'R_R16_3': { date: 'Tue Jul 7 • 10:00 AM', venue: 'Mercedes-Benz Stadium' },
  'R_R16_4': { date: 'Tue Jul 7 • 2:00 PM', venue: 'BC Place' },
  'L_QF_1': { date: 'Thu Jul 9 • 2:00 PM', venue: 'Gillette Stadium' },
  'L_QF_2': { date: 'Fri Jul 10 • 1:00 PM', venue: 'SoFi Stadium' },
  'R_QF_1': { date: 'Sat Jul 11 • 3:00 PM', venue: 'Hard Rock Stadium' },
  'R_QF_2': { date: 'Sat Jul 11 • 7:00 PM', venue: 'Arrowhead Stadium' },
  'L_SF_1': { date: 'Tue Jul 14 • 1:00 PM', venue: 'AT&T Stadium' },
  'R_SF_1': { date: 'Wed Jul 15 • 1:00 PM', venue: 'Mercedes-Benz Stadium' },
  'F_1': { date: 'Sun Jul 19 • 1:00 PM', venue: 'MetLife Stadium' }
};
