chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({enableTab: true}, function() {
    console.log("Tab is being changed");
  });
});
