// Initialize the map
var map = L.map('map').setView([13.736717, 100.523186], 13); // Centered in Bangkok, Thailand

// Use Esri's satellite imagery tile layer
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

// Leaflet Draw plugin - add drawing controls
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polyline: true,
    polygon: true,
    rectangle: true,
    circle: true,
    marker: true
  }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType;
  var layer = e.layer;
  drawnItems.addLayer(layer);
});

// Geocode the selected location
function geocode() {
  var location = document.getElementById('locationInput').value;
  var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        map.setView([lat, lon], 13);

        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${data[0].display_name}</b>`)
          .openPopup();

        // Update the form with the selected location
        document.getElementById('address').value = data[0].display_name;
        document.getElementById('lat').value = lat;
        document.getElementById('lon').value = lon;

        // Update the address box
        document.getElementById('addressBox').innerText = data[0].display_name;
      } else {
        alert('Location not found');
      }
    });
}

// Fetch autocomplete suggestions
function fetchSuggestions() {
  var query = document.getElementById('locationInput').value;
  var suggestionsBox = document.getElementById('suggestions');
  suggestionsBox.innerHTML = ''; // Clear previous suggestions

  if (query.length > 2) { // Fetch only when query is long enough
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.forEach((place) => {
          var suggestionItem = document.createElement('div');
          suggestionItem.classList.add('suggestion-item');
          suggestionItem.innerHTML = place.display_name;
          suggestionItem.onclick = function() {
            document.getElementById('locationInput').value = place.display_name;
            suggestionsBox.innerHTML = '';
            map.setView([place.lat, place.lon], 13);
            L.marker([place.lat, place.lon]).addTo(map)
              .bindPopup(`<b>${place.display_name}</b>`)
              .openPopup();

            // Update the form when user selects a suggestion
            document.getElementById('address').value = place.display_name;
            document.getElementById('lat').value = place.lat;
            document.getElementById('lon').value = place.lon;

            // Update the address box
            document.getElementById('addressBox').innerText = place.display_name;
          };
          suggestionsBox.appendChild(suggestionItem);
        });
      });
  }
}

// Find the user's current location using Geolocation API
function findMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      
      map.setView([lat, lon], 13);

      // Add marker to current location
      L.marker([lat, lon]).addTo(map)
        .bindPopup('<b>Your current location</b>')
        .openPopup();

      // Reverse geocode to get the user's address
      var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.display_name) {
            document.getElementById('address').value = data.display_name;
            document.getElementById('lat').value = lat;
            document.getElementById('lon').value = lon;

            // Update the address box
            document.getElementById('addressBox').innerText = data.display_name;
          } else {
            document.getElementById('addressBox').innerText = 'Unable to find your address';
          }
        });
    }, function(error) {
      alert('Geolocation failed: ' + error.message);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

// Form Submission
document.getElementById('locationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page refresh
  
  // Capture form data
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var address = document.getElementById('address').value;
  var lat = document.getElementById('lat').value;
  var lon = document.getElementById('lon').value;

  // Display the form data for now (or send it to a server)
  console.log("Form Data Submitted:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Address:", address);
  console.log("Latitude:", lat);
  console.log("Longitude:", lon);

  alert('Form submitted successfully!');
});
