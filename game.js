/*======================================================
  OPERATION BIRTHDAY 30
  MISSION 2 - GAME ENGINE (game.js)
======================================================*/

// ---------- GAME STATE ----------
let currentPhase = 1;
let playerXP = 0;
let phase1Timer = 90;
let phase1TimerInterval = null;
let itemsFoundCount = 0;

// Phase 2 Fishing State
let fishCaught = 0;
let totalFishTarget = 5;
let fishingTimer = 60;
let fishingTimerInterval = null;

// ---------- HIDDEN ITEMS DEFINITION ----------
const hiddenItems = [
    { id: "tent", isHotspot: true, x: 80, y: 280, width: 420, height: 280, found: false },
    { id: "backpack", x: 560, y: 455, width: 75, height: 85, found: false },
    { id: "torchlight", x: 815, y: 495, width: 55, height: 25, found: false },
    { id: "compass", x: 625, y: 390, width: 35, height: 35, found: false },
    { id: "boots", x: 940, y: 515, width: 75, height: 55, found: false },
    { id: "bottle", x: 470, y: 470, width: 35, height: 65, found: false },
    { id: "fishingRod", x: 1030, y: 235, width: 165, height: 38, found: false },
    { id: "map", x: 720, y: 455, width: 80, height: 60, found: false },
    { id: "camera", x: 365, y: 535, width: 55, height: 50, found: false },
    { id: "key", x: 1090, y: 145, width: 32, height: 32, found: false }
];

// ---------- INITIALIZATION ----------
window.addEventListener("DOMContentLoaded", () => {
    simulateLoading();
    
    // Bind Start Mission Button
    const startBtn = document.getElementById("startMission");
    if (startBtn) {
        startBtn.addEventListener("click", startMission);
    }
});

function simulateLoading() {
    const fill = document.getElementById("loadingFill");
    const text = document.getElementById("loadingText");
    let progress = 0;

    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;

        if (fill) fill.style.width = progress + "%";
        if (text) text.innerText = `LOADING MISSION DATA... ${progress}%`;

        if (progress >= 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                document.getElementById("loadingScreen")?.classList.add("hidden");
                document.getElementById("introScreen")?.classList.remove("hidden");
                startTerminalTyping();
            }, 600);
        }
    }, 200);
}

function startTerminalTyping() {
    const terminal = document.getElementById("terminal");
    if (!terminal) return;

    const message = "> INCOMING TRANSMISSION...\n> MISSION 2: SEARCH THE CAMPSITE & PREPARE SUPPLIES.\n> WARNING: WILD BEAR APPROACHING THE AREA.\n> TIME ALLOTTED: 01:30.";
    let index = 0;
    terminal.innerText = "";

    const typeInterval = setInterval(() => {
        terminal.innerText += message[index];
        index++;
        if (index >= message.length) {
            clearInterval(typeInterval);
        }
    }, 30);
}

// ---------- START PHASE 1 ----------
function startMission() {
    document.getElementById("introScreen")?.classList.add("hidden");
    document.getElementById("gameHUD")?.classList.remove("hidden");
    document.getElementById("inventoryPanel")?.classList.remove("hidden");
    document.getElementById("phase1")?.classList.remove("hidden");

    createHiddenObjects();
    spawnWalkingBear();
    startPhase1Timer();
}

function startPhase1Timer() {
    phase1Timer = 90;
    updateTimerHUD(phase1Timer);

    if (phase1TimerInterval) clearInterval(phase1TimerInterval);

    phase1TimerInterval = setInterval(() => {
        phase1Timer--;
        updateTimerHUD(phase1Timer);
        updateBearProgressBar(phase1Timer, 90);

        if (phase1Timer <= 0) {
            clearInterval(phase1TimerInterval);
            handlePhase1TimeUp();
        }
    }, 1000);
}

function updateTimerHUD(secondsLeft) {
    const timerElem = document.getElementById("timer");
    if (!timerElem) return;

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    timerElem.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateBearProgressBar(timeLeft, totalTime) {
    const progressBar = document.getElementById("bearProgress");
    if (!progressBar) return;

    const percentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = percentage + "%";
}

// ---------- OBJECT COLLECTION & HOTSPOTS ----------
function createHiddenObjects() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    scene.querySelectorAll(".collectible, .collectible-hotspot").forEach(item => item.remove());

    hiddenItems.forEach(item => {
        let elem;

        if (item.isHotspot) {
            elem = document.createElement("div");
            elem.className = "collectible-hotspot";
        } else {
            elem = document.createElement("img");
            elem.src = `assets/items/${item.id}.png`;
            elem.className = "collectible";
            elem.draggable = false;
        }

        elem.dataset.item = item.id;
        elem.style.position = "absolute";
        elem.style.left = item.x + "px";
        elem.style.top = item.y + "px";
        elem.style.width = item.width + "px";
        elem.style.height = item.height + "px";

        elem.onclick = (e) => collectItem(item, elem, e);

        scene.appendChild(elem);
    });
}

