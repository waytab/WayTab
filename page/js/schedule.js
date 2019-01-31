export default class Schedule {
  constructor() {
    this.loadClasses()
    this.addClass()
    this.removeClass()
    this.controlFlow()
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
        $('#sched-title').append('<a href="#create-schedule" data-toggle="modal" class="btn btn-primary ml-5">Edit</a>')
        $('#create-schedule .modal-title').text('Edit Schedule')
        this.scheduleEditor()
      }
    })
  }

  loadSchedule(schedule) {
    $('#schedule-table').remove()
    $('#schedule').append(`
      <table class="table table-bordered mb-0" id="schedule-table" style="table-layout:fixed; width:100%; word-wrap:break-word;">
        <thead>
          <tr>
            <th scope="col" class="daySelect" data-day="A">A</th>
            <th scope="col" class="daySelect" data-day="B">B</th>
            <th scope="col" class="daySelect" data-day="C">C</th>
            <th scope="col" class="daySelect" data-day="D">D</th>
            <th scope="col" class="daySelect" data-day="E">E</th>
            <th scope="col" class="daySelect" data-day="F">F</th>
            <th scope="col" class="daySelect" data-day="G">G</th>
            <th scope="col" class="daySelect" data-day="H">H</th>
          </tr>
        </thead>
        <tbody id="schedule-body"></tbody>
      </table>
    `)
    let dayArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    for(let i = 0; i < schedule.length; i++) {
      $('#schedule-body').append(`<tr data-per="${i+1}"></tr>`)
      for(let j = 0; j < schedule[i].length; j++) {
        let currLetter = dayArr[j]
        $(`[data-per=${i+1}]`).append(`<td class="daySelect text-center" data-day="${currLetter}">${schedule[i][j]}</td>`)
      }
    }
  }

  scheduleEditor() {
    let loadFunc = this.loadSchedule;
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
      location.reload();
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

  loadClasses() {
    $('#edit-classes').empty()
    chrome.storage.sync.get(['classes'], function({classes}) {
      console.log(classes)
      if (typeof classes !== 'undefined') {
        for (let i = 0; i < classes.length; i++) {
          let obj = classes[i]
          $('#edit-classes')
            .append($('<li></li>')
              .addClass('list-group-item d-inline-flex')
              .append(
                $('<a></a>')
                  .attr({
                    role: 'button',
                    tabindex: 0
                  })
                  .popover({
                    trigger: 'focus',
                    html: true,
                    title: 'Confirm',
                    content: `<button class="btn btn-danger delete-class" data-num="${i}">Delete</button>`
                  })
                  .css({ 'margin-left': 6, 'margin-right': 22, color: 'black', 'text-decoration': 'none', cursor: 'pointer' })
                  .html('&times;'),
                $('<div></div>').text(obj)
              )
            )
        }
        $('#edit-classes')
          .append($('<li></li>')
            .addClass('list-group-item')
            .css('cursor', 'pointer')
            .attr('id', 'addClass')
            .html('<span class="font-weight-bold"><span style="margin-left: 6px; margin-right: 22px;">&plus;</span>Add Custom Class...</span>')
          )
      }
    })
  }
  
  removeClass() {
    $(document).on('click', '.delete-class', (e) => {
      let target = $(e.target)
      let targetLink = target.data('num')
      chrome.storage.sync.get(['classes'], ({classes}) => {
        classes.splice(targetLink, 1)
        chrome.storage.sync.set({classes}, () => { this.loadClasses(classes) })
      })
    })
  }
  
  addClass() {
    let isOpen = false
    $(document).on('click', '#addClass', function() {
      if(!isOpen) {
        $(this).html('')
        $(this).append(
          $('<div></div>')
            .addClass('row mb-1')
            .append(
              $('<label></label>').addClass('col').text('Class Name'),
              $('<input>')
                .addClass('form-control col-10')
                .attr({ type: 'text', id: 'class-name', placeholder: 'Name' })
            ),
            $('<div></div>')
              .addClass('row mb-1')
              .append(
                $('<div></div>').addClass('col'),
                $('<button></button>')
                  .addClass('btn btn-primary btn-block mb-3 col-10')
                  .attr({ type: 'button', id: 'submit-class-info' })
                  .text('Add')
              )
          )
        isOpen = true
      }
    })
  
    $(document).on('click', '#submit-class-info', () => {
      let name = $('#class-name').val()
  
      classesArray = []
      if(name.length > 0) {
        let classesLoad = this.loadClasses
        chrome.storage.sync.get(['classes'], function({classes}) {
          isOpen = false
          if(typeof classes != 'undefined') {
            classesArray.push(...classes)
          }
          classesArray.push(name)
          chrome.storage.sync.set({classes: classesArray}, () => { classesLoad(classes) })
        })
      } else {
        $('#submit-class-info')
          .addClass('btn-danger')
          .text('Class name cannot be empty')
  
        setTimeout(() => {
          $('#submit-class-info')
            .removeClass('btn-danger')
            .text('Add')
        }, 1000)
      }
    })
  }

  controlFlow() {
    $(document).on('click', '#show-sched', () => {
      $('#sched-container').css('width', '100%')
    })

    $(document).on('click', '#close-sched', (e) => {
      e.preventDefault()
      $('#sched-container').css('width', '0px')
    })
  }
}