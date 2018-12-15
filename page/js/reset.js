resetController()

function resetController() {
  hardResetTasks()
  hardResetSchedule()
  hardResetWaytab()
}

function hardResetTasks() {
  $(document).on('click', '#force-reset-tasks', function() {
    chrome.storage.sync.get('tasks', function({tasks}) {
      if(tasks !== null) {
        Object.keys(tasks).forEach( function(obj) {
          // I console log all of the task NAMES so that they can re-enter assignments after the reset
          console.log(obj + ":")
          for(i = 0; i < this.length; i++) {
            console.log(this[i][0])
          }
          console.log('-----')
        })
      }
    })
    chrome.storage.sync.set({tasks: {}}, function() {
    })
    $('#taskList').empty()
  })
}

function hardResetSchedule() {
  $(document).on('click', '#force-reset-schedule', function() {
    chrome.storage.sync.set({schedule: {}}, function() {
    })
    $('#schedule-table').remove()
  })
}

function hardResetWaytab() {
  $(document).on('click', '#force-reset-waytab', function() {
    chrome.storage.sync.clear(() => {
      chrome.storage.sync.set({
        title: 'WayTab',
        font: 'default',
        enableWspn: true,
        setup: false,
        background: './img/school.jpg'
      }, () => {
        location.reload()
      })
    })
  })
}

// settings button / action menu
let opened = false
let startWidth
setTimeout(() => { startWidth = $('.fab-action').outerWidth(), $('.fab-action').css('width', startWidth + 'px') }, 100) // we need the font to load before we grab the button's width
$(document).on('click', '#activate-settings', (e) => {
  console.log(startWidth)
  //animate
  $('.fab-action').toggleClass('shown')

  $({ deg: 0 }).animate({ deg: 180 }, {
    duration: 250,
    step(deg) {
      $('#activate-settings i').css('transform', `rotate(${deg}deg)`)
    }
  })
  setTimeout(() => { $('#activate-settings i').toggleClass('fa-times') }, 125)

  if(!opened) {
    $('.fab-action').animate({
      width: 200
    }, 250)

    $('#activate-settings span').text('Close')

    opened = true
  } else {
    $('.fab-action').animate({
      width: startWidth
    }, 250)

    $('#activate-settings span').text('Settings')

    opened = false
  }
})
