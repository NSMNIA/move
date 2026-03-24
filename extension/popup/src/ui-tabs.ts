export function setupTabs(): void {
  const tabDay = document.getElementById('tab-day')!;
  const tabWeek = document.getElementById('tab-week')!;
  const panelDay = document.getElementById('panel-day')!;
  const panelWeek = document.getElementById('panel-week')!;

  const showDay = () => {
    tabDay.classList.add('active');
    tabWeek.classList.remove('active');
    tabDay.setAttribute('aria-selected', 'true');
    tabWeek.setAttribute('aria-selected', 'false');
    panelDay.classList.remove('hidden');
    panelWeek.classList.add('hidden');
    panelDay.setAttribute('aria-hidden', 'false');
    panelWeek.setAttribute('aria-hidden', 'true');
  };
  const showWeek = () => {
    tabWeek.classList.add('active');
    tabDay.classList.remove('active');
    tabWeek.setAttribute('aria-selected', 'true');
    tabDay.setAttribute('aria-selected', 'false');
    panelWeek.classList.remove('hidden');
    panelDay.classList.add('hidden');
    panelWeek.setAttribute('aria-hidden', 'false');
    panelDay.setAttribute('aria-hidden', 'true');
  };

  tabDay.addEventListener('click', showDay);
  tabWeek.addEventListener('click', showWeek);
}
