var idle = 0;

$(document).ready(() => {
  chrome.storage.sync.get(['autoHide'], function(result) {
    if(result.autoHide == true) {
      let idleInterval = setInterval(idleHide, 60000);
      $('#enableHide').prop('checked', true)
    }
  })
  $(document).on('mousemove', function (e) {
    idle = 0;
  });
  $(document).on('keypressed', function (e) {
    idle = 0;
  });

  hideBody();
  loadBackground();
  changeBackground();
  autoHideSetting()
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
  $(document).on('change', '#select-background', () => {
    let sel = $('#select-background').val();
    let href = './img/' + sel.toLowerCase()+'.jpg';
    $(document.body).css('background-image', `url("${href}")`);
  });
  $(document).on('click', '#settings-close', () => {
    let sel = $('#select-background').val();
    console.log($('#select-background').val())
    let href = './img/' + sel.toLowerCase()+'.jpg';
    chrome.storage.sync.set({background: href}, function(response) {});
  })
}

function autoHideSetting() {
  $(document).on('click', '#settings-close', () => {
    chrome.storage.sync.set({autoHide: $('#enableHide').is(':checked') })
  })
}
