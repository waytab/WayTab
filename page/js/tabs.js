var config = conf;

window.onload = function() {
  // Load tabs
  createExistingLinks();
  detectAdditionCheckbox();
  detectAdditionSubmission();
}

function detectAdditionCheckbox() {
  var checkbox = document.getElementById("confirm-add");
  var div = document.getElementById("add-tab-attributes");
  checkbox.onchange = function() {
    if(this.checked) {
      div.style.display = "block";
      div.style.backgroundColor = "#e2e2e2";
      div.style.padding= "1%";
      div.style.borderRadius = "4px";
      div.style.width = "100%";
    }else {
      div.style.display = "none";
      document.getElementById("tab-name").value = "";
      document.getElementById("tab-link").value = "https://";
      document.getElementById("img-upload").value = "https://";
    }
  };
}

function detectAdditionSubmission() {
  var button = document.getElementById("submit-tab-info");
  button.onclick = function() {
    var title = document.getElementById("tab-name").value;
    var hlink = document.getElementById("tab-link").value;
    var ilink = document.getElementById("img-upload").value;
    addTab(title, hlink, ilink);
  };
}

function createExistingLinks() {
  chrome.storage.sync.get("savedtabs", function(obj) {
    console.log(obj);
    var tabs = obj["savedtabs"]["savedtabs"];
    console.log(tabs);

    var length = tabs["tabs"].length;
    console.log(length);

    var row = document.getElementById("tabtainer");
    row.innerHTML += "<div class='col' id='start-col'></div>";
    for(i = 0; i < length; i++) {
      var obj = tabs["tabs"][i];
      console.log(obj);

      var newdiv = document.createElement("DIV");
      newdiv.setAttribute("class", "col-1");

      var newlink = document.createElement("A");
      newlink.setAttribute("class", "img-link");
      newlink.setAttribute("href", obj.actual_link);

      var newimg = document.createElement("IMG");
      newimg.setAttribute("src", obj.image_link);
      newimg.setAttribute("alt", obj.id);

      newlink.append(newimg);
      newdiv.append(newlink);
      row.append(newdiv);
    }
    row.innerHTML += "<div class='col' id='end-col'></div>";
  });
}

function addTab(name, link, img) {
  // Add it to HTML
  var parentdiv = document.getElementById("tabtainer");
  document.getElementById("end-col").remove();
  var newdiv = document.createElement("DIV");
  newdiv.setAttribute("class", "col-1");

  var newlink = document.createElement("A");
  newlink.setAttribute("class", "img-link");
  newlink.setAttribute("href", link);

  var newimg = document.createElement("IMG");
  newimg.setAttribute("src", img);
  newimg.setAttribute("alt", name);

  newlink.append(newimg);
  newdiv.append(newlink);
  parentdiv.append(newdiv);
  parentdiv.innerHTML += "<div class='col' id='end-col'></div>";

  // Add it to background
  chrome.storage.sync.get("savedtabs", function(obj) {
    var object = obj;
    object["savedtabs"].tabs.push({"id": name, "actual_link": link, "image_link": img});
    console.log(object["savedtabs"].tabs);

    chrome.storage.sync.set({savedtabs: object}, function() {
      console.log(object);
      console.log("Added new tab");
    });
  });
}

function removeTab() {

}
