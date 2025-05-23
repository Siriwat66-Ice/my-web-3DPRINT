const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-b39-womrM6EGPH8Ncm_zu9dPtTbfj7AIxkXQVVyn6ZA_7X3-_RbIc3C81_JfkD3O4g/exec"; // วาง URL ที่ได้จากข้อ 2
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const machine = document.getElementById('machine').value;
  const date = document.getElementById('date').value;
  const timeslot = document.getElementById('timeslot').value;

  fetch(SCRIPT_URL, {
  method: "POST",
  body: JSON.stringify({ name, machine, date, timeslot }),
  headers: { "Content-Type": "application/json" }
})
.then(res => res.json())
.then(response => {
  if (response.result === "duplicate") {
    document.getElementById('message').innerHTML =
      `<div class="error">${response.message}</div>`;
  } else {
    document.getElementById('message').innerHTML =
      `<div class="success">✅ จองสำเร็จ</div>`;
    document.getElementById('bookingForm').reset();
  }
})
.catch(error => {
  document.getElementById('message').innerHTML =
    `<div class="error">❌ มีปัญหา กรุณาลองใหม่</div>`;
});

});