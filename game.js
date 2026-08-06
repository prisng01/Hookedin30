/*======================================================
 OPERATION BIRTHDAY 30
 MISSION 2
 GAME.JS
 SECTION 1
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

    loadingFill.style.width = load + "%";

    if(load % 20 === 0){

        loadingText.innerHTML =
        loadingMessages[messageIndex];

        messageIndex++;

    }

    if(load >= 100){

        clearInterval(loadingAnimation);

        setTimeout(showIntro,700);

    }

},80);

/*======================================================
 SHOW INTRO
======================================================*/

function showIntro(){

    loadingScreen.classList.add("fadeOut");

    setTimeout(()=>{

        loadingScreen.style.display="none";

        introScreen.classList.remove("hidden");

        introScreen.classList.add("fadeIn");

        startTerminal();

    },700);

}

/*======================================================
 TERMINAL
======================================================*/

const terminalLines=[

"> Secure connection established.",

"> Mission 1 completed successfully.",

"> New coordinates received.",

"> WARNING: Bear approaching campsite.",

"> Recover all camping equipment.",

"> Good luck, Chief ❤️"

];

function startTerminal(){

terminal.innerHTML="";

let line=0;

function typeLine(){

if(line>=terminalLines.length)return;

let p=document.createElement("p");

terminal.appendChild(p);

let text=terminalLines[line];

let i=0;

const typing=setInterval(()=>{

p.innerHTML=text.substring(0,i);

i++;

if(i>text.length){

clearInterval(typing);

line++;

setTimeout(typeLine,250);

}

},28);

}

typeLine();

}

/*======================================================
 START MISSION
======================================================*/

startMissionBtn.addEventListener("click",()=>{

game.missionStarted=true;

introScreen.classList.add("fadeOut");

setTimeout(()=>{

introScreen.style.display="none";

gameHUD.classList.remove("hidden");

inventoryPanel.classList.remove("hidden");

phase1.classList.remove("hidden");

gameHUD.classList.add("fadeIn");

inventoryPanel.classList.add("fadeIn");

phase1.classList.add("fadeIn");

/* Start Phase 1 */

startCountdown();

if(typeof startPhase1==="function"){

startPhase1();

}

},700);

});

/*======================================================
 XP SYSTEM
======================================================*/

function addXP(amount,target){

game.xp+=amount;

xpText.innerHTML=game.xp;

floatingXP(amount,target);

}

/*======================================================
 FLOATING XP
======================================================*/

function floatingXP(amount,target){

const xp=document.createElement("div");

xp.className="floatingXP";

xp.innerHTML="⭐ +"+amount;

const rect=target.getBoundingClientRect();

xp.style.left=
(rect.left+15)+"px";

xp.style.top=
(rect.top)+"px";

document.body.appendChild(xp);

setTimeout(()=>{

xp.remove();

},1200);

}

/*======================================================
 TIMER
======================================================*/

function startCountdown(){

const timer=setInterval(()=>{

game.timer--;

timerText.innerHTML=

"00:"+String(game.timer).padStart(2,"0");

if(game.timer<=0){

clearInterval(timer);

alert("🐻 The bear reached the campsite!");

location.reload();

}

},1000);

}

/*======================================================
 SAVE
======================================================*/

function saveGame(){

localStorage.setItem(

"mission2",

JSON.stringify(game)

);

}

/*======================================================
 LOAD
======================================================*/

function loadGame(){

const save=

localStorage.getItem("mission2");

if(save){

Object.assign(game,

JSON.parse(save));

xpText.innerHTML=game.xp;

}

}

loadGame();
/*======================================================
 SECTION 2
 PHASE 1 GAME ENGINE
======================================================*/

// Bear progress (100% = far away)
let bearDistance = 100;
let bearInterval = null;

/*======================================================
 HIDDEN OBJECTS
 Fixed Campsite Locations
======================================================*/

const hiddenItems = [

{

id:"tent",

x:710,

y:320,

width:160,

height:130,

found:false

},

{

id:"backpack",

x:560,

y:455,

width:75,

height:85,

found:false

},

{

id:"flashlight",

x:815,

y:495,

width:55,

height:25,

found:false

},

{

id:"compass",

x:625,

y:390,

width:35,

height:35,

found:false

},

{

id:"boots",

x:940,

y:515,

width:75,

height:55,

found:false

},

{

id:"bottle",

x:470,

y:470,

width:35,

height:65,

found:false

},

{

id:"fishingRod",

x:1030,

y:235,

width:165,

height:38,

found:false

},

{

id:"map",

x:720,

y:455,

width:80,

height:60,

found:false

},

{

id:"camera",

x:365,

y:535,

width:55,

height:50,

found:false

},

{

id:"key",

x:1090,

y:145,

width:32,

height:32,

found:false

}

];

/*======================================================
 START PHASE 1
======================================================*/

function startPhase1(){

    createHiddenObjects();

    startBear();

}

/*======================================================
 CREATE HIDDEN OBJECTS
======================================================*/

