import { SETTINGS_KEY } from './constants';
import type { Settings } from './types';

export async function getSettings(): Promise<Settings> {
  const r = await browser.storage.local.get(SETTINGS_KEY);
  const raw = r[SETTINGS_KEY] as Partial<Settings> | undefined;
  return { walkEnabled: raw?.walkEnabled === true };
}
