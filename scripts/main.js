function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;
            userEmail = user.email;
            //method #1:  insert with JS
            
            document.getElementById("name-goes-here").innerText = userName;    
            document.getElementById("email-goes-here").innerText = userEmail;

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function

const urlParams = new URLSearchParams(window.location.search);
const fromLogin = urlParams.get('from') === 'login';
if (fromLogin) {
const toastLiveExample = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
toastBootstrap.show();
}


  