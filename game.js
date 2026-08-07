/*======================================================
 OPERATION BIRTHDAY 30
 MISSION 2
 GAME.JS
======================================================*/

"use strict";

/*======================================================
 GAME STATE
======================================================*/

const game = {
    xp: 0,
    phase: 1,
    itemsFound: 0,
    totalItems: 10,
    fishCaught: 0,
    timer: 60,
    fishingTimer: 60,
    missionStarted: false
};

/*======================================================
 HTML ELEMENTS
======================================================*/

const loadingScreen = document.getElementById("loadingScreen");
const introScreen = document.getElementById("introScreen");
const gameHUD = document.getElementById("gameHUD");
const inventoryPanel = document.getElementById("inventoryPanel");
const phase1 = document.getElementById("phase1");
const startMissionBtn = document.getElementById("startMission");
const terminal = document.getElementById("terminal");
const loadingFill = document.getElementById("loadingFill");
const loadingText = document.getElementById("loadingText");
const xpText = document.getElementById("xp");
const timerText = document.getElementById("timer");

/*======================================================
 LOADING SCREEN
======================================================*/

const loadingMessages = [
    "Connecting to Mission Control...",
    "Authenticating Chief Adventurer...",
    "Decrypting Mission Files...",
    "Scanning Campsite...",
    "Bear detected nearby...",
    "Mission Ready."
];

let load = 0;
let messageIndex = 0;

const loadingAnimation = setInterval(() => {
    load += 2;
    if (loadingFill) loadingFill.style.width = load + "%";

    if (load % 20 === 0 && loadingText) {
        loadingText.innerHTML = loadingMessages[messageIndex];
        messageIndex++;
    }

    if (load >= 100) {
        clearInterval(loadingAnimation);
        setTimeout(showIntro, 700);
    }
}, 80);

/*======================================================
 SHOW INTRO
======================================================*/

function showIntro() {
    if (loadingScreen) {
        loadingScreen.classList.add("fadeOut");
        setTimeout(() => {
            loadingScreen.style.display = "none";
            if (introScreen) {
                introScreen.classList.remove("hidden");
                introScreen.classList.add("fadeIn");
            }
            startTerminal();
        }, 700);
    }
}

/*======================================================
 TERMINAL
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
    if (!terminal) return;
    terminal.innerHTML = "";
    let line = 0;

    function typeLine() {
        if (line >= terminalLines.length) return;

        let p = document.createElement("p");
        terminal.appendChild(p);

        let text = terminalLines[line];
        let i = 0;

        const typing = setInterval(() => {
            p.innerHTML = text.substring(0, i);
            i++;

            if (i > text.length) {
                clearInterval(typing);
                line++;
                setTimeout(typeLine, 250);
            }
        }, 28);
    }

    typeLine();
}

/*======================================================
 START MISSION
======================================================*/

if (startMissionBtn) {
    startMissionBtn.addEventListener("click", () => {
        game.missionStarted = true;
        if (introScreen) introScreen.classList.add("fadeOut");

        // ▶ Play background music
        const bg = document.getElementById("bgMusic");
        if (bg) {
            bg.volume = 0.4;
            bg.play().catch(() => {});
        }

        setTimeout(() => {
            if (introScreen) introScreen.style.display = "none";
            if (gameHUD) {
                gameHUD.classList.remove("hidden");
                gameHUD.classList.add("fadeIn");
            }
            if (inventoryPanel) {
                inventoryPanel.classList.remove("hidden");
                inventoryPanel.classList.add("fadeIn");
            }
            if (phase1) {
                phase1.classList.remove("hidden");
                phase1.classList.add("fadeIn");
            }

            /* Start Phase 1 */
            startCountdown();
            startPhase1();
        }, 700);
    });
}

function startPhase1() {
    createHiddenObjects();
    startEnvironment();
    startBearAI();
    startHintSystem();
}

/*======================================================
 XP SYSTEM
======================================================*/

