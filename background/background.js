var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enableTab: true, title: 'WayTab', links: tabs.tabs, background: './img/school.jpg', autoHide: false}, function() {
    console.log("Installed Tab Changer");
  });
});
