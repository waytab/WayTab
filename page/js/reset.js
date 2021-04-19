resetController()

function resetController() {
  hardResetTasks()
  hardResetSchedule()
  hardResetWaytab()
}

function hardResetTasks() {
  // the element we want to listen to doesn't exist in the DOM tree yet, so in order to listen for it, we actually need to listen to the ENTIRE tree
  document.addEventListener('click', e => {
    // NOW we can listen to the actual element, in this case #force-reset-tasks
    if(e.target.id == 'force-reset-tasks') {
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
      document.querySelector('#taskList').innerHTML = ''
    }
  })
}

function hardResetSchedule() {
  document.addEventListener('click', e => {
    if(e.target.id == 'force-reset-schedule') {
      chrome.storage.sync.set({schedule: {}}, () => {})
      document.querySelector('#schedule-table').outerHTML = ''
    }
  })
}

function hardResetWaytab() {
  document.addEventListener('click', e => {
    if(e.target.id == 'force-reset-waytab') {
      chrome.storage.sync.clear(() => {
        chrome.storage.sync.set({
          title: 'WayTab',
          font: 'default',
          enableWspn: true,
          setup: false,
          background: './img/school.jpg',
          elapseForm: 'Time'
        }, () => {
          location.reload()
        })
      })
    }
  })
}
