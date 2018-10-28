export default class Schedule {
  constructor() {
    chrome.storage.sync.get(['schedule'], (result) => {
      if(Object.keys(result).length === 0 && result.constructor === Object) {
        $('#schedule-table').remove()
        $('#schedule').append($('<a href="#create-schedule" data-toggle="modal" class="btn btn-primary">Create</a>'))
        this.scheduleEditor()
      } else {
        this.loadSchedule(result.schedule)
        let letterDays = 'ABCDEFGH'
        for(let i = 0; i < result.schedule.length; i++) {
          for(let j = 0; j < letterDays.length; j++) {
            let sel = letterDays.substring(j, j+1) + (i + 1)
            $(`#${sel}`).val(result.schedule[i][j])
          }
        }
        $('#schedule .card-title').append('<a href="#create-schedule" data-toggle="modal" class="btn btn-primary btn-sm float-right">Edit</a>')
        $('#create-schedule .modal-title').text('Edit Schedule')
        this.scheduleEditor()
      }
    })
  }

  loadSchedule(schedule) {
    $('#schedule-table').remove()
    $('#schedule').append(`
      <table class="table table-bordered mb-0" id="schedule-table">
        <thead>
          <tr>
            <th scope="col">A</th>
            <th scope="col">B</th>
            <th scope="col">C</th>
            <th scope="col">D</th>
            <th scope="col">E</th>
            <th scope="col">F</th>
            <th scope="col">G</th>
            <th scope="col">H</th>
          </tr>
        </thead>
        <tbody id="schedule-body"></tbody>
      </table>
    `)
    for(let i = 0; i < schedule.length; i++) {
      $('#schedule-body').append(`<tr data-per="${i+1}"></tr>`)
      for(let j = 0; j < schedule[i].length; j++) {
        $(`[data-per=${i+1}]`).append(`<td>${schedule[i][j]}</td>`)
      }
    }
  }

  scheduleEditor() {
    let loadFunc = this.loadSchedule
    $(document).on('click', '#new-schedule-save', function() {
      let schedule = []
      chrome.storage.sync.set({schedule: []}, console.log('Schedule Cleared')) // make sure we start with a clean sync to prevent double schedules
      chrome.storage.sync.set({classes: []}, console.log('Class list cleared'))
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
        loadFunc(schedule)
        let classes = [...new Set(schedule[0].concat(schedule[1].concat(schedule[3].concat(schedule[4]))))] // filter for single occurances of classes in schedule
        classes = classes.filter((v) => { return v != '' }).sort() // filter for frees
        for(let i = 0; i < classes.length; i++) {
          classes[i] = classes[i].replace(/[|&;$%@"<>()+,]/g, '')
        }
        chrome.storage.sync.set({classes: classes}, function() {
          console.log('Class list saved!')
        })
      })
      location.reload()
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
}
