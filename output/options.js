'use strict';
(() => {
  var e = 'blobfish_settings';
  async function o() {
    let n = (await browser.storage.local.get(e))[e];
    document.getElementById('walk-enabled').checked = !!n?.walkEnabled;
  }
  async function a() {
    let t = document.getElementById('walk-enabled').checked;
    await browser.storage.local.set({ [e]: { walkEnabled: t } });
  }
  document.addEventListener('DOMContentLoaded', () => {
    (o(),
      document.getElementById('walk-enabled').addEventListener('change', () => {
        a();
      }),
      document.getElementById('test-notification').addEventListener('click', () => {
        browser.runtime.sendMessage({ type: 'TEST_NOTIFICATION' });
      }));
  });
})();