function addXP(amount, target) {
    game.xp += amount;
    if (xpText) xpText.innerHTML = game.xp;
    if (target) floatingXP(amount, target);
}

/*======================================================
 FLOATING XP
======================================================*/

function floatingXP(amount, target) {
    if (!target) return;
    const xp = document.createElement("div");
    xp.className = "floatingXP";
    xp.innerHTML = "⭐ +" + amount;

    const rect = target.getBoundingClientRect();
    xp.style.left = (rect.left + 15) + "px";
    xp.style.top = rect.top + "px";

    document.body.appendChild(xp);

    setTimeout(() => {
        xp.remove();
    }, 1200);
}

/*======================================================
 TIMER
======================================================*/

let gameTimerInterval = null;

function startCountdown() {
    gameTimerInterval = setInterval(() => {
        game.timer--;
        if (timerText) {
            timerText.innerHTML = "00:" + String(game.timer).padStart(2, "0");
        }

        if (game.timer <= 0) {
            clearInterval(gameTimerInterval);
            alert("🐻 The bear reached the campsite!");
            location.reload();
        }
    }, 1000);
}

/*======================================================
 SAVE & LOAD
======================================================*/

function saveGame() {
    localStorage.setItem("mission2", JSON.stringify(game));
}

function loadGame() {
    const save = localStorage.getItem("mission2");
    if (save) {
        Object.assign(game, JSON.parse(save));
        if (xpText) xpText.innerHTML = game.xp;
    }
}

loadGame();

/*======================================================
 PHASE 1 GAME ENGINE & HIDDEN OBJECTS
======================================================*/

let bearDistance = 100;
let bearInterval = null;

const hiddenItems = [
    { id: "tent", x: 710, y: 320, width: 160, height: 130, found: false },
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

function createHiddenObjects() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    scene.querySelectorAll(".collectible").forEach(item => item.remove());

    hiddenItems.forEach(item => {
        const img = document.createElement("img");
        img.src = `assets/items/${item.id}.png`;
        img.className = "collectible";
        img.dataset.item = item.id;
        img.style.position = "absolute";
        img.style.left = item.x + "px";
        img.style.top = item.y + "px";
        img.style.width = item.width + "px";
        img.style.height = item.height + "px";
        img.draggable = false;
        img.onclick = () => collectItem(item, img);

        scene.appendChild(img);
    });
}

function collectItem(item, img) {
    if (item.found) return;
    item.found = true;

    resetHintTimer();
    img.classList.add("found");
    sparkle(img);

    const sound = document.getElementById("collectSound");
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    flyToInventory(img, item.id);
    addXP(50, img);
    addScore(50);
    updateCombo();
    giveTimeBonus();

    game.itemsFound++;
    updateInventory(item.id);

    setTimeout(() => {
        img.remove();
    }, 900);

    if (game.itemsFound === hiddenItems.length) {
        missionSuccess();
    }
}

function updateInventory(itemId) {
    const inventorySlots = document.querySelectorAll(".inventorySlot");
    inventorySlots.forEach(slot => {
        const text = slot.querySelector("p");
        if (text && text.innerText.replace(/\s/g, "").toLowerCase() === itemId.toLowerCase()) {
            slot.classList.add("found");
        }
    });
}

function sparkle(target) {
    const scene = document.getElementById("campScene");
    if (!scene) return;
    const rect = target.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();

    for (let i = 0; i < 18; i++) {
        const s = document.createElement("div");
        s.className = "sparkle";

        const angle = Math.random() * 360;
        const distance = 40 + Math.random() * 60;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;

        s.style.left = (rect.left - sceneRect.left + rect.width / 2) + "px";
        s.style.top = (rect.top - sceneRect.top + rect.height / 2) + "px";

        scene.appendChild(s);

        requestAnimationFrame(() => {
            s.style.transform = `translate(${x}px,${y}px) scale(2)`;
            s.style.opacity = "0";
        });

        setTimeout(() => {
            s.remove();
        }, 700);
    }
}

