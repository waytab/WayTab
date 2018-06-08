export class Links {
  constructor() {
    let linksFunc = this.loadLinks
    chrome.storage.sync.get(['links'], function(result) {
      if(Object.keys(result).length === 0 && result.constructor === Object) {
        $.getJSON('js/json/config.json', (data) => {
          chrome.storage.sync.set({links: data.saved_tabs}, () => {
            linksFunc(data.saved_tabs)
          })
        })
      } else {
        linksFunc(result.links)
      }
    })
    this.addLink()
    this.removeLinks()
  }

  loadLinks(obj) {
    $('#link-container').empty()
    $('#remove-links').empty()
    for(let i = 0; i < obj.length; i++) {
      $('#link-container').append($('<div></div>').addClass('col-1').attr('id', `link${i}`))
      $(`#link${i}`).append($('<a></a>').addClass('img-link').attr('href', obj[i].actual_link).append($('<img />').attr({ src: obj[i].image_link, alt: obj[i].name })))
      $(`#link${i}`).append($('<div>X</div>').addClass('tab-delete-button').attr('id', `delete${i}`))

      $('#remove-links').append($('<li></li>').addClass('list-group-item').html(`<button class="mr-3 delete-link" data-num="${i}" style="background: none; border: none; cursor: pointer;">&times;</button>${obj[i].name}`))
    }
    $('#link-container').prepend($('<div></div>').addClass('col')).append($('<div></div>').addClass('col'))
  }

  addLink() {
    $(document).on('click', '#submit-tab-info', () => {
      let name = $('#tab-name').val();
      let link = $('#tab-link').val();
      let img = $('#img-upload').val();
      if(img.length <= 8) {
        img = './img/default.png'
      }

      let linksLoad = this.loadLinks
      let obj = {"name": name, "actual_link": link, "image_link": img};
      chrome.storage.sync.get(['links'], function(result) {
        result.links.push(obj);
        chrome.storage.sync.set({links: result.links}, () => { linksLoad(result.links) });
      });
    });
  }

  removeLinks() {
    $(document).on('click', '.delete-link', (e) => {
      let target = $(e.target)
      let targetLink = target.data('num')
      chrome.storage.sync.get(['links'], (result) => {
        result.links.splice(targetLink, 1)
        chrome.storage.sync.set({'links': result.links}, () => { this.loadLinks(result.links) })
      })
    })
  }
}
