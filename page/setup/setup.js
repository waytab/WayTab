let currentTab = 0
let tabList = ['welcome', 'personalize', 'links', 'schedule']

let startingLinks = 

$(document).ready(() => {
  $('#setupModal').modal({
    backdrop: false,
    keyboard: false
  })

  $('[data-toggle="popover"]').popover()
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

  if(currentTab + 1 > tabList.length) { // we've hit the end of the setup...
    $('#setup-content, .modal-footer').animate({
      opacity: 0
    }, 250, () => {
      $('#setupModal .modal-dialog .modal-content').animate({
        height: 332,
        'padding-bottom': 0
      }, 500, () => {
        $('.modal-footer').remove()
        $('#setup-content').addClass('d-none')
        $('#setup-complete').removeClass('d-none')
        savePrefs()
      })
    })
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

$(document).on('click', '[data-toggle="tab"]:not(.disabled)', function () {
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
  let prevFont
  $(document).on('change', '#fontSelect', (e) => {
    if(prevFont !== undefined) {
      $('body').removeClass('font-' + prevFont)
    }
    prevFont = e.currentTarget.value
    $('body').addClass(`font-${e.currentTarget.value}`)
  })
  //#endregion

  //#region dark mode
  $(document).on('change', '#dark-check', (e) => {
    $('body').toggleClass(`dark`)
  })
  //#endregion

//#endregion
//#region links
$(function () {
  chrome.storage.sync.get(['links'], ({links}) => {
    startingLinks = links
    $('#edit-links').empty()
    for (let i = 0; i < links.length; i++) {
      $('#edit-links')
        .append($('<li></li>')
          .addClass('list-group-item d-inline-flex')
          .append(
            $('<a></a>')
              .attr({
                class: 'list-delete',
                role: 'button',
                title: 'Confirm',
                tabindex: 0
              })
              .html('&times;')
              .popover({
                trigger: 'focus',
                html: true,
                content: `<button class="btn btn-danger delete-link" data-num="${i}">Delete</button>`
              }),
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
      $(e.target).removeClass('link-edit').addClass('link-editing')
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
    
    $(document).on('click', '.delete-link', (e) => {
      let target = $(e.target)
      console.log(target.data('num'));
      startingLinks[target.data('num')] = {}
      console.log(startingLinks);
      $(`#edit-links li:nth-child(${target.data('num') +1})`).remove()
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

function savePrefs() {
  // first, let's collect all the shizz we need
  let title = $('#title-input').val().length > 0 ? $('#title-input').val() : 'WayTab'
  let background = $('#select-background').val()
  let customBackground = $('#custom-background-input').val()
  let font = $('#fontSelect').val()
  let enableWspn = $('#wspn-check').prop('checked')

  let links = getLinksAsArray()

  let schedule = getScheduleAsArray()
  let classes = getClassesArray(schedule)

  // assemble into an array
  let saveArray = {
    setup: true, //since setup has been completed
    title,
    background: background == "Custom..." ? customBackground : `./img/${background}.jpg`,
    font,
    enableWspn,
    links,
    schedule,
    classes,
    elapseForm: $('#time-elapsed').val(),
    dark: $('#dark-check').prop('checked'),
    transparent: $('#transparent-check').prop('checked')
  }

  console.log(saveArray);
  chrome.storage.sync.set(saveArray, () => {
    if (classes.length == 0) {
      chrome.storage.sync.remove(['schedule'], () => { document.location.pathname = '/page/tab.html' })
    } else {
      document.location.pathname = '/page/tab.html'
    }
  })
}

function getLinksAsArray() {
  let newLinks = [...startingLinks] // spread ensures (without a doubt) that we get a *copy* of the `startingLinks` array
  $('.new-link').each((i, e) => { // for each new link div thingy
    let newLink = {
      name: $(e).find('#tab-name').val(),
      actual_link: $(e).find('#tab-link').val(),
      image_link: $(e).find('#img-upload').val()
    }

    newLinks.push(newLink) // we push the new link object to our copied array
  })

  $('.link-editing').each((i, e) => {
    let index = $(e).data('edit')
    
    newLinks[index].name = $(e).find('input.form-control:nth-child(1)').val()
    newLinks[index].actual_link = $(e).find('input.form-control:nth-child(2)').val()
    newLinks[index].image_link = $(e).find('input.form-control:nth-child(3)').val()
  })

  return newLinks // return the modified copied array back to `savePrefs()`
}

function getScheduleAsArray() {
  let schedule = []
  $('#new-schedule-body').children('tr').each(function () {
    let row = $(this)
    let rowArr = []
    row.children('td').each(function () {
      let col = $(this).children()[0]
      rowArr.push(col.value.length > 0 ? col.value : '')
    })
    schedule.push(rowArr)
  })
  
  return schedule
}

function getClassesArray(schedule) {
  let classes = [...new Set(schedule[0].concat(schedule[1].concat(schedule[3].concat(schedule[4]))))] // filter for single occurances of classes in schedule
  classes = classes.filter((v) => { return v != '' }).sort() // filter for frees
  for (let i = 0; i < classes.length; i++) {
    classes[i] = classes[i].replace(/[|&;$%@"<>()+,]/g, '')
  }

  return classes
}
