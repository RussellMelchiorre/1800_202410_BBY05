const hoursCountInput = document.getElementById('hoursCount');
const minutesCountInput = document.getElementById('minutesCount');
const secondsCountInput = document.getElementById('secondsCount');

const prevHour = document.getElementById('prevHour');
const nextHour = document.getElementById('nextHour');
const prevMinute = document.getElementById('prevMinute');
const nextMinute = document.getElementById('nextMinute');
const prevSecond = document.getElementById('prevSecond');
const nextSecond = document.getElementById('nextSecond');

const upHours = document.getElementById('upHours');
const upMinutes = document.getElementById('upMinutes');
const upSeconds = document.getElementById('upSeconds');
const downHours = document.getElementById('downHours');
const downMinutes = document.getElementById('downMinutes');
const downSeconds = document.getElementById('downSeconds');

function formatLeadZero(time) {
    if (time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  }

function timeRestriction() {
    const hoursCountInput = document.getElementById('hoursCount');
    const minutesCountInput = document.getElementById('minutesCount');
    const secondsCountInput = document.getElementById('secondsCount');

    if (hoursCountInput) {
        hoursCountInput.addEventListener('input', function () {
            //if user enters value over 99 hours or below 0 hours it is automatically set to corresponding value
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
            //if user enters value over 59 minutes or below 0 minutes it is automatically set to corresponding value
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
            //if user enters value over 59 seconds or below 0 seconds it is automatically set to corresponding value
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

function updateHourNeighbors() {
    const currentValue = parseInt(hoursCountInput.value, 10);

    if (isNaN(currentValue)) {
        prevHour.textContent = "99";
        nextHour.textContent = "01";
        return;
    }

    if (currentValue === 0) {
        prevHour.textContent = "99";
    } else {
        prevHour.textContent = formatLeadZero(currentValue - 1);
    }

    if (currentValue === 99) {
        nextHour.textContent = "00";
    } else {
        nextHour.textContent = formatLeadZero(currentValue + 1);
    }
}

function updateMinuteNeighbors() {
    const currentValue = parseInt(minutesCountInput.value, 10);

    if (isNaN(currentValue)) {
        prevMinute.textContent = "59";
        nextMinute.textContent = "01";
        return;
    }

    if (currentValue === 0) {
        prevMinute.textContent = "59";
    } else {
        prevMinute.textContent = formatLeadZero(currentValue - 1);
    }

    if (currentValue === 59) {
        nextMinute.textContent = "00";
    } else {
        nextMinute.textContent = formatLeadZero(currentValue + 1);
    }
}

function updateSecondNeighbors() {
    const currentValue = parseInt(secondsCountInput.value, 10);

    if (isNaN(currentValue)) {
        prevSecond.textContent = "59";
        nextSecond.textContent = "01";
        return;
    }

    if (currentValue === 0) {
        prevSecond.textContent = "59";
    } else {
        prevSecond.textContent = formatLeadZero(currentValue - 1);
    }

    if (currentValue === 59) {
        nextSecond.textContent = "00";
    } else {
        nextSecond.textContent = formatLeadZero(currentValue + 1);
    }
}

function inputButtons() {
    if (upHours) {
        if (hoursCountInput) {
            upHours.addEventListener('click', function () {
                hoursCountInput.value = prevHour.textContent;
                updateHourNeighbors();
            });
            downHours.addEventListener('click', function () {
                hoursCountInput.value = nextHour.textContent;
                updateHourNeighbors();
            });
        }
    }

    if (upMinutes) {
        if (minutesCountInput) {
            upMinutes.addEventListener('click', function () {
                minutesCountInput.value = prevMinute.textContent;
                updateMinuteNeighbors();
            });
            downMinutes.addEventListener('click', function () {
                minutesCountInput.value = nextMinute.textContent;
                updateMinuteNeighbors();
            });
        }
    }

    if (upSeconds) {
        if (secondsCountInput) {
            upSeconds.addEventListener('click', function () {
                secondsCountInput.value = prevSecond.textContent;
                updateSecondNeighbors();
            });
            downSeconds.addEventListener('click', function () {
                secondsCountInput.value = nextSecond.textContent;
                updateSecondNeighbors();
            });
        }
    }
}

inputButtons();

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

    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) {
        alert("Invalid Countdown Time");
        return;
    }

    startButton.style.display = 'none';
    duringTimerButtons.forEach(button => {
        button.style.display = 'flex';
    });

    upHours.disabled = true;
    downHours.disabled = true;
    upMinutes.disabled = true;
    downMinutes.disabled = true;
    upSeconds.disabled = true;
    downSeconds.disabled = true;
    hoursCountInput.disabled = true;
    minutesCountInput.disabled = true;
    secondsCountInput.disabled = true;

    const interval = setInterval(() => {
        if (totalSeconds <= 0 || cancelled === true) {
            clearInterval(interval);
            if(totalSeconds <= 0) {
            showToast("Time's up!");
            }

            hoursCountInput.value = originalHours;
            minutesCountInput.value = originalMinutes;
            secondsCountInput.value = originalSeconds;

            startButton.style.display = 'block';
            duringTimerButtons.forEach(button => {
                button.style.display = 'none';
            });

            resetInputsAndButtons();
            cancelled = false;
            return;
        }

        if (!paused) {
        totalSeconds--;
        }

        const currentHours = Math.floor(totalSeconds / 3600);
        const currentMinutes = Math.floor((totalSeconds % 3600) / 60);
        const currentSeconds = totalSeconds % 60;

        hoursCountInput.value = currentHours;
        minutesCountInput.value = currentMinutes;
        secondsCountInput.value = currentSeconds;

        updateHourNeighbors();
        updateMinuteNeighbors();
        updateSecondNeighbors();
    }, 1000);
}

startTimer.addEventListener('click', startCountdown);

var cancelled = false;

function cancelCountdown() {
    const startButton = document.getElementById('startTimer');
    const duringTimerButtons = document.querySelectorAll('.duringTimerButtons');
    startButton.style.display = 'block';
    duringTimerButtons.forEach(button => {
        button.style.display = 'none';
    });
    cancelled = true;
}

cancelTimer.addEventListener('click', cancelCountdown);

var paused = false;

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

pauseTimer.addEventListener('click', pauseCountdown);