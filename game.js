/* ==========================================
   OPERATION BIRTHDAY 30: MISSION 02 - GAME JS
   ========================================== */

// Game State Configuration & Variables
const GAME_CONFIG = {
    phase1Time: 60, // seconds
    fishingTime: 60,
    totalItems: 8
};

let gameState = {
    currentPhase: 1, // 1: Campsite Search, 2: Fishing Mini-game
    timeRemaining: GAME_CONFIG.phase1Time,
    xp: 0,
    score: 0,
    fishCaught: 0,
    bearDistance: 95, // meters
    bearProgressPercent: 0,
    itemsFound: 0,
    isPaused: false,
    gameInterval: null
};

// Item List matching index.html inventoryPanel slots
let items = [
    { name: 'Torchlight', collected: false, x: 150, y: 200, width: 40, height: 40 },
    { name: 'Compass', collected: false, x: 300, y: 350, width: 40, height: 40 },
    { name: 'Boots', collected: false, x: 500, y: 250, width: 40, height: 40 },
    { name: 'Bottle', collected: false, x: 650, y: 400, width: 40, height: 40 },
    { name: 'Fishing Rod', collected: false, x: 200, y: 450, width: 40, height: 40 },
    { name: 'Map', collected: false, x: 400, y: 150, width: 40, height: 40 },
    { name: 'Camera', collected: false, x: 700, y: 200, width: 40, height: 40 },
    { name: 'Key', collected: false, x: 550, y: 480, width: 40, height: 40 } // Adjusted key position for visibility & easier clickability
];

// Assets Loader Placeholder
let assets = {
    campsiteBg: new Image(),
    lakeBg: new Image()
};

assets.campsiteBg.src = 'assets/backgrounds/campsite.png';
assets.lakeBg.src = 'assets/backgrounds/lake.png';

// DOM Elements Reference
const screens = {
    loading: document.getElementById('loadingScreen'),
    intro: document.getElementById('introScreen'),
    hud: document.getElementById('gameHUD'),
    container: document.getElementById('gameContainer'),
    canvas: document.getElementById('gameCanvas'),
    fishingCanvas: document.getElementById('fishingCanvas'),
    phase1Complete: document.getElementById('phase1Complete'),
    phase2: document.getElementById('phase2'),
    missionComplete: document.getElementById('missionComplete'),
    inventoryPanel: document.getElementById('inventoryPanel')
};

const hudElements = {
    timer: document.getElementById('timer'),
    xp: document.getElementById('xp'),
    score: document.getElementById('score'),
    bearProgress: document.getElementById('bearProgress'),
    bearProximityText: document.getElementById('bearProximityText'),
    itemsFoundText: document.getElementById('itemsFoundText'),
    hintButton: document.getElementById('hintButton')
};

// Initialization on Window Load
window.addEventListener('load', () => {
    // Hide loading, show intro
    setTimeout(() => {
        screens.loading.classList.add('hidden');
        screens.intro.classList.remove('hidden');
    }, 500);

    document.getElementById('startMission').addEventListener('click', startGame);
    document.getElementById('continueFishing').addEventListener('click', startFishingPhase);
    document.getElementById('replayMission').addEventListener('click', resetGame);
    
    // Canvas click handler for finding hidden items
    screens.canvas.addEventListener('click', handleCanvasClick);
});

function startGame() {
    screens.intro.classList.add('hidden');
    screens.hud.classList.remove('hidden');
    screens.inventoryPanel.classList.remove('hidden');
    
    initCanvasSize();
    startTimer();
    gameLoop();
}

function initCanvasSize() {
    screens.canvas.width = screens.container.clientWidth;
    screens.canvas.height = screens.container.clientHeight;
}

function startTimer() {
    gameState.gameInterval = setInterval(() => {
        if (gameState.isPaused) return;

        gameState.timeRemaining--;
        updateHUD();

        // Advance Bear Closer over time
        if (gameState.currentPhase === 1) {
            gameState.bearDistance = Math.max(0, 95 - Math.floor((60 - gameState.timeRemaining) * (95 / 60)));
            gameState.bearProgressPercent = Math.min(100, ((60 - gameState.timeRemaining) / 60) * 100);
        }

        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.gameInterval);
            if (gameState.currentPhase === 1) {
                endPhase1();
            } else {
                endMission();
            }
        }
    }, 1000);
}

function updateHUD() {
    let minutes = Math.floor(gameState.timeRemaining / 60);
    let seconds = gameState.timeRemaining % 60;
    hudElements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    hudElements.xp.textContent = gameState.xp;
    hudElements.score.textContent = gameState.score;
    hudElements.bearProgress.style.width = `${gameState.bearProgressPercent}%`;
    hudElements.bearProximityText.textContent = `${gameState.bearDistance}m`;
    hudElements.itemsFoundText.textContent = `${gameState.itemsFound} / ${GAME_CONFIG.totalItems}`;
}

function gameLoop() {
    if (gameState.currentPhase !== 1) return;

    const ctx = screens.canvas.getContext('2d');
    ctx.clearRect(0, 0, screens.canvas.width, screens.canvas.height);

    // Draw Campsite Background Image or Fallback Gradient
    if (assets.campsiteBg.complete && assets.campsiteBg.naturalWidth !== 0) {
        ctx.drawImage(assets.campsiteBg, 0, 0, screens.canvas.width, screens.canvas.height);
    } else {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, screens.canvas.width, screens.canvas.height);
    }

    // Draw uncollected items with subtle pulses or highlights to make them discoverable (including the key)
    items.forEach(item => {
        if (!item.collected) {
            ctx.fillStyle = 'rgba(57, 217, 255, 0.4)';
            ctx.strokeStyle = '#39d9ff';
            ctx.lineWidth = 2;
            ctx.fillRect(item.x, item.y, item.width, item.height);
            ctx.strokeRect(item.x, item.y, item.width, item.height);

            // Label text above item box for identification
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px monospace';
            ctx.fillText(item.name, item.x, item.y - 5);
        }
    });

    requestAnimationFrame(gameLoop);
}

function handleCanvasClick(event) {
    if (gameState.currentPhase !== 1) return;

    const rect = screens.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    items.forEach(item => {
        if (!item.collected &&
            clickX >= item.x && clickX <= item.x + item.width &&
            clickY >= item.y && clickY <= item.y + item.height) {
            
            item.collected = true;
            gameState.itemsFound++;
            gameState.xp += 50;
            gameState.score += 100;

            // Update matching inventory DOM slot
            const slots = document.querySelectorAll('.inventorySlot');
            slots.forEach(slot => {
                if (slot.querySelector('p').textContent.toLowerCase() === item.name.toLowerCase()) {
                    slot.classList.add('collected');
                }
            });

            updateHUD();

            if (gameState.itemsFound === GAME_CONFIG.totalItems) {
                clearInterval(gameState.gameInterval);
                endPhase1();
            }
        }
    });
}

function endPhase1() {
    screens.canvas.classList.add('hidden');
    document.getElementById('phase1XP').textContent = gameState.xp;
    screens.phase1Complete.classList.remove('hidden');
}

function startFishingPhase() {
    gameState.currentPhase = 2;
    gameState.timeRemaining = GAME_CONFIG.fishingTime;
    screens.phase1Complete.classList.add('hidden');
    screens.fishingCanvas.classList.remove('hidden');
    screens.phase2.classList.remove('hidden');

    startTimer();
}

function endMission() {
    screens.phase2.classList.add('hidden');
    document.getElementById('finalXP').textContent = gameState.xp;
    screens.missionComplete.classList.remove('hidden');
}

function resetGame() {
    window.location.reload();
}
