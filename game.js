/* ==========================================
   OPERATION BIRTHDAY 30: MISSION 02 - GAME JS
   ========================================== */

const GAME_CONFIG = {
    phase1Time: 60,
    fishingTime: 60,
    totalItems: 8
};

let gameState = {
    currentPhase: 1, // 1: Campsite, 2: Fishing
    timeRemaining: GAME_CONFIG.phase1Time,
    xp: 0,
    score: 0,
    fishCaught: 0,
    bearDistance: 95,
    bearProgressPercent: 0,
    itemsFound: 0,
    isPaused: false,
    gameInterval: null
};

// Item list matching index.html inventoryPanel slots with accurate coordinates for campsite.png
let items = [
    { name: 'Torchlight', collected: false, x: 140, y: 440, width: 45, height: 45 },
    { name: 'Compass', collected: false, x: 310, y: 520, width: 45, height: 45 },
    { name: 'Boots', collected: false, x: 480, y: 490, width: 45, height: 45 },
    { name: 'Bottle', collected: false, x: 620, y: 560, width: 45, height: 45 },
    { name: 'Fishing Rod', collected: false, x: 230, y: 620, width: 45, height: 45 },
    { name: 'Map', collected: false, x: 420, y: 380, width: 45, height: 45 },
    { name: 'Camera', collected: false, x: 740, y: 480, width: 45, height: 45 },
    { name: 'Key', collected: false, x: 550, y: 640, width: 45, height: 45 }
];

let assets = {
    campsiteBg: new Image(),
    lakeBg: new Image()
};

assets.campsiteBg.src = 'assets/backgrounds/campsite.png';
assets.lakeBg.src = 'assets/backgrounds/lake.png';

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
    timer: document.getElementById('timer') || document.getElementById('timerDisplay'),
    xp: document.getElementById('xp'),
    score: document.getElementById('score'),
    bearProgress: document.getElementById('bearProgress'),
    bearProximityText: document.getElementById('bearProximityText'),
    itemsFoundText: document.getElementById('itemsFoundText')
};

window.addEventListener('load', () => {
    setTimeout(() => {
        if (screens.loading) screens.loading.classList.add('hidden');
        if (screens.intro) screens.intro.classList.remove('hidden');
    }, 400);

    const startBtn = document.getElementById('startMission');
    if (startBtn) startBtn.addEventListener('click', startGame);

    const continueBtn = document.getElementById('continueFishing');
    if (continueBtn) continueBtn.addEventListener('click', startFishingPhase);

    const replayBtn = document.getElementById('replayMission');
    if (replayBtn) replayBtn.addEventListener('click', resetGame);
    
    if (screens.canvas) screens.canvas.addEventListener('click', handleCanvasClick);
    
    const castRodBtn = document.getElementById('castRod');
    if (castRodBtn) castRodBtn.addEventListener('click', handleCastRod);
});

function startGame() {
    if (screens.intro) screens.intro.classList.add('hidden');
    if (screens.hud) screens.hud.classList.remove('hidden');
    if (screens.inventoryPanel) screens.inventoryPanel.classList.remove('hidden');
    
    initCanvasSize();
    startTimer();
    requestAnimationFrame(mainGameLoop);
}

function initCanvasSize() {
    if (screens.canvas && screens.container) {
        screens.canvas.width = screens.container.clientWidth;
        screens.canvas.height = screens.container.clientHeight;
    }
    if (screens.fishingCanvas && screens.container) {
        screens.fishingCanvas.width = screens.container.clientWidth;
        screens.fishingCanvas.height = screens.container.clientHeight;
    }
}

function startTimer() {
    if (gameState.gameInterval) clearInterval(gameState.gameInterval);
    
    gameState.gameInterval = setInterval(() => {
        if (gameState.isPaused) return;

        gameState.timeRemaining--;
        updateHUD();

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
    let timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (hudElements.timer) hudElements.timer.textContent = timeStr;
    if (hudElements.xp) hudElements.xp.textContent = gameState.xp;
    if (hudElements.score) hudElements.score.textContent = gameState.score;
    if (hudElements.bearProgress) hudElements.bearProgress.style.width = `${gameState.bearProgressPercent}%`;
    if (hudElements.bearProximityText) hudElements.bearProximityText.textContent = `${gameState.bearDistance}m`;
    if (hudElements.itemsFoundText) hudElements.itemsFoundText.textContent = `${gameState.itemsFound} / ${GAME_CONFIG.totalItems}`;
}

function mainGameLoop() {
    if (gameState.currentPhase === 1) {
        renderCampsite();
    } else if (gameState.currentPhase === 2) {
        renderFishing();
    }
    requestAnimationFrame(mainGameLoop);
}

function renderCampsite() {
    const ctx = screens.canvas.getContext('2d');
    ctx.clearRect(0, 0, screens.canvas.width, screens.canvas.height);

    if (assets.campsiteBg.complete && assets.campsiteBg.naturalWidth !== 0) {
        ctx.drawImage(assets.campsiteBg, 0, 0, screens.canvas.width, screens.canvas.height);
    } else {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, screens.canvas.width, screens.canvas.height);
    }

    // Render interactive items cleanly without solid blocking backgrounds (transparent / subtle outline on hover/state)
    items.forEach(item => {
        if (!item.collected) {
            ctx.strokeStyle = 'rgba(57, 217, 255, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(item.x, item.y, item.width, item.height);

            ctx.fillStyle = 'rgba(57, 217, 255, 0.15)';
            ctx.fillRect(item.x, item.y, item.width, item.height);

            ctx.fillStyle = '#ffffff';
            ctx.font = '10px monospace';
            ctx.fillText(item.name, item.x, item.y - 4);
        }
    });
}

function renderFishing() {
    const ctx = screens.fishingCanvas.getContext('2d');
    ctx.clearRect(0, 0, screens.fishingCanvas.width, screens.fishingCanvas.height);

    if (assets.lakeBg.complete && assets.lakeBg.naturalWidth !== 0) {
        ctx.drawImage(assets.lakeBg, 0, 0, screens.fishingCanvas.width, screens.fishingCanvas.height);
    } else {
        ctx.fillStyle = '#0b1329';
        ctx.fillRect(0, 0, screens.fishingCanvas.width, screens.fishingCanvas.height);
        
        ctx.strokeStyle = 'rgba(57, 217, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 50; i < screens.fishingCanvas.height; i += 80) {
            ctx.moveTo(0, i);
            ctx.lineTo(screens.fishingCanvas.width, i);
        }
        ctx.stroke();
    }
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

            const slots = document.querySelectorAll('.inventorySlot');
            slots.forEach(slot => {
                const p = slot.querySelector('p');
                if (p && p.textContent.toLowerCase() === item.name.toLowerCase()) {
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

function handleCastRod() {
    gameState.fishCaught++;
    gameState.score += 150;
    gameState.xp += 50;
    
    const fishCaughtElem = document.getElementById('fishCaught');
    const fishScoreElem = document.getElementById('fishScore');
    if (fishCaughtElem) fishCaughtElem.textContent = gameState.fishCaught;
    if (fishScoreElem) fishScoreElem.textContent = gameState.score;

    if (gameState.fishCaught >= 6) {
        clearInterval(gameState.gameInterval);
        endMission();
    }
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
