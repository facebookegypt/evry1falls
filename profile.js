// Reference to Firestore
const firestore = firebase.firestore();

// Extract user details from URL or set it manually for now
const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get('id');

console.log("Attempting to access document with ID:", userId); // Log the ID

// Check if user ID is available
if (userId) {
    // Retrieve user data from Firestore
    firestore.collection('users').doc(userId).get().then(function(doc) {
        if (doc.exists) {
            const userData = doc.data();
            const profilePicture = document.getElementById('profile-picture');
            const profileName = document.getElementById('profile-name');
            const profileHometown = document.getElementById('profile-hometown');
            const profileLikes = document.getElementById('profile-likes');

            // Populate profile details
            profilePicture.src = userData.picture || 'img/default-avatar.png';
            profileName.textContent = (userData.gender === 'male' ? 'Mr.' : 'Ms.') + ' ' + userData.name;
            profileHometown.textContent = userData.hometown || 'No hometown provided.';

console.log("User Likes:", userData.likes);
            // Populate likes list
profileLikes.innerHTML = ''; // Clear previous likes
if (userData.likes && userData.likes.length > 0) {
    userData.likes.forEach(function(like) {
        const listItem = document.createElement('li');
        // Change 'name' to the actual property you see in the logged object
        listItem.textContent = like.title || like.name || 'Unnamed like';
        profileLikes.appendChild(listItem);
    });
} else {
    profileLikes.innerHTML = '<li>No likes provided.</li>';
}
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.error("Error getting document:", error);
    });
} else {
    console.error("User ID not provided in the URL.");
}
