import { useState, useMemo, useEffect, useRef } from 'react';
import { MatchScore, TeamStanding } from './types';
import { GROUPS, R32_MATCH_CONFIG, getGroupMatches, ALL_GROUP_MATCHES } from './data';
import { calculateStandings } from './tournamentLogic';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export function useTournament() {
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [groupScores, setGroupScores] = useState<Record<string, MatchScore>>({});
  const [koScores, setKoScores] = useState<Record<string, MatchScore>>({});
  const dataOwnerUid = useRef<string | null>(null);
  const lastSavedState = useRef({ group: '', ko: '' });

  // Load from local storage or Firestore on mount
  useEffect(() => {
    dataOwnerUid.current = user ? user.uid : null;
    setIsInitializing(true);
    let isActive = true;
    
    if (!user) {
      try {
        const savedGroup = localStorage.getItem('worldcup_groupScores');
        const savedKo = localStorage.getItem('worldcup_koScores');
        const gs = savedGroup ? JSON.parse(savedGroup) : {};
        const ks = savedKo ? JSON.parse(savedKo) : {};
        
        if (isActive) {
          lastSavedState.current = { group: JSON.stringify(gs), ko: JSON.stringify(ks) };
          setGroupScores(gs);
          setKoScores(ks);
          setIsInitializing(false);
        }
      } catch (e) {
        console.error("Failed to load scores", e);
        if (isActive) setIsInitializing(false);
      }
      return () => { isActive = false; };
    }

    const loadData = async () => {
      try {
        const docRef = doc(db, 'tournaments', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!isActive) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          const gs = data.groupScores || {};
          const ks = data.koScores || {};
          
          lastSavedState.current = { group: JSON.stringify(gs), ko: JSON.stringify(ks) };
          setGroupScores(gs);
          setKoScores(ks);
          setIsInitializing(false);
        } else {
          // Create initial document and migrate any local storage data
          let initialGroup = {};
          let initialKo = {};
          try {
            const savedGroup = localStorage.getItem('worldcup_groupScores');
            const savedKo = localStorage.getItem('worldcup_koScores');
            if (savedGroup) initialGroup = JSON.parse(savedGroup);
            if (savedKo) initialKo = JSON.parse(savedKo);
          } catch(e) {}

          await setDoc(docRef, {
            userId: user.uid,
            displayName: user.displayName || user.email || 'Football Fan',
            groupScores: initialGroup,
            koScores: initialKo,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          }).catch(err => handleFirestoreError(err, OperationType.CREATE, `tournaments/${user.uid}`));
          
          if (isActive) {
            lastSavedState.current = { group: JSON.stringify(initialGroup), ko: JSON.stringify(initialKo) };
            setGroupScores(initialGroup);
            setKoScores(initialKo);
            setIsInitializing(false);
          }
        }
      } catch (error) {
        if (isActive) setIsInitializing(false);
        handleFirestoreError(error, OperationType.GET, `tournaments/${user.uid}`);
      }
    };

    loadData();

    return () => { isActive = false; };
  }, [user]);

  // Save to local storage or Firestore on change
  useEffect(() => {
    if (isInitializing) return;

    const groupStr = JSON.stringify(groupScores);
    const koStr = JSON.stringify(koScores);

    // Skip if nothing actually changed from the last saved state
    if (lastSavedState.current.group === groupStr && lastSavedState.current.ko === koStr) {
        return;
    }

    const currentUserUid = user ? user.uid : null;
    if (dataOwnerUid.current !== currentUserUid) {
      return;
    }

    // Update the last saved state
    lastSavedState.current = { group: groupStr, ko: koStr };

    if (!user) {
      localStorage.setItem('worldcup_groupScores', groupStr);
      localStorage.setItem('worldcup_koScores', koStr);
      return;
    }

    const docRef = doc(db, 'tournaments', user.uid);
    updateDoc(docRef, {
      displayName: user.displayName || user.email || 'Football Fan',
      groupScores,
      koScores,
      updatedAt: serverTimestamp()
    }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `tournaments/${user.uid}`));
  }, [groupScores, koScores, isInitializing, user]);

  const updateGroupScore = (id: string, home: number | null, away: number | null) => {
    setGroupScores(prev => ({ ...prev, [id]: { home, away } }));
  };

  const updateKoScore = (id: string, home: number | null, away: number | null, pensHome?: number | null, pensAway?: number | null) => {
    setKoScores(prev => ({ ...prev, [id]: { home, away, pensHome, pensAway } }));
  };

  const resetData = () => {
    setGroupScores({});
    setKoScores({});
  };

  const simulateGroupStage = () => {
    const newScores: Record<string, MatchScore> = {};
    ALL_GROUP_MATCHES.forEach(m => {
      newScores[m.id] = {
        home: Math.floor(Math.random() * 4), 
        away: Math.floor(Math.random() * 4) 
      };
    });
    setGroupScores(newScores);
    setKoScores({});
  };

  const isGroupFinished = (groupId: string): boolean => {
    const group = GROUPS.find(g => g.id === groupId);
    if (!group) return false;
    const groupMatches = getGroupMatches(group);
    return groupMatches.length > 0 && groupMatches.every(m => {
      const s = groupScores[m.id];
      return s && s.home !== null && s.away !== null;
    });
  };

  const isAllGroupsFinished = () => GROUPS.every(g => isGroupFinished(g.id));

  // 1. Calculate all group standings
  const standings = useMemo(() => {
    return GROUPS.reduce((acc, g) => {
      acc[g.id] = calculateStandings(g, groupScores);
      return acc;
    }, {} as Record<string, TeamStanding[]>);
  }, [groupScores]);

  // 2. Identify 3rd place teams and sort them
  const thirdPlaced = useMemo(() => {
    const thirds = Object.values(standings).map(st => st[2]);
    return thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }, [standings]);

  // Helper to fetch seed text (e.g. "A1", "3RD_2") to actual team name
  const getTeamFromSeed = (seed: string): string | null => {
    if (seed.startsWith('3RD_')) {
      if (!isAllGroupsFinished()) return null;
      const idx = parseInt(seed.split('_')[1]) - 1;
      return thirdPlaced[idx]?.team || null;
    }
    if (seed.length === 2 && seed[0].match(/[A-L]/)) { // format like A1, B2
      const group = seed[0];
      if (!isGroupFinished(group)) return null;
      const pos = parseInt(seed[1]) - 1;
      return standings[group]?.[pos]?.team || null;
    }
    return null;
  };

  // 3. Build KO Matchups tree
  const koMatchups = useMemo(() => {
    const matchups: Record<string, { home: string | null; away: string | null }> = {};
    
    // R32
    Object.entries(R32_MATCH_CONFIG).forEach(([matchId, config]) => {
      matchups[matchId] = {
        home: getTeamFromSeed(config.home),
        away: getTeamFromSeed(config.away)
      };
    });

    const getWinner = (matchId: string) => {
      const m = matchups[matchId];
      if (!m || !m.home || !m.away) return null;
      const s = koScores[matchId];
      if (!s || s.home === null || s.away === null) return null;
      if (s.home > s.away) return m.home;
      if (s.home < s.away) return m.away;
      if (s.pensHome != null && s.pensAway != null) {
        if (s.pensHome > s.pensAway) return m.home;
        if (s.pensAway > s.pensHome) return m.away;
      }
      return null;
    };

    // R16
    matchups['L_R16_1'] = { home: getWinner('L_R32_1'), away: getWinner('L_R32_2') };
    matchups['L_R16_2'] = { home: getWinner('L_R32_3'), away: getWinner('L_R32_4') };
    matchups['L_R16_3'] = { home: getWinner('L_R32_5'), away: getWinner('L_R32_6') };
    matchups['L_R16_4'] = { home: getWinner('L_R32_7'), away: getWinner('L_R32_8') };

    matchups['R_R16_1'] = { home: getWinner('R_R32_1'), away: getWinner('R_R32_2') };
    matchups['R_R16_2'] = { home: getWinner('R_R32_3'), away: getWinner('R_R32_4') };
    matchups['R_R16_3'] = { home: getWinner('R_R32_5'), away: getWinner('R_R32_6') };
    matchups['R_R16_4'] = { home: getWinner('R_R32_7'), away: getWinner('R_R32_8') };

    // QF
    matchups['L_QF_1'] = { home: getWinner('L_R16_1'), away: getWinner('L_R16_2') };
    matchups['L_QF_2'] = { home: getWinner('L_R16_3'), away: getWinner('L_R16_4') };
    
    matchups['R_QF_1'] = { home: getWinner('R_R16_1'), away: getWinner('R_R16_2') };
    matchups['R_QF_2'] = { home: getWinner('R_R16_3'), away: getWinner('R_R16_4') };

    // SF
    matchups['L_SF_1'] = { home: getWinner('L_QF_1'), away: getWinner('L_QF_2') };
    matchups['R_SF_1'] = { home: getWinner('R_QF_1'), away: getWinner('R_QF_2') };

    // Final
    matchups['F_1'] = { home: getWinner('L_SF_1'), away: getWinner('R_SF_1') };

    return matchups;
  }, [standings, thirdPlaced, koScores]);

  return {
    groupScores,
    updateGroupScore,
    koScores,
    updateKoScore,
    standings,
    koMatchups,
    resetData,
    simulateGroupStage
  };
}
