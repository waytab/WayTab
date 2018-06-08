export class Todo {
  constructor() {
    this.tasks = {}
    let taskList = this.tasks;
    let taskFunc = this.loadTasks;

    taskFunc(taskList);

    $(document).on('click', '#addTask', function() {
      let button = $(this)
      let task = $('#newTask')
      let classSelector = $('#addTaskClass')
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
        taskList[classSelector.val()].push(task.val())
        chrome.storage.sync.set({tasks: tasks}, function() {
          console.log('new tasks saved!')
          taskFunc();
        })
      }
    })
  }

  loadTasks(origTasks) {
    let taskList = origTasks;
    chrome.storage.sync.get(['tasks'], function(result) {
      if(Object.keys(result).length === 0 && result.constructor === Object) {
        console.log('No tasks found')
      } else {
        taskList = result.tasks
        $('#taskList').empty()
        $('#addTaskClass').empty().append(`<option selected>Class...</option>`)
        for(let key in taskList) {
          if(taskList.hasOwnProperty(key)) {
            if(taskList[key].length != 0) {
              $('#taskList').append($('<h5></h5>').text(key))
              for(let i = 0; i < taskList[key].length; i++) {
                $('#taskList')
                  .append($('<div></div>')
                    .addClass('custom-control custom-checkbox mb-2')
                    .attr('id', `${key + i}`)
                    .append($('<input>')
                      .attr('type', 'checkbox')
                      .addClass('custom-control-input')
                      .attr('data-del', `${key + i}`)
                      .attr('data-class', `${key}`)
                      .attr('id', `check${key + i}`),
                       $('<label></label>')
                      .addClass('custom-control-label')
                      .text(taskList[key][i])
                      .attr('for', `check${key + i}`)
                    )
                  )
              }
            }
          }
        }

        $('[data-del]').on('change paste keyup', function() {
          let button = $(this)
          let target = button.data('del')
          let index = taskList[button.data('class')].indexOf($(`#${target} label`).text())
          if(index > -1) {
            taskList[button.data('class')].splice(index, 1)
            chrome.storage.sync.set({tasks: tasks}, function() {
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
        let classes = result.classes
        for(let i = 0; i < classes.length; i++) {
          $('#addTaskClass').append($('<option></option>').attr('value', classes[i]).html(classes[i]))
          if(taskList[classes[i]] == undefined) {
            taskList[classes[i]] = []
          }
        }
      }
    })
  }

}
