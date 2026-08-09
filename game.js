/*======================================================
 GAME CONFIG & STATE
======================================================*/
const game = {
    xp: 0,
    timeRemaining: 90,
    timerInterval: null,
    bearInterval: null,
    bearDistance: 0,
    foundCount: 0,
    totalItems: 10,
    isPhase1Active: false,
    
    // Phase 2 Fishing State
    isPhase2Active: false,
    phase2TimeRemaining: 120, // 2 minutes
    phase2TimerInterval: null,
    reelProgress: 0,
    reelDecayInterval: null,
    fishBiteTimeout: null,
    activeFish: null,
    caughtFishes: {
        blueFish: false,
        goldFish: false,
        heartFish: false,
        rainbowFish: false
    }
};

const fishList = [
    { id: "blueFish", name: "Blue Fish" },
    { id: "goldFish", name: "Gold Fish" },
    { id: "heartFish", name: "Heart Fish" },
    { id: "rainbowFish", name: "Rainbow Fish" }
];

// Item definitions (Tent uses invisible hotspot; Backpack and others use assets/items/*.png)
const hiddenItems = [
    { id: "tent", isHotspot: true, x: 210, y: 220, width: 440, height: 320, found: false },
    { id: "backpack", isHotspot: false, x: 420, y: 410, width: 60, height: 65, found: false },
    { id: "torchlight", isHotspot: false, x: 820, y: 490, width: 35, height: 25, found: false },
    { id: "compass", isHotspot: false, x: 530, y: 520, width: 32, height: 32, found: false },
    { id: "boots", isHotspot: false, x: 180, y: 510, width: 55, height: 45, found: false },
    { id: "bottle", isHotspot: false, x: 470, y: 420, width: 25, height: 45, found: false },
    { id: "fishingRod", isHotspot: false, x: 980, y: 450, width: 120, height: 30, found: false },
    { id: "map", isHotspot: false, x: 120, y: 520, width: 50, height: 35, found: false },
    { id: "camera", isHotspot: false, x: 340, y: 530, width: 40, height: 35, found: false },
    { id: "key", isHotspot: false, x: 880, y: 480, width: 25, height: 25, found: false }
];

/*======================================================
 AUDIO ENGINE
======================================================*/
const audio = {
    bgm: document.getElementById("bgm"),
    click: document.getElementById("clickSound"),
    found: document.getElementById("foundSound"),
    win: document.getElementById("winSound"),
    bear: document.getElementById("bearSound")
};

let audioUnlocked = false;

function unlockAndPlayAudio() {
    if (audioUnlocked) return;
    
    Object.values(audio).forEach(sound => {
        if (sound) {
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch(() => {});
        }
    });

    if (audio.bgm) {
        audio.bgm.volume = 0.35;
        audio.bgm.play().then(() => {
            audioUnlocked = true;
        }).catch(err => console.warn("BGM waiting for user interaction:", err));
    }
}

window.addEventListener("click", unlockAndPlayAudio, { once: true });
window.addEventListener("keydown", unlockAndPlayAudio, { once: true });
window.addEventListener("touchstart", unlockAndPlayAudio, { once: true });

function playSound(soundName) {
    const sound = audio[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.warn(`Sound playback restricted [${soundName}]:`, err));
    }
}

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
    const overlays = ["#summaryOverlay", "#birthdayEnding", "#phase1", "#phase2", "#gameHUD"];
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
 GAME 1: CAMPSITE SEARCH (campsite.png)
======================================================*/
function startGame() {
    unlockAndPlayAudio();
    playSound("click");

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

function createHiddenObjects() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    scene.querySelectorAll(".collectible, .collectible-hotspot").forEach(el => el.remove());

    hiddenItems.forEach(item => {
        item.found = false;
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

        elem.dataset.id = item.id;
        elem.style.left = item.x + "px";
        elem.style.top = item.y + "px";
        elem.style.width = item.width + "px";
        elem.style.height = item.height + "px";

        elem.onclick = () => collectItem(item, elem);
        scene.appendChild(elem);
    });

    document.querySelectorAll(".inventory-item").forEach(slot => {
        slot.classList.remove("found");
    });
}

function collectItem(item, element) {
    if (item.found || !game.isPhase1Active) return;

    item.found = true;
    game.foundCount++;
    game.xp += 50;

    playSound("found");

    if (xpText) xpText.innerHTML = game.xp;

    element.style.opacity = "0";
    element.style.pointerEvents = "none";
    setTimeout(() => element.remove(), 200);

    const invSlot = document.querySelector(`.inventory-item[data-id="${item.id}"]`);
    if (invSlot) {
        invSlot.classList.add("found");
    }

    if (game.foundCount >= game.totalItems) {
        completePhase1();
    }
}

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

        game.bearDistance += 1.1;
        if (bearFill) bearFill.style.width = game.bearDistance + "%";
        if (bearIcon) bearIcon.style.left = `calc(${game.bearDistance}% - 12px)`;

        if (game.bearDistance >= 100) {
            clearInterval(game.bearInterval);
            playSound("bear");
            endPhase1(false);
        }
    }, 1000);
}

