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
  if (user) { // Check if the user is signed in
    const addButton = document.getElementById('addTimerButton');
    const currentUserId = user.uid;
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("alarms");

    timerCollection.get()
      .then(snapshot => {
        if (snapshot.size >= 10) { //if there are more than or equal to 10 alarms disable timer
          if (addButton) {
            addButton.disabled = true;
            addButton.textContent = "(Capacity of 10 Alarms Reached)";
          }
        } else {
          if (addButton) {
            addButton.disabled = false;
            addButton.textContent = "Create Alarm";
          }
        }
      })
      .catch(error => {
        console.error("Error checking alarms count:", error);
      });

    timerCollection
      .orderBy("timerValue", "asc") // Order timers by time (ascending)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          snapshot.docs.forEach((doc, index) => {
            const timerData = doc.data();
            const timerId = doc.id; // Get the timer document ID

            const presetName = document.querySelectorAll('.preset-name')[index];
            const presetHours = document.querySelectorAll('.preset-hours')[index];
            const presetMinutes = document.querySelectorAll('.preset-minutes')[index];
            const presetSeconds = document.querySelectorAll('.preset-seconds')[index];
            const presetListItem = document.querySelectorAll('.list-group-item.preset')[index];
            const deleteButton = document.querySelectorAll('.delete-timer')[index];

            presetName.textContent = timerData.presetName;
            presetHours.textContent = formatLeadZero(timerData.hours) + " : ";
            presetMinutes.textContent = formatLeadZero(timerData.minutes);
            presetSeconds.textContent = timerData.amPm;
            presetListItem.style.display = 'flex';
            presetListItem.style.paddingTop = '0.5rem';
            presetListItem.style.marginBottom = '0.5rem';

            // Set the data-id of the delete button to the timer's ID
            if (deleteButton) {
              deleteButton.setAttribute('data-id', timerId);
            }
          });

          const deleteButtons = document.querySelectorAll('.delete-timer');
          deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
              const timerId = button.getAttribute('data-id'); // Get the ID from the data-id attribute

              if (timerId) {
                deleteTimerFromFirestore(timerId); //Deletes the timer based off corresponding delete button
                addButton.disabled = false;
                addButton.textContent = "Create Alarm";
              }
            });
          });

        } else {
          console.log("No timers found");
        }
      })
      .catch(error => {
        console.error("Error fetching timers:", error);
      });
  } else {
    console.log("User is not signed in");
  }
});

function deleteTimerFromFirestore(timerId) {
  const user = firebase.auth().currentUser;

  if (user) {
    const currentUserId = user.uid;
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("alarms");

    timerCollection.doc(timerId).delete()
      .then(() => {
        console.log(`Timer with ID ${timerId} deleted successfully!`);

        const timerElement = document.querySelector(`button[data-id='${timerId}']`).closest('.preset');
        if (timerElement) {
          timerElement.remove();
        }
      })
      .catch(error => {
        console.error("Error deleting timer: ", error);
      });
  } else {
    console.log("No user is signed in.");
  }
}



document.getElementById("savePreset").addEventListener("click", function () {
  const user = firebase.auth().currentUser;

  if (user) {
    const presetName = document.getElementById("presetName").value.trim();
    const hours = parseInt(document.getElementById("hoursCount").value.trim()) || 12;
    const minutes = parseInt(document.getElementById("minutesCount").value.trim()) || 0;
    const amPm = document.getElementById("secondsCount").value.trim();

    let timerValue = hours * 60 + minutes;  // Convert time to minutes
    if (amPm === "P.M." && hours !== 12) {
      timerValue += 12 * 60; //Add 12 hours for PM if it's not 12
    } else if (amPm === "A.M." && hours === 12) {
      timerValue = 0 + minutes;
    }

    const timerPreset = {
      presetName: presetName || "Unnamed Timer",
      hours: hours,
      minutes: minutes,
      timerValue: timerValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      amPm: amPm
    };

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
  const toggleButtons = document.querySelectorAll('.form-check-input.preset');
  const toggleStatuses = document.querySelectorAll('.form-check-label.preset');

  toggleButtons.forEach((toggleButton, index) => {
    const toggleStatus = toggleStatuses[index];

    toggleButton.addEventListener('change', function () {
      if (toggleButton.checked) {
        toggleStatus.textContent = "Active";
        startAlarmCheck(index);
      } else {
        toggleStatus.textContent = "Inactive";
        toggleButton.disabled = false;
      }
    });
  });

  function toggleDeleteButtons() {
    var deleteButtons = document.querySelectorAll('.delete-timer');

    deleteButtons.forEach(function (button) {
      if (button.style.display === 'none' || button.style.display === '') {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    });
  }

  document.getElementById('manageAlarmsButton').addEventListener('click', toggleDeleteButtons);


  function startAlarmCheck(index) {
    const alarmTime = getPresetTime(index);
    const alarmInterval = setInterval(function () {
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentAmPm = currentHours >= 12 ? "P.M." : "A.M.";

      const [presetHours, presetMinutes, presetAmPm] = alarmTime;

      let adjustedHours;

      if (presetAmPm === "P.M." && presetHours !== 12) {
        adjustedHours = presetHours + 12;
      } else if (presetAmPm === "A.M." && presetHours === 12) {
        adjustedHours = 0;
      } else {
        adjustedHours = presetHours;
      }

      if (currentHours === adjustedHours && currentMinutes === presetMinutes && currentAmPm === presetAmPm) {
        clearInterval(alarmInterval);
        alert("Time's up! Alarm is ringing.");
        toggleButtons[index].checked = false;
        toggleStatuses[index].textContent = "Inactive";
      }
    }, 1000);
  }

  function getPresetTime(index) {
    const hours = parseInt(document.querySelectorAll('.preset-hours')[index].textContent.trim().split(' : ')[0], 10);
    const minutes = parseInt(document.querySelectorAll('.preset-minutes')[index].textContent.trim(), 10);
    const amPm = document.querySelectorAll('.preset-seconds')[index].textContent.trim();
    return [hours, minutes, amPm];
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
  const currentValue = secondsCountInput.value.trim();

  if (currentValue === "A.M.") {
    prevSecond.textContent = "P.M.";
    nextSecond.textContent = "P.M.";
  } else if (currentValue === "P.M.") {
    prevSecond.textContent = "A.M.";
    nextSecond.textContent = "A.M.";
  } else {
    secondsCountInput.value = "A.M.";
    prevSecond.textContent = "P.M.";
    nextSecond.textContent = "P.M.";
  }
}

function inputButtons() {
  if (upHours && downHours) {
    upHours.addEventListener('click', function () {
      hoursCountInput.value = prevHour.textContent;
      updateHourNeighbors();
    });
    downHours.addEventListener('click', function () {
      hoursCountInput.value = nextHour.textContent;
      updateHourNeighbors();
    });
  }

  if (upMinutes && downMinutes) {
    upMinutes.addEventListener('click', function () {
      minutesCountInput.value = prevMinute.textContent;
      updateMinuteNeighbors();
    });
    downMinutes.addEventListener('click', function () {
      minutesCountInput.value = nextMinute.textContent;
      updateMinuteNeighbors();
    });
  }

  if (upSeconds && downSeconds) {
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

updateSecondNeighbors();
inputButtons();
