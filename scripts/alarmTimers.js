const timerCollection = firebase.firestore().collection("timers");
const presetName = document.getElementById('first-Name');
const presetHours = document.getElementById('first-hours');
const presetMinutes = document.getElementById('first-minutes');
const presetSeconds = document.getElementById('first-seconds');

function formatLeadZero(time) {
  if (time < 10) {
    return "0" + time;
  } else {
    return time;
  }
}

firebase.auth().onAuthStateChanged(user => {
  if (user) { //check if user is signed in

    const currentUserId = user.uid;
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("alarms"); // Updated to 'alarms' collection

    const presetName = document.querySelectorAll('.preset-name');
    const presetHours = document.querySelectorAll('.preset-hours');
    const presetMinutes = document.querySelectorAll('.preset-minutes');
    const presetSeconds = document.querySelectorAll('.preset-seconds');
    const presetListItem = document.querySelectorAll('.list-group-item.preset');

    if (currentUserId && timerCollection) {
      timerCollection
        .orderBy("createdAt", "desc") //documents ordered in descending order based off when it was created
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) { //if snapshot got anything
            snapshot.docs.forEach((doc, index) => { //for each document in the alarm collection run the code
              if (index < presetName.length) {
                const timerData = doc.data();
                presetName[index].textContent = timerData.presetName;
                presetHours[index].textContent = formatLeadZero(timerData.hours) + " : ";
                presetMinutes[index].textContent = formatLeadZero(timerData.minutes) + " : ";
                presetSeconds[index].textContent = formatLeadZero(timerData.seconds);
                presetListItem[index].style.display = 'flex';
                presetListItem[index].style.paddingTop = '0.5rem';
              }
            });
          } else {
            console.log("No timers found");
          }
        })
        .catch((error) => {
          console.error("Error fetching timers:", error);
        });
    }
  } else {
    console.log("User is not signed in");
  }
});

document.getElementById("savePreset").addEventListener("click", function () {
  const user = firebase.auth().currentUser;

  if (user) {
    const presetName = document.getElementById("presetName").value;
    const hours = document.getElementById("hours").value;
    const minutes = document.getElementById("minutes").value;
    const seconds = document.getElementById("seconds").value;

    const timerPreset = {
      presetName: presetName || "",
      hours: parseInt(hours) || 0,
      minutes: parseInt(minutes) || 0,
      seconds: parseInt(seconds) || 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Save to alarms collection
    firebase.firestore().collection("users").doc(user.uid).collection("alarms").add(timerPreset)
      .then(function () {
        console.log("Timer preset saved:", timerPreset);
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Error saving timer preset: ", error);
      });

  } else {
    console.log("No user is signed in.");
  }
});

function timeRestriction() {
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const secondsInput = document.getElementById('seconds');

  if (hoursInput) {
    hoursInput.addEventListener('input', function () {
      if (this.value > 12) {
        this.value = "12";
      }
      if (this.value < 1) {
        this.value = "01";
      }
    });
  }

  if (minutesInput) {
    minutesInput.addEventListener('input', function () {
      if (this.value > 59) {
        this.value = "59";
      }
      if (this.value < 0) {
        this.value = "00";
      }
    });
  }

  if (secondsInput) {
    secondsInput.addEventListener('input', function () {
      if (this.value > 59) {
        this.value = "59";
      }
      if (this.value < 0) {
        this.value = "00";
      }
    });
  }
}

timeRestriction();

function timerVisibility() {
  const addButton = document.getElementById('addTimerButton');
  const presetTimer = document.getElementById('presetTimerContainer');
  const cancelPreset = document.getElementById('cancelPreset');
  const savePreset = document.getElementById('savePreset');
  const savedTimerContainers = document.querySelectorAll('.presetTimer');

  if (addButton) {
    addButton.addEventListener('click', function () {
      if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
        presetTimer.style.display = 'block';
        savedTimerContainers.forEach(container => {
          container.style.display = 'none';
        });
      } else {
        presetTimer.style.display = 'none';
        savedTimerContainers.forEach(container => {
          container.style.display = 'block';
        });
      }
    });
  }

  if (cancelPreset) {
    cancelPreset.addEventListener('click', function () {
      if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
        presetTimer.style.display = 'block';
        savedTimerContainers.forEach(container => {
          container.style.display = 'none';
        });
      } else {
        presetTimer.style.display = 'none';
        savedTimerContainers.forEach(container => {
          container.style.display = 'block';
        });
      }
    });
  }

  if (savePreset) {
    savePreset.addEventListener('click', function () {
      if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
        presetTimer.style.display = 'block';
        window.reload();
        savedTimerContainers.forEach(container => {
          container.style.display = 'none';
        });
      } else {
        presetTimer.style.display = 'none';
        savedTimerContainers.forEach(container => {
          container.style.display = 'block';
        });
      }
    });
  }
}

