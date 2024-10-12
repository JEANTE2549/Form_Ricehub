let farmlandCoordinates = {}; // to store farmland coordinates

window.onload = function() {
  liff.init({
      liffId: "2005012452-og8X4PgJ"
  }).then(() => {
      console.log("LIFF initialized successfully");
  }).catch((err) => {
      console.error("LIFF initialization failed:", err);
  });

  // Redirect to external map page
  document.getElementById('mapPage').addEventListener('click', function() {
      const mapPageUrl = "https://jeante2549.github.io/Form_Ricehub2/";  // Replace with your actual map page URL

      liff.openWindow({
          url: mapPageUrl,
          external: true // Open it in an external browser window
      });
  });

  // Function to submit form data
  document.getElementById('submitData').addEventListener('click', async function() {
      const province = document.getElementById('province').value;
      const riceType = document.getElementById('riceType').value;
      const cultivar = document.getElementById('cultivar').value;

      if (province && riceType && cultivar) {
          const userProfile = await liff.getProfile();
          const userId = userProfile.userId;

          const userData = {
              province: province,
              riceType: riceType,
              cultivar: cultivar,
              userId: userId,
          };

          // Submit data to server
          fetch('https://65f3-2403-6200-8813-2e9f-857-8147-a298-65e8.ngrok-free.app/api/saveRiceData', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData)
          })
          .then(response => response.json())
          .then(data => {
              console.log("Data submitted successfully:", data);
              alert("Data submitted successfully!");
          })
          .catch(error => {
              console.error("Error submitting data:", error);
              alert("Error submitting data. Please try again.");
          });
      } else {
          alert("Please fill in all fields and select farmland coordinates.");
      }
  });
};
