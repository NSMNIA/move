import { GAP_CAP_MS, GAP_OFFLINE_MS, HEARTBEAT_ALARM_NAME, HEARTBEAT_PERIOD_MIN, META_KEY } from './constants';
import type { Meta } from './types';
import { getDateString } from './days';
import { addOfflineMsForDate, resumeAsSittingAfterOffline } from './offline';

export async function getMeta(): Promise<Meta | null> {
  const r = await browser.storage.local.get(META_KEY);
  const m = r[META_KEY] as Meta | undefined;
  return m ?? null;
}

export async function setMeta(meta: Meta): Promise<void> {
  await browser.storage.local.set({ [META_KEY]: meta });
}

export async function recordHeartbeatGap(): Promise<void> {
  const now = Date.now();
  const meta = await getMeta();
  if (meta === null) {
    await setMeta({ lastHeartbeatMs: now });
    return;
  }
  const gap = now - meta.lastHeartbeatMs;
  if (gap > GAP_OFFLINE_MS) {
    await addOfflineMsForDate(getDateString(now), Math.min(gap, GAP_CAP_MS));
    await resumeAsSittingAfterOffline();
  }
  await setMeta({ lastHeartbeatMs: now });
}

export async function ensureHeartbeatAlarm(): Promise<void> {
  const existing = await browser.alarms.get(HEARTBEAT_ALARM_NAME);
  if (!existing) {
    await browser.alarms.create(HEARTBEAT_ALARM_NAME, {
      periodInMinutes: HEARTBEAT_PERIOD_MIN,
    });
  }
}
