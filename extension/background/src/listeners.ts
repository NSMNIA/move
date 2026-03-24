import { NOTIFICATION_ID, SETTINGS_KEY, HEARTBEAT_ALARM_NAME, SIT_ALARM_NAME, SIT_REPEAT_MS } from './constants';
import { ensureHeartbeatAlarm, recordHeartbeatGap } from './heartbeat';
import { initIdleTracking } from './idle';
import { registerMessageHandler } from './messaging';
import { randomSitReminderMessage, randomSitReminderTitle } from './notifications';
import { getCurrentPosture, getCurrentSittingDurationMs, scheduleSitReminderAlarm } from './posture';
import { ensureActiveSession } from './startup';
import { downgradeWalkingIfDisabled } from './walking';

export function registerAllListeners(): void {
  registerMessageHandler();

  browser.storage.local.onChanged.addListener((changes) => {
    if (!changes[SETTINGS_KEY]) return;
    const next = changes[SETTINGS_KEY].newValue as { walkEnabled?: boolean } | undefined;
    if (next?.walkEnabled === true) return;
    void downgradeWalkingIfDisabled();
  });

  browser.runtime.onInstalled.addListener(async () => {
    await ensureHeartbeatAlarm();
    initIdleTracking();
    await ensureActiveSession();
  });

  browser.runtime.onStartup.addListener(async () => {
    await ensureHeartbeatAlarm();
    initIdleTracking();
    await ensureActiveSession();
  });

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === HEARTBEAT_ALARM_NAME) {
      await recordHeartbeatGap();
      return;
    }
    if (alarm.name !== SIT_ALARM_NAME) return;

    const posture = await getCurrentPosture();
    if (posture !== 'sitting') {
      await scheduleSitReminderAlarm();
      return;
    }

    const sittingMs = await getCurrentSittingDurationMs();
    if (sittingMs == null) {
      await scheduleSitReminderAlarm();
      return;
    }

    const title = randomSitReminderTitle(sittingMs);
    const message = randomSitReminderMessage();
    await browser.notifications.create(NOTIFICATION_ID, {
      type: 'basic',
      iconUrl: browser.runtime.getURL('./icons/128.png'),
      title,
      message,
    });

    await browser.alarms.create(SIT_ALARM_NAME, {
      when: Date.now() + SIT_REPEAT_MS,
    });
  });
}
