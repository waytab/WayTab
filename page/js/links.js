export class Links {
  constructor() {
    let linksFunc = this.loadLinks
    chrome.storage.sync.get(['savedtabs'], function(obj) {
      let result = obj.savedtabs;
      if(result.length == 0) {
        $.getJSON('js/json/config.json', (data) => {
          chrome.storage.sync.set({links: data.saved_tabs}, () => {
            linksFunc(data.saved_tabs)
          })
        })
      } else {
        linksFunc(result);
      }
    })
  }

  loadLinks(obj) {
    for(let i = 0; i < obj.length; i++) {
      $('#link-container').append($('<div></div>').addClass('col-1').attr('id', `link${i}`))
      $(`#link${i}`).append($('<a></a>').addClass('img-link').attr('href', obj[i].actual_link).append($('<img />').attr({ src: obj[i].image_link, alt: obj[i].id })))
    }
    $('#link-container').prepend($('<div></div>').addClass('col')).append($('<div></div>').addClass('col'))
  }
}
