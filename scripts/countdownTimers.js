//This is the js script for the countdown timers page as a part of the timer's system.
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//Global Variables
const hoursCountInput = document.getElementById('hoursCount');
const minutesCountInput = document.getElementById('minutesCount');
const secondsCountInput = document.getElementById('secondsCount');

const prevHour = document.getElementById('prevHour');
const nextHour = document.getElementById('nextHour');
const prevMinute = document.getElementById('prevMinute');
const nextMinute = document.getElementById('nextMinute');
const prevSecond = document.getElementById('prevSecond');
const nextSecond = document.getElementById('nextSecond');

var cancelled = false;
var paused = false;

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//formats values of parameter, time, ensures 0's are placed before any number below 10 to maintain double digit format.
function formatLeadZero(time) {
    if (time < 10) {
        return "0" + time;
    } else {
        return time;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//ensures values entered in fields follow the restrictions (maximum of 99 hours, 59 minutes and seconds, no negative numbers).
function timeRestriction() {
    const hoursCountInput = document.getElementById('hoursCount');
    const minutesCountInput = document.getElementById('minutesCount');
    const secondsCountInput = document.getElementById('secondsCount');

    if (hoursCountInput) {
        hoursCountInput.addEventListener('input', function () {
            //if user enters value over 99 hours or below 0 hours it is automatically set to corresponding value.
            if (this.value > 99) {
                this.value = "99";
            }
            if (this.value < 0) {
                this.value = "00";
            }
            updateHourNeighbors();
        });
    }

    if (minutesCountInput) {
        minutesCountInput.addEventListener('input', function () {
            //if user enters value over 59 minutes or below 0 minutes it is automatically set to corresponding value.
            if (this.value > 59) {
                this.value = "59";
            }
            if (this.value < 0) {
                this.value = "00";
            }
            updateMinuteNeighbors();
        });
    }

    if (secondsCountInput) {
        secondsCountInput.addEventListener('input', function () {
            //if user enters value over 59 seconds or below 0 seconds it is automatically set to corresponding value.
            if (this.value > 59) {
                this.value = "59";
            }
            if (this.value < 0) {
                this.value = "00";
            }
            updateSecondNeighbors();
        });
    }
}

timeRestriction();

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//updates the neighboring hour values in the display.
function updateHourNeighbors() {
    const currentValue = parseInt(hoursCountInput.value, 10);
    //by default the neighboring values are 99 and 01.
    if (isNaN(currentValue)) {
        prevHour.textContent = "99";
        nextHour.textContent = "01";
        return;
    }

    //ensures neighboring values follow order of maximum 99 minimum 0, else the previous hour will always be the hour-1.
    if (currentValue === 0) {
        prevHour.textContent = "99";
    } else {
        prevHour.textContent = formatLeadZero(currentValue - 1);
    }

    //ensures neighboring values follow order of maximum 99 minimum 0, else the next hour will always be the hour+1.
    if (currentValue === 99) {
        nextHour.textContent = "00";
    } else {
        nextHour.textContent = formatLeadZero(currentValue + 1);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//updates the neighboring minute values in the display.
function updateMinuteNeighbors() {
    const currentValue = parseInt(minutesCountInput.value, 10);

    //by default the neighboring values are 59 and 01.
    if (isNaN(currentValue)) {
        prevMinute.textContent = "59";
        nextMinute.textContent = "01";
        return;
    }

    //ensures neighboring values follow order of maximum 59 minimum 0, else the previous minute will always be the minutes-1.
    if (currentValue === 0) {
        prevMinute.textContent = "59";
    } else {
        prevMinute.textContent = formatLeadZero(currentValue - 1);
    }

    //ensures neighboring values follow order of maximum 59 minimum 0, else the next minute will always be the minutes+1.
    if (currentValue === 59) {
        nextMinute.textContent = "00";
    } else {
        nextMinute.textContent = formatLeadZero(currentValue + 1);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//updates the neighboring second values in the display.
function updateSecondNeighbors() {
    const currentValue = parseInt(secondsCountInput.value, 10);

    //by default the neighboring values are 59 and 01.
    if (isNaN(currentValue)) {
        prevSecond.textContent = "59";
        nextSecond.textContent = "01";
        return;
    }

    //ensures neighboring values follow order of maximum 59 minimum 0, else the previous second will always be the seconds-1.
    if (currentValue === 0) {
        prevSecond.textContent = "59";
    } else {
        prevSecond.textContent = formatLeadZero(currentValue - 1);
    }

    //ensures neighboring values follow order of maximum 59 minimum 0, else the next second will always be the seconds+1.
    if (currentValue === 59) {
        nextSecond.textContent = "00";
    } else {
        nextSecond.textContent = formatLeadZero(currentValue + 1);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//uses the update neighbor functions to change the display if user clicks on according button.
function inputButtons() {
    if (upHours) {
        if (hoursCountInput) {
            //if user clicks on up hour arrow button the input will be changed to the previous hour.
            upHours.addEventListener('click', function () {
                hoursCountInput.value = prevHour.textContent;
                updateHourNeighbors();
            });
            //if user clicks on down hour arrow button the input will be changed to the next hour.
            downHours.addEventListener('click', function () {
                hoursCountInput.value = nextHour.textContent;
                updateHourNeighbors();
            });
        }
    }

    if (upMinutes) {
        //if user clicks on up minute arrow button the input will be changed to the previous minute.
        if (minutesCountInput) {
            upMinutes.addEventListener('click', function () {
                minutesCountInput.value = prevMinute.textContent;
                updateMinuteNeighbors();
            });
            //if user clicks on down minute arrow button the input will be changed to the next minute.
            downMinutes.addEventListener('click', function () {
                minutesCountInput.value = nextMinute.textContent;
                updateMinuteNeighbors();
            });
        }
    }

    if (upSeconds) {
        //if user clicks on up second arrow button the input will be changed to the previous second.
        if (secondsCountInput) {
            upSeconds.addEventListener('click', function () {
                secondsCountInput.value = prevSecond.textContent;
                updateSecondNeighbors();
            });
            //if user clicks on down second arrow button the input will be changed to the next second.
            downSeconds.addEventListener('click', function () {
                secondsCountInput.value = nextSecond.textContent;
                updateSecondNeighbors();
            });
        }
    }
}

inputButtons();

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//resets the input values, enables all buttons and updates time neighbors.
function resetInputsAndButtons() {
    upHours.disabled = false;
    downHours.disabled = false;
    upMinutes.disabled = false;
    downMinutes.disabled = false;
    upSeconds.disabled = false;
    downSeconds.disabled = false;
    hoursCountInput.disabled = false;
    minutesCountInput.disabled = false;
    secondsCountInput.disabled = false;


    updateHourNeighbors();
    updateMinuteNeighbors();
    updateSecondNeighbors();
}

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//starts the countdown timer.
function startCountdown() {
    const upHours = document.getElementById('upHours');
    const downHours = document.getElementById('downHours');
    const upMinutes = document.getElementById('upMinutes');
    const downMinutes = document.getElementById('downMinutes');
    const upSeconds = document.getElementById('upSeconds');
    const downSeconds = document.getElementById('downSeconds');

    const originalHours = parseInt(hoursCountInput.value) || 0;
    const originalMinutes = parseInt(minutesCountInput.value) || 0;
    const originalSeconds = parseInt(secondsCountInput.value) || 0;

    const startButton = document.getElementById('startTimer');
    const duringTimerButtons = document.querySelectorAll('.duringTimerButtons');

    let hours = originalHours;
    let minutes = originalMinutes;
    let seconds = originalSeconds;

    timeRestriction();

    //converts time values into seconds.
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    //if seconds is less than or equal to zero notify user that the timer is invalid.
    if (totalSeconds <= 0) {
        alert("Invalid Countdown Time");
        return;
    }

    //once timer starts the start button is removed from page and replaced with duringTimerButtons (cancel and pause).
    startButton.style.display = 'none';
    duringTimerButtons.forEach(button => {
        button.style.display = 'flex';
    });

    //disables all input fields and buttons to change time.
    upHours.disabled = true;
    downHours.disabled = true;
    upMinutes.disabled = true;
    downMinutes.disabled = true;
    upSeconds.disabled = true;
    downSeconds.disabled = true;
    hoursCountInput.disabled = true;
    minutesCountInput.disabled = true;
    secondsCountInput.disabled = true;

    //inverval that repeats every second
    const interval = setInterval(() => {
        //once timer is done or user cancels timers tell user time's up and run this code.
        if (totalSeconds <= 0 || cancelled === true) {
            clearInterval(interval);
            if (totalSeconds <= 0) {
                showToast("Time's up!");
            }

            //set time values back to original set times.
            hoursCountInput.value = originalHours;
            minutesCountInput.value = originalMinutes;
            secondsCountInput.value = originalSeconds;

            resetInputsAndButtons();
            cancelled = false;
            return;
        }

        //if not paused continue to count down.
        if (!paused) {
            totalSeconds--;
        }

        const currentHours = Math.floor(totalSeconds / 3600);
        const currentMinutes = Math.floor((totalSeconds % 3600) / 60);
        const currentSeconds = totalSeconds % 60;

        hoursCountInput.value = formatLeadZero(currentHours);
        minutesCountInput.value = formatLeadZero(currentMinutes);
        secondsCountInput.value = formatLeadZero(currentSeconds);

        updateHourNeighbors();
        updateMinuteNeighbors();
        updateSecondNeighbors();
    }, 1000);
}

//if user clicks start button, startcountdown.
startTimer.addEventListener('click', startCountdown);

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//start button is made visible and cancel and pause buttons are hidden, cancel variables is changed to true.
function cancelCountdown() {
    const startButton = document.getElementById('startTimer');
    const duringTimerButtons = document.querySelectorAll('.duringTimerButtons');
    startButton.style.display = 'block';
    duringTimerButtons.forEach(button => {
        button.style.display = 'none';
    });
    cancelled = true;
}

//if cancel button is clicked, run cancelCountdown function.
cancelTimer.addEventListener('click', cancelCountdown);

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//if paused set text of button to resume, if timer is paused and function is run set text to pause and change variable to false, else set to true.
function pauseCountdown() {
    const pauseButton = document.getElementById('pauseTimer');
    pauseButton.textContent = "Resume";
    if (paused === true) {
        pauseButton.textContent = "Pause";
        paused = false;
    } else {
        paused = true;
    }
}

//if pause button is clicked run the pauseCountdown function.
pauseTimer.addEventListener('click', pauseCountdown);