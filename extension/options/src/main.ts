import { SETTINGS_KEY } from './constants';

async function load(): Promise<void> {
  const r = await browser.storage.local.get(SETTINGS_KEY);
  const s = r[SETTINGS_KEY] as { walkEnabled?: boolean } | undefined;
  (document.getElementById('walk-enabled') as HTMLInputElement).checked = !!s?.walkEnabled;
}

async function save(): Promise<void> {
  const walkEnabled = (document.getElementById('walk-enabled') as HTMLInputElement).checked;
  await browser.storage.local.set({ [SETTINGS_KEY]: { walkEnabled } });
}

document.addEventListener('DOMContentLoaded', () => {
  void load();
  document.getElementById('walk-enabled')!.addEventListener('change', () => {
    void save();
  });
});
