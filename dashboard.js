// Function to fetch user data from session
function fetchUserData() {
    fetch('get_user_data.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Display full name (firstName + lastName)
                const fullName = `${data.firstName} ${data.lastName}`;
                document.getElementById('user-name').textContent = fullName;
            } else {
                document.getElementById('user-name').textContent = 'Guest User';
            }
            // Set static values
            document.getElementById('user-plan').textContent = 'Basic';
            document.getElementById('user-joined').textContent = 'Joined: 2024';
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            // Set default values in case of error
            document.getElementById('user-name').textContent = 'Guest User';
            document.getElementById('user-plan').textContent = 'Basic';
            document.getElementById('user-joined').textContent = 'Joined: 2024';
        });
}

// Load user data when the page loads
document.addEventListener('DOMContentLoaded', fetchUserData);