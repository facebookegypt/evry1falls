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
        document.getElementById('survey-container').style.display = 'block'; // show survey container
        shapesContainer.style.display = 'block'; // Show shapes
        generateShapes();
            // Get user info
        FB.api('/me', { fields: 'id,name,picture,hometown,gender,likes,link' }, function(response) {
            document.getElementById('user-name').textContent = 'Welcome, ' + response.name + '!';
            document.getElementById('profile-pic').src = response.picture.data.url;
             // Modify click event to navigate to profile.html
            document.getElementById('profile-pic').onclick = function(event) {
                event.stopPropagation(); // Prevent opening Facebook profile
                const userId = response.id;
                const userName = response.name;
                const userHometown = response.hometown ? response.hometown.name : "N/A";
                const userGender = response.gender;
                const userLikes = response.likes ? response.likes.data.join(', ') : "None";
                const userlink = response.link;
                const url = `profile.html?id=${userId}&name=${encodeURIComponent(userName)}&hometown=${encodeURIComponent(userHometown)}&gender=${userGender}&likes=${encodeURIComponent(userLikes)}&link=${userlink}`;
                window.location.href = url;
            };
            // Save user data
            saveUserData(response);
        });
    } else {
        document.getElementById('fb-login-btn').style.display = 'inline';
        document.getElementById('fb-logout-btn').style.display = 'none';
        document.getElementById('profile-pic').src = 'img/looking-good.gif';
        document.getElementById('user-name').textContent = 'Welcome!';
        document.getElementById('survey-container').style.display = 'none'; // Hide survey container
        shapesContainer.style.display = 'none'; // hide shapes
    }}

// Function to save user data to Firestore
function saveUserData(user) {
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

    // Check if the link exists, otherwise set it to "N/A"
    const userLink = user.link ? user.link : "N/A"; 

    firestore.collection('users').doc(user.id).set({
        name: user.name,
        picture: user.picture.data.url,
        lastLogin: formattedDate,
        hometown: user.hometown ? user.hometown.name : "N/A",
        gender: user.gender,
        link: userLink // Safely assign the user link
    }).then(() => {
        displayLastLogin(formattedDate);
    }).catch(function(error) {
        console.error('Error saving user data: ', error);
    });
}


// Display last login message
function displayLastLogin(date) {
    var lastLoginElement = document.getElementById('last-login');
    lastLoginElement.textContent = 'Your last login was on ' + date;
    lastLoginElement.style.display = 'block'; // Show last login
}

// Check login state
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

// Facebook login button
FB.login(function(response) {
    if (response.authResponse) {
        statusChangeCallback(response);
    } else {
        console.log('User cancelled login or failed.');
    }
}, { scope: 'public_profile,email,user_hometown,user_gender,user_link' }); 

document.getElementById('fb-login-btn').onclick = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            statusChangeCallback(response);
        } else {
            console.log('User cancelled login or failed.');
        }
    }, { scope: 'public_profile,email,user_hometown,user_gender,user_link' });// Add 'user_link' permission
};

// Facebook logout button
document.getElementById('fb-logout-btn').onclick = function() {
    FB.logout(function(response) {
        statusChangeCallback(response);
        document.getElementById('profile-pic').src = 'img/looking-good.gif'; // Reset profile picture
        document.getElementById('user-name').textContent = 'Welcome!';
        document.getElementById('last-login').style.display = 'none'; // Clear last-login message
        document.getElementById('survey-container').style.display = 'none'; // Hide survey container
    });
};
// Survey form submission
document.getElementById('survey-form').onsubmit = function(event) {
    event.preventDefault(); // Prevent default form submission
    const question1 = document.getElementById('question1').value;
    const question2 = document.getElementById('question2').value;

    // Display survey results
    const resultText = `Favorite Color: ${question1}<br>Facebook Usage: ${question2}`;
    document.getElementById('result-text').innerHTML = resultText;
    document.getElementById('survey-results').style.display = 'block';
};

// Share results functionality
document.getElementById('share-results').onclick = function() {
    const resultsText = document.getElementById('result-text').innerHTML;
    const blob = new Blob([resultsText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey_results.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
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
        shape.style.borderWidth = '2px';
        shape.style.borderStyle = 'solid';
        shape.style.borderRadius = Math.random() < 0.5 ? '50%' : '0';
        shape.style.position = 'absolute';
        shape.style.left = Math.random() * 100 + 'vw';
        shape.style.top = Math.random() * 100 + 'vh';
        shapesContainer.appendChild(shape);
    }
}
