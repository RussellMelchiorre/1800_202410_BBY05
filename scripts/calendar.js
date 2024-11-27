document.addEventListener("DOMContentLoaded", function () {
    const saveEventForm = document.getElementById('newEventForm');
    
    saveEventForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const eventTitle = document.getElementById('eventTitle').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const repeat = document.getElementById('repeat').value;
        const location = document.getElementById('location').value;

        saveEventToFirestore(eventTitle, startDate, endDate, repeat, location);
    });
    
    function saveEventToFirestore(title, startDate, endDate, repeat, location) {
        const db = firebase.firestore();
        const user = firebase.auth().currentUser;

        if (user) {
            let eventStartDate = new Date(startDate);
            let eventEndDate = new Date(endDate);
            const promises = [];

            // Repeat event handling
            if (repeat !== "None") {
                const repeatCount = 10;
                for (let i = 0; i < repeatCount; i++) {
                    let repeatedStartDate = new Date(eventStartDate);
                    let repeatedEndDate = new Date(eventEndDate);
                    
                   
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

                    
                    const promise = db.collection("users").doc(user.uid).collection("events").add({
                        title: title,
                        start_date: repeatedStartDate.toISOString(),
                        end_date: repeatedEndDate.toISOString(),
                        repeat: repeat,
                        location: location,
                    });

                    promises.push(promise);
                }

                
                Promise.all(promises)
                    .then(() => {
                        console.log("All events successfully added to Firestore!");
                        alert("Events successfully added!");
                        saveEventForm.reset(); 
                        window.location.href = "main.html"; 
                    })
                    .catch((error) => {
                        console.error("Error adding events: ", error);
                        alert("Error adding event: " + error.message);
                    });

            } else {
               
                db.collection("users").doc(user.uid).collection("events").add({
                    title: title,
                    start_date: eventStartDate.toISOString(),
                    end_date: eventEndDate.toISOString(),
                    repeat: repeat,
                    location: location,
                })
                .then(() => {
                    console.log("Event successfully added to Firestore!");
                    alert("Event successfully added!");
                    saveEventForm.reset(); 
                    window.location.href = "main.html";
                })
                .catch((error) => {
                    console.error("Error adding event: ", error);
                    alert("Error adding event: " + error.message);
                });
            }
        } else {
            alert("Please sign in first!");
        }
    }
});
