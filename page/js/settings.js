
resetController()

function resetController() {
  hardResetTasks()
  hardResetSchedule()
  revealDangerZone()
}

function revealDangerZone() {
  $('#reveal-danger').change( function() {
    if(this.checked) {
      $('#danger-zone').fadeIn(2000)
    }else {
      $('#danger-zone').fadeOut()
    }
  })
}

function hardResetTasks() {
  $(document).on('click', '#force-reset-tasks', function() {
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
