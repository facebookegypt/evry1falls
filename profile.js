// Initialize Firebase
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

// Function to fetch user data from Firestore
function fetchUserData() {
    // Assuming user ID is stored in local storage or can be accessed
    var userId = localStorage.getItem('userId'); // Get user ID from local storage

    firestore.collection('users').doc(userId).get().then((doc) => {
        if (doc.exists) {
            var userData = doc.data();
            document.getElementById('user-name').textContent = userData.name;
            document.getElementById('profile-pic').src = userData.picture;
            document.getElementById('gender').textContent = userData.gender === 'male' ? 'Mr.' : 'Ms.';
            document.getElementById('hometown').textContent = 'Hometown: ' + userData.hometown;
            userData.likes.forEach(like => {
                var li = document.createElement('li');
                li.textContent = like; // Add each like to the list
                document.getElementById('likes-list').appendChild(li);
            });
            document.getElementById('last-login-message').textContent = 'Your last login was on ' + userData.lastLogin;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Call the fetchUserData function on page load
window.onload = fetchUserData;
