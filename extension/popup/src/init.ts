import { refreshState, setPosture } from './actions';
import { render } from './render';
import { setState, SETTINGS_STORAGE_KEY } from './state';
import type { State } from './types';
import { setupTabs } from './ui-tabs';

let timerInterval: ReturnType<typeof setInterval> | null = null;

async function init(): Promise<void> {
  setupTabs();
  browser.storage.local.onChanged.addListener((changes) => {
    if (!changes[SETTINGS_STORAGE_KEY]) return;
    void refreshState();
  });

  setState((await browser.runtime.sendMessage({ type: 'GET_STATE' })) as State);
  render(Date.now());

  document.getElementById('btn-sit')!.addEventListener('click', () => {
    void setPosture('sitting');
  });
  document.getElementById('btn-stand')!.addEventListener('click', () => {
    void setPosture('standing');
  });
  document.getElementById('btn-walk')!.addEventListener('click', () => {
    void setPosture('walking');
  });
  document.getElementById('btn-open-options')!.addEventListener('click', () => {
    void browser.runtime.openOptionsPage();
  });

  timerInterval = setInterval(() => {
    render(Date.now());
  }, 1000);
}

window.addEventListener('unload', () => {
  if (timerInterval !== null) clearInterval(timerInterval);
});

void init().catch((err) => console.error(err));
