'use strict';
(() => {
  var x = 'StandUpOrYoullTurnIntoABlobFish-NOTIFICATION';
  var l = 'sitTooLong';
  var w = 'heartbeat';
  var d = 'blobfish_sessions',
    y = 'blobfish_meta',
    m = 'blobfish_settings';
  async function I() {
    return ((await browser.storage.local.get(d))[d] ?? []).map(D);
  }
  function D(t) {
    return { date: t.date, sessions: t.sessions ?? [], offlineMs: t.offlineMs ?? 0 };
  }
  async function i() {
    let t = f(Date.now());
    return (await I()).find((a) => a.date === t) ?? { date: t, sessions: [], offlineMs: 0 };
  }
  async function c(t) {
    let e = D(t),
      o = ((await browser.storage.local.get(d))[d] ?? []).map(D),
      r = o.findIndex((n) => n.date === e.date);
    (r >= 0 ? (o[r] = e) : o.push(e),
      o.sort((n, _) => n.date.localeCompare(_.date)),
      await browser.storage.local.set({ [d]: o.slice(-8) }));
  }
  async function H(t) {
    return (await I()).find((a) => a.date === t) ?? { date: t, sessions: [], offlineMs: 0 };
  }
  function f(t) {
    let e = new Date(t);
    return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}`;
  }
  async function L() {
    let t = await I(),
      e = new Map(t.map((n) => [n.date, n])),
      a = [],
      o = new Date(),
      r = new Date(o.getFullYear(), o.getMonth(), o.getDate() - 6);
    for (let n = 0; n < 7; n++) {
      let _ = new Date(r.getFullYear(), r.getMonth(), r.getDate() + n),
        k = f(_.getTime());
      a.push(D(e.get(k) ?? { date: k, sessions: [], offlineMs: 0 }));
    }
    return a;
  }
  async function p() {
    return { walkEnabled: (await browser.storage.local.get(m))[m]?.walkEnabled === !0 };
  }
  async function u() {
    return (await i()).sessions.find((a) => a.endTime === void 0)?.posture ?? 'sitting';
  }
  async function T() {
    let e = (await i()).sessions.find((a) => a.endTime === void 0);
    return !e || e.posture !== 'sitting' ? null : Date.now() - e.startTime;
  }
  async function b(t) {
    let e = await p();
    if (t === 'walking' && !e.walkEnabled) return;
    let a = await i();
    if (a.sessions.find((n) => n.endTime === void 0)?.posture === t) return;
    let r = Date.now();
    for (let n of a.sessions) n.endTime === void 0 && (n.endTime = r);
    (a.sessions.push({ posture: t, startTime: r }), await c(a), await s());
  }
  async function s() {
    await browser.alarms.clear(l);
    let e = (await i()).sessions.find((n) => n.endTime === void 0);
    if (!e || e.posture !== 'sitting') return;
    let a = Date.now(),
      r = a - e.startTime >= 27e5 ? a + 1e3 : e.startTime + 27e5;
    await browser.alarms.create(l, { when: r });
  }
  async function A(t, e) {
    if (e <= 0) return;
    let a = Math.min(e, 864e5),
      o = await H(t);
    ((o.offlineMs += a), await c(o));
  }
  async function M() {
    let t = Date.now(),
      e = await i();
    for (let a of e.sessions) a.endTime === void 0 && (a.endTime = t);
    (e.sessions.push({ posture: 'sitting', startTime: t }), await c(e), await s());
  }
  async function X() {
    return (await browser.storage.local.get(y))[y] ?? null;
  }
  async function F(t) {
    await browser.storage.local.set({ [y]: t });
  }
  async function g() {
    let t = Date.now(),
      e = await X();
    if (e === null) {
      await F({ lastHeartbeatMs: t });
      return;
    }
    let a = t - e.lastHeartbeatMs;
    (a > 9e5 && (await A(f(t), Math.min(a, 864e5)), await M()), await F({ lastHeartbeatMs: t }));
  }
  async function R() {
    (await browser.alarms.get(w)) || (await browser.alarms.create(w, { periodInMinutes: 5 }));
  }
  var h = null,
    C = !1;
  function v() {
    C ||
      ((C = !0),
      browser.idle.setDetectionInterval(60),
      browser.idle.onStateChanged.addListener((t) => {
        if (t === 'active') {
          if (h !== null) {
            let e = Date.now() - h;
            (e >= 3e4 && (async () => (await A(f(Date.now()), e), await M()))(), (h = null));
          }
        } else h = Date.now();
      }));
  }
  var Y = [
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
  function q(t) {
    let e = Math.max(0, Math.floor(t / 6e4));
    if (e < 1) return 'under a minute';
    let a = Math.floor(e / 60),
      o = e % 60;
    return a > 0 ? (o === 0 ? `${a}h` : `${a}h ${o}m`) : `${e} min`;
  }
  var G = [
    (t) => `You've been sitting for ${t} \u2014 time to stand up`,
    (t) => `${t} seated \u2014 stretch your legs`,
    (t) => `Still sitting after ${t}? Time to move`,
    (t) => `${t} on your chair \u2014 get up for a bit`,
    (t) => `BlobFish mode: ${t} seated`,
    (t) => `${t} sitting \u2014 your spine is asking for a break`,
  ];
  function V(t) {
    let e = q(t),
      a = G[Math.floor(Math.random() * G.length)];
    return a(e);
  }
  function J() {
    return Y[Math.floor(Math.random() * Y.length)];
  }
  async function E(t) {
    let e = V(t),
      a = J(),
      o = browser.runtime.getURL('icons/128.png'),
      r = { type: 'basic', title: e, message: a };
    try {
      await browser.notifications.create(x, { ...r, iconUrl: o });
    } catch {
      await browser.notifications.create(x, r);
    }
  }
  async function $(t) {
    let e = await i(),
      a = await L(),
      o = await p();
    return { posture: t, day: e, week: a, settings: o };
  }
  function K() {
    browser.runtime.onMessage.addListener(async (t) => {
      if ((await g(), t.type === 'GET_STATE')) {
        let e = await u();
        return $(e);
      }
      if (t.type === 'SET_POSTURE' && t.posture) {
        await b(t.posture);
        let e = await u();
        return $(e);
      }
      if (t.type === 'TEST_NOTIFICATION') {
        let e = (await T()) ?? 27e5;
        return (await E(e), { ok: !0 });
      }
    });
  }
  async function N() {
    await g();
    let t = await i();
    (t.sessions.some((a) => a.endTime === void 0) ||
      (t.sessions.push({ posture: 'sitting', startTime: Date.now() }), await c(t)),
      await s());
  }
  async function B() {
    (await p()).walkEnabled || ((await u()) === 'walking' && (await b('standing')));
  }
  function W() {
    (K(),
      browser.storage.local.onChanged.addListener((t) => {
        !t[m] || t[m].newValue?.walkEnabled === !0 || B();
      }),
      browser.runtime.onInstalled.addListener(async () => {
        (await R(), v(), await N());
      }),
      browser.runtime.onStartup.addListener(async () => {
        (await R(), v(), await N());
      }),
      browser.alarms.onAlarm.addListener(async (t) => {
        if (t.name === w) {
          await g();
          return;
        }
        if (t.name !== l) return;
        if ((await u()) !== 'sitting') {
          await s();
          return;
        }
        let a = await T();
        if (a == null) {
          await s();
          return;
        }
        (await E(a), await browser.alarms.create(l, { when: Date.now() + 9e5 }));
      }));
  }
  W();
})();
