<?php
// Initialize the session - is required to check the login state.
session_start();
// Check if the user is logged in, if not then redirect to login page
if (!isset($_SESSION['facebook_loggedin'])) {
    header('Location: login.php');
    exit;
}
// Database connection variables
$db_host = 'localhost';
$db_name = 'sociallogin';
$db_user = 'root';
$db_pass = 'AhmedSamir1_';
// Attempt to connect to database
try {
    // Connect to the MySQL database using PDO...
    $pdo = new PDO('mysql:host=' . $db_host . ';dbname=' . $db_name . ';charset=utf8', $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $exception) {
    // Could not connect to the MySQL database! Check db credentials...
    exit('Failed to connect to database!');
}
// Get the account from the database
$stmt = $pdo->prepare('SELECT * FROM accounts WHERE id = ?');
$stmt->execute([ $_SESSION['facebook_id'] ]);
$account = $stmt->fetch(PDO::FETCH_ASSOC);
// Retrieve session variables
$facebook_loggedin = $_SESSION['facebook_loggedin'];
$facebook_email = $account['email'];
$facebook_name = $account['name'];
$facebook_picture = $account['picture'];
?>
