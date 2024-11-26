// for sending friend requsets, watches for the button click

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
                  // Log and display the new request
                  console.log("test34")
                  logFriendRequest(friendId);
                  db.collection("users").doc(friendId).get().then(senderDoc => {
                    showToast(`New Friend Request from ${senderDoc.data().name}`);
                  });
                }
              });
          });
        } else {
          console.log("test3qwe4")
        }
      });
  }
});




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

// accepts a friend request
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
  showToast("Friend Request Accepted!");
}

// removes a friend from current friends
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
  showToast("Friend Removed!");
}

//log previous friend requests
function logFriendRequest(friendID) {
  // Ensure the user is authenticated
  const user = firebase.auth().currentUser;
  const userId = user.uid; 
  // Reference to the alerts collection for the correct user
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