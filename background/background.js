var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function(deets) {
  chrome.storage.sync.set({enableTab: true}, function() {});
  if(deets.reason == 'install') {
    chrome.storage.sync.set({title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false, font: 'default', enableWspn: true}, function() {});
  }
});
