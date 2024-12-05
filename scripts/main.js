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
  // Display the toast message 
  document.getElementById("toast-message").textContent = message;
  new bootstrap.Toast(document.getElementById("basicToast")).show();
  logAlert(message);
   
}


// Write alert to Firestore
function logAlert(message) {
  // Ensure the user is authenticated
  const user = firebase.auth().currentUser;
  const userId = user.uid; 
  // Reference to the alerts collection for the correct user
  const alertsRef = firebase.firestore().collection("users").doc(userId).collection("alerts");

  // Add the alert to Firestore
  alertsRef.add({
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Alert logged successfully");
  })
  .catch((error) => {
    console.error("Error logging alert to Firestore: ", error);
  });
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

///////////////////////////////////////////////////////////////////////////
// checks if the claendar element exisits before proceeding
const CalenderExists = document.getElementById('cal');

document.addEventListener("DOMContentLoaded", function() {
  
  // Firebase authentication state chane listener
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('User signed in:', user.uid);
      
      if(CalenderExists){
      updateCalendar(); // update the calendar if the user is signed in
      loadUpcomingEvents(); // load the user's upcoming evnets
      loadUpcomingFriendEvents(); // load the user's upcoming friend events
      }
    }
    
    else {
      console.log("No user signed in.");
    }
  });
});
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//checks if the calendar element exists before calling updateCalendar
if (CalenderExists){
  
  // calendar
  function updateCalendar() {
    const now = new Date(); // get the currnet date
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // firest day f the current month
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of the current month
    const firstDayOfWeek = firstDayOfMonth.getDay(); // get the weekday of the first day of the month
    const lastDate = lastDayOfMonth.getDate(); // get the last date of the month
    
    let calendarDates = [];
    
    // fill in empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDates.push('');
    }
    
    // fill in the actual dates of the month
    for (let i = 1; i <= lastDate; i++) {
      calendarDates.push(i);
    }
    
    // fill in empty slots to make the calendar fit perfectly (7 days per row)
    while (calendarDates.length % 7 !== 0) {
      calendarDates.push('');
    }
    
    // array of month names for display
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthName = monthNames[now.getMonth()]; // get the current name
    
    // upcate the displayed month name
    const monthElement = document.getElementById('currentMonth');
    if (monthElement) {
      monthElement.innerText = `${currentMonthName} ${now.getFullYear()}`; // month + year
    }
    
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    
    // clear all existing event dot
    const allEventDots = document.querySelectorAll('.event-dot');
    allEventDots.forEach(dot => dot.remove());

    let row = document.createElement('tr');
    calendarDates.forEach((date, index) => {
      // start a new row every 7 days
      if (index % 7 === 0 && index !== 0) {
        tableBody.appendChild(row);
        row = document.createElement('tr');
      }
      
      const cell = document.createElement('td');
      if (date) {
        cell.innerHTML = `<p>${date}</p>`; // display the date
        
        // highlight today's date
        if (date === now.getDate()) {
          cell.classList.add('highlight-today');
        }
        
        // check if there are evnets on this date
        checkIfEventOnDate(date, cell);
        cell.addEventListener("click", () => showEventDetails(date, cell)); // show event details when clicked
      }
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  }
}
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// function to check if there are evnets on a specific date
function checkIfEventOnDate(date, cell) {
  const user = firebase.auth().currentUser; // get the current logged-in user
  
  if (!user) {
    console.log("No user is signed in.");
    return;
  }
  
  console.log(`Checking events for date: ${date}`); // cheking events for the given date
  
  const db = firebase.firestore(); // get Firesotre instance
  // set the start of the day
  const eventDateStart = new Date(new Date().getFullYear(), new Date().getMonth(), date, 0, 0, 0);
  // set the end of the day
  const eventDateEnd = new Date(new Date().getFullYear(), new Date().getMonth(), date, 23, 59, 59);
  
  // log the range of dates being queried
  console.log(`Looking for events from ${eventDateStart} to ${eventDateEnd}`);
  
  // query the Firesotre collection for events on the specified date
  db.collection("users").doc(user.uid).collection("events")
  .get()
  .then(snapshot => {
    if (!snapshot.empty) { // if events exist, process each event
      snapshot.docs.forEach(doc => {
        const eventData = doc.data();
        const eventStartDateStr = eventData.start_date; // get event start date as a sting
        const eventStartDate = new Date(eventStartDateStr); // convert string to date object
          
        // if an event exists within the date range, display a dot on the calendar
        if (eventStartDate >= eventDateStart && eventStartDate <= eventDateEnd) {
          console.log(`Found event for date ${date}:`, eventData);
            
          const eventDot = document.createElement('div'); // create a dot for the event
          eventDot.classList.add('event-dot'); // add CSS
          cell.classList.add('highlight-event'); // hightlight the cell for the evnet
          cell.appendChild(eventDot); // append the dot to the cell
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
    
  // query the user's firend's event  
  db.collection("users").doc(user.uid).collection("friends").doc("friendStatus").get()
  .then(friendStatusDoc => {
    // get the list of currnet friends
    const currentFriends = friendStatusDoc.data()?.currentFriends || [];
    
    currentFriends.forEach(friendId => {
      db.collection("users").doc(friendId).collection("events")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          const eventData = doc.data();
          const eventStartDateStr = eventData.start_date;
          const eventStartDate = new Date(eventStartDateStr);
          
          // display firend's events on the claendar
          if (eventStartDate >= eventDateStart && eventStartDate <= eventDateEnd) {
            console.log(`Found friend's event for date ${date}:`, eventData);
            
            const friendEventDot = document.createElement('div'); // create a dot for the firned's event
            friendEventDot.classList.add('friend-event-dot'); // add CSS
            cell.classList.add('highlight-friend-event'); // highlight the cell for the friend's evnet
            cell.appendChild(friendEventDot); // append the dot to the cell
          }
        });
      });
    });
  })
  .catch(error => {
    onsole.error("Error fetching friend events: ", error);
  });
}
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// function to load the user's upcoming events
if (CalenderExists){
  
  // function to load upcoming evnets
  function loadUpcomingEvents() {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
    
    if (user) {
      const eventListElement = document.getElementById('eventList');
      eventListElement.innerHTML = ''; // clear the event list
      
      db.collection("users")
      .doc(user.uid)
      .collection("events")
      .orderBy("start_date")
      .limit(3)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) { // if evnets are found
          snapshot.forEach(doc => { // loop through each evnet document
            const eventData = doc.data(); // get evnet data
            const eventId = doc.id; // get the evnet document ID
            const listItem = document.createElement('li'); // create a new list item
            listItem.classList.add('list-group-item'); // add a style calss 
            
            // add event information to the list item
            listItem.innerHTML = `
            <strong>${eventData.title}</strong><br>
            ${new Date(eventData.start_date).toLocaleString()} - ${new Date(eventData.end_date).toLocaleString()}<br>
            ${eventData.location}<br>
            Repeat: ${eventData.repeat || "none"}<br>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${eventId}">Delete</button>
            `;
            
            // append the list item to the event list
            eventListElement.appendChild(listItem);
          });
          
          // add evnet listner to delete buttons
          addDeleteButtonListener();
        }
        else {
          console.log ("No event found.");
          eventListElement.innerHTML = `<li class="list-group-item">No upcoming events.</li>`;
        }
      })
      .catch(error => {
        console.error("Error fetching events: ", error);
      });
    }
    else {
      console.log("User is not signed in.");
    }
  }
}
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// fuction to show the detailed info on the calendar
function showEventDetails(date, cell) {
  const existingDetails = cell.querySelector(".event-details");
  
  // if there are existing details and it contains the "active" class
  if (existingDetails && existingDetails.classList.contains("active")) {
    existingDetails.remove(); // remove the existing evnet details
    cell.classList.remove("selected-cell"); // remove the selected cell styling
    return;
  }

  // remove active evnet details and selected cell styling
  document.querySelectorAll(".event-details.active").forEach(detail => {
    detail.remove();
  });
  document.querySelectorAll(".selected-cell").forEach(selected => {
    selected.classList.remove("selected-cell");
  });

  // create a new div
  const detailsDiv = document.createElement("div");
  // add the "event-details" class
  detailsDiv.classList.add("event-details");
  // add the "active" class to make it active
  detailsDiv.classList.add("active");

  // load events for the selected date
  loadEventsForDate(date, detailsDiv);
  cell.appendChild(detailsDiv);

  cell.classList.add("selected-cell");
}
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// load events for a specific date
function loadEventsForDate(date, detailsDiv) {
  const user = firebase.auth().currentUser;

  // if mo user is logged in, log message to the console
  if (!user) {
    console.log("No user is signed in.");
    detailsDiv.textContent = "Sign in to see events.";
    return;
  }

  const db = firebase.firestore();
  const eventDateStart = new Date(new Date().getFullYear(), new Date().getMonth(), date, 0, 0, 0); // set the start date for the evnet
  const eventDateEnd = new Date(new Date().getFullYear(), new Date().getMonth(), date, 23, 59, 59); // set the end date for the evnet

  db.collection("users").doc(user.uid).collection("events")
  .where("start_date", ">=", eventDateStart.toISOString())
  .where("start_date", "<=", eventDateEnd.toISOString())
  .get()
  .then(snapshot => {
    if (snapshot.empty) { // if no events are found
      detailsDiv.textContent = "No events for this date.";
    }
    else { // if events are found
      const eventList = document.createElement("ul"); // create a new ul element
      eventList.classList.add("list-group"); // add the "list-group" class
      
      // for each event document
      snapshot.docs.forEach(doc => {
        const eventData = doc.data(); // get event data
        const listItem = document.createElement("li"); // create a new li element
        listItem.classList.add("list-group-item"); // add the "list-group-item" class
        listItem.innerHTML = `
        <strong>${eventData.title}</strong><br>
        ${new Date(eventData.start_date).toLocaleString()} - ${new Date(eventData.end_date).toLocaleString()}<br>
        Location: ${eventData.location || "N/A"}<br>
        Repeat: ${eventData.repeat || "None"}
        `;
        
        eventList.appendChild(listItem);
      });
      detailsDiv.appendChild(eventList);
    }
  })
  .catch(error => {
    console.error("Error fetching events: ", error);
    detailsDiv.textContent = "Failed to load events.";
  });
}
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//functions for selecting events to delete
function addDeleteButtonListener() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(button => {
    button.addEventListener("click", function () { // add click evnet listener
      const eventId = this.getAttribute("data-id"); // get the evnet ID to delete
      document.querySelector("#confirmation-modal").style.display = "block"; // show the confirmation modal
      document.querySelector("#confirm-delete").onclick = () => { // when the delete confirmation button is clicked
        deleteEvent(eventId); // call deleteEvent function
        closeModal(); // close the modal
      };
    });
  });
}

