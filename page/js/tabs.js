let config = conf;
let buttonlength = 0;

$(document).ready(() => {
  // Load tabs
  createExistingLinks();
  detectRemovalCheckbox();
  detectAdditionSubmission();
  displayTime();
  hoverTimeElapsed();
})

function detectRemovalCheckbox() {
  let checkbox = document.getElementById("confirm-remove");
  let delbuts = document.getElementsByClassName("tab-delete-button");
  checkbox.onchange = function() {
    if(this.checked) {
      for(i = 0; i < delbuts.length; i++) {
        buttonlength = i;
        delbuts[i].style.display = "inline-block";
      }
      detectTabDeleted();
    } else {
      for(i = 0; i < delbuts.length; i++) {
        delbuts[i].style.display = "none";
      }
    }
  }
}

function detectAdditionSubmission() {
  $(document).on('click', '#submit-tab-info', () => {
    let title = $('#tab-name')
    let hlink = $('#tab-link')
    let ilink = $('#img-upload')

    if(ilink.val().length <= 8) {
      ilink.val("img/default.png");
    }

    if(title.val().length == 0) {
      title.css('border-color', '#dc3545')
    } else if(hlink.val().length <= 8) {
      hlink.css('border-color', '#dc3545')
    } else {
      addTab(title.val(), hlink.val(), ilink.val());
      title.val("");
      hlink.val("");
      ilink.val("");
    }
  })
}

function detectTabDeleted() {
  let delbuts = document.getElementsByClassName("tab-delete-button");
  $('.tab-delete-button').each(function() {
    let mButton = $(this);
    let button = mButton[0];

    mButton.on('click', () => {
      console.log(button.id.substring(1));
      removeTab(button.id.substring(1));
      buttonlength--;
    })
  })
}

function createExistingLinks() {
  chrome.storage.sync.get("savedtabs", (obj) => {
    let tabs = obj["savedtabs"];
    let length = tabs.length;

    let row = $('#tabtainer');
    row.append("<div class='col' id='start-col'></div>")
    for(i = 0; i < length; i++) {
      let obj = tabs[i];
      console.log(obj.id + " " + obj.image_link + " " + obj.actual_link);
      let newdiv = createTabDiv(obj.id, obj.image_link, obj.actual_link);
      row.append(newdiv);
    }
    row.append("<div class='col' id='end-col'></div>")
  });
}

function addTab(name, link, img) {
  // Add it to HTML
  let parentdiv = $('#tabtainer')
  $('#end-col').remove();
  let newdiv = createTabDiv(name, img, link);

  parentdiv.append(newdiv);
  parentdiv.append('<div class="col" id="end-col"></div>')

  // Add it to background
  chrome.storage.sync.get("savedtabs", function(obj) {
    let object = obj["savedtabs"];
    object.push({"id": name, "actual_link": link, "image_link": img});

    chrome.storage.sync.set({savedtabs: object}, function() {
      console.log(object["savedtabs"]);
      console.log("Added new tab");
    });
  });
}

function removeTab(name) {
  console.log(name);
  document.getElementById(name).remove();

  chrome.storage.sync.get("savedtabs", function(obj) {
    let arr = obj["savedtabs"];
    console.log(arr);
    for(i = 0; i < arr.length; i++) {
      if(arr[i].id == name) {
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
  let newdiv = $('<div></div>').attr({
    class: 'col-1',
    id: name
  });

  let newlink = $('<a></a>').attr({
    class: 'img-link',
    href: link
  });

  let newimg = $('<img />').attr({
    src: img,
    alt: name
  });

  let delbutton = $('<button></button>').attr({
    class: 'tab-delete-button',
    id: `b${name}`
  }).text('X');

  newlink.append(newimg);
  newdiv.append(newlink);
  newdiv.append(delbutton);

  return newdiv;
}
