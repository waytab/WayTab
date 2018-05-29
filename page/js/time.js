

function displayTime() {
  var time = new Date();
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();
  var d = "am";

  if(h >= 12) {
    h -= 12;
    d = "pm";
  }
  if(h == 0) {
    h = 12;
  }
  h = getTwoDigits(h); m = getTwoDigits(m); s = getTwoDigits(s);

  document.getElementById("time-container").innerHTML = h + ":" + m + ":" + s + d;
  var t = setTimeout(displayTime, 500);
}

function getTwoDigits(num) {
  return num < 10 ? "0"+num : num;
}

function getSoonestStart(bell_type) {
}
