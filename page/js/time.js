let sched
let block
let bell2
chrome.storage.sync.get( ['bell2'], function(res) {
  bell2 = res.bell2
  if(res.bell2) {
    $('#bell-2-check').prop('checked', true)
  }else {
    $('#bell-2-check').prop('checked', false)
  }
})
$.getJSON('js/json/config.json', (data) => { sched = data.bell_schedule, displayTime() })

hoverController()
bellTwoController()

$(document).ready( () => {
  block = getCurrentBlock()
})

setInterval(timeController, 1000)

function timeController() {
  displayTime()
  barController()
}

function displayTime() {
  let currentTime = moment().format('h:mm:ss a')

  try {
    $('#time-container').text(block.name + ' | ' + currentTime)
    if(moment().diff(moment(block.end, 'hmm')) <= 0) {
      if(bell2) {
        block = sched['3'][getSoonestIndex('3')]
      }else {
        block = getCurrentBlock()
      }
    }
  } catch(e) {
  }
}

function barController() {
  let elapsed = moment().diff(moment(block.end, 'hmm')) / 1000 / 60
  let percentElapsed = 100 - (-1 * elapsed / block.length) * 100

  $('#time-bar-elapsed').css('width', percentElapsed + '%')
  $('#percent-container').text('Ends at ' + moment(block.end, 'hmm').format('HH:mm') + ' | ' + parseInt(percentElapsed) + '% elapsed')
  $('#time-container').css('color', percentElapsed <= 50 ? 'black' : 'white')
}

function bellTwoController() {
  $('#bell-2-check').change( function() {
    if(this.checked) {
      bell2 = true
      chrome.storage.sync.set( {'bell2': true}, function() {
        console.log('bell 2 enabled')
      })
      block = sched['3'][getSoonestIndex('3')]
    }else {
      bell2 = false
      chrome.storage.sync.set( {'bell2': false}, function() {
        console.log('bell 2 disabled')
      })
      block = getCurrentBlock()
    }
  })
}

function hoverController() {
  let bar = document.getElementById('time-bar-total');
  let percentContainer = document.getElementById('percent-container')
  bar.onmouseover = function() {
    percentContainer.style.display = 'block';
  }
  bar.onmouseout = function() {
    percentContainer.style.display = 'none';
  }


  percentContainer.onmouseover = function() {
    percentContainer.style.display = 'block';
  }
  percentContainer.onmouseout = function() {
    percentContainer.style.display = 'none';
  }
}

function getCurrentBlock() {
  return sched[getTodaySchedule()][getSoonestIndex(getTodaySchedule())]
}

function getTodaySchedule() {
  switch(moment().format('e')) {
    case 0:
      return 4
      break
    case 3:
      return 3
      break
    case 6:
      return 4
      break
    default:
      return 1
      break
  }
}

function getSoonestIndex(todaySchedule) {
  let bell = sched[todaySchedule]
  let currentMin = Number.MAX_SAFE_INTEGER
  let ret = 0
  for(i = 0; i < bell.length; i++) {
    let diff = moment().diff(moment(bell[i].start, 'hmm'))
    if(diff > 0 && diff <= currentMin) {
      ret = i
      currentMin = diff
    }
  }
  return ret
}
