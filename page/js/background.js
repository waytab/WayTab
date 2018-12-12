export default class Background {

  constructor() {
    // we want to make these regex's accessible anywhere in the class
    this.urlRegEx = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi); // will match for URLs
    this.rgbRegEx = new RegExp(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/) // rgb regex
    this.rgbaRegEx = new RegExp(/rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/) // rgba regex
    this.hexRegEx = new RegExp(/#[\da-f]/i) // hex regex

    chrome.storage.sync.get(['background'], ({background}) => {
      if(background == undefined) {
        $(document.body).css('background-image', 'url("./img/school.jpg")')
      } else if(background.match(this.urlRegEx)) {
        $(document.body).css('background-image', 'url(\"'+background+'\")')
        $('#time-bar-total').css('opacity', .8)
        if(!background.indexOf('./img/')) {
          let sel = background.split('/')
          let name = sel[2].substring(0, sel[2].length-4)
          name = name.substring(0,1).toUpperCase() + name.substring(1)
          $('#select-background').val(name)
        } else { // it's a custom url
          $('#select-background').val('Custom...')
          $('#custom-background').css('display', 'flex')
          $('#custom-background-input').val(background)
        }
      } else { // we know it's a custom, non-image, background
        $('#select-background').val('Custom...')
        $('#custom-background').css('display', 'flex')
        $('#custom-background-input').val(background)
        if (this.rgbRegEx.test(background) || this.rgbaRegEx.test(background) || this.hexRegEx.test(background)) {
          $(document.body).css('background-color', background)
        }
      }
    })

    $(document).on('change', '#select-background', () => {
      let sel = $('#select-background').val()
      if(sel != 'Custom...') {
        let href = './img/' + sel.toLowerCase()+'.jpg'
        $(document.body).css('background-image', `url("${href}")`)
        $('#custom-background').css('display', 'none')
      } else {
        $('#custom-background').css('display', 'flex')
      }
    })

    $(document).on('change paste keyup', '#custom-background-input', () => {
      let val = $('#custom-background-input').val()
      if(val.match(this.urlRegEx)) {
        $(document.body).css('background-image', `url("${val}")`)
      } else if (this.rgbRegEx.test(val) || this.rgbaRegEx.test(val) || this.hexRegEx.test(val)) {
        $(document.body).attr('style', `background-color: ${val}`)
      } else {
        console.log('not a valid color');
      }
    })

    $(document).on('click', '#settings-close', () => {
      let sel = $('#select-background').val()
      let bgVal;
      if (sel != 'Custom...') {
        bgVal = './img/' + sel.toLowerCase()+'.jpg'
      } else {
        bgVal = $('#custom-background-input').val()
      }
      chrome.storage.sync.set({background: bgVal}, function(response) {})
    })
  }
}
