$(function() {
  var botval = -280;
  $("#settings-pane").click(function () {
    botval = (botval * -1) - 280;
    $(this).animate({bottom: rightval + 'px'}, {queue: false, duration: 1000});
  });
});