function bearRoar() {
    document.body.classList.add("shake");
    const roar = document.getElementById("bearSound");
    if (roar) roar.play().catch(() => {});

    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 400);
}

function missionSuccess() {
    clearInterval(bearInterval);
    clearInterval(gameTimerInterval);
    perfectBonus();
    saveGame();

    const sound = document.getElementById("successSound");
    if (sound) sound.play().catch(() => {});

    document.getElementById("phase1")?.classList.add("fadeOut");

    setTimeout(() => {
        startMissionTransition();
    }, 1200);
}

function resetObjects() {
    hiddenItems.forEach(item => { item.found = false; });
    game.itemsFound = 0;
}

function flyToInventory(itemElement, itemId) {
    const inventorySlots = document.querySelectorAll(".inventorySlot");
    let targetSlot = null;

    inventorySlots.forEach(slot => {
        const text = slot.querySelector("p");
        if (!text) return;
        const compare = text.innerText.replace(/\s/g, "").toLowerCase();
        if (compare === itemId.toLowerCase()) {
            targetSlot = slot;
        }
    });

    if (!targetSlot) {
        itemElement.remove();
        return;
    }

    const start = itemElement.getBoundingClientRect();
    const end = targetSlot.getBoundingClientRect();

    const flying = itemElement.cloneNode(true);
    flying.style.position = "fixed";
    flying.style.left = start.left + "px";
    flying.style.top = start.top + "px";
    flying.style.width = start.width + "px";
    flying.style.height = start.height + "px";
    flying.style.pointerEvents = "none";
    flying.style.zIndex = "99999";
    flying.style.transition = "all .9s cubic-bezier(.22,.61,.36,1)";

    document.body.appendChild(flying);

    requestAnimationFrame(() => {
        flying.style.left = end.left + 15 + "px";
        flying.style.top = end.top + 10 + "px";
        flying.style.width = "42px";
        flying.style.height = "42px";
        flying.style.opacity = ".2";
        flying.style.transform = "rotate(720deg) scale(.4)";
    });

    setTimeout(() => {
        flying.remove();
        targetSlot.classList.add("found");
        targetSlot.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.15)" },
            { transform: "scale(1)" }
        ], {
            duration: 450
        });
    }, 900);
}

/*======================================================
 BEAR AI SYSTEM
======================================================*/

const bear = document.createElement("img");
bear.src = "assets/bear/bear_walk.png";
bear.id = "bearSprite";
bear.style.position = "absolute";
bear.style.left = "-220px";
bear.style.bottom = "70px";
bear.style.width = "180px";
bear.style.zIndex = "200";
bear.style.pointerEvents = "none";

const campScene = document.getElementById("campScene");
if (campScene) campScene.appendChild(bear);

let bearPosition = -220;
let bearSpeed = 1.6;

function startBearAI() {
    const progressBar = document.getElementById("bearProgress");

    bearInterval = setInterval(() => {
        bearPosition += bearSpeed;
        bear.style.left = bearPosition + "px";
        bearDistance -= 1.6;

        if (bearDistance < 0) bearDistance = 0;
        if (progressBar) progressBar.style.width = bearDistance + "%";

        if (bearDistance < 40) {
            bearSpeed = 2.6;
            document.body.classList.add("danger");
        }

        if (bearDistance < 20) {
            bearSpeed = 4.5;
            bearRoar();
        }

        if (bearDistance <= 0) {
            clearInterval(bearInterval);
            gameOver();
        }
    }, 100);
}

function gameOver() {
    const roar = document.getElementById("bearSound");
    if (roar) roar.play().catch(() => {});

    const warning = document.createElement("div");
    warning.className = "bearWarning";
    warning.innerHTML = "🐻 The Bear Reached Camp!";
    document.body.appendChild(warning);

    setTimeout(() => {
        location.reload();
    }, 3500);
}

/*======================================================
 ANIMATED CAMPSITE ENVIRONMENT
======================================================*/

