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
  
  $('#changelog-body').append($('<p></p>')
    .html(`Not all changes are listed here. See the PR <a href="https://github.com/waytab/WayTab/releases/tag/v${chrome.runtime.getManifest().version}">here</a> for the entire changelog.`)
    .addClass('mb-0 mt-3 font-italic')
  )
}