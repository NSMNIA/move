export type Posture = 'sitting' | 'standing' | 'walking';

export interface Session {
  posture: Posture;
  startTime: number;
  endTime?: number;
}

export interface DayData {
  date: string;
  sessions: Session[];
  offlineMs: number;
}

export interface Settings {
  walkEnabled: boolean;
}

export interface State {
  posture: Posture;
  day: DayData;
  week: DayData[];
  settings: Settings;
}
