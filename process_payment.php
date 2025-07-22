<?php
session_start();

if (!isset($_SESSION['bookingData'])) {
    header("Location: ../booking.html");
    exit();
}

// In a real system, verify payment success from payment gateway
$paymentSuccess = true;

if ($paymentSuccess) {
    // Store payment details in session
    $_SESSION['paymentData'] = [
        'amount' => $_SESSION['bookingData']['amount'],
        'paymentDate' => date('Y-m-d H:i:s'),
        'transactionId' => 'PY' . uniqid()
    ];
    
    // Redirect to success page first
    header("Location: succ.html");
} else {
    header("Location: payment_failed.html");
}
exit();
?>