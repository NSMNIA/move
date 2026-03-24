'use strict';
(() => {
  var R = 'StandUpOrYoullTurnIntoABlobFish-NOTIFICATION';
  var d = 'sitTooLong';
  var w = 'heartbeat';
  var c = 'blobfish_sessions',
    y = 'blobfish_meta',
    m = 'blobfish_settings';
  async function h() {
    return ((await browser.storage.local.get(c))[c] ?? []).map(D);
  }
  function D(t) {
    return { date: t.date, sessions: t.sessions ?? [], offlineMs: t.offlineMs ?? 0 };
  }
  async function i() {
    let t = f(Date.now());
    return (await h()).find((a) => a.date === t) ?? { date: t, sessions: [], offlineMs: 0 };
  }
  async function u(t) {
    let e = D(t),
      o = ((await browser.storage.local.get(c))[c] ?? []).map(D),
      r = o.findIndex((n) => n.date === e.date);
    (r >= 0 ? (o[r] = e) : o.push(e),
      o.sort((n, M) => n.date.localeCompare(M.date)),
      await browser.storage.local.set({ [c]: o.slice(-8) }));
  }
  async function k(t) {
    return (await h()).find((a) => a.date === t) ?? { date: t, sessions: [], offlineMs: 0 };
  }
  function f(t) {
    let e = new Date(t);
    return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}`;
  }
  async function N() {
    let t = await h(),
      e = new Map(t.map((n) => [n.date, n])),
      a = [],
      o = new Date(),
      r = new Date(o.getFullYear(), o.getMonth(), o.getDate() - 6);
    for (let n = 0; n < 7; n++) {
      let M = new Date(r.getFullYear(), r.getMonth(), r.getDate() + n),
        I = f(M.getTime());
      a.push(D(e.get(I) ?? { date: I, sessions: [], offlineMs: 0 }));
    }
    return a;
  }
  async function p() {
    return { walkEnabled: (await browser.storage.local.get(m))[m]?.walkEnabled === !0 };
  }
  async function l() {
    return (await i()).sessions.find((a) => a.endTime === void 0)?.posture ?? 'sitting';
  }
  async function L() {
    let e = (await i()).sessions.find((a) => a.endTime === void 0);
    return !e || e.posture !== 'sitting' ? null : Date.now() - e.startTime;
  }
  async function S(t) {
    let e = await p();
    if (t === 'walking' && !e.walkEnabled) return;
    let a = await i();
    if (a.sessions.find((n) => n.endTime === void 0)?.posture === t) return;
    let r = Date.now();
    for (let n of a.sessions) n.endTime === void 0 && (n.endTime = r);
    (a.sessions.push({ posture: t, startTime: r }), await u(a), await s());
  }
  async function s() {
    await browser.alarms.clear(d);
    let e = (await i()).sessions.find((n) => n.endTime === void 0);
    if (!e || e.posture !== 'sitting') return;
    let a = Date.now(),
      r = a - e.startTime >= 27e5 ? a + 1e3 : e.startTime + 27e5;
    await browser.alarms.create(d, { when: r });
  }
  async function b(t, e) {
    if (e <= 0) return;
    let a = Math.min(e, 864e5),
      o = await k(t);
    ((o.offlineMs += a), await u(o));
  }
  async function T() {
    let t = Date.now(),
      e = await i();
    for (let a of e.sessions) a.endTime === void 0 && (a.endTime = t);
    (e.sessions.push({ posture: 'sitting', startTime: t }), await u(e), await s());
  }
  async function q() {
    return (await browser.storage.local.get(y))[y] ?? null;
  }
  async function F(t) {
    await browser.storage.local.set({ [y]: t });
  }
  async function g() {
    let t = Date.now(),
      e = await q();
    if (e === null) {
      await F({ lastHeartbeatMs: t });
      return;
    }
    let a = t - e.lastHeartbeatMs;
    (a > 9e5 && (await b(f(t), Math.min(a, 864e5)), await T()), await F({ lastHeartbeatMs: t }));
  }
  async function _() {
    (await browser.alarms.get(w)) || (await browser.alarms.create(w, { periodInMinutes: 5 }));
  }
  var A = null,
    H = !1;
  function x() {
    H ||
      ((H = !0),
      browser.idle.setDetectionInterval(60),
      browser.idle.onStateChanged.addListener((t) => {
        if (t === 'active') {
          if (A !== null) {
            let e = Date.now() - A;
            (e >= 3e4 && (async () => (await b(f(Date.now()), e), await T()))(), (A = null));
          }
        } else A = Date.now();
      }));
  }
  async function Y(t) {
    let e = await i(),
      a = await N(),
      o = await p();
    return { posture: t, day: e, week: a, settings: o };
  }
  function G() {
    browser.runtime.onMessage.addListener(async (t) => {
      if ((await g(), t.type === 'GET_STATE')) {
        let e = await l();
        return Y(e);
      }
      if (t.type === 'SET_POSTURE' && t.posture) {
        await S(t.posture);
        let e = await l();
        return Y(e);
      }
    });
  }
  var C = [
    'Feeling like a deflated pool float? Get up and move before you turn into a real-life blob fish!',
    'Your chair is plotting world domination. Stand up and break the cycle of chair tyranny!',
    "Don't let your butt become one with the chair! Stand up and give it some breathing room.",
    'Remember, sitting is the new smoking! Stand up and avoid the wrinkles... of the brain, that is!',
    'WARNING: Prolonged sitting may lead to increased Netflix binging, decreased productivity, and a strong urge to nap under your desk.',
    "Did you know squirrels never sit still? Maybe that's why they're so energetic. Take a cue from the furry acrobats!",
    "Feeling sleepy? Coffee won't fix it this time. Stand up and get your blood pumping!",
    "Your cat is judging you for being a lazy bum. Stand up and show them who's boss.",
    "Remember, the only time it's okay to be a couch potato is... actually, just stand up.",
    'Your spine called. It says it misses being vertical. Please stand up.',
  ];
  function V(t) {
    let e = Math.max(0, Math.floor(t / 6e4));
    if (e < 1) return 'under a minute';
    let a = Math.floor(e / 60),
      o = e % 60;
    return a > 0 ? (o === 0 ? `${a}h` : `${a}h ${o}m`) : `${e} min`;
  }
  var $ = [
    (t) => `You've been sitting for ${t} \u2014 time to stand up`,
    (t) => `${t} seated \u2014 stretch your legs`,
    (t) => `Still sitting after ${t}? Time to move`,
    (t) => `${t} on your chair \u2014 get up for a bit`,
    (t) => `BlobFish mode: ${t} seated`,
    (t) => `${t} sitting \u2014 your spine is asking for a break`,
  ];
  function K(t) {
    let e = V(t),
      a = $[Math.floor(Math.random() * $.length)];
    return a(e);
  }
  function B() {
    return C[Math.floor(Math.random() * C.length)];
  }
  async function P() {
    await g();
    let t = await i();
    (t.sessions.some((a) => a.endTime === void 0) ||
      (t.sessions.push({ posture: 'sitting', startTime: Date.now() }), await u(t)),
      await s());
  }
  async function W() {
    (await p()).walkEnabled || ((await l()) === 'walking' && (await S('standing')));
  }
  function z() {
    (G(),
      browser.storage.local.onChanged.addListener((t) => {
        !t[m] || t[m].newValue?.walkEnabled === !0 || W();
      }),
      browser.runtime.onInstalled.addListener(async () => {
        (await _(), x(), await P());
      }),
      browser.runtime.onStartup.addListener(async () => {
        (await _(), x(), await P());
      }),
      browser.alarms.onAlarm.addListener(async (t) => {
        if (t.name === w) {
          await g();
          return;
        }
        if (t.name !== d) return;
        if ((await l()) !== 'sitting') {
          await s();
          return;
        }
        let a = await L();
        if (a == null) {
          await s();
          return;
        }
        let o = K(a),
          r = B();
        (await browser.notifications.create(R, {
          type: 'basic',
          iconUrl: browser.runtime.getURL('./icons/128.png'),
          title: o,
          message: r,
        }),
          await browser.alarms.create(d, { when: Date.now() + 9e5 }));
      }));
  }
  z();
})();
