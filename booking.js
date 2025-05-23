const GET_BOOKINGS_URL = "https://script.google.com/macros/s/AKfycby-b39-womrM6EGPH8Ncm_zu9dPtTbfj7AIxkXQVVyn6ZA_7X3-_RbIc3C81_JfkD3O4g/exec"; // ใส่ให้ครบ
const POST_BOOKING_URL = "https://script.google.com/macros/s/AKfycby-b39-womrM6EGPH8Ncm_zu9dPtTbfj7AIxkXQVVyn6ZA_7X3-_RbIc3C81_JfkD3O4g/exec"; // ใส่ให้ครบ

async function isSlotAvailable(machine, date, time) {
  try {
    const response = await fetch(GET_BOOKINGS_URL);
    const bookings = await response.json();

    return !bookings.some(b => {
      const bookedMachine = (b.machine || b.Machine || "").trim();
      const bookedDate = new Date(b.date || b.Date).toISOString().split("T")[0];
      const bookedTime = (b.time || b.Time || "").trim();

      return (
        bookedMachine === machine.trim() &&
        bookedDate === date &&
        bookedTime === time.trim()
      );
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    alert("เกิดข้อผิดพลาดในการเช็คสถานะการจอง");
    return false;
  }
}




async function bookMachine(name, machine, date, time) {
  try {
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
      alert("✅ จองสำเร็จแล้ว!");
      return true;
    } else {
      alert("❌ เกิดข้อผิดพลาดในการจอง");
      return false;
    }
  } catch (error) {
    console.error("Error during booking:", error);
    alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
    return false;
  }
}

