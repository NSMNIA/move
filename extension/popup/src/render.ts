import { fmtDuration, fmtHM, fmtTime } from './format';
import { getActiveSession, getTotals, postureLabel, weekdayLabel } from './session-helpers';
import { state } from './state';
import { applyWalkUi } from './ui-walk';

export function render(now: number): void {
  if (!state) return;
  const { posture, day, week, settings } = state;
  const sessions = day.sessions;

  applyWalkUi(settings.walkEnabled);

  const badge = document.getElementById('posture-badge')!;
  const timerEl = document.getElementById('timer')!;
  badge.className = `posture-badge ${posture}`;
  badge.textContent = postureLabel(posture);
  timerEl.className = `timer ${posture}`;

  const active = getActiveSession(sessions);
  if (active) {
    timerEl.textContent = fmtDuration(now - active.startTime);
  } else {
    timerEl.textContent = '00:00';
  }

  document.getElementById('btn-sit')!.classList.toggle('active', posture === 'sitting');
  document.getElementById('btn-stand')!.classList.toggle('active', posture === 'standing');
  document.getElementById('btn-walk')!.classList.toggle('active', posture === 'walking');

  const { sitMs, standMs, walkMs } = getTotals(sessions, now);
  const offMs = day.offlineMs ?? 0;
  const postureMs = sitMs + standMs + walkMs;

  document.getElementById('stat-sit')!.textContent = fmtHM(sitMs);
  document.getElementById('stat-stand')!.textContent = fmtHM(standMs);
  document.getElementById('stat-walk')!.textContent = fmtHM(walkMs);
  document.getElementById('stat-offline')!.textContent = fmtHM(offMs);

  const ratioLabel = document.getElementById('stat-ratio-label')!;
  const ratioEl = document.getElementById('stat-ratio')!;
  if (settings.walkEnabled) {
    ratioLabel.textContent = 'Stand / Walk %';
    const standPct = postureMs > 0 ? Math.round((standMs / postureMs) * 100) : 0;
    const walkPct = postureMs > 0 ? Math.round((walkMs / postureMs) * 100) : 0;
    ratioEl.textContent = `${standPct}% / ${walkPct}%`;
  } else {
    ratioLabel.textContent = 'Stand %';
    const ratio = postureMs > 0 ? Math.round((standMs / postureMs) * 100) : 0;
    ratioEl.textContent = `${ratio}%`;
  }

  const timeline = document.getElementById('timeline');
  if (timeline) {
    const totalBar = sitMs + standMs + walkMs + offMs;
    if (totalBar === 0) {
      timeline.innerHTML = '';
    } else {
      const parts: string[] = [];
      for (const s of sessions) {
        const dur = (s.endTime ?? now) - s.startTime;
        const pct = (dur / totalBar) * 100;
        parts.push(`<div class="seg ${s.posture}" style="width:${pct.toFixed(2)}%"></div>`);
      }
      if (offMs > 0) {
        parts.push(`<div class="seg offline" style="width:${((offMs / totalBar) * 100).toFixed(2)}%"></div>`);
      }
      timeline.innerHTML = parts.join('');
    }
  }

  const sessionsEl = document.getElementById('sessions')!;
  const sessionRows = [...sessions].reverse().slice(0, 5);
  sessionsEl.innerHTML = sessionRows
    .map((s) => {
      const end = s.endTime ?? now;
      const dur = fmtDuration(end - s.startTime);
      const timeRange = `${fmtTime(s.startTime)} – ${s.endTime ? fmtTime(s.endTime) : 'now'}`;
      return `<div class="session-row">
      <span class="session-dot ${s.posture}"></span>
      <span class="time">${timeRange}</span>
      <span class="dur">${dur}</span>
    </div>`;
    })
    .join('');

  const weekEl = document.getElementById('week-overview')!;
  weekEl.innerHTML = week
    .map((d) => {
      const { sitMs: sSit, standMs: sStand, walkMs: sWalk } = getTotals(d.sessions, now);
      const sOff = d.offlineMs ?? 0;
      const t = sSit + sStand + sWalk + sOff;
      const isToday = d.date === day.date;
      const label = weekdayLabel(d.date);
      let bar = '';
      if (t === 0) {
        bar = '<div class="week-bar"></div>';
      } else {
        const segs: string[] = [];
        for (const sess of d.sessions) {
          const dur = (sess.endTime ?? now) - sess.startTime;
          const pct = (dur / t) * 100;
          segs.push(`<div class="seg ${sess.posture}" style="width:${pct.toFixed(1)}%"></div>`);
        }
        if (sOff > 0) {
          segs.push(`<div class="seg offline" style="width:${((sOff / t) * 100).toFixed(1)}%"></div>`);
        }
        bar = `<div class="week-bar">${segs.join('')}</div>`;
      }
      const metaParts = [`sit ${fmtHM(sSit)}`, `stand ${fmtHM(sStand)}`];
      if (settings.walkEnabled || sWalk > 0) metaParts.push(`walk ${fmtHM(sWalk)}`);
      metaParts.push(`off ${fmtHM(sOff)}`);
      const meta = metaParts.join(' · ');
      return `<div class="week-row">
        <div class="week-label">${label}${isToday ? '<br><span style="color:var(--accent)">today</span>' : ''}</div>
        <div>
          ${bar}
          <div class="week-meta">${meta}</div>
        </div>
      </div>`;
    })
    .join('');
}
