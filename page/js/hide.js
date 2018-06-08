$(document).ready(() => {
  hideBody();
  loadBackground();
  changeBackground();
})

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
