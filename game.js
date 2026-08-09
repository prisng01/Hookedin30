/* OPERATION BIRTHDAY 30 - MISSION 02 - GAME.JS
   Amended fishing simulation:
   - Uses assets/backgrounds/lake.png
   - No angler/fisherman image
   - First-person rod + reel are drawn on canvas
   - Rod moves during aim, cast, bite and reeling
*/

"use strict";

class MissionAudioManager {
    constructor() {
        this.muted = false;

        this.sounds = {
            bg: new Audio("assets/audio/background.mp3"),
            bear: new Audio("assets/audio/bear.mp3"),
            collect: new Audio("assets/audio/collect.mp3"),

            reelWinding:
                new Audio(
                    "assets/audio/freesound_community-fishingrod-winding-92375.mp3"
                ),

            fishPulling:
                new Audio(
                    "assets/audio/freesound_community-fly-reel-fish-pulling-saricione-94671.mp3"
                ),

            lakeAmbience:
                new Audio(
                    "assets/audio/mindmist-fishing-on-the-lake-310740.mp3"
                ),

            complete:
                new Audio("assets/audio/mission-complete.mp3"),

            whoosh:
                new Audio(
                    "assets/audio/spinopel-fishing-rod-whoosh-411640.mp3"
                ),

            splash:
                new Audio("assets/audio/splash.mp3")
        };

        this.sounds.bg.loop = true;
        this.sounds.lakeAmbience.loop = true;
        this.sounds.reelWinding.loop = true;
        this.sounds.fishPulling.loop = true;

        this.sounds.bg.volume = 0.4;
        this.sounds.lakeAmbience.volume = 0.5;
        this.sounds.bear.volume = 0.8;
    }

    play(name) {
        if (this.muted || !this.sounds[name]) {
            return;
        }

        const sound = this.sounds[name];

        if (
            (name === "reelWinding" ||
                name === "fishPulling") &&
            !sound.paused
        ) {
            return;
        }

        sound.currentTime = 0;

        sound.play().catch(() => {});
    }

    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
        }
    }

    stopAllLoops() {
        [
            "bg",
            "lakeAmbience",
            "reelWinding",
            "fishPulling"
        ].forEach(name => {
            this.stop(name);
        });
    }
}


/*======================================================
 CANVAS
======================================================*/

const audio = new MissionAudioManager();

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

let width = 0;
let height = 0;


function resize() {

    width = canvas.width =
        window.innerWidth;

    height = canvas.height =
        window.innerHeight;
}

window.addEventListener(
    "resize",
    resize
);

resize();


/*======================================================
 ASSET LOADER
======================================================*/

function asset(src) {

    const img =
        new Image();

    img.src = src;

    return img;
}


/*======================================================
 ASSETS
======================================================*/

const assets = {

    /* NEW CAMPSITE BACKGROUND */
    campsite:
        asset(
            "assets/backgrounds/campsite.png"
        ),

    /* NEW LAKE BACKGROUND */
    lake:
        asset(
            "assets/backgrounds/lake.png"
        ),

    bear:
        asset(
            "assets/bear/bear_walk.jpg"
        ),

    items: {

        boots:
            asset(
                "assets/items/boots.png"
            ),

        bottle:
            asset(
                "assets/items/bottle.png"
            ),

        camera:
            asset(
                "assets/items/camera.jpg"
            ),

        compass:
            asset(
                "assets/items/compass.png"
            ),

        fishingRod:
            asset(
                "assets/items/fishingRod.png"
            ),

        hook:
            asset(
                "assets/items/hook.png"
            ),

        key:
            asset(
                "assets/items/key.png"
            ),

        torchlight:
            asset(
                "assets/items/torchlight.png"
            )
    },

    fish: {

        goldFish:
            asset(
                "assets/fish/goldFish_2.png"
            ),

        heartFish:
            asset(
                "assets/fish/heartFish_2.png"
            ),

        rainbowFish:
            asset(
                "assets/fish/rainbowFish.png"
            )
    }
};


/*======================================================
 GAME STATE
======================================================*/

let state =
    "MISSION_START";

let items = [];

let itemsCollected = 0;

