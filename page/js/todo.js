let tasks = {}
let todoDefault

chrome.storage.sync.get(['todoDate'], function({todoDate}) {
  if (todoDate === 'Tomorrow') {
    $('#todo-tomorrow').prop('selected', true)
    $('#todo-today').prop('selected', false)
    $('#todo-week').prop('selected', false)
  } else if (todoDate === 'Today') {
    $('#todo-tomorrow').prop('selected', false)
    $('#todo-today').prop('selected', true)
    $('#todo-week').prop('selected', false)
  } else if (todoDate === 'Week') {
    $('#todo-tomorrow').prop('selected', false)
    $('#todo-today').prop('selected', false)
    $('#todo-week').prop('selected', true)
  }
})

$(document).ready(() => {
  loadTasks()
  defaultController()

  loadClasses()
  removeClasses()
  addClass()

  $(document).on('click', '#addTask', function() {
    let button = $(this)
    let task = $('#newTask')
    let classSelector = $('#addTaskClass')
    let date = $('#taskDue')
    if(task.val() == '') {
      button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
      task.toggleClass('is-invalid')
      button.text('No task!')
      setTimeout(() => {
        button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
        task.toggleClass('is-invalid')
        button.text('Add')
      }, 1000)
    } else {
      tasks[classSelector.val() == 'Class...(default to misc)' ? 'Miscellaneous' : classSelector.val()].push([task.val(), date.val()])
      chrome.storage.sync.set({tasks: tasks}, () => {
        loadTasks()
      })
    }
  })

  $(document).on('click', '#undo-task-delete', function() {
    let taskArray = $(this).data('task').split(',')
    let taskArray1 = [...taskArray] // to make sure we get a copy of the contents, not just a reference
    taskArray1.splice(0,1)
    taskArray1.splice(taskArray1.length-1, 1)
    tasks[taskArray[0]].push([taskArray1.join(), taskArray[taskArray.length-1]])
    chrome.storage.sync.set({tasks: tasks}, () => {
      $('#undo-task-delete').remove()
      loadTasks()
    })
  })
})

function loadTasks() {
  let lastTask
  chrome.storage.sync.get(['tasks'], function(result) {
    if(Object.keys(result).length === 0 && result.constructor === Object) {
      console.log('No tasks found')
    } else {
      tasks = result.tasks
      $('#taskList').empty()
      $('#newTask').val('')
      $('#taskDue').val(formatDate(new Date()))
      $('#addTaskClass').empty().append(`<option selected>Class...(default to misc)</option>`)
      for (let key in tasks) {
        if(tasks.hasOwnProperty(key)) {
          if(tasks[key].length != 0) {
            $('#taskList').append($('<h5></h5>').text(key))
            console.log(tasks[key])
            tasks[key].sort( function(a, b) {
              return -1 * (new Date(b[1]) - new Date(a[1]))
            })
            for (let i = 0; i < tasks[key].length; i++) {
              $('#newTaskSelectionGroup').addClass('mb-3')
              $('#taskList')
                .append($('<div></div>')
                  .addClass('custom-control custom-checkbox mb-2')
                  .attr('id', `${key.replace(' ', '_') + i}`)
                  .append($('<input>')
                    .attr('type', 'checkbox')
                    .addClass('custom-control-input')
                    .attr('data-del', `${key.replace(' ', '_') + i}`)
                    .attr('data-class', `${key.replace(' ', '_')}`)
                    .attr('id', `check${key.replace(' ', '_') + i}`),
                     $('<label></label>')
                    .addClass('custom-control-label')
                    .attr('id', `label${key.replace(' ', '_') + i}`)
                    .attr('for', `check${key.replace(' ', '_') + i}`)
                  )
                )
              let dueDate = new Date(tasks[key][i][1] + 'T00:00:00')
              let dueDeltaDay = Math.floor((dueDate - new Date)/(1000*60*60*24)+1)
              if(tasks[key][i][1] == '') {
                $(`#label${key.replace(' ', '_') + i}`).text(tasks[key][i][0])
              } else {
                // ddd <= 0
                // ddd < -1
                // ddd == -1
                // ddd == 0
                // ddd == 1
                // 2 <= ddd <= 14
                // ddd > 14
                $(`#label${key.replace(' ', '_') + i}`).html(tasks[key][i][0] + `<i class="far fa-clock ml-1 ${dueDeltaDay <= 0 ? 'text-danger' : ''}" id="tooltip${key.replace(' ', '_') + i}"></i>`).attr({ 'data-has-date': 'true', 'data-due-on': dueDate })
                $(`#tooltip${key.replace(' ', '_') + i}`).tooltip(tooltipBuilder(dueDate, dueDeltaDay))
                $(document).on('click', `#tooltip${key.replace(' ', '_') + i}`, (e) => {
                  e.preventDefault()
                })
              }
            }
          }
        }
      }

      $('[data-del]').on('change paste keyup', function() {
        let button = $(this)
        let target = button.data('del')
        let index
        if (!(typeof $(`#${target} label`).attr('data-has-date') !== typeof undefined && $(`#${target} label`).attr('data-has-date') !== false)) {
          index = getIndexOfArray(tasks[button.data('class').replace('_', ' ')], [$(`#${target} label`).text(), ''])
        } else {
          let dateFormatted = new Date($(`#${target} label`).attr('data-due-on'))
          dateFormatted = dateFormatted.getFullYear() + '-' + (dateFormatted.getMonth() + 1).toString().padStart(2, '0') + '-' + (dateFormatted.getDate()).toString().padStart(2, "0")
          index = getIndexOfArray(tasks[button.data('class').replace('_', ' ')], [$(`#${target} label`).text(), dateFormatted])
        }
        if(index > -1) {
          lastTask = [button.data('class').replace('_', ' '), tasks[button.data('class').replace('_', ' ')][index]]
          tasks[button.data('class').replace('_', ' ')].splice(index, 1)
          chrome.storage.sync.set({tasks: tasks}, function() {
            $('#undo-task-delete').remove()
            $('#todo .card-title').append(`<a href="" data-toggle="modal" class="btn btn-primary btn-sm float-right" id="undo-task-delete" data-task="${lastTask}">Undo</a>`)
            loadTasks()
          })
        }
      })
    }
  })

  chrome.storage.sync.get(['classes'], function(result) {
    if(Object.keys(result).length === 0 && result.constructor === Object) {
      console.log('Classes not found')
    } else {
      console.log('Class list found')
      let classes = result.classes
      for(let i = 0; i < classes.length; i++) {
        $('#addTaskClass').append($('<option></option>').attr('value', classes[i]).html(classes[i]))
        if(tasks[classes[i]] == undefined) {
          tasks[classes[i]] = []
        }
      }
    }
    $('#addTaskClass').append($('<option></option>').attr('value', 'Miscellaneous').html('Miscellaneous'))
    if(tasks['Miscellaneous'] == undefined) {
      tasks['Miscellaneous'] = []
    }
  })
}

