// these should be alphabetical...
import Background from './background.js'
import Links from './links.js'
import Schedule from './schedule.js'
import Title from './title.js'

// ...and so should these
let background = new Background()
let links = new Links()
let schedule = new Schedule()
let title = new Title()

// enable tooltips and popovers
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()
})

// this part is commented to display a general flow of how settings are loaded.
$(document).ready(function() { // we need to wait for the full document to be loaded before we start working on it
  chrome.storage.sync.get(['font'], function({font}) { // grabs the 'font' variable from chrome's storage, then passes it to an anonymous function (async)
    if(font != 'default') { // we only need to do stuff if the font isn't the default one
      $('body').addClass(`font-${font}`) // we set the body to use the saved font family
      $('#announcementsPositionSel').val(font) // we set the settings drop-down to the selected style. not required but a nice touch
    }
  })

  chrome.storage.sync.get(['setup'], ({setup}) => {
    if(!setup) {
      document.location.pathname = '/page/setup/setup.html'
    }
  })

  chrome.storage.sync.get(['dark'], ({dark}) => {
    if(dark) {
      $('body').addClass('dark')
      $('#dark-check').prop('checked', true)
    }
  })

  chrome.storage.sync.getBytesInUse(null, (r) => {
    $('#usage').text(Math.round(r/10)/100 + ' KB on sync')
  })
  chrome.storage.local.getBytesInUse(null, (r) => {
    $('#usage-local').text(Math.round(r / 10) / 100 + ' KB on local')
  })
})

$(document).on('click', '#settings-close', function() { // we need to save the new font style when the modal is closed
  chrome.storage.sync.set({
    font: $('#announcementsPositionSel').val(),
    dark: $('#dark-check').prop('checked')
  }, function() { location.reload() })
})