function completePhase1() {
    game.isPhase1Active = false;
    clearInterval(game.timerInterval);
    clearInterval(game.bearInterval);

    playSound("win");
    game.xp += 500;
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

/*======================================================
 GAME 2: REALISTIC 4-FISH CHALLENGE (lake.png)
======================================================*/
function startPhase2() {
    playSound("click");
    hideAllOverlays();

    if (inventoryPanel) {
        inventoryPanel.classList.add("hidden");
        inventoryPanel.style.display = "none";
    }

    if (phase2) {
        phase2.classList.remove("hidden");
        phase2.style.display = "flex";
    }
    if (gameHUD) {
        gameHUD.classList.remove("hidden");
        gameHUD.style.display = "flex";
    }

    game.isPhase2Active = true;
    game.phase2TimeRemaining = 120; // 2 minutes
    game.caughtFishes = { blueFish: false, goldFish: false, heartFish: false, rainbowFish: false };

    // Reset UI Checklist
    fishList.forEach(f => {
        const goalEl = document.getElementById(`goal-${f.id}`);
        if (goalEl) goalEl.classList.remove("caught");
    });

    // Start Phase 2 2-Minute Countdown
    clearInterval(game.phase2TimerInterval);
    game.phase2TimerInterval = setInterval(() => {
        if (!game.isPhase2Active) return;

        game.phase2TimeRemaining--;
        const mins = String(Math.floor(game.phase2TimeRemaining / 60)).padStart(2, "0");
        const secs = String(game.phase2TimeRemaining % 60).padStart(2, "0");
        if (timerText) timerText.innerHTML = `${mins}:${secs}`;

        if (game.phase2TimeRemaining <= 0) {
            clearInterval(game.phase2TimerInterval);
            game.isPhase2Active = false;
            showBirthdayEnding();
        }
    }, 1000);

    // Controls setup
    window.removeEventListener("keydown", handleReelInput);
    window.addEventListener("keydown", handleReelInput);

    const fishingScene = document.getElementById("fishingScene");
    if (fishingScene) {
        fishingScene.onclick = reelIn;
    }

    // Decay interval for active fish
    clearInterval(game.reelDecayInterval);
    game.reelDecayInterval = setInterval(() => {
        if (!game.isPhase2Active || !game.activeFish) return;

        if (game.reelProgress > 0) {
            game.reelProgress -= 3;
            if (game.reelProgress < 0) game.reelProgress = 0;
            const reelFill = document.getElementById("reelFill");
            if (reelFill) reelFill.style.width = game.reelProgress + "%";
        }
    }, 100);

    triggerNextFishBite();
}

function triggerNextFishBite() {
    if (!game.isPhase2Active) return;

    const statusEl = document.getElementById("fishStatus");
    const controlsEl = document.getElementById("reelControls");
    if (controlsEl) controlsEl.classList.add("hidden");
    if (statusEl) statusEl.innerText = "Casting line into the lake... Waiting for a bite...";

    // Get list of uncaught fish
    const uncaught = fishList.filter(f => !game.caughtFishes[f.id]);
    if (uncaught.length === 0) return; // All caught

    // Random bite delay between 2 and 4 seconds
    const delay = Math.floor(Math.random() * 2000) + 2000;
    
    clearTimeout(game.fishBiteTimeout);
    game.fishBiteTimeout = setTimeout(() => {
        if (!game.isPhase2Active) return;

        // Pick random uncaught fish
        game.activeFish = uncaught[Math.floor(Math.random() * uncaught.length)];
        game.reelProgress = 10;

        const activeNameEl = document.getElementById("activeFishName");
        if (activeNameEl) activeNameEl.innerText = game.activeFish.name.toUpperCase();

        if (statusEl) statusEl.innerText = "🎣 SOMETHING IS BITING!";
        if (controlsEl) controlsEl.classList.remove("hidden");

        playSound("click");
    }, delay);
}

function handleReelInput(e) {
    if (e.code === "Space") {
        e.preventDefault();
        reelIn();
    }
}

function reelIn() {
    if (!game.isPhase2Active || !game.activeFish) return;

    game.reelProgress += 9;
    playSound("click");

    const reelFill = document.getElementById("reelFill");
    if (reelFill) reelFill.style.width = Math.min(game.reelProgress, 100) + "%";

    if (game.reelProgress >= 100) {
        // Fish Successfully Caught
        const caughtFish = game.activeFish;
        game.caughtFishes[caughtFish.id] = true;
        game.activeFish = null;

        playSound("found");
        game.xp += 150;
        if (xpText) xpText.innerHTML = game.xp;

        // Update Checklist UI
        const goalEl = document.getElementById(`goal-${caughtFish.id}`);
        if (goalEl) goalEl.classList.add("caught");

        // Hide controls
        const controlsEl = document.getElementById("reelControls");
        if (controlsEl) controlsEl.classList.add("hidden");

        // Check if all 4 fishes are caught
        const totalCaught = Object.values(game.caughtFishes).filter(Boolean).length;
        if (totalCaught >= 4) {
            game.isPhase2Active = false;
            clearInterval(game.phase2TimerInterval);
            clearInterval(game.reelDecayInterval);
            playSound("win");
            game.xp += 600;
            if (xpText) xpText.innerHTML = game.xp;
            setTimeout(showBirthdayEnding, 1000);
        } else {
            triggerNextFishBite();
        }
    }
}

/*======================================================
 GAME FINISH & ENDING
======================================================*/
function showBirthdayEnding() {
    if (audio.bgm) {
        audio.bgm.pause();
        audio.bgm.currentTime = 0;
    }

    hideAllOverlays();
    const birthdayEnding = document.getElementById("birthdayEnding");
    if (birthdayEnding) {
        const finalXP = document.getElementById("finalXP");
        if (finalXP) finalXP.innerText = `${game.xp} XP`;
        birthdayEnding.classList.remove("hidden");
        birthdayEnding.style.display = "flex";
    }
}