function getIndexOfArray(origArr, newArr) {
  newArr[1].replace('/', '-')
  for(i = 0; i < origArr.length; i++) {
    if(origArr[i][0] == newArr[0]) {
      if(origArr[i][1] == newArr[1]) {
        return i
      }
    }
  }
}
// ddd < -1
// ddd == -1
// ddd == 0
// ddd == 1
// 2 <= ddd <= 14
// ddd > 14
function tooltipBuilder(date, delta) {
  let dueString
  if(delta < -1) {
    dueString = `Was due ${Math.abs(delta)} days ago`
  } else if(delta == -1) {
    dueString = `Was due yesterday`
  } else if (delta == 0) {
    dueString = `Due today`
  } else if (delta == 1) {
    dueString = `Due tomorrow`
  } else if (delta >= 2 && delta <= 14) {
    dueString = `Due in ${delta} days`
  } else if (delta > 14) {
    dueString = `Due on ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }
    return {
    title: dueString,
    placement: 'right',
    template: `<div class="tooltip ${delta <= 0 ? 'warning' : ''}" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>`
  }
}

function defaultController() {
  $('#settings-close').click( function() {
    chrome.storage.sync.set({'todoDate': $('#todo-default').val()})
  })
}

function formatDate() {
  let date = new Date()
  if(todoDefault === 'Tomorrow') {
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
    if(date.getDay() === 5) {
      date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000))
    }else if(date.getDay() === 6) {
      date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000))
    }
  }else if(todoDefault === 'Week') {
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
  }
  let month = (date.getMonth() + 1).toString().padStart(2, '0')
  let year = date.getFullYear()
  let day = (date.getDate()).toString().padStart(2, '0')

  return year + '-' + month + '-' + day
}

function loadClasses() {
  $('#edit-classes').empty()
  chrome.storage.sync.get(['classes'], function({classes}) {
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

function removeClasses() {
  $(document).on('click', '.delete-class', (e) => {
    let target = $(e.target)
    let targetLink = target.data('num')
    chrome.storage.sync.get(['classes'], ({classes}) => {
      classes.splice(targetLink, 1)
      chrome.storage.sync.set({classes}, () => { this.loadClasses(classes) })
    })
  })
}

function addClass() {
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
