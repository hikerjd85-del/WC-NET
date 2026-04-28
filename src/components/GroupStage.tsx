import React from 'react';
import { Group, MatchInfo, MatchScore, TeamStanding } from '../types';
import { getGroupMatches, ALL_GROUP_MATCHES, GROUP_MATCH_DETAILS, TEAM_CODES, Timezone, formatTimeWithTz, getVenueCountryCode, parseDateToUTC } from '../data';
import ReactCountryFlag from 'react-country-flag';

const groupColors: Record<string, { header: string, border: string, bg: string, text: string, accent: string }> = {
  'A': { header: 'bg-[#E40046]', border: 'border-[#E40046]/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-[#E40046]' }, // Pink
  'B': { header: 'bg-[#00A3E0]', border: 'border-[#00A3E0]/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-[#00A3E0]' }, // Cyan
  'C': { header: 'bg-[#4D2482]', border: 'border-[#4D2482]/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-[#4D2482]' }, // Deep Purple
  'D': { header: 'bg-[#A3D02F]', border: 'border-[#A3D02F]/40', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-[#A3D02F]' }, // Electric Lime
  'E': { header: 'bg-orange-500', border: 'border-orange-500/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-orange-500' },
  'F': { header: 'bg-red-500', border: 'border-red-500/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-red-500' },
  'G': { header: 'bg-emerald-500', border: 'border-emerald-500/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-emerald-500' },
  'H': { header: 'bg-blue-600', border: 'border-blue-600/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-blue-600' },
  'I': { header: 'bg-fuchsia-600', border: 'border-fuchsia-600/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-fuchsia-600' },
  'J': { header: 'bg-teal-500', border: 'border-teal-500/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-teal-500' },
  'K': { header: 'bg-amber-500', border: 'border-amber-500/40', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-amber-500' },
  'L': { header: 'bg-indigo-500', border: 'border-indigo-500/30', bg: 'bg-white dark:bg-[#111111]', text: 'text-slate-900', accent: 'bg-indigo-500' },
};

interface GroupCardProps {
  key?: React.Key;
  group: Group;
  standings: TeamStanding[];
}

export function GroupCard({ group, standings }: GroupCardProps) {
  const colors = groupColors[group.id] || groupColors['A'];

  return (
    <div className={`border ${colors.border} ${colors.bg} rounded-2xl shadow-md flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group/card`}>
      <div className={`p-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center ${colors.header}`}>
        <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">GROUP {group.id}</h3>
        <div className="w-8 h-1 bg-white/40 rounded-full"></div>
      </div>
      
      {/* Standings Table */}
      <div className="p-0 flex-1">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-slate-50 dark:bg-white/5 text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-[0.2em]">
            <tr className="border-b border-slate-100 dark:border-white/5">
              <th className="px-4 py-3 font-bold w-full">Team</th>
              <th className="px-0 py-3 w-8 text-center font-bold">P</th>
              <th className="px-0 py-3 w-10 text-center font-bold">GD</th>
              <th className="px-0 py-3 w-10 text-center font-black" style={{ color: colors.header }}>Pts</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-900 dark:text-white">
            {standings.map((s, idx) => (
              <tr key={s.team} className={`${idx < 2 ? 'bg-slate-50/50 dark:bg-white/5' : ''} border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors relative`}>
                <td className="px-4 py-2 font-bold flex flex-col justify-center min-h-[44px]">
                  <div className="flex items-center gap-3 truncate">
                    {idx < 2 && <div className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-blue-500 dark:bg-blue-400`} title="Qualified"></div>}
                    {idx === 2 && <div className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-orange-400 dark:bg-orange-400`} title="Wildcard Contender"></div>}
                    {idx > 2 && <div className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-red-500/50 dark:bg-red-500/50`} title="Elimination Risk"></div>}
                    <div className="w-5 h-5 flex shrink-0 items-center justify-center overflow-hidden rounded-sm shadow-sm ring-1 ring-black/10">
                      <ReactCountryFlag countryCode={TEAM_CODES[s.team] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span className="truncate leading-none">{s.team}</span>
                  </div>
                  {s.form && s.form.length > 0 && (
                    <div className="flex items-center gap-1 pl-8 mt-1.5">
                      {s.form.slice(-3).map((f, i) => (
                         <span key={i} className={`w-3 h-3 rounded-[3px] flex items-center justify-center text-[7px] font-black text-white ${f==='W'?'bg-green-500':f==='D'?'bg-slate-400':'bg-red-500'}`}>
                            {f}
                         </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-0 py-2 w-8 text-center tabular-nums opacity-60 align-middle">{s.p}</td>
                <td className="px-0 py-2 w-10 text-center tabular-nums opacity-80 align-middle">{s.gd > 0 ? `+${s.gd}` : s.gd}</td>
                <td className="px-0 py-2 w-10 text-center tabular-nums font-black align-middle" style={{ color: colors.header }}>{s.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GroupStage({ groups, standings, scores, onScoreChange, timezone }: {
  groups: Group[],
  standings: Record<string, TeamStanding[]>,
  scores: Record<string, MatchScore>,
  onScoreChange: (id: string, home: number | null, away: number | null) => void,
  timezone: Timezone
}) {
  
  // Prepare matches sorted chronologically
  const sortedMatches = [...ALL_GROUP_MATCHES].sort((a, b) => {
    const dA = GROUP_MATCH_DETAILS[a.id]?.date || '';
    const dB = GROUP_MATCH_DETAILS[b.id]?.date || '';
    return parseDateToUTC(dA) - parseDateToUTC(dB);
  });

  // Group matches by formatted day string (based on the timezone chosen!)
  const groupedDates: Record<string, MatchInfo[]> = {};
  sortedMatches.forEach(m => {
    const details = GROUP_MATCH_DETAILS[m.id];
    if (!details) return;
    const timeStr = formatTimeWithTz(details.date, details.venue, timezone);
    // extract just the date part, e.g. "Thu, Jun 11"
    const dateOnly = timeStr.split(' •')[0] || timeStr;
    if (!groupedDates[dateOnly]) groupedDates[dateOnly] = [];
    groupedDates[dateOnly].push(m);
  });

  return (
    <div className="flex flex-col gap-12 p-4">
      
      {/* 1. The Group Standings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {groups.map(g => (
          <GroupCard 
            key={g.id} 
            group={g} 
            standings={standings[g.id]} 
          />
        ))}
      </div>

      <div className="w-full h-px bg-slate-200 dark:bg-white/10"></div>

      <div className="flex flex-col w-full max-w-5xl mx-auto mt-8">
        <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8 text-center pt-6">
          ALL FIXTURES
        </h2>

        {/* Jump to Match Day Navigation */}
        <div className="mb-10 w-full overflow-hidden border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-black/20 p-4">
          <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4">JUMP TO MATCH DAY</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
            {Object.entries(groupedDates).map(([dayStr, dayMatches]) => {
              const played = dayMatches.filter(m => {
                const s = scores[m.id];
                return s && s.home !== null && s.away !== null;
              }).length;
              const total = dayMatches.length;
              
              const targetId = `day-${dayStr.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
              
              // Handle longer strings by splitting the day and date
              const parts = dayStr.split(', ');
              const dayName = parts[0] ? parts[0] + ',' : '';
              const datePart = parts[1] || dayStr;

              return (
                <button
                  key={dayStr}
                  onClick={() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                      const yOffset = -100; // offset for sticky headers
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({top: y, behavior: 'smooth'});
                    }
                  }}
                  className="flex-shrink-0 snap-start flex flex-col items-start justify-between min-w-[120px] h-[80px] p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm"
                >
                  <div className="flex flex-col items-start text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    <span>{dayName}</span>
                    <span>{datePart}</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-baseline select-none">
                    <span className={played === total ? "text-green-500" : played > 0 ? "text-blue-500" : ""}>{played}</span>
                    <span className="opacity-60">/{total}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {Object.entries(groupedDates).map(([dayStr, dayMatches]) => {
            const targetId = `day-${dayStr.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
            return (
            <div key={dayStr} id={targetId} className="flex flex-col gap-4 scroll-mt-24">
              <div className="sticky top-20 z-30 py-2 bg-slate-50/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/50 dark:border-white/5">
                 <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-center">
                   {dayStr}
                 </h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {dayMatches.map(m => {
                  const score = scores[m.id] || { home: null, away: null };
                  const details = GROUP_MATCH_DETAILS[m.id];
                  const timeStr = details ? formatTimeWithTz(details.date, details.venue, timezone) : '';
                  const timeOnly = timeStr.split('• ')[1] || timeStr; // Just the time
                  const venueCode = details ? getVenueCountryCode(details.venue) : '';
                  const groupId = m.id.split('-')[0];
                  const colors = groupColors[groupId] || groupColors['A'];

                  return (
                    <div key={m.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden hover:shadow-md transition-all">
                      
                      {/* Match Header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm text-white ${colors.header}`}>
                            Gr. {groupId}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                            {timeOnly}
                          </span>
                        </div>
                        {details && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 break-all text-right">
                            <ReactCountryFlag countryCode={venueCode} svg style={{ width: '1em', height: '1em', borderRadius: '2px' }} />
                            <span>{details.venue}</span>
                          </div>
                        )}
                      </div>

                      {/* Match Teams & Score */}
                      <div className="flex items-center justify-between p-4 gap-4">
                        <div className="flex-1 text-right font-display font-black text-base md:text-lg text-slate-800 dark:text-slate-100 flex items-center justify-end gap-3 leading-none">
                          <span className="truncate">{m.home}</span>
                          <div className="w-6 h-6 flex-shrink-0 rounded-sm overflow-hidden ring-1 ring-black/10 shadow-sm">
                            <ReactCountryFlag countryCode={TEAM_CODES[m.home] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <input 
                            type="number" 
                            min="0"
                            className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl text-center bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white font-black shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50 hide-arrows transition-all"
                            value={score.home ?? ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value) : null;
                              onScoreChange(m.id, val, score.away);
                            }}
                          />
                          <span className="text-slate-300 dark:text-slate-700 font-black">-</span>
                          <input 
                            type="number" 
                            min="0"
                            className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl text-center bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white font-black shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50 hide-arrows transition-all"
                            value={score.away ?? ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value) : null;
                              onScoreChange(m.id, score.home, val);
                            }}
                          />
                        </div>

                        <div className="flex-1 text-left font-display font-black text-base md:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-3 leading-none">
                          <div className="w-6 h-6 flex-shrink-0 rounded-sm overflow-hidden ring-1 ring-black/10 shadow-sm">
                            <ReactCountryFlag countryCode={TEAM_CODES[m.away] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span className="truncate">{m.away}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