function createHiddenObjects(){

const scene=document.getElementById("campScene");

scene.innerHTML="";

hiddenItems.forEach(item=>{

const img=document.createElement("img");

img.src=`assets/items/${item.id}.png`;

img.className="collectible";

img.dataset.item=item.id;

img.style.position="absolute";

img.style.left=item.x+"px";

img.style.top=item.y+"px";

img.style.width=item.width+"px";

img.style.height=item.height+"px";

img.draggable=false;

img.onclick=()=>collectItem(item,img);

scene.appendChild(img);

});

}

function collectItem(item,img){

if(item.found) return;

item.found=true;

img.classList.add("found");

sparkle(img);

flyToInventory(img,item.id);

addXP(50);

game.itemsFound++;

updateInventory(item.id);

setTimeout(()=>{

img.remove();

},400);

if(game.itemsFound===hiddenItems.length){

missionSuccess();

}

}

/*======================================================
 INVENTORY
======================================================*/

function collectItem(item,img){

    if(item.found) return;

    item.found = true;

    img.classList.add("found");

    sparkle(img);
const sound=document.getElementById("collectSound");

if(sound){

sound.currentTime=0;

sound.play();

}
    flyToInventory(img,item.id);

    addXP(50,img);

    game.itemsFound++;

    updateInventory(item.id);

   setTimeout(()=>{
    img.remove();
},900);

    if(game.itemsFound===hiddenItems.length){
        missionSuccess();
    }

}

/*======================================================
 SPARKLES
======================================================*/

function sparkle(target){

const scene=document.getElementById("campScene");

const rect=target.getBoundingClientRect();

const sceneRect=scene.getBoundingClientRect();

for(let i=0;i<18;i++){

const s=document.createElement("div");

s.className="sparkle";

const angle=Math.random()*360;

const distance=40+Math.random()*60;

const x=
Math.cos(angle*Math.PI/180)*distance;

const y=
Math.sin(angle*Math.PI/180)*distance;

s.style.left=
(rect.left-sceneRect.left+rect.width/2)+"px";

s.style.top=
(rect.top-sceneRect.top+rect.height/2)+"px";

scene.appendChild(s);

requestAnimationFrame(()=>{

s.style.transform=
`translate(${x}px,${y}px) scale(2)`;

s.style.opacity=0;

});

setTimeout(()=>{

s.remove();

},700);

}

}

/*======================================================
 BEAR
======================================================*/

function startBear(){

    const bar =
    document.getElementById("bearProgress");

    bearInterval = setInterval(()=>{

        bearDistance -= 1.6;

        if(bearDistance < 0)
            bearDistance = 0;

        bar.style.width =
        bearDistance + "%";

        if(bearDistance < 40){

            document.body.classList.add("danger");

        }

        if(bearDistance < 20){

            bearRoar();

        }

        if(bearDistance <= 0){

            clearInterval(bearInterval);

        }

    },1000);

}

/*======================================================
 ROAR
======================================================*/

function bearRoar(){

    document.body.classList.add("shake");

    const roar =
    document.getElementById("bearSound");

    if(roar)
        roar.play();

    setTimeout(()=>{

        document.body.classList.remove("shake");

    },400);

}

/*======================================================
 MISSION COMPLETE
======================================================*/

function missionSuccess(){

    clearInterval(bearInterval);

    saveGame();

    document.getElementById("phase1")
    .classList.add("fadeOut");

    setTimeout(()=>{

        document.getElementById("phase1")
        .style.display="none";

        document.getElementById("phase1Complete")
        .classList.remove("hidden");

        document
        .getElementById("successSound")
        ?.play();

    },700);

}

/*======================================================
 RESET PHASE
======================================================*/

function resetObjects(){

hiddenItems.forEach(item=>{

item.found=false;

});

game.itemsFound=0;

}
/*======================================================
 ITEM FLIES TO INVENTORY
======================================================*/

function flyToInventory(itemElement, itemId){

    const inventorySlots = document.querySelectorAll(".inventorySlot");

    let targetSlot = null;

    inventorySlots.forEach(slot=>{

        const text = slot.querySelector("p");

        if(!text) return;

        const compare = text.innerText
            .replace(/\s/g,"")
            .toLowerCase();

        if(compare===itemId.toLowerCase()){

            targetSlot=slot;

        }

    });

    if(!targetSlot){

        itemElement.remove();

        return;

    }

    const start=itemElement.getBoundingClientRect();

    const end=targetSlot.getBoundingClientRect();

    const flying=itemElement.cloneNode(true);

    flying.style.position="fixed";

    flying.style.left=start.left+"px";
    flying.style.top=start.top+"px";

    flying.style.width=start.width+"px";
    flying.style.height=start.height+"px";

    flying.style.pointerEvents="none";

    flying.style.zIndex="99999";

    flying.style.transition="all .9s cubic-bezier(.22,.61,.36,1)";

    document.body.appendChild(flying);

    requestAnimationFrame(()=>{

        flying.style.left=end.left+15+"px";
        flying.style.top=end.top+10+"px";

        flying.style.width="42px";
        flying.style.height="42px";

        flying.style.opacity=".2";

        flying.style.transform="rotate(720deg) scale(.4)";

    });

    setTimeout(()=>{

        flying.remove();

        targetSlot.classList.add("found");

        targetSlot.animate([

            {transform:"scale(1)"},

            {transform:"scale(1.15)"},

            {transform:"scale(1)"}

        ],{

            duration:450

        });

    },900);

}
