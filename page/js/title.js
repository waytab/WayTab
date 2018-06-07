$(document).ready(() => {
  loadTitle();
  changeTitle();
})

function loadTitle() {
  chrome.storage.sync.get("title", function(response) {
    $('#title-container').text(response.title);
  });
}

function changeTitle() {
  $(document).on('click', '#submit-new-title', function() {
    var newtitle = $('#title-input').val();
    $('#title-container').text(newtitle);
    $('#title-input').val('');

    chrome.storage.sync.set({title: newtitle}, function() {
      console.log("New Title Set");
    })
  })
}
