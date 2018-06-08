var idle = 0;

$(document).ready(() => {
  let idleInterval = setInterval(idleHide, 60000);
  $(this).mousemove(function (e) {
    idle = 0;
  });
  $(this).keypress(function (e) {
    idle = 0;
  });

  hideBody();
  loadBackground();
  changeBackground();
});

function idleHide() {
  idle += 1;
  if(idle >= 1) {
    $('#content').css('display', 'none');
    $('#content-status').text('Show Content');
  }
}

function hideBody() {
  $(document).on('click', '#hide-content', () => {
    if($('#content').css('display') === 'none') {
      $('#content').css('display', 'block');
      $('#content-status').text('Hide Content');
    }else {
      $('#content').css('display', 'none');
      $('#content-status').text('Show Content');
    }
  });
}

function loadBackground() {
  chrome.storage.sync.get(['background'], function(response) {
    $(document.body).css('background-image', 'url(\"'+response.background+'\")');
  });
}

function changeBackground() {
  $(document).on('click', '#submit-new-background', () => {
    let sel = $('#select-background').val()[0];
    let href = './img/' + sel.toLowerCase()+'.jpg';
    $(document.body).css('background-image', 'url(\"'+href+'\")');
    chrome.storage.sync.set({background: href}, function(response) {});
  });
}
