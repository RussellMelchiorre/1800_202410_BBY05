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

function trackToastTime() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromLogin = urlParams.get('from') === 'login';

  if (fromLogin) {
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();

    start(); //Begins timer
    setInterval(updateElapsedTime, 1000); //Runs function updateElapsedTime() every second (1000 milliseconds)
  }
}

trackToastTime();

///////////////////////////////////////////////////////////
const CalenderExists = document.getElementById('cal');

document.addEventListener("DOMContentLoaded", function() {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('User signed in:', user.uid);
      if(CalenderExists){
      updateCalendar();
      loadUpcomingEvents();
      loadUpcomingFriendEvents();
      }
    }
    else {
      console.log("No user signed in.");
    }
  });
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
//calendar

//checks if calendar exists before calling 
if (CalenderExists){

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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[now.getMonth()];

  const monthElement = document.getElementById('currentMonth');
  if (monthElement) {
    monthElement.innerText = `${currentMonthName} ${now.getFullYear()}`;
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
    if (date) {
      cell.innerHTML = `<p>${date}</p>`;

      if (date === now.getDate()) {
        cell.classList.add('highlight-today');
      }

      checkIfEventOnDate(date, cell);
    }
    row.appendChild(cell);
  });
  tableBody.appendChild(row);
}
}
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
function checkIfEventOnDate(date, cell) {
  const user = firebase.auth().currentUser;

  if (!user) {
    console.log("No user is signed in.");
    return;
  }

    console.log(`Checking events for date: ${date}`);

    const db = firebase.firestore();
    const eventDateStart = new Date(new Date().getFullYear(), new Date().getMonth(), date, 0, 0, 0);
    const eventDateEnd = new Date(new Date().getFullYear(), new Date().getMonth(), date, 23, 59, 59);

    console.log(`Looking for events from ${eventDateStart} to ${eventDateEnd}`); 

    db.collection("users").doc(user.uid).collection("events")
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        snapshot.docs.forEach(doc => {
          const eventData = doc.data();
          const eventStartDateStr = eventData.start_date;
          const eventStartDate = new Date(eventStartDateStr);

          if (eventStartDate >= eventDateStart && eventStartDate <= eventDateEnd) {
            console.log(`Found event for date ${date}:`, eventData);
            
            const eventDot = document.createElement('div');
            eventDot.classList.add('event-dot');
            cell.classList.add('highlight-event');
            cell.appendChild(eventDot);
          }
        });
      }
      else {
        console.log(`No events found for date ${date}`);
      }
    })
    .catch(error => {
      console.error("Error fetching events: ", error);
    });
  }
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//checks if calendar exists before calling 
if (CalenderExists){
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
}
///////////////////////////////////////////////////////////
//checks if calendar exists before calling 
if (CalenderExists){

// Loads friends' events
function loadUpcomingFriendEvents() {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  if (user) {
    const eventListElement = document.getElementById('friendsEventList');
    eventListElement.innerHTML = ''; 

    // Get the current user's friends
    db.collection("users").doc(user.uid).collection("friends").doc("friendStatus").get()
      .then(friendStatusDoc => {
        const currentFriends = friendStatusDoc.data()?.currentFriends || [];

        
        currentFriends.forEach(friendId => {
          db.collection("users").doc(friendId).collection("events")
            .orderBy("start_date")
            .limit(2)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                const eventData = doc.data();

                // Fetch the friend's name
                db.collection("users").doc(friendId).get()
                  .then(friendDoc => {
                    const friendName = friendDoc.data().name;

                    // create items
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.innerHTML = `
                      <strong>${friendName}'s Event: ${eventData.title}</strong><br>
                      ${new Date(eventData.start_date).toLocaleString()} - ${new Date(eventData.end_date).toLocaleString()}<br>
                      ${eventData.location}<br>
                      Repeat: ${eventData.repeat}
                    `;
                    eventListElement.appendChild(listItem);
                  });
              });
            });
        });
      })
      .catch(error => {
        console.log("Error fetching events: ", error);
      });
  } else {
    console.log("User is not signed in.");
  }
}
}