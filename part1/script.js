const apiKey = "b9b8c1f5883a908366cc58c48b9e5d5a";

// Store locations locally
let savedLocations = [];

// ----------------------
// TAB SWITCHING
// ----------------------
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab + "-tab").classList.add("active");
  });
});

// ----------------------
// GET WEATHER
// ----------------------
document.getElementById("get-weather").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert(data.message);
        return;
      }

      document.getElementById("weather-result").innerHTML = `
        <div class="weather-card">
          <h3>${data.name}, ${data.sys.country}</h3>
          <p>🌡 Temperature: ${data.main.temp} °C</p>
          <p>☁ Condition: ${data.weather[0].main}</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
        </div>
      `;

      showResponse(data);
    })
    .catch(err => console.log(err));
});

// ----------------------
// POST LOCATION
// ----------------------
document.getElementById("save-location").addEventListener("click", () => {
  const name = document.getElementById("location-name").value;
  const city = document.getElementById("location-city").value;
  const country = document.getElementById("location-country").value;
  const notes = document.getElementById("location-notes").value;

  const newLocation = { name, city, country, notes };

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newLocation),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      newLocation.id = data.id;
      savedLocations.push(newLocation);
      displayLocations();
      showResponse(data);
      alert("Location saved!");
    });
});

// ----------------------
// DISPLAY LOCATIONS
// ----------------------
function displayLocations() {
  const container = document.getElementById("saved-locations");
  container.innerHTML = "";

  savedLocations.forEach(loc => {
    container.innerHTML += `
      <div class="location-item">
        <strong>${loc.name}</strong>
        <p>${loc.city}, ${loc.country}</p>
        <p>${loc.notes || ""}</p>

        <div class="location-actions">
          <button class="btn-edit" onclick="openEdit(${loc.id})">Edit</button>
          <button class="btn-delete" onclick="deleteLocation(${loc.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

// ----------------------
// OPEN EDIT MODAL
// ----------------------
function openEdit(id) {
  const loc = savedLocations.find(l => l.id === id);

  document.getElementById("edit-id").value = id;
  document.getElementById("edit-name").value = loc.name;
  document.getElementById("edit-city").value = loc.city;
  document.getElementById("edit-country").value = loc.country;
  document.getElementById("edit-notes").value = loc.notes;

  document.getElementById("edit-modal").style.display = "block";
}

// ----------------------
// UPDATE LOCATION (PUT)
// ----------------------
document.getElementById("update-location").addEventListener("click", () => {
  const id = document.getElementById("edit-id").value;

  const updated = {
    name: document.getElementById("edit-name").value,
    city: document.getElementById("edit-city").value,
    country: document.getElementById("edit-country").value,
    notes: document.getElementById("edit-notes").value
  };

  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(updated),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      savedLocations = savedLocations.map(loc =>
        loc.id == id ? { ...loc, ...updated } : loc
      );

      displayLocations();
      closeModal();
      showResponse(data);
    });
});

// ----------------------
// DELETE LOCATION
// ----------------------
function deleteLocation(id) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE"
  }).then(() => {
    savedLocations = savedLocations.filter(loc => loc.id !== id);
    displayLocations();
  });
}

// ----------------------
// CLOSE MODAL
// ----------------------
document.getElementById("cancel-edit").addEventListener("click", closeModal);

function closeModal() {
  document.getElementById("edit-modal").style.display = "none";
}

// ----------------------
// SHOW API RESPONSE
// ----------------------
function showResponse(data) {
  document.getElementById("response-info").textContent =
    JSON.stringify(data, null, 2);
}