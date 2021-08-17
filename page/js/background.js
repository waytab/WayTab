export default class Background {

  constructor() {
    // we want to make these regex's accessible anywhere in the class
    this.urlRegEx = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi); // will match for URLs
    this.rgbRegEx = new RegExp(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/) // rgb regex
    this.rgbaRegEx = new RegExp(/rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/) // rgba regex
    this.hexRegEx = new RegExp(/#[\da-f]/i) // hex regex

    chrome.storage.sync.get(['background'], ({background}) => {
      console.log(background)
      if(background == undefined) {
        // if we haven't specifically set the background, we'll fallback to the default
        document.querySelector('body').style.backgroundImage = 'url("./img/school.jpg")'
      } else if(background.match(this.urlRegEx)) {
        // okay, so we've set the background to some URL. great. so show us the background, thx
        document.querySelector('body').style.backgroundImage = `url("${background}")`
        document.querySelector('#time-bar-total').style.opacity = 0.8
        if(!background.indexOf('./img/')) {
          let sel = background.split('/')
          let name = sel[2].substring(0, sel[2].length-4)
          name = name.substring(0,1).toUpperCase() + name.substring(1)
          document.querySelector('#select-background').value = name
        } else { // it's a custom url
          document.querySelector('#select-background').value = 'Custom...'
          document.querySelector('#custom-background').style.display = 'flex'
          document.querySelector('#custom-background-input').value = background
        }
      } else { // we know it's a custom, non-image background
        document.querySelector('#select-background').value = 'Custom...'
        document.querySelector('#custom-background').style.display = 'flex'
        document.querySelector('#custom-background-input').value = background
        if (this.rgbRegEx.test(background) || this.rgbaRegEx.test(background) || this.hexRegEx.test(background)) {
          document.querySelector('body').style.backgroundColor = background
        }
      }
    })

    document.addEventListener('change', e => {
      if(e.target.id == '#select-background') {
        let sel = document.querySelector('#select-background').value
        if(sel != 'Custom...') {
          let href = './img/' + sel.toLowerCase() + '.jpg'
          document.querySelector('body').setAttribute('style', `background-image: url(${href})`)
          document.querySelector('#custom-background').style.display = 'none'
        } else {
          document.querySelector('#custom-background').style.display = 'flex'
        }
      }
    })

    document.addEventListener('change paste keyup', e => {
      if(e.target.id == '#custom-background-input') {
        let val = e.target.value
        if(val.match(this.urlRegEx)) {
          document.querySelector('body').style.backgroundImage = `url(${val})`
        } else if (this.rgbRegEx.test(val) || this.rgbaRegEx.test(val) || this.hexRegEx.test(val)) {
          document.querySelector('body').style.backgroundColor = val
        } else {
          console.warn('background.js (60): User did not input a valid color!')
        }
      }
    })

    document.addEventListener('click', e => {
      if(e.target.id == '#settings-close') {
        let sel = document.querySelector('#select-background').value
        let bgVal

        if(sel != 'Custom...') {
          bgVal = './img/' + sel.toLowerCase() + '.jpg'
        } else {
          bgVal = document.querySelector('#custom-background-input').value
        }

        chrome.storage.sync.set({background: bgVal}, res => {})
      }
    })
  }
}
