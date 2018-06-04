var sched = bell_sched;

function displayTime() {
  let time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let s = time.getSeconds();
  let day = time.getDay();
  let hem = "am";

  if(h >= 13) {
    h -= 12;
    hem = "pm";
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
  let bar = document.getElementById("time-bar-total");
  bar.onmouseover = function() {
    document.getElementById("percent-container").style.display = "block";
  }
  bar.onmouseout = function() {
    document.getElementById("percent-container").style.display = "none";
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

  if(name == "Before School" || name == "After School") {
    percent = 100;
  }

  if(percent > 100) {
    percent = 100;
    name = "Passing Time";
  }

  bar.style.width = percent + "%";
  let time = document.getElementById("time-container").innerText;
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
