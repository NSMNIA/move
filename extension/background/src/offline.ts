import { GAP_CAP_MS } from './constants';
import { getDayForDate, getTodayData, saveDay } from './days';
import { scheduleSitReminderAlarm } from './posture';

export async function addOfflineMsForDate(dateStr: string, ms: number): Promise<void> {
  if (ms <= 0) return;
  const add = Math.min(ms, GAP_CAP_MS);
  const day = await getDayForDate(dateStr);
  day.offlineMs += add;
  await saveDay(day);
}

/** After offline time is counted, start a fresh sitting session (timer resets). */
export async function resumeAsSittingAfterOffline(): Promise<void> {
  const now = Date.now();
  const day = await getTodayData();
  for (const s of day.sessions) {
    if (s.endTime === undefined) s.endTime = now;
  }
  day.sessions.push({ posture: 'sitting', startTime: now });
  await saveDay(day);
  await scheduleSitReminderAlarm();
}
