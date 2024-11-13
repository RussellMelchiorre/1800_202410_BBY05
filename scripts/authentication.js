// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      //------------------------------------------------------------------------------------------
      // The code below is modified from the default snippet provided by the Firebase documentation.
      //
      // If the user is a "brand new" user, create a new "user" in the Firestore database.
      // Assign this user with the name and email provided.
      //------------------------------------------------------------------------------------------

      var user = authResult.user;  // Get the user object from Firebase authentication
      if (authResult.additionalUserInfo.isNewUser) {  // Check if new user
        db.collection("users").doc(user.uid).set({  // Write to Firestore using UID as document ID
          name: user.displayName,
          email: user.email,
          country: "Canada"

        }).then(function () {
          console.log("New user added to Firestore");
          db.collection("users").doc(user.uid).collection("friends").doc("friendStatus").set({
            currentFriends: [],
            pendingFriends: []
          });
        })

          .then(function () {
            window.location.assign("main.html?from=login");  // Redirect to main.html after signup
          }).catch(function (error) {
            console.log("Error adding new user: " + error);
          });
      } else {
        return true;
      }
      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: "main.html?from=login",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '<your-tos-url>',
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

ui.start('#firebaseui-auth-container', uiConfig);