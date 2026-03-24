import { recordHeartbeatGap } from './heartbeat';
import { getTodayData, saveDay } from './days';
import { scheduleSitReminderAlarm } from './posture';

export async function ensureActiveSession(): Promise<void> {
  await recordHeartbeatGap();
  const day = await getTodayData();
  const hasActive = day.sessions.some((s) => s.endTime === undefined);
  if (!hasActive) {
    day.sessions.push({ posture: 'sitting', startTime: Date.now() });
    await saveDay(day);
  }
  await scheduleSitReminderAlarm();
}
