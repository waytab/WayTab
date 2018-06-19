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
        let bod = $(this).find('description').text()
        let img = $(bod).find('img').attr('src')
        articles.push([title, link, img]);
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
    $('#wspn-container').css('width', 0);
  })
}

function displayArticles() {
  for(i = 0; i < articles.length; i++) {
    let title = articles[i][0];
    let link = articles[i][1];
    let img = articles[i][2];
    console.log(title + " | " + link + " | " + img)
    $('#rss-feed').append(createNewsDiv(title, link, img));
  }
}

function createNewsDiv(title, link, img) {
  let newsdiv = $('<div></div>')
    .attr('class', 'wspn-article')
    .attr('id', `article${i+1}`)
    .append($('<h6></h6>').text(title).css('padding-left', '5px'))
    .append($('<a></a>')
      .attr('href', link)
      .attr('id', `article-link${i+1}`)
      .append($('<img></img>')
        .attr('src', img)
        .attr('alt', title)
        .attr('id', `article-image${i+1}`)
        .attr('width', '300px')
        .attr('height', '200px')
      )
    )
  return newsdiv;
}
