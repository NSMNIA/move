import { getCurrentPosture, switchPosture } from './posture';
import { getSettings } from './settings';

export async function downgradeWalkingIfDisabled(): Promise<void> {
  const settings = await getSettings();
  if (settings.walkEnabled) return;
  if ((await getCurrentPosture()) !== 'walking') return;
  await switchPosture('standing');
}
