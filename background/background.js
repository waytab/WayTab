var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function(deets) {
  chrome.storage.sync.set({enableTab: true}, function() {});
  if(deets.reason == 'install') {
    chrome.storage.sync.set({setup: false, title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false, font: 'default', enableWspn: true, bell2: false, todoDate: 'Tomorrow'}, function() {});
  } else if (deets.reason == 'update') {
    chrome.storage.sync.get('links', function({links}) {
      links.forEach(e => {
        if(e.actual_link == 'https://connection.naviance.com/family-connection/auth/login/?hsname=waylandhs') {
          e.actual_link = 'https://student.naviance.com/waylandhs'
        }
      })
      chrome.storage.sync.set({links: links}, function() {})
    })
  }
});
