$(document).ready(function() {
  chrome.storage.sync.get(['schedule'], function(result) {
    if(result.schedule.length === undefined || result.schedule.length == 0) {
      $('#schedule-table').remove()
      $('#schedule').append($('<a href="#create-schedule" data-toggle="modal" class="btn btn-primary">Create</a>'))
      scheduleEditor()
    } else {
      loadSchedule(result.schedule)
      let letterDays = 'ABCDEFGH'
      for(let i = 0; i < result.schedule.length; i++) {
        for(let j = 0; j < letterDays.length; j++) {
          let sel = letterDays.substring(j, j+1) + (i + 1)
          console.log(sel)
          $(`#${sel}`).val(result.schedule[i][j])
        }
      }
      $('#schedule .card-title').append('<a href="#create-schedule" data-toggle="modal" class="btn btn-primary btn-sm float-right">Edit</a>')
      scheduleEditor()
    }
  })
})

function loadSchedule(schedule) {
  $('#schedule-body').html('')
  for(let i = 0; i < schedule.length; i++) {
    $('#schedule-body').append(`<tr data-per="${i+1}"></tr>`)
    for(let j = 0; j < schedule[i].length; j++) {
      $(`[data-per=${i+1}]`).append(`<td>${schedule[i][j]}</td>`)
    }
  }
}

function scheduleEditor() {
  $(document).on('click', '#new-schedule-save', function() {
    let schedule = []
    chrome.storage.sync.set({schedule: []}, console.log('Schedule Cleared')) // make sure we start with a clean sync to prevent double schedules
    $('#new-schedule-body').children('tr').each(function() {
      let row = $(this)
      let per = $(this)[0].id.substring(1, 2)
      let rowArr = []
      row.children('td').each(function() {
        let col = $(this).children()[0]
        let letter = col.id.substring(0, 1)
        rowArr.push(col.value.length > 0 ? col.value : '')
      })
      schedule.push(rowArr)
    })
    chrome.storage.sync.set({schedule: schedule}, function() {
      $('#new-schedule-save').toggleClass('btn-success').text('Schedule Saved!')
      window.setTimeout(function() {
        $('#create-schedule').modal('hide')
        $('#new-schedule-save').toggleClass('btn-success').text('Save Schedule')
      }, 500)
      loadSchedule(schedule)
    })
  })

  $(document).on('change paste keyup', '.period-control', function() {
    if($('#customCheck1').is(':checked')) {
      let input = $(this)
      let period = input.data('period')
      $(`[data-period=${period}]`).each(function() {
        $(this).val(input.val())
      })
    }
  })
}
