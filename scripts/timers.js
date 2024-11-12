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
          if (!snapshot.empty) {
            const formatLeadZero = (time) => (time < 10 ? "0" + time : time); //if time is less than 10 add a leading 0 to the time
            snapshot.docs.forEach((doc, index) => { //for each document in the timer collection run the code
              if(index < presetName.length) {
              const firstTimerData = doc.data();
              presetName[index].textContent = firstTimerData.presetName;
              presetHours[index].textContent = formatLeadZero(firstTimerData.hours) + " : ";
              presetMinutes[index].textContent = formatLeadZero(firstTimerData.minutes) + " : ";
              presetSeconds[index].textContent = formatLeadZero(firstTimerData.seconds);
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

