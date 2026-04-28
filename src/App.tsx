import React, { useState, useEffect } from 'react';
import { Trophy, CalendarDays, Download, Moon, Sun, Save, ListOrdered, Globe, Activity, LogIn, LogOut } from 'lucide-react';
import { GROUPS, Timezone, TIMEZONES } from './data';
import { useTournament } from './useTournament';
import { GroupStage } from './components/GroupStage';
import { KnockoutStage } from './components/KnockoutStage';
import { StatsDashboard } from './components/StatsDashboard';
import { ThirdPlaceStandings } from './components/ThirdPlaceStandings';
import { AuthModal } from './components/AuthModal';
import { NamePromptModal } from './components/NamePromptModal';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<'group' | 'third' | 'knockout' | 'insights'>('group');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [timezone, setTimezone] = useState<Timezone>('MT');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { groupScores, updateGroupScore, koScores, updateKoScore, standings, koMatchups } = useTournament();
  const { user, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleExport = async () => {
    const node = document.getElementById('knockout-bracket');
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { cacheBust: true, backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc' });
      const link = document.createElement('a');
      link.download = 'WorldCup2026-Bracket.png';
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to export', err);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans flex flex-col bg-fifa-pattern">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 border-b border-slate-200 dark:border-white/10 p-4 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 flex-shrink-0 group flex items-center justify-center mix-blend-multiply dark:mix-blend-normal">
                <img 
                    src="/logo.svg" 
                    alt="FIFA World Cup 26" 
                    className="h-full w-auto object-contain drop-shadow-sm dark:invert transition-all hover:scale-105"
                    onError={(e) => {
                      // Fallback if image still fails
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                />
                <div className="hidden absolute inset-0 items-center justify-center flex-col bg-gradient-to-br from-[#00A3E0] to-[#E40046] rounded-xl shadow-lg shadow-black/10 overflow-hidden">
                  <Trophy className="w-6 h-6 text-white" strokeWidth={2.5} />
                  <span className="text-[9px] font-black text-white leading-none mt-0.5 tracking-wider">2026</span>
                </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight flex items-center gap-2">
                FIFA WORLD CUP <span className="text-blue-600 dark:text-blue-400">26™</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] leading-none">
                  {user ? `Welcome, ${user.displayName || user.email?.split('@')[0]} | ` : ''}Canada | Mexico | USA
                </p>
                <div className="h-2 w-[1px] bg-slate-300 dark:bg-white/20"></div>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">
                  WE ARE 26
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
            <button
              onClick={() => setActiveTab('group')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'group' 
                  ? 'bg-blue-600 dark:bg-white text-white dark:text-black shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Group Stage
            </button>
            <button
              onClick={() => setActiveTab('third')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'third' 
                  ? 'bg-blue-600 dark:bg-white text-white dark:text-black shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              Best 3rd
            </button>
            <button
              onClick={() => setActiveTab('knockout')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'knockout' 
                  ? 'bg-blue-600 dark:bg-white text-white dark:text-black shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Knockout
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === 'insights' 
                  ? 'bg-blue-600 dark:bg-white text-white dark:text-black shadow-lg shadow-blue-500/20' 
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              Insights
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 h-10 gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value as Timezone)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none appearance-none cursor-pointer uppercase tracking-wider"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz} className="bg-white dark:bg-slate-900">{tz}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-200 dark:border-green-500/20 transition-colors shadow-sm h-10" title={user ? "Progress strictly saved to your cloud account." : "Your progress is automatically saved to your browser. Log in to save it to your account."}>
              <Save className="w-3 h-3" />
              {user ? 'Cloud' : 'Local'}
            </div>
            
            {user ? (
               <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-[10px] uppercase tracking-widest transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 h-10 shadow-sm"
               >
                 <LogOut className="w-3.5 h-3.5" />
                 Logout
               </button>
            ) : (
               <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-[10px] uppercase tracking-widest transition-all bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 h-10 shadow-sm"
               >
                 <LogIn className="w-3.5 h-3.5" />
                 Sign In
               </button>
            )}

            {activeTab === 'knockout' && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-[10px] uppercase tracking-widest transition-all text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-400/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-400/30 h-10"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            )}
            <button
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-white/10 shadow-sm shrink-0"
            >
               {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto overflow-x-hidden relative flex flex-col">

        {activeTab === 'group' ? (
          <div className="max-w-[1600px] mx-auto py-12 px-4 relative z-10 w-full flex flex-col items-center">
            <div className="text-center mb-12 w-full">
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
                MATCH SCHEDULE
              </h2>
              <div className="h-1.5 w-24 bg-blue-600 dark:bg-white mx-auto rounded-full"></div>
            </div>
            <div className="w-full">
              <GroupStage 
                groups={GROUPS} 
                standings={standings} 
                scores={groupScores} 
                onScoreChange={updateGroupScore} 
                timezone={timezone}
              />
            </div>
          </div>
        ) : activeTab === 'third' ? (
           <ThirdPlaceStandings standings={standings} />
        ) : activeTab === 'insights' ? (
           <div className="py-12">
             <div className="text-center mb-12 px-4">
               <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
                 TOURNAMENT INSIGHTS
               </h2>
               <div className="h-1.5 w-24 bg-blue-600 dark:bg-white mx-auto rounded-full"></div>
             </div>
             <StatsDashboard groupScores={groupScores} koScores={koScores} standings={standings} />
           </div>
        ) : (
          <div id="knockout-bracket" className={`w-full overflow-x-auto relative py-12 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-slate-50'}`}>
             <div className="text-center mb-16 px-4">
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
                KNOCKOUT STAGE
              </h2>
              <div className="h-1.5 w-24 bg-blue-600 dark:bg-white mx-auto rounded-full"></div>
            </div>
            <div className="min-w-max px-4 mx-auto pb-10">
              <KnockoutStage 
                matchups={koMatchups} 
                scores={koScores} 
                onScoreChange={updateKoScore}
                timezone={timezone}
              />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-slate-50 dark:bg-black py-8 border-t border-slate-200 dark:border-white/10 text-center transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-[0.4em] mb-4">
            Official Tournament Tracker
          </p>
          <p className="text-xs text-slate-500 dark:text-white/30 leading-relaxed italic">
            Kick-off times reflect selected timezone ({timezone}). Final schedule confirmed by FIFA. 
            Tournament format: 48 teams, 12 groups of 4.
          </p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <NamePromptModal />
    </div>
  );
}
