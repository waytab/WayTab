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
    this.editLink()
  }

  loadLinks(obj) {
    $('#link-container').empty()
    $('#remove-links').empty()
    for(let i = 0; i < obj.length; i++) {
      $('#link-container').append($('<div></div>').addClass('col-1').attr({
                                                                            'id': `link${i}`,
                                                                            'data-toggle': 'tooltip',
                                                                            'data-placement': 'bottom',
                                                                            'title': obj[i].name
                                                                          }))
      $(`#link${i}`).append($('<a></a>').addClass('img-link').attr('href', obj[i].actual_link).append($('<img />').attr({ src: obj[i].image_link, alt: obj[i].name })))
      $(`#link${i}`).append($('<div>X</div>').addClass('tab-delete-button').attr('id', `delete${i}`))

      $('#remove-links')
        .append($('<li></li>')
          .addClass('list-group-item d-inline-flex')
          .append(
            $('<button></button>')
              .addClass('mr-3 delete-link')
              .attr('data-num', i)
              .css({
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              })
              .html('&times;'),
            $('<div></div>')
              .addClass('link-edit')
              .css('cursor', 'pointer')
              .data('edit', i)
              .text(obj[i].name)
          )
        )
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

  editLink() {
    $(document).on('click', '.link-edit', (e) => {
      $(e.target)
        .addClass('w-100')
        .text('')
        .append(
          $('<input>')
            .addClass('form-control')
            .attr('placeholder', 'Name')
            .val($(`#link${$(e.target).data('edit')} a img`).attr('alt')),
          $('<input>')
            .addClass('form-control')
            .attr('placeholder', 'URL')
            .val($(`#link${$(e.target).data('edit')} a`).attr('href')),
          $('<input>')
            .addClass('form-control')
            .attr('placeholder', 'Image URL')
            .val($(`#link${$(e.target).data('edit')} a img`).attr('src'))
        )
    })

    $(document).on('click', '#settings-close', (e) => {
      chrome.storage.sync.get(['links'], function(result) {
        let links = result.links
        $('.link-edit').each(function(index) {
          if($(this).has('input').length){
            links[index] = { name: $(this).children('input').eq(0).val(), actual_link: $(this).children('input').eq(1).val(), image_link: $(this).children('input').eq(2).val() }
          }
        })
        chrome.storage.sync.set({links: links})
      });
    })
  }
}
