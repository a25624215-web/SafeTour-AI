// =========================================================
// YATRA SAFE AI - FRONTEND JAVASCRIPT
// =========================================================

const API_URL = "http://127.0.0.1:8000";


// =========================================================
// SAFETY ANALYSIS
// =========================================================

async function analyzeSafety() {

    const location = document.getElementById("location").value.trim();
    const time = document.getElementById("time").value;
    const crowd = document.getElementById("crowd").value;
    const emergency = document.getElementById("emergency").checked;

    // Validation
    if (location === "") {
        alert("Please enter your location.");
        return;
    }

    const resultBox = document.getElementById("safetyResult");

    resultBox.classList.remove("hidden");

    document.getElementById("riskLevel").textContent = "Analyzing...";
    document.getElementById("riskScore").textContent = "...";
    document.getElementById("recommendation").textContent =
        "YATRA SAFE AI is analyzing your travel conditions...";

    try {

        const response = await fetch(
            `${API_URL}/analyze-safety`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    location: location,
                    time: time,
                    crowd_level: crowd,
                    emergency: emergency
                })
            }
        );

        if (!response.ok) {
            throw new Error("Safety API request failed.");
        }

        const data = await response.json();

        // Display result
        document.getElementById("riskLevel").textContent =
            data.risk_level;

        document.getElementById("riskScore").textContent =
            data.risk_score;

        document.getElementById("recommendation").textContent =
            data.recommendation;

    } catch (error) {

        console.error(error);

        document.getElementById("riskLevel").textContent =
            "ERROR";

        document.getElementById("riskScore").textContent =
            "-";

        document.getElementById("recommendation").textContent =
            "Unable to connect to YATRA SAFE AI backend. Please make sure the FastAPI server is running.";
    }
}


// =========================================================
// EMERGENCY ALERT
// =========================================================

async function sendEmergencyAlert() {

    const name =
        document.getElementById("name").value.trim();

    const location =
        document.getElementById("emergencyLocation").value.trim();

    const emergencyType =
        document.getElementById("emergencyType").value;

    const message =
        document.getElementById("emergencyMessage").value.trim();


    // Validation
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    if (location === "") {
        alert("Please enter your current location.");
        return;
    }

    if (message === "") {
        alert("Please describe the emergency.");
        return;
    }


    const resultBox =
        document.getElementById("emergencyResult");

    resultBox.classList.remove("hidden");

    document.getElementById("emergencyStatus").textContent =
        "Sending emergency alert...";

    document.getElementById("emergencyDetails").textContent =
        "";


    try {

        const response = await fetch(
            `${API_URL}/emergency-alert`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    location: location,
                    emergency_type: emergencyType,
                    message: message
                })
            }
        );


        if (!response.ok) {
            throw new Error("Emergency API request failed.");
        }


        const data = await response.json();


        document.getElementById("emergencyStatus").textContent =
            `Alert Status: ${data.alert_status}`;


        document.getElementById("emergencyDetails").textContent =
            `${data.message} Location: ${data.location}`;


    } catch (error) {

        console.error(error);

        document.getElementById("emergencyStatus").textContent =
            "ERROR";

        document.getElementById("emergencyDetails").textContent =
            "Unable to connect to the backend. Please make sure the FastAPI server is running.";
    }
}
       // =========================================================
// LIVE LOCATION
// =========================================================

   // =========================================================
// LIVE LOCATION + MAP
// =========================================================

let map = null;
let locationMarker = null;

