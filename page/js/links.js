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
    $('#edit-links').empty()
    for(let i = 0; i < obj.length; i++) {
      $('#link-container').append($('<div></div>').addClass('col-1').attr({
                                                                            'id': `link${i}`,
                                                                            'data-toggle': 'tooltip',
                                                                            'data-placement': 'bottom',
                                                                            'title': obj[i].name
                                                                          }))
      $(`#link${i}`).append($('<a></a>').addClass('img-link').attr('href', obj[i].actual_link).append($('<img />').attr({ src: obj[i].image_link, alt: obj[i].name })))
      $(`#link${i}`).append($('<div>X</div>').addClass('tab-delete-button').attr('id', `delete${i}`))

      $('#edit-links')
        .append($('<li></li>')
          .addClass('list-group-item d-inline-flex')
          .append(
            $('<a></a>')
              .attr({
                role: 'button',
                title: 'Confirm',
                'data-toggle': 'popover',
                'data-trigger': 'focus',
                'data-html': true,
                'data-content': `<button class="btn btn-danger delete-link" data-num="${i}">Delete</button>`,
                tabindex: 0
              })
              .css({ 'margin-left': 6, 'margin-right': 22, color: 'black', 'text-decoration': 'none', cursor: 'pointer' })
              .html('&times;'),
            $('<div></div>')
              .addClass('link-edit w-100')
              .css('cursor', 'pointer')
              .data('edit', i)
              .text(obj[i].name)
          )
        )
    }

    $('#edit-links')
      .append($('<li></li>')
        .addClass('list-group-item')
        .css('cursor', 'pointer')
        .attr('id', 'addLink')
        .html('<span class="font-weight-bold"><span style="margin-left: 6px; margin-right: 22px;">&plus;</span>Add Link...</span>')
    )
    $('#link-container').prepend($('<div></div>').addClass('col')).append($('<div></div>').addClass('col'))
    $('[data-toggle="popover"]').popover()
  }

  addLink() {
    let isOpen = false
    $(document).on('click', '#addLink', function() {
      if(!isOpen) {
        $(this).html('')
        $(this).append(
          $('<div></div>')
            .addClass('row mb-1')
            .append(
              $('<label></label>').addClass('col').text('Name'),
              $('<input>')
                .addClass('form-control col-10')
                .attr({ type: 'text', id: 'tab-name', placeholder: 'Name' })
            ),
          $('<div></div>')
            .addClass('row mb-1')
            .append(
              $('<label></label>').addClass('col').text('Link'),
              $('<input>')
                .addClass('form-control col-10')
                .attr({ type: 'text', id: 'tab-link', placeholder: 'https://www.example.com' })
            ),
          $('<div></div>')
            .addClass('row mb-1')
            .append(
              $('<label></label>').addClass('col').text('Image URL'),
              $('<input>')
                .addClass('form-control col-10')
                .attr({ type: 'text', id: 'img-upload', placeholder: 'https://www.example.com/image.png' })
            ),
          $('<div></div>')
            .addClass('row mb-1')
            .append(
              $('<div></div>').addClass('col'),
              $('<button></button>')
                .addClass('btn btn-primary btn-block mb-3 col-10')
                .attr({ type: 'button', id: 'submit-tab-info' })
                .text('Add')
            )
        )
        isOpen = true
      }
    })

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
        isOpen = false
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
