//This is the js script for the alarm timers page as a part of the timer's system.
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//Global Variables
const timerCollection = firebase.firestore().collection("timers");
const presetName = document.getElementById('first-Name');
const presetHours = document.getElementById('first-hours');
const presetMinutes = document.getElementById('first-minutes');
const presetTime = document.getElementById('first-seconds');

const hoursCountInput = document.getElementById('hoursCount');
const minutesCountInput = document.getElementById('minutesCount');
const timeInput = document.getElementById('secondsCount');

const prevHour = document.getElementById('prevHour');
const nextHour = document.getElementById('nextHour');
const prevMinute = document.getElementById('prevMinute');
const nextMinute = document.getElementById('nextMinute');
const prevTime = document.getElementById('prevSecond');
const nextTime = document.getElementById('nextSecond');

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


firebase.auth().onAuthStateChanged(user => {
  if (user) { // Check if the user is signed in
    const addButton = document.getElementById('addTimerButton');
    const currentUserId = user.uid; //store unique ID of signed-in user.
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("alarms"); //reference timers subcollection of the current user.

    timerCollection.get()
      .then(snapshot => {
        if (snapshot.size >= 10) { //if there are more than or equal to 10 alarms disable timer.
          if (addButton) {
            addButton.disabled = true; //disable add button.
            addButton.textContent = "(Capacity of 10 Alarms Reached)"; //once there are 10 alarms created the create alarm button is disabled.
          }
        } else {
          if (addButton) {
            addButton.disabled = false; //enables add button.
            addButton.textContent = "Create Alarm"; //if there are less than 10 alarms allow user to create alarms
          }
        }
      })
      .catch(error => {
        console.error("Error checking alarms count:", error);
      });

    timerCollection
      .orderBy("timerValue", "asc") //order timers by time (ascending)
      .get() //fetch documents in alarms collection.
      .then(snapshot => {
        if (!snapshot.empty) { //if snapshot contains documents
          snapshot.docs.forEach((doc, index) => { //for each document in the alarms collection run the code.
            const timerData = doc.data(); //get document data.
            const timerId = doc.id; //get the timer document ID.

            const presetName = document.querySelectorAll('.preset-name')[index];
            const presetHours = document.querySelectorAll('.preset-hours')[index];
            const presetMinutes = document.querySelectorAll('.preset-minutes')[index];
            const presetTime = document.querySelectorAll('.preset-seconds')[index];
            const presetListItem = document.querySelectorAll('.list-group-item.preset')[index];
            const deleteButton = document.querySelectorAll('.delete-timer')[index];

            //update text depending on document data.
            presetName.textContent = timerData.presetName;
            presetHours.textContent = formatLeadZero(timerData.hours) + " : ";
            presetMinutes.textContent = formatLeadZero(timerData.minutes);
            presetTime.textContent = timerData.amPm;
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
              const timerId = button.getAttribute('data-id'); // Get the ID from the data-id attribute.

              if (timerId) {
                deleteTimerFromFirestore(timerId); //Deletes the timer based off corresponding delete button.
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
  const user = firebase.auth().currentUser; // Retrieve the currently authenticated user.

  if (user) { // Proceed only if a user is signed in.
    const currentUserId = user.uid; // Get the unique ID of the signed-in user.
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("alarms"); // Reference the user's alarms collection in Firestore.

    timerCollection.doc(timerId).delete() // Attempt to delete the document with the given timerId.
      .then(() => {
        const timerElement = document.querySelector(`button[data-id='${timerId}']`).closest('.preset'); // Locate the DOM element associated with the timer.
        if (timerElement) { // Ensure the element exists before removing it.
          timerElement.remove(); // Remove the timer element from the DOM to update the UI.
        }
      })
      .catch(error => {
        console.error("Error deleting timer: ", error);
      });
  } else {
    console.log("No user is signed in.");
  }
}




//if user clicks add save alarm button runs following code.
document.getElementById("savePreset").addEventListener("click", function () {
  const user = firebase.auth().currentUser;

  if (user) {
    //stores values in the input fields.
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

    //stores all inputted values and gets the time created at.
    const timerPreset = {
      presetName: presetName || "Unnamed Timer",
      hours: hours,
      minutes: minutes,
      timerValue: timerValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      amPm: amPm
    };

    //adds inputted values to the alarms collection in a document.
    firebase.firestore().collection("users").doc(user.uid).collection("alarms").add(timerPreset)
      .then(function () {
        //logs to console the alarm that was saved and reloads page.
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

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//ensures values entered in fields follow the restrictions (maximum of 12 hours, no negative numbers).
function timeRestriction() {
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');

  if (hoursInput) {
    hoursInput.addEventListener('input', function () {
      if (this.value > 12) {
        this.value = "12"; //prevents hours from being set above 12
      }
      if (this.value < 1) {
        this.value = "01"; //prevents hours from being set below 1
      }
    });
  }

  if (minutesInput) {
    minutesInput.addEventListener('input', function () {
      if (this.value > 59) {
        this.value = "59"; //prevents minutes from being set above 59
      }
      if (this.value < 0) {
        this.value = "00"; //prevents minutes from being set below 0
      }
    });
  }
}

timeRestriction();

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//changes visibility of elements depending on clicked buttons.
function timerVisibility() {
  const addButton = document.getElementById('addTimerButton');
  const presetTimer = document.getElementById('presetTimerContainer');
  const cancelPreset = document.getElementById('cancelPreset');
  const savePreset = document.getElementById('savePreset');
  const savedTimerContainers = document.querySelectorAll('.presetTimer');

  //if user clicks add alarm button it hides the default page and only shows add alarm page
  if (addButton) {
    addButton.addEventListener('click', function () {
      if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
        presetTimer.style.display = 'block';
        savedTimerContainers.forEach(container => { //upon clicking add button it hides the already shown display and shows the add alarm page
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

  //if user cancels action to add alarm the default page shows again
  if (cancelPreset) {
    cancelPreset.addEventListener('click', function () { //upon clicking cancel to add alarm it shows all the default user interfaces
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

  //if user saves alarm the default page shows again
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

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//toggles the alarms, start or stop.
function toggleActiveStatus() {
  const toggleButtons = document.querySelectorAll('.form-check-input.preset');
  const toggleStatuses = document.querySelectorAll('.form-check-label.preset');

  //applies code individually to each toggle button.
  toggleButtons.forEach((toggleButton, index) => {
    const toggleStatus = toggleStatuses[index];
    //if toggle button is changed run the code.
    toggleButton.addEventListener('change', function () {
      //if toggle button is checked (on) text is changed to active and alarm starts.
      if (toggleButton.checked) {
        toggleStatus.textContent = "Active";
        startAlarm(index);
      } else { //else set text to inactive.
        toggleStatus.textContent = "Inactive";
      }
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////////////////////////////////
  //toggles visibility of delete buttons.
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

  //if manage alarms button is clicked show delete buttons.
  document.getElementById('manageAlarmsButton').addEventListener('click', toggleDeleteButtons);


  //////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////////////////////////////////
  //starts countdown for specific alarm activated.
  function startAlarm(index) {
    const alarmTime = getPresetTime(index);
    //starts interval which repeats every second.
    const alarmInterval = setInterval(function () { // set an interval to check the time every second.
      const currentTime = new Date(); // get the current date and time.
      const currentHours = currentTime.getHours(); // extract the current hours (24-hour format).
      const currentMinutes = currentTime.getMinutes(); // extract the current minutes.
      const currentAmPm = currentHours >= 12 ? "P.M." : "A.M."; // determine if it's AM or PM based on the current hour.

      const [presetHours, presetMinutes, presetAmPm] = alarmTime;

      let adjustedHours;

      // adjust the preset hours for AM/PM format.
      if (presetAmPm === "P.M." && presetHours !== 12) {
        adjustedHours = presetHours + 12; // convert PM hours to 24-hour format.
      } else if (presetAmPm === "A.M." && presetHours === 12) {
        adjustedHours = 0; // convert 12 AM to 0 (midnight) in 24-hour format.
      } else {
        adjustedHours = presetHours;
      }

      // check if the current time matches the preset alarm time.
      if (currentHours === adjustedHours && currentMinutes === presetMinutes && currentAmPm === presetAmPm) {
        clearInterval(alarmInterval); // clear the interval once the alarm time is reached.
        alert("Time's up! Alarm is ringing."); // show an alert indicating the alarm time is up.
        toggleButtons[index].checked = false; // uncheck the toggle button to deactivate the alarm.
        toggleStatuses[index].textContent = "Inactive"; // update the status text to show the alarm is inactive.
      }
    }, 1000);


    // gets set times.
    function getPresetTime(index) {
      const hours = parseInt(document.querySelectorAll('.preset-hours')[index].textContent.trim().split(' : ')[0], 10);
      const minutes = parseInt(document.querySelectorAll('.preset-minutes')[index].textContent.trim(), 10);
      const amPm = document.querySelectorAll('.preset-seconds')[index].textContent.trim();
      return [hours, minutes, amPm];
    }
  }
}

toggleActiveStatus();


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

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//updates the neighboring hour values in the display.
function updateHourNeighbors() {
  const currentValue = parseInt(hoursCountInput.value, 10);
  //by default the neighboring values are 11 and 01.
  if (isNaN(currentValue)) {
    prevHour.textContent = "11";
    nextHour.textContent = "01";
    return;
  }

  //ensures neighboring values follow order of maximum 12 minimum 1, else the previous hour will always be the hour-1.
  if (currentValue === 1) {
    prevHour.textContent = "12";
  } else {
    prevHour.textContent = formatLeadZero(currentValue - 1);
  }

  //ensures neighboring values follow order of maximum 12 minimum 1, else the next hour will always be the hour+1.
  if (currentValue === 12) {
    nextHour.textContent = "01";
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
//updates the neighboring text of am or pm in the display.
function updateTimeNeighbors() {
  const currentValue = timeInput.value.trim();
  //ensure when input is A.M. both neighbors are P.M. or the other way around.
  if (currentValue === "A.M.") {
    prevTime.textContent = "P.M.";
    nextTime.textContent = "P.M.";
  } else if (currentValue === "P.M.") {
    prevTime.textContent = "A.M.";
    nextTime.textContent = "A.M.";
  } else {
    timeInput.value = "A.M.";
    prevTime.textContent = "P.M.";
    nextTime.textContent = "P.M.";
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//uses the update neighbor functions to change the display if user clicks on according button.
function inputButtons() {
  const upHours = document.getElementById('upHours');
  const downHours = document.getElementById('downHours');
  const upMinutes = document.getElementById('upMinutes');
  const downMinutes = document.getElementById('downMinutes');
  const upTime = document.getElementById('upSeconds');
  const downTime = document.getElementById('downSeconds');
  if (upHours && downHours) {
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

  if (upMinutes && downMinutes) {
    //if user clicks on up minute arrow button the input will be changed to the previous minute.
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

  if (upTime && downTime) {
    //if user clicks on up time arrow button the input will be changed to the previous time text.
    upTime.addEventListener('click', function () {
      timeInput.value = prevTime.textContent;
      updateTimeNeighbors();
    });
    //if user clicks on down time arrow button the input will be changed to the next time text.
    downTime.addEventListener('click', function () {
      timeInput.value = nextTime.textContent;
      updateTimeNeighbors();
    });
  }
}

updateTimeNeighbors();
inputButtons();
