document.addEventListener("DOMContentLoaded", () => {
  updateMachineOptions();  // สมมติว่าคุณมีฟังก์ชันนี้อยู่ในไฟล์นี้

  const bookingForm = document.getElementById("bookingForm");

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("bookingName").value.trim();
    const machine = document.getElementById("machine").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;

    if (!name || !machine || !date || !time) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (machineStatus[machine] === "repair") {
      alert("เครื่องนี้กำลังซ่อมอยู่ ไม่สามารถจองได้");
      return;
    }

    const success = await bookMachine(name, machine, date, time);
    if(success) bookingForm.reset();
  });
});
