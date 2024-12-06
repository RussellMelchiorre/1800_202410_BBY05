//This is the js script for the preset timers page as a part of the timer's system.
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//Global Variables
const timerCollection = firebase.firestore().collection("timers");
const presetName = document.getElementById('first-Name');
const presetHours = document.getElementById('first-hours');
const presetMinutes = document.getElementById('first-minutes');
const presetSeconds = document.getElementById('first-seconds');

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
  if (user) { //check if user is signed in.

    const currentUserId = user.uid; //store unique ID of signed-in user.
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("timers"); //reference timers subcollection of the current user.

    const presetName = document.querySelectorAll('.preset-name');
    const presetHours = document.querySelectorAll('.preset-hours');
    const presetMinutes = document.querySelectorAll('.preset-minutes');
    const presetSeconds = document.querySelectorAll('.preset-seconds');
    const presetListItem = document.querySelectorAll('.list-group-item.preset');

    if (currentUserId && timerCollection) { //ensure current user ID and timer collection exist before proceeding.
      timerCollection
        .orderBy("createdAt", "desc") //documents ordered in descending order based off when it was created
        .get() //fetch document in timers collection.
        .then((snapshot) => {
          if (!snapshot.empty) { //if snapshot contains documents.
            snapshot.docs.forEach((doc, index) => { //for each document in the timer collection run the code
              if (index < presetName.length) {
                const timerData = doc.data(); //get document data.
                //style according text depending on values in the documents.
                presetName[index].textContent = timerData.presetName;
                presetHours[index].textContent = formatLeadZero(timerData.hours) + " : ";
                presetMinutes[index].textContent = formatLeadZero(timerData.minutes) + " : ";
                presetSeconds[index].textContent = formatLeadZero(timerData.seconds);
                presetListItem[index].style.display = 'flex';
                presetListItem[index].style.marginTop = '0.5rem';
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

//if user clicks add save preset button runs following code.
document.getElementById("savePreset").addEventListener("click", function () {
  const user = firebase.auth().currentUser;

  if (user) {
    //stores values in the input fields.
    const presetName = document.getElementById("presetName").value;
    const hours = document.getElementById("hours").value;
    const minutes = document.getElementById("minutes").value;
    const seconds = document.getElementById("seconds").value;

    //stores all inputted values and gets the time created at.
    const timerPreset = {
      presetName: presetName || "",
      hours: parseInt(hours) || 0,
      minutes: parseInt(minutes) || 0,
      seconds: parseInt(seconds) || 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    //adds inputted values to the timers collection in a document.
    db.collection("users").doc(user.uid).collection("timers").add(timerPreset)
      .then(function () {
        //logs to console the timer that was saved and reloads page.
        console.log("Timer preset saved:", timerPreset);
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Error saving preset timer: ", error);
      });
  } else {
    console.log("No user is signed in.");
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//ensures values entered in fields follow the restrictions (maximum of 99 hours, 59 minutes and seconds, no negative numbers).
function timeRestriction() {
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const secondsInput = document.getElementById('seconds');

  if (hoursInput) {
    hoursInput.addEventListener('input', function () {
      //if user enters value over 99 hours or below 0 hours it is automatically set to corresponding value
      if (this.value > 99) {
        this.value = "99";
      }
      if (this.value < 0) {
        this.value = "00";
      }
    });
  }

  if (minutesInput) {
    minutesInput.addEventListener('input', function () {
      //if user enters value over 59 minutes or below 0 minutes it is automatically set to corresponding value
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
      //if user enters value over 59 seconds or below 0 seconds it is automatically set to corresponding value
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

//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//changes visibility of elements depending on clicked buttons.
function timerVisibility() {
  const addButton = document.getElementById('addTimerButton');
  const presetTimer = document.getElementById('presetTimerContainer');
  const cancelPreset = document.getElementById('cancelPreset');
  const savePreset = document.getElementById('savePreset');
  const savedTimerContainers = document.querySelectorAll('.presetTimer');

  //if user clicks add preset timer button it hides the default page and only shows add preset timer page
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

  //if user cancels action to add preset timer the default page shows again
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

  //if user saves preset timers the default page shows again
  if (savePreset) {
    savePreset.addEventListener('click', function () {
      if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
        presetTimer.style.display = 'block';
        window.locationreload();
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
//toggles the timers and allows for cancelling, pausing, and starting timers.
function toggleActiveStatus() {
  const toggleButton = document.querySelectorAll('.form-check-input.preset');
  const toggleStatuses = document.querySelectorAll('.form-check-label.preset');
  const toggleStudyButton = document.querySelectorAll('.form-check-input.study');
  const toggleStudyStatuses = document.querySelectorAll('.form-check-label.study');
  const presetHours = document.querySelectorAll('.preset-hours');
  const presetMinutes = document.querySelectorAll('.preset-minutes');
  const presetSeconds = document.querySelectorAll('.preset-seconds');
  const studyPresetHours = document.querySelectorAll('.study-preset-hours');
  const studyPresetMinutes = document.querySelectorAll('.study-preset-minutes');
  const studyPresetSeconds = document.querySelectorAll('.study-preset-seconds');
  const pauseButtons = document.querySelectorAll('.pause-timer');
  const pauseStudyButtons = document.querySelectorAll('.pause-study-timer');
  const cancelButtons = document.querySelectorAll('.cancel-timer');
  const cancelStudyButtons = document.querySelectorAll('.cancel-study-timer');

  //applies code individually to each toggle button.
  toggleButton.forEach((toggleButton, index) => {
    const toggleStatus = toggleStatuses[index];
    const pauseButton = pauseButtons[index];
    const cancelButton = cancelButtons[index];

    if (toggleButton) {
      //if toggle button is changed run the code.
      toggleButton.addEventListener('change', function () {
        //if toggle button is checked (on) text is changed to active and button is disabled, cancel and pause button are shown, starts countdown.
        if (toggleButton.checked) {
          toggleStatus.textContent = "Active";
          toggleButton.disabled = true;
          pauseButton.style.display = 'block';
          cancelButton.style.display = 'block';
          startCountdown(index);
        } else { //else set text to inactive and ensure toggle button is enabled, hide cancel and pause buttons.
          toggleStatus.textContent = "Inactive";
          toggleButton.disabled = false;
          pauseButton.style.display = 'none';
          cancelButton.style.display = 'none';
        }
      });
    }
  });

  //applies code individually to each study toggle button.
  toggleStudyButton.forEach((toggleStudyButton, index) => {
    const toggleStudyStatus = toggleStudyStatuses[index];
    const pauseStudyButton = pauseStudyButtons[index];
    const cancelStudyButton = cancelStudyButtons[index];

    if (toggleStudyButton) {
      //if study toggle button is changed run the code.
      toggleStudyButton.addEventListener('change', function () {
        //if study toggle button is checked (on) text is changed to active and button is disabled, cancel and pause button are shown, starts countdown.
        if (toggleStudyButton.checked) {
          toggleStudyStatus.textContent = "Active";
          toggleStudyButton.disabled = true;
          pauseStudyButton.style.display = 'block';
          cancelStudyButton.style.display = 'block';
          startStudyCountdown(index);
        } else { //else set tex to inactive and ensure study toggle button is enabled, hide cancel and pause buttons.
          toggleStudyStatus.textContent = "Inactive";
          toggleStudyButton.disabled = false;
          pauseStudyButton.style.display = 'none';
          cancelStudyButton.style.display = 'none';
        }
      });
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////////////////////////////////
  //starts countdown for specific timer activated.
  function startCountdown(index) {
    const originalHours = parseInt(presetHours[index].textContent.split(' : ')[0]);
    const originalMinutes = parseInt(presetMinutes[index].textContent.split(' : ')[0]);
    const originalSeconds = parseInt(presetSeconds[index].textContent);

    const cancelButtonIndex = document.querySelectorAll('.cancel-timer')[index];
    const pauseButtonIndex = document.querySelectorAll('.pause-timer')[index];

    let hours = originalHours;
    let minutes = originalMinutes;
    let seconds = originalSeconds;

    let paused = false;
    let cancelled = false;

    //starts interval which repeats every second.
    let countdownInterval = setInterval(function () {
      if (!paused) {
        //once seconds is 0 minus from minutes.
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) { //minus from minutes if seconds is 0, sets seconds to 59.
          minutes--;
          seconds = 59;
        } else if (hours > 0) { //minus from hours if minutes is 0, sets minutes and seconds to 59 if minutes and seconds are 0.
          hours--;
          minutes = 59;
          seconds = 59;
        }
      }

      //ensures text follows proper format.
      presetHours[index].textContent = formatLeadZero(hours) + " : ";
      presetMinutes[index].textContent = formatLeadZero(minutes) + " : ";
      presetSeconds[index].textContent = formatLeadZero(seconds);

      //if timer is done or timer is cancelled stop interval and notify user that timer is up.
      if (hours === 0 && minutes === 0 && seconds === 0 || cancelled === true) {
        clearInterval(countdownInterval);

        setTimeout(function () {
          if (hours === 0 && minutes === 0 && seconds === 0) {
            showToast("Time's up!");
          }

          presetHours[index].textContent = formatLeadZero(originalHours) + " : ";
          presetMinutes[index].textContent = formatLeadZero(originalMinutes) + " : ";
          presetSeconds[index].textContent = formatLeadZero(originalSeconds);

          //of specific timer uncheck the toggle button and reenable it.
          toggleButton[index].disabled = false;
          toggleButton[index].checked = false;
          toggleStatuses[index].textContent = "Inactive";
          cancelled = false;
        });
      }
    }, 1000);

    //////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //cancels timer for specific timer.
    function cancelTimer(index) {
      //if cancel button of specific timer is clicked hide cancel and pause button and change cancelled variable to false.
      cancelButtonIndex.addEventListener('click', function () {
        cancelButtonIndex.style.display = 'none';
        pauseButtonIndex.style.display = 'none';
        cancelled = true;
      });
    }

    cancelTimer(index);

    //////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //pauses timer for specific timer.
    function pauseTimer(index) {
      //if pause button of specific timer is clicked change text of button to resume or pause accordingly.
      pauseButtonIndex.addEventListener('click', function () {
        paused = !paused; //toggle variable
        if (paused) {
          pauseButtonIndex.textContent = "Resume";
        } else {
          pauseButtonIndex.textContent = "Pause";
        }
      });
    }

    pauseTimer(index);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////////////////////////////////
  //starts study countdown for specific study timer activated.
  function startStudyCountdown(index) {
    const originalHours = parseInt(studyPresetHours[index].textContent.split(' : ')[0]);
    const originalMinutes = parseInt(studyPresetMinutes[index].textContent.split(' : ')[0]);
    const originalSeconds = parseInt(studyPresetSeconds[index].textContent);

    const cancelStudyButtonIndex = document.querySelectorAll('.cancel-study-timer')[index];
    const pauseStudyButtonIndex = document.querySelectorAll('.pause-study-timer')[index];

    let hours = originalHours;
    let minutes = originalMinutes;
    let seconds = originalSeconds;

    let paused = false;
    let cancelled = false;

    //starts interval which repeats every second.
    let countdownInterval = setInterval(function () {
      if (!paused) {
        //once seconds is 0 minus from minutes.
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) { //minus from minutes if seconds is 0, sets seconds to 59.
          minutes--;
          seconds = 59;
        } else if (hours > 0) { //minus from hours if minutes is 0, sets minutes and seconds to 59 if minutes and seconds are 0.
          hours--;
          minutes = 59;
          seconds = 59;
        }
      }

      //ensures text follows proper format.
      studyPresetHours[index].textContent = formatLeadZero(hours) + " : ";
      studyPresetMinutes[index].textContent = formatLeadZero(minutes) + " : ";
      studyPresetSeconds[index].textContent = formatLeadZero(seconds);

      //if study timer is done or study timer is cancelled stop interval and notify user that timer is up.
      if (hours === 0 && minutes === 0 && seconds === 0 || cancelled === true) {
        clearInterval(countdownInterval);

        setTimeout(function () {
          if (hours === 0 && minutes === 0 && seconds === 0) {
            alert("Time's up!");
          }

          studyPresetHours[index].textContent = formatLeadZero(originalHours) + " : ";
          studyPresetMinutes[index].textContent = formatLeadZero(originalMinutes) + " : ";
          studyPresetSeconds[index].textContent = formatLeadZero(originalSeconds);

          //of specific timer uncheck the toggle button and reenable it.
          toggleStudyButton[index].disabled = false;
          toggleStudyButton[index].checked = false;
          toggleStudyStatuses[index].textContent = "Inactive";
          cancelled = false;
        });
      }
    }, 1000);

    //////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //pauses timer for specific study timer.
    function pauseStudyTimer(index) {
      //if pause button of specific timer is clicked change text of button to resume or pause accordingly.
      pauseStudyButtonIndex.addEventListener('click', function () {
        paused = !paused; //toggle variable
        if (paused) {
          pauseStudyButtonIndex.textContent = "Resume";
        } else {
          pauseStudyButtonIndex.textContent = "Pause";
        }
      });
    }

    pauseStudyTimer(index);

    //////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////////////
    //cancels timer for specific study timer.
    function cancelStudyTimer(index) {
      //if cancel button of specific timer is clicked hide cancel and pause button and change cancelled variable to false.
      cancelStudyButtonIndex.addEventListener('click', function () {
        cancelStudyButtonIndex.style.display = 'none';
        pauseStudyButtonIndex.style.display = 'none';
        cancelled = true;
      });
    }

    cancelStudyTimer(index);
  }
}

toggleActiveStatus();
