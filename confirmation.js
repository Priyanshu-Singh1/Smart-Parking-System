document.addEventListener('DOMContentLoaded', function() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    
    // Get booking data from localStorage
    const bookingData = JSON.parse(localStorage.getItem('currentBooking'));
    
    if (bookingData) {
        // Format the timestamp for better readability
        const bookingDate = new Date(bookingData.timestamp);
        const formattedDate = bookingDate.toLocaleDateString();
        const formattedTime = bookingDate.toLocaleTimeString();

        // Create confirmation HTML
        const confirmationHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h4>Booking Details</h4>
                    <table class="table">
                        <tr>
                            <th>Booking ID:</th>
                            <td>${bookingData.bookingId}</td>
                        </tr>
                        <tr>
                            <th>Slot Number:</th>
                            <td>${bookingData.slotId}</td>
                        </tr>
                        <tr>
                            <th>Date:</th>
                            <td>${formattedDate}</td>
                        </tr>
                        <tr>
                            <th>Time:</th>
                            <td>${formattedTime}</td>
                        </tr>
                        <tr>
                            <th>Status:</th>
                            <td><span class="badge bg-success">Confirmed</span></td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h4>User Details</h4>
                    <table class="table">
                        <tr>
                            <th>Name:</th>
                            <td>${bookingData.user.name}</td>
                        </tr>
                        <tr>
                            <th>Email:</th>
                            <td>${bookingData.user.email}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="alert alert-info mt-3">
                <strong>Note:</strong> Please save or print this confirmation for your records.
            </div>
        `;
        
        confirmationDetails.innerHTML = confirmationHTML;

        // Store booking in bookings history
        const existingBookings = JSON.parse(localStorage.getItem('allBookings')) || [];
        existingBookings.push(bookingData);
        localStorage.setItem('allBookings', JSON.stringify(existingBookings));

        // Generate QR Code
        const qrcode = new QRCode(document.getElementById("qrcode"), {
            text: JSON.stringify({
                bookingId: bookingData.bookingId,
                slotId: bookingData.slotId,
                timestamp: bookingData.timestamp
            }),
            width: 128,
            height: 128
        });

        // Email confirmation handler
        sendEmailBtn.addEventListener('click', function() {
            const emailSubject = `Parking Confirmation - ${bookingData.bookingId}`;
            const emailBody = `
Dear ${bookingData.user.name},

Your parking booking has been confirmed!

Booking Details:
- Booking ID: ${bookingData.bookingId}
- Slot Number: ${bookingData.slotId}
- Date: ${new Date(bookingData.timestamp).toLocaleDateString()}
- Time: ${new Date(bookingData.timestamp).toLocaleTimeString()}

Please keep this confirmation for your records.

Thank you for using our parking service!
            `;

            // Using mailto for email (in a real app, you'd use a proper email service)
            const mailtoLink = `mailto:${bookingData.user.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;

            // Show success message
            alert('Email client opened! Please send the confirmation email.');
        });

    } else {
        confirmationDetails.innerHTML = `
            <div class="alert alert-danger">
                No booking information found. Please try booking again.
                <br>
                <a href="booking.html" class="btn btn-primary mt-3">Return to Booking</a>
            </div>
        `;
    }
});