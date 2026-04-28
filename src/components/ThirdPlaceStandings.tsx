import React, { useMemo } from 'react';
import { TeamStanding } from '../types';
import ReactCountryFlag from 'react-country-flag';
import { TEAM_CODES } from '../data';
import { Trophy, AlertCircle } from 'lucide-react';

interface ThirdPlaceStandingsProps {
  standings: Record<string, TeamStanding[]>;
}

export function ThirdPlaceStandings({ standings }: ThirdPlaceStandingsProps) {
  const thirdPlaceTeams = useMemo(() => {
    const thirds: (TeamStanding & { group: string })[] = [];
    
    // Extract 3rd placed team from each group
    Object.keys(standings).forEach(groupId => {
      const groupStandings = standings[groupId];
      if (groupStandings.length >= 3) {
        thirds.push({ ...groupStandings[2], group: groupId });
      }
    });

    // Sort according to FIFA rules for best third-placed teams:
    // 1. Greatest number of points
    // 2. Goal difference
    // 3. Greatest number of goals scored
    // (Other tiebreakers omitted here for simplicity, typically fair play or drawing of lots)
    thirds.sort((a, b) => {
      if (a.pts !== b.pts) return b.pts - a.pts;
      if (a.gd !== b.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    return thirds;
  }, [standings]);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 relative z-10 flex flex-col items-center">
      <div className="text-center mb-12 w-full">
        <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-4">
            BEST 3RD PLACED
        </h2>
        <div className="h-1.5 w-24 bg-blue-600 dark:bg-white mx-auto rounded-full mb-8"></div>
        
        <div className="max-w-2xl mx-auto flex items-start gap-3 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl text-left border border-blue-100 dark:border-blue-500/20">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span className="text-xs text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider leading-relaxed">
            The top 8 third-placed teams qualify for the Round of 32. Ranking is determined by: 1) Points, 2) Goal Difference, 3) Goals Scored.
          </span>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-slate-50 dark:bg-white/5 text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="w-20 px-6 py-4 text-center font-black">Rank</th>
              <th className="w-16 px-2 py-4 text-center font-bold">Grp</th>
              <th className="px-6 py-4 font-bold">Team</th>
              <th className="w-12 px-0 py-4 text-center font-bold">P</th>
              <th className="w-12 px-0 py-4 text-center font-bold">GF</th>
              <th className="w-20 px-0 py-4 text-center font-bold">GD</th>
              <th className="w-24 px-6 py-4 text-center font-black text-blue-600 dark:text-white">Pts</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-900 dark:text-white">
            {thirdPlaceTeams.map((team, idx) => {
              const isQualified = idx < 8;
              return (
                <tr 
                  key={team.team} 
                  className={`
                    border-b border-slate-100 dark:border-white/5 transition-colors
                    ${isQualified ? '' : 'opacity-40'}
                    hover:bg-slate-50 dark:hover:bg-white/10 last:border-0
                  `}
                >
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-display font-black text-lg ${isQualified ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-white/20 text-slate-500'}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-2 py-5 text-center font-mono font-bold text-slate-400 dark:text-white/40">{team.group}</td>
                  <td className="px-6 py-5 font-bold flex items-center gap-4">
                    <div className="w-7 h-7 flex shrink-0 items-center justify-center overflow-hidden rounded-md shadow-sm ring-1 ring-black/5">
                      <ReactCountryFlag countryCode={TEAM_CODES[team.team] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span className="text-base truncate font-display font-black uppercase tracking-tighter">{team.team}</span>
                    {isQualified && (
                      <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-[0.2em] border border-green-500/20">
                        <Trophy className="w-3 h-3" />
                        Qualified
                      </div>
                    )}
                  </td>
                  <td className="px-0 py-5 text-center tabular-nums font-mono text-slate-400 dark:text-white/40">{team.p}</td>
                  <td className="px-0 py-5 text-center tabular-nums font-mono text-slate-400 dark:text-white/40">{team.gf}</td>
                  <td className="px-0 py-5 text-center tabular-nums font-mono font-bold">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                  <td className="px-6 py-5 text-center tabular-nums font-display font-black text-2xl text-blue-600 dark:text-white">{team.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
