
$(document).ready(() => {
  addCurrentTab();
})

function addCurrentTab() {
  $(document).on('click', '#add-current-tab', function() {
    chrome.tabs.query({active: true}, function (tabs) {
      console.log(tabs)
      let url = tabs[0].url;
      let name = tabs[0].title;
      let image_url = tabs[0].favIconUrl;
      if(image_url == null) {
        image_url = './img/default.png'
      }
      addTab(name, url, image_url);
    });

    $(this).text("Saved!").toggleClass('btn-success');
  });
}

function addTab(name, link, img) {
  chrome.storage.sync.get(["links"], function(obj) {
    obj.links.push({"name": name, "actual_link": link, "image_link": img});

    chrome.storage.sync.set({links: obj.links}, function() {
      console.log(obj.links);
      console.log("Added new tab");
    });
  });
}
