// run after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // get the new event form element
    const saveEventForm = document.getElementById('newEventForm');

    // add a submit event listener to the form
    saveEventForm.addEventListener('submit', function (event) {
        event.preventDefault(); // prevent the default form submission behavior

        // get the values from the form inputs
        const eventTitle = document.getElementById('eventTitle').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const repeat = document.getElementById('repeat').value;
        const location = document.getElementById('location').value;

        // call the function to save the event to Firestore with the input values
        saveEventToFirestore(eventTitle, startDate, endDate, repeat, location);
    });
    
    // function to save the event to Firesotre
    function saveEventToFirestore(title, startDate, endDate, repeat, location) {
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;
        
        // only proceed if the user is logged in
        if (user) {
            let eventStartDate = new Date(startDate); // convert start date to date object
            let eventEndDate = new Date(endDate); // convert end date to date obgject
            const promises = [];

            // Repeat event handling
            if (repeat !== "None") {
                const repeatCount = 10;
                for (let i = 0; i < repeatCount; i++) {
                    let repeatedStartDate = new Date(eventStartDate); // create a new start date for the repetition
                    let repeatedEndDate = new Date(eventEndDate); // create a new end date for the repetition
                    
                    // modifiy the date based on the repeat frequency
                    switch (repeat) {
                        case "Daily":
                            repeatedStartDate.setDate(repeatedStartDate.getDate() + i);
                            repeatedEndDate.setDate(repeatedEndDate.getDate() + i);
                            break;
                        case "Weekly":
                            repeatedStartDate.setDate(repeatedStartDate.getDate() + (i * 7));
                            repeatedEndDate.setDate(repeatedEndDate.getDate() + (i * 7));
                            break;
                        case "Monthly":
                            repeatedStartDate.setMonth(repeatedStartDate.getMonth() + i);
                            repeatedEndDate.setMonth(repeatedEndDate.getMonth() + i);
                            break;
                    }
                    
                    // create a promise to add the repeated event to Firesotre
                    const promise = db.collection("users").doc(user.uid).collection("events").add({
                        title: title,
                        start_date: repeatedStartDate.toISOString(),
                        end_date: repeatedEndDate.toISOString(),
                        repeat: repeat,
                        location: location,
                    });

                    // add the promise to the array
                    promises.push(promise);
                }

                // after all repeated events have been added
                Promise.all(promises)
                    .then(() => {
                        console.log("All events successfully added to Firestore!");
                        showToast("Events successfully added!");
                        saveEventForm.reset(); 
                        window.location.href = "main.html"; 
                    })
                    .catch((error) => {
                        console.error("Error adding events: ", error);
                        alert("Error adding event: " + error.message);
                    });

            }
            
            // if not a repeating evnet, add a single evnet
            else {
                db.collection("users").doc(user.uid).collection("events").add({
                    title: title,
                    start_date: eventStartDate.toISOString(),
                    end_date: eventEndDate.toISOString(),
                    repeat: repeat,
                    location: location,
                })
                .then(() => {
                    console.log("Event successfully added to Firestore!")
                    showToast("Event successfully added!");
                    logAlert("Event successfully added for " + eventStartDate)
                    saveEventForm.reset(); 

                    //slight pause before redirect to ensure conformation is shown
                    setTimeout(() => {
                        window.location.href = "main.html";
                      }, 1500);
                })
                .catch((error) => {
                    console.error("Error adding event: ", error);
                    alert("Error adding event: " + error.message);
                });
            }
        }
        
        else {
            alert("Please sign in first!");
        }
    }
});
