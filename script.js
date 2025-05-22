const scriptURL = "https://script.google.com/macros/s/AKfycbzwhhneeZRc56vhFRuHtX0_VYc4y-wuufjur5OcMed5OpNSSykbtFL1OXHcJaGxkG0h4w/exec";

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const bookingTableBody = document.querySelector("#bookingTable tbody");

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("bookingName").value.trim();
    const machine = document.getElementById("machine").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;

    // ตรวจสอบข้อมูลไม่ว่าง
    if (!name || !machine || !date || !time) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // ตรวจสอบการจองซ้ำในตาราง
    const isDuplicate = Array.from(bookingTableBody.children).some(row => {
      const cells = row.children;
      return (
        cells[1].textContent === machine &&
        cells[2].textContent === date &&
        cells[3].textContent === time
      );
    });

    if (isDuplicate) {
      alert("มีการจองเครื่องนี้ในวันและเวลาเดียวกันแล้ว");
      return;
    }

    // เตรียมข้อมูลส่งไป Google Apps Script
    const formData = new FormData();
    formData.append("name", name);
    formData.append("machine", machine);
    formData.append("date", date);
    formData.append("time", time);

    // ส่งข้อมูลด้วย fetch
    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
    .then(response => {
      if (response.ok) {
        // เพิ่มข้อมูลในตาราง
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${name}</td>
          <td>${machine}</td>
          <td>${date}</td>
          <td>${time}</td>
        `;
        bookingTableBody.appendChild(newRow);
        bookingForm.reset();
        alert("✅ จองสำเร็จแล้ว!");
      } else {
        alert("❌ ส่งข้อมูลไม่สำเร็จ");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
    });
  });
});
