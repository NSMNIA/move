import { SIT_THRESHOLD_MS } from './constants';
import { getRollingWeek, getTodayData } from './days';
import { recordHeartbeatGap } from './heartbeat';
import { showSitReminderNotification } from './notifications';
import { getCurrentPosture, getCurrentSittingDurationMs, switchPosture } from './posture';
import { getSettings } from './settings';
import type { DayData, Posture, Settings } from './types';

export async function buildStateResponse(posture: Posture): Promise<{
  posture: Posture;
  day: DayData;
  week: DayData[];
  settings: Settings;
}> {
  const day = await getTodayData();
  const week = await getRollingWeek();
  const settings = await getSettings();
  return { posture, day, week, settings };
}

export function registerMessageHandler(): void {
  browser.runtime.onMessage.addListener(async (msg: { type: string; posture?: Posture }) => {
    await recordHeartbeatGap();
    if (msg.type === 'GET_STATE') {
      const posture = await getCurrentPosture();
      return buildStateResponse(posture);
    }
    if (msg.type === 'SET_POSTURE' && msg.posture) {
      await switchPosture(msg.posture);
      const posture = await getCurrentPosture();
      return buildStateResponse(posture);
    }
    if (msg.type === 'TEST_NOTIFICATION') {
      const sittingMs = (await getCurrentSittingDurationMs()) ?? SIT_THRESHOLD_MS;
      await showSitReminderNotification(sittingMs);
      return { ok: true as const };
    }
  });
}
