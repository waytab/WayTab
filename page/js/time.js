var sched
let block
let letter
let elapsedFormat
let display

$.getJSON(`http://manage.waytab.org/modules/schedule/?timestamp=${moment().subtract(1, 'days').unix()}`, (data) => {
  console.log(data)
  if (data.name !== undefined && Math.abs(moment(data.date).diff(moment(), 'd')) < 1) {
    sched = data.schedule
    displayTime()
    updateBlock()
  } else {
    $.getJSON('js/json/config.json', (data) => {
      chrome.storage.sync.get( ['bell2'], function({bell2}) {
        if(bell2) {
          $('#bell-2-check').prop('checked', true)
          setTodaySchedule(data, true)
        } else {
          $('#bell-2-check').prop('checked', false)
          setTodaySchedule(data, false)
        }
        displayTime()
        updateBlock()
      })
    }).fail((err) => {
      console.log(err)
    })
  }
})

chrome.storage.sync.get(['elapseForm'], function({elapseForm}) {
  elapsedFormat = elapseForm
  $('#time-elapsed').val(elapseForm)
})

$(document).ready( function() {
  hoverController()
  bellTwoController()
  daySelectController()
  cycleDay()
  setElapsedFormat()
})

setInterval( () => {
  displayTime()
  barController()
  updateBlock()
}, 1000)

function updateBlock() {
  block = getCurrentBlock()
  highlightBlock()
  removeLetterHint()
}

function displayTime() {
  let dayNum = parseInt(moment().format('e'))
  try {
    if((dayNum !== 0 && dayNum !== 6) && letter !== undefined) {
      $('#time-container').html(`<span id="time-display">${moment().format('h:mm:ss')}</span>${moment().format('a')} | ${letter} Day | ${display}`)
    }else {
      $('#time-container').html(`<span id="time-display">${moment().format('h:mm:ss')}</span>${moment().format('a')} | ${display}`)
    }
    
  } catch(e) {
  }
}

function setElapsedFormat() {
  $(document).on('click', '#settings-close', function() {
    chrome.storage.sync.set({ 'elapseForm': $('#time-elapsed').val() })
  })
}

function setTodaySchedule(sched_data, bell2toggle) {
  if(bell2toggle) {
    sched = sched_data.bell_2
  }else {
    switch(moment().format('e')) {
      case '0':
        sched = sched_data.bell_4
        break
      case '3':
        sched = sched_data.bell_3
        break
      case '6':
        sched = sched_data.bell_4
        break
      default:
        sched = sched_data.bell_1
        break
    }
  }
}

function highlightBlock() {
  display = block.name
  $('.now').removeClass('now')
  if(block.name.includes('Block')) {
    let actualBlock = parseInt(block.name.substring(block.name.length - 1))
    if(actualBlock <= 6) {
      if(letter !== undefined) {
        let child = $(`[data-per="${actualBlock}"] > [data-day="${letter}"]`)
        child.addClass('now')
        /* Set block name */
        let temp = child.text()
        if(temp.length <= 0) temp = 'Free'
        display = display.replace('Block ' + actualBlock, temp)
      } else {
        $(`[data-per="${actualBlock}"]`).addClass('now')
      }
    }
  } else {
    $(`th[data-day="${letter}"]`).addClass('now')
  }
}

let neueBlockSet = false
const highlightBlockNeue = () => {
  if (block !== undefined && neueBlockSet !== true && block.name.includes('Block')) {
    let blockNum = parseInt(block.name.substring(block.name.length - 1))
    $(`#schedule-neue>div:nth-of-type(${blockNum})`).addClass('now-neue')
    neueBlockSet = true
  }
}

$(document).on('schedule-loaded', () => {
  setInterval(highlightBlockNeue, 1000)
})

