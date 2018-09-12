export default class Background {

  constructor() {
    // we want to make these regex's accessible anywhere in the class
    this.urlRegEx = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi); // will match for URLs
    this.rgbRegEx = new RegExp(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/) // rgb regex
    this.rgbaRegEx = new RegExp(/rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/) // rgba regex
    this.hexRegEx = new RegExp(/#[\da-f]/i) // hex regex

    chrome.storage.sync.get(['background'], (response) => {
      console.log(this.rgbaRegEx.test(response.background));
      if(response.background.match(this.urlRegEx)) {
        $(document.body).css('background-image', 'url(\"'+response.background+'\")')
        if(!response.background.indexOf('./img/')) {
          let sel = response.background.split('/')
          let name = sel[2].substring(0, sel[2].length-4)
          name = name.substring(0,1).toUpperCase() + name.substring(1)
          $('#select-background').val(name)
        } else { // it's a custom url
          $('#select-background').val('Custom...')
          $('#custom-background').css('display', 'flex')
          $('#custom-background-input').val(response.background)
        }
      } else { // we know it's a custom, non-image, bg
        $('#select-background').val('Custom...')
        $('#custom-background').css('display', 'flex')
        $('#custom-background-input').val(response.background)
        if (this.rgbRegEx.test(response.background) || this.rgbaRegEx.test(response.background) || this.hexRegEx.test(response.background)) {
          $(document.body).css('background-color', response.background)
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
      } else if (val.match(this.rgbRegEx)) {
        $(document.body).css('background-color', val)
      } else if (val.match(this.rgbaRegEx)) {
        $(document.body).css('background-color', val)
      } else if (val.match(this.hexRegEx)) {
        $(document.body).css('background-color', val)
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