const TOTAL_ITEMS = 10;

const TARGET_FISH = 6;

const ITEM_KEYS = [

    "boots",
    "bottle",
    "camera",
    "compass",
    "fishingRod",
    "hook",
    "key",
    "torchlight"

];


let fishCaught = 0;

let bearDistance = 100;


/*======================================================
 FISHING STATE
======================================================*/

let aimAngle = 0;

let aimDir = 1;

let castPower = 0;

let powerDir = 1;

let lineTension = 0;

let fishDistance = 0;

let lureX = 0;

let lureY = 0;

let reelActive = false;

let currentFishType =
    "goldFish";


/*======================================================
 FIRST PERSON ROD STATE
======================================================*/

/*
    No angler.png is used.

    The player sees the fishing rod
    from a first-person perspective.
*/

let rodAngle =
    -0.72;

let rodTargetAngle =
    -0.72;

let rodKick =
    0;

let reelRotation =
    0;


/*======================================================
 HTML ELEMENTS
======================================================*/

const startOverlay =
    document.getElementById(
        "start-overlay"
    );

const phase2Overlay =
    document.getElementById(
        "phase2-overlay"
    );

const endOverlay =
    document.getElementById(
        "end-overlay"
    );


const startBtn =
    document.getElementById(
        "start-btn"
    );

const phase2Btn =
    document.getElementById(
        "phase2-btn"
    );

const restartBtn =
    document.getElementById(
        "restart-btn"
    );


const promptEl =
    document.getElementById(
        "action-prompt"
    );


const labelPrimary =
    document.getElementById(
        "label-primary"
    );

const valPrimary =
    document.getElementById(
        "val-primary"
    );


const labelSecondary =
    document.getElementById(
        "label-secondary"
    );

const valSecondary =
    document.getElementById(
        "val-secondary"
    );


const powerMeter =
    document.getElementById(
        "power-container"
    );

const powerBar =
    document.getElementById(
        "power-bar"
    );


const tensionContainer =
    document.getElementById(
        "tension-container"
    );

const tensionBar =
    document.getElementById(
        "tension-bar"
    );


const audioBtn =
    document.getElementById(
        "audio-toggle"
    );


/*======================================================
 AUDIO BUTTON
======================================================*/

if (audioBtn) {

    audioBtn.addEventListener(
        "click",
        () => {

            audio.muted =
                !audio.muted;

            audioBtn.innerText =
                audio.muted
                    ? "🔇 Audio: OFF"
                    : "🔊 Audio: ON";


            if (audio.muted) {

                audio.stopAllLoops();

            } else if (
                state ===
                "PHASE1_SEARCH"
            ) {

                audio.play("bg");

            } else if (
                state.startsWith(
                    "PHASE2"
                )
            ) {

                audio.play(
                    "lakeAmbience"
                );
            }
        }
    );
}


/*======================================================
 START MISSION
======================================================*/

if (startBtn) {

    startBtn.addEventListener(
        "click",
        () => {

            audio.play(
                "collect"
            );

            if (startOverlay) {

                startOverlay.classList.add(
                    "hidden"
                );
            }

            startPhase1();
        }
    );
}


/*======================================================
 START PHASE 2
======================================================*/

if (phase2Btn) {

    phase2Btn.addEventListener(
        "click",
        () => {

            audio.play(
                "collect"
            );

            if (phase2Overlay) {

                phase2Overlay.classList.add(
                    "hidden"
                );
            }

            startPhase2();
        }
    );
}


/*======================================================
 RESTART
======================================================*/

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        () => {

            audio.play(
                "collect"
            );

            if (endOverlay) {

                endOverlay.classList.add(
                    "hidden"
                );
            }

            startPhase1();
        }
    );
}


/*======================================================
 PHASE 1
======================================================*/

