let changelogText

$.getJSON('js/json/changelog.json', (data) => {
  changelogText = data
  loadChangeLog()
  chrome.storage.sync.get(['startChangeLog'], function({startChangeLog}) {
    if(startChangeLog !== undefined && startChangeLog) {
      $('#changelog').modal('show')
    }
    chrome.storage.sync.set({startChangeLog: false}, function() {})
  })
})

function loadChangeLog() {
  $('#changelog-title').text(`Version ${changelogText.version} Changelog`)
  for(let i = 0; i < changelogText.changes.length; i++) {
    let currentChange = changelogText.changes[i]
    $('#changelog-body').append($('<div></div>')
      .append(i != 0 ? $('<hr />') : '')
      .append($('<h5></h5>')
        .text(currentChange.header)
      )
      .append($('<span></span>')
        .append($('<p></p>')
          .text(currentChange.content)
        )
      )
      .append($('<small></small>')
        .css('color', '#eaa615')
        .addClass('changelog-type')
        .text(currentChange.type)
      )
    )
  }
}