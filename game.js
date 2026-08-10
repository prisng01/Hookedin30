"use strict";

if (window.__OPERATION_BIRTHDAY_MISSION_2_LOADED) {
    console.warn(
        "Mission 2 game.js already loaded. Skipping duplicate initialisation."
    );
} else {

    window.__OPERATION_BIRTHDAY_MISSION_2_LOADED = true;

    (() => {

        /* =========================================================
           GAME STATE
        ========================================================= */

        const game = {
            phase: 0,

            xp: 0,
            score: 0,

            timer: 60,

            /* PHASE 2 = 80 SECONDS */
            fishingTimer: 80,

            itemsFound: 0,
            totalItems: 10,

            fishCaught: 0,
            targetFish: 6,

            bearProgress: 100,

            missionActive: false,
            fishingActive: false
        };


        /* =========================================================
           PHASE 1 ITEMS
        ========================================================= */

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


        /* =========================================================
           CANVAS
        ========================================================= */

        const campCanvas =
            document.getElementById("gameCanvas");

        const campCtx =
            campCanvas
                ? campCanvas.getContext("2d")
                : null;


        const fishingCanvas =
            document.getElementById("fishingCanvas");

        const fishingCtx =
            fishingCanvas
                ? fishingCanvas.getContext("2d")
                : null;


        let campWidth = 0;
        let campHeight = 0;

        let fishingWidth = 0;
        let fishingHeight = 0;


        /* =========================================================
           DOM ELEMENTS
        ========================================================= */

        const loadingScreen =
            document.getElementById("loadingScreen");

        const introScreen =
            document.getElementById("introScreen");

        const gameHUD =
            document.getElementById("gameHUD");

        const inventoryPanel =
            document.getElementById("inventoryPanel");

        const phase1 =
            document.getElementById("phase1");

        const phase1Complete =
            document.getElementById("phase1Complete");

        const phase2 =
            document.getElementById("phase2");

        const missionComplete =
            document.getElementById("missionComplete");

        const terminal =
            document.getElementById("terminal");

        const startMissionButton =
            document.getElementById("startMission");

        const continueFishing =
            document.getElementById("continueFishing");

        const replayMission =
            document.getElementById("replayMission");


        /* =========================================================
           HUD
        ========================================================= */

        const timerText =
            document.getElementById("timer");

        const xpText =
            document.getElementById("xp");

        const scoreText =
            document.getElementById("score");

        const bearProgress =
            document.getElementById("bearProgress");

        const objectiveText =
            document.getElementById("objectiveText");

        const phase1XP =
            document.getElementById("phase1XP");


        const fishCaughtText =
            document.getElementById("fishCaught");

        const fishingTimerText =
            document.getElementById("fishingTimer");

        const fishScoreText =
            document.getElementById("fishScore");

        const powerFill =
            document.getElementById("powerFill");

        const reelFill =
            document.getElementById("reelFill");

        const castRod =
            document.getElementById("castRod");

        const bite =
            document.getElementById("bite");

        const hook =
            document.getElementById("hook");


        /* =========================================================
           EXISTING AUDIO
        ========================================================= */

        const bgMusic =
            document.getElementById("bgMusic");

        const collectSound =
            document.getElementById("collectSound");

        const splashSound =
            document.getElementById("splashSound");

        const successSound =
            document.getElementById("successSound");

        const bearSound =
            document.getElementById("bearSound");


        /* =========================================================
           MISSION START AUDIO
        ========================================================= */

        const missionStartSound =
            new Audio(
                "assets/audio/mission_start.mp3"
            );


        /* =========================================================
           PHASE 2 FISHING AUDIO
        ========================================================= */

        const fishingLakeAudio =
            new Audio(
                "assets/audio/mindmist-fishing-on-the-lake-310740.mp3"
            );

        fishingLakeAudio.loop = true;
        fishingLakeAudio.volume = 0.45;


        const fishingRodWhooshAudio =
            new Audio(
                "assets/audio/spinopel-fishing-rod-whoosh-411640.mp3"
            );

        fishingRodWhooshAudio.volume = 0.75;


        const fishingWindingAudio =
            new Audio(
                "assets/audio/freesound_community-fishingrod-winding-92375.mp3"
            );

        fishingWindingAudio.loop = true;
        fishingWindingAudio.volume = 0.70;


        const fishPullingAudio =
            new Audio(
                "assets/audio/freesound_community-fly-reel-fish-pulling-saricione-94671.mp3"
            );

        fishPullingAudio.volume = 0.80;


        const missionCompleteAudio =
            new Audio(
                "assets/audio/mission-complete.mp3"
            );

        missionCompleteAudio.volume = 0.90;


        /* =========================================================
           IMAGE LOADER
        ========================================================= */

        function loadImage(src) {

            const image =
                new Image();

            image.src = src;

            image.onerror = () => {
                console.warn(
                    "Unable to load image:",
                    src
                );
            };

            return image;
        }


        /* =========================================================
           ASSETS
        ========================================================= */

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


        /* =========================================================
           FISH CATALOGUE
        ========================================================= */

        const FISH_CATALOG = {

            goldFish: {

                name: "GOLD FISH",

                rarity: "COMMON",

                description:
                    "A bright golden freshwater fish with shimmering scales.",

                minWeight: 0.850,

                maxWeight: 1.800,

                coins: 20,

                xp: 40,

                points: 150
            },


            heartFish: {

                name: "HEART FISH",

                rarity: "RARE",

                description:
                    "A rare freshwater fish marked with a distinctive heart pattern.",

                minWeight: 1.000,

                maxWeight: 2.400,

                coins: 30,

                xp: 55,

                points: 200
            },


            rainbowFish: {

                name: "RAINBOW FISH",

                rarity: "SPECIAL",

                description:
                    "A colourful freshwater fish with brilliant rainbow-like scales.",

                minWeight: 1.200,

                maxWeight: 3.200,

                coins: 40,

                xp: 70,

                points: 250
            }
        };


        /* =========================================================
           FISH RECORDS
        ========================================================= */

        const discoveredFish =
            new Set();

        const fishRecords = {};


        let catchResult = null;


        /* =========================================================
           FISHING STATE
        ========================================================= */

        let fishingState =
            "IDLE";

        let reelActive =
            false;

        let powerHoldActive =
            false;

        let powerHoldAnimation =
            null;


        let aimAngle = 0;
        let aimDirection = 1;

        let castPower = 0;
        let castDirection = 1;

        let fishDistance = 100;

        let lineTension = 0;


        let lureX = 0;
        let lureY = 0;


        let currentFish =
            "goldFish";


        let fishPool = [];


        let rodAngle =
            -1.30;

        let rodTargetAngle =
            -1.30;

        let rodKick = 0;

        let reelRotation = 0;


        let phase1Interval = null;
        let fishingInterval = null;

        let fishBiteTimeout = null;

        let fishingRenderStarted = false;

/* =========================================================
   UI HELPERS
========================================================= */

function show(el) {
    if (!el) {
        return;
    }

    el.classList.remove("hidden");
}

function hide(el) {
    if (!el) {
        return;
    }

    el.classList.add("hidden");
}

/* =========================================================
   AUDIO HELPERS
========================================================= */
        function playSound(sound) {

            if (!sound) {
                return;
            }

            try {

                sound.currentTime = 0;

                sound.play().catch(
                    () => {}
                );

            } catch (error) {}
        }


        function stopSound(sound) {

            if (!sound) {
                return;
            }

            try {

                sound.pause();

                sound.currentTime = 0;

            } catch (error) {}
        }


        function unlockFishingAudio() {

            [
                fishingLakeAudio,
                fishingRodWhooshAudio,
                fishingWindingAudio,
                fishPullingAudio,
                missionCompleteAudio
            ].forEach(
                audio => {

                    try {
                        audio.load();
                    } catch (error) {}

                }
            );
        }


        function startFishingMusic() {

            try {

                fishingLakeAudio.currentTime =
                    0;

                fishingLakeAudio
                    .play()
                    .catch(
                        () => {}
                    );

            } catch (error) {}
        }


        function stopFishingMusic() {

            stopSound(
                fishingLakeAudio
            );
        }


        function playFishingRodWhoosh() {

            try {

                fishingRodWhooshAudio.currentTime =
                    0;

                fishingRodWhooshAudio
                    .play()
                    .catch(
                        () => {}
                    );

            } catch (error) {}
        }


        function startFishingWinding() {

            try {

                if (
                    fishingWindingAudio.paused
                ) {

                    fishingWindingAudio
                        .play()
                        .catch(
                            () => {}
                        );
                }

            } catch (error) {}
        }


        function stopFishingWinding() {

            stopSound(
                fishingWindingAudio
            );
        }


        function playFishPullingSound() {

            try {

                fishPullingAudio.currentTime =
                    0;

                fishPullingAudio
                    .play()
                    .catch(
                        () => {}
                    );

            } catch (error) {}
        }


        function stopFishPullingSound() {

            stopSound(
                fishPullingAudio
            );
        }


        function stopAllFishingAudio() {

            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();
        }


        /* =========================================================
           CANVAS RESIZE
        ========================================================= */

        function resizeCanvases() {

            if (campCanvas) {

                const rect =
                    campCanvas.getBoundingClientRect();

                campWidth =
                    campCanvas.width ||
                    rect.width;

                campHeight =
                    campCanvas.height ||
                    rect.height;
            }


            if (fishingCanvas) {

                const rect =
                    fishingCanvas.getBoundingClientRect();

                fishingWidth =
                    fishingCanvas.width ||
                    rect.width;

                fishingHeight =
                    fishingCanvas.height ||
                    rect.height;
            }
        }


        resizeCanvases();

        window.addEventListener(
            "resize",
            resizeCanvases
        );


        /* =========================================================
           MAIN HUD
        ========================================================= */

        function updateMainHUD() {

            if (timerText) {

                timerText.innerText =
                    Math.max(
                        0,
                        Math.ceil(game.timer)
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

                bearProgress.style.width =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            game.bearProgress
                        )
                    ) + "%";
            }


            if (objectiveText) {

                if (game.phase === 1) {

                    objectiveText.innerText =
                        "Find all essential equipment.";

                } else if (game.phase === 2) {

                    objectiveText.innerText =
                        "Catch 6 fish.";

                } else {

                    objectiveText.innerText =
                        "";
                }
            }


            if (phase1XP) {

                phase1XP.innerText =
                    game.xp;
            }
        }


        /* =========================================================
           FISHING HUD
        ========================================================= */

        function updateFishingHUD() {

            if (fishCaughtText) {

                fishCaughtText.innerText =
                    game.fishCaught +
                    " / " +
                    game.targetFish;
            }


            if (fishingTimerText) {

                const seconds =
                    Math.max(
                        0,
                        Math.ceil(
                            game.fishingTimer
                        )
                    );

                const minutes =
                    Math.floor(
                        seconds / 60
                    );

                const remainingSeconds =
                    seconds % 60;


                fishingTimerText.innerText =
                    String(minutes).padStart(
                        2,
                        "0"
                    ) +
                    ":" +
                    String(
                        remainingSeconds
                    ).padStart(
                        2,
                        "0"
                    );


                fishingTimerText.classList.remove(
                    "warning",
                    "danger"
                );


                if (
                    game.fishingTimer <= 20
                ) {

                    fishingTimerText.classList.add(
                        "danger"
                    );

                } else if (
                    game.fishingTimer <= 40
                ) {

                    fishingTimerText.classList.add(
                        "warning"
                    );
                }
            }


            if (fishScoreText) {

                fishScoreText.innerText =
                    game.score;
            }


            if (powerFill) {

                powerFill.style.width =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            castPower
                        )
                    ) + "%";
            }


            if (reelFill) {

                reelFill.style.width =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            lineTension
                        )
                    ) + "%";
            }


            updateCastButton();
        }


        /* =========================================================
           FISH ROTATION
        ========================================================= */

        function shuffleFishPool() {

            fishPool = [
                "goldFish",
                "heartFish",
                "rainbowFish"
            ];


            for (
                let i = fishPool.length - 1;
                i > 0;
                i--
            ) {

                const j =
                    Math.floor(
                        Math.random() *
                        (i + 1)
                    );


                [
                    fishPool[i],
                    fishPool[j]
                ] = [
                    fishPool[j],
                    fishPool[i]
                ];
            }
        }


        function chooseFish() {

            if (
                fishPool.length === 0
            ) {

                shuffleFishPool();
            }


            return (
                fishPool.shift() ||
                "goldFish"
            );
        }


        function randomWeight(fish) {

            return (
                fish.minWeight +
                Math.random() *
                (
                    fish.maxWeight -
                    fish.minWeight
                )
            );
        }


        /* =========================================================
           FISHING BACKGROUND
        ========================================================= */

        function drawFishingBackground() {

            if (!fishingCtx) {
                return;
            }


            if (
                assets.lake &&
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

                drawFishingWaterEffects();

                return;
            }


            /* FALLBACK BACKGROUND */

            const sky =
                fishingCtx.createLinearGradient(
                    0,
                    0,
                    0,
                    fishingHeight * 0.50
                );


            sky.addColorStop(
                0,
                "#8ec9ed"
            );

            sky.addColorStop(
                1,
                "#d8effa"
            );


            fishingCtx.fillStyle =
                sky;

            fishingCtx.fillRect(
                0,
                0,
                fishingWidth,
                fishingHeight * 0.50
            );


            const water =
                fishingCtx.createLinearGradient(
                    0,
                    fishingHeight * 0.45,
                    0,
                    fishingHeight
                );


            water.addColorStop(
                0,
                "#4b9ac1"
            );

            water.addColorStop(
                1,
                "#123e58"
            );


            fishingCtx.fillStyle =
                water;

            fishingCtx.fillRect(
                0,
                fishingHeight * 0.45,
                fishingWidth,
                fishingHeight * 0.55
            );


            fishingCtx.fillStyle =
                "#6a8b5c";


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                0,
                fishingHeight * 0.45
            );


            for (
                let x = 0;
                x <= fishingWidth;
                x += 40
            ) {

                const hill =
                    Math.sin(
                        x * 0.006
                    ) * 25;


                fishingCtx.lineTo(
                    x,
                    fishingHeight * 0.40 +
                    hill
                );
            }


            fishingCtx.lineTo(
                fishingWidth,
                fishingHeight * 0.52
            );

            fishingCtx.lineTo(
                0,
                fishingHeight * 0.52
            );

            fishingCtx.closePath();

            fishingCtx.fill();


            drawFishingWaterEffects();
        }


        /* =========================================================
           WATER ANIMATION
        ========================================================= */

        function drawFishingWaterEffects() {

            if (
                !fishingCtx ||
                game.phase !== 2
            ) {

                return;
            }


            const now =
                Date.now();


            fishingCtx.save();

            fishingCtx.globalAlpha =
                0.12;

            fishingCtx.strokeStyle =
                "#ffffff";

            fishingCtx.lineWidth =
                1;


            for (
                let i = 0;
                i < 8;
                i++
            ) {

                const y =
                    fishingHeight *
                    (
                        0.47 +
                        i * 0.065
                    );


                const offset =
                    (
                        now * 0.0003
                    ) % 1;


                fishingCtx.beginPath();

                fishingCtx.moveTo(
                    -50 +
                    offset * 100,
                    y
                );


                fishingCtx.quadraticCurveTo(
                    fishingWidth * 0.25,
                    y - 4,
                    fishingWidth * 0.50,
                    y
                );


                fishingCtx.quadraticCurveTo(
                    fishingWidth * 0.75,
                    y + 4,
                    fishingWidth + 50,
                    y
                );


                fishingCtx.stroke();
            }


            fishingCtx.restore();
        }


        /* =========================================================
           FISH
        ========================================================= */

        function drawCurrentFish() {

            if (
                !fishingCtx ||
                !currentFish
            ) {

                return;
            }


            const image =
                assets.fish[currentFish];


            if (
                !image ||
                !image.complete ||
                image.naturalWidth === 0
            ) {

                return;
            }


            const ratio =
                fishDistance / 100;


            const fishX =
                lureX +
                Math.sin(
                    Date.now() * 0.002
                ) * 25;


            const fishY =
                lureY +
                25 +
                Math.sin(
                    Date.now() * 0.003
                ) * 12;


            const size =
                Math.min(
                    fishingWidth,
                    fishingHeight
                ) * 0.075;


            fishingCtx.save();


            fishingCtx.globalAlpha =
                fishingState === "BITE"
                    ? 0.85
                    : 0.95;


            fishingCtx.drawImage(
                image,
                fishX - size / 2,
                fishY - size / 2,
                size,
                size
            );


            fishingCtx.restore();
        }


        /* =========================================================
           LURE
        ========================================================= */

        function drawLure() {

            if (
                !fishingCtx ||
                !lureX ||
                !lureY
            ) {

                return;
            }


            fishingCtx.save();


            fishingCtx.fillStyle =
                "#ffffff";


            fishingCtx.shadowColor =
                "rgba(255,255,255,.9)";

            fishingCtx.shadowBlur =
                12;


            fishingCtx.beginPath();

            fishingCtx.arc(
                lureX,
                lureY,
                5,
                0,
                Math.PI * 2
            );

            fishingCtx.fill();


            fishingCtx.shadowBlur =
                0;


            fishingCtx.strokeStyle =
                "rgba(255,255,255,.55)";

            fishingCtx.lineWidth =
                2;


            fishingCtx.beginPath();

            fishingCtx.arc(
                lureX,
                lureY + 5,
                12 +
                Math.sin(
                    Date.now() * 0.006
                ) * 3,
                0,
                Math.PI * 2
            );

            fishingCtx.stroke();


            fishingCtx.restore();
        }


        /* =========================================================
           WATER RIPPLE
        ========================================================= */

        function drawWaterRipple() {

            if (
                !fishingCtx ||
                !lureX ||
                !lureY
            ) {

                return;
            }


            if (
                [
                    "IDLE",
                    "AIMING",
                    "CHARGING",
                    "CASTING"
                ].includes(
                    fishingState
                )
            ) {

                return;
            }


            const pulse =
                (
                    Math.sin(
                        Date.now() * 0.004
                    ) + 1
                ) / 2;


            const radius =
                12 +
                pulse * 14;


            fishingCtx.save();


            fishingCtx.strokeStyle =
                `rgba(255,255,255,${
                    0.35 -
                    pulse * 0.15
                })`;


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


        /* =========================================================
           ROD CONFIGURATION
           
           FIRST-PERSON STYLE:
           Hand is near bottom centre.
           Rod points upward towards lake.
        ========================================================= */

        function getRodGeometry() {

            const handX =
                fishingWidth * 0.52;

            const handY =
                fishingHeight * 0.88;


            const rodLength =
                Math.min(
                    fishingWidth,
                    fishingHeight
                ) * 0.48;


            /*
             * Rod points upward and slightly left,
             * matching the reference fishing view.
             */

            const angle =
                rodAngle;


            const tipX =
                handX +
                Math.cos(angle) *
                rodLength;


            const tipY =
                handY +
                Math.sin(angle) *
                rodLength;


            return {
                handX,
                handY,
                rodLength,
                angle,
                tipX,
                tipY
            };
        }


        /* =========================================================
           FISHING LINE
        ========================================================= */

        function drawFishingLine() {

            if (
                !fishingCtx ||
                !lureX ||
                !lureY
            ) {

                return;
            }


            if (
                [
                    "IDLE",
                    "AIMING",
                    "CHARGING"
                ].includes(
                    fishingState
                )
            ) {

                return;
            }


            const rod =
                getRodGeometry();


            fishingCtx.save();


            /*
             * Shadow line.
             */

            fishingCtx.strokeStyle =
                "rgba(0,0,0,.20)";

            fishingCtx.lineWidth =
                3;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                rod.tipX,
                rod.tipY
            );


            fishingCtx.quadraticCurveTo(
                (
                    rod.tipX +
                    lureX
                ) / 2,

                (
                    rod.tipY +
                    lureY
                ) / 2 +
                12,

                lureX,
                lureY
            );


            fishingCtx.stroke();


            /*
             * Actual fishing line.
             */

            fishingCtx.strokeStyle =
                "rgba(245,248,250,.92)";

            fishingCtx.lineWidth =
                1.4;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                rod.tipX,
                rod.tipY
            );


            fishingCtx.quadraticCurveTo(
                (
                    rod.tipX +
                    lureX
                ) / 2,

                (
                    rod.tipY +
                    lureY
                ) / 2 -
                10,

                lureX,
                lureY
            );


            fishingCtx.stroke();


            fishingCtx.restore();
        }


        /* =========================================================
           REALISTIC FIRST-PERSON FISHING ROD
        ========================================================= */

        function drawFishingRod() {

            if (!fishingCtx) {
                return;
            }


            const rod =
                getRodGeometry();


            fishingCtx.save();


            fishingCtx.translate(
                rod.handX,
                rod.handY
            );


            fishingCtx.rotate(
                rod.angle
            );


            /*
             * =====================================================
             * ROD SHAFT
             * =====================================================
             */

            const rodLength =
                rod.rodLength;


            /*
             * Shadow.
             */

            fishingCtx.save();

            fishingCtx.globalAlpha =
                0.25;

            fishingCtx.strokeStyle =
                "#000000";

            fishingCtx.lineWidth =
                12;

            fishingCtx.lineCap =
                "round";


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                0,
                0
            );

            fishingCtx.lineTo(
                rodLength,
                0
            );

            fishingCtx.stroke();

            fishingCtx.restore();


            /*
             * Rod gradient.
             */

            const rodGradient =
                fishingCtx.createLinearGradient(
                    0,
                    -5,
                    0,
                    5
                );


            rodGradient.addColorStop(
                0,
                "#d0a06a"
            );

            rodGradient.addColorStop(
                0.35,
                "#744726"
            );

            rodGradient.addColorStop(
                0.7,
                "#3c2719"
            );

            rodGradient.addColorStop(
                1,
                "#1f1712"
            );


            fishingCtx.strokeStyle =
                rodGradient;

            fishingCtx.lineWidth =
                8;

            fishingCtx.lineCap =
                "round";


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                0,
                0
            );

            fishingCtx.lineTo(
                rodLength,
                0
            );

            fishingCtx.stroke();


            /*
             * Highlight on rod.
             */

            fishingCtx.strokeStyle =
                "rgba(255,255,255,.28)";

            fishingCtx.lineWidth =
                2;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                5,
                -2
            );

            fishingCtx.lineTo(
                rodLength - 10,
                -2
            );

            fishingCtx.stroke();


            /*
             * =====================================================
             * ROD GUIDES
             * =====================================================
             */

            const guidePositions = [
                0.18,
                0.35,
                0.52,
                0.68,
                0.82,
                0.93
            ];


            guidePositions.forEach(
                position => {

                    const gx =
                        rodLength *
                        position;


                    fishingCtx.strokeStyle =
                        "rgba(210,220,225,.9)";

                    fishingCtx.lineWidth =
                        2;


                    fishingCtx.beginPath();

                    fishingCtx.arc(
                        gx,
                        0,
                        5,
                        0,
                        Math.PI
                    );

                    fishingCtx.stroke();
                }
            );


            /*
             * =====================================================
             * HANDLE / CORK GRIP
             * =====================================================
             */

            const gripLength =
                Math.min(
                    55,
                    fishingWidth * 0.045
                );


            const gripGradient =
                fishingCtx.createLinearGradient(
                    -gripLength,
                    0,
                    0,
                    0
                );


            gripGradient.addColorStop(
                0,
                "#5a321e"
            );

            gripGradient.addColorStop(
                0.45,
                "#b97846"
            );

            gripGradient.addColorStop(
                0.75,
                "#d29a65"
            );

            gripGradient.addColorStop(
                1,
                "#6e3d22"
            );


            fishingCtx.fillStyle =
                gripGradient;


            fishingCtx.beginPath();


            if (
                typeof fishingCtx.roundRect ===
                "function"
            ) {

                fishingCtx.roundRect(
                    -gripLength,
                    -10,
                    gripLength,
                    20,
                    8
                );

            } else {

                fishingCtx.rect(
                    -gripLength,
                    -10,
                    gripLength,
                    20
                );
            }


            fishingCtx.fill();


            /*
             * Grip rings.
             */

            fishingCtx.strokeStyle =
                "rgba(45,22,12,.7)";

            fishingCtx.lineWidth =
                2;


            for (
                let i = 8;
                i < gripLength;
                i += 10
            ) {

                fishingCtx.beginPath();

                fishingCtx.moveTo(
                    -i,
                    -9
                );

                fishingCtx.lineTo(
                    -i,
                    9
                );

                fishingCtx.stroke();
            }


            /*
             * =====================================================
             * REEL MOUNT
             * =====================================================
             */

            const reelX =
                -2;

            const reelY =
                22;


            fishingCtx.strokeStyle =
                "#343a3f";

            fishingCtx.lineWidth =
                5;

            fishingCtx.lineCap =
                "round";


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                reelX,
                5
            );

            fishingCtx.lineTo(
                reelX,
                reelY
            );

            fishingCtx.stroke();


            /*
             * =====================================================
             * REEL BODY
             * =====================================================
             */

            const reelGradient =
                fishingCtx.createRadialGradient(
                    reelX,
                    reelY,
                    2,
                    reelX,
                    reelY,
                    18
                );


            reelGradient.addColorStop(
                0,
                "#c7cdd1"
            );

            reelGradient.addColorStop(
                0.4,
                "#697177"
            );

            reelGradient.addColorStop(
                0.75,
                "#373d42"
            );

            reelGradient.addColorStop(
                1,
                "#181c20"
            );


            fishingCtx.fillStyle =
                reelGradient;


            fishingCtx.beginPath();

            fishingCtx.arc(
                reelX,
                reelY,
                17,
                0,
                Math.PI * 2
            );

            fishingCtx.fill();


            /*
             * Reel outer ring.
             */

            fishingCtx.strokeStyle =
                "#aeb5ba";

            fishingCtx.lineWidth =
                2;


            fishingCtx.beginPath();

            fishingCtx.arc(
                reelX,
                reelY,
                12,
                0,
                Math.PI * 2
            );

            fishingCtx.stroke();


            /*
             * =====================================================
             * REEL SPOOL
             * =====================================================
             */

            fishingCtx.save();

            fishingCtx.translate(
                reelX,
                reelY
            );

            fishingCtx.rotate(
                reelRotation
            );


            fishingCtx.strokeStyle =
                "#e2e6e8";

            fishingCtx.lineWidth =
                2;


            for (
                let i = 0;
                i < 4;
                i++
            ) {

                const a =
                    (
                        Math.PI * 2 /
                        4
                    ) * i;


                fishingCtx.beginPath();

                fishingCtx.moveTo(
                    Math.cos(a) * 3,
                    Math.sin(a) * 3
                );

                fishingCtx.lineTo(
                    Math.cos(a) * 11,
                    Math.sin(a) * 11
                );

                fishingCtx.stroke();
            }


            fishingCtx.restore();


            /*
             * Reel centre.
             */

            fishingCtx.fillStyle =
                "#171b1f";


            fishingCtx.beginPath();

            fishingCtx.arc(
                reelX,
                reelY,
                4,
                0,
                Math.PI * 2
            );

            fishingCtx.fill();


            /*
             * =====================================================
             * REEL HANDLE
             * =====================================================
             */

            const crankAngle =
                reelRotation;


            const crankX =
                reelX +
                Math.cos(
                    crankAngle
                ) * 23;


            const crankY =
                reelY +
                Math.sin(
                    crankAngle
                ) * 23;


            fishingCtx.strokeStyle =
                "#4b5257";

            fishingCtx.lineWidth =
                3;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                reelX,
                reelY
            );

            fishingCtx.lineTo(
                crankX,
                crankY
            );

            fishingCtx.stroke();


            fishingCtx.fillStyle =
                "#161a1e";


            fishingCtx.beginPath();

            fishingCtx.arc(
                crankX,
                crankY,
                5,
                0,
                Math.PI * 2
            );

            fishingCtx.fill();


            /*
             * =====================================================
             * HAND
             * =====================================================
             *
             * Drawn at the bottom of the rod so it resembles
             * the first-person fishing reference.
             */

            fishingCtx.save();


            fishingCtx.translate(
                -4,
                37
            );


            fishingCtx.rotate(
                -0.08
            );


            /*
             * Wrist / palm shadow.
             */

            fishingCtx.fillStyle =
                "rgba(0,0,0,.18)";


            fishingCtx.beginPath();

            fishingCtx.ellipse(
                0,
                10,
                18,
                29,
                0,
                0,
                Math.PI * 2
            );

            fishingCtx.fill();


            /*
             * Palm.
             */

            const skinGradient =
                fishingCtx.createLinearGradient(
                    -12,
                    -10,
                    16,
                    25
                );


            skinGradient.addColorStop(
                0,
                "#f4c5a2"
            );

            skinGradient.addColorStop(
                0.5,
                "#d99a76"
            );

            skinGradient.addColorStop(
                1,
                "#a9654b"
            );


            fishingCtx.fillStyle =
                skinGradient;


            fishingCtx.beginPath();

            fishingCtx.ellipse(
                0,
                8,
                15,
                25,
                0,
                0,
                Math.PI * 2
            );

            fishingCtx.fill();


            /*
             * Fingers wrapped around rod.
             */

            fishingCtx.strokeStyle =
                "rgba(125,67,50,.6)";

            fishingCtx.lineWidth =
                3;


            for (
                let i = -7;
                i <= 7;
                i += 7
            ) {

                fishingCtx.beginPath();

                fishingCtx.moveTo(
                    i,
                    -4
                );

                fishingCtx.quadraticCurveTo(
                    i + 9,
                    4,
                    i + 7,
                    12
                );

                fishingCtx.stroke();
            }


            fishingCtx.restore();


            fishingCtx.restore();
        }


        /* =========================================================
           FISHING GLOW
        ========================================================= */

        function drawFishingLureGlow() {

            if (
                !fishingCtx ||
                !lureX ||
                !lureY
            ) {

                return;
            }


            const pulse =
                (
                    Math.sin(
                        Date.now() * 0.012
                    ) + 1
                ) / 2;


            fishingCtx.save();


            fishingCtx.globalAlpha =
                0.15 +
                pulse * 0.20;


            fishingCtx.strokeStyle =
                "#ffffff";

            fishingCtx.lineWidth =
                3;


            fishingCtx.beginPath();

            fishingCtx.arc(
                lureX,
                lureY,
                18 +
                pulse * 10,
                0,
                Math.PI * 2
            );

            fishingCtx.stroke();


            fishingCtx.restore();
        }


        /* =========================================================
           BITE EFFECT
        ========================================================= */

        function drawBiteEffect() {

            if (
                !fishingCtx ||
                fishingState !== "BITE"
            ) {

                return;
            }


            const pulse =
                (
                    Math.sin(
                        Date.now() * 0.015
                    ) + 1
                ) / 2;


            fishingCtx.save();


            fishingCtx.globalAlpha =
                0.5 +
                pulse * 0.5;


            fishingCtx.strokeStyle =
                "#ffffff";

            fishingCtx.lineWidth =
                3;


            fishingCtx.beginPath();

            fishingCtx.arc(
                lureX,
                lureY,
                25 +
                pulse * 18,
                0,
                Math.PI * 2
            );

            fishingCtx.stroke();


            fishingCtx.restore();
        }


        /* =========================================================
           FISHING HUD ON CANVAS
        ========================================================= */

        function drawFishingCanvasHUD() {

            if (
                !fishingCtx ||
                game.phase !== 2
            ) {

                return;
            }


            /*
             * Current fish name.
             */

            if (
                currentFish &&
                [
                    "WAITING",
                    "BITE",
                    "HOOKED",
                    "REELING"
                ].includes(
                    fishingState
                )
            ) {

                const catalog =
                    FISH_CATALOG[
                        currentFish
                    ];


                if (catalog) {

                    fishingCtx.save();

                    fishingCtx.textAlign =
                        "center";


                    fishingCtx.font =
                        "800 18px Arial";


                    fishingCtx.fillStyle =
                        "rgba(0,0,0,.55)";


                    fishingCtx.fillText(
                        catalog.name,
                        fishingWidth * 0.5,
                        fishingHeight * 0.15
                    );


                    fishingCtx.fillStyle =
                        "#ffffff";


                    fishingCtx.fillText(
                        catalog.name,
                        fishingWidth * 0.5,
                        fishingHeight * 0.145
                    );


                    fishingCtx.restore();
                }
            }


            let stateText =
                "";


            switch (
                fishingState
            ) {

                case "IDLE":
                    stateText =
                        "CAST YOUR ROD";
                    break;

                case "AIMING":
                    stateText =
                        "AIM TOWARDS THE LAKE";
                    break;

                case "CHARGING":
                    stateText =
                        "CHARGE POWER";
                    break;

                case "CASTING":
                    stateText =
                        "CASTING...";
                    break;

                case "WAITING":
                    stateText =
                        "WAIT FOR A BITE...";
                    break;

                case "BITE":
                    stateText =
                        "FISH BITING!";
                    break;

                case "HOOKED":
                    stateText =
                        "FISH HOOKED!";
                    break;

                case "REELING":
                    stateText =
                        "REELING IN...";
                    break;

                case "CAUGHT":
                    stateText =
                        "FISH CAUGHT!";
                    break;
            }


            if (stateText) {

                fishingCtx.save();

                fishingCtx.textAlign =
                    "center";

                fishingCtx.font =
                    "800 18px Arial";


                fishingCtx.fillStyle =
                    "rgba(0,0,0,.45)";


                fishingCtx.fillText(
                    stateText,
                    fishingWidth * 0.5,
                    fishingHeight * 0.94
                );


                fishingCtx.fillStyle =
                    "#ffffff";


                fishingCtx.fillText(
                    stateText,
                    fishingWidth * 0.5,
                    fishingHeight * 0.935
                );


                fishingCtx.restore();
            }
        }


        /* =========================================================
           CATCH RESULT CARD
           
           Styled to resemble the reference screenshot.
        ========================================================= */

        function drawCatchResultCard() {

            if (
                !fishingCtx ||
                !catchResult
            ) {

                return;
            }


            const cardW =
                Math.min(
                    450,
                    fishingWidth * 0.46
                );


            const cardH =
                Math.min(
                    245,
                    fishingHeight * 0.34
                );


            const x =
                18;

            const y =
                18;


            fishingCtx.save();


            /*
             * Main dark card.
             */

            fishingCtx.fillStyle =
                "rgba(8,22,29,.94)";


            fishingCtx.beginPath();


            if (
                typeof fishingCtx.roundRect ===
                "function"
            ) {

                fishingCtx.roundRect(
                    x,
                    y,
                    cardW,
                    cardH,
                    14
                );

            } else {

                fishingCtx.rect(
                    x,
                    y,
                    cardW,
                    cardH
                );
            }


            fishingCtx.fill();


            /*
             * Cyan border.
             */

            fishingCtx.strokeStyle =
                "rgba(65,225,215,.75)";

            fishingCtx.lineWidth =
                2;


            fishingCtx.stroke();


            /*
             * Top accent.
             */

            fishingCtx.fillStyle =
                "#39d9cf";


            fishingCtx.fillRect(
                x,
                y,
                Math.min(
                    155,
                    cardW * 0.40
                ),
                5
            );


            /*
             * Fish image.
             */

            const fishImage =
                assets.fish[
                    catchResult.fishKey
                ];


            if (
                fishImage &&
                fishImage.complete &&
                fishImage.naturalWidth > 0
            ) {

                const imageSize =
                    Math.min(
                        90,
                        cardH * 0.38
                    );


                fishingCtx.save();


                fishingCtx.globalAlpha =
                    1;


                fishingCtx.drawImage(
                    fishImage,
                    x +
                    cardW -
                    imageSize -
                    15,
                    y + 15,
                    imageSize,
                    imageSize
                );


                fishingCtx.restore();
            }


            /*
             * Fish name.
             */

            fishingCtx.textAlign =
                "left";


            fishingCtx.font =
                "800 22px Arial";


            fishingCtx.fillStyle =
                "#ffffff";


            fishingCtx.fillText(
                catchResult.name,
                x + 18,
                y + 34
            );


            /*
             * Rarity.
             */

            fishingCtx.font =
                "800 11px Arial";


            if (
                catchResult.rarity ===
                "COMMON"
            ) {

                fishingCtx.fillStyle =
                    "#4ed9e6";

            } else if (
                catchResult.rarity ===
                "RARE"
            ) {

                fishingCtx.fillStyle =
                    "#f2c94c";

            } else {

                fishingCtx.fillStyle =
                    "#ff77d5";
            }


            fishingCtx.fillText(
                catchResult.rarity,
                x + 18,
                y + 53
            );


            /*
             * Weight.
             */

            fishingCtx.font =
                "800 16px Arial";

            fishingCtx.fillStyle =
                "#ffffff";


            fishingCtx.fillText(
                "⚖ " +
                catchResult.weight.toFixed(3) +
                " kg",
                x + 18,
                y + 80
            );


            /*
             * Description.
             */

            fishingCtx.font =
                "600 11px Arial";

            fishingCtx.fillStyle =
                "rgba(255,255,255,.78)";


            const description =
                catchResult.description;


            /*
             * Wrap description.
             */

            const maxTextWidth =
                cardW - 36;


            const words =
                description.split(" ");


            let line = "";

            let lineY =
                y + 101;


            for (
                let i = 0;
                i < words.length;
                i++
            ) {

                const testLine =
                    line +
                    words[i] +
                    " ";


                if (
                    fishingCtx.measureText(
                        testLine
                    ).width >
                    maxTextWidth
                ) {

                    fishingCtx.fillText(
                        line,
                        x + 18,
                        lineY
                    );


                    line =
                        words[i] +
                        " ";

                    lineY +=
                        15;

                } else {

                    line =
                        testLine;
                }
            }


            if (line) {

                fishingCtx.fillText(
                    line,
                    x + 18,
                    lineY
                );
            }


            /*
             * Bottom statistics.
             */

            const statY =
                y +
                cardH -
                48;


            fishingCtx.font =
                "800 13px Arial";


            fishingCtx.fillStyle =
                "#ffffff";


            fishingCtx.fillText(
                "🪙 " +
                catchResult.coins,
                x + 18,
                statY
            );


            fishingCtx.fillText(
                "⭐ " +
                catchResult.xp +
                " XP",
                x + 100,
                statY
            );


            fishingCtx.fillText(
                "★ " +
                catchResult.points,
                x + 205,
                statY
            );


            /*
             * NEW SPECIES / NEW RECORD.
             */

            fishingCtx.font =
                "900 10px Arial";


            let badgeX =
                x + 18;


            if (
                catchResult.newSpecies
            ) {

                fishingCtx.fillStyle =
                    "#1f9d8f";


                fishingCtx.fillText(
                    "NEW SPECIES",
                    badgeX,
                    statY + 22
                );


                badgeX += 100;
            }


            if (
                catchResult.newRecord
            ) {

                fishingCtx.fillStyle =
                    "#f0a72d";


                fishingCtx.fillText(
                    "NEW RECORD",
                    badgeX,
                    statY + 22
                );
            }


            fishingCtx.restore();
        }


        /* =========================================================
           COMPLETE FISHING SCENE
        ========================================================= */

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


            drawFishingBackground();


            /*
             * Fish is visible in water once the
             * player has cast and fish is active.
             */

            if (
                [
                    "WAITING",
                    "BITE",
                    "HOOKED",
                    "REELING"
                ].includes(
                    fishingState
                )
            ) {

                drawCurrentFish();
            }


            drawFishingLine();

            drawLure();

            drawFishingLureGlow();

            drawWaterRipple();

            drawBiteEffect();

            drawFishingRod();

            drawFishingCanvasHUD();


            if (
                catchResult &&
                fishingState === "CAUGHT"
            ) {

                drawCatchResultCard();
            }


            if (
                game.phase === 2 &&
                game.fishingActive
            ) {

                requestAnimationFrame(
                    drawFishingScene
                );
            }
        }


        function startFishingRenderLoop() {

            if (
                !fishingRenderStarted
            ) {

                fishingRenderStarted =
                    true;

                drawFishingScene();
            }
        }


        /* =========================================================
           CAST BUTTON TEXT
        ========================================================= */

        function updateCastButton() {

            if (!castRod) {
                return;
            }


            const labels = {

                IDLE:
                    "🎣 CAST ROD",

                AIMING:
                    "🎯 AIM",

                CHARGING:
                    "⚡ CAST!",

                CASTING:
                    "🌊 CASTING...",

                WAITING:
                    "🎣 WAITING...",

                BITE:
                    "❗ HOOK FISH!",

                HOOKED:
                    "🌀 REEL IN",

                REELING:
                    "🌀 REELING...",

                CAUGHT:
                    "🐟 CAUGHT!"
            };


            castRod.innerText =
                labels[
                    fishingState
                ] ||
                "🎣 CAST ROD";
        }


        /* =========================================================
           RESET FISHING ATTEMPT
        ========================================================= */

        function resetFishingAttempt() {

            stopFishingWinding();

            stopFishPullingSound();

            clearTimeout(
                fishBiteTimeout
            );


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
                100;


            lineTension =
                0;


            /*
             * Keep the next fish already prepared.
             */

            if (
                fishPool.length === 0
            ) {

                shuffleFishPool();
            }


            currentFish =
                fishPool[0] ||
                "goldFish";


            lureX =
                0;

            lureY =
                0;


            rodAngle =
                -1.30;

            rodTargetAngle =
                -1.30;


            rodKick =
                0;


            if (bite) {
                hide(bite);
            }


            if (hook) {
                hide(hook);
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


        /* =========================================================
           CAST HANDLER
        ========================================================= */

        function handleCastRod() {

            if (
                game.phase !== 2 ||
                !game.fishingActive
            ) {

                return;
            }


            if (
                fishingState ===
                "IDLE"
            ) {

                fishingState =
                    "AIMING";


                aimAngle =
                    0;

                aimDirection =
                    1;


                /*
                 * Point rod towards lake.
                 */

                rodTargetAngle =
                    -1.30;


                updateFishingHUD();

                return;
            }


            if (
                fishingState ===
                "AIMING"
            ) {

                fishingState =
                    "CHARGING";


                castPower =
                    0;

                castDirection =
                    1;

                powerHoldActive =
                    true;


                powerHoldAnimation =
                    requestAnimationFrame(
                        chargePowerLoop
                    );


                updateFishingHUD();

                return;
            }


            if (
                fishingState ===
                "CHARGING"
            ) {

                releaseCast();

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


        /* =========================================================
           AIM
        ========================================================= */

        function updateAim() {

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
                aimAngle >= 1
            ) {

                aimAngle =
                    1;

                aimDirection =
                    -1;

            } else if (
                aimAngle <= -1
            ) {

                aimAngle =
                    -1;

                aimDirection =
                    1;
            }


            /*
             * Keep rod directed toward the water.
             * Only a small movement is allowed.
             */

            rodTargetAngle =
                -1.30 +
                aimAngle * 0.10;


            requestAnimationFrame(
                updateAim
            );
        }


        /* =========================================================
           POWER CHARGE
        ========================================================= */

        function chargePowerLoop() {

            if (
                !powerHoldActive ||
                fishingState !==
                "CHARGING"
            ) {

                return;
            }


            castPower +=
                castDirection *
                1.5;


            if (
                castPower >= 100
            ) {

                castPower =
                    100;

                castDirection =
                    -1;

            } else if (
                castPower <= 0
            ) {

                castPower =
                    0;

                castDirection =
                    1;
            }


            updateFishingHUD();


            /*
             * Small rod movement while charging.
             */

            rodTargetAngle =
                -1.30 -
                (
                    castPower / 100
                ) *
                0.06;


            powerHoldAnimation =
                requestAnimationFrame(
                    chargePowerLoop
                );
        }


        /* =========================================================
           RELEASE CAST
           
           IMPORTANT:
           The lure is always placed in the lake/water area.
           It can no longer be thrown into the sky.
        ========================================================= */

        function releaseCast() {

            powerHoldActive =
                false;


            if (
                powerHoldAnimation
            ) {

                cancelAnimationFrame(
                    powerHoldAnimation
                );

                powerHoldAnimation =
                    null;
            }


            fishingState =
                "CASTING";


            rodKick =
                0.20;


            playFishingRodWhoosh();


            const powerRatio =
                Math.max(
                    0.20,
                    castPower / 100
                );


            /*
             * Water begins approximately here.
             *
             * The lure will NEVER be placed
             * above this area.
             */

            const waterTop =
                fishingHeight *
                0.53;


            /*
             * Target stays comfortably inside
             * the lake.
             */

            const targetX =
                fishingWidth *
                (
                    0.48 +
                    0.28 *
                    powerRatio
                );


            const targetY =
                fishingHeight *
                (
                    0.62 +
                    0.10 *
                    powerRatio
                );


            const startX =
                fishingWidth *
                0.52;


            const startY =
                fishingHeight *
                0.78;


            lureX =
                startX;

            lureY =
                startY;


            fishDistance =
                100;

            lineTension =
                0;


            rodTargetAngle =
                -1.18;


            updateFishingHUD();


            /*
             * Animate lure into the lake.
             */

            let frame =
                0;


            const totalFrames =
                42;


            function animateCast() {

                if (
                    game.phase !== 2 ||
                    !game.fishingActive
                ) {

                    return;
                }


                const progress =
                    Math.min(
                        1,
                        frame /
                        totalFrames
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 -
                        progress,
                        3
                    );


                lureX =
                    startX +
                    (
                        targetX -
                        startX
                    ) *
                    eased;


                /*
                 * Arc is deliberately small.
                 *
                 * Most importantly:
                 * lure Y is clamped to water.
                 */

                const arc =
                    Math.sin(
                        progress *
                        Math.PI
                    ) *
                    35;


                lureY =
                    startY +
                    (
                        targetY -
                        startY
                    ) *
                    eased -
                    arc;


                /*
                 * HARD WATER CLAMP.
                 */

                lureY =
                    Math.max(
                        waterTop,
                        lureY
                    );


                /*
                 * Rod follows cast.
                 */

                rodTargetAngle =
                    -1.30 +
                    progress *
                    0.10;


                frame++;


                drawFishingScene();


                if (
                    frame <=
                    totalFrames
                ) {

                    requestAnimationFrame(
                        animateCast
                    );

                } else {

                    /*
                     * Final position is guaranteed
                     * to be inside the lake.
                     */

                    lureX =
                        targetX;

                    lureY =
                        Math.max(
                            waterTop,
                            targetY
                        );


                    fishingState =
                        "WAITING";


                    rodTargetAngle =
                        -1.22;


                    updateFishingHUD();


                    /*
                     * Splash.
                     */

                    playSound(
                        splashSound
                    );


                    const delay =
                        1200 +
                        Math.random() *
                        2500;


                    clearTimeout(
                        fishBiteTimeout
                    );


                    fishBiteTimeout =
                        setTimeout(
                            triggerFishBite,
                            delay
                        );
                }
            }


            animateCast();
        }


        /* =========================================================
           FISH BITE
        ========================================================= */

        function triggerFishBite() {

            if (
                game.phase !== 2 ||
                !game.fishingActive ||
                fishingState !==
                "WAITING"
            ) {

                return;
            }


            fishingState =
                "BITE";


            /*
             * Choose from fish rotation.
             */

            currentFish =
                chooseFish();


            fishDistance =
                100;


            lineTension =
                20;


            rodTargetAngle =
                -1.20;


            if (bite) {

                show(bite);

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
                    3000
                );
        }


        /* =========================================================
           HOOK FISH
        ========================================================= */

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
                hide(bite);
            }


            if (hook) {

                show(hook);

                hook.innerText =
                    "🎣 HOOKED!";
            }


            rodTargetAngle =
                -1.10;


            if (castRod) {

                castRod.innerText =
                    "🌀 REEL IN";
            }


            playSound(
                splashSound
            );


            fishFightLoop();
        }


        /* =========================================================
           FISH FIGHT
        ========================================================= */

        function fishFightLoop() {

            if (
                ![
                    "HOOKED",
                    "REELING"
                ].includes(
                    fishingState
                )
            ) {

                return;
            }


            /*
             * Fish tries to swim away.
             */

            if (
                fishingState ===
                "HOOKED"
            ) {

                fishDistance +=
                    0.30;

            } else {

                fishDistance +=
                    0.16;
            }


            fishDistance =
                Math.max(
                    0,
                    Math.min(
                        100,
                        fishDistance
                    )
                );


            /*
             * Fish pulling.
             */

            if (
                Math.random() <
                0.018
            ) {

                lineTension +=
                    4;


                playFishPullingSound();
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


        /* =========================================================
           START REELING
        ========================================================= */

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
                -1.05;


            startFishingWinding();


            if (castRod) {

                castRod.innerText =
                    "🌀 REELING...";
            }


            updateFishingHUD();


            reelLoop();
        }


        /* =========================================================
           STOP REELING
        ========================================================= */

        function stopReeling() {

            if (
                fishingState !==
                "REELING"
            ) {

                return;
            }


            reelActive =
                false;


            stopFishingWinding();


            fishingState =
                "HOOKED";


            rodTargetAngle =
                -1.10;


            if (castRod) {

                castRod.innerText =
                    "🌀 REEL IN";
            }


            drawFishingScene();


            fishFightLoop();
        }


        /* =========================================================
           REEL LOOP
        ========================================================= */

        function reelLoop() {

            if (
                fishingState !==
                "REELING"
            ) {

                return;
            }


            reelRotation +=
                0.35;


            /*
             * Reel brings fish closer.
             */

            fishDistance -=
                1.55;


            /*
             * Some tension is generated
             * while reeling.
             */

            lineTension +=
                0.45;


            /*
             * Fish may pull back.
             */

            if (
                Math.random() <
                0.025
            ) {

                fishDistance +=
                    2.5;


                lineTension +=
                    3;


                playFishPullingSound();
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


        /* =========================================================
           CATCH FISH
        ========================================================= */

        function catchFish() {

            if (
                game.phase !== 2 ||
                !game.fishingActive
            ) {

                return;
            }


            stopFishingWinding();

            stopFishPullingSound();


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


            const fish =
                FISH_CATALOG[
                    currentFish
                ] ||
                FISH_CATALOG.goldFish;


            const weight =
                randomWeight(
                    fish
                );


            const newSpecies =
                !discoveredFish.has(
                    currentFish
                );


            const oldRecord =
                fishRecords[
                    currentFish
                ] || 0;


            const newRecord =
                weight >
                oldRecord;


            discoveredFish.add(
                currentFish
            );


            if (newRecord) {

                fishRecords[
                    currentFish
                ] =
                    weight;
            }


            game.fishCaught++;


            game.score +=
                fish.points;


            game.xp +=
                fish.xp;


            catchResult = {

                fishKey:
                    currentFish,

                name:
                    fish.name,

                rarity:
                    fish.rarity,

                description:
                    fish.description,

                weight:
                    weight,

                coins:
                    fish.coins,

                xp:
                    fish.xp,

                points:
                    fish.points,

                newSpecies:
                    newSpecies,

                newRecord:
                    newRecord
            };


            if (hook) {
                hide(hook);
            }


            if (bite) {
                hide(bite);
            }


            if (castRod) {

                castRod.innerText =
                    "🐟 CAUGHT!";
            }


            updateMainHUD();

            updateFishingHUD();

            drawFishingScene();


            /*
             * Leave the catch card visible briefly
             * before the next cast.
             */

            setTimeout(
                () => {

                    if (
                        game.phase !== 2 ||
                        !game.fishingActive
                    ) {

                        return;
                    }


                    if (
                        game.fishCaught >=
                        game.targetFish
                    ) {

                        endMission();

                        return;
                    }


                    catchResult =
                        null;


                    resetFishingAttempt();

                },
                2200
            );
        }


        /* =========================================================
           FISH ESCAPES
        ========================================================= */

        function fishEscaped() {

            clearTimeout(
                fishBiteTimeout
            );


            stopFishingWinding();

            stopFishPullingSound();


            fishingState =
                "IDLE";


            reelActive =
                false;


            lineTension =
                0;


            fishDistance =
                100;


            lureX =
                0;

            lureY =
                0;


            rodAngle =
                -1.30;

            rodTargetAngle =
                -1.30;


            if (bite) {
                hide(bite);
            }


            if (hook) {
                hide(hook);
            }


            if (castRod) {

                castRod.innerText =
                    "🎣 CAST ROD";
            }


            updateFishingHUD();

            drawFishingScene();
        }


        /* =========================================================
           ROD ANIMATION
        ========================================================= */

        function updateRodAnimation() {

            rodAngle +=
                (
                    rodTargetAngle -
                    rodAngle
                ) *
                0.10;


            rodKick *=
                0.86;


            if (reelActive) {

                reelRotation +=
                    0.20;
            }
        }


        /* =========================================================
           FISHING TIMER
           
           80 SECONDS
        ========================================================= */

        function updateFishingTimer() {

            if (
                game.phase !== 2 ||
                !game.fishingActive
            ) {

                return;
            }


            game.fishingTimer -=
                0.1;


            if (
                game.fishingTimer <=
                0
            ) {

                game.fishingTimer =
                    0;

                game.fishingActive =
                    false;


                stopAllFishingAudio();


                clearTimeout(
                    fishBiteTimeout
                );


                if (fishingInterval) {

                    clearInterval(
                        fishingInterval
                    );

                    fishingInterval =
                        null;
                }


                endMission();

                return;
            }


            updateFishingHUD();
        }


        /* =========================================================
           START PHASE 2
        ========================================================= */

        function startFishingPhase() {

            game.phase =
                2;


            game.fishingActive =
                true;


            game.missionActive =
                true;


            /*
             * 80 SECOND TIMER
             */

            game.fishingTimer =
                80;


            game.fishCaught =
                0;


            game.targetFish =
                6;


            catchResult =
                null;


            /*
             * Start a new fish rotation.
             */

            shuffleFishPool();


            currentFish =
                fishPool[0] ||
                "goldFish";


            fishingState =
                "IDLE";


            reelActive =
                false;


            powerHoldActive =
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
                100;

            lineTension =
                0;


            lureX =
                0;

            lureY =
                0;


            /*
             * First-person rod starts at bottom
             * pointing toward the lake.
             */

            rodAngle =
                -1.30;

            rodTargetAngle =
                -1.30;


            rodKick =
                0;


            reelRotation =
                0;


            if (powerHoldAnimation) {

                cancelAnimationFrame(
                    powerHoldAnimation
                );

                powerHoldAnimation =
                    null;
            }


            clearTimeout(
                fishBiteTimeout
            );


            hide(introScreen);

            hide(phase1);

            hide(phase1Complete);

            hide(gameHUD);

            hide(inventoryPanel);


            show(phase2);


            /*
             * Fishing music.
             */

            startFishingMusic();


            startFishingRenderLoop();


            if (fishingInterval) {

                clearInterval(
                    fishingInterval
                );
            }


            /*
             * Timer ticks every 100ms
             * so 80 seconds is accurately tracked.
             */

            fishingInterval =
                setInterval(
                    updateFishingTimer,
                    100
                );


            updateFishingHUD();

            drawFishingScene();
        }


        /* =========================================================
           END MISSION
        ========================================================= */

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


            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


            clearTimeout(
                fishBiteTimeout
            );


            if (fishingInterval) {

                clearInterval(
                    fishingInterval
                );

                fishingInterval =
                    null;
            }


            /*
             * Mission completion audio.
             */

            playSound(
                missionCompleteAudio
            );


            updateMainHUD();

            updateFishingHUD();


            hide(phase1);

            hide(phase1Complete);

            hide(phase2);

            hide(gameHUD);

            hide(inventoryPanel);

            hide(introScreen);


            show(missionComplete);


            const finalXP =
                document.getElementById(
                    "finalXP"
                );


            if (finalXP) {

                finalXP.innerText =
                    game.xp;
            }


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


        /* =========================================================
           PHASE 1 — CAMPSITE
        ========================================================= */

        function drawCampsite() {

            if (
                !campCtx ||
                !campCanvas
            ) {

                return;
            }


            campCtx.clearRect(
                0,
                0,
                campWidth,
                campHeight
            );


            if (
                assets.campsite &&
                assets.campsite.complete &&
                assets.campsite.naturalWidth > 0
            ) {

                campCtx.drawImage(
                    assets.campsite,
                    0,
                    0,
                    campWidth,
                    campHeight
                );

            } else {

                campCtx.fillStyle =
                    "#34523a";

                campCtx.fillRect(
                    0,
                    0,
                    campWidth,
                    campHeight
                );
            }


            items.forEach(
                item => {

                    if (
                        item.collected
                    ) {

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


                    const size =
                        Math.min(
                            campWidth,
                            campHeight
                        ) * 0.08;


                    campCtx.drawImage(
                        image,
                        item.x -
                        size / 2,
                        item.y -
                        size / 2,
                        size,
                        size
                    );
                }
            );
        }


        function placeItems() {

            items =
                ITEM_KEYS.map(
                    key => ({

                        key,

                        collected:
                            false,

                        x:
                            campWidth *
                            (
                                0.12 +
                                Math.random() *
                                0.76
                            ),

                        y:
                            campHeight *
                            (
                                0.20 +
                                Math.random() *
                                0.65
                            )
                    })
                );


            updateInventory();

            drawCampsite();
        }


        function updateInventory() {

            if (!inventoryPanel) {
                return;
            }


            const count =
                items.filter(
                    item =>
                        item.collected
                ).length;


            inventoryPanel.innerText =
                count +
                " / " +
                ITEM_KEYS.length;
        }


        function handleCampsiteClick(
            event
        ) {

            if (
                game.phase !== 1 ||
                !game.missionActive
            ) {

                return;
            }


            const rect =
                campCanvas.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) *
                (
                    campCanvas.width /
                    rect.width
                );


            const y =
                (
                    event.clientY -
                    rect.top
                ) *
                (
                    campCanvas.height /
                    rect.height
                );


            const hitRadius =
                Math.min(
                    campWidth,
                    campHeight
                ) * 0.10;


            for (
                const item of items
            ) {

                if (
                    item.collected
                ) {

                    continue;
                }


                if (
                    Math.hypot(
                        item.x - x,
                        item.y - y
                    ) <=
                    hitRadius
                ) {

                    item.collected =
                        true;


                    game.itemsFound++;


                    game.xp +=
                        20;


                    game.score +=
                        50;


                    playSound(
                        collectSound
                    );


                    updateMainHUD();

                    updateInventory();

                    drawCampsite();


                    if (
                        game.itemsFound >=
                        game.totalItems
                    ) {

                        completePhase1();
                    }


                    break;
                }
            }
        }


        /* =========================================================
           START MISSION
        ========================================================= */

        function startMission() {

            unlockFishingAudio();


            game.phase =
                1;


            game.missionActive =
                true;


            game.fishingActive =
                false;


            game.timer =
                60;


            game.itemsFound =
                0;


            game.totalItems =
                10;


            game.xp =
                0;


            game.score =
                0;


            hide(introScreen);

            hide(phase1Complete);

            hide(phase2);

            hide(missionComplete);


            show(gameHUD);

            show(phase1);

            show(inventoryPanel);


            placeItems();


            playSound(
                missionStartSound
            );


            if (phase1Interval) {

                clearInterval(
                    phase1Interval
                );
            }


            phase1Interval =
                setInterval(
                    () => {

                        if (
                            game.phase !== 1 ||
                            !game.missionActive
                        ) {

                            return;
                        }


                        game.timer--;


                        if (
                            game.timer <=
                            0
                        ) {

                            game.timer =
                                0;

                            completePhase1();

                            return;
                        }


                        updateMainHUD();

                    },
                    1000
                );


            updateMainHUD();

            drawCampsite();
        }


        /* =========================================================
           COMPLETE PHASE 1
        ========================================================= */

        function completePhase1() {

            if (
                game.phase !== 1
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


            game.xp +=
                100;


            game.score +=
                250;


            updateMainHUD();


            hide(phase1);

            hide(inventoryPanel);


            show(phase1Complete);


            const p =
                document.getElementById(
                    "phase1CompleteXP"
                );


            if (p) {

                p.innerText =
                    game.xp;
            }
        }


        /* =========================================================
           TERMINAL
        ========================================================= */

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
                    terminalLines[index];


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


        /* =========================================================
           RESET GAME
        ========================================================= */

        function resetGame() {

            stopAllFishingAudio();


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


            powerHoldActive =
                false;


            if (
                powerHoldAnimation
            ) {

                cancelAnimationFrame(
                    powerHoldAnimation
                );

                powerHoldAnimation =
                    null;
            }


            game.phase =
                0;


            game.xp =
                0;

            game.score =
                0;


            game.timer =
                60;


            game.fishingTimer =
                80;


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
                100;


            lineTension =
                0;


            lureX =
                0;

            lureY =
                0;


            currentFish =
                "goldFish";


            fishPool =
                [];


            rodAngle =
                -1.30;

            rodTargetAngle =
                -1.30;


            rodKick =
                0;


            reelRotation =
                0;


            items =
                [];


            catchResult =
                null;


            hide(gameHUD);

            hide(inventoryPanel);

            hide(phase1);

            hide(phase1Complete);

            hide(phase2);

            hide(missionComplete);


            show(introScreen);


            if (bite) {
                hide(bite);
            }


            if (hook) {
                hide(hook);
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

            startTerminal();
        }


        /* =========================================================
           REPLAY
        ========================================================= */

        function replayGame() {

            resetGame();
        }


        /* =========================================================
           INTRO
        ========================================================= */

        function initialiseIntro() {

            hide(gameHUD);

            hide(inventoryPanel);

            hide(phase1);

            hide(phase1Complete);

            hide(phase2);

            hide(missionComplete);


            show(introScreen);


            updateMainHUD();

            updateFishingHUD();

            startTerminal();
        }


        /* =========================================================
           LOADING SCREEN
        ========================================================= */

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


            const interval =
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
                            ) &&
                            messageIndex <
                            messages.length - 1
                        ) {

                            messageIndex++;


                            if (
                                loadingText
                            ) {

                                loadingText.innerText =
                                    messages[
                                        messageIndex
                                    ];
                            }
                        }


                        if (
                            progress >=
                            100
                        ) {

                            clearInterval(
                                interval
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


        /* =========================================================
           EVENT LISTENERS
        ========================================================= */

        if (
            startMissionButton
        ) {

            startMissionButton.addEventListener(
                "click",
                startMission
            );
        }


        if (
            continueFishing
        ) {

            continueFishing.addEventListener(
                "click",
                () => {

                    unlockFishingAudio();

                    startFishingPhase();
                }
            );
        }


        if (
            replayMission
        ) {

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


        /*
         * Fishing button.
         */

        if (castRod) {

            castRod.addEventListener(
                "click",
                handleCastRod
            );
        }


        /*
         * Keyboard controls.
         */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.code ===
                    "Space" &&
                    game.phase === 2 &&
                    game.fishingActive
                ) {

                    event.preventDefault();

                    handleCastRod();
                }


                if (
                    event.key.toLowerCase() ===
                    "r" &&
                    game.phase === 2 &&
                    game.fishingActive
                ) {

                    if (
                        fishingState ===
                        "HOOKED"
                    ) {

                        startReeling();

                    } else if (
                        fishingState ===
                        "REELING"
                    ) {

                        stopReeling();
                    }
                }
            }
        );


        /*
         * Stop reeling when app/tab
         * becomes hidden.
         */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden &&
                    fishingState ===
                    "REELING"
                ) {

                    stopReeling();
                }
            }
        );


        /*
         * Start aiming animation when
         * player is in AIMING state.
         */

        function aimingAnimation() {

            if (
                game.phase === 2 &&
                game.fishingActive &&
                fishingState ===
                "AIMING"
            ) {

                updateAim();
            }


            requestAnimationFrame(
                aimingAnimation
            );
        }


        aimingAnimation();


        /* =========================================================
           PUBLIC API
        ========================================================= */

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


        /* =========================================================
           INITIAL STATE
        ========================================================= */

        hide(gameHUD);

        hide(inventoryPanel);

        hide(phase1);

        hide(phase1Complete);

        hide(phase2);

        hide(missionComplete);


        updateMainHUD();

        updateFishingHUD();


        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                startLoadingScreen,
                {
                    once: true
                }
            );

        } else {

            startLoadingScreen();
        }

    })();
}
