document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("games-list");

  if (!container) return;   // ✅ TypeScript satisfied

  // Load games from localStorage or use defaults
  let games = JSON.parse(localStorage.getItem('sankrathiGames')) || [
    { id: 1, name: "Tug of War", time: "10:00 AM" },
    { id: 2, name: "Musical Chairs", time: "11:30 AM" },
    { id: 3, name: "Pot Breaking", time: "2:00 PM" }
  ];

  function displayGames() {
    container.innerHTML = "";
    games.forEach(game => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `${game.name} - ${game.time}`;
      container.appendChild(div);
    });
  }

  displayGames();

  // Make games available globally for admin management
  (window as any).gamesData = games;
  (window as any).updateGamesDisplay = displayGames;
});

