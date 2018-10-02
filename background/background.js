var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function(deets) {
  chrome.storage.sync.set({enableTab: true}, function() {});
  if(deets.reason == 'install') {
    chrome.storage.sync.set({title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false, font: 'default', enableWspn: true, bell2: false, todoDate: 'tomorrow'}, function() {});
  } else if (deets.reason == 'update') {
    // Empty cuz we don't need to add anything here for 1.1.2
  }
});
