
// ===========================
// Global Variables
// ===========================

let allHymns = [];

// ===========================
// Musical Keys
// ===========================

const musicalKeys = [
    { value: "C", label: "C" },
    { value: "Db", label: "D♭" },
    { value: "D", label: "D" },
    { value: "Eb", label: "E♭" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "Gb", label: "G♭" },
    { value: "G", label: "G" },
    { value: "Ab", label: "A♭" },
    { value: "A", label: "A" },
    { value: "Bb", label: "B♭" },
    { value: "B", label: "B" }
];
// ===========================
// Sound Engine
// ===========================

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextClass();

const noteFrequencies = {
    "C": 261.63,
    "Db": 277.18,
    "D": 293.66,
    "Eb": 311.13,
    "E": 329.63,
    "F": 349.23,
    "Gb": 369.99,
    "G": 392.00,
    "Ab": 415.30,
    "A": 440.00,
    "Bb": 466.16,
    "B": 493.88
};

// ===========================
// Play Note
// ===========================

const NOTE_DURATION = 1; // seconds

function playFrequency(frequency) {

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const now = audioContext.currentTime;

    osc.type = "triangle";
    osc.frequency.value = frequency;

    osc.connect(gain);
    gain.connect(audioContext.destination);

    // Start immediately
    gain.gain.setValueAtTime(0.3, now);

    osc.start(now);

    // Stop after exactly 1 second
    osc.stop(now + 1);

}

async function setupKeySelector() {

    const keySelect = document.getElementById("keySelect");

    if (!keySelect) return;

    keySelect.addEventListener("change", async () => {

        if (audioContext.state !== "running") {
            await audioContext.resume();
        }

        const key = keySelect.value;

        console.log("Selected Key:", key);

        playFrequency(noteFrequencies[key]);

    });

}


// ===========================
// Load Key Selector
// ===========================

function loadKeySelector() {

    const keySelect = document.getElementById("keySelect");

    if (!keySelect) return;

    keySelect.innerHTML = "";

    musicalKeys.forEach(key => {

        const option = document.createElement("option");

        option.value = key.value;
        option.textContent = key.label;

        keySelect.appendChild(option);

    });


}

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

    fetch("data/hymns.json")
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
            document.getElementById("keySelect").value = hymn.key;

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

    fetch("data/hymns.json")
        .then(response => response.json())
        .then(data => {

            const hymnId = localStorage.getItem("selectedHymn");
            const part = localStorage.getItem("selectedPart");

            const hymn = data.find(item => item.id == hymnId);

            if (!hymn) return;

            document.getElementById("partTitle").textContent = hymn.title;

            document.getElementById("partName").textContent =
                part.charAt(0).toUpperCase() + part.slice(1);

            partNotes.textContent =
                hymn.choirParts[part].notes.join("\n");

        });

}
// ===========================
// Start the App
// ===========================

document.addEventListener("DOMContentLoaded", () => {

    loadKeySelector();

    setupKeySelector();

    loadHomePage();

    loadHymnPage();

    loadPartPage();

});