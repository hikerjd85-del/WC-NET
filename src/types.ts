export type Team = string;

export interface Group {
  id: string;
  teams: Team[];
}

export interface MatchInfo {
  id: string;
  home: Team;
  away: Team;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
  pensHome?: number | null;
  pensAway?: number | null;
}

export interface TeamStanding {
  team: Team;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}
