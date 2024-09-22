document.addEventListener("DOMContentLoaded", function() {
    // Assuming the user ID is stored in local storage when logged in
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        const firestore = firebase.firestore();
        
        firestore.collection('users').doc(userId).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('profile-pic').src = userData.picture;
                document.getElementById('user-name').textContent = userData.name;
                document.getElementById('user-gender').textContent = userData.gender === 'male' ? 'Mr.' : 'Ms.';
                document.getElementById('user-hometown').textContent = userData.hometown; // Adjust based on your data structure
                document.getElementById('last-login').textContent = userData.lastLogin; // Ensure this is stored correctly
                const likesList = document.getElementById('user-likes');
                userData.likes.forEach(like => {
                    const li = document.createElement('li');
                    li.textContent = like;
                    likesList.appendChild(li);
                });
            } else {console.log("No such document!");}
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    } else {
        console.log("No user ID found!");
        // Redirect to login or show a message
    }
});
