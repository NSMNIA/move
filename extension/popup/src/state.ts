import type { State } from './types';

export const SETTINGS_STORAGE_KEY = 'blobfish_settings';

export let state: State | null = null;

export function setState(next: State | null): void {
  state = next;
}
