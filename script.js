window.onload = function() {
  liff.init({ liffId: '2005012452-z1yPYplN' })
    .then(() => {
      if (!liff.isInClient()) {
        alert('Please open this page from the LINE app.');
        return;
      }
      if (liff.isLoggedIn()) {
        return liff.getProfile();
      } else {
        liff.login();
      }
    })
    .then(profile => {
      const userId = profile.userId;
      document.getElementById('userId').value = userId;
    })
    .catch(err => {
      console.error('LIFF Initialization failed:', err);
    });
};

function nextPage(current, next) {
  const radioButtons = document.querySelectorAll(`#${current} input[type="radio"]`);
  let answered = false;

  radioButtons.forEach((radio) => {
    if (radio.checked) {
      answered = true;
    }
  });

  if (answered) {
    document.getElementById(current).style.display = 'none';
    document.getElementById(next).style.display = 'block';
  } else {
    alert('กรุณากรอกคำตอบก่อนไปคำถามหน้าต่อไปนะครับ/ค่ะ.');
  }
}

function submitForm() {
  const formData = {
    userId: document.getElementById('userId').value,
    riceType: document.querySelector('input[name="riceType"]:checked').value,
    plantingMethod: document.querySelector('input[name="plantingMethod"]:checked').value,
    daysPlanted: document.querySelector('input[name="daysPlanted"]:checked').value,
    soilType: document.querySelector('input[name="soilType"]:checked').value,
    waterLevel: document.querySelector('input[name="waterLevel"]:checked').value,
    chemicalUsed: document.querySelector('input[name="chemicalUsed"]:checked').value,
    chemicalType: document.getElementById('chemicalType').value
  };

  fetchfetch('https://6add-2403-6200-8813-2e9f-f108-ca62-8066-55ed.ngrok-free.app/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }).then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Form submitted successfully!');
      } else {
        alert('Form submission failed.');
      }
    }).catch(error => {
      console.error('Error submitting form:', error);
    });
}
