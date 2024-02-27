const NOTIFICATION = 'StandUpOrYoullTurnIntoABlobFish-NOTIFICATION';

browser.alarms.create('', {
  periodInMinutes: 0.1,
});

browser.alarms.onAlarm.addListener(() => {
  browser.notifications.create(NOTIFICATION, {
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon.png'),
    title: 'StandUpOrYoullTurnIntoABlobFish',
    message: 'Test message',
    imageUrl: browser.runtime.getURL('icons/icon.png'),
  });
});
