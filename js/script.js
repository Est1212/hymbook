// ===========================
// Global Variables
// ===========================

let allHymns = [];


// ===========================
// Home Page
// ===========================
function openHymn(hymnId) {

    localStorage.setItem("selectedHymn", hymnId);

    window.location.href = "hymn.html";

}
// Display hymn cards
function displayHymns(hymns) {

    const hymnList = document.getElementById("hymnList");

    if (!hymnList) return;

    hymnList.innerHTML = "";

    hymns.forEach(hymn => {

        hymnList.innerHTML += `
            <div class="hymn-card" onclick="openHymn(${hymn.id})">

                <div class="number">${hymn.number}</div>

                <div class="title">${hymn.title}</div>

                <div class="arrow">›</div>

            </div>
        `;

    });

}

// Load all hymns
function loadHomePage() {

    const hymnList = document.getElementById("hymnList");

    if (!hymnList) return;

    fetch("DATA/hymns.json")
        .then(response => response.json())
        .then(hymns => {

            allHymns = hymns;

            displayHymns(allHymns);

        });

}


// ===========================
// Search
// ===========================

function searchHymns() {

    const searchText = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const filtered = allHymns.filter(hymn =>

        hymn.title.toLowerCase().includes(searchText) ||

        hymn.number.includes(searchText)

    );

    displayHymns(filtered);

}


// ===========================
// Hymn Page
// ===========================

function loadHymnPage() {

    const hymnNumber = document.getElementById("hymnNumber");

    if (!hymnNumber) return;

    fetch("data/hymns.json")
        .then(response => response.json())
        .then(data => {

            const selectedHymn = localStorage.getItem("selectedHymn");

            const hymn = data.find(item => item.id == selectedHymn);

            if (!hymn) return;

            document.getElementById("hymnNumber").textContent = hymn.number;
            document.getElementById("hymnTitle").textContent = hymn.title;
            document.getElementById("hymnInfo").textContent =
                `Key: ${hymn.key} • Time: ${hymn.timeSignature}`;

            document.getElementById("lyrics").innerHTML =
                hymn.lyrics.join("<br><br>");

        });

}


// ===========================
// Navigation & choir part
// ===========================

function openPart(part) {

    localStorage.setItem("selectedPart", part);

    window.location.href = "part.html";

}
function goBack() {

    window.location.href = "index.html";

}


function loadPartPage() {

    const partNotes = document.getElementById("partNotes");

    if (!partNotes) return;

    fetch("DATA/hymns.json")
        .then(response => response.json())
        .then(data => {

            const hymnId = localStorage.getItem("selectedHymn");
            const part = localStorage.getItem("selectedPart");

            const hymn = data.find(item => item.id == hymnId);

            if (!hymn) return;

            document.getElementById("partTitle").textContent = hymn.title;

            document.getElementById("partName").textContent =
                part.charAt(0).toUpperCase() + part.slice(1);

            partNotes.innerHTML =
                hymn.choirParts[part].notes.join("<br><br>");

        });

}
// ===========================
// Start the App
// ===========================

loadHomePage();
loadHymnPage();
loadPartPage();