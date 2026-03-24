'use strict';
(() => {
  var e = 'blobfish_settings';
  async function a() {
    let t = (await browser.storage.local.get(e))[e];
    document.getElementById('walk-enabled').checked = !!t?.walkEnabled;
  }
  async function o() {
    let n = document.getElementById('walk-enabled').checked;
    await browser.storage.local.set({ [e]: { walkEnabled: n } });
  }
  document.addEventListener('DOMContentLoaded', () => {
    (a(),
      document.getElementById('walk-enabled').addEventListener('change', () => {
        o();
      }));
  });
})();
