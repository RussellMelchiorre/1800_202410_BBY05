//This is the js page for most stuff realting to the friends system, as a note: the words Notification and Alert are used intechangably and mean a displayed toast.
// please not that Alert and Alarm are diffrent, alerts are the toasts alarms are used in the timers section.
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//if on the profile page, watches for the add friend button to be clicked. if the button is clicked the a friend request is attemped to be sent
//if the user already has a pending request or is already friends with that user then a toast is displayed with that information and the array is not updated.
//if the user does not meet those conditions then the user who sent the request's ID is added to the recipients pending friends array.
const FriendsExists = document.getElementById('addFriendButton');

if (FriendsExists){
  document.getElementById("addFriendButton").addEventListener("click", function () {
    const friendEmail = document.getElementById("friendEmailInput").value;
    const currentUserId = firebase.auth().currentUser.uid;
  
    if (friendEmail) {
      db.collection("users").where("email", "==", friendEmail).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const friendId = querySnapshot.docs[0].id;
  
          // Get the current pending friends list and current friends list to check if the user is already in it
          db.collection("users").doc(friendId).collection("friends").doc("friendStatus").get().then((doc) => {
            const data = doc.exists ? doc.data() : {};
            const currentPendingFriends = data.pendingFriends || [];
            const currentFriends = data.currentFriends || [];
  
            // Check if you are already friends with the person
            if (currentFriends.includes(currentUserId)) {
              showToast(`You are already friends with ${friendEmail}`);
            } 
            // Check if the friend request is already pending
            else if (currentPendingFriends.includes(currentUserId)) {
              showToast(`You already have a pending request with ${friendEmail}.`);
            } 
            // If neither, send the friend request
            else {
              db.collection("users").doc(friendId).collection("friends").doc("friendStatus").set({
                pendingFriends: firebase.firestore.FieldValue.arrayUnion(currentUserId)
              }, { merge: true });
  
              // Show confirmation toast
              showToast(`Request to ${friendEmail} sent!`);
            }
          });
  
        } else {
          showToast("User with that email not found.");
        }
      });
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//checks for updates in the friend status document to watch for incoming friend requests,
//to avoid spam duplicate notifications when a new unseen request is seen then it is saved to the firestore,
//before any alerts are called they are checked against the contentes of the freinds firestore collection and
// if it has already been seen then no alert is displayed. if it is unique then an alert is displayed.
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const currentUserId = user.uid;
    const db = firebase.firestore();
   
    db.collection("users").doc(currentUserId).collection("friends").doc("friendStatus")
      .onSnapshot(doc => {
        if (doc.exists) {
          const currentPendingFriends = doc.data().pendingFriends || [];

          currentPendingFriends.forEach(friendId => {
            // Check if the friend request has already been logged in pastFriendRequests
            db.collection("users").doc(currentUserId).collection("friends")
              .where("friendID", "==", friendId)
              .get()
              .then(snapshot => {
                if (snapshot.empty) {
                  // the request is new so log and display it 
                  logFriendRequest(friendId);
                  db.collection("users").doc(friendId).get().then(senderDoc => {
                    showToast(`New Friend Request from ${senderDoc.data().name}`);
                  });
                }
              });
          });
        } else {
        }
      });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//This mionitors for an auh state change and when it occurs it gets the arrays and displays them in thier respective lists.
const FriendsListExists = document.getElementById('addFriendButton');

if (FriendsListExists){
// monitors friend requests and shows pending friends
firebase.auth().onAuthStateChanged(user => {
  // checks if user is logged in
  if (user) {
    // listens for changes in the friend's status document
    db.collection("users").doc(user.uid).collection("friends").doc("friendStatus")
      .onSnapshot((doc) => {
        // gets the pending friends and current friends lists
        const pendingFriends = doc.data()?.pendingFriends || [];
        const currentFriends = doc.data()?.currentFriends || [];

        // shows the list of pending friends
        const pendingFriendsList = document.getElementById('pendingFriendsList');
        pendingFriendsList.innerHTML = '';  // clears old list
        pendingFriends.forEach(friendId => {
          // gets the friend's name from their doc
          db.collection("users").doc(friendId).get().then(friendDoc => {
            const friendName = friendDoc.data().name;
            // creates a new list item for the pending friend
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `${friendName} <button class="btn btn-success btn-sm float-end" onclick="acceptFriend('${friendId}')">Accept</button>`;
            pendingFriendsList.appendChild(li);
          });
        });

        // shows the list of current friends
        const currentFriendsList = document.getElementById('currentFriendsList');
        currentFriendsList.innerHTML = '';  // clears old list
        currentFriends.forEach(friendId => {
          // gets the friend's name from their doc
          db.collection("users").doc(friendId).get().then(friendDoc => {
            const friendName = friendDoc.data().name;
            // creates a new list item for the current friend
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `${friendName} <button class="btn btn-danger btn-sm float-end" onclick="removeFriend('${friendId}')">Remove</button>`;
            currentFriendsList.appendChild(li);
          });
        });
      });
  }
});
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
// Accepts a friend request, when called it removes the users ID from the pending friends array and adds it to the current friends array
// since friendships go both ways when an friend is accepted the UserID of the accepting friend is added to the current friends array of 
// the user who sent the request. when a request is accepted an notification is displayed conforming this.
function acceptFriend(friendId) {
  const currentUserId = firebase.auth().currentUser.uid;

  // moves friend from pending to current friends for both users
  db.collection("users").doc(currentUserId).collection("friends").doc("friendStatus").update({
    pendingFriends: firebase.firestore.FieldValue.arrayRemove(friendId),
    currentFriends: firebase.firestore.FieldValue.arrayUnion(friendId)
  });

  db.collection("users").doc(friendId).collection("friends").doc("friendStatus").update({
    currentFriends: firebase.firestore.FieldValue.arrayUnion(currentUserId)
  });

  // shows a toast to confirm friend request accepted
  db.collection("users").doc(friendId).get().then(senderDoc => {
    showToast(`Friend Request from ${senderDoc.data().name}` + " Accepted!");
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
//Removes a friend, When called your UserID is removed from your friends current friends array and thier UserID is removed from your current
//friends array. A toast notification is then displayed conforming this.
function removeFriend(friendId) {
  const currentUserId = firebase.auth().currentUser.uid;

  // removes friend from both users' current friends lists
  db.collection("users").doc(currentUserId).collection("friends").doc("friendStatus").update({
    currentFriends: firebase.firestore.FieldValue.arrayRemove(friendId)
  });

  db.collection("users").doc(friendId).collection("friends").doc("friendStatus").update({
    currentFriends: firebase.firestore.FieldValue.arrayRemove(currentUserId)
  });

  // shows a toast to confirm friend removal
  db.collection("users").doc(friendId).get().then(senderDoc => {
    showToast(`${senderDoc.data().name}` + " Removed As A Friend");
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
//This logs freind requests when called to avoid them being displayed repeatedly, the friends UserID and the time of the request is logged
//to a document in the friends collection. a toast alert is then shown for conformation or error.
function logFriendRequest(friendID) {
  const user = firebase.auth().currentUser;
  const userId = user.uid; 
// the past frends alerts collection
  const friendInfoRef = db.collection("users").doc(userId).collection("friends");

  // Add the alert to Firestore
  friendInfoRef.add({
    friendID: friendID,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Request logged successfully");
  })
  .catch((error) => {
    console.error("Request logging alert to Firestore: ", error);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////