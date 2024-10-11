window.onload = function() {
  // Initialize LIFF
  liff.init({
      liffId: "2005012452-og8X4PgJ"
  }).then(() => {
      console.log("LIFF initialized successfully");
  }).catch((err) => {
      console.error("LIFF initialization failed:", err);
  });

  // Function to submit form data
  document.getElementById('submitData').addEventListener('click', function() {
      const province = document.getElementById('province').value;
      const riceType = document.getElementById('riceType').value;
      const cultivar = document.getElementById('cultivar').value;

      if (province && riceType && cultivar) {
          const userData = {
              province: province,
              riceType: riceType,
              cultivar: cultivar
          };

          // Process or send the data to your server here
          console.log("Data to be submitted:", userData);

          alert("Data submitted successfully!");
      } else {
          alert("Please fill in all fields");
      }
  });

  // Redirect to the external map page
  document.getElementById('mapPage').addEventListener('click', function() {
      window.location.href = "https://jeante2549.github.io/Form_Ricehub2/";  // Replace with the URL of your map page
  });
};
