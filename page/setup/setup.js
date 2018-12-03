let currentTab = 0
let tabList = ['welcome', 'personalize', 'links', 'schedule']

$(document).ready(() => {
  $('#setupModal').modal({
    backdrop: false,
    keyboard: false
  })
})

//#region window functions
$(document).on('click', '#next', () => {
  currentTab++
  let nextTab = $(`#${tabList[currentTab]}-tab`)
  nextTab.removeClass('disabled')
  nextTab.tab('show')

  if(currentTab > 0) {
    $('#back').removeClass('d-none')
  }
  
  if(currentTab + 1 == tabList.length) {
    $('#next span').text('Finish')
  }
})

$(document).on('click', '#back', () => {
  if(currentTab > 0) {
    currentTab--
    let nextTab = $(`#${tabList[currentTab]}-tab`)
    nextTab.tab('show')
  }

  if(currentTab == 0) {
    $('#back').addClass('d-none')
  }

  if (currentTab + 1 != tabList.length) {
    $('#next span').text('Next')
  }
})

$(document).on('click', '[data-toggle="tab"]', function () {
  currentTab = tabList.indexOf($(this).attr('href').substring(1))
  if(currentTab == 0) {
    $('#back').addClass('d-none')
  }

  if (currentTab + 1 == tabList.length) {
    $('#next span').text('Finish')
  } else if (currentTab + 1 != tabList.length) {
    $('#next span').text('Next')
  }
})
//#endregion

$(document).on('click', '#skip', (e) => {
  e.preventDefault()
  chrome.storage.sync.set({setup: true}, () => {
    document.location.pathname = '/page/tab.html'
  })
})

//#region personalization
  //#region background
  $(document).on('change', '#select-background', () => {
    let sel = $('#select-background').val()
    if (sel != 'Custom...') {
      let href = '../img/' + sel.toLowerCase() + '.jpg'
      $(document.body).css('background-image', `url("${href}")`)
      $('#custom-background').css('display', 'none')
    } else {
      $('#custom-background').css('display', 'flex')
    }
  })

  $(document).on('change paste keyup', '#custom-background-input', () => {
    let val = $('#custom-background-input').val()
    if (val.match(this.urlRegEx)) {
      $(document.body).css('background-image', `url("${val}")`)
    } else if (this.rgbRegEx.test(val) || this.rgbaRegEx.test(val) || this.hexRegEx.test(val)) {
      $(document.body).attr('style', `background-color: ${val}`)
    } else {
      console.log('not a valid color');
    }
  })
  //#endregion
  //#region fonts
  $(document).on('change', '#fontSelect', (e) => {
    $('body').attr('class', '')
    $('body').addClass(`font-${e.currentTarget.value}`)
  })
  //#endregion

//#endregion
//#region links
$(function () {
  chrome.storage.sync.get(['links'], ({links}) => {
    $('#edit-links').empty()
    console.log(links)
    for (let i = 0; i < links.length; i++) {
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
              .attr('data-edit', i)
              .text(links[i].name)
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

    $(document).on('click', '.link-edit', (e) => {
      let index = $(e.target).attr('data-edit')
      $(e.target)
        .text('')
        .append(
          $('<input>')
            .addClass('form-control')
            .attr('placeholder', 'Name')
            .val(links[index].name),
          $('<input>')
            .addClass('form-control')
            .attr('placeholder', 'URL')
            .val(links[index].actual_link),
          $('<input>')
            .addClass('form-control')
            .attr('placeholder', 'Image URL')
            .val(links[index].image_link)
        )
    })

    $(document).on('click', '#addLink', function () {
      $(this).html('')
      $(this).attr({id: '', style: ''}).addClass('new-link')
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
        )
      $('#edit-links')
        .append($('<li></li>')
          .addClass('list-group-item')
          .css('cursor', 'pointer')
          .attr('id', 'addLink')
          .html('<span class="font-weight-bold"><span style="margin-left: 6px; margin-right: 22px;">&plus;</span>Add Link...</span>')
        )
    })
  })
})
//#endregion
//#region schedule
$(document).on('change paste keyup', '.period-control', function() {
  if($('#customCheck1').is(':checked')) {
    let input = $(this)
    let period = input.data('period')
    $(`[data-period=${period}]`).each(function() {
      $(this).val(input.val())
    })
  }
})
$(document).on('focus', '.form-control', function() {
  if($('#customCheck1').is(':checked')) {
    let period = $(this).data('period')
    $(`[data-period=${period}]`).each(function() {
      $(this).addClass('now')
    })
  }
})
$(document).on('focusout', '.form-control', function() {
  if($('#customCheck1').is(':checked')) {
    let period = $(this).data('period')
    $(`[data-period=${period}]`).each(function() {
      $(this).removeClass('now')
    })
  }
})
//#endregion