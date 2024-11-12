function getNameFromAuth() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here: 
      console.log(user.uid); //print the uid in the browser console
      console.log(user.displayName);  //print the user name in the browser console
     const userName = user.displayName;
     const userEmail = user.email;
      //method #1:  insert with JS
       // gets user id and email and also checks if the element exists to avoid the null error
      const nameElement = document.getElementById("name-goes-here");
      if (nameElement) {
        nameElement.innerText = userName;
      }
      const emailElement = document.getElementById("email-goes-here");
      if (emailElement) {
        emailElement.innerText = userEmail;
      }
    }
  });
}
getNameFromAuth(); //run the function


// displays generic toast message
function showToast(message) {
  document.getElementById("toast-message").textContent = message;
  new bootstrap.Toast(document.getElementById("basicToast")).show();
}


var timerStart;

function start() {
  timerStart = performance.now(); //Holds value of time since the timer started
}

function updateElapsedTime() {
  const elapsed = Math.floor((performance.now() - timerStart) / 1000); //Gets the time difference from timerStart and the time now in seconds (1000 milliseconds)
  document.getElementById("time-goes-here").innerText = elapsed + " seconds ago";
}

const urlParams = new URLSearchParams(window.location.search);
const fromLogin = urlParams.get('from') === 'login';

if (fromLogin) {
  const toastLiveExample = document.getElementById('liveToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();

  start(); //Begins timer
  setInterval(updateElapsedTime, 1000); //Runs function updateElapsedTime() every second (1000 milliseconds)
}

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

if (hoursInput){
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


if (minutesInput){
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

if (secondsInput){
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

const addButton = document.getElementById('addTimerButton');
const presetTimer = document.getElementById('presetTimerContainer');
const cancelPreset = document.getElementById('cancelPreset');
const savePreset = document.getElementById('savePreset');
const savedTimerContainers = document.querySelectorAll('.presetTimer');

if(addButton){
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

if (cancelPreset){
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

if (savePreset){
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

const toggleButton = document.querySelectorAll('.form-check-input');
const toggleStatuses = document.querySelectorAll('.form-check-label');

toggleButton.forEach((toggleButton, index) => {
const toggleStatus = toggleStatuses[index];
if(toggleButton){
  toggleButton.addEventListener('change', function () {
    if(toggleButton.checked) {
      toggleStatus.textContent = "Active";
    } else {
      toggleStatus.textContent = "Inactive";
    }
  });
}});

function updateCalendar() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

 
  const firstDayOfWeek = firstDayOfMonth.getDay();

  
  const lastDate = lastDayOfMonth.getDate();

  let calendarDates = [];

 
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDates.push('');
  }


  for (let i = 1; i <= lastDate; i++) {
    calendarDates.push(i);
  }


  while (calendarDates.length % 7 !== 0) {
    calendarDates.push('');
  }


  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';

  let row = document.createElement('tr');
  calendarDates.forEach((date, index) => {
    if (index % 7 === 0 && index !== 0) {
      tableBody.appendChild(row);
      row = document.createElement('tr');
    }
    const cell = document.createElement('td');
    cell.innerHTML = date ? `<p>${date}</p>` : '';
    row.appendChild(cell);
  });

  tableBody.appendChild(row);
}

document.addEventListener('DOMContentLoaded', function() {
  updateCalendar();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      loadUpcomingEvents(); 
    } else {
      console.log("No user signed in.");
    }
  });
});


function loadUpcomingEvents() {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  if (user) {
    const eventListElement = document.getElementById('eventList');
    eventListElement.innerHTML = '';


    db.collection("users").doc(user.uid).collection("events")
      .orderBy("start_date")
      .limit(3)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const eventData = doc.data();
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.innerHTML = `
            <strong>${eventData.title}</strong><br>
            ${new Date(eventData.start_date).toLocaleString()} - ${new Date(eventData.end_date).toLocaleString()}<br>
            ${eventData.location}<br>
            Repeat: ${eventData.repeat}
          `;
          eventListElement.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error("Error fetching events: ", error);
      });
  } else {
    console.log("User is not signed in.");
  }
}