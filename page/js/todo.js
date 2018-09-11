let tasks = {}
$(document).ready(() => {
  loadTasks()

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
    } else if(classSelector.val() == 'Class...') {
      button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
      classSelector.toggleClass('is-invalid')
      button.text('No class selected!')
      setTimeout(() => {
        button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
        classSelector.toggleClass('is-invalid')
        button.text('Add')
      }, 1000)
    } else {
      tasks[classSelector.val()].push([task.val(), date.val()])
      chrome.storage.sync.set({tasks: tasks}, function() {
        console.log('new tasks saved!')
        loadTasks()
      })
    }
  })

  $(document).on('click', '#undo-task-delete', function() {
    let taskArray = $(this).data('task').split(',')
    console.log(taskArray)
    tasks[taskArray[0]].push([taskArray[1], taskArray[2]])
    chrome.storage.sync.set({tasks: tasks}, function() {
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
      console.log(tasks)
      $('#taskList').empty()
      $('#newTask').val('')
      $('#taskDue').val('')
      $('#addTaskClass').empty().append(`<option selected>Class...</option>`)
      for(let key in tasks) {
        if(tasks.hasOwnProperty(key)) {
          if(tasks[key].length != 0) {
            $('#taskList').append($('<h5></h5>').text(key))
            for(let i = 0; i < tasks[key].length; i++) {
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
              let due;
              if(tasks[key][i][1] == '') {
                $(`#label${key.replace(' ', '_') + i}`).text(tasks[key][i][0])
              }else {
                due = tasks[key][i][1].split('-')
                $(`#label${key.replace(' ', '_') + i}`).text(tasks[key][i][0] + " | Due: " + due[1] + "/" + due[2] + "/" + due[0])
                let curr = new Date();
                if(parseInt(due[0]) == curr.getFullYear() && parseInt(due[1]) == curr.getMonth()+1 && parseInt(due[2]) == curr.getDate()) {
                  $(`#label${key.replace(' ', '_') + i}`).css('background-color', '#ffff00')
                }
              }
            }
          }
        }
      }

      $('[data-del]').on('change paste keyup', function() {
        let button = $(this)
        let target = button.data('del')
        let index;
        if(!$(`#${target} label`).text().includes(' | Due: ')) {
          index = getIndexOfArray(tasks[button.data('class').replace('_', ' ')], [$(`#${target} label`).text(), ''])
        } else {
          let labelSections = $(`#${target} label`).text().split(' | Due: ')
          let dateSections = labelSections[1].split('/')
          let dateFormatted = dateSections[2] + "-" + dateSections[0] + "-" + dateSections[1]
          index = getIndexOfArray(tasks[button.data('class').replace('_', ' ')], [labelSections[0], dateFormatted])
        }
        if(index > -1) {
          lastTask = [button.data('class').replace('_', ' '), tasks[button.data('class').replace('_', ' ')][index]]
          tasks[button.data('class').replace('_', ' ')].splice(index, 1)
          chrome.storage.sync.set({tasks: tasks}, function() {
            console.log($('#schedule .card-title'))
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
      console.log(result.classes)
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
  console.log(origArr)
  console.log(newArr)
  for(i = 0; i < origArr.length; i++) {
    if(origArr[i][0] == newArr[0]) {
      if(origArr[i][1] == newArr[1]) {
        return i
      }
    }
  }
}