function collectItem(item, elem, event) {
    if (item.found) return;

    item.found = true;
    itemsFoundCount++;
    addXP(100);

    showFloatingXP(event.clientX, event.clientY, "+100 XP");

    const slot = document.querySelector(`.inventorySlot[data-item="${item.id}"]`);
    if (slot) slot.classList.add("found");

    elem.classList.add("found");
    setTimeout(() => elem.remove(), 400);

    if (itemsFoundCount >= hiddenItems.length) {
        clearInterval(phase1TimerInterval);
        setTimeout(transitionToPhase2, 1000);
    }
}

function showFloatingXP(x, y, text) {
    const xpPop = document.createElement("div");
    xpPop.className = "floatingXP";
    xpPop.innerText = text;
    xpPop.style.left = x + "px";
    xpPop.style.top = y + "px";
    document.body.appendChild(xpPop);

    setTimeout(() => xpPop.remove(), 1400);
}

function addXP(amount) {
    playerXP += amount;
    const xpElem = document.getElementById("xp");
    if (xpElem) xpElem.innerText = playerXP;
}

// ---------- ANIMATED BEAR ----------
function spawnWalkingBear() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    const existingBear = document.getElementById("activeBearSprite");
    if (existingBear) existingBear.remove();

    const bear = document.createElement("img");
    bear.id = "activeBearSprite";
    bear.src = "assets/ui/bear.png";
    bear.className = "walking-bear bear-approaching";

    scene.appendChild(bear);
}

function handlePhase1TimeUp() {
    alert("Time's up! The bear reached the campsite. Escaping to the lake...");
    transitionToPhase2();
}

// ---------- PHASE 2 - FISHING MINIGAME ----------
function transitionToPhase2() {
    currentPhase = 2;
    document.getElementById("phase1")?.classList.add("hidden");
    document.getElementById("inventoryPanel")?.classList.add("hidden");
    document.getElementById("phase2")?.classList.remove("hidden");

    const objText = document.getElementById("objectiveText");
    if (objText) objText.innerText = "Phase 2: Catch 5 Fish at the Lake!";

    startFishingPhase();
}

function startFishingPhase() {
    fishCaught = 0;
    fishingTimer = 60;
    updateFishHUD();

    if (fishingTimerInterval) clearInterval(fishingTimerInterval);

    fishingTimerInterval = setInterval(() => {
        fishingTimer--;
        const timerElem = document.getElementById("fishingTimer");
        if (timerElem) timerElem.innerText = `00:${String(fishingTimer).padStart(2, '0')}`;

        if (fishingTimer <= 0) {
            clearInterval(fishingTimerInterval);
            showBirthdayEnding();
        }
    }, 1000);

    spawnFish();
}

function spawnFish() {
    const lake = document.getElementById("lake");
    if (!lake || currentPhase !== 2) return;

    const fish = document.createElement("div");
    fish.className = "fish";
    fish.style.backgroundImage = "url('assets/ui/fish.png')";
    fish.style.left = Math.random() * (window.innerWidth - 180) + 50 + "px";
    fish.style.top = Math.random() * (window.innerHeight - 300) + 180 + "px";

    fish.onclick = () => catchFish(fish);

    lake.appendChild(fish);
}

function catchFish(fishElem) {
    fishElem.remove();
    fishCaught++;
    addXP(150);
    updateFishHUD();

    if (fishCaught >= totalFishTarget) {
        clearInterval(fishingTimerInterval);
        setTimeout(showBirthdayEnding, 800);
    } else {
        setTimeout(spawnFish, 600);
    }
}

function updateFishHUD() {
    const counter = document.getElementById("fishCaught");
    if (counter) counter.innerText = `${fishCaught} / ${totalFishTarget}`;
}

// ---------- MISSION COMPLETE & REDIRECT ----------
function showBirthdayEnding() {
    document.getElementById("phase2")?.classList.add("hidden");
    document.getElementById("gameHUD")?.classList.add("hidden");

    const endingScreen = document.getElementById("missionComplete");
    if (endingScreen) endingScreen.classList.remove("hidden");

    const finalXP = document.getElementById("finalXP");
    if (finalXP) finalXP.innerText = playerXP;

    const nextBtn = document.getElementById("replayMission");
    if (nextBtn) {
        nextBtn.innerText = "Proceed to Mission 3 →";
        nextBtn.onclick = () => {
            window.location.href = "https://YOUR-USERNAME.github.io/MISSION-3-REPO/";
        };
    }
}
