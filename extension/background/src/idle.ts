import { IDLE_DURATION_MS } from './constants';
import { getDateString } from './days';
import { addOfflineMsForDate, resumeAsSittingAfterOffline } from './offline';

let idleStartedAt: number | null = null;
let idleTrackingInitialized = false;

export function initIdleTracking(): void {
  if (idleTrackingInitialized) return;
  idleTrackingInitialized = true;
  browser.idle.setDetectionInterval(60);
  browser.idle.onStateChanged.addListener((state) => {
    if (state === 'active') {
      if (idleStartedAt !== null) {
        const dur = Date.now() - idleStartedAt;
        if (dur >= IDLE_DURATION_MS) {
          void (async () => {
            await addOfflineMsForDate(getDateString(Date.now()), dur);
            await resumeAsSittingAfterOffline();
          })();
        }
        idleStartedAt = null;
      }
    } else {
      idleStartedAt = Date.now();
    }
  });
}
