"use strict";

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
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

let currentUserId = "";

function statusChangeCallback(response) {
    var shapes = document.getElementById("shapes");
    if (response.status === "connected") {
        document.getElementById("fb-login-btn").style.display = "none";
        document.getElementById("fb-logout-btn").style.display = "inline";
        document.getElementById("survey-container").style.display = "block";
        shapes.style.display = "block";
        generateShapes();

        FB.api("/me", { fields: "id,name,picture,hometown,gender,likes,link" }, function (userData) {
            document.getElementById("user-name").textContent = "Welcome, " + userData.name + "!";
            document.getElementById("profile-pic").src = userData.picture.data.url;

            currentUserId = userData.id;

            saveUserData(userData);
        });
    } else {
        document.getElementById("fb-login-btn").style.display = "inline";
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

    firestore.collection("users").doc(userData.id).set({
        name: userData.name,
        picture: userData.picture.data.url,
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

function displayLastLogin(lastLogin) {
    var lastLoginElem = document.getElementById("last-login");
    lastLoginElem.textContent = "Your last login was on " + lastLogin;
    lastLoginElem.style.display = "block";

    document.querySelector('.delete-link').style.display = "inline";
}

function hideLastLogin() {
    document.getElementById("last-login").style.display = "none";
    document.querySelector('.delete-link').style.display = "none";
}

document.getElementById("fb-login-btn").onclick = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            statusChangeCallback(response);
        } else {
            console.log("User cancelled login or failed.");
        }
    }, { scope: "public_profile,email,user_hometown,user_gender,user_link" });
};

document.getElementById("fb-logout-btn").onclick = function () {
    FB.logout(function (response) {
        statusChangeCallback(response);
        document.getElementById("profile-pic").src = "img/looking-good.gif";
        document.getElementById("user-name").textContent = "Welcome!";
        hideLastLogin();
    });
};

// Deleting user data via link
document.querySelector('.delete-link').onclick = function () {
    if (currentUserId) {
        deleteUserData(currentUserId);
    } else {
        console.error("No user is currently logged in.");
    }
};

function deleteUserData(userId) {
    firestore.collection("users").doc(userId).delete().then(() => {
        console.log("User data deleted successfully");
    }).catch((error) => {
        console.error("Error deleting user data: ", error);
    });
}

function generateShapes() {
    const shapesContainer = document.getElementById("shapes");
    shapesContainer.innerHTML = "";
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
        shapesContainer.appendChild(shape);
    }
}
