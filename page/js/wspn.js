let wspnrss = 'http://waylandstudentpress.com/feed/'
let articles = []

$.ajax({
  type: 'GET',
  url: 'https://cors-anywhere.herokuapp.com/' + wspnrss,
  dataType: 'xml',
  success: function(xml) {
    let lim = 5

    $(xml).find('item').each(function (index) {
      if(index < lim) {
        let title = $(this).find('title').text()
        let link = $(this).find('link').text()
        let bod = $('<div></div>').append($(this).find('description').text())
        let desc = $(this).find($('p')).first().text()
        console.log(desc)
        let img = $(bod).find('img').attr('src')
        let auth = $($(this)[0].getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0]).text()
        articles.push([title, link, img, auth]);
      }
    })

    displayArticles();
  }
})

$(document).ready(() => {
  controlFlow();
})

function controlFlow() {
  $(document).on('click', '#show-wspn', () => {
    $('#wspn-container').css('width', '332px');
  })

  $(document).on('click', '#close-wspn', () => {
    $('#wspn-container').css('width', '0px');
  })
}

function displayArticles() {
  for(i = 0; i < articles.length; i++) {
    let title = articles[i][0];
    let link = articles[i][1];
    let img = articles[i][2];
    let auth = articles[i][3]
    console.log(title + " | " + link + " | " + img)
    $('#rss-feed').append(createNewsDiv(title, link, img, auth));
  }
}

function createNewsDiv(title, link, img, auth) {
  console.log(auth)
  let newsdiv = $('<div></div>')
    .attr('class', 'card mb-3 mx-3')
    .attr('id', `article${i + 1}`)

  if(img != undefined) {
    newsdiv.append(`<div class="card-img-top" style="background-image: url(${img}); height: 10rem;"></div>`)
  }

  newsdiv.append($('<div></div>')
    .toggleClass('card-body')
    .append($('<h5></h5>')
      .toggleClass('card-title')
      .text(title)
    )
    .append($('<h6></h6>')
      .toggleClass('card-subtitle text-muted mb-2')
      .text(auth)
    )
    .append($('<a></a>')
      .toggleClass('card-link')
      .attr('href', link)
      .text('Read on WSPN')
    )
  )
  
  return newsdiv;
}
