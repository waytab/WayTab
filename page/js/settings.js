let opened = false
let startWidth

// setTimeout(() => {
//   startWidth = document.querySelector('.fab-action').offsetWidth
//   //document.querySelector('.fab-action').css('width', startWidth + 'px')
//   document.querySelector('.fab-action').style.width = (startWidth + 1 + 'px')
// }, 100) // we need the font to load before we grab the button's width

document.addEventListener('click', e => {
  e.path.forEach(element => {
    if(element.id == 'activate-settings' || element.id == 'settings-clickaway'){
      document.querySelector('.fab-action').classList.toggle('shown')
      document.querySelector('#activate-settings i').classList.toggle('fa-times')

      if(!opened) {
        document.querySelector('#activate-settings span').textContent = 'Close'

        let clickawayElement = document.createElement('div')
        clickawayElement.id = 'settings-clickaway'
        document.body.prepend(clickawayElement)

        opened = true
      } else {
        document.querySelector('#activate-settings span').textContent = 'Settings'
        document.querySelector('#settings-clickaway').remove()

        opened = false
      }
    }
  });
})
