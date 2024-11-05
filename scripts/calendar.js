document.addEventListener("DOMContentLoaded", function() {
    const saveEventForm = document.getElementById('newEventForm');

    saveEventForm.addEventListener('submit', function(event) {
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

        db.collection("events").add({
            title: title,
            start_date: startDate,
            end_date: endDate,
            repeat: repeat,
            location: location,
        })
        .then(() => {
            console.log("Event successfully added to Firestore!");
            alert("Event successfully added!");
            saveEventForm.reset();
        })
        .catch((error) => {
            console.error("Error adding event: ", error);
            alert("Error adding event: " + error.message);
        });
    }
});

