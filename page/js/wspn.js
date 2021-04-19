let wspnrss = 'waylandstudentpress.com/feed/'
let articles = []

chrome.storage.sync.get( ['enableWspn'], function(res) {
  if(res.enableWspn) {
    $('#wspn-check').prop('checked', true)
    $('#show-wspn').show()
  } else {
    $('#wspn-check').prop('checked', false)
    $('#show-wspn').hide()
  }
})

$.ajax({
  type: 'GET',
  url: 'https://cors-anywhere.herokuapp.com/' + wspnrss,
  dataType: 'xml',
  success: function (xml) {
    let lim = 5

    $(xml).find('item').each(function (index) {
      if (index < lim) {
        let title = $(this).find('title').text()
        let link = $(this).find('link').text()
        let bod = $('<div></div>').append($(this).find('description').text())
        let desc = $(this).find($('p')).first().text()
        let img = $(bod).find('img').attr('src')
        let auth = $($(this)[0].getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0]).text()
        articles.push([title, link, img, auth]);
      }
    })

    displayArticles();
  },
  error: (xml) => {
    console.warn(`Failed to load WSPN feed! Status: ${xml.status}: ${xml.statusText}`)
    $('#wspn-loader').remove()
    $('#rss-feed').append(
      $('<p>Failed to load WSPN Feed</p>')
        .attr('id', 'rss-fail')
        .addClass(['lead', 'text-center', 'text-danger', 'align-middle', 'mt-5'])
        .append('<br/>')
        .append($(`<span>${xml.status}: ${xml.statusText}</span>`).addClass('h6'))
    )
  }
})

$(document).ready(() => {
  controlFlow();

  $('#wspn-check').change( function() {
    if(this.checked) {
      chrome.storage.sync.set( {'enableWspn': true}, function() {
        $('#show-wspn').show()
      })
    } else {
      chrome.storage.sync.set( {'enableWspn': false}, function() {
        $('#show-wspn').hide()
      })
    }
  })
})

function controlFlow() {
  $(document).on('click', '#show-wspn', () => {
    $('body').prepend($('<div></div>').attr({id: 'wspn-clickaway'}))
    $('#wspn-container').css('width', '332px');
  })

  $(document).on('click', '#close-wspn, #wspn-clickaway', (e) => {
    e.preventDefault()
    $('#wspn-clickaway').remove()
    $('#wspn-container').css('width', '0px');
  })
}

function displayArticles() {
  $('#wspn-loader').remove()
  articles.forEach(e => {
    $('#rss-feed').append(createNewsDiv(...e)) // this is a spread operator (...), which acts similar to a forEach loop, but inline.
    // so instead of passing items of an array (arr[0], arr[1], etc), we pass the spread of the array (...arr). it works the same way.
  })
}

function createNewsDiv(title, link, img, auth) {
  let newsdiv = $('<div></div>')
    .attr('class', 'card mx-3')

  if (img != undefined) {
    newsdiv.append(`<div class="card-img-top" style="background-image: url(${img}); height: 10rem;"></div>`)
  }

  newsdiv.append($('<div></div>')
    .toggleClass('card-body')
    .append($('<h5></h5>')
      .toggleClass('card-title')
      .text(title)
    )
    .append($('<h6></h6>')
      .append($('<a></a>')
        .toggleClass('card-link card-subtitle text-muted mb-2')
        .attr('href', 'https://waylandstudentpress.com/staff/?writer=' + auth)
        .text(auth)
      )
    )
    .append($('<a></a>')
      .toggleClass('card-link')
      .attr('href', link)
      .text('Read on WSPN')
    )
  )

  return newsdiv;
}
