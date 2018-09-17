let sched
$.getJSON('js/json/config.json', (data) => { sched = data.bell_schedule, displayTime() })
hoverTimeElapsed()

let letter
let rss = 'http://calendar.google.com/calendar/embed?showTz=0&mode=AGENDA&src=wayland.k12.ma.us_vhri0sqonn3vcmis02v9bct64o%40group.calendar.google.com&color=%2342104A&src=wayland.k12.ma.us_hdhmk89bcnj0te0g7ptofr8ulo%40group.calendar.google.com&color=%23865A5A&ctz=America%2FNew_York'
let cors = 'https://cors-anywhere.herokuapp.com/'
let now = new Date();
let nowString = now.getFullYear() + '' + (now.getMonth()+1+'').padStart(2,'0') + '' + (now.getDate()+'').padStart(2,'0')
$.ajax({
  type: 'GET',
  url: cors + rss,
  dataType: 'xml',
  success(data) {
    console.log(data)
    let feed = $(data).find('channel')
    let found = false
    feed.find('item').each(function() {
      if($(this).find('title').text().length == 1 && found == false) {
        letter = $(this).find('title').text()
        found = true
      }
    })
    scheduleHighlightor()
    setInterval(scheduleHighlightor, 10000)
  }
})
setInterval(displayTime, 1000)

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
  currentBlock = getSoonestStart(getSchedFromDay(day))[2];

  if(currentBlock.indexOf('Block') != -1) {
    currentBlock = currentBlock.substring(6)
    $(`#schedule-body > tr:nth-child(${currentBlock}) > td:nth-child(${getDayFromLetter(letter)})`).addClass('now')
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
  let info = getSoonestStart(getSchedFromDay(day));
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
  if(name != 'Weekend' && letter != undefined) {
    letterDay = ` | ${letter} Day`
  }

  bar.style.width = percent + "%";
  let time = document.getElementById("time-container").innerText;
  document.getElementById("time-container").innerHTML = `<span id="time-display">${time.substring(0, time.length-2)}</span>${time.substring(time.length-2)}${letterDay} | ${name}`
  document.getElementById("percent-container").innerHTML = "Ends at " + getTimeFromId(end) + " | " + parseInt(bar.style.width) + "% elapsed";
}

function getSchedFromDay(day) {
  if(day == 0 || day == 6) {
    return 4;
  }else if(day == 3) {
    return 3;
  }else {
    return 1;
  }
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

  return [min, timelist[index].length * 60, timelist[index].name, timelist[index].end];
}

function getDayFromLetter(letter) {
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
