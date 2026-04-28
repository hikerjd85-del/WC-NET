import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserCircle2 } from 'lucide-react';

export function NamePromptModal() {
  const { user, needsNamePrompt, setNeedsNamePrompt, forceRefreshUser } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.displayName && !name) {
      setName(user.displayName);
    }
  }, [user]);

  if (!needsNamePrompt || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      forceRefreshUser();
      
      // Update the user's document in Firestore if it exists
      try {
        await updateDoc(doc(db, 'tournaments', user.uid), {
          displayName: name.trim()
        });
      } catch (err) {
        // It might not exist yet, which is fine, useTournament will create it or update it
      }
      
      setNeedsNamePrompt(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-2">
            Welcome!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            What's your preferred display name?
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-center font-bold text-lg"
                placeholder="Your Name"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Save & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
