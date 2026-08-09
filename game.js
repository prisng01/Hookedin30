"use strict";
if (window.__OPERATION_BIRTHDAY_MISSION_2_LOADED) {
console.warn(
"Mission 2 game.js already loaded. Skipping duplicate initialisation."
);
} else {
window.__OPERATION_BIRTHDAY_MISSION_2_LOADED = true;
(() => {
const game = {
phase: 0,
xp: 0,
score: 0,
timer: 60,
fishingTimer: 60,
itemsFound: 0,
totalItems: 10,
fishCaught: 0,
targetFish: 6,
bearProgress: 100,
missionActive: false,
fishingActive: false
};
const ITEM_KEYS = [
"tent",
"backpack",
"torchlight",
"compass",
"boots",
"bottle",
"fishingRod",
"map",
"camera",
"key"
];
const itemNames = {
tent: "Tent",
backpack: "Backpack",
torchlight: "Torchlight",
compass: "Compass",
boots: "Boots",
bottle: "Bottle",
fishingRod: "Fishing Rod",
map: "Map",
camera: "Camera",
key: "Key"
};
let items = [];
const campCanvas =
document.getElementById(
"gameCanvas"
);
const campCtx =
campCanvas
? campCanvas.getContext("2d")
: null;
const fishingCanvas =
document.getElementById(
"fishingCanvas"
);
const fishingCtx =
fishingCanvas
? fishingCanvas.getContext("2d")
: null;
let campWidth = 0;
let campHeight = 0;
let fishingWidth = 0;
let fishingHeight = 0;
const loadingScreen =
document.getElementById(
"loadingScreen"
);
const introScreen =
document.getElementById(
"introScreen"
);
const gameHUD =
document.getElementById(
"gameHUD"
);
const inventoryPanel =
document.getElementById(
"inventoryPanel"
);
const phase1 =
document.getElementById(
"phase1"
);
const phase1Complete =
document.getElementById(
"phase1Complete"
);
const phase2 =
document.getElementById(
"phase2"
);
const missionComplete =
document.getElementById(
"missionComplete"
);
const terminal =
document.getElementById(
"terminal"
);
const startMissionButton =
document.getElementById(
"startMission"
);
const continueFishing =
document.getElementById(
"continueFishing"
);
const replayMission =
document.getElementById(
"replayMission"
);
const timerText =
document.getElementById(
"timer"
);
const xpText =
document.getElementById(
"xp"
);
const scoreText =
document.getElementById(
"score"
);
const bearProgress =
document.getElementById(
"bearProgress"
);
const objectiveText =
document.getElementById(
"objectiveText"
);
const phase1XP =
document.getElementById(
"phase1XP"
);
const fishCaughtText =
document.getElementById(
"fishCaught"
);
const fishingTimerText =
document.getElementById(
"fishingTimer"
);
const fishScoreText =
document.getElementById(
"fishScore"
);
const powerFill =
document.getElementById(
"powerFill"
);
const reelFill =
document.getElementById(
"reelFill"
);
const castRod =
document.getElementById(
"castRod"
);
const bite =
document.getElementById(
"bite"
);
const hook =
document.getElementById(
"hook"
);
const bgMusic =
document.getElementById(
"bgMusic"
);
const collectSound =
document.getElementById(
"collectSound"
);
const splashSound =
document.getElementById(
"splashSound"
);
const successSound =
document.getElementById(
"successSound"
);
const bearSound =
document.getElementById(
"bearSound"
);
function loadImage(src) {
const image =
new Image();
image.src = src;
image.onerror =
() => {
console.warn(
"Unable to load image:",
src
);
};
return image;
}
const assets = {
campsite:
loadImage(
"assets/backgrounds/campsite.png"
),
lake:
loadImage(
"assets/backgrounds/lake.png"
),
items: {
tent:
loadImage(
"assets/items/tent.png"
),
backpack:
loadImage(
"assets/items/backpack.png"
),
torchlight:
loadImage(
"assets/items/torchlight.png"
),
compass:
loadImage(
"assets/items/compass.png"
),
boots:
loadImage(
"assets/items/boots.png"
),
bottle:
loadImage(
"assets/items/bottle.png"
),
fishingRod:
loadImage(
"assets/items/fishingRod.png"
),
map:
loadImage(
"assets/items/map.png"
),
camera:
loadImage(
"assets/items/camera.png"
),
key:
loadImage(
"assets/items/key.png"
)
},
fish: {
goldFish:
loadImage(
"assets/fish/goldFish_2.png"
),
heartFish:
loadImage(
"assets/fish/heartFish_2.png"
),
rainbowFish:
loadImage(
"assets/fish/rainbowFish.png"
)
}
};
let phase1Interval =
null;
let fishingInterval =
null;
let fishingState =
"IDLE";
let aimAngle =
0;
let aimDirection =
1;
let castPower =
0;
let castDirection =
1;
let fishDistance =
0;
let lineTension =
0;
let reelActive =
false;
let lureX =
0;
let lureY =
0;
let currentFish =
"goldFish";
let fishBiteTimeout =
null;
let rodAngle =
-0.72;
let rodTargetAngle =
-0.72;
let rodKick =
0;
let reelRotation =
0;
function show(element) {
if (!element) {
return;
}
element.classList.remove(
"hidden"
);
}
function hide(element) {
if (!element) {
return;
}
element.classList.add(
"hidden"
);
}
function playSound(sound) {
if (!sound) {
return;
}
try {
sound.currentTime =
0;
sound.play().catch(
() => {}
);
} catch (error) {
console.warn(
"Audio error:",
error
);
}
}
function stopSound(sound) {
if (!sound) {
return;
}
try {
sound.pause();
} catch (error) {
}
}
function resizeCanvases() {
if (campCanvas) {
campWidth =
campCanvas.width =
window.innerWidth;
campHeight =
campCanvas.height =
window.innerHeight;
}
if (fishingCanvas) {
fishingWidth =
fishingCanvas.width =
window.innerWidth;
fishingHeight =
fishingCanvas.height =
window.innerHeight;
}
}
window.addEventListener(
"resize",
resizeCanvases
);
resizeCanvases();
function updateMainHUD() {
if (timerText) {
const seconds =
Math.max(
0,
Math.ceil(
game.timer
)
);
timerText.innerText =
"00:" +
String(
seconds
).padStart(
2,
"0"
);
}
if (xpText) {
xpText.innerText =
game.xp;
}
if (scoreText) {
scoreText.innerText =
game.score;
}
if (bearProgress) {
const progress =
Math.max(
0,
Math.min(
100,
game.bearProgress
)
);
bearProgress.style.width =
progress +
"%";
}
}
function updateFishingHUD() {
if (fishCaughtText) {
fishCaughtText.innerText =
game.fishCaught;
}
if (fishingTimerText) {
const seconds =
Math.max(
0,
Math.ceil(
game.fishingTimer
)
);
fishingTimerText.innerText =
"00:" +
String(
seconds
).padStart(
2,
"0"
);
}
if (fishScoreText) {
fishScoreText.innerText =
game.score;
}
if (powerFill) {
powerFill.style.width =
castPower +
"%";
}
if (reelFill) {
reelFill.style.width =
lineTension +
"%";
}
}
function showPhase1() {
hide(introScreen);
hide(phase1Complete);
hide(phase2);
hide(missionComplete);
show(phase1);
show(gameHUD);
show(inventoryPanel);
}
function startMission() {
stopSound(
bgMusic
);
if (bgMusic) {
bgMusic.currentTime =
0;
bgMusic.play().catch(
() => {}
);
}
game.phase =
1;
game.missionActive =
true;
game.fishingActive =
false;
game.xp =
0;
game.score =
0;
game.timer =
60;
game.itemsFound =
0;
game.bearProgress =
100;
game.fishCaught =
0;
showPhase1();
if (objectiveText) {
objectiveText.innerText =
"Recover all hidden camping equipment.";
}
updateMainHUD();
createCampsiteItems();
startPhase1Timer();
renderCampsite();
}
function createCampsiteItems() {
const positions = [
{
key: "tent",
x: 0.16,
y: 0.32,
scale: 2.20
},
{
key: "backpack",
x: 0.36,
y: 0.27,
scale: 0.85
},
{
key: "torchlight",
x: 0.58,
y: 0.34,
scale: 0.65
},
{
key: "compass",
x: 0.24,
y: 0.52,
scale: 0.55
},
{
key: "boots",
x: 0.45,
y: 0.59,
scale: 0.72
},
{
key: "bottle",
x: 0.69,
y: 0.48,
scale: 0.65
},
{
key: "fishingRod",
x: 0.79,
y: 0.28,
scale: 0.75
},
{
key: "map",
x: 0.54,
y: 0.70,
scale: 0.65
},
{
key: "camera",
x: 0.30,
y: 0.72,
scale: 0.65
},
{
key: "key",
x: 0.84,
y: 0.67,
scale: 0.50
}
];
items =
positions.map(
position => ({
key:
position.key,
name:
itemNames[
position.key
],
x:
position.x,
y:
position.y,
scale:
position.scale,
collected:
false
})
);
updateInventory();
}
function updateInventory() {
const slots =
document.querySelectorAll(
".inventorySlot"
);
slots.forEach(
(slot, index) => {
slot.classList.remove(
"collected"
);
if (
items[index] &&
items[index].collected
) {
slot.classList.add(
"collected"
);
}
}
);
}
function renderCampsite() {
if (!campCanvas || !campCtx) {
return;
}
campCtx.clearRect(
0,
0,
campWidth,
campHeight
);
if (
assets.campsite.complete &&
assets.campsite.naturalWidth > 0
) {
campCtx.save();
campCtx.filter = "brightness(1.35) saturate(1.10)";
campCtx.drawImage(
assets.campsite,
0,
0,
campWidth,
campHeight
);
campCtx.restore();
} else {
campCtx.fillStyle =
"#102018";
campCtx.fillRect(
0,
0,
campWidth,
campHeight
);
}
items.forEach(
item => {
if (item.collected) {
return;
}
drawCampsiteItem(
item
);
}
);
if (game.phase === 1) {
requestAnimationFrame(
renderCampsite
);
}
}
function drawCampsiteItem(item) {
if (!campCtx) {
return;
}
   const image =
assets.items[
item.key
];
if (
!image ||
!image.complete ||
image.naturalWidth === 0
) {
return;
}
const x =
campWidth *
item.x;
const y =
campHeight *
item.y;
const baseSize =
Math.min(
campWidth,
campHeight
) * 0.065;
const width =
baseSize *
item.scale;
const height =
baseSize *
item.scale;
campCtx.save();
campCtx.globalAlpha =
0.92;
campCtx.filter =
"brightness(1.55) saturate(1.12)";
campCtx.imageSmoothingEnabled =
true;
campCtx.drawImage(
image,
x - width / 2,
y - height / 2,
width,
height
);
campCtx.restore();
}
function handleCampsiteClick(event) {
if (
game.phase !== 1 ||
!game.missionActive
) {
return;
}
const rect =
campCanvas.getBoundingClientRect();
const scaleX =
campCanvas.width /
rect.width;
const scaleY =
campCanvas.height /
rect.height;
const clickX =
(
event.clientX -
rect.left
) *
scaleX;
const clickY =
(
event.clientY -
rect.top
) *
scaleY;
let collectedItem =
null;
for (
let i = items.length - 1;
i >= 0;
i--
) {
const item =
items[i];
if (item.collected) {
continue;
}
const x =
campWidth *
item.x;
const y =
campHeight *
item.y;
const baseSize =
Math.min(
campWidth,
campHeight
) * 0.065;
const width =
baseSize *
item.scale;
const height =
baseSize *
item.scale;
const left =
x -
width / 2;
const right =
x +
width / 2;
const top =
y -
height / 2;
const bottom =
y +
height / 2;
if (
clickX >= left &&
clickX <= right &&
clickY >= top &&
clickY <= bottom
) {
collectedItem =
item;
break;
}
}
if (collectedItem) {
collectItem(
collectedItem
);
}
}
function collectItem(item) {
if (
!item ||
item.collected
) {
return;
}
item.collected =
true;
game.itemsFound++;
game.xp += 50;
game.score += 100;
updateInventory();
updateMainHUD();
playSound(
collectSound
);
showCollectionEffect(
item
);
if (
game.itemsFound >=
game.totalItems
) {
setTimeout(
() => {
completePhase1();
},
500
);
}
}
function showCollectionEffect(item) {
if (
!campCtx ||
!item
) {
return;
}
const x =
campWidth *
item.x;
const y =
campHeight *
item.y;
let frame =
0;
const totalFrames =
24;
function animateCollection() {
if (!campCtx) {
return;
}
campCtx.save();
const progress =
frame /
totalFrames;
const radius =
10 +
progress *
45;
const alpha =
1 -
progress;
campCtx.globalAlpha =
alpha;
campCtx.strokeStyle =
"#39d9ff";
campCtx.lineWidth =
3;
campCtx.beginPath();
campCtx.arc(
x,
y,
radius,
0,
Math.PI * 2
);
campCtx.stroke();
campCtx.restore();
frame++;
if (
frame <
totalFrames
) {
requestAnimationFrame(
animateCollection
);
}
}
animateCollection();
}
function startPhase1Timer() {
if (phase1Interval) {
clearInterval(
phase1Interval
);
}
game.timer =
60;
updateMainHUD();
phase1Interval =
setInterval(
() => {
if (
!game.missionActive ||
game.phase !== 1
) {
return;
}
game.timer--;
game.bearProgress =
Math.max(
0,
(
game.timer /
60
) * 100
);
updateMainHUD();
if (
game.timer <= 0
) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
phase1TimeOut();
}
},
1000
);
}
function phase1TimeOut() {
game.missionActive =
false;
if (phase1Interval) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
}
playSound(
bearSound
);
alert(
"🐻 The bear reached the campsite. Mission failed."
);
resetGame();
}
function completePhase1() {
if (
game.phase !== 1
) {
return;
}
if (
game.itemsFound <
game.totalItems
) {
return;
}
game.missionActive =
false;
if (phase1Interval) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
}
game.xp += 200;
game.score += 500;
updateMainHUD();
if (phase1XP) {
phase1XP.innerText =
game.xp;
}
hide(
gameHUD
);
hide(
inventoryPanel
);
hide(
phase2
);
hide(
missionComplete
);
show(
phase1Complete
);
playSound(
successSound
);
}
function startFishingPhase() {
if (phase1Interval) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
}
game.phase =
2;
game.fishingActive =
true;
game.missionActive =
true;
game.fishingTimer =
60;
game.fishCaught =
0;
game.bearProgress =
100;
hide(
phase1Complete
);
hide(
inventoryPanel
);
show(
phase2
);
show(
gameHUD
);
if (objectiveText) {
objectiveText.innerText =
"Catch 6 Special Fish.";
}
fishingState =
"IDLE";
aimAngle =
0;
aimDirection =
1;
castPower =
0;
castDirection =
1;
fishDistance =
0;
lineTension =
0;
reelActive =
false;
currentFish =
"goldFish";
if (bite) {
hide(
bite
);
}
if (hook) {
hide(
hook
);
}
if (powerFill) {
powerFill.style.width =
"0%";
}
if (reelFill) {
reelFill.style.width =
"0%";
}
updateFishingHUD();
startFishingTimer();
renderFishing();
}
function startFishingTimer() {
if (fishingInterval) {
clearInterval(
fishingInterval
);
}
game.fishingTimer =
60;
updateFishingHUD();
fishingInterval =
setInterval(
() => {
if (
!game.fishingActive ||
game.phase !== 2
) {
return;
}
game.fishingTimer--;
updateFishingHUD();
if (
game.fishingTimer <= 0
) {
clearInterval(
fishingInterval
);
fishingInterval =
null;
fishingTimeOut();
}
},
1000
);
}
function fishingTimeOut() {
game.fishingActive =
false;
game.missionActive =
false;
fishingState =
"IDLE";
if (fishingInterval) {
clearInterval(
fishingInterval
);
fishingInterval =
null;
}
alert(
"⏱ Time's up! The fish got away."
);
resetGame();
}
if (castRod) {
castRod.addEventListener(
"click",
handleCastRod
);
}
function handleCastRod() {
if (
!game.fishingActive ||
game.phase !== 2
) {
return;
}
if (
fishingState ===
"IDLE"
) {
startAiming();
return;
}
if (
fishingState ===
"AIMING"
) {
startPowerCharge();
return;
}
if (
fishingState ===
"CHARGING"
) {
castLine();
return;
}
if (
fishingState ===
"BITE"
) {
hookFish();
return;
}
if (
fishingState ===
"HOOKED"
) {
startReeling();
return;
}
if (
fishingState ===
"REELING"
) {
stopReeling();
return;
}
}
function startAiming() {
if (
fishingState !==
"IDLE"
) {
return;
}
fishingState =
"AIMING";
castPower =
0;
castDirection =
1;
rodTargetAngle =
-0.45;
if (castRod) {
castRod.innerText =
"🎯 AIMING...";
}
aimLoop();
}
function aimLoop() {
if (
fishingState !==
"AIMING"
) {
return;
}
aimAngle +=
0.025 *
aimDirection;
if (
aimAngle >=
1
) {
aimAngle =
1;
aimDirection =
-1;
}
if (
aimAngle <=
-1
) {
aimAngle =
-1;
aimDirection =
1;
}
rodTargetAngle =
-0.75 +
(
aimAngle *
0.35
);
drawFishingScene();
requestAnimationFrame(
aimLoop
);
}
function startPowerCharge() {
if (
fishingState !==
"AIMING"
) {
return;
}
fishingState =
"CHARGING";
castPower =
0;
castDirection =
1;
if (castRod) {
castRod.innerText =
"⚡ CAST!";
}
powerLoop();
}
function powerLoop() {
if (
fishingState !==
"CHARGING"
) {
return;
}
castPower +=
2.2 *
castDirection;
if (
castPower >=
100
) {
castPower =
100;
castDirection =
-1;
}
if (
castPower <=
0
) {
castPower =
0;
castDirection =
1;
}
updateFishingHUD();
rodTargetAngle =
-0.75 +
(
castPower /
100
) *
0.25;
drawFishingScene();
requestAnimationFrame(
powerLoop
);
}
function castLine() {
if (
fishingState !==
"CHARGING"
) {
return;
}
fishingState =
"CASTING";
const power =
Math.max(
15,
castPower
);
lureX =
fishingWidth *
(
0.35 +
(
power /
100
) *
0.45
);
lureY =
fishingHeight *
0.48;
fishDistance =
100;
lineTension =
0;
rodKick =
1;
rodTargetAngle =
-0.15;
if (castRod) {
castRod.innerText =
"🌊 WAIT FOR BITE";
}
playSound(
splashSound
);
castAnimation(
power
);
}
   function castAnimation(power) {
let frame =
0;
const totalFrames =
30;
const startX =
fishingWidth *
0.32;
const startY =
fishingHeight *
0.78;
const targetX =
fishingWidth *
(
0.35 +
(
power /
100
) *
0.45
);
const targetY =
fishingHeight *
(
0.40 -
(
power /
100
) *
0.08
);
function animate() {
if (
game.phase !== 2
) {
return;
}
const progress =
frame /
totalFrames;
const eased =
1 -
Math.pow(
1 - progress,
3
);
lureX =
startX +
(
targetX -
startX
) *
eased;
const arc =
Math.sin(
progress *
Math.PI
) *
(
120 +
power
);
lureY =
startY +
(
targetY -
startY
) *
eased -
arc;
rodTargetAngle =
-0.72 +
(
progress *
0.5
);
drawFishingScene();
frame++;
if (
frame <=
totalFrames
) {
requestAnimationFrame(
animate
);
} else {
lureX =
targetX;
lureY =
targetY;
waitForFish();
}
}
animate();
}
function waitForFish() {
if (
!game.fishingActive ||
game.phase !== 2
) {
return;
}
fishingState =
"WAITING";
rodTargetAngle =
-0.28;
if (castRod) {
castRod.innerText =
"🎣 WAITING...";
}
drawFishingScene();
const delay =
1800 +
Math.random() *
3500;
clearTimeout(
fishBiteTimeout
);
fishBiteTimeout =
setTimeout(
fishBite,
delay
);
}
function fishBite() {
if (
fishingState !==
"WAITING"
) {
return;
}
fishingState =
"BITE";
currentFish =
chooseFish();
fishDistance =
100;
lineTension =
20;
rodTargetAngle =
-0.05;
if (bite) {
show(
bite
);
bite.innerText =
"❗ FISH BITE!";
}
if (castRod) {
castRod.innerText =
"🎣 HOOK FISH!";
}
playSound(
splashSound
);
clearTimeout(
fishBiteTimeout
);
fishBiteTimeout =
setTimeout(
() => {
if (
fishingState ===
"BITE"
) {
fishEscaped();
}
},
1800
);
}
function chooseFish() {
const random =
Math.random();
if (
random < 0.34
) {
return "goldFish";
}
if (
random < 0.67
) {
return "heartFish";
}
return "rainbowFish";
}
function hookFish() {
if (
fishingState !==
"BITE"
) {
return;
}
clearTimeout(
fishBiteTimeout
);
fishingState =
"HOOKED";
lineTension =
35;
fishDistance =
100;
if (bite) {
hide(
bite
);
}
if (hook) {
show(
hook
);
hook.innerText =
"🎣 HOOKED!";
}
rodTargetAngle =
0.08;
if (castRod) {
castRod.innerText =
"🌀 REEL IN";
}
playSound(
splashSound
);
startFishFight();
}
function startFishFight() {
fishFightLoop();
}
function fishFightLoop() {
if (
fishingState !==
"HOOKED" &&
fishingState !==
"REELING"
) {
return;
}
if (
fishingState ===
"HOOKED"
) {
fishDistance +=
0.45;
} else {
fishDistance +=
0.30;
}
fishDistance =
Math.max(
0,
Math.min(
100,
fishDistance
)
);
const pull =
Math.random();
if (
pull < 0.035
) {
lineTension +=
8;
}
lineTension =
Math.max(
0,
Math.min(
100,
lineTension
)
);
if (
lineTension >=
100
) {
fishEscaped();
return;
}
if (
fishDistance <=
0
) {
catchFish();
return;
}
drawFishingScene();
requestAnimationFrame(
fishFightLoop
);
}
function fishEscaped() {
clearTimeout(
fishBiteTimeout
);
fishingState =
"IDLE";
lineTension =
0;
fishDistance =
0;
if (bite) {
hide(
bite
);
}
if (hook) {
hide(
hook
);
}
if (castRod) {
castRod.innerText =
"🎣 CAST ROD";
}
updateFishingHUD();
drawFishingScene();
}
function drawCurrentFish() {
if (
!fishingCtx ||
!currentFish
) {
return;
}
const image =
assets.fish[
currentFish
];
if (
!image ||
!image.complete ||
image.naturalWidth === 0
) {
return;
}
const distanceRatio =
fishDistance /
100;
const fishX =
fishingWidth *
(
0.50 +
distanceRatio *
0.28
);
const fishY =
fishingHeight *
(
0.42 +
Math.sin(
Date.now() *
0.003
) *
0.025
);
const fishSize =
Math.min(
fishingWidth,
fishingHeight
) *
0.075;
fishingCtx.save();
fishingCtx.globalAlpha =
0.96;
fishingCtx.drawImage(
image,
fishX -
fishSize / 2,
fishY -
fishSize / 2,
fishSize,
fishSize
);
fishingCtx.restore();
}
function drawLure() {
if (!fishingCtx) {
return;
}
if (
!lureX ||
!lureY
) {
return;
}
fishingCtx.save();
fishingCtx.strokeStyle =
"rgba(255,255,255,0.45)";
fishingCtx.lineWidth =
2;
fishingCtx.beginPath();
fishingCtx.arc(
lureX,
lureY + 5,
12 +
Math.sin(
Date.now() *
0.006
) *
3,
0,
Math.PI * 2
);
fishingCtx.stroke();
fishingCtx.fillStyle =
"#ffffff";
fishingCtx.beginPath();
fishingCtx.arc(
lureX,
lureY,
5,
0,
Math.PI * 2
);
fishingCtx.fill();
fishingCtx.restore();
}
function startReeling() {
if (
fishingState !==
"HOOKED"
) {
return;
}
fishingState =
"REELING";
reelActive =
true;
rodTargetAngle =
0.18;
if (castRod) {
castRod.innerText =
"🌀 REELING...";
}
updateFishingHUD();
drawFishingScene();
reelLoop();
}
function stopReeling() {
if (
fishingState !==
"REELING"
) {
return;
}
reelActive =
false;
fishingState =
"HOOKED";
rodTargetAngle =
0.08;
if (castRod) {
castRod.innerText =
"🌀 REEL IN";
}
drawFishingScene();
fishFightLoop();
}
function reelLoop() {
if (
fishingState !==
"REELING"
) {
return;
}
reelRotation +=
0.35;
fishDistance -=
1.15;
lineTension +=
0.85;
const fishPull =
Math.random();
if (
fishPull < 0.035
) {
fishDistance +=
4;
lineTension +=
5;
}
fishDistance =
Math.max(
0,
Math.min(
100,
fishDistance
)
);
lineTension =
Math.max(
0,
Math.min(
100,
lineTension
)
);
if (
lineTension >=
100
) {
fishEscaped();
return;
}
if (
fishDistance <=
0
) {
catchFish();
return;
}
updateFishingHUD();
drawFishingScene();
requestAnimationFrame(
reelLoop
);
}
function catchFish() {
if (
game.phase !== 2 ||
!game.fishingActive
) {
return;
}
clearTimeout(
fishBiteTimeout
);
fishingState =
"CAUGHT";
reelActive =
false;
fishDistance =
0;
lineTension =
0;
game.fishCaught++;
let fishPoints =
150;
if (
currentFish ===
"heartFish"
) {
fishPoints =
200;
}
if (
currentFish ===
"rainbowFish"
) {
fishPoints =
250;
}
game.score +=
fishPoints;
game.xp +=
75;
if (hook) {
show(
hook
);
hook.innerText =
"🐟 CAUGHT!";
}
if (castRod) {
castRod.innerText =
"🎣 FISH CAUGHT!";
}
playSound(
collectSound
);
updateFishingHUD();
showFishCatchEffect();
setTimeout(
() => {
if (
game.fishCaught >=
game.targetFish
) {
finishFishing();
return;
}
resetFishingAttempt();
},
900
);
}
function showFishCatchEffect() {
if (!fishingCtx) {
return;
}
let frame =
0;
const totalFrames =
28;
function animateCatch() {
if (!fishingCtx) {
return;
}
const progress =
frame /
totalFrames;
const alpha =
1 -
progress;
const radius =
15 +
progress *
80;
fishingCtx.save();
fishingCtx.globalAlpha =
alpha;
fishingCtx.strokeStyle =
"#ffffff";
fishingCtx.lineWidth =
3;
fishingCtx.beginPath();
fishingCtx.arc(
lureX,
lureY,
radius,
0,
Math.PI * 2
);
fishingCtx.stroke();
fishingCtx.restore();
frame++;
if (
frame <
totalFrames
) {
requestAnimationFrame(
animateCatch
);
}
}
animateCatch();
}
   function resetFishingAttempt() {
fishingState =
"IDLE";
reelActive =
false;
castPower =
0;
castDirection =
1;
aimAngle =
0;
aimDirection =
1;
fishDistance =
0;
lineTension =
0;
currentFish =
"goldFish";
if (bite) {
hide(
bite
);
}
if (hook) {
hide(
hook
);
}
if (castRod) {
castRod.innerText =
"🎣 CAST ROD";
}
if (powerFill) {
powerFill.style.width =
"0%";
}
if (reelFill) {
reelFill.style.width =
"0%";
}
updateFishingHUD();
drawFishingScene();
}
function finishFishing() {
game.fishingActive =
false;
game.missionActive =
false;
fishingState =
"COMPLETE";
reelActive =
false;
if (fishingInterval) {
clearInterval(
fishingInterval
);
fishingInterval =
null;
}
if (hook) {
hide(
hook
);
}
if (bite) {
hide(
bite
);
}
game.xp +=
300;
game.score +=
500;
updateFishingHUD();
setTimeout(
() => {
endMission();
},
700
);
}
function updateRodAnimation() {
rodAngle +=
(
rodTargetAngle -
rodAngle
) *
0.12;
rodKick *=
0.86;
if (
reelActive
) {
reelRotation +=
0.4;
}
}
function drawFishingRod() {
if (!fishingCtx) {
return;
}
const handX =
fishingWidth *
0.50;
const handY =
fishingHeight *
0.83;
const rodLength =
Math.min(
fishingWidth,
fishingHeight
) *
0.34;
const rodX =
handX +
Math.cos(
rodAngle
) *
rodLength;
const rodY =
handY +
Math.sin(
rodAngle
) *
rodLength;
fishingCtx.save();
fishingCtx.strokeStyle =
"#171717";
fishingCtx.lineWidth =
14;
fishingCtx.lineCap =
"round";
fishingCtx.beginPath();
fishingCtx.moveTo(
handX,
handY
);
fishingCtx.lineTo(
rodX,
rodY
);
fishingCtx.stroke();
fishingCtx.strokeStyle =
"#6f4a2d";
fishingCtx.lineWidth =
8;
fishingCtx.beginPath();
fishingCtx.moveTo(
handX,
handY
);
fishingCtx.lineTo(
rodX,
rodY
);
fishingCtx.stroke();
fishingCtx.strokeStyle =
"#b8865b";
fishingCtx.lineWidth =
3;
fishingCtx.beginPath();
fishingCtx.moveTo(
handX,
handY
);
fishingCtx.lineTo(
rodX,
rodY
);
fishingCtx.stroke();
const reelX =
handX +
Math.cos(
rodAngle
) *
rodLength *
0.18;
const reelY =
handY +
Math.sin(
rodAngle
) *
rodLength *
0.18;
fishingCtx.fillStyle =
"#222222";
fishingCtx.beginPath();
fishingCtx.arc(
reelX,
reelY,
12,
0,
Math.PI * 2
);
fishingCtx.fill();
fishingCtx.save();
fishingCtx.translate(
reelX,
reelY
);
fishingCtx.rotate(
reelRotation
);
fishingCtx.strokeStyle =
"#bbbbbb";
fishingCtx.lineWidth =
3;
fishingCtx.beginPath();
fishingCtx.moveTo(
-9,
0
);
fishingCtx.lineTo(
9,
0
);
fishingCtx.stroke();
fishingCtx.restore();
fishingCtx.restore();
}
function drawFishingLine() {
if (!fishingCtx) {
return;
}
const handX =
fishingWidth *
0.50;
const handY =
fishingHeight *
0.83;
const rodLength =
Math.min(
fishingWidth,
fishingHeight
) *
0.34;
const rodTipX =
handX +
Math.cos(
rodAngle
) *
rodLength;
const rodTipY =
handY +
Math.sin(
rodAngle
) *
rodLength;
if (
!lureX ||
!lureY ||
fishingState ===
"IDLE" ||
fishingState ===
"AIMING" ||
fishingState ===
"CHARGING"
) {
return;
}
fishingCtx.save();
fishingCtx.strokeStyle =
"rgba(255,255,255,0.75)";
fishingCtx.lineWidth =
1.5;
fishingCtx.beginPath();
fishingCtx.moveTo(
rodTipX,
rodTipY
);
const controlX =
(
rodTipX +
lureX
) /
2;
const controlY =
(
rodTipY +
lureY
) /
2 -
25;
fishingCtx.quadraticCurveTo(
controlX,
controlY,
lureX,
lureY
);
fishingCtx.stroke();
fishingCtx.restore();
}
function drawWaterRipple() {
if (
!fishingCtx ||
!lureX ||
!lureY
) {
return;
}
if (
fishingState ===
"IDLE" ||
fishingState ===
"AIMING" ||
fishingState ===
"CHARGING" ||
fishingState ===
"CASTING"
) {
return;
}
const pulse =
(
Math.sin(
Date.now() *
0.004
) +
1
) /
2;
const radius =
10 +
pulse *
10;
fishingCtx.save();
fishingCtx.strokeStyle =
`rgba(255,255,255,${0.35 - pulse * 0.15})`;
fishingCtx.lineWidth =
2;
fishingCtx.beginPath();
fishingCtx.ellipse(
lureX,
lureY + 5,
radius,
radius * 0.35,
0,
0,
Math.PI * 2
);
fishingCtx.stroke();
fishingCtx.restore();
}
function drawFishingScene() {
if (
!fishingCanvas ||
!fishingCtx
) {
return;
}
fishingCtx.clearRect(
0,
0,
fishingWidth,
fishingHeight
);
if (
assets.lake.complete &&
assets.lake.naturalWidth > 0
) {
fishingCtx.drawImage(
assets.lake,
0,
0,
fishingWidth,
fishingHeight
);
} else {
const gradient =
fishingCtx.createLinearGradient(
0,
0,
0,
fishingHeight
);
gradient.addColorStop(
0,
"#3b82c4"
);
gradient.addColorStop(
1,
"#071d32"
);
fishingCtx.fillStyle =
gradient;
fishingCtx.fillRect(
0,
0,
fishingWidth,
fishingHeight
);
fishingCtx.strokeStyle =
"rgba(255,255,255,0.10)";
fishingCtx.lineWidth =
2;
for (
let y = 80;
y < fishingHeight;
y += 55
) {
fishingCtx.beginPath();
fishingCtx.moveTo(
0,
y
);
fishingCtx.quadraticCurveTo(
fishingWidth * 0.25,
y - 8,
fishingWidth * 0.5,
y
);
fishingCtx.quadraticCurveTo(
fishingWidth * 0.75,
y + 8,
fishingWidth,
y
);
fishingCtx.stroke();
}
}
updateRodAnimation();
if (
fishingState ===
"WAITING" ||
fishingState ===
"BITE" ||
fishingState ===
"HOOKED" ||
fishingState ===
"REELING"
) {
drawCurrentFish();
}
drawFishingLine();
drawLure();
drawWaterRipple();
drawFishingRod();
if (
game.phase === 2 &&
game.fishingActive
) {
requestAnimationFrame(
drawFishingScene
);
}
}
if (fishingCanvas) {
fishingCanvas.addEventListener(
"click",
() => {
handleCastRod();
}
);
}
function endMission() {
game.phase =
3;
game.fishingActive =
false;
game.missionActive =
false;
fishingState =
"COMPLETE";
reelActive =
false;
if (fishingInterval) {
clearInterval(
fishingInterval
);
fishingInterval =
null;
}
if (phase1Interval) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
}
clearTimeout(
fishBiteTimeout
);
updateMainHUD();
updateFishingHUD();
if (successSound) {
playSound(
successSound
);
}
const finalXP =
document.getElementById(
"finalXP"
);
if (finalXP) {
finalXP.innerText =
game.xp;
}
hide(
phase1
);
hide(
phase1Complete
);
hide(
phase2
);
hide(
gameHUD
);
hide(
inventoryPanel
);
hide(
introScreen
);
show(
missionComplete
);
const finalScore =
document.getElementById(
"finalScore"
);
if (finalScore) {
finalScore.innerText =
game.score;
}
const finalFish =
document.getElementById(
"finalFish"
);
if (finalFish) {
finalFish.innerText =
game.fishCaught +
" / " +
game.targetFish;
}
const completion =
document.getElementById(
"completion"
);
if (completion) {
completion.innerText =
"100%";
}
}
function replayGame() {
if (phase1Interval) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
}
if (fishingInterval) {
clearInterval(
fishingInterval
);
fishingInterval =
null;
}
clearTimeout(
fishBiteTimeout
);
fishingState =
"IDLE";
reelActive =
false;
game.phase =
0;
game.xp =
0;
game.score =
0;
game.timer =
60;
game.fishingTimer =
60;
game.itemsFound =
0;
game.totalItems =
10;
game.fishCaught =
0;
game.targetFish =
6;
game.bearProgress =
100;
game.missionActive =
false;
game.fishingActive =
false;
aimAngle =
0;
aimDirection =
1;
castPower =
0;
castDirection =
1;
fishDistance =
0;
lineTension =
0;
lureX =
0;
lureY =
0;
currentFish =
"goldFish";
rodAngle =
-0.72;
rodTargetAngle =
-0.72;
rodKick =
0;
reelRotation =
0;
hide(
missionComplete
);
if (bite) {
hide(
bite
);
}
if (hook) {
hide(
hook
);
}
if (powerFill) {
powerFill.style.width =
   "0%";
}
if (reelFill) {
reelFill.style.width =
"0%";
}
if (castRod) {
castRod.innerText =
"🎣 CAST ROD";
}
updateMainHUD();
updateFishingHUD();
show(
introScreen
);
hide(
gameHUD
);
hide(
inventoryPanel
);
hide(
phase1
);
hide(
phase1Complete
);
hide(
phase2
);
if (terminal) {
terminal.innerHTML =
"<p>&gt; Mission reset.</p>";
}
stopSound(
bgMusic
);
}
function resetGame() {
if (phase1Interval) {
clearInterval(
phase1Interval
);
phase1Interval =
null;
}
if (fishingInterval) {
clearInterval(
fishingInterval
);
fishingInterval =
null;
}
clearTimeout(
fishBiteTimeout
);
game.phase =
0;
game.xp =
0;
game.score =
0;
game.timer =
60;
game.fishingTimer =
60;
game.itemsFound =
0;
game.fishCaught =
0;
game.bearProgress =
100;
game.missionActive =
false;
game.fishingActive =
false;
fishingState =
"IDLE";
reelActive =
false;
aimAngle =
0;
aimDirection =
1;
castPower =
0;
castDirection =
1;
fishDistance =
0;
lineTension =
0;
lureX =
0;
lureY =
0;
currentFish =
"goldFish";
rodAngle =
-0.72;
rodTargetAngle =
-0.72;
rodKick =
0;
reelRotation =
0;
hide(
gameHUD
);
hide(
inventoryPanel
);
hide(
phase1
);
hide(
phase1Complete
);
hide(
phase2
);
hide(
missionComplete
);
if (bite) {
hide(
bite
);
}
if (hook) {
hide(
hook
);
}
if (powerFill) {
powerFill.style.width =
"0%";
}
if (reelFill) {
reelFill.style.width =
"0%";
}
if (castRod) {
castRod.innerText =
"🎣 CAST ROD";
}
updateMainHUD();
updateFishingHUD();
show(
introScreen
);
if (terminal) {
terminal.innerHTML =
"<p>&gt; Mission ready.</p>";
}
}
const terminalLines = [
"> SECURE CONNECTION ESTABLISHED.",
"> OPERATION BIRTHDAY 30 // MISSION 02",
"> MISSION 01 STATUS: COMPLETE.",
"> NEW COORDINATES RECEIVED.",
"> CAMPSITE LOCATION CONFIRMED.",
"> ESSENTIAL EQUIPMENT SCATTERED.",
"> UNKNOWN THREAT DETECTED.",
"> FISHING LOCATION IDENTIFIED.",
"> MISSION READY.",
"> AWAITING CHIEF ADVENTURER..."
];
function startTerminal() {
if (!terminal) {
return;
}
terminal.innerHTML =
"";
let index =
0;
function typeLine() {
if (
index >=
terminalLines.length
) {
return;
}
const paragraph =
document.createElement(
"p"
);
terminal.appendChild(
paragraph
);
const text =
terminalLines[
index
];
let character =
0;
const typing =
setInterval(
() => {
paragraph.innerText =
text.substring(
0,
character
);
character++;
if (
character >
text.length
) {
clearInterval(
typing
);
index++;
setTimeout(
typeLine,
180
);
}
},
20
);
}
typeLine();
}
function initialiseIntro() {
hide(
gameHUD
);
hide(
inventoryPanel
);
hide(
phase1
);
hide(
phase1Complete
);
hide(
phase2
);
hide(
missionComplete
);
show(
introScreen
);
updateMainHUD();
updateFishingHUD();
startTerminal();
}
function startLoadingScreen() {
if (!loadingScreen) {
initialiseIntro();
return;
}
const loadingFill =
document.getElementById(
"loadingFill"
);
const loadingText =
document.getElementById(
"loadingText"
);
const messages = [
"Connecting to Satellite...",
"Authenticating Chief Adventurer...",
"Decrypting Mission Files...",
"Scanning Campsite...",
"Detecting nearby activity...",
"Loading Mission 02...",
"Mission Ready."
];
let progress =
0;
let messageIndex =
0;
if (loadingFill) {
loadingFill.style.width =
"0%";
}
if (loadingText) {
loadingText.innerText =
messages[0];
}
const loadingInterval =
setInterval(
() => {
progress +=
2;
if (loadingFill) {
loadingFill.style.width =
progress +
"%";
}
if (
progress >=
messageIndex *
(
100 /
(
messages.length -
1
)
)
) {
if (
messageIndex <
messages.length -
1
) {
messageIndex++;
if (loadingText) {
loadingText.innerText =
messages[
messageIndex
];
}
}
}
if (
progress >=
100
) {
clearInterval(
loadingInterval
);
setTimeout(
() => {
hide(
loadingScreen
);
initialiseIntro();
},
500
);
}
},
50
);
}
function renderFishing() {
drawFishingScene();
}
if (startMissionButton) {
startMissionButton.addEventListener(
"click",
startMission
);
}
if (continueFishing) {
continueFishing.addEventListener(
"click",
startFishingPhase
);
}
if (replayMission) {
replayMission.addEventListener(
"click",
replayGame
);
}
if (campCanvas) {
campCanvas.addEventListener(
"pointerdown",
handleCampsiteClick
);
}
document.addEventListener(
"keydown",
event => {
if (event.code === "Space") {
if (
game.phase === 2 &&
game.fishingActive
) {
event.preventDefault();
handleCastRod();
}
}
if (event.key.toLowerCase() === "r") {
if (
game.phase === 2 &&
game.fishingActive
) {
if (fishingState === "HOOKED") {
startReeling();
} else if (fishingState === "REELING") {
stopReeling();
}
}
}
}
);
document.addEventListener(
"visibilitychange",
() => {
if (
document.hidden &&
fishingState === "REELING"
) {
stopReeling();
}
}
);
window.Mission2 = {
game,
startMission,
startFishingPhase,
replayGame,
resetGame,
catchFish,
fishEscaped,
drawFishingScene
};
hide(gameHUD);
hide(inventoryPanel);
hide(phase1);
hide(phase1Complete);
hide(phase2);
hide(missionComplete);
updateMainHUD();
updateFishingHUD();
if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
startLoadingScreen,
{ once: true }
);
} else {
startLoadingScreen();
}
})();
}
