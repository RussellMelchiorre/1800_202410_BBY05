// for sending friend requsets, watches for the button click

const FriendsExists = document.getElementById('addFriendButton');

if (FriendsExists){
document.getElementById("addFriendButton").addEventListener("click", function () {
  //takes the email from the form
  const friendEmail = document.getElementById("friendEmailInput").value;
  //saves your user ID
  const currentUserId = firebase.auth().currentUser.uid;

  // checks that theres actually an email or something else in the form
  if (friendEmail) {

    //looks in the users doc for a matching email
    db.collection("users").where("email", "==", friendEmail).get().then((querySnapshot) => {
      //checks if the snapshot got anything
      if (!querySnapshot.empty) {
        //if so then takes the first result of that query at index 0 cause there should only ever be one ID per user
        const friendId = querySnapshot.docs[0].id;

        //adds the user who sent the request to the pending friends array of the targeted user
        db.collection("users").doc(friendId).collection("friends").doc("friendStatus").set({
          pendingFriends: firebase.firestore.FieldValue.arrayUnion(currentUserId)
          // merge so existing users arent erased 
        }, { merge: true });

        // shows a conformation toast
        showToast(`Request to ${friendEmail} sent!`);
      } else {
        //shows an error toast
        showToast("User with that email not found.");
      }
    });
  }
});
}
// listens for user login or logout
firebase.auth().onAuthStateChanged(user => {
  // checks if user is logged in
  if (user) {
    // saves the current user ID
    const currentUserId = user.uid;

    // sets up real-time listener for pending friend requests
    db.collection("users").doc(currentUserId).collection("friends").doc("friendStatus")
      .onSnapshot(doc => {
        // checks if the document exists
        if (doc.exists) {
          // gets the data from the document
          const data = doc.data();
          // gets the list of pending friends
          const pendingFriends = data.pendingFriends || [];

          // if there are any pending requests
          if (pendingFriends.length > 0) {
            // gets the last person who sent a request
            const senderId = pendingFriends[pendingFriends.length - 1];

            // fetches the sender's name from their document
            db.collection("users").doc(senderId).get().then(senderDoc => {
              // gets the sender's name from the document
              const senderName = senderDoc.data().name; // assumes a 'name' field exists
              // shows a toast saying there's a new request
              showToast(`New friend request from ${senderName}`);
            });
          }
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
  showToast("Friend request accepted!");
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
  showToast("Friend removed!");
}

