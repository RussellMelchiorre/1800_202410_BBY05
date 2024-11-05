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

document.getElementById('addFriendButton').addEventListener('click', function () {
  console.log("Button clicked!"); // Test to see if the button click is registered
  const friendEmail = document.getElementById("friendEmailInput").value;

  if (friendEmail) {

    const user = firebase.auth().currentUser; // Assume a user is logged in
    const userId = user.uid;

    // Find user by the entered email
    db.collection("users").where("email", "==", friendEmail).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id; // Get the user ID

        console.log("test")

        // Add the logged-in user's email to the pendingFriends array
        db.collection("users").doc(userId).collection("friends").doc("friendStatus").set({
          pendingFriends: firebase.firestore.FieldValue.arrayUnion(userId)
        }, { merge: true }); // Use merge to avoid overwriting existing data

        console.log("requset sent"); 
      } else {
        console.log("invalid email"); 
      }
    });
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