function getCurrentLocation() {

    const status =
        document.getElementById("locationStatus");

    const coordinates =
        document.getElementById("coordinates");

    if (!navigator.geolocation) {

        status.textContent =
            "Geolocation is not supported by your browser.";

        return;
    }

    status.textContent =
        "Detecting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            // Show coordinates
            document.getElementById("latitude").textContent =
                latitude.toFixed(6);

            document.getElementById("longitude").textContent =
                longitude.toFixed(6);

            coordinates.classList.remove("hidden");


            status.textContent =
                "Location detected successfully.";


            // Create map
            if (map === null) {

                map = L.map("map").setView(
                    [latitude, longitude],
                    15
                );

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution:
                            '&copy; OpenStreetMap contributors'
                    }
                ).addTo(map);

            } else {

                map.setView(
                    [latitude, longitude],
                    15
                );

            }


            // Remove old marker
            if (locationMarker !== null) {

                map.removeLayer(locationMarker);

            }


            // Add new marker
            locationMarker = L.marker(
                [latitude, longitude]
            ).addTo(map);

            locationMarker.bindPopup(
                "<b>📍 Your Current Location</b><br>" +
                "Latitude: " + latitude.toFixed(6) +
                "<br>Longitude: " + longitude.toFixed(6)
            ).openPopup();


            // Fix map rendering
            setTimeout(function () {

                map.invalidateSize();

            }, 300);

        },


        function (error) {

            if (error.code === 1) {

                status.textContent =
                    "Location permission was denied.";

            } else if (error.code === 2) {

                status.textContent =
                    "Unable to detect your location.";

            } else {

                status.textContent =
                    "Location request timed out.";

            }

        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

    status.textContent =
        "Detecting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            document.getElementById("latitude").textContent =
                latitude.toFixed(6);

            document.getElementById("longitude").textContent =
                longitude.toFixed(6);

            coordinates.classList.remove("hidden");

            status.textContent =
                "Location detected successfully.";
        },

        function (error) {

            if (error.code === 1) {

                status.textContent =
                    "Location permission was denied.";

            } else if (error.code === 2) {

                status.textContent =
                    "Unable to detect your location.";

            } else {

                status.textContent =
                    "Location request timed out.";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
     // =========================================================
// NEARBY SAFETY POINTS
// =========================================================

async function findNearbySafety() {

    const status =
        document.getElementById("locationStatus");

    const nearbyResult =
        document.getElementById("nearbyResult");

    const nearbyList =
        document.getElementById("nearbyList");

    if (!navigator.geolocation) {
        status.textContent =
            "Geolocation is not supported by your browser.";
        return;
    }

    status.textContent =
        "Finding nearby safety points...";

    nearbyResult.classList.remove("hidden");

    nearbyList.innerHTML =
        "<p>Searching nearby places...</p>";

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            try {

                const response = await fetch(
                    `${API_URL}/nearby-safety?latitude=${latitude}&longitude=${longitude}`
                );

                if (!response.ok) {
                    throw new Error("Nearby safety API failed.");
                }

                const data = await response.json();

                if (!data.places || data.places.length === 0) {

                    nearbyList.innerHTML =
                        "<p>No nearby safety points found.</p>";

                    return;
                }

                nearbyList.innerHTML = "";

                data.places.forEach(function(place) {

                    const item =
                        document.createElement("div");

                    item.className = "nearby-item";

                    item.innerHTML = `
                        <strong>${getSafetyIcon(place.type)}
                        ${place.name}</strong>

                        <p>Type: ${place.type}</p>

                        <p>
                            ${Number(place.latitude).toFixed(5)},
                            ${Number(place.longitude).toFixed(5)}
                        </p>
                    `;

                    nearbyList.appendChild(item);


                    // Add marker to existing map
                    if (map) {

                        const marker = L.marker([
                            place.latitude,
                            place.longitude
                        ]).addTo(map);

                        marker.bindPopup(`
                            <b>${getSafetyIcon(place.type)}
                            ${place.name}</b><br>
                            Type: ${place.type}
                        `);
                    }

                });

                status.textContent =
                    `${data.count} nearby safety points found.`;

            } catch (error) {

                console.error(error);

                nearbyList.innerHTML =
                    "<p>Unable to fetch nearby safety points.</p>";

                status.textContent =
                    "Could not connect to safety points service.";
            }
        },

        function() {

            status.textContent =
                "Please allow location access.";

            nearbyList.innerHTML =
                "<p>Location permission is required.</p>";
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// =========================================================
// SAFETY POINT ICON
// =========================================================

function getSafetyIcon(type) {

    if (type === "police") {
        return "🚓";
    }

    if (type === "hospital") {
        return "🏥";
    }

    if (type === "fire_station") {
        return "🚒";
    }

    if (type === "pharmacy") {
        return "💊";
    }

    return "📍";
}