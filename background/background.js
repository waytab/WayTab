var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function(deets) {
  chrome.storage.sync.set({enableTab: true}, function() {});
  if(deets.reason == 'install') {
    chrome.storage.sync.set({title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false, font: 'default', enableWspn: true, bell2: false, todoDate: 'Tomorrow'}, function() {});
  } else if (deets.reason == 'update') {
    chrome.storage.sync.get('links', function(res) {
      let updatedLinks = res.links
      updatedLinks[6].actual_link = 'https://student.naviance.com/waylandhs'
      chrome.storage.sync.set({links: updatedLinks}, function() {})
    })
  }
});
