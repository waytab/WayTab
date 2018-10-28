export default class Title {
  constructor() {
    chrome.storage.sync.get('title', function(response) {
      $('#title-container').text(response.title)
      $('#title-input').val(response.title)
    })

    $(document).on('click', '#settings-close', function() {
      let newtitle = $('#title-input').val()
      chrome.storage.sync.set({title: newtitle}, function() {
        $('#title-container').text(newtitle)
      })
    })
  }
}
