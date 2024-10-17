// firebase-init.js
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

// Initialize Firebase only if it hasn't been initialized before
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Use the existing app
}
var auth = firebase.auth();
var firestore = firebase.firestore();
let currentUserId = "";
let isGoogleUser = false; // To check if the user is logged in via Google
//Generate Shapes
function generateShapes() {
    const shapes = document.getElementById("shapes");
    shapes.innerHTML = "";
    const colors = ["#FF4500", "#00BFFF", "#8A2BE2", "#FF69B4"];
    for (let i = 0; i < 42; i++) {
        const shape = document.createElement("div");
        shape.style.width = 50 * Math.random() + 20 + "px";
        shape.style.height = shape.style.width;
        shape.style.backgroundColor = "transparent";
        shape.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
        shape.style.borderWidth = "2px";
        shape.style.borderStyle = "solid";
        shape.style.borderRadius = Math.random() < 0.5 ? "50%" : "0";
        shape.style.position = "absolute";
        shape.style.left = Math.random() * (window.innerWidth - parseFloat(shape.style.width)) + "px";
        shape.style.top = Math.random() * (window.innerHeight - parseFloat(shape.style.height)) + "px";
        shapes.appendChild(shape);
    }
}
