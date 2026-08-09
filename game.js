class MissionAudioManager {
    constructor() {
        this.muted = false;
        this.sounds = {
            bg: new Audio('background.mp3'),
            bear: new Audio('bear.mp3'),
            collect: new Audio('collect.mp3'),
            reelWinding: new Audio('freesound_community-fishingrod-winding-92375.mp3'),
            fishPulling: new Audio('freesound_community-fly-reel-fish-pulling-saricione-94671.mp3'),
            lakeAmbience: new Audio('mindmist-fishing-on-the-lake-310740.mp3'),
            complete: new Audio('mission-complete.mp3'),
            whoosh: new Audio('spinopel-fishing-rod-whoosh-411640.mp3')
        };

        this.sounds.bg.loop = true;
        this.sounds.lakeAmbience.loop = true;
        this.sounds.reelWinding.loop = true;
        this.sounds.fishPulling.loop = true;

        this.sounds.bg.volume = 0.4;
        this.sounds.lakeAmbience.volume = 0.5;
        this.sounds.bear.volume = 0.8;
        this.sounds.complete.volume = 0.9;
    }

    play(name) {
        if (this.muted || !this.sounds[name]) return;
        if (name === 'reelWinding' || name === 'fishPulling') {
            if (this.sounds[name].paused) {
                this.sounds[name].currentTime = 0;
                this.sounds[name].play().catch(() => {});
            }
        } else {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(() => {});
        }
    }

    stop(name) {
        if (this.sounds[name]) this.sounds[name].pause();
    }

    stopAllLoops() {
        this.stop('bg');
        this.stop('lakeAmbience');
        this.stop('reelWinding');
        this.stop('fishPulling');
    }
}

const audio = new MissionAudioManager();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Game States: MISSION_START -> PHASE1_SEARCH -> PHASE2_TRANSITION -> PHASE2_AIM -> PHASE2_POWER -> PHASE2_WAITING -> PHASE2_HOOKED -> PHASE2_REELING -> MISSION_END
let state = 'MISSION_START';

let items = [];
let itemsCollected = 0;
const TOTAL_ITEMS = 10;
let bearDistance = 100;
const ITEM_NAMES = ['Flashlight', 'First Aid', 'Canteen', 'Matches', 'Map', 'Rope', 'Knife', 'Fuel', 'Compass', 'Flare'];

let fishCaught = 0;
const TARGET_FISH = 6;
let aimAngle = 0, aimDir = 1;
let castPower = 0, powerDir = 1;
let lineTension = 0, fishDistance = 0;
let lureX = 0, lureY = 0;
let reelActive = false;

const startOverlay = document.getElementById('start-overlay');
const phase2Overlay = document.getElementById('phase2-overlay');
const endOverlay = document.getElementById('end-overlay');
const startBtn = document.getElementById('start-btn');
const phase2Btn = document.getElementById('phase2-btn');
const restartBtn = document.getElementById('restart-btn');
const promptEl = document.getElementById('action-prompt');
const labelPrimary = document.getElementById('label-primary');
const valPrimary = document.getElementById('val-primary');
const labelSecondary = document.getElementById('label-secondary');
const valSecondary = document.getElementById('val-secondary');
const powerMeter = document.getElementById('power-container');
const powerBar = document.getElementById('power-bar');
const tensionContainer = document.getElementById('tension-container');
const tensionBar = document.getElementById('tension-bar');
const audioBtn = document.getElementById('audio-toggle');

audioBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    audioBtn.innerText = audio.muted ? "🔇 Audio: OFF" : "🔊 Audio: ON";
    if (audio.muted) {
        audio.stopAllLoops();
    } else if (state === 'PHASE1_SEARCH') {
        audio.play('bg');
    } else if (state.startsWith('PHASE2')) {
        audio.play('lakeAmbience');
    }
});

startBtn.addEventListener('click', () => {
    audio.play('collect');
    startOverlay.classList.add('hidden');
    startPhase1();
});

phase2Btn.addEventListener('click', () => {
    audio.play('collect');
    phase2Overlay.classList.add('hidden');
    startPhase2();
});

restartBtn.addEventListener('click', () => {
    audio.play('collect');
    endOverlay.classList.add('hidden');
    startPhase1();
});

