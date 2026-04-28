import React, { useMemo } from 'react';
import { MatchScore, TeamStanding } from '../types';
import { ALL_GROUP_MATCHES, GROUPS } from '../data';
import { Activity, Goal, Trophy, Star, TrendingUp, ShieldCheck, Flame, Globe2, AlertCircle, Zap, Target, HelpCircle } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { TEAM_CODES } from '../data';

const StatsTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center ml-1.5 align-top mt-[1px]">
    <HelpCircle className="w-3 h-3 opacity-60 hover:opacity-100 cursor-help transition-opacity" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 text-slate-100 text-[11px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl shadow-black/20 pointer-events-none normal-case font-medium leading-relaxed tracking-normal ring-1 ring-white/10 text-center">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

interface StatsDashboardProps {
  groupScores: Record<string, MatchScore>;
  koScores: Record<string, MatchScore>;
  standings: Record<string, TeamStanding[]>;
}

export function StatsDashboard({ groupScores, koScores, standings }: StatsDashboardProps) {
  const stats = useMemo(() => {
    let totalMatchesPlayed = 0;
    let totalGoals = 0;
    let totalDraws = 0;
    const teamStats: Record<string, { gf: number, ga: number, wins: number, cleansheets: number }> = {};
    const groupGoals: Record<string, number> = {};
    
    let biggestWin = { margin: 0, winner: '', loser: '', score: '' };
    let goalFestival = { total: 0, home: '', away: '', score: '' };

    const initTeam = (t: string) => {
      if (!teamStats[t]) teamStats[t] = { gf: 0, ga: 0, wins: 0, cleansheets: 0 };
    };

    const processMatch = (home: string | null, away: string | null, score: MatchScore, groupId: string | null = null) => {
      if (score.home !== null && score.away !== null && home && away) {
        totalMatchesPlayed++;
        totalGoals += score.home + score.away;
        
        if (groupId) {
          groupGoals[groupId] = (groupGoals[groupId] || 0) + score.home + score.away;
        }

        initTeam(home);
        initTeam(away);
        
        teamStats[home].gf += score.home;
        teamStats[home].ga += score.away;
        teamStats[away].gf += score.away;
        teamStats[away].ga += score.home;

        if (score.home > score.away) teamStats[home].wins++;
        else if (score.away > score.home) teamStats[away].wins++;
        else totalDraws++;
        
        if (score.away === 0) teamStats[home].cleansheets++;
        if (score.home === 0) teamStats[away].cleansheets++;

        const margin = Math.abs(score.home - score.away);
        if (margin > biggestWin.margin) {
          biggestWin = {
            margin,
            winner: score.home > score.away ? home : away,
            loser: score.home > score.away ? away : home,
            score: score.home > score.away ? `${score.home}-${score.away}` : `${score.away}-${score.home}`
          };
        }

        const totalMatchGoals = score.home + score.away;
        if (totalMatchGoals > goalFestival.total) {
          goalFestival = {
            total: totalMatchGoals,
            home,
            away,
            score: `${score.home}-${score.away}`
          };
        }
      }
    };

    // Process Group Matches
    ALL_GROUP_MATCHES.forEach(m => {
      processMatch(m.home, m.away, groupScores[m.id] || { home: null, away: null }, m.id.split('-')[0]);
    });

    // Process KO Matches
    // We don't have team names easily accessible here, but we can skip KO for stats if needed.
    // For now, let's just use group matches for these stats, or the user can expand this later.

    let highestScoringTeam = '';
    let maxGoals = -1;
    let mostCleansheetsTeam = '';
    let maxCleansheets = -1;

    Object.entries(teamStats).forEach(([team, s]) => {
      if (s.gf > maxGoals) { highestScoringTeam = team; maxGoals = s.gf; }
      if (s.cleansheets > maxCleansheets) { mostCleansheetsTeam = team; maxCleansheets = s.cleansheets; }
    });

    let hottestGroup = { id: '', goals: -1 };
    Object.entries(groupGoals).forEach(([id, goals]) => {
      if (goals > hottestGroup.goals) {
        hottestGroup = { id, goals };
      }
    });

    // Perfect Starts (Teams with 3 wins or max p with w=p and p>0)
    const perfectStarts: string[] = [];
    Object.values(standings).forEach(groupStandings => {
       groupStandings.forEach(s => {
         if (s.p > 0 && s.w === s.p) perfectStarts.push(s.team);
       });
    });

    // Tightest Group
    let tightestGroup = { id: '', diff: 999 };
    Object.entries(standings).forEach(([id, groupStandings]) => {
      const p1 = groupStandings[0]?.pts || 0;
      const pLast = groupStandings[groupStandings.length - 1]?.pts || 0;
      const matchesPlayed = groupStandings.reduce((sum, s) => sum + s.p, 0);
      if (matchesPlayed > 0) {
         if (p1 - pLast < tightestGroup.diff) {
            tightestGroup = { id, diff: p1 - pLast };
         }
      }
    });

    // Top 3rd placers
    const thirds = Object.values(standings).map(st => st[2]);
    const sortedThirds = thirds.filter(t => t.p > 0).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf).slice(0, 3);

    return {
      totalMatchesPlayed,
      totalGoals,
      avgGoals: totalMatchesPlayed ? (totalGoals / totalMatchesPlayed).toFixed(2) : '0.00',
      drawRate: totalMatchesPlayed ? Math.round((totalDraws / totalMatchesPlayed) * 100) : 0,
      highestScoringTeam,
      maxGoals,
      mostCleansheetsTeam,
      maxCleansheets,
      biggestWin,
      hottestGroup,
      tightestGroup: tightestGroup.diff !== 999 ? tightestGroup : null,
      perfectStarts,
      sortedThirds,
      goalFestival
    };
  }, [groupScores, koScores, standings]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 mb-4 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
        
        {/* Card 1: Matches / Total */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-5 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Globe2 className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-blue-200 uppercase tracking-widest font-bold mb-1 flex items-center">Tournament Progress <StatsTooltip text="The number of matches played out of the total 104 matches." /></div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-black text-white leading-none">{stats.totalMatchesPlayed}</span>
                <span className="text-lg font-black text-blue-300 leading-tight mb-0.5">/ 104</span>
              </div>
              <div className="mt-3 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, Math.max(0, (stats.totalMatchesPlayed / 104) * 100))}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 2: Goals */}
        <div className="relative bg-gradient-to-br from-[#E40046] to-rose-700 rounded-2xl p-5 shadow-lg shadow-rose-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Goal className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-rose-200 uppercase tracking-widest font-bold mb-1 flex items-center group-hover:z-50 relative">Total Goals <StatsTooltip text="The total number of goals scored in the tournament so far, and the average per match." /></div>
              <div className="text-4xl font-display font-black text-white leading-none">{stats.totalGoals}</div>
              <div className="mt-2 text-[11px] font-black tracking-wider text-rose-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" />
                {stats.avgGoals} AVG PER MATCH
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 3: Top Offense */}
        <div className="relative bg-gradient-to-br from-[#00A3E0] to-cyan-700 rounded-2xl p-5 shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Trophy className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-cyan-200 uppercase tracking-widest font-bold mb-1 flex items-center">Most Lethal Attack <StatsTooltip text="The team that has scored the most overall goals." /></div>
              {stats.highestScoringTeam ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-auto drop-shadow-sm rounded-[2px] overflow-hidden flex-shrink-0 flex items-center">
                      <ReactCountryFlag countryCode={TEAM_CODES[stats.highestScoringTeam] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="text-2xl font-display font-black text-white truncate leading-tight uppercase">
                        {stats.highestScoringTeam}
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-black tracking-wider text-cyan-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md">
                    {stats.maxGoals} GOALS SCORED
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white/50 leading-tight">--</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 4: Best Defense / Biggest Win */}
        <div className="relative bg-gradient-to-br from-[#A3D02F] to-emerald-700 rounded-2xl p-5 shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <ShieldCheck className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-emerald-100 uppercase tracking-widest font-bold mb-1 flex items-center">Biggest Margin <StatsTooltip text="The match that was won by the largest goal difference." /></div>
              {stats.biggestWin.winner ? (
                <>
                  <div className="flex items-center gap-2 w-full">
                    <div className="text-2xl font-display font-black text-white truncate leading-tight uppercase">
                        {stats.biggestWin.winner}
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-black tracking-wider text-emerald-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md line-clamp-1">
                    WON {stats.biggestWin.score} vs {stats.biggestWin.loser}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white/50 leading-tight">--</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 4.1: Goal Festival */}
        <div className="relative bg-gradient-to-br from-pink-500 to-rose-800 rounded-2xl p-5 shadow-lg shadow-pink-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Flame className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-pink-200 uppercase tracking-widest font-bold mb-1 flex items-center">Goal Festival <StatsTooltip text="The match with the highest total number of goals counted across both teams." /></div>
              {stats.goalFestival.total > 0 ? (
                <>
                  <div className="flex items-center gap-2 w-full">
                    <div className="text-2xl font-display font-black text-white truncate leading-tight uppercase flex items-center gap-1.5">
                        <span className="truncate max-w-[80px]">{stats.goalFestival.home}</span>
                        <span className="text-sm opacity-50">v</span>
                        <span className="truncate max-w-[80px]">{stats.goalFestival.away}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-black tracking-wider text-pink-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md line-clamp-1">
                    {stats.goalFestival.total} GOALS ({stats.goalFestival.score})
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white/50 leading-tight">--</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 4.2: Clean Sheets */}
        <div className="relative bg-gradient-to-br from-slate-600 to-slate-900 rounded-2xl p-5 shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <ShieldCheck className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold mb-1 flex items-center">Steel Defense <StatsTooltip text="The team with the highest number of clean sheets (matches where they conceded 0 goals)." /></div>
              {stats.mostCleansheetsTeam ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-auto drop-shadow-sm rounded-[2px] overflow-hidden flex-shrink-0 flex items-center">
                      <ReactCountryFlag countryCode={TEAM_CODES[stats.mostCleansheetsTeam] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="text-2xl font-display font-black text-white truncate leading-tight uppercase">
                        {stats.mostCleansheetsTeam}
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] font-black tracking-wider text-slate-200 flex items-center gap-1.5 bg-black/30 inline-flex px-2 py-1 rounded-md line-clamp-1">
                    {stats.maxCleansheets} CLEAN SHEETS
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white/50 leading-tight">--</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 5: Draw Rate */}
        <div className="relative bg-gradient-to-br from-amber-500 to-orange-700 rounded-2xl p-5 shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Activity className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-orange-200 uppercase tracking-widest font-bold mb-1 flex items-center group-hover:z-50 relative">Draw Rate <StatsTooltip text="The percentage of played matches that ended in a draw." /></div>
              <div className="text-4xl font-display font-black text-white leading-none">{stats.drawRate}%</div>
              <div className="mt-2 text-[11px] font-black tracking-wider text-orange-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md">
                OF PLAYED MATCHES
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 6: Hottest Group */}
        <div className="relative bg-gradient-to-br from-purple-600 to-fuchsia-800 rounded-2xl p-5 shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Flame className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-purple-200 uppercase tracking-widest font-bold mb-1 flex items-center group-hover:z-50 relative">Hottest Group <StatsTooltip text="The group playing with the highest total number of goals scored among its teams." /></div>
              {stats.hottestGroup.id ? (
                <>
                  <div className="text-2xl font-display font-black text-white truncate leading-tight uppercase">
                      GROUP {stats.hottestGroup.id}
                  </div>
                  <div className="mt-2 text-[11px] font-black tracking-wider text-purple-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md">
                    {stats.hottestGroup.goals} GOALS
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white/50 leading-tight">--</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 7: Tightest Group */}
        <div className="relative bg-gradient-to-br from-teal-500 to-cyan-800 rounded-2xl p-5 shadow-lg shadow-teal-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Target className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-teal-200 uppercase tracking-widest font-bold mb-1 flex items-center group-hover:z-50 relative">Tightest Group <StatsTooltip text="The group with the smallest point difference between the 1st and last place teams." /></div>
              {stats.tightestGroup ? (
                <>
                  <div className="text-2xl font-display font-black text-white truncate leading-tight uppercase">
                      GROUP {stats.tightestGroup.id}
                  </div>
                  <div className="mt-2 text-[11px] font-black tracking-wider text-teal-100 flex items-center gap-1.5 bg-black/10 inline-flex px-2 py-1 rounded-md">
                    {stats.tightestGroup.diff} PT DIFFERENTIAL
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white/50 leading-tight">--</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Card 8: Perfect Starts */}
        <div className="relative bg-gradient-to-br from-yellow-500 to-amber-700 rounded-2xl p-5 shadow-lg shadow-yellow-900/20 transition-all hover:-translate-y-1 group">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500">
              <Star className="w-32 h-32 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="text-[10px] text-yellow-200 uppercase tracking-widest font-bold mb-2 flex items-center group-hover:z-50 relative">Perfect Starts <StatsTooltip text="Teams that have won 100% of the matches they have played." /></div>
            <div className="flex flex-wrap gap-2">
              {stats.perfectStarts.length > 0 ? (
                 stats.perfectStarts.slice(0, 4).map(team => (
                    <div key={team} className="bg-black/20 px-2 py-1 rounded flex items-center gap-1.5" title={team}>
                      <div className="w-4 h-auto drop-shadow-sm rounded-[1px] overflow-hidden flex-shrink-0 flex items-center">
                        <ReactCountryFlag countryCode={TEAM_CODES[team] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span className="text-[10px] font-black text-white truncate max-w-[60px]">{team}</span>
                    </div>
                 ))
              ) : (
                <div className="text-lg font-display font-black text-white/50 leading-tight mt-1">--</div>
              )}
              {stats.perfectStarts.length > 4 && (
                 <div className="bg-black/20 px-2 py-1 rounded flex items-center justify-center text-[10px] font-black text-white">
                   +{stats.perfectStarts.length - 4} MORE
                 </div>
              )}
            </div>
            {stats.perfectStarts.length > 0 && <div className="mt-auto pt-2 text-[10px] font-bold text-yellow-100/70">100% WIN RATE</div>}
          </div>
        </div>
      </div>
      
      {/* Third Row: Wildcard Watch */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wildcard Watch */}
        <div className="relative bg-white dark:bg-[#111111] rounded-2xl p-5 shadow-md border border-slate-200 dark:border-white/10 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 relative z-50">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center">
              Wildcard Watch
              <StatsTooltip text="The top 3 teams currently sitting in 3rd place across all groups. They will advance to the knockout stages." />
            </h3>
            <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider">
               Top 3 Third-Placers
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {stats.sortedThirds.length > 0 ? stats.sortedThirds.map((team, idx) => (
                <div key={team.team} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                   <div className="w-8 h-8 flex shrink-0 items-center justify-center overflow-hidden rounded shadow-sm ring-1 ring-black/10">
                     <ReactCountryFlag countryCode={TEAM_CODES[team.team] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{team.team}</div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-white/50">{team.pts} PTS • {team.gd > 0 ? `+${team.gd}` : team.gd} GD</div>
                   </div>
                   <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-xs">
                     #{idx + 1}
                   </div>
                </div>
             )) : (
                <div className="col-span-3 text-center py-6 text-sm font-bold text-slate-500 dark:text-white/50">
                   Play some matches to see wildcard standings
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
