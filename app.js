"use strict";

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
let isGoogleUser = false; // To track if the user is logged in via Google

// Facebook SDK initialization
window.fbAsyncInit = function () {
    FB.init({
        appId: "880835337346722",
        cookie: true,
        xfbml: true,
        version: "v21.0"
    });

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

// Insert Facebook SDK
(function (d, s, id) {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Check if a user is logged in when the page is reloaded
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUserId = user.uid;
        isGoogleUser = user.providerData[0].providerId === 'google.com';

        // Update UI elements
        document.getElementById("user-name").textContent = "Welcome, " + user.displayName + "!";
        document.getElementById("profile-pic").src = user.photoURL;
        document.getElementById("survey-container").style.display = "block";
        document.getElementById("google-login-btn").style.display = "none";
        document.getElementById("fb-login-btn").style.display = "none";
        document.getElementById("fb-logout-btn").style.display = "inline";

        // Display last login time
        if (isGoogleUser) {
            saveGoogleUserData(user);
        } else {
            saveUserData({
                id: user.uid,
                name: user.displayName,
                picture: user.photoURL
            });
        }
        showDeleteLink();
    } else {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response); // Facebook login
        });
    }
});

function statusChangeCallback(response) {
    if (response.status === "connected") {
        isGoogleUser = false; // Facebook login
        const shapes = document.getElementById("shapes");
        shapes.style.display = "block";
        generateShapes();

        FB.api("/me", { fields: "id,name,picture,hometown,gender,likes,link" }, function (userData) {
            currentUserId = userData.id;
            document.getElementById("user-name").textContent = "Welcome, " + userData.name + "!";
            document.getElementById("profile-pic").src = userData.picture.data.url;
            saveUserData(userData);
            showDeleteLink(); // Show delete link for Facebook users
        });
    } else {
        hideLastLogin();
    }
}

function saveUserData(userData) {
    const lastLoginTime = new Date().toLocaleString();
    firestore.collection("users").doc(userData.id).set({
        name: userData.name,
        picture: userData.picture.data.url,
        lastLogin: lastLoginTime,
        hometown: userData.hometown ? userData.hometown.name : "N/A",
        gender: userData.gender
    }).then(() => {
        displayLastLogin(lastLoginTime);
    }).catch(function (error) {
        console.error("Error saving user data: ", error);
    });
}

function displayLastLogin(lastLoginTime) {
    const lastLoginElement = document.getElementById("last-login");
    lastLoginElement.textContent = "Your last login was on " + lastLoginTime;
    lastLoginElement.style.display = "block";
}

function hideLastLogin() {
    document.getElementById("last-login").style.display = "none";
    document.querySelector('.delete-link').style.display = "none";
    document.getElementById("shapes").style.display = "none";
}

// Show delete link for both Google and Facebook users
function showDeleteLink() {
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
            FB.logout(function (response) {
                statusChangeCallback(response);
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
        shape.style.width = Math.random() * 50 + 20 + "px";
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

// Google Sign-In using Popup
document.getElementById("google-login-btn").onclick = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        handleGoogleUserLogin(result.user);
    }).catch((error) => {
        console.error("Google sign-in error:", error);
    });
};

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
    showDeleteLink();
}

function saveGoogleUserData(user) {
    const lastLoginTime = new Date().toLocaleString();
    firestore.collection("users").doc(user.uid).set({
        name: user.displayName,
        picture: user.photoURL,
        lastLogin: lastLoginTime
    }).then(() => {
        displayLastLogin(lastLoginTime);
    }).catch(function (error) {
        console.error("Error saving Google user data: ", error);
    });
}

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

// Logout for both Google and Facebook
document.getElementById("fb-logout-btn").onclick = function () {
    if (isGoogleUser) {
        auth.signOut().then(() => {
            window.location.reload();
        }).catch((error) => {
            console.error("Error logging out Google user:", error);
        });
    } else {
        FB.logout(function (response) {
            statusChangeCallback(response);
            document.getElementById("profile-pic").src = "img/looking-good.gif";
            document.getElementById("user-name").textContent = "Welcome!";
            document.getElementById("survey-container").style.display = "none";
            hideLastLogin();
        });
    }
};