function startPhase1() {
    audio.stopAllLoops();
    audio.play('bg');

    state = 'PHASE1_SEARCH';
    itemsCollected = 0;
    bearDistance = 100;
    powerMeter.classList.add('hidden');
    tensionContainer.classList.add('hidden');

    labelPrimary.innerText = "Supplies Found";
    valPrimary.innerText = `0 / ${TOTAL_ITEMS}`;
    labelSecondary.innerText = "Bear Proximity";
    valSecondary.innerText = `100m`;
    promptEl.innerText = "MISSION 2 - PHASE 1: FIND 10 CAMPSITE SUPPLIES";

    items = [];
    for (let i = 0; i < TOTAL_ITEMS; i++) {
        items.push({
            name: ITEM_NAMES[i],
            x: 100 + Math.random() * (width - 200),
            y: 140 + Math.random() * (height - 280),
            radius: 16,
            collected: false
        });
    }
}

function startPhase2() {
    audio.stopAllLoops();
    audio.play('lakeAmbience');

    state = 'PHASE2_AIM';
    fishCaught = 0;
    aimAngle = 0;
    castPower = 0;
    lineTension = 0;

    powerMeter.classList.add('hidden');
    tensionContainer.classList.remove('hidden');

    labelPrimary.innerText = "Fish Caught";
    valPrimary.innerText = `0 / ${TARGET_FISH}`;
    labelSecondary.innerText = "Target Distance";
    valSecondary.innerText = `0.0m`;
    promptEl.innerText = "MISSION 2 - PHASE 2: CLICK TO LOCK CAST AIM";
}

window.addEventListener('pointerdown', (e) => {
    if (e.target.tagName === 'BUTTON' || state === 'MISSION_START' || state === 'MISSION_END') return;

    if (state === 'PHASE1_SEARCH') {
        items.forEach(item => {
            if (!item.collected) {
                let dist = Math.hypot(e.clientX - item.x, e.clientY - item.y);
                if (dist < item.radius + 12) {
                    item.collected = true;
                    itemsCollected++;
                    audio.play('collect');
                    valPrimary.innerText = `${itemsCollected} / ${TOTAL_ITEMS}`;
                    
                    if (itemsCollected >= TOTAL_ITEMS) {
                        state = 'PHASE2_TRANSITION';
                        audio.stop('bg');
                        phase2Overlay.classList.remove('hidden');
                    }
                }
            }
        });
    } else if (state === 'PHASE2_AIM') {
        audio.play('collect');
        state = 'PHASE2_POWER';
        powerMeter.classList.remove('hidden');
        promptEl.innerText = "MISSION 2 - PHASE 2: CLICK TO LOCK CAST POWER";
    } else if (state === 'PHASE2_POWER') {
        audio.play('whoosh');
        state = 'PHASE2_WAITING';
        powerMeter.classList.add('hidden');
        fishDistance = 22 + (castPower * 0.42);
        lureX = (width / 2) + (aimAngle * (width * 0.35));
        lureY = height * (0.8 - (castPower / 100) * 0.35);
        promptEl.innerText = "WAITING FOR A FISH TO BITE...";
        setTimeout(triggerBite, 2200 + Math.random() * 2500);
    } else if (state === 'PHASE2_HOOKED') {
        audio.play('fishPulling');
        state = 'PHASE2_REELING';
        promptEl.innerText = "HOLD LEFT CLICK / SPACEBAR TO REEL IN!";
    }
});

window.addEventListener('mousedown', () => { if (state === 'PHASE2_REELING') reelActive = true; });
window.addEventListener('mouseup', () => { reelActive = false; audio.stop('reelWinding'); });
window.addEventListener('keydown', (e) => { if (e.code === 'Space' && state === 'PHASE2_REELING') reelActive = true; });
window.addEventListener('keyup', (e) => { if (e.code === 'Space') { reelActive = false; audio.stop('reelWinding'); } });

function triggerBite() {
    if (state !== 'PHASE2_WAITING') return;
    state = 'PHASE2_HOOKED';
    audio.play('fishPulling');
    promptEl.innerText = "FISH STRIKE! CLICK TO HOOK!";
}

