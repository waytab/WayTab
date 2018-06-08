$(document).ready(() => {
  loadTitle();
  changeTitle();
})

function loadTitle() {
  chrome.storage.sync.get("title", function(response) {
    $('#title-container').text(response.title);
    $('#title-input').val(response.title)
  });
}

function changeTitle() {
  $(document).on('click', '#settings-close', function() {
    let newtitle = $('#title-input').val();
    chrome.storage.sync.set({title: newtitle}, function() {
      $('#title-container').text(newtitle);
      console.log("New Title Set");
    })
  })
}