timerVisibility();

function toggleActiveStatus() {
  const toggleButton = document.querySelectorAll('.form-check-input.preset');
  const toggleStatuses = document.querySelectorAll('.form-check-label.preset');
  const presetHours = document.querySelectorAll('.preset-hours');
  const presetMinutes = document.querySelectorAll('.preset-minutes');
  const presetSeconds = document.querySelectorAll('.preset-seconds');

  toggleButton.forEach((toggleButton, index) => {
    const toggleStatus = toggleStatuses[index];

    if (toggleButton) {
      toggleButton.addEventListener('change', function () {
        if (toggleButton.checked) {
          toggleStatus.textContent = "Active";
          toggleButton.disabled = true;
          startCountdown(index);
        } else {
          toggleStatus.textContent = "Inactive";
          toggleButton.disabled = false;
        }
      });
    }
  });

  function startCountdown(index) {
    const originalHours = parseInt(presetHours[index].textContent.split(' : ')[0]);
    const originalMinutes = parseInt(presetMinutes[index].textContent.split(' : ')[0]);
    const originalSeconds = parseInt(presetSeconds[index].textContent);

    let hours = originalHours;
    let minutes = originalMinutes;
    let seconds = originalSeconds;

    let countdownInterval = setInterval(function () {
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

      presetHours[index].textContent = formatLeadZero(hours) + " : ";
      presetMinutes[index].textContent = formatLeadZero(minutes) + " : ";
      presetSeconds[index].textContent = formatLeadZero(seconds);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(countdownInterval);

        setTimeout(function () {
          if (hours === 0 && minutes === 0 && seconds === 0) {
            alert("Time's up!");
          }

          presetHours[index].textContent = formatLeadZero(originalHours) + " : ";
          presetMinutes[index].textContent = formatLeadZero(originalMinutes) + " : ";
          presetSeconds[index].textContent = formatLeadZero(originalSeconds);

          toggleButton[index].disabled = false;
          toggleButton[index].checked = false;
          toggleStatuses[index].textContent = "Inactive";
        });
      }
    }, 1000);

  }
}

toggleActiveStatus();


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
            //if user enters value over hour of 12 or below hour 1 it is automatically set to corresponding value
            if (this.value > 12) {
                this.value = "12";
            }
            if (this.value < 1) {
                this.value = "01";
            }
            updateHourNeighbors();
        });
    }

    if (minutesCountInput) {
        minutesCountInput.addEventListener('input', function () {
            //if user enters value over minute 59 or below minute 0 it is automatically set to corresponding value
            if (this.value > 59) {
                this.value = "59";
            }
            if (this.value < 0) {
                this.value = "00";
            }
            updateMinuteNeighbors();
        });
    }
}

timeRestriction();

function updateHourNeighbors() {
    const currentValue = parseInt(hoursCountInput.value, 10);

    if (isNaN(currentValue)) {
        prevHour.textContent = "11";
        nextHour.textContent = "01";
        return;
    }

    if (currentValue === 1) {
        prevHour.textContent = "12";
    } else {
        prevHour.textContent = formatLeadZero(currentValue - 1);
    }

    if (currentValue === 12) {
        nextHour.textContent = "01";
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
  const currentValue = secondsCountInput.value;

  if (currentValue === "A.M.") {
      prevSecond.textContent = "P.M.";
      nextSecond.textContent = "P.M.";
  } else if (currentValue === "P.M.") {
      prevSecond.textContent = "A.M.";
      nextSecond.textContent = "A.M.";
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
