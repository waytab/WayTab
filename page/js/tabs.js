var config = conf;
var buttonlength = 0;

window.onload = function() {
  chrome.storage.sync.get("savedtabs", function(obj) {
    console.log(obj);
  });

  // Load tabs
  createExistingLinks();
  detectAdditionCheckbox();
  detectRemovalCheckbox();
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

function detectRemovalCheckbox() {
  var checkbox = document.getElementById("confirm-remove");
  var delbuts = document.getElementsByClassName("tab-delete-button");
  checkbox.onchange = function() {
    if(this.checked) {
      for(i = 0; i < delbuts.length; i++) {
        buttonlength = i;
        delbuts[i].style.display = "inline-block";
      }
      detectTabDeleted();
    }else {
      for(i = 0; i < delbuts.length; i++) {
        delbuts[i].style.display = "none";
      }
    }
  }
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

function detectTabDeleted() {
  var delbuts = document.getElementsByClassName("tab-delete-button");
  for(i = 0; i < buttonlength + 1; i++) {
    var button = delbuts[i];
    console.log(button.id.substring(1));
    button.onclick = function() {
      console.log(button.id.substring(1));
      removeTab(button.id.substring(1));
      buttonlength--;

      document.getElementById("confirm-remove").checked = false;
      for(i = 0; i < buttonlength + 1; i++) {
        delbuts[i].style.display = "none";
      }
    }
  }
}

function createExistingLinks() {
  chrome.storage.sync.get("savedtabs", function(obj) {
    var tabs = obj["savedtabs"];
    var length = tabs.length;

    var row = document.getElementById("tabtainer");
    row.innerHTML += "<div class='col' id='start-col'></div>";
    for(i = 0; i < length; i++) {
      var obj = tabs[i];
      var newdiv = createTabDiv(obj.id, obj.image_link, obj.actual_link);
      row.append(newdiv);
    }
    row.innerHTML += "<div class='col' id='end-col'></div>";
  });
}

function addTab(name, link, img) {
  // Add it to HTML
  var parentdiv = document.getElementById("tabtainer");
  document.getElementById("end-col").remove();
  var newdiv = createTabDiv(name, img, link);

  parentdiv.append(newdiv);
  parentdiv.innerHTML += "<div class='col' id='end-col'></div>";

  // Add it to background
  chrome.storage.sync.get("savedtabs", function(obj) {
    var object = obj["savedtabs"];
    object.push({"id": name, "actual_link": link, "image_link": img});

    chrome.storage.sync.set({savedtabs: object}, function() {
      console.log(object["savedtabs"]);
      console.log("Added new tab");
    });
  });
}

function removeTab(name) {
  document.getElementById(name).remove();

  chrome.storage.sync.get("savedtabs", function(obj) {
    var arr = obj["savedtabs"];
    console.log(arr);
    for(i = 0; i < arr.length; i++) {
      if(arr[i].id == name) {
        console.log("hey");
        arr.splice(i, 1);
        console.log(arr);
        break;
      }
    }
    chrome.storage.sync.set({savedtabs: arr}, function() {
      console.log(arr["savedtabs"]);
      console.log("Removed");
    });
  });
}

function createTabDiv(name, img, link) {
  var newdiv = document.createElement("DIV");
  newdiv.setAttribute("class", "col-1");
  newdiv.setAttribute("id", name);

  var newlink = document.createElement("A");
  newlink.setAttribute("class", "img-link");
  newlink.setAttribute("href", link);

  var newimg = document.createElement("IMG");
  newimg.setAttribute("src", img);
  newimg.setAttribute("alt", name);

  var delbutton = document.createElement("BUTTON");
  delbutton.setAttribute("class", "tab-delete-button");
  delbutton.setAttribute("id", "b"+name);
  delbutton.innerHTML += "X";

  newlink.append(newimg);
  newdiv.append(newlink);
  newdiv.append(delbutton);

  return newdiv;
}