function startPhase1() {

    audio.stopAllLoops();

    audio.play(
        "bg"
    );

    state =
        "PHASE1_SEARCH";

    itemsCollected =
        0;

    bearDistance =
        100;


    if (powerMeter) {

        powerMeter.classList.add(
            "hidden"
        );
    }


    if (tensionContainer) {

        tensionContainer.classList.add(
            "hidden"
        );
    }


    if (labelPrimary) {

        labelPrimary.textContent =
            "Supplies Found";
    }


    if (valPrimary) {

        valPrimary.textContent =
            `0 / ${TOTAL_ITEMS}`;
    }


    if (labelSecondary) {

        labelSecondary.textContent =
            "Bear Proximity";
    }


    if (valSecondary) {

        valSecondary.textContent =
            "100m";
    }


    if (promptEl) {

        promptEl.textContent =
            "MISSION 02 - PHASE 1: CAMPSITE SEARCH";
    }


    items =
        Array.from(
            {
                length:
                    TOTAL_ITEMS
            },
            () => ({

                key:
                    ITEM_KEYS[
                        Math.floor(
                            Math.random() *
                            ITEM_KEYS.length
                        )
                    ],

                x:
                    100 +
                    Math.random() *
                    Math.max(
                        200,
                        width - 200
                    ),

                y:
                    140 +
                    Math.random() *
                    Math.max(
                        160,
                        height - 280
                    ),

                radius:
                    32,

                collected:
                    false
            })
        );
}


/*======================================================
 PHASE 2
======================================================*/

function startPhase2() {

    audio.stopAllLoops();

    audio.play(
        "lakeAmbience"
    );


    state =
        "PHASE2_AIM";


    fishCaught =
        0;


    aimAngle =
        0;

    aimDir =
        1;


    castPower =
        0;

    powerDir =
        1;


    lineTension =
        0;


    fishDistance =
        0;


    reelActive =
        false;


    rodAngle =
        -0.72;

    rodTargetAngle =
        -0.72;

    rodKick =
        0;

    reelRotation =
        0;


    if (powerMeter) {

        powerMeter.classList.add(
            "hidden"
        );
    }


    if (tensionContainer) {

        tensionContainer.classList.remove(
            "hidden"
        );
    }


    if (powerBar) {

        powerBar.style.height =
            "0%";
    }


    if (tensionBar) {

        tensionBar.style.height =
            "0%";
    }


    if (labelPrimary) {

        labelPrimary.textContent =
            "Target Fish";
    }


    if (valPrimary) {

        valPrimary.textContent =
            `0 / ${TARGET_FISH}`;
    }


    if (labelSecondary) {

        labelSecondary.textContent =
            "Target Distance";
    }


    if (valSecondary) {

        valSecondary.textContent =
            "0.0m";
    }


    if (promptEl) {

        promptEl.textContent =
            "MISSION 02 - PHASE 2: AIM YOUR CAST";
    }
}


/*======================================================
 POINTER CONTROLS
======================================================*/

window.addEventListener(
    "pointerdown",
    e => {

        if (
            e.target &&
            e.target.tagName ===
                "BUTTON"
        ) {
            return;
        }


        /*------------------------------------------
          PHASE 1
        ------------------------------------------*/

        if (
            state ===
            "PHASE1_SEARCH"
        ) {

            collectAtPoint(
                e.clientX,
                e.clientY
            );

            return;
        }


        /*------------------------------------------
          AIM
        ------------------------------------------*/

        if (
            state ===
            "PHASE2_AIM"
        ) {

            audio.play(
                "collect"
            );


            state =
                "PHASE2_POWER";


            if (powerMeter) {

                powerMeter.classList.remove(
                    "hidden"
                );
            }


            if (promptEl) {

                promptEl.textContent =
                    "MISSION 02 - PHASE 2: CLICK TO LOCK CAST POWER";
            }

            return;
        }


        /*------------------------------------------
          CAST
        ------------------------------------------*/

        if (
            state ===
            "PHASE2_POWER"
        ) {

            audio.play(
                "whoosh"
            );


            state =
                "PHASE2_WAITING";


            if (powerMeter) {

                powerMeter.classList.add(
                    "hidden"
                );
            }


            fishDistance =
                22 +
                castPower *
                    0.42;


            lureX =
                width / 2 +
                aimAngle *
                    width *
                    0.35;


            lureY =
                height *
                (
                    0.80 -
                    castPower /
                        100 *
                        0.35
                );


            rodKick =
                1;


            if (promptEl) {

                promptEl.textContent =
                    "WAITING FOR A FISH TO BITE...";
            }


            setTimeout(
                triggerBite,
                2200 +
                    Math.random() *
                        2500
            );


            return;
        }


        /*------------------------------------------
          HOOK FISH
        ------------------------------------------*/

        if (
            state ===
            "PHASE2_HOOKED"
        ) {

            audio.play(
                "splash"
            );


            state =
                "PHASE2_REELING";


            if (promptEl) {

                promptEl.textContent =
                    "HOLD LEFT CLICK / SPACEBAR TO REEL IN CAREFULLY!";
            }


            return;
        }


        /*------------------------------------------
          REEL
        ------------------------------------------*/

        if (
            state ===
            "PHASE2_REELING"
        ) {

            reelActive =
                true;
        }
    }
);


