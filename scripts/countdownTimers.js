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
          this.value = "0";
        }
      });
    }
  
    if (minutesCountInput) {
      minutesCountInput.addEventListener('input', function () {
        //if user enters value over 59 minutes or below 0 minutes it is automatically set to corresponding value
        if (this.value > 59) {
          this.value = "59";
        }
        if (this.value < 0) {
          this.value = "0";
        }
      });
    }

    if (secondsCountInput) {
      secondsCountInput.addEventListener('input', function () {
        //if user enters value over 59 seconds or below 0 seconds it is automatically set to corresponding value
        if (this.value > 59) {
          this.value = "59";
        }
        if (this.value < 0) {
          this.value = "0";
        }
      });
    }
  }
  
  timeRestriction();
  
  function viewNextInput() {
    if(hoursCountInput) {
        hoursCountInput.addEventListener('input', function () {
            const currentValue = parseInt(this.value, 10);

            if(isNaN(currentValue)) {
                prevHour.textContent = "99";
                nextHour.textContent = "1";
                return;
            }
            if(currentValue === 0) {
                prevHour.textContent = "99";
            } else {
                prevHour.textContent = currentValue - 1;
            }
            if(currentValue === 99) {
                nextHour.textContent = "0";
            } else {
                nextHour.textContent = currentValue + 1;
            }
        });
    }

    if(minutesCountInput) {
        minutesCountInput.addEventListener('input', function () {
            const currentValue = parseInt(this.value, 10);

            if(isNaN(currentValue)) {
                prevMinute.textContent = "59";
                nextMinute.textContent = "1";
                return;
            }
            if(currentValue === 0) {
                prevMinute.textContent = "59";
            } else {
                prevMinute.textContent = currentValue - 1;
            }
            if(currentValue === 59) {
                nextMinute.textContent = "0";
            } else {
                nextMinute.textContent = currentValue + 1;
            }
        });
    }
    
    if(secondsCountInput) {
        secondsCountInput.addEventListener('input', function () {
            const currentValue = parseInt(this.value, 10);

            if(isNaN(currentValue)) {
                prevSecond.textContent = "59";
                nextSecond.textContent = "1";
                return;
            }
            if(currentValue === 0) {
                prevSecond.textContent = "59";
            } else {
                prevSecond.textContent = currentValue - 1;
            }
            if(currentValue === 59) {
                nextSecond.textContent = "0";
            } else {
                nextSecond.textContent = currentValue + 1;
            }
        });
    }
  }

  viewNextInput();

  function inputButtons() {
    if(upHours) {
        if(hoursCountInput) {
            upHours.addEventListener('click', function() {
                hoursCountInput.value = prevHour.textContent;
                updateHourNeighbors();
            });
            downHours.addEventListener('click', function() {
                hoursCountInput.value = nextHour.textContent;
                updateHourNeighbors();
            });
        }
    }

    if(upMinutes) {
        if(minutesCountInput) {
            upMinutes.addEventListener('click', function() {
                minutesCountInput.value = prevMinute.textContent;
                updateMinuteNeighbors();
            });
            downMinutes.addEventListener('click', function() {
                minutesCountInput.value = nextMinute.textContent;
                updateMinuteNeighbors();
            });
        }
    }

    if(upSeconds) {
        if(secondsCountInput) {
            upSeconds.addEventListener('click', function() {
                secondsCountInput.value = prevSecond.textContent;
                updateSecondNeighbors();
            });
            downSeconds.addEventListener('click', function() {
                secondsCountInput.value = nextSecond.textContent;
                updateSecondNeighbors();
            });
        }
    }

    function updateHourNeighbors() {
        const currentValue = parseInt(hoursCountInput.value, 10);

        if (isNaN(currentValue)) {
            prevHour.textContent = "99";
            nextHour.textContent = "1";
            return;
        }

        if (currentValue === 0) {
            prevHour.textContent = "99";
        } else {
            prevHour.textContent = currentValue - 1;
        }

        if (currentValue === 99) {
            nextHour.textContent = "0";
        } else {
            nextHour.textContent = currentValue + 1;
        }
    }

    function updateMinuteNeighbors() {
        const currentValue = parseInt(minutesCountInput.value, 10);

        if (isNaN(currentValue)) {
            prevMinute.textContent = "59";
            nextMinute.textContent = "1";
            return;
        }

        if (currentValue === 0) {
            prevMinute.textContent = "59";
        } else {
            prevMinute.textContent = currentValue - 1;
        }

        if (currentValue === 59) {
            nextMinute.textContent = "0";
        } else {
            nextMinute.textContent = currentValue + 1;
        }
    }

    function updateSecondNeighbors() {
        const currentValue = parseInt(secondsCountInput.value, 10);

        if (isNaN(currentValue)) {
            prevSecond.textContent = "59";
            nextSecond.textContent = "1";
            return;
        }

        if (currentValue === 0) {
            prevSecond.textContent = "59";
        } else {
            prevSecond.textContent = currentValue - 1;
        }

        if (currentValue === 59) {
            nextSecond.textContent = "0";
        } else {
            nextSecond.textContent = currentValue + 1;
        }
    }
}

  inputButtons();