function createCampfire() {
    const scene = document.getElementById("campScene");
    if (!scene || document.getElementById("campFire")) return;
    const fire = document.createElement("div");
    fire.id = "campFire";
    scene.appendChild(fire);
}

function createSmoke() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    setInterval(() => {
        const smoke = document.createElement("div");
        smoke.className = "smoke";
        smoke.style.left = (520 + Math.random() * 60) + "px";
        smoke.style.bottom = (210 + Math.random() * 20) + "px";
        scene.appendChild(smoke);

        setTimeout(() => { smoke.remove(); }, 5000);
    }, 500);
}

function createLeaves() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    setInterval(() => {
        const leaf = document.createElement("div");
        leaf.className = "leaf";
        leaf.style.left = Math.random() * window.innerWidth + "px";
        leaf.style.top = "-30px";
        leaf.style.animationDuration = (6 + Math.random() * 4) + "s";
        scene.appendChild(leaf);

        setTimeout(() => { leaf.remove(); }, 9000);
    }, 1500);
}

function createClouds() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    setInterval(() => {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        cloud.style.top = (30 + Math.random() * 120) + "px";
        scene.appendChild(cloud);

        setTimeout(() => { cloud.remove(); }, 35000);
    }, 9000);
}

function createBirds() {
    const scene = document.getElementById("campScene");
    if (!scene) return;

    setInterval(() => {
        const bird = document.createElement("div");
        bird.className = "bird";
        bird.style.top = (50 + Math.random() * 150) + "px";
        scene.appendChild(bird);

        setTimeout(() => { bird.remove(); }, 12000);
    }, 14000);
}

function createSunlight() {
    const scene = document.getElementById("campScene");
    if (!scene || document.getElementById("sunGlow")) return;
    const sun = document.createElement("div");
    sun.id = "sunGlow";
    scene.appendChild(sun);
}

function startEnvironment() {
    createCampfire();
    createSmoke();
    createLeaves();
    createClouds();
    createBirds();
    createSunlight();
}

/*======================================================
 SMART HINT SYSTEM
======================================================*/

let hintTimer = null;
let lastFoundTime = Date.now();

function resetHintTimer() {
    lastFoundTime = Date.now();
}

function startHintSystem() {
    if (hintTimer) clearInterval(hintTimer);

    hintTimer = setInterval(() => {
        const secondsIdle = (Date.now() - lastFoundTime) / 1000;
        if (secondsIdle >= 10) {
            showHint();
            lastFoundTime = Date.now();
        }
    }, 1000);
}

function showHint() {
    const remaining = hiddenItems.filter(item => !item.found);
    if (remaining.length === 0) return;

    const randomItem = remaining[Math.floor(Math.random() * remaining.length)];
    const scene = document.getElementById("campScene");
    if (!scene) return;

    const objects = scene.querySelectorAll(".collectible");
    objects.forEach(obj => {
        if (obj.dataset.item === randomItem.id) {
            obj.classList.add("hintGlow");
            setTimeout(() => { obj.classList.remove("hintGlow"); }, 2000);
        }
    });
}

/*======================================================
 SCORE & COMBO SYSTEM
======================================================*/

let score = 0;
let combo = 0;
let lastCollectTime = 0;

function addScore(points) {
    score += points;
    const scoreText = document.getElementById("score");
    if (scoreText) scoreText.innerHTML = score;
}

function updateCombo() {
    const now = Date.now();
    if (now - lastCollectTime <= 3000) {
        combo++;
    } else {
        combo = 1;
    }
    lastCollectTime = now;

    if (combo >= 2) {
        showCombo(combo);
        addScore(combo * 25);
    }
}

function showCombo(comboCount) {
    const comboText = document.createElement("div");
    comboText.className = "combo";
    comboText.innerHTML = "🔥 COMBO x" + comboCount;
    comboText.style.left = (window.innerWidth / 2 - 100) + "px";
    comboText.style.top = "180px";

    document.body.appendChild(comboText);
    setTimeout(() => { comboText.remove(); }, 1000);
}

