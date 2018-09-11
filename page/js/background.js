export default class Background {
  constructor() {
    chrome.storage.sync.get(['background'], function(response) {
      $(document.body).css('background-image', 'url(\"'+response.background+'\")')
      let sel = response.background.split('/')
      let name = sel[2].substring(0, sel[2].length-4)
      name = name.substring(0,1).toUpperCase() + name.substring(1)
      $('#select-background').val(name)
    })

    $(document).on('change', '#select-background', () => {
      let sel = $('#select-background').val()
      let href = './img/' + sel.toLowerCase()+'.jpg'
      $(document.body).css('background-image', `url("${href}")`)
    })

    $(document).on('click', '#settings-close', () => {
      let sel = $('#select-background').val()
      console.log($('#select-background').val())
      let href = './img/' + sel.toLowerCase()+'.jpg'
      chrome.storage.sync.set({background: href}, function(response) {})
    })
  }
}
