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

if(addButton){
addButton.addEventListener('click', function () {
  if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
    presetTimer.style.display = 'block';
  } else {
    presetTimer.style.display = 'none';
  }
});
}

if (cancelPreset){
cancelPreset.addEventListener('click', function () {
  if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
    presetTimer.style.display = 'block';
  } else {
    presetTimer.style.display = 'none';
  }
});
}

if (savePreset){
savePreset.addEventListener('click', function () {
  if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
    presetTimer.style.display = 'block';
  } else {
    presetTimer.style.display = 'none';
  }
});
}