/*======================================================
 POINTER UP
======================================================*/

window.addEventListener(
    "pointerup",
    () => {

        if (
            state ===
            "PHASE2_REELING"
        ) {

            reelActive =
                false;
        }
    }
);


/*======================================================
 MOUSE REELING
======================================================*/

window.addEventListener(
    "mousedown",
    () => {

        if (
            state ===
            "PHASE2_REELING"
        ) {

            reelActive =
                true;
        }
    }
);


window.addEventListener(
    "mouseup",
    () => {

        reelActive =
            false;

        audio.stop(
            "reelWinding"
        );
    }
);


/*======================================================
 SPACEBAR REELING
======================================================*/

window.addEventListener(
    "keydown",
    e => {

        if (
            e.code === "Space" &&
            state ===
                "PHASE2_REELING"
        ) {

            e.preventDefault();

            reelActive =
                true;
        }
    }
);


window.addEventListener(
    "keyup",
    e => {

        if (
            e.code === "Space"
        ) {

            reelActive =
                false;

            audio.stop(
                "reelWinding"
            );
        }
    }
);


/*======================================================
 COLLECT ITEMS
======================================================*/

function collectAtPoint(
    x,
    y
) {

    for (
        const item of items
    ) {

        if (
            item.collected
        ) {
            continue;
        }


        const distance =
            Math.hypot(
                x -
                    item.x,
                y -
                    item.y
            );


        if (
            distance <
            item.radius +
                15
        ) {

            item.collected =
                true;


            itemsCollected++;


            audio.play(
                "collect"
            );


            if (valPrimary) {

                valPrimary.textContent =
                    `${itemsCollected} / ${TOTAL_ITEMS}`;
            }


            if (
                itemsCollected >=
                TOTAL_ITEMS
            ) {

                state =
                    "PHASE2_TRANSITION";


                audio.stop(
                    "bg"
                );


                if (
                    phase2Overlay
                ) {

                    phase2Overlay.classList.remove(
                        "hidden"
                    );
                }
            }
        }
    }
}


/*======================================================
 FISH BITE
======================================================*/

function triggerBite() {

    if (
        state !==
        "PHASE2_WAITING"
    ) {

        return;
    }


    state =
        "PHASE2_HOOKED";


    const fishTypes = [

        "goldFish",
        "heartFish",
        "rainbowFish"

    ];


    currentFishType =
        fishTypes[
            Math.floor(
                Math.random() *
                fishTypes.length
            )
        ];


    audio.play(
        "fishPulling"
    );


    rodKick =
        1;


    if (promptEl) {

        promptEl.textContent =
            "🎣 FISH STRIKE! CLICK TO HOOK!";
    }
}


/*======================================================
 UPDATE
======================================================*/

