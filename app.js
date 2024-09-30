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
    if (response.status === 'connected') {
        document.getElementById('fb-login-btn').style.display = 'none';
        document.getElementById('fb-logout-btn').style.display = 'inline';
        document.getElementById('survey-box').style.display = 'block'; // Show the survey for logged-in users
    } else {
        document.getElementById('fb-login-btn').style.display = 'inline';
        document.getElementById('fb-logout-btn').style.display = 'none';
        document.getElementById('survey-box').style.display = 'none';
        document.getElementById('profile-pic').src = 'img/looking-good.gif';
        document.getElementById('user-name').textContent = 'Welcome!';
    }
}

// Handle survey submission
document.getElementById('survey-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var result = `
        Satisfaction: ${document.getElementById('question1').value}.
        Likelihood to recommend: ${document.getElementById('question2').value}.
    `;

    document.getElementById('survey-result').textContent = result;
    document.getElementById('survey-box').style.display = 'none';
    document.getElementById('result-box').style.display = 'block';
});

// Share the result as text
function shareAsText() {
    const result = document.getElementById('survey-result').textContent;
    FB.ui({
        method: 'share',
        quote: result,
    }, function(response) {
        if (response && !response.error_message) {
            alert('Result shared successfully!');
        } else {
            alert('Error while sharing the result.');
        }
    });
}

// Share the result as an image
function shareAsImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '20px Poppins';
    ctx.fillStyle = '#333';
    ctx.fillText(document.getElementById('survey-result').textContent, 50, 100);

    const dataURL = canvas.toDataURL('image/png');
    const resultImage = document.getElementById('result-image');
    resultImage.src = dataURL;
    resultImage.style.display = 'block';
}
