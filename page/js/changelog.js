let changelogText

$.getJSON('js/json/changelog.json', (data) => {
    changelogText = data
    loadChangeLog()
})

function loadChangeLog() {
    $('#changelog-title').text(`Version ${changelogText.version} Changelog`)
    for(let i = 0; i < changelogText.changes.length; i++) {
        let currentChange = changelogText.changes[i]
        $('#changelog-body').append($('<div></div>')
            .append($('<h5></h5>')
                .text(currentChange.header)
            )
            .append($('<span></span>')
                .append($('<p></p>')
                    .text(currentChange.content)
                )
            )
            .append($('<small></small>')
                .text(currentChange.type)
            )
            .append($('<hr />'))
        )
    }
}