function update(
    dt,
    now
) {


    /*----------------------------------------------
      PHASE 1
    ----------------------------------------------*/

    if (
        state ===
        "PHASE1_SEARCH"
    ) {

        bearDistance -=
            2.2 *
            dt;


        if (valSecondary) {

            valSecondary.textContent =
                `${Math.max(
                    0,
                    bearDistance
                ).toFixed(0)}m`;
        }


        if (
            bearDistance <=
            0
        ) {

            audio.stopAllLoops();

            audio.play(
                "bear"
            );


            state =
                "MISSION_END";


            const endTitle =
                document.getElementById(
                    "end-title"
                );

            const endDesc =
                document.getElementById(
                    "end-desc"
                );


            if (endTitle) {

                endTitle.textContent =
                    "MISSION 02 FAILED!";
            }


            if (endDesc) {

                endDesc.innerHTML =
                    "The bear reached the campsite before you collected all supplies." +
                    "<br><br><strong>Mission 03 is coming soon next week!</strong>";
            }


            if (endOverlay) {

                endOverlay.classList.remove(
                    "hidden"
                );
            }
        }
    }


    /*----------------------------------------------
      AIM
    ----------------------------------------------*/

    if (
        state ===
        "PHASE2_AIM"
    ) {

        aimAngle +=
            aimDir *
            1.5 *
            dt;


        if (
            aimAngle >
            1
        ) {

            aimAngle =
                1;

            aimDir =
                -1;
        }


        if (
            aimAngle <
            -1
        ) {

            aimAngle =
                -1;

            aimDir =
                1;
        }


        rodTargetAngle =
            -0.72 +
            aimAngle *
                0.42;
    }


    /*----------------------------------------------
      CAST POWER
    ----------------------------------------------*/

    if (
        state ===
        "PHASE2_POWER"
    ) {

        castPower +=
            powerDir *
            110 *
            dt;


        if (
            castPower >=
            100
        ) {

            castPower =
                100;

            powerDir =
                -1;
        }


        if (
            castPower <=
            0
        ) {

            castPower =
                0;

            powerDir =
                1;
        }


        if (powerBar) {

            powerBar.style.height =
                `${castPower}%`;
        }


        rodTargetAngle =
            -0.72 +
            castPower /
                100 *
                0.20;
    }


    /*----------------------------------------------
      WAITING FOR BITE
    ----------------------------------------------*/

    if (
        state ===
        "PHASE2_WAITING"
    ) {

        rodTargetAngle =
            -0.52;


        if (valSecondary) {

            valSecondary.textContent =
                `${Math.max(
                    0,
                    fishDistance
                ).toFixed(1)}m`;
        }
    }


    /*----------------------------------------------
      FISH HOOKED
    ----------------------------------------------*/

    if (
        state ===
        "PHASE2_HOOKED"
    ) {

        rodTargetAngle =
            -0.52 -
            Math.sin(
                now / 75
            ) *
                0.06;


        rodKick =
            Math.max(
                0,
                rodKick -
                    dt *
                        1.8
            );
    }


    /*----------------------------------------------
      REELING
    ----------------------------------------------*/

    if (
        state ===
        "PHASE2_REELING"
    ) {

        if (
            reelActive
        ) {

            audio.play(
                "reelWinding"
            );


            lineTension =
                Math.min(
                    100,
                    lineTension +
                        46 *
                            dt
                );


            fishDistance -=
                8.2 *
                dt;


            reelRotation +=
                dt *
                12;


            rodTargetAngle =
                -0.58 -
                Math.sin(
                    now / 100
                ) *
                    0.08;

        } else {

            audio.stop(
                "reelWinding"
            );


            lineTension =
                Math.max(
                    0,
                    lineTension -
                        32 *
                            dt
                );


            fishDistance +=
                2.2 *
                dt;


            rodTargetAngle =
                -0.52;
        }


        if (valSecondary) {

            valSecondary.textContent =
                `${Math.max(
                    0,
                    fishDistance
                ).toFixed(1)}m`;
        }


        if (tensionBar) {

            tensionBar.style.height =
                `${lineTension}%`;
        }


        /*------------------------------------------
          LINE SNAP
        ------------------------------------------*/

        if (
            lineTension >=
            100
        ) {

            audio.stop(
                "reelWinding"
            );

            audio.stop(
                "fishPulling"
            );


            lineTension =
                0;


            state =
                "PHASE2_AIM";


            if (promptEl) {

                promptEl.textContent =
                    "LINE SNAPPED! RE-AIM AND CAST...";
            }


            if (tensionBar) {

                tensionBar.style.height =
                    "0%";
            }
        }


        /*------------------------------------------
          FISH REACHED PLAYER
        ------------------------------------------*/

        if (
            fishDistance <=
            2
        ) {

            landFish();
        }
    }


    /*----------------------------------------------
      SMOOTH ROD MOVEMENT
    ----------------------------------------------*/

    rodAngle +=
        (
            rodTargetAngle -
            rodAngle
        ) *
        Math.min(
            1,
            8 *
                dt
        );


    rodKick =
        Math.max(
            0,
            rodKick -
                dt *
                    2.5
        );
}


