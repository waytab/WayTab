let page = document.body;
var newdiv = document.createElement("DIV");

window.onload = function() {
  chrome.storage.sync.get("enableTab", function(response) {
    var state = response.enableTab;
    var box = document.createElement("INPUT");
    box.setAttribute("type", "checkbox");
    box.setAttribute("checked", state);
    box.setAttribute("id", "state");
    box.setAttribute("value", "state");
    var lab = "<label for='state'> Change Tabs </label>";

    newdiv.appendChild(box);
    newdiv.innerHTML += lab;
    document.body.appendChild(newdiv);

    var detect = document.getElementById('state');
    detect.onchange = function() {
      chrome.storage.sync.set({enableTab: detect.checked}, function() {
        console.log("Switched state to " + detect.checked);
      });
    }
  });
}
