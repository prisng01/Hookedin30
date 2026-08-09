/*======================================================
 GAME CONFIG & STATE
======================================================*/
const game = {
    xp: 0,
    timeRemaining: 90, // 1 minute 30 seconds
    timerInterval: null,
    bearInterval: null,
    bearDistance: 0, // 0 = far, 100 = arrived at camp
    foundCount: 0,
    totalItems: 10,
    isPhase1Active: false
};

// Item definitions (X/Y coordinates mapped to a standard 1200x675 scene frame)
const hiddenItems = [
    { id: "tent", isHotspot: true, x: 80, y: 280, width: 420, height: 280, found: false },
    { id: "backpack", isHotspot: false, x: 560, y: 455, width: 75, height: 85, found: false },
    { id: "torchlight", isHotspot: false, x: 815, y: 495, width: 55, height: 25, found: false },
    { id: "compass", isHotspot: false, x: 625, y: 390, width: 35, height: 35, found: false },
    { id: "boots", isHotspot: false, x: 940, y: 515, width: 75, height: 55, found: false },
    { id: "bottle", isHotspot: false, x: 470, y: 470, width: 35, height: 65, found: false },
    { id: "fishingRod", isHotspot: false, x: 1030, y: 235, width: 165, height: 38, found: false },
    { id: "map", isHotspot: false, x: 720, y: 455, width: 80, height: 60, found: false },
    { id: "camera", isHotspot: false, x: 365, y: 535, width: 55, height: 50, found: false },
    { id: "key", isHotspot: false, x: 1090, y: 145, width: 32, height: 32, found: false }
];

/*======================================================
 DOM ELEMENTS
======================================================*/
const loadingScreen = document.getElementById("loadingScreen");
const loadingFill = document.getElementById("loadingFill");
const loadingText = document.getElementById("loadingText");
const introScreen = document.getElementById("introScreen");
const gameHUD = document.getElementById("gameHUD");
const phase1 = document.getElementById("phase1");
const phase2 = document.getElementById("phase2");
const inventoryPanel = document.getElementById("inventoryPanel");
const xpText = document.getElementById("xpText");
const timerText = document.getElementById("timerText");
const bearFill = document.getElementById("bearFill");
const bearIcon = document.getElementById("bearIcon");

/*======================================================
 INITIALIZATION & LOADING SCREEN
======================================================*/
const loadingMessages = [
    "Connecting to Mission Control...",
    "Authenticating Chief Adventurer...",
    "Decrypting Mission Files...",
    "Scanning Campsite...",
    "Bear detected nearby...",
    "Mission Ready."
];

let loadProgress = 0;
let msgIdx = 0;

const loadingInterval = setInterval(() => {
    loadProgress += 2;
    if (loadingFill) loadingFill.style.width = loadProgress + "%";
    if (loadingText) loadingText.innerHTML = `LOADING MISSION DATA... ${loadProgress}%`;

    if (loadProgress % 20 === 0 && msgIdx < loadingMessages.length) {
        if (loadingText) loadingText.innerHTML = loadingMessages[msgIdx];
        msgIdx++;
    }

    if (loadProgress >= 100) {
        clearInterval(loadingInterval);
        showIntro();
    }
}, 40);

function showIntro() {
    if (loadingScreen) {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            loadingScreen.style.display = "none";
            loadingScreen.classList.add("hidden");

            // Ensure game layers and ending overlays stay strictly hidden
            hideAllOverlays();

            if (introScreen) {
                introScreen.classList.remove("hidden");
                introScreen.style.display = "flex";
            }
            startTerminal();
        }, 500);
    }
}

function hideAllOverlays() {
    const overlays = ["#summaryOverlay", "#birthdayEnding", "#missionOverlay", "#phase1", "#phase2", "#gameHUD"];
    overlays.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add("hidden");
            el.style.display = "none";
        }
    });
}

/*======================================================
 TERMINAL BRIEFING
======================================================*/
const terminalLines = [
    "> Secure connection established.",
    "> Mission 1 completed successfully.",
    "> New coordinates received.",
    "> WARNING: Bear approaching campsite.",
    "> Recover all camping equipment.",
    "> Good luck, Chief ❤️"
];

function startTerminal() {
    const terminalBody = document.getElementById("terminalText");
    const startBtn = document.getElementById("startBtn");
    if (!terminalBody) return;

    terminalBody.innerHTML = "";
    let lineIndex = 0;

    function typeLine() {
        if (lineIndex < terminalLines.length) {
            const p = document.createElement("p");
            p.textContent = terminalLines[lineIndex];
            terminalBody.appendChild(p);
            lineIndex++;
            setTimeout(typeLine, 400);
        } else if (startBtn) {
            startBtn.classList.remove("hidden");
            startBtn.style.display = "inline-block";
        }
    }
    typeLine();
}

