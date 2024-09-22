// Firebase Configuration
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

// Facebook SDK Initialization
window.fbAsyncInit = function () {
    FB.init({
        appId: '1238020140566279',
        cookie: true,
        xfbml: true,
        version: 'v20.0'
    });

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook login status callback
function statusChangeCallback(response) {
    var shapesContainer = document.getElementById('shapes');
    var lastLoginDisplay = document.getElementById('last-login');

    if (response.status === 'connected') {
        document.getElementById('fb-login-btn').style.display = 'none';
        document.getElementById('fb-logout-btn').style.display = 'inline';
        shapesContainer.style.display = 'block'; // Show shapes
        generateShapes();

        FB.api('/me', { fields: 'name,picture' }, function (userResponse) {
            document.getElementById('user-name').textContent = 'Welcome, ' + userResponse.name + '!';
            document.getElementById('profile-pic').src = userResponse.picture.data.url;
            document.getElementById('profile-pic').onclick = function () {
                window.open('profile.html', '_blank');
            };

            var userId = userResponse.id;
            var userRef = firestore.collection('users').doc(userId);

            // Get and store the most recent login time
            userRef.get().then(function (doc) {
                var lastLoginDate = null;
                if (doc.exists && doc.data().lastLogin) {
                    lastLoginDate = new Date(doc.data().lastLogin.seconds * 1000);
                    lastLoginDisplay.textContent = formatLoginDate(lastLoginDate);
                }
                var now = new Date();
                userRef.set({
                    name: userResponse.name,
                    picture: userResponse.picture.data.url,
                    lastLogin: firebase.firestore.Timestamp.fromDate(now)
                }, { merge: true });
            }).catch(function (error) {
                console.error('Error fetching user data: ', error);
            });
        });

    } else {
        document.getElementById('fb-login-btn').style.display = 'inline';
        document.getElementById('fb-logout-btn').style.display = 'none';
        shapesContainer.style.display = 'none'; // Hide shapes
        document.getElementById('profile-pic').src = 'img/looking-good.gif';
        document.getElementById('user-name').textContent = 'Welcome!';
        lastLoginDisplay.textContent = ''; // Clear last login info
    }
}

// Login with Facebook
document.getElementById('fb-login-btn').onclick = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            statusChangeCallback(response);
        } else {
            console.log('User cancelled login or failed.');
        }
    }, { scope: 'public_profile' });
};

// Logout from Facebook
document.getElementById('fb-logout-btn').onclick = function () {
    FB.logout(function (response) {
        statusChangeCallback(response);
        document.getElementById('profile-pic').src = 'img/looking-good.gif'; // Reset profile picture
        document.getElementById('user-name').textContent = 'Welcome!';
    });
};

// Format login date and time
function formatLoginDate(date) {
    var options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return 'Your last login was on ' + date.toLocaleString('en-US', options);
}

// Shape generation
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