/*======================================================
 LAND FISH
======================================================*/

function landFish() {

    audio.stop(
        "reelWinding"
    );

    audio.stop(
        "fishPulling"
    );

    audio.play(
        "complete"
    );


    lineTension =
        0;


    fishCaught++;


    if (valPrimary) {

        valPrimary.textContent =
            `${fishCaught} / ${TARGET_FISH}`;
    }


    if (tensionBar) {

        tensionBar.style.height =
            "0%";
    }


    /*----------------------------------------------
      ALL 6 FISH CAUGHT
    ----------------------------------------------*/

    if (
        fishCaught >=
        TARGET_FISH
    ) {

        audio.stopAllLoops();

        audio.play(
            "complete"
        );


        state =
            "MISSION_END";


        const endTitle =
            document.getElementById(
                "end-title"
            );

        const endDesc =
            document.getElementById(
                "end-desc"
            );


        if (endTitle) {

            endTitle.textContent =
                "MISSION 02 COMPLETE";
        }


        if (endDesc) {

            endDesc.innerHTML =
                "You successfully completed Phase 1 (Campsite Search) and Phase 2 (Realistic Fishing Game)!" +
                "<br><br><strong>Mission 03 is coming soon next week!</strong>";
        }


        if (endOverlay) {

            endOverlay.classList.remove(
                "hidden"
            );
        }


        return;
    }


    /*----------------------------------------------
      NEXT FISH
    ----------------------------------------------*/

    state =
        "PHASE2_AIM";


    castPower =
        0;


    aimAngle =
        0;


    if (promptEl) {

        promptEl.textContent =
            `FISH LANDED! (${fishCaught}/${TARGET_FISH}) - RE-AIM FOR NEXT CAST`;
    }
}


/*======================================================
 DRAW FIRST-PERSON FISHING ROD
======================================================*/

