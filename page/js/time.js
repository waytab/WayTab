let sched
let block
$.getJSON('js/json/config.json', (data) => { sched = data.bell_schedule, displayTime() })

hoverController()

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
  $('#time-container').text(block.name + ' | ' + currentTime)

  console.log(getTodaySchedule())

  if(moment().diff(moment(block.end, 'hmm')) <= 0) {
    block = getCurrentBlock()
  }
}

function barController() {
  let elapsed = moment().diff(moment(block.end, 'hmm')) / 1000 / 60
  let percentElapsed = 100 - (-1 * elapsed / block.length) * 100

  $('#time-bar-elapsed').css('width', percentElapsed + '%')
  $('#percent-container').text('Ends at ' + moment(block.end, 'hmm').format('HH:mm') + ' | ' + parseInt(percentElapsed) + '% elapsed')
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
  return sched[getTodaySchedule()][getSoonestIndex()]
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

function getSoonestIndex() {
  let bell = sched[getTodaySchedule()]
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
