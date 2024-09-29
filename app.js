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

// Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: '1238020140566279',
        cookie: true,
        xfbml: true,
        version: 'v20.0'
    });
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook login status callback
function statusChangeCallback(response) {
    var shapesContainer = document.getElementById('shapes');
    if (response.status === 'connected') {
        document.getElementById('fb-login-btn').style.display = 'none';
        document.getElementById('fb-logout-btn').style.display = 'inline';
        shapesContainer.style.display = 'block'; // Show shapes
        generateShapes();
        document.getElementById('post-box').style.display = 'block'; // Show the box for logged-in users

        // Get user info
        FB.api('/me', { fields: 'id,name,picture,hometown,gender,likes' }, function(response) {
            document.getElementById('user-name').textContent = 'Welcome, ' + response.name + '!';
            document.getElementById('profile-pic').src = response.picture.data.url;

            // Share Button logic
            document.querySelector('.fb-share-button').addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default behavior

                // Get the post text from the textarea
                const postText = document.getElementById('post-text').value;

                if (postText.trim() === "") {
                    alert("Please write something before sharing!");
                    return;
                }

                // Open the Facebook Share Dialog
                FB.ui({
                    method: 'share',
                    href: 'https://github.com/facebookegypt/evry1falls', // The link to share
                    quote: postText // Add the text from the user
                }, function(response) {
                    if (response && !response.error_message) {
                        alert('Post shared successfully!');
                    } else {
                        alert('Error while sharing post.');
                    }
                });

                // Clear the textarea after sharing
                document.getElementById('post-text').value = "";
            });

            // Modify click event to navigate to profile.html
            document.getElementById('profile-pic').onclick = function(event) {
                event.stopPropagation(); // Prevent opening Facebook profile
                const userId = response.id;
                const userName = response.name;
                const userHometown = response.hometown ? response.hometown.name : "N/A";
                const userGender = response.gender;
                const userLikes = response.likes ? response.likes.data.join(', ') : "None";
                const url = `profile.html?id=${userId}&name=${encodeURIComponent(userName)}&hometown=${encodeURIComponent(userHometown)}&gender=${userGender}&likes=${encodeURIComponent(userLikes)}`;
                window.location.href = url;
            };

            // Save user data and last login
            var currentDate = new Date();
            var formattedDate = currentDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

            firestore.collection('users').doc(response.id).set({
                name: response.name,
                picture: response.picture.data.url,
                lastLogin: formattedDate,
                hometown: response.hometown ? response.hometown.name : "N/A",
                gender: response.gender,
                likes: response.likes ? response.likes.data : []
            }).then(() => {
                displayLastLogin(formattedDate);
            }).catch(function(error) {
                console.error('Error saving user data: ', error);
            });
        });
    } else {
        document.getElementById('post-box').style.display = 'none'; // Hide the box for logged-out users
        document.getElementById('fb-login-btn').style.display = 'inline';
        document.getElementById('fb-logout-btn').style.display = 'none';
        shapesContainer.style.display = 'none'; // Hide shapes
        document.getElementById('profile-pic').src = 'img/looking-good.gif';
        document.getElementById('user-name').textContent = 'Welcome!';
    }
}

document.getElementById('fb-login-btn').onclick = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            statusChangeCallback(response);
        } else {
            console.log('User cancelled login or failed.');
        }
    }, { scope: 'public_profile,email,user_hometown,user_gender,user_likes' });
};

document.getElementById('fb-logout-btn').onclick = function() {
    FB.logout(function(response) {
        statusChangeCallback(response);
        document.getElementById('profile-pic').src = 'img/looking-good.gif'; // Reset profile picture
        document.getElementById('user-name').textContent = 'Welcome!';
        document.getElementById('last-login').style.display = 'none'; // Clear last-login message
    });
};

// Display last login message
function displayLastLogin(date) {
    var lastLoginElement = document.getElementById('last-login');
    lastLoginElement.textContent = 'Your last login was on ' + date;
    lastLoginElement.style.display = 'block'; // Show last login
}

// Shape Generation
function generateShapes() {
    const shapesContainer = document.getElementById('shapes');
    shapesContainer.innerHTML = ''; // Clear previous shapes
    const shapes = ['circle', 'rectangle', 'square'];
    const colors = ['#FF4500', '#00BFFF', '#8A2BE2', '#FF69B4'];
    for (let i = 0; i < 42; i++) {
        const shape = document.createElement('div');
        shape.style.width = Math.random() * 50 + 20 + 'px';
        shape.style.height = shape.style.width;
        shape.style.backgroundColor = 'transparent';
        shape.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
        shape.style.borderStyle = 'solid';
        shape.style.borderWidth = '2px';
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        if (shapeType === 'circle') {
            shape.style.borderRadius = '50%';
        } else if (shapeType === 'rectangle') {
            shape.style.borderRadius = '0';
        } else if (shapeType === 'square') {
            shape.style.borderRadius = '10%';
        }
        shape.style.position = 'absolute';
        shape.style.top = Math.random() * 90 + '%';
        shape.style.left = Math.random() * 90 + '%';
        shapesContainer.appendChild(shape);
    }
}