function giveTimeBonus() {
    if (game.timer >= 40) {
        addScore(100);
        showBonus("⚡ Speed Bonus +100");
    }
}

function perfectBonus() {
    if (game.itemsFound === hiddenItems.length) {
        addScore(500);
        showBonus("🏆 Perfect Search +500");
    }
}

function showBonus(text) {
    const bonus = document.createElement("div");
    bonus.className = "floatingXP";
    bonus.innerHTML = text;
    bonus.style.left = "50%";
    bonus.style.top = "140px";
    bonus.style.transform = "translateX(-50%)";

    document.body.appendChild(bonus);
    setTimeout(() => { bonus.remove(); }, 1800);
}

/*======================================================
 MISSION TRANSITION & PHASE 2 LAUNCH
======================================================*/

function startMissionTransition() {
    const overlay = document.createElement("div");
    overlay.id = "missionOverlay";
    document.body.appendChild(overlay);

    overlay.innerHTML = `
        <div class="missionWindow">
            <h1>MISSION COMPLETE</h1>
            <h2>All Equipment Recovered</h2>
            <br>
            <p>Mission Control has received your report.</p>
            <p>A nearby lake has been detected.</p>
            <br>
            <h3>NEW OBJECTIVE</h3>
            <p>Catch 6 Special Fish.</p>
            <br>
            <button id="continueFishing">Continue →</button>
        </div>
    `;

    document.getElementById("continueFishing").addEventListener("click", startFishingIntro);
}

function startFishingIntro() {
    const overlay = document.getElementById("missionOverlay");
    if (overlay) overlay.classList.add("fadeOut");

    setTimeout(() => {
        if (overlay) overlay.remove();
        launchFishingMission();
    }, 1000);
}

function launchFishingMission() {
    const phase1Elem = document.getElementById("phase1");
    const phase2Elem = document.getElementById("phase2");

    if (phase1Elem) phase1Elem.style.display = "none";
    if (phase2Elem) {
        phase2Elem.classList.remove("hidden");
        phase2Elem.classList.add("fadeIn");
    }

    startFishing();
}

/*======================================================
 FISHING ENGINE
======================================================*/

const fishing = {
    score: 0,
    specialFish: 0,
    casts: 0,
    fishCaught: 0,
    timer: 60,
    casting: false,
    reeling: false,
    power: 0,
    direction: 1
};

let fishingInterval = null;
let powerInterval = null;

function startFishing() {
    fishing.timer = 60;
    fishing.score = 0;
    fishing.specialFish = 0;
    fishing.fishCaught = 0;
    fishing.casts = 0;
    fishing.casting = false;
    fishing.reeling = false;

    const bite = document.getElementById("bite");
    if (bite) bite.classList.add("hidden");

    const powerFill = document.getElementById("powerFill");
    if (powerFill) powerFill.style.width = "0%";

    const reelFill = document.getElementById("reelFill");
    if (reelFill) reelFill.style.width = "0%";

    const hook = document.getElementById("hook");
    if (hook) {
        hook.style.left = "50%";
        hook.style.top = "80%";
        hook.style.transition = "none";
    }

    updateFishingHUD();
    startFishingTimer();
    spawnFish();
}

function startFishingTimer() {
    clearInterval(fishingInterval);

    fishingInterval = setInterval(() => {
        fishing.timer--;
        updateFishingHUD();

        if (fishing.timer <= 0) {
            clearInterval(fishingInterval);
            finishFishingMission();
        }
    }, 1000);
}

function updateFishingHUD() {
    const timer = document.getElementById("fishingTimer");
    if (timer) timer.innerHTML = "00:" + String(fishing.timer).padStart(2, "0");

    const scoreElem = document.getElementById("fishScore");
    if (scoreElem) scoreElem.innerHTML = fishing.score;

    const caughtElem = document.getElementById("fishCaught");
    if (caughtElem) caughtElem.innerHTML = fishing.specialFish;
}

