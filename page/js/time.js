let sched
$.getJSON('js/json/bell.json', (data) => { sched = data })
hoverTimeElapsed()

let letter
let rss = 'http://whs.wayland.k12.ma.us/syndication/rss.aspx?serverid=1036540&userid=5&feed=portalcalendarevents&key=iK2zFQsYzm4ADbSvh7fdNqHamW%2fpZI4kygKhPXzaCr6fqlj%2bj%2b3iTsOsu6TbqYdT2MVtQmb1n0GvVK5PPvJZuw%3d%3d&portal_id=1036623&page_id=1036639&calendar_context_id=1062636&portlet_instance_id=76331&calendar_id=1062637&v=2.0'
let cors = 'https://cors-anywhere.herokuapp.com/'
$.ajax({
  type: 'GET',
  url: cors + rss,
  dataType: 'xml',
  success: function(data) {
    let feed = $(data).find('channel')
    let found = false
    feed.find('item').each(function() {
      if($(this).find('title').text().length == 1 && found == false) {
        letter = $(this).find('title').text()
        found = true
      }
    })
    scheduleHighlightor()
    setInterval(scheduleHighlightor, 60000)
  }
})
//setInterval(displayTime, 1000)

function displayTime() {
  let time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();
  let day = time.getDay();
  let hem = "am";

  if(h >= 12) {
    hem = "pm";
  }
  if(h >= 13) {
    h -= 12;
  }
  h = getTwoDigits(h); m = getTwoDigits(m); s = getTwoDigits(s);

  document.getElementById("time-container").innerHTML= h + ":" + m + ":" + s + hem;
  advanceBar(day);
}

function getTwoDigits(num) {
  return num < 10 ? "0"+num : num;
}

function scheduleHighlightor() {
  $('td.now').removeClass('now')
  let day = new Date().getDay()
  if(day == 0 || day == 6) {
    currentBlock = getSoonestStart(4)[2];
  }else if(day == 3) {
    currentBlock = getSoonestStart(3)[2];
  }else {
    currentBlock = getSoonestStart(1)[2];
  }
  console.log(currentBlock)
  if(currentBlock.indexOf('Block') != -1) {
    currentBlock = currentBlock.substring(6)
    $(`#schedule-body > tr:nth-child(${currentBlock}) > td:nth-child(${dayFromLetter(letter)})`).addClass('now')
  }
}

function hoverTimeElapsed() {
  let bar = document.getElementById("time-bar-total");
  let percentContainer = document.getElementById('percent-container')
  bar.onmouseover = function() {
    percentContainer.style.display = "block";
  }
  bar.onmouseout = function() {
    percentContainer.style.display = "none";
  }


  percentContainer.onmouseover = function() {
    percentContainer.style.display = "block";
  }
  percentContainer.onmouseout = function() {
    percentContainer.style.display = "none";
  }
}

function advanceBar(day) {
  let bar = document.getElementById("time-bar-elapsed");
  let info;
  if(day == 0 || day == 6) {
    info = getSoonestStart(4);
  }else if(day == 3) {
    info = getSoonestStart(3);
  }else {
    info = getSoonestStart(1);
  }
  let difference = info[0];
  let length = parseInt(info[1]);
  let name = info[2];
  let end = info[3];
  let percent = (difference/length) * 100;

  if(percent > 100) {
    percent = 100;
    name = "Passing Time";
  }

  let letterDay = ''
  if(name != 'Weekend' && letter != 'undefined') {
    letterDay = ` | ${letter} Day`
  }

  bar.style.width = percent + "%";
  let time = document.getElementById("time-container").innerText;
  document.getElementById("time-container").innerHTML = `<span id="time-display">${time.substring(0, time.length-2)}</span>${time.substring(time.length-2)}${letterDay} | ${name}`
  document.getElementById("percent-container").innerHTML = "Ends at " + getTimeFromId(end) + " | " + parseInt(bar.style.width) + "% elapsed";
}

function getTimeFromId(time) {
  let nums = time.split(",");
  let hours = nums[0];
  let minutes = nums[1];
  let hem = "am";
  if(hours >= 12) {
    hem = "pm";
  }

  hours = getTwoDigits(hours); minutes = getTwoDigits(minutes);
  return hours + ":" + minutes + hem;
}

function getSoonestStart(bell_type) {
  let timelist = sched[bell_type];
  let time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();

  let min = 999999999;
  let index = 0;
  for(i = 0; i < timelist.length; i++) {
    let hands = timelist[i].start.split(",");
    let hourHand = parseInt(3600*hands[0]);
    let minuteHand = parseInt(60*hands[1]);
    let total = hourHand + minuteHand;
    let current = 3600*h + 60*m + s;
    let difference = current-total;

    if(difference >= 0 && difference < min) {
      min = difference;
      index = i;
    }
  }
  console.log(index)
  console.log(timelist)
  console.log(timelist[index])
  return [min, timelist[index].length * 60, timelist[index].name, timelist[index].end];
}

function dayFromLetter(letter) {
  switch(letter) {
    case 'A':
      return 1
      break
    case 'B':
      return 2
      break
    case 'C':
      return 3
      break
    case 'D':
      return 4
      break
    case 'E':
      return 5
      break
    case 'F':
      return 6
      break
    case 'G':
      return 7
      break
    case 'H':
      return 8
      break
  }
}
