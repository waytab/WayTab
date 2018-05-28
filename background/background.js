var tabs = deftabs;

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enableTab: true}, function() {
    console.log("Installed Tab Changer");
  });

  chrome.storage.sync.set({savedtabs: tabs}, function() {
    console.log(tabs);
  });
});
