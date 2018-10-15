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
})

$(document).on('click', '[data-toggle="tab"]', function () {
  currentTab = tabList.indexOf($(this).attr('href').substring(1))
  if(currentTab == 0) {
    $('#back').addClass('d-none')
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