//closes delete conformation popup
function closeModal() {
  document.querySelector("#confirmation-modal").style.display = "none";
}
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
// delete an event from Firesotre
function deleteEvent(eventId) {
  updateCalendar(); // update the calendar
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;
  const userID = user.uid;

  if (user) {
    const eventsRef = db.collection("users").doc(userID).collection("events").doc(eventId);

    eventsRef.get()
    .then((doc) => {
      if (doc.exists) {
        const eventData = doc.data(); // get evnet data
        const title = eventData.title; // get event title
        const startDate = formatDate(eventData.start_date); // format the start date

        // Delete the event
        return eventsRef.delete().then(() => { // after deleting the evnet
          updateCalendar(); // update the calendar
          console.log("Event successfully deleted!");
          showToast(`Event "${title}" on ${startDate} deleted`);
          // reload the upcoming events
          loadUpcomingEvents();
        });
      } else {
        console.error("Event not found.");
        showToast("Error: Event not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching or deleting event: ", error);
      showToast("Error deleting event: " + error.message);
    })
  }
  else {
    console.error("User is not signed in.");
    updateCalendar();
  }
  updateCalendar();
}
///////////////////////////////////////////////////////////////////////////



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


const notifsExist = document.getElementById('notifslist');

if (notifsExist){
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const currentUserId = user.uid;

    const alertsRef = db.collection("users")
                         .doc(currentUserId)
                         .collection("alerts").limit(10);

    alertsRef.orderBy("timestamp", "desc").onSnapshot(snapshot => {
      const alertsList = document.getElementById("alertsList");
      alertsList.innerHTML = ''; 
      snapshot.forEach(doc => {
        const alertData = doc.data();
        const alertMessage = alertData.message; 
        const alertTime = alertData.timestamp;  

        const formattedTime = new Date(alertTime.seconds * 1000).toLocaleString();

        const alertItem = document.createElement('li');
        alertItem.classList.add('list-group-item');
        alertItem.classList.add('d-flex');
        alertItem.classList.add('justify-content-between');
        
        alertItem.innerHTML = `
          <span id = "text" >${alertMessage}</span>
          <span class="listitem">${formattedTime}</span>
        `;

        alertsList.appendChild(alertItem);
      });
    });
  }
});

}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}