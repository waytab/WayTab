let opened = false
let startWidth
setTimeout(() => { startWidth = $('.fab-action').outerWidth(), $('.fab-action').css('width', startWidth + 'px') }, 100) // we need the font to load before we grab the button's width
$(document).on('click', '#activate-settings', (e) => {
  console.log(startWidth)
  //animate
  $('.fab-action').toggleClass('shown')

  $({ deg: 0 }).animate({ deg: 180 }, {
    duration: 250,
    step(deg) {
      $('#activate-settings i').css('transform', `rotate(${deg}deg)`)
    }
  })
  setTimeout(() => { $('#activate-settings i').toggleClass('fa-times') }, 125)

  if (!opened) {
    $('.fab-action').animate({
      width: 200
    }, 250)

    $('#activate-settings span').text('Close')

    opened = true
  } else {
    $('.fab-action').animate({
      width: startWidth
    }, 250)

    $('#activate-settings span').text('Settings')

    opened = false
  }
})