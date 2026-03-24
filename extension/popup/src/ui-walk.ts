export function applyWalkUi(walkEnabled: boolean): void {
  const grid = document.getElementById('stats-grid')!;
  const walkWrap = document.getElementById('stat-walk-wrap')!;
  const toggleRow = document.getElementById('toggle-row')!;
  const btnWalk = document.getElementById('btn-walk')!;
  if (walkEnabled) {
    grid.classList.add('stats-grid--walk');
    walkWrap.classList.remove('hidden');
    toggleRow.classList.add('toggle-row--walk');
    btnWalk.classList.remove('hidden');
  } else {
    grid.classList.remove('stats-grid--walk');
    walkWrap.classList.add('hidden');
    toggleRow.classList.remove('toggle-row--walk');
    btnWalk.classList.add('hidden');
  }
}