function cycleDay() {
  let dayNum = moment().format('d')
  let potentialDays = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A']
  chrome.storage.sync.get('day', function({day: data}) {
    try {
      let dateComp = moment().format('L').split('/') // create date array
      let currDate = dateComp[2] + '-' + dateComp[0] + '-' + dateComp[1] // build moment-compatible string
      let dayDiff = moment(currDate).diff(moment(data[1]), 'days') // calculate difference in days
      if(dayDiff > 0 && dayNum > 1) {
        let nextDay = 1 + potentialDays.findIndex( function(element) {
          return element == data[0]
        })
        letter = colToLetter(nextDay)
      }else {
        letter = data[0]
        if (data.length) {
          console.log('object')
          $(document).trigger('letter-loaded', [data[0]])
        }
      }
    } catch (e) {
      if (e.message.indexOf('TypeError: Cannot read property \'1\' of undefined')) {
        console.log('The following is a non-error and is probably linked to there not being a selected day on the schedule.')
        console.log(e)
      } else console.warn(e)
    }
  })
}

function getCurrentBlock() {
  return sched[getSoonestIndex()]
}

function getSoonestIndex() {
  let bell = sched
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

function daySelectController() {
  $(document).on('click', '.daySelect', function() {
    let dateComp = moment().format('L').split('/')
    let formattedDate = dateComp[2] + '-' + dateComp[0] + '-' + dateComp[1]
    let newDay = $(this).attr('data-day')
    chrome.storage.sync.set( {'day': [newDay, formattedDate]} )
    letter = newDay
    /* Fancy selection confirmation stuff */
    $(`[data-day="${letter}"]`).toggleClass('now')
    setTimeout(() => {
      $(`[data-day="${letter}"]`).toggleClass('now')
    }, 500)
  })
}

function barController() {
  let periodLength = moment(block.end,'hmm').diff(moment(block.start,'hmm'), 'minutes')
  let elapsed = moment().diff(moment(block.end, 'hmm')) / 1000 / 60
  let percentElapsed = 100 - (-1 * elapsed / periodLength) * 100

  $('#time-bar-elapsed').css('width', percentElapsed + '%')
  $('#percent-container').text(`Ends at ${moment(block.end, 'hmm').format('h:mm a')} | ${Math.floor(percentElapsed)}% elapsed`)
  if (elapsedFormat === 'Time') {
    $('#percent-container').text(`Ends at ${moment(block.end, 'hmm').format('h:mm a')} | ${elapsed > -60 ? Math.floor(-1 * elapsed + 1) + ' minutes' : Math.floor(-1 * elapsed / 60) + ':' + Math.ceil(-1 * elapsed % 60 +1).toString().padStart(2, '0')} left`)
  }
  $('#time-container').css('color', percentElapsed <= 50 ? 'black' : 'white')
}

function bellTwoController() {
  $('#bell-2-check').change( function() {
    if(this.checked) {
      chrome.storage.sync.set( {'bell2': true}, function() {
      })
    } else {
      chrome.storage.sync.set( {'bell2': false}, function() {
      })
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

function removeLetterHint() {
  if(letter === undefined && $('#schedule-body').length !== 0) $('#letter-hint').removeClass('d-none')
}

function letterToCol(day) {
  switch(day) {
    case 'A':
      return 0
      break
    case 'B':
      return 1
      break
    case 'C':
      return 2
      break
    case 'D':
      return 3
      break
    case 'E':
      return 4
      break
    case 'F':
      return 5
      break
    case 'G':
      return 6
      break
    case 'H':
      return 7
      break
    default:
      return -1
      break
  }
}

function colToLetter(col) {
  switch(col) {
    case 0:
      return 'A'
      break
    case 1:
      return 'B'
      break
    case 2:
      return 'C'
      break
    case 3:
      return 'D'
      break
    case 4:
      return 'E'
      break
    case 5:
      return 'F'
      break
    case 6:
      return 'G'
      break
    case 7:
      return 'H'
      break
    default:
      return 'Z'
      break
  }
}
