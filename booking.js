const GET_BOOKINGS_URL = "https://script.google.com/macros/s/AKfycby-b39-womrM6EGPH8Ncm_zu9dPtTbfj7AIxkXQVVyn6ZA_7X3-_RbIc3C81_JfkD3O4g/exec";
const POST_BOOKING_URL = "https://script.google.com/macros/s/AKfycby-b39-womrM6EGPH8Ncm_zu9dPtTbfj7AIxkXQVVyn6ZA_7X3-_RbIc3C81_JfkD3O4g/exec";


async function isSlotAvailable(machine, date, time) {
  const response = await fetch(GET_BOOKINGS_URL);
  const bookings = await response.json();

  const formatDate = d => new Date(d).toISOString().split("T")[0];

  return !bookings.some(b =>
    b.Machine === machine &&
    formatDate(b.Date) === date &&
    b.Time === time
  );
}

async function bookMachine(name, machine, date, time) {
  const available = await isSlotAvailable(machine, date, time);

  if (!available) {
    alert("ช่วงเวลานี้ถูกจองไปแล้ว กรุณาเลือกช่วงเวลาอื่น");
    return false;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("machine", machine);
  formData.append("date", date);
  formData.append("time", time);

  const response = await fetch(POST_BOOKING_URL, {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    alert("จองสำเร็จ!");
    return true;
  } else {
    alert("เกิดข้อผิดพลาดในการจอง");
    return false;
  }
}
