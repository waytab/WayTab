let DateTime = luxon.DateTime

export default class Time {
  constructor() {
    this.block
    this.display
    this.elapsedFormat
    this.letter
    this.sched

    fetch('./js/json/config.json')
      .then(response => response.json())
      .then(data => {
        chrome.storage.sync.get(['bell2'], ({bell2}) => {
          document.querySelector('#bell-2-check').setAttribute('checked', bell2)
          this.setSched(data, bell2)
          this.displayTime()
          this.updateBlock()
        })
      })
      .catch(error => {
        console.log('%ctime.js line:17 error fetching schedule!', 'color: #007acc;', error)
      })
      
    chrome.storage.sync.get(['elapseForm'], ({elapseForm}) => {
      this.elapsedFormat = elapseForm
      document.querySelector('#time-elapsed').value = elapseForm
    })
    console.log('%ctime.js line:33 this', 'color: #007acc;', this);
    this.cycleDay()
  }

  updateBlock() {
    let dayNum = parseInt(DateTime.now().toFormat('c'))
    this.block = this.getCurrentBlock()
    console.log('%ctime.js line:36 this.block', 'color: #007acc;', this.block);
    if(dayNum !== 0 && dayNum !== 6) this.highlightBlock()
    console.log('%ctime.js line:36 this.block', 'color: #007acc;', this.block);
    this.barController()
  }

  // displays the current time in the top bar
  // also displays letter day and current block, if applicable (see logic below)
  displayTime() {
    let dayNum = new Date().getDay()
    let frmt = new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short'
    })

    if((dayNum !== 0 && dayNum !== 6) && this.letter !== undefined) {
      console.log('%ctime.js line:48 this.display', 'color: #007acc;', this.display);
      document.querySelector('#time-display').textContent = `${frmt.format(Date.now())} | ${this.letter} Day ${(this.display !== undefined ? '| ' + this.display : '')}`
    } else if((dayNum !== 0 && dayNum !== 6) && this.letter == undefined) {
      document.querySelector('#time-display').textContent = `${frmt.format(Date.now())} ${(this.display !== undefined ? '| ' + this.display : '')}`
    } else if(this.letter == undefined) {
      document.querySelector('#time-display').textContent = `${frmt.format(Date.now())}`
    } else {
      document.querySelector('#time-display').textContent = `${frmt.format(Date.now())} | ${this.letter} Day`
    }
  }

  setSched(data, bell2) {
    if(bell2) {
      this.sched = data.bell_2
    } else {
      switch(new Date().getDay()) {
        case '0':
        case '6': // putting these two cases together acts kinda like ||     SEE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch#what_happens_if_i_forgot_a_break
          this.sched = data.bell_4
          break
        case '3':
          this.sched = data.bell_3
          break
        default:
          this.sched = data.bell_1
          break
      }
    }
  }

  highlightBlock() {
    this.display = this.block.name
    //document.querySelector('.now').classList.remove('now')
    if(this.block.name.includes('Block')) {
      let actualBlock = parseInt(this.block.name.substring(this.block.name.length - 1))
      if(actualBlock <= 6) {
        if(this.letter !== undefined) {
          let child = document.querySelector(`[data-per="${actualBlock}"] > [data-day="${letter}"]`)
          child.classList.add('now')
          // Set block name
          let temp = child.textContent
          if(temp.length <= 0) temp = 'Free'
          this.display = this.display.replace('Block ' + actualBlock, temp)
        } else {
          document.querySelector(`[data-per="${actualBlock}"]`).classList.add('now')
        }
      }
    } else {
      //document.querySelector(`th[data-day="${this.letter}"]`).classList.add('now')
    }
  }

  cycleDay() {
    let dayNum = new Date().getDay()
    let potentialDays = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A']
    chrome.storage.sync.get('day', ({day: data}) => {
      console.log('%ctime.js line:95 data', 'color: #007acc;', data)
      try {
        let dayDiff = DateTime.now().diff(DateTime.fromISO(data[1]), 'days').toObject()
            dayDiff = Math.floor(dayDiff.days)
        if(dayDiff > 0 && dayNum > 1) {
          let nextDay = 1 + potentialDays.findIndex(el => el == data[0])
          this.letter = this.colToLetter(nextDay)
          chrome.storage.sync.set({'day': [this.letter, DateTime.now().toFormat('yyyy-LL-dd')]})
        } else {
          this.letter = data[0]
        }
      } catch (e) {
        if(e.message.indexOf('TypeError: Cannot read property \'1\' of undefined')) {
          console.log('The following is a non-error and is probably linked to there not being a selected day on the schedule.')
          console.warn(e)
        } else console.error(e)
      }
    })
  }

  getCurrentBlock() {
    return this.sched[this.getSoonestIndex()]
  }

  getSoonestIndex() {
    let bell = this.sched
    let currentMin = Number.MAX_SAFE_INTEGER
    let ret = 0
    for(let i = 0; i < bell.length; i++) {
      let diff = DateTime.now().diff(DateTime.fromFormat(bell[i].start, 'hmm'), 'minutes').toObject().minutes
      if(diff > 0 && diff <= currentMin) {
        ret = i
        currentMin = diff
      }
    }
    return ret
  }

  daySelectionController() {}

  barController() {
    let periodLength = DateTime.fromFormat(this.block.end, 'hmm').diff(DateTime.fromFormat(this.block.start, 'hmm'), 'minutes').toObject().minutes
    let elapsed = DateTime.now().diff(DateTime.fromFormat(this.block.end, 'hmm'), 'minutes').toObject().minutes
    let percentElapsed = 100 - (-1 * elapsed / periodLength) * 100

    console.log('%ctime.js line:152 periodLength', 'color: #007acc;', periodLength);
    console.log('%ctime.js line:153 elapsed', 'color: #007acc;', elapsed);
    console.log('%ctime.js line:154 percentElapsed', 'color: #007acc;', percentElapsed);

    document.querySelector('#time-bar-elapsed').style.width = percentElapsed + '%'
  }

  letterToCol(day) {
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
  
  colToLetter(col) {
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
      case 8:
        return 'A'
        break
      default:
        return 'Z'
        break
    }
  }
}
