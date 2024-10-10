document.addEventListener('DOMContentLoaded', function () {
    // Initialize LIFF SDK
    liff.init({ liffId: "YOUR_LIFF_ID" }).then(() => {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            // Get Profile Information
            liff.getProfile().then(profile => {
                const userId = profile.userId;
                const displayName = profile.displayName;

                // Display User Info
                document.getElementById('displayName').textContent = displayName;

                // Initialize the Leaflet map
                const map = L.map('map').setView([13.7563, 100.5018], 13); // Default to Bangkok
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                // Add Leaflet Draw controls
                const drawnItems = new L.FeatureGroup();
                map.addLayer(drawnItems);
                const drawControl = new L.Control.Draw({
                    edit: {
                        featureGroup: drawnItems
                    },
                    draw: {
                        polygon: true,
                        rectangle: true,
                        circle: false,
                        marker: false
                    }
                });
                map.addControl(drawControl);

                let drawnShape = null;

                // Capture the drawn area
                map.on(L.Draw.Event.CREATED, function (event) {
                    const layer = event.layer;
                    drawnItems.addLayer(layer);

                    // Store the drawn shape as GeoJSON
                    drawnShape = layer.toGeoJSON();
                });

                // Submit button handler
                document.getElementById('submitButton').addEventListener('click', () => {
                    if (!drawnShape) {
                        alert("Please draw an area on the map before submitting.");
                        return;
                    }

                    // Prepare data to be sent
                    const userData = {
                        userId: userId,
                        displayName: displayName,
                        geoData: drawnShape
                    };

                    // Send data to the server
                    fetch('/save-user-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Data submitted successfully!');
                        console.log('Success:', data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                });
            }).catch(console.error);
        }
    }).catch(err => console.error('LIFF Initialization Failed', err));
});
