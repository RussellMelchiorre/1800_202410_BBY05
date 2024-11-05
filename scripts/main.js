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

      document.getElementById("name-goes-here").innerText = userName;
      document.getElementById("email-goes-here").innerText = userEmail;

      //method #2:  insert using jquery
      //$("#name-goes-here").text(userName); //using jquery

      //method #3:  insert using querySelector
      //document.querySelector("#name-goes-here").innerText = userName
    } else {
      // No user is signed in.
      console.log("No user is logged in");
    }
  });
}
getNameFromAuth(); //run the function

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

const addFirendButton = document.getElementById('addFriendButton');

addFriendButton.addEventListener('click', function () {
  console.log("button test");
});

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

hoursInput.addEventListener('input', function () {
  if (this.value > 99) {
    this.value = 99;
  }
  if (this.value < 0) {
    this.value = 0;
  }
});

minutesInput.addEventListener('input', function () {
  if (this.value > 59) {
    this.value = 59;
  }
  if (this.value < 0) {
    this.value = 0;
  }
});
secondsInput.addEventListener('input', function () {
  if (this.value > 59) {
    this.value = 59;
  }
  if (this.value < 0) {
    this.value = 0;
  }
});

const addButton = document.getElementById('addTimerButton');
const presetTimer = document.getElementById('presetTimerContainer');

const cancelPreset = document.getElementById('cancelPreset');
const savePreset = document.getElementById('savePreset');

addButton.addEventListener('click', function () {
  if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
    presetTimer.style.display = 'block';
  } else {
    presetTimer.style.display = 'none';
  }
});

cancelPreset.addEventListener('click', function () {
  if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
    presetTimer.style.display = 'block';
  } else {
    presetTimer.style.display = 'none';
  }
});

savePreset.addEventListener('click', function () {
  if (presetTimer.style.display === 'none' || presetTimer.style.display === '') {
    presetTimer.style.display = 'block';
  } else {
    presetTimer.style.display = 'none';
  }
});


