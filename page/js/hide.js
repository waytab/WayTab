$(document).ready(() => {
  hideBody();
})

function hideBody() {
  $(document).on('click', '#hide-content', () => {
    if($('#content').css('display') === 'none') {
      $('#content').css('display', 'block');
      $('#content-status').text('Hide Content');
    }else {
      $('#content').css('display', 'none');
      $('#content-status').text('Show Content');
    }
  });
}
