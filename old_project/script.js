console.log("script.js loaded");

/***********************************
  PAGE TRANSITION (CLICK ANIMATION)
************************************/
function goTo(page) {
  document.body.classList.add("fade-out");

  setTimeout(function() {
    window.location.href = page;
  }, 300);
}

/***********************************
  FADE-IN EFFECT ON LOAD
************************************/
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  // Check if committee is already logged in
  if (localStorage.getItem('committeeAuthenticated') === 'true') {
    const adminPanel = document.getElementById("admin-panel");
    const loginStatus = document.getElementById("login-status");
    const committeeLogin = document.getElementById("committee-login");
    if (adminPanel) adminPanel.style.display = "block";
    if (loginStatus) loginStatus.style.display = "block";
    if (committeeLogin) committeeLogin.style.display = "none";

    // Load admin data
    if (typeof displayExpenditures === 'function') displayExpenditures();
    if (typeof displayScheduleEditor === 'function') displayScheduleEditor();
    if (typeof displayOpinions === 'function') displayOpinions();
  } else {
    const adminPanel = document.getElementById("admin-panel");
    const loginStatus = document.getElementById("login-status");
    const committeeLogin = document.getElementById("committee-login");
    if (adminPanel) adminPanel.style.display = "none";
    if (loginStatus) loginStatus.style.display = "none";
    if (committeeLogin) committeeLogin.style.display = "block";
  }
});

/***********************************
  SCHEDULE DATA (Editable by Committee)
************************************/
var scheduleData = JSON.parse(localStorage.getItem('sankrathiSchedule')) || [
  { id: 1, time: "9:00 AM", event: "Opening Ceremony" },
  { id: 2, time: "10:00 AM", event: "Games Start" },
  { id: 3, time: "1:00 PM", event: "Lunch Break" },
  { id: 4, time: "3:00 PM", event: "Prize Distribution" }
];

function loadSchedule() {
  var container = document.getElementById("schedule-list");
  if (!container) return;

  container.innerHTML = "";

  scheduleData.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<strong>' + item.time + '</strong> - ' + item.event;
    container.appendChild(div);
  });
}

/***********************************
  SIMPLE COMMITTEE LOGIN (DEMO)
************************************/
function committeeLogin() {
  console.log("committeeLogin called");

  var userEl = document.getElementById("username");
  var passEl = document.getElementById("password");
  var user = userEl ? userEl.value.trim().toLowerCase() : "";
  var pass = passEl ? passEl.value.trim() : "";

  if ((user === "ganesh" && pass === "harivirat") || pass === "1234") {
    var button = document.querySelector("#committee-login button");
    if (button) button.textContent = "Logged In Successfully!";

    var adminPanel = document.getElementById("admin-panel");
    var loginStatus = document.getElementById("login-status");
    var committeeLogin = document.getElementById("committee-login");
    if (adminPanel) adminPanel.style.display = "block";
    if (loginStatus) loginStatus.style.display = "block";
    if (committeeLogin) committeeLogin.style.display = "none";

    // Load admin data
    displayExpenditures();
    displayScheduleEditor();
    displayOpinions();

    // Store committee authentication and user
    localStorage.setItem('committeeAuthenticated', 'true');
    localStorage.setItem('committeeUser', user);
    localStorage.setItem('committeeLoginTime', new Date().toISOString());
    return;
  }
  // Invalid credentials
  var button = document.querySelector("#committee-login button");
  if (button) button.textContent = "Invalid Credentials";
}

function committeeLogout() {
  localStorage.removeItem('committeeAuthenticated');
  localStorage.removeItem('committeeUser');
  localStorage.removeItem('committeeLoginTime');

  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("login-status").style.display = "none";
  document.getElementById("committee-login").style.display = "block";

  // Clear form
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  alert("Logged out successfully");
}

/***********************************
  AUTO LOAD FOR SPECIFIC PAGES
************************************/
// Call load functions if elements exist (for pages that load script after DOM ready)
if (document.getElementById("schedule-list")) loadSchedule();

/***********************************
  EXPENDITURE MANAGEMENT
************************************/
var expenditures = JSON.parse(localStorage.getItem('sankrathiExpenditures')) || [
  { description: "Decorations", amount: 5000 },
  { description: "Food and Catering", amount: 15000 },
  { description: "Prizes", amount: 3000 }
];

function displayExpenditures() {
  var container = document.getElementById("expenditure-list");
  if (!container) return;

  container.innerHTML = "";
  expenditures.forEach(function(exp, index) {
    var div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<strong>' + exp.description + '</strong> - ₹' + exp.amount + ' <button onclick="deleteExpenditure(' + index + ')" class="btn">Delete</button>';
    container.appendChild(div);
  });
}

function addExpenditure() {
  var desc = document.getElementById("exp-description").value;
  var amt = document.getElementById("exp-amount").value;

  if (desc && amt) {
    expenditures.push({ description: desc, amount: parseFloat(amt) });
    localStorage.setItem('sankrathiExpenditures', JSON.stringify(expenditures));
    displayExpenditures();
    document.getElementById("exp-description").value = "";
    document.getElementById("exp-amount").value = "";
  }
}

