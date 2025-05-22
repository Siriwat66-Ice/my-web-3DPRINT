const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // เปลี่ยนเป็น URL จริงของคุณ

let existingBookings = []; // เก็บข้อมูลจองทั้งหมดที่โหลดมา

function updateMachineOptions() {
  const machineStatus = {
    "3D Printer 1": "repair",
    "3D Printer 2": "available",
    "3D Printer 3": "available",
    "3D Printer 4": "available"
  };

  const machineSelect = document.getElementById("machine");
  machineSelect.innerHTML = "";

  for (const [machine, status] of Object.entries(machineStatus)) {
    const option = document.createElement("option");
    option.value = machine;
    option.textContent = machine + (status === "repair" ? " (ซ่อมอยู่)" : "");
    if (status === "repair") {
      option.disabled = true;
    }
    machineSelect.appendChild(option);
  }
}

function loadBookings() {
  fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
      existingBookings = data; // เก็บข้อมูลจองทั้งหมด

      const bookingTableBody = document.querySelector("#bookingTable tbody");
      bookingTableBody.innerHTML = "";

      data.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entry["Name"]}</td>
          <td>${entry["Machine"]}</td>
          <td>${entry["Date"]}</td>
          <td>${entry["Time"]}</td>
        `;
        bookingTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error loading bookings:", error);
      alert("❌ ไม่สามารถโหลดข้อมูลรายการจองได้");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  updateMachineOptions();
  loadBookings();

  const bookingForm = document.getElementById("bookingForm");
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("bookingName").value.trim();
    const machine = document.getElementById("machine").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;

    if (!name || !machine || !date || !time) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // เช็กจองซ้ำจากข้อมูลที่โหลดมา
    const isDuplicate = existingBookings.some(entry =>
      entry["Machine"] === machine &&
      entry["Date"] === date &&
      entry["Time"] === time
    );

    if (isDuplicate) {
      alert("❌ มีการจองเครื่องนี้ในวันและเวลาเดียวกันแล้ว");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("machine", machine);
    formData.append("date", date);
    formData.append("time", time);

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
    .then(response => response.text())
    .then(text => {
      if (text === "success") {
        alert("✅ จองสำเร็จแล้ว!");
        bookingForm.reset();
        loadBookings(); // โหลดข้อมูลใหม่มาอัพเดตตารางและข้อมูล
      } else if (text === "duplicate") {
        alert("❌ มีการจองซ้ำในระบบแล้ว");
      } else {
        alert("❌ เกิดข้อผิดพลาดในการจอง");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
    });
  });
});