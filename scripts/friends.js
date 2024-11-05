


document.getElementById("addFriendButton").addEventListener("click", function () {
  console.log("test Button clicked");
  const friendEmail = document.getElementById("friendEmailInput").value;

  if (friendEmail) {

    const user = firebase.auth().currentUser; 
    const userId = user.uid;
    db.collection("users").where("email", "==", friendEmail).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userId = querySnapshot.docs[0].id;
        console.log("test")
        db.collection("users").doc(userId).collection("friends").doc("friendStatus").set({
          pendingFriends: firebase.firestore.FieldValue.arrayUnion(userId)
        }, { merge: true }); 
        console.log("requset sent"); 
      } 
    });
  }
});


// Function to show friend request toast notification
function showFriendRequestToast(requesterId) {
  const friendRequestToast = document.getElementById('friendRequestToast');
  const requesterElement = document.getElementById('requester-id');
  const timeElement = document.getElementById('friend-request-time');

  requesterElement.textContent = requesterId;
  timeElement.textContent = new Date().toLocaleTimeString();

  const bootstrapToast = new bootstrap.Toast(friendRequestToast);
  bootstrapToast.show();
}


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const userId = user.uid;


    db.collection("users").doc(userId).collection("friends").doc("friendStatus")
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const pendingFriends = data.pendingFriends || [];

          if (pendingFriends.length > 0) {
            const latestRequesterId = pendingFriends[pendingFriends.length - 1];
            showFriendRequestToast(latestRequesterId);
          }
        }
      });
  }
});