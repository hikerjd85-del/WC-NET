import { Group, MatchScore, TeamStanding } from './types';
import { getGroupMatches, GROUP_MATCH_DETAILS, parseDateToUTC } from './data';

export function calculateStandings(group: Group, scores: Record<string, MatchScore>): TeamStanding[] {
  const stats = {} as Record<string, TeamStanding>;
  group.teams.forEach(t => {
    stats[t] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] };
  });

  let matches = getGroupMatches(group);
  
  // Sort matches chronologically to ensure form is calculated in the right order
  matches = matches.sort((a, b) => {
    const dA = GROUP_MATCH_DETAILS[a.id]?.date || '';
    const dB = GROUP_MATCH_DETAILS[b.id]?.date || '';
    return parseDateToUTC(dA) - parseDateToUTC(dB);
  });

  matches.forEach(m => {
    const score = scores[m.id];
    if (score && score.home !== null && score.away !== null) {
      const hScore = score.home;
      const aScore = score.away;
      stats[m.home].p++;
      stats[m.away].p++;
      stats[m.home].gf += hScore;
      stats[m.home].ga += aScore;
      stats[m.away].gf += aScore;
      stats[m.away].ga += hScore;

      if (hScore > aScore) {
        stats[m.home].w++;
        stats[m.home].pts += 3;
        stats[m.home].form.push('W');
        
        stats[m.away].l++;
        stats[m.away].form.push('L');
      } else if (hScore < aScore) {
        stats[m.away].w++;
        stats[m.away].pts += 3;
        stats[m.away].form.push('W');
        
        stats[m.home].l++;
        stats[m.home].form.push('L');
      } else {
        stats[m.home].d++;
        stats[m.home].pts += 1;
        stats[m.home].form.push('D');
        
        stats[m.away].d++;
        stats[m.away].pts += 1;
        stats[m.away].form.push('D');
      }
    }
  });

  Object.values(stats).forEach(s => {
    s.gd = s.gf - s.ga;
  });

  return Object.values(stats).sort((a, b) => {
    if (a.pts !== b.pts) return b.pts - a.pts;
    if (a.gd !== b.gd) return b.gd - a.gd;
    if (a.gf !== b.gf) return b.gf - a.gf;

    // Head to head
    const abMatch = matches.find(m => (m.home === a.team && m.away === b.team) || (m.home === b.team && m.away === a.team));
    if (abMatch) {
      const score = scores[abMatch.id];
      if (score && score.home !== null && score.away !== null) {
        let aScore = abMatch.home === a.team ? score.home : score.away;
        let bScore = abMatch.home === a.team ? score.away : score.home;
        if (aScore !== bScore) return bScore - aScore;
      }
    }
    
    return 0;
  });
}
