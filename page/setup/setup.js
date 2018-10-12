let currentTab = 0
let tabList = ['welcome', 'personalize', 'links', 'schedule']

$(document).ready(() => {
  $('#setupModal').modal({
    backdrop: false,
    keyboard: false
  })
})

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

$(document).on('click', '#skip', (e) => {
  e.preventDefault()
  chrome.storage.sync.set({setup: true}, () => {
    document.location.pathname = '/page/tab.html'
  })
})