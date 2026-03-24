'use strict';
(() => {
  function I(t) {
    let e = Math.floor(t / 1e3),
      s = Math.floor(e / 3600),
      o = Math.floor((e % 3600) / 60),
      i = e % 60;
    return s > 0 ? `${s}h ${o}m` : `${String(o).padStart(2, '0')}:${String(i).padStart(2, '0')}`;
  }
  function d(t) {
    let e = Math.floor(t / 6e4),
      s = Math.floor(e / 60),
      o = e % 60;
    return `${s}h ${o}m`;
  }
  function B(t) {
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  function A(t, e) {
    let s = 0,
      o = 0,
      i = 0;
    for (let a of t) {
      let y = a.endTime ?? e,
        c = Math.max(0, y - a.startTime);
      a.posture === 'sitting' ? (s += c) : a.posture === 'standing' ? (o += c) : (i += c);
    }
    return { sitMs: s, standMs: o, walkMs: i };
  }
  function _(t) {
    return t === 'sitting' ? 'Sitting' : t === 'standing' ? 'Standing' : 'Walk';
  }
  function R(t) {
    return t.find((e) => e.endTime === void 0);
  }
  function G(t) {
    let e = new Date(`${t}T12:00:00`),
      s = e.toLocaleDateString(void 0, { weekday: 'short' }),
      o = e.getDate();
    return `${s} ${o}`;
  }
  var H = 'blobfish_settings',
    m = null;
  function w(t) {
    m = t;
  }
  function j(t) {
    let e = document.getElementById('stats-grid'),
      s = document.getElementById('stat-walk-wrap'),
      o = document.getElementById('toggle-row'),
      i = document.getElementById('btn-walk');
    t
      ? (e.classList.add('stats-grid--walk'),
        s.classList.remove('hidden'),
        o.classList.add('toggle-row--walk'),
        i.classList.remove('hidden'))
      : (e.classList.remove('stats-grid--walk'),
        s.classList.add('hidden'),
        o.classList.remove('toggle-row--walk'),
        i.classList.add('hidden'));
  }
  function p(t) {
    if (!m) return;
    let { posture: e, day: s, week: o, settings: i } = m,
      a = s.sessions;
    j(i.walkEnabled);
    let y = document.getElementById('posture-badge'),
      c = document.getElementById('timer');
    ((y.className = `posture-badge ${e}`), (y.textContent = _(e)), (c.className = `timer ${e}`));
    let D = R(a);
    (D ? (c.textContent = I(t - D.startTime)) : (c.textContent = '00:00'),
      document.getElementById('btn-sit').classList.toggle('active', e === 'sitting'),
      document.getElementById('btn-stand').classList.toggle('active', e === 'standing'),
      document.getElementById('btn-walk').classList.toggle('active', e === 'walking'));
    let { sitMs: h, standMs: v, walkMs: b } = A(a, t),
      E = s.offlineMs ?? 0,
      u = h + v + b;
    ((document.getElementById('stat-sit').textContent = d(h)),
      (document.getElementById('stat-stand').textContent = d(v)),
      (document.getElementById('stat-walk').textContent = d(b)),
      (document.getElementById('stat-offline').textContent = d(E)));
    let C = document.getElementById('stat-ratio-label'),
      W = document.getElementById('stat-ratio');
    if (i.walkEnabled) {
      C.textContent = 'Stand / Walk %';
      let n = u > 0 ? Math.round((v / u) * 100) : 0,
        r = u > 0 ? Math.round((b / u) * 100) : 0;
      W.textContent = `${n}% / ${r}%`;
    } else {
      C.textContent = 'Stand %';
      let n = u > 0 ? Math.round((v / u) * 100) : 0;
      W.textContent = `${n}%`;
    }
    let S = document.getElementById('timeline');
    if (S) {
      let n = h + v + b + E;
      if (n === 0) S.innerHTML = '';
      else {
        let r = [];
        for (let l of a) {
          let f = (((l.endTime ?? t) - l.startTime) / n) * 100;
          r.push(`<div class="seg ${l.posture}" style="width:${f.toFixed(2)}%"></div>`);
        }
        (E > 0 && r.push(`<div class="seg offline" style="width:${((E / n) * 100).toFixed(2)}%"></div>`),
          (S.innerHTML = r.join('')));
      }
    }
    let N = document.getElementById('sessions'),
      U = [...a].reverse().slice(0, 5);
    N.innerHTML = U.map((n) => {
      let r = n.endTime ?? t,
        l = I(r - n.startTime),
        g = `${B(n.startTime)} \u2013 ${n.endTime ? B(n.endTime) : 'now'}`;
      return `<div class="session-row">
      <span class="session-dot ${n.posture}"></span>
      <span class="time">${g}</span>
      <span class="dur">${l}</span>
    </div>`;
    }).join('');
    let K = document.getElementById('week-overview');
    K.innerHTML = o
      .map((n) => {
        let { sitMs: r, standMs: l, walkMs: g } = A(n.sessions, t),
          f = n.offlineMs ?? 0,
          T = r + l + g + f,
          Y = n.date === s.date,
          q = G(n.date),
          L = '';
        if (T === 0) L = '<div class="week-bar"></div>';
        else {
          let $ = [];
          for (let x of n.sessions) {
            let J = (((x.endTime ?? t) - x.startTime) / T) * 100;
            $.push(`<div class="seg ${x.posture}" style="width:${J.toFixed(1)}%"></div>`);
          }
          (f > 0 && $.push(`<div class="seg offline" style="width:${((f / T) * 100).toFixed(1)}%"></div>`),
            (L = `<div class="week-bar">${$.join('')}</div>`));
        }
        let M = [`sit ${d(r)}`, `stand ${d(l)}`];
        ((i.walkEnabled || g > 0) && M.push(`walk ${d(g)}`), M.push(`off ${d(f)}`));
        let z = M.join(' \xB7 ');
        return `<div class="week-row">
        <div class="week-label">${q}${Y ? '<br><span style="color:var(--accent)">today</span>' : ''}</div>
        <div>
          ${L}
          <div class="week-meta">${z}</div>
        </div>
      </div>`;
      })
      .join('');
  }
  async function k(t) {
    if (m?.posture === t || (t === 'walking' && !m?.settings.walkEnabled)) return;
    let e = await browser.runtime.sendMessage({ type: 'SET_POSTURE', posture: t });
    (w(e), p(Date.now()));
  }
  async function O() {
    let t = await browser.runtime.sendMessage({ type: 'GET_STATE' });
    (w(t), p(Date.now()));
  }
  function F() {
    let t = document.getElementById('tab-day'),
      e = document.getElementById('tab-week'),
      s = document.getElementById('panel-day'),
      o = document.getElementById('panel-week'),
      i = () => {
        (t.classList.add('active'),
          e.classList.remove('active'),
          t.setAttribute('aria-selected', 'true'),
          e.setAttribute('aria-selected', 'false'),
          s.classList.remove('hidden'),
          o.classList.add('hidden'),
          s.setAttribute('aria-hidden', 'false'),
          o.setAttribute('aria-hidden', 'true'));
      },
      a = () => {
        (e.classList.add('active'),
          t.classList.remove('active'),
          e.setAttribute('aria-selected', 'true'),
          t.setAttribute('aria-selected', 'false'),
          o.classList.remove('hidden'),
          s.classList.add('hidden'),
          o.setAttribute('aria-hidden', 'false'),
          s.setAttribute('aria-hidden', 'true'));
      };
    (t.addEventListener('click', i), e.addEventListener('click', a));
  }
  var P = null;
  async function Q() {
    (F(),
      browser.storage.local.onChanged.addListener((t) => {
        t[H] && O();
      }),
      w(await browser.runtime.sendMessage({ type: 'GET_STATE' })),
      p(Date.now()),
      document.getElementById('btn-sit').addEventListener('click', () => {
        k('sitting');
      }),
      document.getElementById('btn-stand').addEventListener('click', () => {
        k('standing');
      }),
      document.getElementById('btn-walk').addEventListener('click', () => {
        k('walking');
      }),
      document.getElementById('btn-open-options').addEventListener('click', () => {
        browser.runtime.openOptionsPage();
      }),
      (P = setInterval(() => {
        p(Date.now());
      }, 1e3)));
  }
  window.addEventListener('unload', () => {
    P !== null && clearInterval(P);
  });
  Q().catch((t) => console.error(t));
})();
