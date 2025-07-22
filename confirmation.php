<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <!-- Add Leaflet for maps -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <!-- Add Leaflet Routing Machine -->
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <style>
        body { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); min-height: 100vh; padding: 2rem; }
        .card { background: rgba(255, 255, 255, 0.95); border-radius: 15px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15); }
        #map { height: 400px; border-radius: 10px; margin-top: 20px; }
        #directionsPanel { 
            background: white; 
            padding: 15px; 
            border-radius: 10px; 
            margin-top: 10px; 
            max-height: 200px; 
            overflow-y: auto;
        }
        .map-container { position: relative; }
        .locate-btn { 
            position: absolute; 
            top: 10px; 
            right: 10px; 
            z-index: 1000; 
            padding: 8px 12px;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header bg-success text-white">
                <h3>Booking Confirmed!</h3>
            </div>
            <div class="card-body">
                <div id="confirmationDetails">
                    <!-- PHP will populate this -->
                    <?php
                    session_start();
                    if (isset($_SESSION['bookingData'])) {
                        $booking = $_SESSION['bookingData'];
                        echo '
                        <div class="alert alert-success">
                            <h4 class="mb-4">Booking Details:</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Booking ID:</strong> '.$booking['bookingId'].'</p>
                                    <p><strong>Name:</strong> '.$booking['userName'].'</p>
                                    <p><strong>Email:</strong> '.$booking['userEmail'].'</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Date:</strong> '.$booking['bookingDate'].'</p>
                                    <p><strong>Check-in:</strong> '.$booking['checkInTime'].'</p>
                                    <p><strong>Check-out:</strong> '.$booking['checkOutTime'].'</p>
                                    <p><strong>Slot:</strong> '.$booking['slotNumber'].'</p>
                                    <p><strong>Location:</strong> '.($booking['parkingLocation'] ?? 'Main Parking Lot').'</p>
                                </div>
                            </div>
                        </div>';
                    } else {
                        echo '<div class="alert alert-danger">No booking found. Please make a booking first.</div>';
                    }
                    ?>
                </div>
                
                <div class="text-center mt-4">
                    <div id="qrcode"></div>
                    <p class="mt-2">Scan this QR code at the parking entrance</p>
                </div>
                
                <!-- Pathway Section -->
                <div class="mt-4">
                    <h4><i class="fas fa-route"></i> Get Directions to Your Parking Slot</h4>
                    <button id="showDirectionsBtn" class="btn btn-info mb-3">
                        <i class="fas fa-map-marked-alt"></i> Show Directions
                    </button>
                    
                    <div id="pathwaySection" style="display: none;">
                        <div class="map-container">
                            <button id="locateMeBtn" class="btn btn-primary locate-btn">
                                <i class="fas fa-location-arrow"></i> Locate Me
                            </button>
                            <div id="map"></div>
                            <div id="directionsPanel"></div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <a href="booking.html" class="btn btn-primary">Book Another Slot</a>
                    <a href="dashboard.html" class="btn btn-secondary">Back to Dashboard</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Font Awesome for icons -->
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Generate QR code with booking details
        document.addEventListener('DOMContentLoaded', function() {
            <?php if (isset($_SESSION['bookingData'])): ?>
            new QRCode(document.getElementById("qrcode"), {
                text: "Booking ID: <?php echo $_SESSION['bookingData']['bookingId']; ?>",
                width: 128,
                height: 128
            });
            <?php endif; ?>
            
            // Initialize map variables
            let map;
            let userMarker;
            let routingControl;
            
            // Parking location coordinates (example - replace with your actual parking coordinates)
            const parkingLocations = {
                'CyberHub Basement': { lat: 28.5022, lng: 77.0945 },
                'Sector 18 Parking': { lat: 28.5100, lng: 77.0900 },
                'DLF Phase 3 Lot': { lat: 28.4950, lng: 77.0850 },
                'Main Parking Lot': { lat: 28.5000, lng: 77.1000 }
            };
            
            // Get the parking location from the booking data
            const parkingLocationName = "<?php echo $_SESSION['bookingData']['parkingLocation'] ?? 'Main Parking Lot'; ?>";
            const parkingLocation = parkingLocations[parkingLocationName] || parkingLocations['Main Parking Lot'];
            
            // Toggle directions visibility
            document.getElementById('showDirectionsBtn').addEventListener('click', function() {
                const pathwaySection = document.getElementById('pathwaySection');
                if (pathwaySection.style.display === 'none') {
                    pathwaySection.style.display = 'block';
                    
                    // Initialize map if not already done
                    if (!map) {
                        initMap();
                    }
                } else {
                    pathwaySection.style.display = 'none';
                }
            });
            
            // Initialize the map
            function initMap() {
                // Create map centered on parking location
                map = L.map('map').setView([parkingLocation.lat, parkingLocation.lng], 15);
                
                // Add tile layer (OpenStreetMap)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                
                // Add parking location marker
                L.marker([parkingLocation.lat, parkingLocation.lng])
                    .addTo(map)
                    .bindPopup("Your Parking Spot: <?php echo $_SESSION['bookingData']['slotNumber'] ?? 'B2'; ?>")
                    .openPopup();
            }
            
            // Locate user and show route
            document.getElementById('locateMeBtn').addEventListener('click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const userLat = position.coords.latitude;
                            const userLng = position.coords.longitude;
                            
                            // Remove previous user marker if exists
                            if (userMarker) {
                                map.removeLayer(userMarker);
                            }
                            
                            // Add new user marker
                            userMarker = L.marker([userLat, userLng])
                                .addTo(map)
                                .bindPopup("Your Location")
                                .openPopup();
                            
                            // Fit map to show both locations
                            map.fitBounds([
                                [userLat, userLng],
                                [parkingLocation.lat, parkingLocation.lng]
                            ]);
                            
                            // Calculate and display route
                            calculateRoute(userLat, userLng, parkingLocation.lat, parkingLocation.lng);
                        },
                        function(error) {
                            alert("Error getting your location: " + error.message);
                        },
                        { enableHighAccuracy: true }
                    );
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            });
            
            // Calculate route between two points
            function calculateRoute(startLat, startLng, endLat, endLng) {
                // Remove previous route if exists
                if (routingControl) {
                    map.removeControl(routingControl);
                }
                
                // Create new route
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(startLat, startLng),
                        L.latLng(endLat, endLng)
                    ],
                    routeWhileDragging: true,
                    showAlternatives: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    show: true,
                    collapsible: true,
                    container: document.getElementById('directionsPanel')
                }).addTo(map);
            }
        });
    </script>
</body>
</html>