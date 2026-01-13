document.addEventListener("DOMContentLoaded", () => {

  const schedule = [
    { time: "9:00 AM", event: "Opening Ceremony" },
    { time: "10:00 AM", event: "Games Start" },
    { time: "1:00 PM", event: "Lunch Break" },
    { time: "3:00 PM", event: "Prize Distribution" }
  ];

  const container = document.getElementById("schedule-list");

  if (!container) {
    console.error("schedule-list element not found");
    return;
  }

  schedule.forEach(s => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${s.time}</strong> - ${s.event}`;
    container.appendChild(div);
  });

});