/*======================================================
 GAMEPLAY START (PHASE 1)
======================================================*/
function startGame() {
    hideAllOverlays();

    if (introScreen) introScreen.style.display = "none";
    if (gameHUD) {
        gameHUD.classList.remove("hidden");
        gameHUD.style.display = "flex";
    }
    if (phase1) {
        phase1.classList.remove("hidden");
        phase1.style.display = "flex";
    }
    if (inventoryPanel) {
        inventoryPanel.classList.remove("hidden");
        inventoryPanel.style.display = "block";
    }

    game.isPhase1Active = true;
    game.foundCount = 0;
    game.xp = 0;
    if (xpText) xpText.innerHTML = game.xp;

    createHiddenObjects();
    startTimer();
    startBearTracker();
}

/*======================================================
 OBJECT CREATION & CLICK HANDLERS
======================================================*/
function createHiddenObjects() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    // Clean up old elements
    scene.querySelectorAll(".collectible, .collectible-hotspot").forEach(el => el.remove());

    hiddenItems.forEach(item => {
        item.found = false;
        let elem;

        if (item.isHotspot) {
            // Transparent click box for background graphics (e.g., Tent)
            elem = document.createElement("div");
            elem.className = "collectible-hotspot";
        } else {
            // Standard image item
            elem = document.createElement("img");
            elem.src = `assets/items/${item.id}.png`;
            elem.className = "collectible";
            elem.draggable = false;
        }

        elem.dataset.id = item.id;
        elem.style.position = "absolute";
        elem.style.left = item.x + "px";
        elem.style.top = item.y + "px";
        elem.style.width = item.width + "px";
        elem.style.height = item.height + "px";

        elem.onclick = () => collectItem(item, elem);
        scene.appendChild(elem);
    });

    // Reset inventory HUD styles
    document.querySelectorAll(".inventory-item").forEach(slot => {
        slot.classList.remove("found");
    });
}

function collectItem(item, element) {
    if (item.found || !game.isPhase1Active) return;

    item.found = true;
    game.foundCount++;
    game.xp += 50;

    if (xpText) xpText.innerHTML = game.xp;
    element.remove();

    // Mark off in inventory panel
    const invSlot = document.querySelector(`.inventory-item[data-id="${item.id}"]`);
    if (invSlot) invSlot.classList.add("found");

    // Check victory
    if (game.foundCount >= game.totalItems) {
        completePhase1();
    }
}

/*======================================================
 TIMERS & BEAR AI
======================================================*/
function startTimer() {
    clearInterval(game.timerInterval);
    game.timeRemaining = 90;

    game.timerInterval = setInterval(() => {
        if (!game.isPhase1Active) return;

        game.timeRemaining--;
        const mins = String(Math.floor(game.timeRemaining / 60)).padStart(2, "0");
        const secs = String(game.timeRemaining % 60).padStart(2, "0");
        if (timerText) timerText.innerHTML = `${mins}:${secs}`;

        if (game.timeRemaining <= 0) {
            clearInterval(game.timerInterval);
            endPhase1(false);
        }
    }, 1000);
}

function startBearTracker() {
    clearInterval(game.bearInterval);
    game.bearDistance = 0;

    game.bearInterval = setInterval(() => {
        if (!game.isPhase1Active) return;

        game.bearDistance += 1.1; // Reaches campsite in ~90s
        if (bearFill) bearFill.style.width = game.bearDistance + "%";
        if (bearIcon) bearIcon.style.left = `calc(${game.bearDistance}% - 12px)`;

        if (game.bearDistance >= 100) {
            clearInterval(game.bearInterval);
            endPhase1(false);
        }
    }, 1000);
}

/*======================================================
 PHASE COMPLETION & OVERLAYS
======================================================*/
function completePhase1() {
    game.isPhase1Active = false;
    clearInterval(game.timerInterval);
    clearInterval(game.bearInterval);

    game.xp += 500; // Bonus for saving camp
    if (xpText) xpText.innerHTML = game.xp;

    const summaryOverlay = document.getElementById("summaryOverlay");
    if (summaryOverlay) {
        summaryOverlay.classList.remove("hidden");
        summaryOverlay.style.display = "flex";
    }
}

function endPhase1(success) {
    game.isPhase1Active = false;
    clearInterval(game.timerInterval);
    clearInterval(game.bearInterval);

    showBirthdayEnding();
}

function startPhase2() {
    hideAllOverlays();
    const birthdayEnding = document.getElementById("birthdayEnding");
    if (birthdayEnding) {
        document.getElementById("finalXP").innerText = `${game.xp} XP`;
        birthdayEnding.classList.remove("hidden");
        birthdayEnding.style.display = "flex";
    }
}

function showBirthdayEnding() {
    hideAllOverlays();
    const birthdayEnding = document.getElementById("birthdayEnding");
    if (birthdayEnding) {
        const finalXP = document.getElementById("finalXP");
        if (finalXP) finalXP.innerText = `${game.xp} XP`;
        birthdayEnding.classList.remove("hidden");
        birthdayEnding.style.display = "flex";
    }
}
