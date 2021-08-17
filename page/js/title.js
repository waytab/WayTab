// @TO-DO
// untested
// should probably test before prod
// thx
// leaving old jquery commented bc untesting and nice to have reference to old working code

export default class Title {
  constructor() {
    chrome.storage.sync.get("title", function({title}) {
      document.querySelector('#title-container').textContent = title
      document.querySelector('#title-input').value = title
    })

    document.addEventListener('click', e => {
      if(e.target.id == '#settings-close') {
        let newtitle = document.querySelector('#title-input').value
        chrome.storage.sync.set({title: newtitle}, function() {
          document.querySelector('#title-container').textContent = newtitle
          console.log('%ctitle.js line:13 New Title Set', 'color: #007acc;', newtitle);
        })
      }
    })
    // $(document).on('click', '#settings-close', function() {
    //   let newtitle = $('#title-input').val()
    //   chrome.storage.sync.set({title: newtitle}, function() {
    //     $('#title-container').text(newtitle)
    //     console.log("New Title Set")
    //   })
    // })
  }
}
