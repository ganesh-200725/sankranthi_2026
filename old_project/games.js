document.addEventListener("DOMContentLoaded", function () {

  // Load schedule dynamically from localStorage (set by committee)
  const schedule = JSON.parse(localStorage.getItem('sankrathiSchedule')) || [
    { time: "9:00 AM", event: "Opening Ceremony" },
    { time: "10:00 AM", event: "Games Start" },
    { time: "1:00 PM", event: "Lunch Break" },
    { time: "3:00 PM", event: "Prize Distribution" }
  ];
  const container = document.getElementById("games-list");

  if (!container) return;

  // Default games with photos and rules
  let games = [
    {
      id: 1,
      name: "Tug of War",
      photo: "images/tug-of-war.jpg",
      rules: "Two teams pull a rope in opposite directions. The team that pulls the other team over a line wins.",
      participants: "Team sport - 8-10 players per team"
    },
    {
      id: 2,
      name: "Musical Chairs",
      photo: "images/musical-chairs.jpg",
      rules: "Players walk around chairs while music plays. When music stops, players must sit. One chair is removed each round.",
      participants: "Individual - Multiple players"
    },
    {
      id: 3,
      name: "Pot Breaking",
      photo: "images/pot-breaking.jpg",
      rules: "Blindfolded players try to break a clay pot with a stick. The pot is hung and rotated.",
      participants: "Individual - One player at a time"
    },
    {
      id: 4,
      name: "Kite Flying",
      photo: "images/kite-flying.jpg",
      rules: "Traditional kite flying competition. Points for height, duration, and skill.",
      participants: "Individual or team"
    },
    {
      id: 5,
      name: "Balloon Burst",
      photo: "images/balloon-burst.jpg",
      rules: "Players burst balloons with darts from a distance. Points based on accuracy.",
      participants: "Individual - Multiple players"
    }
  ];

  function displayGames() {
    container.innerHTML = "";
    games.forEach(game => {
      const gameCard = document.createElement("div");
      gameCard.className = "game-card";

      // Find scheduled time for this game (only if event name matches exactly)
      const sched = schedule.find(s => s.event.toLowerCase() === game.name.toLowerCase());
      const displayTime = sched ? sched.time : 'Will be informed later';

      gameCard.innerHTML = `
        <div class="game-image">
          <img src="${game.photo}" alt="${game.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbWU8L3RleHQ+PC9zdmc+'">
          <div class="game-placeholder">${game.name.charAt(0)}</div>
        </div>
        <div class="game-info">
          <h3>${game.name}</h3>
          <p class="game-time"><strong>Time:</strong> ${displayTime}</p>
          <p class="game-participants">${game.participants}</p>
          <div class="game-rules">
            <h4>Rules:</h4>
            <p>${game.rules}</p>
          </div>
        </div>
      `;

      container.appendChild(gameCard);
    });
  }

  displayGames();

  // Make games available globally for admin management
  window.gamesData = games;
  window.updateGamesDisplay = displayGames;
});