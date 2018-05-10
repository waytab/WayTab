let page = document.body;
var newdiv = document.createElement("div");

window.onload = function() {
  chrome.storage.sync.get("enableTab", function(response) {
    var state = response.enableTab;
    var box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.setAttribute("checked", state);
    box.setAttribute("id", "state");
    box.setAttribute("value", "state");
    var lab = "<label for='state'> Change Tabs </label>";

    newdiv.appendChild(box);
    newdiv.innerHTML += lab;
    newdiv.setAttribute("style", "width: 300px; height: 100px")
    document.body.appendChild(newdiv);

    var detect = document.getElementById('state');
    detect.onchange = function() {
      chrome.storage.sync.set({enableTab: detect.checked}, function() {
        console.log("Switched state to " + detect.checked);
      });
    }
  });
}
