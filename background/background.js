let tabs

$.getJSON('./defaulttabs.json', function(data) {
  tabs = data
  chrome.runtime.onInstalled.addListener(function(deets) {
    chrome.storage.sync.set({enableTab: true}, function() {});
    if(deets.reason == 'install') {
      chrome.storage.sync.set({title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false, font: 'default', enableWspn: true, bell2: false, todoDate: 'Tomorrow', startChangeLog: true}, function() {});
    } else if (deets.reason == 'update') {
      chrome.storage.sync.set({startChangeLog: true}, function() {})
    }
  });
})