function startCasting() {
    if (fishing.casting || fishing.reeling) return;

    fishing.casting = true;
    fishing.power = 0;
    fishing.direction = 1;

    const meter = document.getElementById("powerFill");

    powerInterval = setInterval(() => {
        fishing.power += fishing.direction * 2;

        if (fishing.power >= 100) fishing.direction = -1;
        if (fishing.power <= 0) fishing.direction = 1;

        if (meter) meter.style.width = fishing.power + "%";
    }, 15);
}

function castLine() {
    if (!fishing.casting) return;

    fishing.casting = false;
    clearInterval(powerInterval);
    fishing.casts++;

    animateCast(fishing.power);
}

const castBtn = document.getElementById("castRod");
if (castBtn) {
    castBtn.addEventListener("mousedown", startCasting);
    castBtn.addEventListener("mouseup", castLine);

    castBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startCasting();
    });

    castBtn.addEventListener("touchend", (e) => {
        e.preventDefault();
        castLine();
    });
}

function animateCast(power) {
    const hook = document.getElementById("hook");
    if (!hook) return;

    hook.style.transition = "none";
    hook.style.left = "50%";
    hook.style.top = "80%";

    requestAnimationFrame(() => {
        hook.style.transition = "all 1s ease";
        hook.style.left = (20 + power * 0.5) + "%";
        hook.style.top = "45%";
    });

    setTimeout(() => {
        waitForFish();
    }, 1200);
}

function waitForFish() {
    const delay = 1000 + Math.random() * 2500;
    setTimeout(() => {
        fishBite();
    }, delay);
}

/*======================================================
 FISH AI & SPAWNING
======================================================*/

const fishTypes = [
    { id: "blue", points: 100, speed: 2, chance: 55 },
    { id: "gold", points: 300, speed: 3, chance: 25 },
    { id: "rainbow", points: 500, speed: 4, chance: 15 },
    { id: "heart", points: 1000, speed: 5, chance: 5 }
];

let currentFish = null;

function spawnFish() {
    const lake = document.getElementById("lake");
    if (!lake) return;

    if (currentFish) currentFish.remove();

    const fish = document.createElement("img");
    const type = randomFish();

    fish.dataset.type = type.id;
    fish.dataset.points = type.points;
    fish.src = "assets/fish/" + type.id + "Fish.png";
    fish.className = "fish";
    fish.style.top = (120 + Math.random() * 220) + "px";

    lake.appendChild(fish);
    currentFish = fish;

    swimFish(fish, type.speed);
}

function randomFish() {
    const roll = Math.random() * 100;
    let total = 0;

    for (const fish of fishTypes) {
        total += fish.chance;
        if (roll <= total) return fish;
    }
    return fishTypes[0];
}

function swimFish(fish, speed) {
    let x = -120;
    fish.style.left = x + "px";

    const swim = setInterval(() => {
        x += speed;
        fish.style.left = x + "px";

        if (x > window.innerWidth + 150) {
            clearInterval(swim);
            if (fish.parentNode) fish.remove();
            if (currentFish === fish) currentFish = null;
            setTimeout(spawnFish, 1000);
        }
    }, 16);
}

function fishBite() {
    fishing.reeling = true;
    const bite = document.getElementById("bite");
    if (bite) bite.classList.remove("hidden");

    const splash = document.getElementById("splashSound");
    if (splash) {
        splash.currentTime = 0;
        splash.play().catch(() => {});
    }

    setTimeout(() => {
        startReeling();
    }, 700);
}

function catchFish(fish) {
    const points = parseInt(fish.dataset.points);
    fishing.score += points;
    fishing.fishCaught++;
    fishing.specialFish++;

    updateFishingHUD();
    showBonus("+" + points);

    fish.classList.add("caught");

    setTimeout(() => {
        fish.remove();
        currentFish = null;
        spawnFish();
    }, 500);

    if (fishing.specialFish >= 6) {
        finishFishingMission();
    }
}

