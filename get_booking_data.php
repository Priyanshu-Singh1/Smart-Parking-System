<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['bookingData'])) {
    echo json_encode(['error' => 'No booking data found']);
    exit();
}

echo json_encode($_SESSION['bookingData']);
?>