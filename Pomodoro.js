var breakTime = 5;
var sessionTime = 25;
var secondsElapsed = 0;
var timeLeft;
var countInterval;
var inSession = true;
var play = true;
var clockTime = "clockTime";
var breakTimer = "breakTimer";
var sessionTimer = "sessionTimer";
var clockHeading = "clockHeading";
var ppbutton="ppbutton";
var playHTML = "<i class='fa fa-play-circle-o fa-4x'></i>";
var pauseHTML = "<i class='fa fa-pause-circle-o fa-4x'></i>";

//this object controls how the main clock time is displayed.
var clock = {
  display: "25:00",
  minI: "2",
  minII: "5",
  secI: "0",
  secII: "0",
  update: function(min, sec) {
    this.minI = (Math.floor(min/10)).toString();
    this.minII = (min % 10).toString();
    this.secI = (Math.floor(sec/10)).toString();
    this.secII = (sec % 10).toString();
    this.display = this.minI + this.minII + ":" + this.secI + this.secII;
    return this.display;
  }
};

//the purpose of these functions are to allow shorthand form for long javascript id
//references
//Id function returns get Element By Id("Id")
var Id = function(id) {
  return document.getElementById(id);
};

//String prototype function that assigns a value to inner HTML
String.prototype.is = function(value) {
  Id(this).innerHTML = value;
};

//BUTTON CLICK HANDLING FUNCTIONS
//decreases break time by 1 minute
var breakDown = function() {
  if (breakTime > 1) {
    breakTime--;
    if (!inSession) {
      timeLeft = breakTime * 60;
      clockTime.is(clock.update(breakTime, 0));
    }
    breakTimer.is(breakTime);
  }
};

//increases break time by 1 minute
var breakUp = function() {
  if (breakTime < 59) {
    breakTime++;
    if (!inSession) {
      timeLeft = breakTime * 60;
      clockTime.is(clock.update(breakTime, 0));
    }
    breakTimer.is(breakTime);
  }
};

//decreases session time by 1 minute
var sessionDown = function() {
  if (sessionTime > 1) {
    sessionTime--;
    if (inSession) {
      timeLeft = sessionTime * 60;
      clockTime.is(clock.update(sessionTime, 0));
    }
    sessionTimer.is(sessionTime);
  }
};

//increases session time by 1 minute
var sessionUp = function() {
  if (sessionTime < 59) {
    sessionTime++;
    timeLeft = sessionTime * 60;
    if (inSession) {
      timeLeft = sessionTime * 60;
      clockTime.is(clock.update(sessionTime, 0));
    }
    sessionTimer.is(sessionTime);
  }
};
//this function resets the clock when in session mode
var resetSession = function() {
  secondsElapsed = 0;
  timeLeft = sessionTime * 60;
  clockTime.is(clock.update(sessionTime, 0));
};

//this function resets the clock when in break mode
var resetBreak = function() {
  secondsElapsed = 0;
  timeLeft = breakTime * 60;
  clockTime.is(clock.update(breakTime, 0));
};

//resets clock to session time
var resetClock = function() {
  pauseCountdown();
  ppbutton.is(playHTML);
  play = true;
  if (inSession) {
    resetSession();
  } else {
    resetBreak();
  }
};

//Counts clock down from session time 1 second at a time until stopped.
var countDown = function() {
  countInterval = window.setInterval(secondUpdate, 1000);
};

//functhion handles update to clock for every second
var secondUpdate = function() {
  if (timeLeft === 0) {
    timeUp();
  }
  var seconds;
  var minutes;
  if (inSession) {
    secondsElapsed++;
    timeLeft = sessionTime * 60 - secondsElapsed;
    seconds = timeLeft % 60;
    minutes = (timeLeft - seconds) / 60;

    clockTime.is(clock.update(minutes, seconds));
  } else {
    secondsElapsed++;
    timeLeft = breakTime * 60 - secondsElapsed;
    seconds = timeLeft % 60;
    minutes = (timeLeft - seconds) / 60;
    clockTime.is(clock.update(minutes, seconds));
  }
};

//Pause the clock countdown
var pauseCountdown = function() {
  window.clearInterval(countInterval);
};

//TimeUp function for when time reaches zero
var timeUp = function() {
  window.clearInterval(countInterval);
  inSession = !inSession;
  if (inSession) {
    clockHeading.is("SESSION");
    resetSession();
    countDown();
  } else {
    clockHeading.is("BREAK");
    resetBreak();
    countDown();
  }
};

//Event handling function for the play pause button
var ppButton = function() {
  
  if(play){
    ppbutton.is(pauseHTML);
    play=!play;
    countDown();
  }
  else{
    ppbutton.is(playHTML);
    play=!play;
    pauseCountdown();
  }
};

//EVENT HANDLERS

//Event handler for BreakDown button
document.getElementById("downButtonBreak").addEventListener("click", breakDown);
//Event handler for BreakUp button
document.getElementById("upButtonBreak").addEventListener("click", breakUp);
//Event handler for sessionDown button
document
  .getElementById("downButtonSession")
  .addEventListener("click", sessionDown);
//Event handler for sessionUp button
document.getElementById("upButtonSession").addEventListener("click", sessionUp);
//Event handler for play session button
document.getElementById("ppbutton").addEventListener("click", ppButton);
//Event handler for reset button
document.getElementById("reset").addEventListener("click", resetClock);