/*======================================================
 REEL MINI GAME
======================================================*/

let reelProgress = 0;
let fishFightInterval = null;

function startReeling() {
    if (!fishing.reeling) return;

    reelProgress = 0;
    const bar = document.getElementById("reelFill");
    if (bar) bar.style.width = "0%";

    clearInterval(fishFightInterval);

    fishFightInterval = setInterval(() => {
        reelProgress -= 2;
        if (reelProgress < 0) reelProgress = 0;
        if (bar) bar.style.width = reelProgress + "%";

        if (reelProgress <= 0) {
            fishEscaped();
        }
    }, 120);
}

document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;
    if (!fishing.reeling) return;

    reelProgress += 8;
    if (reelProgress > 100) reelProgress = 100;

    const bar = document.getElementById("reelFill");
    if (bar) bar.style.width = reelProgress + "%";

    if (reelProgress >= 100) {
        successfulCatch();
    }
});

function successfulCatch() {
    clearInterval(fishFightInterval);
    fishing.reeling = false;

    if (currentFish) catchFish(currentFish);

    showBonus("🎣 Perfect Catch!");

    const bite = document.getElementById("bite");
    if (bite) bite.classList.add("hidden");
}

function fishEscaped() {
    clearInterval(fishFightInterval);
    fishing.reeling = false;

    showBonus("💨 Fish Escaped!");

    if (currentFish) {
        currentFish.remove();
        currentFish = null;
    }

    setTimeout(() => { spawnFish(); }, 1000);

    const bite = document.getElementById("bite");
    if (bite) bite.classList.add("hidden");
}

/*======================================================
 END GAME & SUMMARY
======================================================*/

function finishFishingMission() {
    clearInterval(fishingInterval);
    clearInterval(fishFightInterval);

    const phase2Elem = document.getElementById("phase2");
    if (phase2Elem) phase2Elem.classList.add("fadeOut");

    setTimeout(() => {
        showMissionSummary();
    }, 1000);
}

function showMissionSummary() {
    const rank = calculateRank();
    const totalScore = score + fishing.score;

    const overlay = document.createElement("div");
    overlay.id = "summaryOverlay";
    document.body.appendChild(overlay);

    overlay.innerHTML = `
        <div class="summaryWindow">
            <h1>MISSION SUMMARY</h1>
            <h2>${rank}</h2>
            <p>Hidden Objects Score: ${score}</p>
            <p>Fishing Score: ${fishing.score}</p>
            <p><strong>Total Score: ${totalScore}</strong></p>
            <br>
            <button id="claimRewardBtn">Claim Reward →</button>
        </div>
    `;

    document.getElementById("claimRewardBtn").addEventListener("click", showBirthdayEnding);
}

function calculateRank() {
    const total = score + fishing.score;

    if (total >= 4500) return "🏆 Rank S";
    if (total >= 3500) return "🥇 Rank A";
    if (total >= 2500) return "🥈 Rank B";

    return "🥉 Rank C";
}

function showBirthdayEnding() {
    const summary = document.getElementById("summaryOverlay");
    if (summary) summary.remove();

    const ending = document.createElement("div");
    ending.id = "birthdayEnding";
    document.body.appendChild(ending);

    ending.innerHTML = `
        <div class="endingWindow">
            <h1>🎉 Congratulations Chief!</h1>
            <br>
            <h2>Mission 2 Completed Successfully</h2>
            <br>
            <p>
                Your determination,
                patience,
                and adventurous spirit
                have once again saved the day.
            </p>
            <br>
            <p>
                Another mission awaits...
                but not today.
            </p>
            <br>
            <h1>🔒 Mission 3</h1>
            <h2>LOCKED</h2>
            <p>
                Transmission will resume
                next week...
            </p>
            <br>
            <button onclick="location.reload()">
                Return to HQ
            </button>
        </div>
    `;
}

/*======================================================
 GAME INITIALIZATION
======================================================*/

window.onload = () => {
    console.log("Mission 2 Ready");
};
