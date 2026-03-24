import { NOTIFICATION_ID } from './constants';

export const SIT_REMINDER_MESSAGES = [
  'Feeling like a deflated pool float? Get up and move before you turn into a real-life blob fish!',
  'Your chair is plotting world domination. Stand up and break the cycle of chair tyranny!',
  "Don't let your butt become one with the chair! Stand up and give it some breathing room.",
  'Remember, sitting is the new smoking! Stand up and avoid the wrinkles... of the brain, that is!',
  'WARNING: Prolonged sitting may lead to increased Netflix binging, decreased productivity, and a strong urge to nap under your desk.',
  "Did you know squirrels never sit still? Maybe that's why they're so energetic. Take a cue from the furry acrobats!",
  "Feeling sleepy? Coffee won't fix it this time. Stand up and get your blood pumping!",
  "Your cat is judging you for being a lazy bum. Stand up and show them who's boss.",
  "Remember, the only time it's okay to be a couch potato is... actually, just stand up.",
  'Your spine called. It says it misses being vertical. Please stand up.',
] as const;

/** Human-readable sitting length for notifications (e.g. "48 min", "1h 15m"). */
export function formatSitDurationForNotification(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  if (totalMin < 1) return 'under a minute';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return m === 0 ? `${h}h` : `${h}h ${m}m`;
  return `${totalMin} min`;
}

const SIT_REMINDER_TITLES: Array<(duration: string) => string> = [
  (duration) => `You've been sitting for ${duration} — time to stand up`,
  (duration) => `${duration} seated — stretch your legs`,
  (duration) => `Still sitting after ${duration}? Time to move`,
  (duration) => `${duration} on your chair — get up for a bit`,
  (duration) => `BlobFish mode: ${duration} seated`,
  (duration) => `${duration} sitting — your spine is asking for a break`,
];

export function randomSitReminderTitle(sittingMs: number): string {
  const d = formatSitDurationForNotification(sittingMs);
  const pick = SIT_REMINDER_TITLES[Math.floor(Math.random() * SIT_REMINDER_TITLES.length)];
  return pick(d);
}

export function randomSitReminderMessage(): string {
  return SIT_REMINDER_MESSAGES[Math.floor(Math.random() * SIT_REMINDER_MESSAGES.length)];
}

export async function showSitReminderNotification(sittingMs: number): Promise<void> {
  const title = randomSitReminderTitle(sittingMs);
  const message = randomSitReminderMessage();
  const iconUrl = browser.runtime.getURL('icons/128.png');
  const base: browser.notifications.CreateNotificationOptions = {
    type: 'basic',
    title,
    message,
  };

  try {
    await browser.notifications.create(NOTIFICATION_ID, { ...base, iconUrl });
  } catch {
    await browser.notifications.create(NOTIFICATION_ID, base);
  }
}