function drawRod(now) {

    /*
        IMPORTANT:

        There is NO angler.png here.

        The player sees only the fishing rod,
        reel and line, similar to a fishing
        simulation game.
    */


    const handX =
        width *
        0.86;


    const handY =
        height *
        1.03;


    const length =
        Math.min(
            width *
                0.48,

            height *
                0.62
        );


    const angle =
        rodAngle -
        rodKick *
            0.12;


    const tipX =
        handX +
        Math.cos(angle) *
            length;


    const tipY =
        handY +
        Math.sin(angle) *
            length;


    ctx.save();

    ctx.lineCap =
        "round";


    /*----------------------------------------------
      ROD SHADOW
    ----------------------------------------------*/

    ctx.strokeStyle =
        "rgba(0,0,0,.45)";

    ctx.lineWidth =
        16;


    ctx.beginPath();

    ctx.moveTo(
        handX,
        handY
    );

    ctx.lineTo(
        tipX,
        tipY
    );

    ctx.stroke();


    /*----------------------------------------------
      MAIN GRAPHITE ROD
    ----------------------------------------------*/

    const rodGradient =
        ctx.createLinearGradient(
            handX,
            handY,
            tipX,
            tipY
        );


    rodGradient.addColorStop(
        0,
        "#11161a"
    );

    rodGradient.addColorStop(
        0.55,
        "#46515a"
    );

    rodGradient.addColorStop(
        1,
        "#b4bdc2"
    );


    ctx.strokeStyle =
        rodGradient;

    ctx.lineWidth =
        10;


    ctx.beginPath();

    ctx.moveTo(
        handX,
        handY
    );

    ctx.lineTo(
        tipX,
        tipY
    );

    ctx.stroke();


    /*----------------------------------------------
      CORK HANDLE
    ----------------------------------------------*/

    const handleX =
        handX -
        Math.cos(angle) *
            68;


    const handleY =
        handY -
        Math.sin(angle) *
            68;


    ctx.strokeStyle =
        "#a8753d";

    ctx.lineWidth =
        24;


    ctx.beginPath();

    ctx.moveTo(
        handX,
        handY
    );

    ctx.lineTo(
        handleX,
        handleY
    );

    ctx.stroke();


    /*----------------------------------------------
      REEL BODY
    ----------------------------------------------*/

    const reelX =
        handX -
        Math.cos(angle) *
            34;


    const reelY =
        handY -
        Math.sin(angle) *
            34;


    ctx.fillStyle =
        "#11161a";


    ctx.beginPath();

    ctx.ellipse(
        reelX,
        reelY + 12,
        31,
        43,
        angle,
        0,
        Math.PI *
            2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#b7c0c5";

    ctx.lineWidth =
        4;


    ctx.beginPath();

    ctx.ellipse(
        reelX,
        reelY + 12,
        22,
        34,
        angle,
        0,
        Math.PI *
            2
    );

    ctx.stroke();


    /*----------------------------------------------
      ROTATING REEL HANDLE
    ----------------------------------------------*/

    const crank =
        reelRotation *
        8;


    const crankX =
        reelX +
        Math.cos(crank) *
            25;


    const crankY =
        reelY +
        12 +
        Math.sin(crank) *
            25;


    ctx.strokeStyle =
        "#d0d6da";

    ctx.lineWidth =
        5;


    ctx.beginPath();

    ctx.moveTo(
        reelX,
        reelY + 12
    );

    ctx.lineTo(
        crankX,
        crankY
    );

    ctx.stroke();


    ctx.fillStyle =
        "#171c20";


    ctx.beginPath();

    ctx.arc(
        crankX,
        crankY,
        7,
        0,
        Math.PI *
            2
    );

    ctx.fill();


    /*----------------------------------------------
      ROD GUIDES
    ----------------------------------------------*/

    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        const p =
            i /
            6;


        const guideX =
            handX +
            Math.cos(angle) *
                length *
                p;


        const guideY =
            handY +
            Math.sin(angle) *
                length *
                p;


        ctx.strokeStyle =
            "rgba(220,230,235,.8)";

        ctx.lineWidth =
            2;


        ctx.beginPath();

        ctx.arc(
            guideX,
            guideY,
            5 -
                i *
                    0.5,
            0,
            Math.PI *
                2
        );

        ctx.stroke();
    }


    ctx.restore();


    return {

        tipX:
            tipX,

        tipY:
            tipY
    };
}


/*======================================================
 DRAW FISHING LINE
======================================================*/

function drawLine(
    tipX,
    tipY
) {

    if (
        ![
            "PHASE2_WAITING",
            "PHASE2_HOOKED",
            "PHASE2_REELING"
        ].includes(
            state
        )
    ) {

        return;
    }


    const sag =
        Math.max(
            8,
            (
                100 -
                lineTension
            ) *
                0.55
        );


    ctx.save();


    /*----------------------------------------------
      LINE COLOUR
    ----------------------------------------------*/

    ctx.strokeStyle =
        lineTension >
        75
            ? "#ff5252"
            : "#f4f6f7";


    ctx.lineWidth =
        lineTension >
        75
            ? 3
            : 1.5;


    /*----------------------------------------------
      LINE
    ----------------------------------------------*/

    ctx.beginPath();


    ctx.moveTo(
        tipX,
        tipY
    );


    ctx.quadraticCurveTo(

        (
            tipX +
            lureX
        ) /
            2,

        (
            tipY +
            lureY
        ) /
            2 +
            sag,

        lureX,
        lureY

    );


    ctx.stroke();


    /*----------------------------------------------
      BOBBER
    ----------------------------------------------*/

    ctx.fillStyle =
        "#f5f5f5";


    ctx.beginPath();

    ctx.arc(
        lureX,
        lureY,
        7,
        0,
        Math.PI *
            2
    );

    ctx.fill();


    ctx.fillStyle =
        "#e53935";


    ctx.beginPath();

    ctx.arc(
        lureX,
        lureY -
            3,
        7,
        Math.PI,
        0
    );

    ctx.fill();


    ctx.restore();
}


