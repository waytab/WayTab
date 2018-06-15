let tasks = {}
$(document).ready(() => {
  loadTasks()

  $(document).on('click', '#addTask', function() {
    let button = $(this)
    let task = $('#newTask')
    let classSelector = $('#addTaskClass')
    console.log(button)
    if(task.val() == '') {
      console.log(task)
      button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
      task.toggleClass('is-invalid')
      button.text('No task!')
      setTimeout(() => {
        button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
        task.toggleClass('is-invalid')
        button.text('Add')
      }, 1000)
    } else if(classSelector.val() == 'Class...') {
      console.log(classSelector)
      button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
      classSelector.toggleClass('is-invalid')
      button.text('No class selected!')
      setTimeout(() => {
        button.toggleClass('btn-danger').toggleClass('btn-outline-secondary')
        classSelector.toggleClass('is-invalid')
        button.text('Add')
      }, 1000)
    } else {
      console.log(classSelector.val())
      tasks[classSelector.val()].push(task.val())
      console.log(Object.keys(tasks).length)
      chrome.storage.sync.set({tasks: tasks}, function() {
        console.log('new tasks saved!')
        loadTasks()
      })
    }
  })

  $(document).on('click', '#undo-task-delete', function() {
    let taskArray = $(this).data('task').split(',')
    console.log(taskArray)
    tasks[taskArray[0]].push(taskArray[1])
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
                    .text(tasks[key][i])
                    .attr('for', `check${key.replace(' ', '_') + i}`)
                  )
                )
            }
          }
        }
      }

      $('[data-del]').on('change paste keyup', function() {
        let button = $(this)
        let target = button.data('del')
        let index = tasks[button.data('class').replace('_', ' ')].indexOf($(`#${target} label`).text())
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
