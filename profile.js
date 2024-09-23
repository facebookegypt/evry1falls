// Reference to Firestore
var firestore = firebase.firestore();

// Get user ID (This would ideally come from your login process or Firebase Auth)
var userId = "USER_ID"; // Replace with logic to get actual user ID

// Retrieve user data from Firestore
firestore.collection('users').doc(userId).get().then(function(doc) {
    if (doc.exists) {
        var userData = doc.data();

        // Populate profile details
        document.getElementById('profile-picture').src = userData.picture || 'img/default-avatar.png';
        document.getElementById('profile-name').textContent = (userData.gender === 'male' ? 'Mr.' : 'Ms.') + ' ' + userData.name;
        document.getElementById('profile-hometown').textContent = userData.hometown || 'No hometown provided.';
        
        // Populate likes list
        var likesList = document.getElementById('profile-likes');
        likesList.innerHTML = ''; // Clear previous likes
        if (userData.likes && userData.likes.length > 0) {
            userData.likes.forEach(function(like) {
                var listItem = document.createElement('li');
                listItem.textContent = like;
                likesList.appendChild(listItem);
            });
        } else {
            likesList.innerHTML = '<li>No likes provided.</li>';
        }
    } else {
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