/*======================================================
 DRAW FISH
======================================================*/

function drawFish() {

    if (
        ![
            "PHASE2_HOOKED",
            "PHASE2_REELING"
        ].includes(
            state
        )
    ) {

        return;
    }


    const img =
        assets.fish[
            currentFishType
        ];


    if (
        !img.complete ||
        !img.naturalWidth
    ) {

        return;
    }


    ctx.save();


    ctx.globalAlpha =
        0.8;


    ctx.drawImage(

        img,

        lureX -
            42,

        lureY +
            2,

        84,
        60

    );


    ctx.restore();
}


/*======================================================
 RENDER
======================================================*/

function render() {


    /*----------------------------------------------
      PHASE 1 CAMPSITE
    ----------------------------------------------*/

    if (
        state ===
        "PHASE1_SEARCH"
    ) {

        if (
            assets.campsite.complete &&
            assets.campsite.naturalWidth
        ) {

            ctx.drawImage(

                assets.campsite,

                0,
                0,

                width,
                height

            );
        }


        items.forEach(
            item => {

                if (
                    item.collected
                ) {

                    return;
                }


                const img =
                    assets.items[
                        item.key
                    ];


                if (
                    img.complete &&
                    img.naturalWidth
                ) {

                    ctx.save();


                    ctx.shadowColor =
                        "rgba(0,0,0,.55)";

                    ctx.shadowBlur =
                        10;


                    ctx.beginPath();

                    ctx.arc(
                        item.x,
                        item.y,
                        item.radius,
                        0,
                        Math.PI *
                            2
                    );

                    ctx.clip();


                    ctx.drawImage(

                        img,

                        item.x -
                            item.radius *
                                0.9,

                        item.y -
                            item.radius *
                                0.9,

                        item.radius *
                            1.8,

                        item.radius *
                            1.8

                    );


                    ctx.restore();
                }
            }
        );


        return;
    }


    /*----------------------------------------------
      PHASE 2 LAKE
    ----------------------------------------------*/

    if (
        state.startsWith(
            "PHASE2"
        )
    ) {

        /*
            IMPORTANT:

            This uses your NEW lake.png.

            No angler image is drawn.
        */

        if (
            assets.lake.complete &&
            assets.lake.naturalWidth
        ) {

            ctx.drawImage(

                assets.lake,

                0,
                0,

                width,
                height

            );
        }


        /*------------------------------------------
          FIRST PERSON ROD
        ------------------------------------------*/

        const rod =
            drawRod(
                performance.now()
            );


        /*------------------------------------------
          AIMING GUIDE
        ------------------------------------------*/

        if (
            state ===
                "PHASE2_AIM" ||
            state ===
                "PHASE2_POWER"
        ) {

            const targetX =
                width /
                    2 +
                aimAngle *
                    width *
                    0.35;


            const targetY =
                height *
                (
                    0.80 -
                    castPower /
                        100 *
                        0.35
                );


            ctx.save();


            ctx.strokeStyle =
                "rgba(79,195,247,.75)";


            ctx.lineWidth =
                2;


            ctx.setLineDash(
                [
                    7,
                    8
                ]
            );


            ctx.beginPath();


            ctx.moveTo(
                rod.tipX,
                rod.tipY
            );


            ctx.lineTo(
                targetX,
                targetY
            );


            ctx.stroke();


            ctx.restore();
        }


        /*------------------------------------------
          FISHING LINE
        ------------------------------------------*/

        drawLine(
            rod.tipX,
            rod.tipY
        );


        /*------------------------------------------
          FISH
        ------------------------------------------*/

        drawFish();
    }
}


/*======================================================
 MAIN GAME LOOP
======================================================*/

let lastTime =
    performance.now();


function loop(
    now
) {

    const dt =
        Math.min(
            (
                now -
                lastTime
            ) /
                1000,

            0.05
        );


    lastTime =
        now;


    update(
        dt,
        now
    );


    render();


    requestAnimationFrame(
        loop
    );
}


requestAnimationFrame(
    loop
);
