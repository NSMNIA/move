const NOTIFICATION = 'StandUpOrYoullTurnIntoABlobFish-NOTIFICATION';
const requestName = 'interval';

browser.alarms.create('', {
  periodInMinutes: localStorage.getItem(requestName) ? parseInt(localStorage.getItem(requestName)!) : 60,
});

browser.alarms.onAlarm.addListener(() => {
  browser.notifications.create(NOTIFICATION, {
    type: 'basic',
    iconUrl: browser.runtime.getURL('icons/icon.png'),
    title: 'StandUpOrYoullTurnIntoABlobFish',
    message: notifications[Math.floor(Math.random() * notifications.length)],
    imageUrl: browser.runtime.getURL('icons/icon.png'),
  });
});

browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.name !== requestName) {
    return sendResponse('Invalid request');
  }
  if (isNaN(parseInt(request.data))) {
    return sendResponse('Invalid data');
  }
  localStorage.setItem(request.name, request.data);
});

const notifications = [
  'Feeling like a deflated pool float? Get up and move before you turn into a real-life blob fish!',
  'Your chair is plotting world domination. Stand up and break the cycle of chair tyranny!',
  "Don't let your butt become one with the chair! Stand up and give it some breathing room (and maybe yourself too).",
  'Remember, sitting is the new smoking! Stand up and avoid the wrinkles... of the brain, that is!',
  'WARNING: Prolonged sitting may lead to increased Netflix binging, decreased productivity, and a strong urge to nap under your desk. Stand up and save yourself!',
  "Did you know squirrels never sit still? Maybe that's why they're so energetic. Take a cue from the furry acrobats and get moving!",
  "Feeling sleepy? Coffee won't fix it this time. Stand up and get your blood pumping! You'll thank yourself later (and your coffee will be grateful it has company).",
  "Scientists say sitting all day can lead to... well, they actually haven't studied the long-term effects yet. But do you really want to be the test subject? Stand up and play it safe!",
  "Your cat is judging you for being a lazy bum. Stand up, show them who's boss, and then maybe pet them for inspiration.",
  "Remember, the only time it's okay to be a couch potato is... actually, never mind. Just stand up and get moving!",
] as const;
