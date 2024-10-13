"use strict";
// Firebase configuration
var firebaseConfig = {
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

var firestore = firebase.firestore();

// Ensure session persistence for both Google and Facebook login
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Handle Facebook and Google login buttons
let currentUserId = "";

// Check for any redirect results
firebase.auth().getRedirectResult().then((result) => {
    if (result.user) {
        handleLoginSuccess(result.user);
    }
}).catch((error) => {
    console.error("Error during redirect login: ", error);
});

// Facebook login initialization
window.fbAsyncInit = function () {
    FB.init({
        appId: "880835337346722",
        cookie: true,
        xfbml: true,
        version: "v21.0"
    });

    // Get the login status of the Facebook user
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

// Facebook SDK
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook status change callback
function statusChangeCallback(response) {
    if (response.status === 'connected') {
        // Facebook user logged in
        FB.api("/me", { fields: "id,name,picture,hometown,gender,likes,link" }, function (userData) {
            handleLoginSuccess(userData);
        });
    }
}

// Google login
document.getElementById("google-login-btn").onclick = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};

// Facebook login
document.getElementById("fb-login-btn").onclick = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            statusChangeCallback(response);
        } else {
            console.log("User cancelled login or failed.");
        }
    }, { scope: "public_profile,email,user_hometown,user_gender,user_link" });
};

// Handle successful login for both Facebook and Google
function handleLoginSuccess(userData) {
    document.getElementById("fb-login-btn").style.display = "none";
    document.getElementById("google-login-btn").style.display = "none";
    document.getElementById("fb-logout-btn").style.display = "inline";
    document.getElementById("survey-container").style.display = "block";
    document.getElementById("shapes").style.display = "block";
    generateShapes();

    // Show user info
    document.getElementById("user-name").textContent = "Welcome, " + (userData.displayName || userData.name) + "!";
    document.getElementById("profile-pic").src = userData.photoURL || userData.picture.data.url;

    // Store user ID
    currentUserId = userData.uid || userData.id;
    saveUserData(userData);

    // Show the delete link
    const deleteLink = document.querySelector('.delete-link');
    deleteLink.style.display = "inline";
    deleteLink.onclick = function () {
        if (currentUserId) {
            deleteUserData(currentUserId);
        } else {
            console.error("No user is currently logged in.");
        }
    };
}

// Save user data to Firestore
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
    firestore.collection("users").doc(userData.uid || userData.id).set({
        name: userData.displayName || userData.name,
        picture: userData.photoURL || userData.picture.data.url,
        lastLogin: lastLoginTime,
        hometown: userData.hometown ? userData.hometown.name : "N/A",
        gender: userData.gender,
        link: userData.link
    }).then(() => {
        displayLastLogin(lastLoginTime);
    }).catch(function (error) {
        console.error("Error saving user data: ", error);
    });
}

// Display last login info
function displayLastLogin(lastLoginTime) {
    var lastLoginElement = document.getElementById("last-login");
    lastLoginElement.textContent = "Your last login was on " + lastLoginTime;
    lastLoginElement.style.display = "block";
}

// Hide login info
function hideLastLogin() {
    document.getElementById("last-login").style.display = "none"; // Hide last login message
    document.querySelector('.delete-link').style.display = "none"; // Hide the delete link as well
    document.getElementById("shapes").style.display = "none"; // Hide shapes
}

// Delete user data
function deleteUserData(userId) {
    firestore.collection("users").doc(userId).delete().then(() => {
        console.log("User data deleted successfully");
        firebase.auth().signOut().then(() => {
            console.log("User signed out after data deletion.");
        });
    }).catch((error) => {
        console.error("Error deleting user data: ", error);
    });
}

// Generate shapes
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

// Logout button functionality
document.getElementById("fb-logout-btn").onclick = function () {
    firebase.auth().signOut().then(() => {
        console.log("User signed out.");
        document.getElementById("profile-pic").src = "img/looking-good.gif";
        document.getElementById("user-name").textContent = "Welcome!";
        document.getElementById("survey-container").style.display = "none";
        hideLastLogin();
    }).catch((error) => {
        console.error("Error during sign out: ", error);
    });
};

// Survey form submission
document.getElementById("survey-form").onsubmit = function (event) {
    event.preventDefault();
    const favoriteColor = document.getElementById("question1").value;
    const facebookUsage = document.getElementById("question2").value;
    const resultText = `Favorite Color: ${favoriteColor}<br>Facebook Usage: ${facebookUsage}`;
    document.getElementById("result-text").innerHTML = resultText;
    document.getElementById("survey-results").style.display = "block";
};

// Share results functionality
document.getElementById("share-results").onclick = function () {
    const resultText = document.getElementById("result-text").innerHTML;
    const blob = new Blob([resultText], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "survey_results.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
