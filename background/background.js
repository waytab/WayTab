var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function(deets) {
  chrome.storage.sync.set({enableTab: true}, function() {});
  if(deets.reason == 'install') {
    chrome.storage.sync.set({title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false, font: 'default', enableWspn: true}, function() {});
  } else if (deets.reason == 'update') {
    chrome.storage.sync.get(['links'], (r) => {
      let l = r.links
      l.splice(2, 0, {
        "name": "Classroom",
        "actual_link": "https://classroom.google.com",
        "image_link": "https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png"
      })
      chrome.storage.sync.set({links: l})
    })
  }
});
