import { SIT_ALARM_NAME, SIT_THRESHOLD_MS } from './constants';
import type { Posture } from './types';
import { getTodayData, saveDay } from './days';
import { getSettings } from './settings';

export async function getCurrentPosture(): Promise<Posture> {
  const day = await getTodayData();
  const active = day.sessions.find((s) => s.endTime === undefined);
  return active?.posture ?? 'sitting';
}

/** Ms in the current sitting session, or `null` if not sitting. */
export async function getCurrentSittingDurationMs(): Promise<number | null> {
  const day = await getTodayData();
  const active = day.sessions.find((s) => s.endTime === undefined);
  if (!active || active.posture !== 'sitting') return null;
  return Date.now() - active.startTime;
}

export async function switchPosture(newPosture: Posture): Promise<void> {
  const settings = await getSettings();
  if (newPosture === 'walking' && !settings.walkEnabled) return;

  const day = await getTodayData();
  const active = day.sessions.find((s) => s.endTime === undefined);
  if (active?.posture === newPosture) return;

  const now = Date.now();

  for (const s of day.sessions) {
    if (s.endTime === undefined) s.endTime = now;
  }

  day.sessions.push({ posture: newPosture, startTime: now });
  await saveDay(day);
  await scheduleSitReminderAlarm();
}

export async function scheduleSitReminderAlarm(): Promise<void> {
  await browser.alarms.clear(SIT_ALARM_NAME);
  const day = await getTodayData();
  const active = day.sessions.find((s) => s.endTime === undefined);
  if (!active || active.posture !== 'sitting') return;

  const now = Date.now();
  const satMs = now - active.startTime;
  const when = satMs >= SIT_THRESHOLD_MS ? now + 1_000 : active.startTime + SIT_THRESHOLD_MS;
  await browser.alarms.create(SIT_ALARM_NAME, { when });
}
