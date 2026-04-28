import { formatTimeWithTz } from './src/data.ts';

console.log(formatTimeWithTz('Thu, Jun 11 • 15:00', 'Estadio Azteca, Mexico City', 'ET'));
console.log(formatTimeWithTz('Thu, Jun 11 • 15:00', 'Estadio Azteca, Mexico City', 'PT'));
console.log(formatTimeWithTz('Thu, Jun 11 • 15:00', 'Estadio Azteca, Mexico City', 'CT'));
console.log(formatTimeWithTz('Thu, Jun 11 • 15:00', 'Estadio Azteca, Mexico City', 'MT'));
