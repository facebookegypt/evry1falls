<?php
// Initialize the session - is required to check the login state.
session_start();
// Check if the user is logged in, if not then redirect to login page
if (!isset($_SESSION['facebook_loggedin'])) {
    header('Location: login.php');
    exit;
}
// Retrieve session variables
$facebook_loggedin = $_SESSION['facebook_loggedin'];
$facebook_email = $_SESSION['facebook_email'];
$facebook_name = $_SESSION['facebook_name'];
$facebook_picture = $_SESSION['facebook_picture'];
?>
