
$(document).ready(() => {
  addCurrentTab();
})

function addCurrentTab() {
  $(document).on('click', '#add-current-tab', function() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      let url = tabs[0].url;
      let name = tabs[0].title;
      let image_url = "https://plus.google.com/_/favicon?domain_url="+url;
      console.log(url + " " + name + " " + image_url);
      addTab(name, url, image_url);
    });
  });
}

function addTab(name, link, img) {
  chrome.storage.sync.get("savedtabs", function(obj) {
    let object = obj["savedtabs"];
    object.push({"id": name, "actual_link": link, "image_link": img});

    chrome.storage.sync.set({savedtabs: object}, function() {
      console.log(object["savedtabs"]);
      console.log("Added new tab");
    });
  });
}