function deleteExpenditure(index) {
  expenditures.splice(index, 1);
  localStorage.setItem('sankrathiExpenditures', JSON.stringify(expenditures));
  displayExpenditures();
}

/***********************************
  SCHEDULE EDITOR
************************************/
function displayScheduleEditor() {
  const container = document.getElementById("schedule-editor");
  if (!container) return;

  container.innerHTML = "";
  scheduleData.forEach(function(item, index) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<input type="text" value="' + item.time + '" onchange="updateScheduleTime(' + index + ', this.value)">' +
      '<input type="text" value="' + item.event + '" onchange="updateScheduleEvent(' + index + ', this.value)">' +
      '<button onclick="deleteScheduleItem(' + index + ')" class="btn">Delete</button>';
    container.appendChild(div);
  });

  // Add new item form
  const addDiv = document.createElement("div");
  addDiv.className = "admin-form";
  addDiv.innerHTML = '<input type="text" id="new-time" placeholder="Time"> <input type="text" id="new-event" placeholder="Event"> <button onclick="addScheduleItem()" class="btn">Add Item</button>';
  container.appendChild(addDiv);
}

function updateScheduleTime(index, time) {
  scheduleData[index].time = time;
  localStorage.setItem('sankrathiSchedule', JSON.stringify(scheduleData));
}

function updateScheduleEvent(index, event) {
  scheduleData[index].event = event;
  localStorage.setItem('sankrathiSchedule', JSON.stringify(scheduleData));
}

function deleteScheduleItem(index) {
  scheduleData.splice(index, 1);
  localStorage.setItem('sankrathiSchedule', JSON.stringify(scheduleData));
  displayScheduleEditor();
}

function addScheduleItem() {
  const time = document.getElementById("new-time")?.value;
  const event = document.getElementById("new-event")?.value;

  if (time && event) {
    scheduleData.push({ id: Date.now(), time, event });
    localStorage.setItem('sankrathiSchedule', JSON.stringify(scheduleData));
    displayScheduleEditor();
    document.getElementById("new-time").value = "";
    document.getElementById("new-event").value = "";
  }
}

/***********************************
  OPINIONS MANAGEMENT
************************************/
var opinions = JSON.parse(localStorage.getItem('sankrathiOpinions')) || [];

function displayOpinions() {
  var container = document.getElementById("opinions-list");
  if (!container) return;

  container.innerHTML = "";
  opinions.forEach(function(op, index) {
    var div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<strong>' + op.author + ':</strong> ' + op.text + ' <button onclick="deleteOpinion(' + index + ')" class="btn">Delete</button>';
    container.appendChild(div);
  });
}

function addOpinion() {
  var author = document.getElementById("opinion-author").value;
  var text = document.getElementById("opinion-text").value;

  if (author && text) {
    opinions.push({ author: author, text: text });
    localStorage.setItem('sankrathiOpinions', JSON.stringify(opinions));
    displayOpinions();
    document.getElementById("opinion-author").value = "";
    document.getElementById("opinion-text").value = "";
  }
}

function deleteOpinion(index) {
  opinions.splice(index, 1);
  localStorage.setItem('sankrathiOpinions', JSON.stringify(opinions));
  displayOpinions();
}

/***********************************
  GAMES EDITOR
************************************/
function displayGamesEditor() {
  // Placeholder
}

/***********************************
  RANGOLI EDITOR
************************************/
function displayRangoliEditor() {
  // Placeholder
}

/***********************************
  USER STATS
************************************/
function updateUserStats() {
  // Placeholder
}

/***********************************
  ADD GAME (COMMITTEE ONLY)
************************************/
function addGame() {
  const gameInput = document.getElementById("new-game");
  const gameList = document.getElementById("games-list");

  if (!gameInput || !gameList || gameInput.value.trim() === "") return;

  const li = document.createElement("li");
  li.textContent = gameInput.value;
  gameList.appendChild(li);

  gameInput.value = "";
}

/***********************************
  AUTO LOAD FUNCTIONS (SAFE)
************************************/
/*
document.addEventListener("DOMContentLoaded", () => {
  loadSchedule();
  displayExpenditures();
  displayScheduleEditor();
  displayOpinions();
  displayGamesEditor();
  displayRangoliEditor();
  updateUserStats();

  // Check committee authentication status on page load
  const isAuthenticated = localStorage.getItem('committeeAuthenticated') === 'true';
  if (isAuthenticated) {
    document.getElementById("admin-panel")?.style?.display = "block";
    document.getElementById("login-status")?.style?.display = "block";
    document.getElementById("committee-login")?.style?.display = "none";
  } else {
    document.getElementById("admin-panel")?.style?.display = "none";
    document.getElementById("login-status")?.style?.display = "none";
    document.getElementById("committee-login")?.style?.display = "block";
  }
});
*/

