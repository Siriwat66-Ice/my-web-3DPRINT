document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  fetch("https://script.google.com/macros/s/AKfycbwqmV-4jKuXW3VEQD1yf9emmsrqm8Kj3BBWNWHtnaSABv_GeNdgbm7D1GoHHRNYEgp4/exec")
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById("report-list");
      list.innerHTML = "";
      data.reverse().forEach(entry => {
        const status = entry["สถานะ"] || "-";
        let statusColor = "gray";
        if (status === "ใช้งานปกติ") statusColor = "green";
        else if (status === "กำลังซ่อม") statusColor = "red";

        list.innerHTML += `
          <div class="card">
            <strong>ชื่อผู้แจ้ง:</strong> ${entry["ชื่อผู้แจ้ง"] || "-"}<br/>
            <strong>หมายเลขเครื่อง:</strong> ${entry["หมายเลขเครื่อง"] || "-"}<br/>
            <strong>ปัญหา:</strong> ${entry["ปัญหา"] || "-"}<br/>
            <strong>สถานะ:</strong> <span style="color:${statusColor}; font-weight:bold;">${status}</span><br/>
            <small>${entry["timestamp"] || ""}</small>
          </div>
        `;
      });
    })
    .catch(error => {
      document.getElementById("report-list").innerHTML = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      console.error("เกิดข้อผิดพลาด:", error);
    });
});
