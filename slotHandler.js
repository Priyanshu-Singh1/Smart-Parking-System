document.addEventListener('DOMContentLoaded', function() {
    let selectedSlot = null;
    let currentFloor = 1;
    const slotsPerFloor = 50;

    function selectSlot(element, slotNumber) {
        // Remove previous selection
        const allSlots = document.querySelectorAll('.parking-slot');
        allSlots.forEach(slot => slot.classList.remove('selected'));
        
        // Add new selection
        element.classList.add('selected');
        selectedSlot = slotNumber;
        
        // Update UI and enable button
        document.getElementById('selected-slot').textContent = `Selected: ${slotNumber}`;
        document.getElementById('confirm-btn').disabled = false;
    }

    function generateSlots(floor) {
        const parkingGrid = document.getElementById('parking-grid');
        parkingGrid.innerHTML = '';
        
        for (let i = 1; i <= slotsPerFloor; i++) {
            const slotNumber = `F${floor}-${i.toString().padStart(2, '0')}`;
            const slot = document.createElement('div');
            
            // Check if slot is booked in session storage
            const bookedSlots = JSON.parse(sessionStorage.getItem('bookedSlots') || '[]');
            const isBooked = bookedSlots.includes(slotNumber);
            
            // Enhanced styling with Tailwind
            slot.className = `
                parking-slot
                ${isBooked ? 'booked' : 'available'}
                p-4
                m-2
                rounded-lg
                shadow-lg
                transition-all
                duration-300
                transform
                hover:scale-105
                cursor-pointer
                text-center
                font-bold
                ${isBooked 
                    ? 'bg-red-500 text-white cursor-not-allowed' 
                    : 'bg-green-100 hover:bg-green-200 text-green-800'}
                border-2
                ${isBooked ? 'border-red-600' : 'border-green-500'}
                flex
                items-center
                justify-center
                min-w-[100px]
                min-h-[80px]
                hover:shadow-xl
            `.replace(/\s+/g, ' ').trim();
            
            slot.textContent = slotNumber;
            
            // Add click event only for available slots
            slot.addEventListener('click', function() {
                if (slot.classList.contains('available')) {
                    selectSlot(this, slotNumber);
                }
            });
            
            // Add floating animation for available slots
            if (!isBooked) {
                slot.style.animation = 'float 3s ease-in-out infinite';
            }
            
            parkingGrid.appendChild(slot);
        }
    }

    // Handle booking submission
    // Modified confirm button event listener
    document.getElementById('confirm-btn').addEventListener('click', function() {
        if (!selectedSlot) return;
    
        const bookingData = {
            bookingId: 'BK' + Date.now(),
            slotNumber: selectedSlot,
            bookingDate: document.getElementById('bookingDate').value,
            checkInTime: document.getElementById('checkInTime').value,
            checkOutTime: document.getElementById('checkOutTime').value,
            userName: document.getElementById('userName').value,
            userEmail: document.getElementById('userEmail').value,
            userPhone: document.getElementById('userPhone').value
        };
    
        // Store booking data and update booked slots in session storage
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
        const bookedSlots = JSON.parse(sessionStorage.getItem('bookedSlots') || '[]');
        bookedSlots.push(selectedSlot);
        sessionStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    
        fetch('save_booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mark slot as booked
                const selectedElement = document.querySelector('.selected');
                if (selectedElement) {
                    selectedElement.classList.remove('available', 'selected');
                    selectedElement.classList.add('booked');
                    selectedElement.style.backgroundColor = '#ff4444';
                }
                window.location.href = 'confirmation.html';
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving booking: ' + error.message);
        });
    });

    // Initialize floor selection
    const floorSelect = document.getElementById('floorSelect');
    if (floorSelect) {
        floorSelect.addEventListener('change', function() {
            currentFloor = parseInt(this.value) || 1;
            generateSlots(currentFloor);
        });
    }

    // Initialize first floor on page load
    generateSlots(1);
});