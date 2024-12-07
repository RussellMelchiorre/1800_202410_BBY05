# Project Title
RoutineSync

## 1. Project Description
This browser based web application to help keep you and your friends on task and improve your productivity, you can create and delete events, use preset timers, create custom timers and alarms, and manage your friendships. 

## 2. Names of Contributors
* ... Hailey Kim, I'm from Korea, I'm a cat person
* Russell Melchiorre
* Tyrone Cheang
	
## 3. Technologies and Resources Used
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Google material icons
* 

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* The project can be hosted through a liveserve service
* The project can also be acessed at: https://comp-1800-202430-team05.web.app/

## 5. Known Bugs and Limitations
Here are some known bugs:
* Sometimes the notifications bell will not load in properly and only display its identificator "notifications".
* The repeat event function sometimes does not stop on the end date.
* ...

## 6. Features for Future
What we'd like to build in the future:
* We would like to add better navigation such as where friends names can be clicked to bring up thier events.
* We would like to add a feature to be able to import external calendars.
* We would like to add a way to add friend and login through external sources.
* We would like to add timers which work across all pages.
	
## 7. Contents of Folder
Content of the project folder:

1800_202410_BBY05/
├─ .firebase/
│  └─ hosting..cache
├─ .firebaserc
├─ .gitignore
├─ .vscode/
│  └─ settings.json
├─ 404.html
├─ alarmTimers.html
├─ countdownTimers.html
├─ firebase.json
├─ firestore.indexes.json
├─ firestore.rules
├─ images/
│  └─ Toast-image.png
├─ index.html
├─ login.html
├─ main.html
├─ notifs.html
├─ presetTimers.html
├─ profile.html
├─ README.md
├─ schedule.html
├─ scripts/
│  ├─ alarmTimers.js
│  ├─ authentication.js
│  ├─ calendar.js
│  ├─ countdownTimers.js
│  ├─ firebaseAPI_TEAM05 copy.js
│  ├─ firebaseAPI_TEAM05.js
│  ├─ friends.js
│  ├─ main.js
│  ├─ presetTimers.js
│  ├─ script.js
│  └─ skeleton.js
├─ styles/
│  └─ style.css
├─ template.html
├─ text/
│  ├─ footer.html
│  ├─ nav_after_login.html
│  └─ nav_before_login.html
├─ underConst.html
└─ underConstPreLogin.html

        
## Firebase rules

service cloud.firestore {
  match /databases/{database}/documents {

    // Match for timers in the user's document
    match /users/{userId}/timers/{timerId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Match for alarms in the user's document
    match /users/{userId}/alarms/{alarmId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Main user document match
    match /users/{userId} {
      // Allow read/write for the user's own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
			
      //for writing previous friend requests
      match /friends/{friendRequest}{
      allow read, write: if request.auth != null;
      }
      
      // Match for friends subcollection
      match /friends/friendStatus {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        allow write: if request.auth != null; // Allow any authenticated user to write
      }

      // Match for events in the user's document
      match /events/{eventId} {
        // Allow read for the user or their friends
        allow read: if request.auth != null && (
          request.auth.uid == userId ||
          request.auth.uid in get(/databases/$(database)/documents/users/$(userId)/friends/friendStatus).data.currentFriends
        );
        // Allow write if the user is authenticated
        allow write: if request.auth != null;
      }

      // Match for alerts in the user's document (new rule added here)
      match /alerts/{alertId} {
        // Allow read and write for the user only
        allow read, write: if request.auth != null;
      }
    }

    // Allow read for any authenticated user on user documents (general rule)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}



