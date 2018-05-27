var config = conf;

window.onload = function() {
  // Load tabs
  createLinks();
}

function createLinks() {
  var tabs = config["saved_tabs"];
  var length = Object.keys(tabs).length;

  var row = document.getElementById("tabtainer");
  row.innerHTML += "<div class='col'></div>";
  for(i = 0; i < length; i++) {
    var key = Object.keys(tabs)[i];
    var obj = tabs[key];

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
  row.innerHTML += "<div class='col'></div>";
}

function addTab() {

}

function removeTab() {

}
