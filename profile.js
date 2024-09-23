// Firebase Initialization
var firestore = firebase.firestore();

window.onload = function() {
    var userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login

    if (userId) {
        firestore.collection('users').doc(userId).get().then(function(doc) {
            if (doc.exists) {
                var userData = doc.data();

                // Populate user info
                document.getElementById('profile-pic').src = userData.picture;
                document.getElementById('user-name').textContent = userData.gender === 'male' ? 'Mr. ' + userData.name : 'Ms. ' + userData.name;
                document.getElementById('user-gender').textContent = userData.gender === 'male' ? 'Male' : 'Female';
                document.getElementById('user-hometown').textContent = userData.hometown || 'Hometown info not available';
                document.getElementById('user-likes').textContent = userData.likes && userData.likes.length > 0 ? 'Likes: ' + userData.likes.join(', ') : 'No likes listed';
            } else {
                console.log("No such user document!");
            }
        }).catch(function(error) {
            console.log("Error getting user data:", error);
        });
    } else {
        console.log("No user is logged in.");
    }
};
