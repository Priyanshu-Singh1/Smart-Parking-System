<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parking_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$slotNumber = $_POST['slotNumber'];
$userName = $_POST['userName'];
$userEmail = $_POST['userEmail'];
$userPhone = $_POST['userPhone'];
$bookingDate = $_POST['bookingDate'];
$checkInTime = $_POST['checkInTime'];
$checkOutTime = $_POST['checkOutTime'];

// Generate booking ID
$bookingId = 'BK' . strtoupper(uniqid());

// Insert into database
$sql = "INSERT INTO bookings (
    booking_id, 
    slot_number, 
    booking_date, 
    check_in_time, 
    check_out_time, 
    user_name, 
    user_email, 
    user_phone
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssssss", 
    $bookingId,
    $slotNumber,
    $bookingDate,
    $checkInTime,
    $checkOutTime,
    $userName,
    $userEmail,
    $userPhone
);

function calculateParkingFee($checkIn, $checkOut) {
    // Simple calculation - replace with your actual pricing logic
    $start = new DateTime($checkIn);
    $end = new DateTime($checkOut);
    $diff = $start->diff($end);
    $hours = $diff->h + ($diff->days * 24);
    return max(1, $hours) * 40; // ₹40 per hour with 1 hour minimum
}

// After successful booking insertion
if ($stmt->execute()) {
    session_start();
    $_SESSION['bookingData'] = [
        'bookingId' => $bookingId,
        'slotNumber' => $slotNumber,
        'bookingDate' => $bookingDate,
        'checkInTime' => $checkInTime,
        'checkOutTime' => $checkOutTime,
        'userName' => $userName,
        'userEmail' => $userEmail,
        'userPhone' => $userPhone,
        'amount' => calculateParkingFee($checkInTime, $checkOutTime) // Add your pricing logic
    ];
    
    // Redirect to payment page
    header("Location: payment/pay.html");
    exit();
}

$stmt->close();
$conn->close();
?>