"use strict";

// Check if a user is already logged in on page load
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is logged in
        handleGoogleUserLogin(user); // Handle user login on page load
        var shapes = document.getElementById("shapes");
    }
});

// Initialize Google authentication
document.getElementById("google-login-btn").onclick = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        var user = result.user;
        handleGoogleUserLogin(user); // Call this function to handle the logged-in state
    }).catch((error) => {
        console.error("Google sign-in error:", error);
    });
};

// Handle Google user login
function handleGoogleUserLogin(user) {

    document.getElementById("user-name").textContent = "Welcome, " + user.displayName + "!";
    document.getElementById("profile-pic").src = user.photoURL;

    currentUserId = user.uid;
    isGoogleUser = true;

    saveGoogleUserData(user); // Save user data to Firestore

    // Update UI
    document.getElementById("google-login-btn").style.display = "none";
    document.getElementById("fb-login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline";
    document.getElementById("survey-container").style.display = "block";
	shapes.style.display = "block";
        generateShapes();
}

// Save Google user data
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

// Display last login time
function displayLastLogin(lastLoginTime) {
    var lastLoginElement = document.getElementById("last-login");
    lastLoginElement.textContent = "Your last login was on " + lastLoginTime;
    lastLoginElement.style.display = "block";
}

// Handle logout
document.getElementById("logout-btn").onclick = function() {
    auth.signOut().then(() => {
        // Clear UI after logout
        document.getElementById("user-name").textContent = "";
        document.getElementById("profile-pic").src = "";
        document.getElementById("google-login-btn").style.display = "inline";
        document.getElementById("fb-login-btn").style.display = "inline";
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("survey-container").style.display = "none";
        document.getElementById("last-login").style.display = "none";
    }).catch((error) => {
        console.error("Logout error:", error);
    });
};