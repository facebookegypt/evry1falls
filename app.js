"use strict";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdDxwmuS9w0VnfYzLL2ptYBI4GYUWuZqQ",
  authDomain: "git-hub-test-34e5a.firebaseapp.com",
  databaseURL: "https://git-hub-test-34e5a-default-rtdb.firebaseio.com",
  projectId: "git-hub-test-34e5a",
  storageBucket: "git-hub-test-34e5a.appspot.com",
  messagingSenderId: "824616741271",
  appId: "1:824616741271:web:7d068b5de85ba781757cd2",
  measurementId: "G-TV39YCR646"
};
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();
let currentUserId = "";
let isGoogleUser = false;

// Facebook SDK initialization
window.fbAsyncInit = function() {
  FB.init({
    appId: "880835337346722",
    cookie: true,
    xfbml: true,
    version: "v21.0"
  });
  
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// Insert Facebook SDK
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Auth state listener
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    handleGoogleUserLogin(user);
  } else {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
});

function handleGoogleUserLogin(user) {
  currentUserId = user.uid;
  isGoogleUser = true;

  document.getElementById("user-name").textContent = "Welcome, " + user.displayName + "!";
  document.getElementById("profile-pic").src = user.photoURL;

  saveGoogleUserData(user);

  document.getElementById("google-login-btn").style.display = "none";
  document.getElementById("fb-login-btn").style.display = "none";
  document.getElementById("fb-logout-btn").style.display = "inline";
  document.getElementById("survey-container").style.display = "block";
  showDeleteLink(); // Show delete link for Google users

  displayLastLogin(user.metadata.lastSignInTime); // Display last login time
}

function statusChangeCallback(response) {
  var shapes = document.getElementById("shapes");
  if (response.status === "connected") {
    isGoogleUser = false; // Facebook login, so not Google
    document.getElementById("fb-login-btn").style.display = "none";
    document.getElementById("google-login-btn").style.display = "none";
    document.getElementById("fb-logout-btn").style.display = "inline";
    document.getElementById("survey-container").style.display = "block";
    shapes.style.display = "block";
    generateShapes();

    FB.api("/me", {
      fields: "id,name,picture,hometown,gender,likes,link"
    }, function(userData) {
      document.getElementById("user-name").textContent = "Welcome, " + userData.name + "!";
      document.getElementById("profile-pic").src = userData.picture.data.url;

      currentUserId = userData.id;

      saveUserData(userData);
      showDeleteLink(); // Show delete link for Facebook users
    });
  } else {
    document.getElementById("fb-login-btn").style.display = "inline";
    document.getElementById("google-login-btn").style.display = "inline";
    document.getElementById("fb-logout-btn").style.display = "none";
    hideLastLogin();
  }
}

function saveUserData(userData) {
  var lastLoginTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  // Ensure the document is saved with the user ID
  firestore.collection("users").doc(userData.id).set({
    name: userData.name,
    picture: userData.picture.data.url,
    lastLogin: lastLoginTime,
    hometown: userData.hometown ? userData.hometown.name : "N/A",
    gender: userData.gender,
    link: userData.link
  }).then(() => {
    displayLastLogin(lastLoginTime);
  }).catch(function(error) {
    console.error("Error saving user data: ", error);
  });
}

function displayLastLogin(lastLoginTime) {
  var lastLoginElement = document.getElementById("last-login");
  lastLoginElement.textContent = "Your last login was on " + lastLoginTime;
  lastLoginElement.style.display = "block";
}

function hideLastLogin() {
  document.getElementById("last-login").style.display = "none"; // Hide last login message
  document.querySelector('.delete-link').style.display = "none"; // Hide the delete link as well
  document.getElementById("shapes").style.display = "none"; // Hide shapes
}

// Show delete link for both Google and Facebook users
function showDeleteLink() {
  const deleteLink = document.querySelector('.delete-link');
  deleteLink.style.display = "inline";
  deleteLink.onclick = function() {
    if (currentUserId) {
      deleteUserData(currentUserId);
    } else {
      console.error("No user is currently logged in.");
    }
  };
}