let lastTime = performance.now();
function gameLoop(now) {
    let dt = (now - lastTime) / 1000;
    lastTime = now;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    if (state === 'PHASE1_SEARCH') {
        bearDistance -= 2.2 * dt;
        valSecondary.innerText = `${Math.max(0, bearDistance).toFixed(0)}m`;

        if (bearDistance <= 0) {
            audio.stopAllLoops();
            audio.play('bear');
            state = 'MISSION_END';
            document.getElementById('end-title').innerText = "MISSION 2 FAILED!";
            document.getElementById('end-desc').innerText = "The bear reached the campsite before you collected all supplies.";
            endOverlay.classList.remove('hidden');
        }
    }

    if (state === 'PHASE2_AIM') {
        aimAngle += aimDir * 1.5 * dt;
        if (aimAngle > 1) aimDir = -1;
        if (aimAngle < -1) aimDir = 1;
    }

    if (state === 'PHASE2_POWER') {
        castPower += powerDir * 110 * dt;
        if (castPower > 100) powerDir = -1;
        if (castPower < 0) powerDir = 1;
        powerBar.style.height = `${castPower}%`;
    }

    if (state === 'PHASE2_REELING') {
        if (reelActive) {
            audio.play('reelWinding');
            lineTension = Math.min(100, lineTension + 46 * dt);
            fishDistance -= 8.2 * dt;
        } else {
            audio.stop('reelWinding');
            lineTension = Math.max(0, lineTension - 32 * dt);
            fishDistance += 2.2 * dt;
        }

        valSecondary.innerText = `${Math.max(0, fishDistance).toFixed(1)}m`;
        tensionBar.style.height = `${lineTension}%`;

        if (lineTension >= 100) {
            audio.stop('reelWinding');
            audio.stop('fishPulling');
            lineTension = 0;
            promptEl.innerText = "LINE SNAPPED! RE-AIM AND CAST...";
            state = 'PHASE2_AIM';
        } else if (fishDistance <= 2) {
            audio.stop('reelWinding');
            audio.stop('fishPulling');
            audio.play('collect');
            fishCaught++;
            valPrimary.innerText = `${fishCaught} / ${TARGET_FISH}`;

            if (fishCaught >= TARGET_FISH) {
                audio.stopAllLoops();
                audio.play('complete');
                state = 'MISSION_END';
                document.getElementById('end-title').innerText = "MISSION 2 ACCOMPLISHED!";
                document.getElementById('end-desc').innerText = "You successfully completed both Phase 1 and Phase 2!";
                endOverlay.classList.remove('hidden');
            } else {
                promptEl.innerText = `FISH LANDED! (${fishCaught}/${TARGET_FISH}) - RE-AIM FOR NEXT CAST`;
                state = 'PHASE2_AIM';
            }
        }
    }
}

function render() {
    if (state === 'PHASE1_SEARCH') {
        let bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#132219');
        bgGrad.addColorStop(1, '#09120c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2 - 50);
        ctx.lineTo(width / 2 - 70, height / 2 + 50);
        ctx.lineTo(width / 2 + 70, height / 2 + 50);
        ctx.fill();

        ctx.fillStyle = '#ff7043';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 + 90, 18, 0, Math.PI * 2);
        ctx.fill();

        items.forEach(item => {
            if (!item.collected) {
                ctx.fillStyle = '#ffd54f';
                ctx.beginPath();
                ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = '#000000';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(item.name[0], item.x, item.y + 3);
            }
        });
    }

    if (state.startsWith('PHASE2')) {
        let bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0d1b2a');
        bgGrad.addColorStop(0.5, '#08121e');
        bgGrad.addColorStop(1, '#02060c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        if (state === 'PHASE2_AIM' || state === 'PHASE2_POWER') {
            let originX = width / 2;
            let originY = height;
            let targetX = originX + (aimAngle * (width * 0.35));
            let targetY = height * (0.8 - (castPower / 100) * 0.35);

            ctx.strokeStyle = '#4fc3f7';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        if (state === 'PHASE2_WAITING' || state === 'PHASE2_HOOKED' || state === 'PHASE2_REELING') {
            ctx.strokeStyle = lineTension > 75 ? '#ff5252' : '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width / 2, height);
            let sag = (100 - lineTension) * 0.5;
            ctx.quadraticCurveTo(width / 2, lureY + sag, lureX, lureY);
            ctx.stroke();

            ctx.fillStyle = '#81d4fa';
            ctx.beginPath();
            ctx.arc(lureX, lureY, 7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

requestAnimationFrame(gameLoop);
