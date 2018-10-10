export default class Title {
  constructor() {
    chrome.storage.sync.get("title", function({title}) {
      $('#title-container').text(title)
      $('#title-input').val(title)
    })

    $(document).on('click', '#settings-close', function() {
      let newtitle = $('#title-input').val()
      chrome.storage.sync.set({title: newtitle}, function() {
        $('#title-container').text(newtitle)
        console.log("New Title Set")
      })
    })
  }
}
