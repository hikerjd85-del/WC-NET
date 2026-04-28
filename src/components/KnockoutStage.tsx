import React from 'react';
import { Trophy } from 'lucide-react';
import { MatchScore } from '../types';
import { KO_MATCH_DETAILS, TEAM_CODES, Timezone, formatTimeWithTz, getVenueCountryCode } from '../data';
import ReactCountryFlag from 'react-country-flag';

interface KoMatchProps {
  matchId: string;
  home: string | null;
  away: string | null;
  score: MatchScore;
  onScoreChange: (id: string, home: number | null, away: number | null, pensHome?: number | null, pensAway?: number | null) => void;
  label?: string;
  timezone: Timezone;
}

const getMatchTheme = (id: string, theme: string) => {
  const isDark = theme === 'dark';
  return { 
    border: isDark ? 'border-white/10' : 'border-slate-200', 
    bg: isDark ? 'bg-[#111111]' : 'bg-white', 
    header: isDark ? 'bg-white/5' : 'bg-slate-50', 
    textHeader: isDark ? 'text-white/60' : 'text-slate-500',
    accent: id.includes('F_1') ? 'bg-blue-600' : 'bg-slate-300 dark:bg-white/20'
  };
}

export function KoMatch({ matchId, home, away, score, onScoreChange, label, timezone }: KoMatchProps) {
  const isDraw = score.home !== null && score.home === score.away;
  const isDark = document.documentElement.classList.contains('dark');
  const theme = getMatchTheme(matchId, isDark ? 'dark' : 'light');
  const details = KO_MATCH_DETAILS[matchId];
  const timeStr = details ? formatTimeWithTz(details.date, details.venue, timezone) : '';

  const handleScoreChange = (isHome: boolean, valStr: string) => {
    const val = valStr ? parseInt(valStr) : null;
    if (isHome) onScoreChange(matchId, val, score.away, score.pensHome, score.pensAway);
    else onScoreChange(matchId, score.home, val, score.pensHome, score.pensAway);
  };

  const handlePensChange = (isHome: boolean, valStr: string) => {
    const val = valStr ? parseInt(valStr) : null;
    if (isHome) onScoreChange(matchId, score.home, score.away, val, score.pensAway);
    else onScoreChange(matchId, score.home, score.away, score.pensHome, val);
  };

  const isFinal = matchId === 'F_1';

  return (
    <div className={`flex flex-col border ${theme.border} ${theme.bg} rounded-2xl shadow-sm text-sm w-44 sm:w-52 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group relative
      ${isFinal ? 'ring-2 ring-blue-600 dark:ring-white shadow-2xl' : ''}`}>
      
      <div className={`${theme.header} px-4 py-3 flex flex-col border-b ${theme.border}`}>
        <span className={`text-[10px] ${theme.textHeader} font-black uppercase tracking-[0.2em]`}>{label || matchId.replace(/_/g, ' ')}</span>
        {details && (
          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 dark:text-white/30 uppercase font-bold truncate">
            <span className="truncate">{timeStr} •</span>
            <ReactCountryFlag countryCode={getVenueCountryCode(details.venue)} svg style={{ width: '1em', height: '1em', borderRadius: '1px' }} />
            <span className="truncate">{details.venue}</span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        {/* Home Row */}
        <div className="flex items-center justify-between gap-3 p-1">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-sm overflow-hidden ring-1 ring-black/5 shrink-0 bg-slate-100 dark:bg-white/10 flex items-center justify-center">
              {home ? <ReactCountryFlag countryCode={TEAM_CODES[home] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <span className={`text-sm font-bold truncate ${home ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/20'}`}>
              {home || 'TBD'}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isDraw && (
              <input 
                type="number" min="0" 
                className="w-6 h-8 text-[10px] text-center bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-500/30 hide-arrows underline decoration-blue-500/50" 
                placeholder="P" 
                value={score.pensHome ?? ''}
                onChange={e => handlePensChange(true, e.target.value)}
              />
            )}
            <input 
              type="number" min="0" 
              className="w-9 h-9 text-sm text-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white font-black hide-arrows focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              value={score.home ?? ''}
              onChange={e => handleScoreChange(true, e.target.value)}
            />
          </div>
        </div>

        {/* Away Row */}
        <div className="flex items-center justify-between gap-3 p-1">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-sm overflow-hidden ring-1 ring-black/5 shrink-0 bg-slate-100 dark:bg-white/10 flex items-center justify-center">
              {away ? <ReactCountryFlag countryCode={TEAM_CODES[away] || ''} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <span className={`text-sm font-bold truncate ${away ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/20'}`}>
              {away || 'TBD'}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isDraw && (
              <input 
                type="number" min="0" 
                className="w-6 h-8 text-[10px] text-center bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-500/30 hide-arrows underline decoration-blue-500/50" 
                placeholder="P" 
                value={score.pensAway ?? ''}
                onChange={e => handlePensChange(false, e.target.value)}
              />
            )}
            <input 
              type="number" min="0" 
              className="w-9 h-9 text-sm text-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white font-black hide-arrows focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              value={score.away ?? ''}
              onChange={e => handleScoreChange(false, e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {isFinal && (
        <div className="absolute top-0 right-0 p-2">
          <Trophy className="w-4 h-4 text-blue-600 dark:text-white" />
        </div>
      )}
    </div>
  );
}

// Columns definition for the bracket layout
const BRACKET_COLUMNS = [
  { id: 'L_R32', matches: ['L_R32_1', 'L_R32_2', 'L_R32_3', 'L_R32_4', 'L_R32_5', 'L_R32_6', 'L_R32_7', 'L_R32_8'] },
  { id: 'L_R16', matches: ['L_R16_1', 'L_R16_2', 'L_R16_3', 'L_R16_4'] },
  { id: 'L_QF', matches: ['L_QF_1', 'L_QF_2'] },
  { id: 'L_SF', matches: ['L_SF_1'] },
  { id: 'FINAL', matches: ['F_1'] },
  { id: 'R_SF', matches: ['R_SF_1'] },
  { id: 'R_QF', matches: ['R_QF_1', 'R_QF_2'] },
  { id: 'R_R16', matches: ['R_R16_1', 'R_R16_2', 'R_R16_3', 'R_R16_4'] },
  { id: 'R_R32', matches: ['R_R32_1', 'R_R32_2', 'R_R32_3', 'R_R32_4', 'R_R32_5', 'R_R32_6', 'R_R32_7', 'R_R32_8'] },
];

export function KnockoutStage({ matchups, scores, onScoreChange, timezone }: {
  matchups: Record<string, { home: string | null, away: string | null }>,
  scores: Record<string, MatchScore>,
  onScoreChange: (id: string, home: number | null, away: number | null, pensHome?: number | null, pensAway?: number | null) => void,
  timezone: Timezone
}) {
  return (
    <div className="w-full overflow-x-auto px-4 pb-24 relative min-h-[900px] flex items-center">
      <div className="flex gap-4 sm:gap-6 min-w-max h-full mx-auto relative z-10 py-10">
        {BRACKET_COLUMNS.map((col) => (
          <div key={col.id} className={`flex flex-col justify-around py-4 flex-shrink-0 w-44 sm:w-52 min-h-[900px]`}>
            {col.matches.map(mId => {
              const match = matchups[mId] || { home: null, away: null };
              const score = scores[mId] || { home: null, away: null };
              const label = mId.includes('R32') ? 'ROUND OF 32' : mId.includes('R16') ? 'ROUND OF 16' : mId.includes('QF') ? 'QUARTER-FINALS' : mId.includes('SF') ? 'SEMI-FINALS' : 'FINAL';

              return (
                <div key={mId} className="my-4 relative">
                  <KoMatch 
                    matchId={mId}
                    home={match.home}
                    away={match.away}
                    score={score}
                    onScoreChange={onScoreChange}
                    label={label}
                    timezone={timezone}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
