let currentTab = 0
let tabList = ['about', 'personalize', 'links', 'schedule']

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

  $(`#${tabList[currentTab]}-tab`).tab('show')
})

$(document).on('click', '[data-toggle="tab"]', function () {
  console.log($(this));
  currentTab = tabList.indexOf($(this).attr('href').substring(1))
})