function deleteUserData(userId) {
  firestore.collection("users").doc(userId).delete().then(() => {
    console.log("User data deleted successfully");
    if (isGoogleUser) {
      auth.signOut().then(() => {
        console.log("Google user signed out after data deletion.");
        window.location.reload(); // Refresh the page after logout
      }).catch((error) => {
        console.error("Error signing out Google user: ", error);
      });
    } else {
      FB.logout(function(response) {
        statusChangeCallback(response); // Update the UI after logout
        console.log("Facebook user logged out and data deleted.");
      });
    }
  }).catch((error) => {
    console.error("Error deleting user data: ", error);
  });
}

function generateShapes() {
  const shapes = document.getElementById("shapes");
  shapes.innerHTML = "";
  const colors = ["#FF4500", "#00BFFF", "#8A2BE2", "#FF69B4"];
  for (let i = 0; i < 42; i++) {
    const shape = document.createElement("div");
    shape.style.width = 50 * Math.random() + 20 + "px";
    shape.style.height = shape.style.width;
    shape.style.backgroundColor = "transparent";
    shape.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
    shape.style.borderWidth = "2px";
    shape.style.borderStyle = "solid";
    shape.style.borderRadius = Math.random() < 0.5 ? "50%" : "0";
    shape.style.position = "absolute";
    shape.style.left = Math.random() * (window.innerWidth - parseFloat(shape.style.width)) + "px";
    shape.style.top = Math.random() * (window.innerHeight - parseFloat(shape.style.height)) + "px";
    shapes.appendChild(shape);
  }
}

// Google Sign-In using redirect
document.getElementById("google-login-btn").onclick = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider); // Use redirect instead of pop-up
};

// Handle the redirect result after login
auth.getRedirectResult().then(function(result) {
  if (result.user) {
    handleGoogleUserLogin(result.user); // Process the Google login and update UI
  }
}).catch(function(error) {
  console.error("Google redirect error:", error);
});

// Save Google user data to Firestore
function saveGoogleUserData(user) {
  var lastLoginTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });

  firestore.collection("users").doc(user.uid).set({
    name: user.displayName,
    picture: user.photoURL,
    lastLogin: lastLoginTime
  }).then(() => {
    displayLastLogin(lastLoginTime);
  }).catch(function(error) {
    console.error("Error saving Google user data: ", error);
  });
}

// Facebook login button click event
document.getElementById("fb-login-btn").onclick = function() {
  FB.login(function(response) {
    if (response.authResponse) {
      statusChangeCallback(response);
    } else {
      console.log("User cancelled login or failed.");
    }
  }, {
    scope: "public_profile,email,user_hometown,user_gender,user_link"
  });
};

// Logout button click event
document.getElementById("fb-logout-btn").onclick = function() {
  if (isGoogleUser) {
    auth.signOut().then(() => {
      console.log("Google user logged out.");
      window.location.reload();
    }).catch((error) => {
      console.error("Error logging out Google user:", error);
    });
  } else {
    FB.logout(function(response) {
      statusChangeCallback(response);
      document.getElementById("profile-pic").src = "img/looking-good.gif";
      document.getElementById("user-name").textContent = "Welcome!";
      document.getElementById("survey-container").style.display = "none";
      hideLastLogin();
    });
  }
};

// Survey form submission handling
document.getElementById("survey-form").onsubmit = function(event) {
  event.preventDefault();
  const favoriteColor = document.getElementById("question1").value;
  const facebookUsage = document.getElementById("question2").value;
  const resultText = `Favorite Color: ${favoriteColor}<br>Facebook Usage: ${facebookUsage}`;
  document.getElementById("result-text").innerHTML = resultText;
  document.getElementById("survey-results").style.display = "block";
};

// Share results button click event
document.getElementById("share-results").onclick = function() {
  const resultText = document.getElementById("result-text").innerHTML;
  const blob = new Blob([resultText], {
    type: "text/html"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "survey_results.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
