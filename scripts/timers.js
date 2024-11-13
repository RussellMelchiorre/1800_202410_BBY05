const timerCollection = firebase.firestore().collection("timers");
const presetName = document.getElementById('first-Name');
const presetHours = document.getElementById('first-hours');
const presetMinutes = document.getElementById('first-minutes');
const presetSeconds = document.getElementById('first-seconds');

firebase.auth().onAuthStateChanged(user => {
  if (user) { //check if user is signed in

    const currentUserId = user.uid;
    const timerCollection = firebase.firestore().collection("users").doc(currentUserId).collection("timers");

    const presetName = document.querySelectorAll('.preset-name');
    const presetHours = document.querySelectorAll('.preset-hours');
    const presetMinutes = document.querySelectorAll('.preset-minutes');
    const presetSeconds = document.querySelectorAll('.preset-seconds');

    if (currentUserId && timerCollection) {
      timerCollection
        .orderBy("createdAt", "desc") //documents ordered in descending order based off when it was created
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) { //if snapshot got anything
            const formatLeadZero = (time) => (time < 10 ? "0" + time : time); //if time is less than 10 add a leading 0 to the time
            snapshot.docs.forEach((doc, index) => { //for each document in the timer collection run the code
              if (index < presetName.length) {
                const timerData = doc.data();
                presetName[index].textContent = timerData.presetName; //
                presetHours[index].textContent = formatLeadZero(timerData.hours) + " : ";
                presetMinutes[index].textContent = formatLeadZero(timerData.minutes) + " : ";
                presetSeconds[index].textContent = formatLeadZero(timerData.seconds);
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

    db.collection("users").doc(user.uid).collection("timers").add(timerPreset)
      .then(function () {
        console.log("Timer preset saved:", timerPreset);
      })
      .catch(function (error) {
        console.error("Error saving preset timer: ", error);
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
      //if user enters value over 99 hours or below 0 hours it is automatically set to corresponding value
      if (this.value > 99) {
        this.value = 99;
      }
      if (this.value < 0) {
        this.value = 0;
      }
    });
  }

  if (minutesInput) {
    minutesInput.addEventListener('input', function () {
      //if user enters value over 59 minutes or below 0 minutes it is automatically set to corresponding value
      if (this.value > 59) {
        this.value = 59;
      }
      if (this.value < 0) {
        this.value = 0;
      }
    });
  }

  if (secondsInput) {
    secondsInput.addEventListener('input', function () {
      //if user enters value over 59 seconds or below 0 seconds it is automatically set to corresponding value
      if (this.value > 59) {
        this.value = 59;
      }
      if (this.value < 0) {
        this.value = 0;
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
  const toggleButton = document.querySelectorAll('.form-check-input');
  const toggleStatuses = document.querySelectorAll('.form-check-label');

  toggleButton.forEach((toggleButton, index) => {
    const toggleStatus = toggleStatuses[index];
    if (toggleButton) {
      toggleButton.addEventListener('change', function () {
        if (toggleButton.checked) {
          toggleStatus.textContent = "Active";
        } else {
          toggleStatus.textContent = "Inactive";
        }
      });
    }
  });
}

toggleActiveStatus();