"use strict";
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
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    var shapes = document.getElementById("shapes");
    if (response.status === "connected") {
        document.getElementById("fb-login-btn").style.display = "none";
        document.getElementById("google-login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "inline";
	shapes.style.display = "block";
        generateShapes();

        FB.api("/me", { fields: "id,name,picture,hometown,gender" }, function(userData) {
            document.getElementById("user-name").textContent = "Welcome, " + userData.name + "!";
            document.getElementById("profile-pic").src = userData.picture.data.url;

            currentUserId = userData.id; // Ensure currentUserId is defined here

            saveUserData(userData); // Save user data to Firestore

            // Show the delete link
            const deleteLink = document.querySelector('.delete-link');
            deleteLink.style.display = "inline";
            deleteLink.onclick = function() {
                if (currentUserId) {
                    deleteUserData(currentUserId);
                } else {
                    console.error("No user is currently logged in.");
                }
            };
        });
    } else {
        document.getElementById("fb-login-btn").style.display = "inline";
        document.getElementById("google-login-btn").style.display = "inline";
        document.getElementById("logout-btn").style.display = "none";
        hideLastLogin();
    }
}

function saveUserData(userData) {
    const lastLoginTime = new Date().toLocaleString();
    
    // Ensure request.auth.uid matches Facebook UID when saving data
    firestore.collection("users").doc(userData.uid).set({
        name: userData.name,
        picture: userData.picture.data.url,
        lastLogin: lastLoginTime,
        hometown: userData.hometown ? userData.hometown.name : "N/A",
        gender: userData.gender
    }).then(() => {
        displayLastLogin(lastLoginTime);
    }).catch(function(error) {
        console.error("Error saving user data: ", error + ' ' + currentUserId);
    });
}

function displayLastLogin(lastLoginTime) {
    var lastLoginElement = document.getElementById("last-login");
    lastLoginElement.textContent = "Your last login was on " + lastLoginTime;
    lastLoginElement.style.display = "block";
}

function hideLastLogin() {
    document.getElementById("last-login").style.display = "none"; // Hide last login message
    document.querySelector('.delete-link').style.display = "none"; // Hide the delete link
    document.getElementById("shapes").style.display = "none"; // Hide shapes
}

function deleteUserData(userId) {
    firestore.collection("users").doc(userId).delete().then(() => {
        console.log("User data deleted successfully");
    }).catch((error) => {
        console.error("Error deleting user data: ", error);
    });
}
// Facebook Login
document.getElementById("fb-login-btn").onclick = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            statusChangeCallback(response);
        } else {
            console.log("User cancelled login or failed.");
        }
    }, { scope: "public_profile,email" });
};

// Common Logout Button
document.getElementById("logout-btn").onclick = function() {
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
            hideLastLogin();
        });
    }
};
