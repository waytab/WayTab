var sched = bell_sched;
var time = new Date();

function displayTime() {
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();
  let day = time.getDay();
  let hem = "am";

  if(h >= 12) {
    h -= 12;
    hem = "pm";
  }
  if(h == 0) {
    hem = 12;
  }
  h = getTwoDigits(h); m = getTwoDigits(m); s = getTwoDigits(s);

  document.getElementById("time-container").innerHTML= h + ":" + m + ":" + s + hem;
  advanceBar(day);
}

setInterval(displayTime, 1000)

function getTwoDigits(num) {
  return num < 10 ? "0"+num : num;
}

function hoverTimeElapsed() {
  var bar = document.getElementById("time-bar-total");
  bar.onmouseover = function() {
    document.getElementById("percent-container").style.display = "block";
  }
  bar.onmouseout = function() {
    document.getElementById("percent-container").style.display = "none";
  }
}

function advanceBar(day) {
  var bar = document.getElementById("time-bar-elapsed");
  var info;
  if(day == 0 || day == 6) {
    info = getSoonestStart(4);
  }else if(day == 3) {
    info = getSoonestStart(3);
  }else {
    info = getSoonestStart(1);
  }
  var difference = info[0];
  var length = parseInt(info[1]);
  var name = info[2];
  var end = info[3];
  var percent = (difference/length) * 100;

  if(name == "Before School" || name == "After School") {
    percent = 100;
  }

  if(percent > 100) {
    percent = 100;
    name = "Passing Time";
  }

  bar.style.width = percent + "%";
  var time = document.getElementById("time-container").innerText;
  document.getElementById("time-container").innerHTML = `<span id="time-display">${time.substring(0, time.length-2)}</span>${time.substring(time.length-2)} | ${name}`
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
  var timelist = sched[bell_type];
  var currentTime = new Date();
  var h = currentTime.getHours();
  var m = currentTime.getMinutes();

  var min = 9001;
  var index = 0;
  for(i = 0; i < timelist.length; i++) {
    var hands = timelist[i].start.split(",");
    var hourHand = parseInt(60*hands[0]);
    var minuteHand = parseInt(hands[1]);
    var total = hourHand + minuteHand;
    var current = 60*h + m;
    var difference = current-total;

    if(difference >= 0 && difference < min) {
      min = difference;
      index = i;
    }
  }

  return [min, timelist[index].length, timelist[index].name, timelist[index].end];
}
