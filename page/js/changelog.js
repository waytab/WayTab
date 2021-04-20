fetch('./js/json/changelog.json')
  .then(response => response.json())
  .then((data) => {
    loadChangeLog(data)
    chrome.storage.sync.get(['startChangeLog'], ({startChangeLog}) => {
      if(startChangeLog !== undefined && startChangeLog) {
        let changelogModal = new bootstrap.Modal(document.querySelector('#changelogModal'))
        changelogModal.show()
      }
      chrome.storage.sync.set({startChangeLog: false}, () => {})
    })
  })
  .catch(error => {
    console.error('Problem retieving changelog!', error)
  })

function loadChangeLog(changelog) {
  //set the title of the changelog modal to current version
  document.querySelector('#changelog-title').textContent = `Version ${changelog.version} Changelog`
  //go through each change so we can add it to the modal body
  changelog.changes.forEach(element => {

    //we need to build out the DOM in elements. it's tedious. observe:
    let thisChangeHeader = document.createElement('h5')
    thisChangeHeader.textContent = element.header

    let thisChangeContent = document.createElement('p')
    thisChangeContent.textContent = element.content

    let thisChangeType = document.createElement('small')
    thisChangeType.setAttribute('style', 'color: #eea615')
    thisChangeType.className = 'changelog-type'
    thisChangeType.textContent = element.type

    //take all that garbage and put it in the parent element
    let changeElem = document.createElement('div')
    changeElem.append(thisChangeHeader)
    changeElem.append(thisChangeContent)
    changeElem.append(thisChangeType)

    // now we take the DOM created for this change and append it to the list
    document.querySelector('#changelog-body').append(changeElem)
  })

  // now we'll make a disclaimer to let people know that this changelog doesn't have EVERYTHING and they should go to github for that
  let changelogDisclaimer = document.createElement('p')
  changelogDisclaimer.className = 'mb-0 mt-3 fst-italic'
  // almost forgot (LOL i'm such a nancy) we need to make an element for the link to github
  let changelogLinkGH = document.createElement('a')
  changelogLinkGH.setAttribute('href', `https://github.com/waytab/WayTab/releases/tag/v${chrome.runtime.getManifest().version}`)
  changelogLinkGH.textContent = 'here'

  changelogDisclaimer.append('Not all changes are listed here. See the PR ')
  changelogDisclaimer.append(changelogLinkGH)
  changelogDisclaimer.append(' for the entire changelog.')

  // now we'll append the disclaimer to the end of the list
  document.querySelector('#changelog-body').append(changelogDisclaimer)
}