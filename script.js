// Load users from localStorage or default sample users
let users = JSON.parse(localStorage.getItem("users")) || [
  {
    name: "Rahul",
    city: "Kochi",
    teach: ["Python"],
    learn: ["Guitar"],
    email: "rahul@gmail.com",
    rating: 0,
    ratingCount: 0,
    reports: 0
  },
  {
    name: "Ananya Nair",
    city: "Kochi",
    teach: ["Guitar"],
    learn: ["Python"],
    email: "ananya@gmail.com",
    rating: 0,
    ratingCount: 0,
    reports: 0
  }
];

// Ensure all users have rating + reports fields
users.forEach(user => {
  user.rating = user.rating || 0;
  user.ratingCount = user.ratingCount || 0;
  user.reports = user.reports || 0;
});

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function addUser() {
    let name = document.getElementById("name").value;
    let city = document.getElementById("city").value;
    let teach = document.getElementById("teach").value.split(",");
    let learn = document.getElementById("learn").value.split(",");
    let email = document.getElementById("email").value;   // NEW

    users.push({
        name: name,
        city: city,
        teach: teach.map(skill => skill.trim()),
        learn: learn.map(skill => skill.trim()),
        email: email,              // NEW
        rating: 0,
        ratingCount: 0,
        reports: 0
    });

    saveUsers();
    document.getElementById("success").innerText = "Registration Successful!";
}

function displayUsers(filteredUsers = users) {
    let container = document.getElementById("userList");
    if (!container) return;

    container.innerHTML = "";

    if (filteredUsers.length === 0) {
        container.innerHTML = `
        <div style="text-align:center; padding:20px; color:gray;">
            <h3>😔 No Match Found</h3>
            <p>Try changing skill or city filters.</p>
        </div>
        `;
        return;
    }

    filteredUsers.forEach((user) => {
        let card = document.createElement("div");
        card.className = "user-card";

        let realIndex = users.indexOf(user);
        let matchFound = false;

        users.forEach((other, i) => {
            if (realIndex !== i) {
                let mutualTeach = user.teach.some(skill => other.learn.includes(skill));
                let mutualLearn = user.learn.some(skill => other.teach.includes(skill));

                if (mutualTeach && mutualLearn) {
                    matchFound = true;
                }
            }
        });

        if (matchFound) {
            card.classList.add("match");
        }

        card.innerHTML = `
        <strong>${user.name}</strong><br>
        City: ${user.city}<br>
        Teaches: ${user.teach.join(", ")}<br>
        Learns: ${user.learn.join(", ")}<br>
        📧 Contact: <a href="mailto:${user.email}">${user.email}</a>

        <p><strong>⭐ Rating:</strong> ${user.rating.toFixed(1)} (${user.ratingCount} reviews)</p>

        <div>
            Rate:
            <button onclick="rateUser(${realIndex},1)">1</button>
            <button onclick="rateUser(${realIndex},2)">2</button>
            <button onclick="rateUser(${realIndex},3)">3</button>
            <button onclick="rateUser(${realIndex},4)">4</button>
            <button onclick="rateUser(${realIndex},5)">5</button>
        </div>

        <br>

        <button onclick="reportUser(${realIndex})" style="color:red;">
            🚩 Report User
        </button>

        <p>Reports: ${user.reports}</p>

        ${user.reports >= 3 
            ? "<p style='color:red; font-weight:bold;'>⚠️ User Under Review</p>" 
            : ""
        }
        `;

        container.appendChild(card);
    });
}

function applyFilters() {
    let skillInput = document.getElementById("searchSkill").value.trim().toLowerCase();
    let cityInput = document.getElementById("searchCity").value.trim().toLowerCase();

    let filtered = users.filter(user => {

        let skillMatch = true;
        let cityMatch = true;

        if (skillInput !== "") {
            skillMatch =
                user.teach.some(skill => skill.toLowerCase() === skillInput) ||
                user.learn.some(skill => skill.toLowerCase() === skillInput);
        }

        if (cityInput !== "") {
            cityMatch = user.city.toLowerCase() === cityInput;
        }

        return skillMatch && cityMatch;
    });

    displayUsers(filtered);
}
function rateUser(index, stars) {
  let user = users[index];

  user.rating = ((user.rating * user.ratingCount) + stars) / (user.ratingCount + 1);
  user.ratingCount += 1;

  localStorage.setItem("users", JSON.stringify(users));

  displayUsers();
}
function reportUser(index) {
  users[index].reports += 1;

  localStorage.setItem("users", JSON.stringify(users));

  alert("User reported successfully.");

  displayUsers();
}