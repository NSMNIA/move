export const NOTIFICATION_ID = 'StandUpOrYoullTurnIntoABlobFish-NOTIFICATION';

/** Fire when continuous sitting reaches this length (ms). */
export const SIT_THRESHOLD_MS = 45 * 60 * 1000;
/** After the first alert, re-nag while still sitting this often (ms). */
export const SIT_REPEAT_MS = 15 * 60 * 1000;
export const SIT_ALARM_NAME = 'sitTooLong';

/** If the user is idle for this long, count as browser inactive / closed (ms). */
export const IDLE_DURATION_MS = 5 * 60 * 1000;

/** Missed heartbeats longer than this → count as browser inactive / closed (ms). */
export const GAP_OFFLINE_MS = 15 * 60 * 1000;
/** Max offline attributed in one gap event (ms). */
export const GAP_CAP_MS = 24 * 60 * 60 * 1000;
export const HEARTBEAT_ALARM_NAME = 'heartbeat';
/** Must be ≥ Firefox minimum (1). */
export const HEARTBEAT_PERIOD_MIN = 5;

export const STORAGE_KEY = 'blobfish_sessions';
export const META_KEY = 'blobfish_meta';
export const SETTINGS_KEY = 'blobfish_settings';

export const MAX_STORED_DAYS = 8;
export const WEEK_DAYS = 7;
