import type { Posture, Session } from './types';

export function getTotals(sessions: Session[], now: number): { sitMs: number; standMs: number; walkMs: number } {
  let sitMs = 0,
    standMs = 0,
    walkMs = 0;
  for (const s of sessions) {
    const end = s.endTime ?? now;
    const dur = Math.max(0, end - s.startTime);
    if (s.posture === 'sitting') sitMs += dur;
    else if (s.posture === 'standing') standMs += dur;
    else walkMs += dur;
  }
  return { sitMs, standMs, walkMs };
}

export function postureLabel(p: Posture): string {
  if (p === 'sitting') return 'Sitting';
  if (p === 'standing') return 'Standing';
  return 'Walk';
}

export function getActiveSession(sessions: Session[]): Session | undefined {
  return sessions.find((s) => s.endTime === undefined);
}

export function weekdayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  const w = d.toLocaleDateString(undefined, { weekday: 'short' });
  const day = d.getDate();
  return `${w} ${day}`;
}
