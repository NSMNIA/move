import { render } from './render';
import { setState, state } from './state';
import type { Posture, State } from './types';

export async function setPosture(posture: Posture): Promise<void> {
  if (state?.posture === posture) return;
  if (posture === 'walking' && !state?.settings.walkEnabled) return;
  const response = (await browser.runtime.sendMessage({
    type: 'SET_POSTURE',
    posture,
  })) as State;
  setState(response);
  render(Date.now());
}

export async function refreshState(): Promise<void> {
  const next = (await browser.runtime.sendMessage({ type: 'GET_STATE' })) as State;
  setState(next);
  render(Date.now());
}
