"use strict";

if (window.__OPERATION_BIRTHDAY_MISSION_2_LOADED) {
    console.warn(
        "Mission 2 game.js already loaded. Skipping duplicate initialisation."
    );
} else {

    window.__OPERATION_BIRTHDAY_MISSION_2_LOADED = true;

    const initMission2 = () => {

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

            image.src =
                src;

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

                name:
                    "GOLD FISH",

                rarity:
                    "COMMON",

                description:
                    "A bright golden freshwater fish with shimmering scales.",

                minWeight:
                    0.850,

                maxWeight:
                    1.800,

                coins:
                    20,

                xp:
                    40,

                points:
                    150
            },


            heartFish: {

                name:
                    "HEART FISH",

                rarity:
                    "RARE",

                description:
                    "A rare freshwater fish marked with a distinctive heart pattern.",

                minWeight:
                    1.000,

                maxWeight:
                    2.400,

                coins:
                    30,

                xp:
                    55,

                points:
                    200
            },


            rainbowFish: {

                name:
                    "RAINBOW FISH",

                rarity:
                    "SPECIAL",

                description:
                    "A colourful freshwater fish with brilliant rainbow-like scales.",

                minWeight:
                    1.200,

                maxWeight:
                    3.200,

                coins:
                    40,

                xp:
                    70,

                points:
                    250
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


        let aimAngle =
            0;

        let aimDirection =
            1;


        let castPower =
            0;

        let castDirection =
            1;


        let fishDistance =
            100;

        let lineTension =
            0;


        let lureX =
            0;

        let lureY =
            0;


        let currentFish =
            "goldFish";


        let fishPool =
            [];


        /*
         * Rod starts pointing DOWNWARD
         * toward the lake rather than upward
         * into the sky.
         */
        let rodAngle =
            -1.30;

        let rodTargetAngle =
            -1.30;


        let rodKick =
            0;

        let reelRotation =
            0;


        let phase1Interval =
            null;

        let fishingInterval =
            null;

        let fishBiteTimeout =
            null;


        let fishingRenderStarted =
            false;


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

                sound.currentTime =
                    0;

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

                sound.currentTime =
                    0;

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
                        Math.ceil(
                            game.timer
                        )
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
                    String(
                        minutes
                    ).padStart(
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
                let i =
                    fishPool.length - 1;

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


            const sky =
                fishingCtx.createLinearGradient(
                    0,
                    0,
                    0,
                    fishingHeight * 0.48
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
                fishingHeight * 0.48
            );


            const water =
                fishingCtx.createLinearGradient(
                    0,
                    fishingHeight * 0.42,
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
                fishingHeight * 0.42,
                fishingWidth,
                fishingHeight * 0.58
            );


            fishingCtx.fillStyle =
                "#6a8b5c";


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                0,
                fishingHeight * 0.43
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
                    fishingHeight * 0.4 +
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
           FISHING WATER EFFECTS
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
                "#fff";

            fishingCtx.lineWidth =
                1;


            for (
                let i = 0;
                i < 7;
                i++
            ) {

                const y =
                    fishingHeight *
                    (
                        0.35 +
                        i * 0.075
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
                    fishingWidth * 0.5,
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
           CONTINUE: CATCH RESULT CARD
        ========================================================= */

        if (catchResult.newSpecies) {

            fishingCtx.fillStyle =
                "#1f9d8f";

            fishingCtx.fillText(
                "NEW SPECIES",
                badgeX,
                statY + 22
            );

            badgeX += 92;
        }


        if (catchResult.newRecord) {

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
           FISHING CANVAS
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


            /* -----------------------------------------------------
               BACKGROUND
            ----------------------------------------------------- */

            drawFishingBackground();


            /* -----------------------------------------------------
               FISH
            ----------------------------------------------------- */

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


            /* -----------------------------------------------------
               FISHING LINE
            ----------------------------------------------------- */

            drawFishingLine();


            /* -----------------------------------------------------
               LURE
            ----------------------------------------------------- */

            drawLure();


            /* -----------------------------------------------------
               LURE GLOW
            ----------------------------------------------------- */

            drawFishingLureGlow();


            /* -----------------------------------------------------
               WATER RIPPLE
            ----------------------------------------------------- */

            drawWaterRipple();


            /* -----------------------------------------------------
               BITE EFFECT
            ----------------------------------------------------- */

            drawBiteEffect();


            /* -----------------------------------------------------
               FISHING ROD
            ----------------------------------------------------- */

            drawFishingRod();


            /* -----------------------------------------------------
               CANVAS HUD
            ----------------------------------------------------- */

            drawFishingCanvasHUD();


            /* -----------------------------------------------------
               CATCH RESULT
            ----------------------------------------------------- */

            if (
                catchResult &&
                fishingState === "CAUGHT"
            ) {

                drawCatchResultCard();
            }


            /* -----------------------------------------------------
               CONTINUOUS RENDER
            ----------------------------------------------------- */

            if (
                game.phase === 2 &&
                game.fishingActive
            ) {

                requestAnimationFrame(
                    drawFishingScene
                );
            }
        }


        /* =========================================================
           FISHING RENDER LOOP
        ========================================================= */

        function startFishingRenderLoop() {

            if (
                fishingRenderStarted
            ) {
                return;
            }


            fishingRenderStarted =
                true;


            drawFishingScene();
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
                labels[fishingState] ||
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


            reelRotation =
                0;


            if (
                fishPool.length === 0
            ) {

                shuffleFishPool();
            }


            currentFish =
                fishPool[0] ||
                "goldFish";


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
           CAST / FISHING CONTROL
           
           Controls:
           
           1st press  = AIM
           2nd press  = CHARGE
           3rd press  = CAST
           
           After fish bites:
           
           press      = HOOK
           press      = REEL
           press      = STOP REEL
        ========================================================= */

        function handleCastRod() {

            if (
                game.phase !== 2 ||
                !game.fishingActive
            ) {
                return;
            }


            if (
                fishingState === "IDLE"
            ) {

                fishingState =
                    "AIMING";

                aimAngle =
                    0;

                aimDirection =
                    1;

                updateFishingHUD();

                return;
            }


            if (
                fishingState === "AIMING"
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
                fishingState === "CHARGING"
            ) {

                releaseCast();

                return;
            }


            if (
                fishingState === "BITE"
            ) {

                hookFish();

                return;
            }


            if (
                fishingState === "HOOKED"
            ) {

                startReeling();

                return;
            }


            if (
                fishingState === "REELING"
            ) {

                stopReeling();

                return;
            }
        }


        /* =========================================================
           AIM ANIMATION
        ========================================================= */

        function aimFishingRod() {

            if (
                fishingState !== "AIMING"
            ) {
                return;
            }


            aimAngle +=
                0.018 *
                aimDirection;


            if (
                aimAngle >= 1
            ) {

                aimAngle =
                    1;

                aimDirection =
                    -1;
            }


            if (
                aimAngle <= -1
            ) {

                aimAngle =
                    -1;

                aimDirection =
                    1;
            }


            /*
             * Keep the rod aimed toward
             * the lake.
             *
             * Never rotate it into the sky.
             */

            rodTargetAngle =
                -1.18 +
                aimAngle * 0.16;


            rodAngle +=
                (
                    rodTargetAngle -
                    rodAngle
                ) * 0.12;


            drawFishingScene();


            requestAnimationFrame(
                aimFishingRod
            );
        }


        /* =========================================================
           POWER CHARGE
        ========================================================= */

        function chargePowerLoop() {

            if (
                !powerHoldActive ||
                fishingState !== "CHARGING"
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
            }


            if (
                castPower <= 0
            ) {

                castPower =
                    0;

                castDirection =
                    1;
            }


            /*
             * Slight rod movement while
             * charging.
             */

            rodTargetAngle =
                -1.20 +
                (
                    castPower / 100
                ) *
                0.08;


            updateFishingHUD();

            drawFishingScene();


            powerHoldAnimation =
                requestAnimationFrame(
                    chargePowerLoop
                );
        }


        /* =========================================================
           RELEASE CAST
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


            /*
             * Calculate casting distance.
             */

            const powerRatio =
                Math.max(
                    0.25,
                    castPower / 100
                );


            /*
             * IMPORTANT:
             *
             * The lure is deliberately
             * placed inside the WATER.
             *
             * It is NOT launched upward.
             */

            const waterTop =
                fishingHeight *
                0.45;


            lureX =
                fishingWidth *
                (
                    0.52 +
                    powerRatio * 0.30
                );


            lureY =
                waterTop +
                (
                    0.16 +
                    (
                        1 -
                        powerRatio
                    ) *
                    0.08
                ) *
                fishingHeight;


            /*
             * Safety clamp.
             *
             * This guarantees the lure
             * remains below the waterline.
             */

            lureY =
                Math.max(
                    waterTop +
                    fishingHeight * 0.08,
                    lureY
                );


            lureY =
                Math.min(
                    fishingHeight * 0.82,
                    lureY
                );


            /*
             * Rod follows the cast toward
             * the lake.
             */

            rodTargetAngle =
                -1.02;


            updateFishingHUD();

            drawFishingScene();


            /*
             * Casting animation.
             */

            setTimeout(
                () => {

                    if (
                        game.phase !== 2 ||
                        !game.fishingActive
                    ) {
                        return;
                    }


                    fishingState =
                        "WAITING";


                    rodTargetAngle =
                        -1.05;


                    updateFishingHUD();

                    drawFishingScene();


                    const delay =
                        1200 +
                        Math.random() *
                        2500;


                    fishBiteTimeout =
                        setTimeout(
                            triggerFishBite,
                            delay
                        );

                },
                450
            );
        }


        /* =========================================================
           FISH BITE
        ========================================================= */

        function triggerFishBite() {

            if (
                game.phase !== 2 ||
                !game.fishingActive ||
                fishingState !== "WAITING"
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


            /*
             * Fish approaches the lure.
             */

            rodTargetAngle =
                -1.00;


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
                fishingState !== "BITE"
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


            /*
             * Rod bends slightly
             * under fish weight.
             */

            rodTargetAngle =
                -0.94;


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
             * Fish moves away from
             * the player.
             */

            if (
                fishingState === "HOOKED"
            ) {

                fishDistance +=
                    0.32;

            } else {

                fishDistance +=
                    0.18;
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
             * Fish randomly pulls
             * against the line.
             */

            if (
                Math.random() < 0.02
            ) {

                lineTension +=
                    4;


                playFishPullingSound();


                /*
                 * Rod reacts to fish pull.
                 */

                rodTargetAngle =
                    -0.86;
            }


            lineTension =
                Math.max(
                    0,
                    Math.min(
                        100,
                        lineTension
                    )
                );


            /*
             * Line breaks.
             */

            if (
                lineTension >= 100
            ) {

                fishEscaped();

                return;
            }


            /*
             * Fish reaches the player.
             */

            if (
                fishDistance <= 0
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
                fishingState !== "HOOKED"
            ) {

                return;
            }


            fishingState =
                "REELING";


            reelActive =
                true;


            rodTargetAngle =
                -0.88;


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
                fishingState !== "REELING"
            ) {

                return;
            }


            reelActive =
                false;


            stopFishingWinding();


            fishingState =
                "HOOKED";


            rodTargetAngle =
                -0.94;


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
                fishingState !== "REELING"
            ) {

                return;
            }


            reelRotation +=
                0.35;


            /*
             * Pull fish toward player.
             */

            fishDistance -=
                1.55;


            /*
             * Reeling increases tension.
             */

            lineTension +=
                0.45;


            /*
             * Fish can fight back.
             */

            if (
                Math.random() < 0.02
            ) {

                fishDistance +=
                    2.5;


                lineTension +=
                    3;


                playFishPullingSound();


                /*
                 * Stronger rod bend.
                 */

                rodTargetAngle =
                    -0.78;
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


            /*
             * Fish escaped.
             */

            if (
                lineTension >= 100
            ) {

                fishEscaped();

                return;
            }


            /*
             * Fish caught.
             */

            if (
                fishDistance <= 0
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
                randomWeight(fish);


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
                ] = weight;
            }


            /*
             * Update mission statistics.
             */

            game.fishCaught +=
                1;


            game.score +=
                fish.points;


            game.xp +=
                fish.xp;


            /*
             * Store catch information
             * for the catch card.
             */

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
             * Give the player time to see
             * the caught-fish information.
             */

            setTimeout(
                () => {

                    if (
                        game.phase !== 2 ||
                        !game.fishingActive
                    ) {
                        return;
                    }


                    /*
                     * Target reached.
                     */

                    if (
                        game.fishCaught >=
                        game.targetFish
                    ) {

                        endMission();

                        return;
                    }


                    /*
                     * Prepare next catch.
                     */

                    catchResult =
                        null;


                    resetFishingAttempt();

                    prepareNextFish();

                    drawFishingScene();

                },
                2200
            );
        }


        /* =========================================================
           FISH ESCAPED
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
           FISHING TIMER
        ========================================================= */

        function updateFishingTimer() {

            if (
                game.phase !== 2 ||
                !game.fishingActive
            ) {
                return;
            }


            /*
             * Timer runs in tenths of a
             * second because the interval
             * runs every 100ms.
             */

            game.fishingTimer -=
                0.1;


            if (
                game.fishingTimer <= 0
            ) {

                game.fishingTimer =
                    0;


                game.fishingActive =
                    false;


                endMission();

                return;
            }


            updateFishingHUD();
        }


        /* =========================================================
           START PHASE 2
        ========================================================= */

        function startFishingPhase() {

            /*
             * Set phase FIRST.
             */

            game.phase =
                2;


            game.fishingActive =
                true;


            game.fishingTimer =
                80;


            game.fishCaught =
                0;


            game.targetFish =
                6;


            /*
             * Keep Phase 1 score/XP.
             */

            game.score =
                Number(game.score) || 0;


            game.xp =
                Number(game.xp) || 0;


            catchResult =
                null;


            /*
             * Reset fish collection.
             */

            fishPool =
                [];


            shuffleFishPool();

            prepareNextFish();


            /*
             * Reset fishing controls.
             */

            resetFishingAttempt();


            /*
             * Switch screens.
             */

            hide(introScreen);

            hide(phase1);

            hide(phase1Complete);

            hide(gameHUD);

            hide(inventoryPanel);

            hide(missionComplete);


            show(phase2);


            /*
             * Start fishing environment.
             */

            startFishingMusic();


            startFishingRenderLoop();


            /*
             * Start timer.
             */

            if (
                fishingInterval
            ) {

                clearInterval(
                    fishingInterval
                );
            }


            fishingInterval =
                setInterval(
                    updateFishingTimer,
                    100
                );


            updateMainHUD();

            updateFishingHUD();

            drawFishingScene();
        }


        /* =========================================================
           END MISSION
        ========================================================= */

        function endMission() {

            /*
             * Prevent multiple completion
             * calls.
             */

            if (
                game.phase === 3
            ) {
                return;
            }


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


            /*
             * Stop fishing audio.
             */

            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


            /*
             * Play mission complete.
             */

            playSound(
                missionCompleteAudio
            );


            /*
             * Stop timers.
             */

            if (
                fishingInterval
            ) {

                clearInterval(
                    fishingInterval
                );

                fishingInterval =
                    null;
            }


            if (
                phase1Interval
            ) {

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


            /*
             * Hide gameplay screens.
             */

            hide(phase1);

            hide(phase1Complete);

            hide(phase2);

            hide(gameHUD);

            hide(inventoryPanel);

            hide(introScreen);


            /*
             * Show completion screen.
             */

            show(missionComplete);


            /*
             * Final statistics.
             */

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
           RESET ENTIRE GAME
        ========================================================= */

        function resetGame() {

            /*
             * Stop all audio.
             */

            stopAllFishingAudio();


            /*
             * Stop Phase 1 timer.
             */

            if (
                phase1Interval
            ) {

                clearInterval(
                    phase1Interval
                );

                phase1Interval =
                    null;
            }


            /*
             * Stop Phase 2 timer.
             */

            if (
                fishingInterval
            ) {

                clearInterval(
                    fishingInterval
                );

                fishingInterval =
                    null;
            }


            clearTimeout(
                fishBiteTimeout
            );


            /*
             * Stop power animation.
             */

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


            /*
             * Reset main game.
             */

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


            /*
             * Reset fishing.
             */

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


            /*
             * Clear discovered fish.
             */

            discoveredFish.clear();


            Object.keys(
                fishRecords
            ).forEach(
                key => {
                    delete fishRecords[key];
                }
            );


            /*
             * Reset UI.
             */

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


            /*
             * Restart terminal.
             */

            startTerminal();
        }


        /* =========================================================
           REPLAY
        ========================================================= */

        function replayGame() {

            resetGame();
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


            /*
             * Campsite background.
             */

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

                /*
                 * Fallback campsite.
                 */

                const gradient =
                    campCtx.createLinearGradient(
                        0,
                        0,
                        0,
                        campHeight
                    );


                gradient.addColorStop(
                    0,
                    "#243d30"
                );


                gradient.addColorStop(
                    1,
                    "#101c17"
                );


                campCtx.fillStyle =
                    gradient;


                campCtx.fillRect(
                    0,
                    0,
                    campWidth,
                    campHeight
                );
            }


            /*
             * Draw equipment.
             */

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


                    campCtx.save();


                    /*
                     * Small glow so items
                     * remain visible.
                     */

                    campCtx.globalAlpha =
                        0.95;


                    campCtx.shadowColor =
                        "rgba(255,255,255,.45)";


                    campCtx.shadowBlur =
                        8;


                    campCtx.drawImage(
                        image,
                        item.x -
                        size / 2,
                        item.y -
                        size / 2,
                        size,
                        size
                    );


                    campCtx.restore();
                }
            );
        }


        /* =========================================================
           PLACE PHASE 1 ITEMS
        ========================================================= */

        function placeItems() {

            items =
                ITEM_KEYS.map(
                    (
                        key,
                        index
                    ) => {

                        /*
                         * Keep items away from
                         * the extreme edges.
                         */

                        return {

                            key:
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
                        };
                    }
                );


            updateInventory();

            drawCampsite();
        }


        /* =========================================================
           INVENTORY
        ========================================================= */

        function updateInventory() {

            if (
                !inventoryPanel
            ) {
                return;
            }


            const count =
                items.filter(
                    item =>
                        item.collected
                ).length;


            /*
             * Preserve the existing
             * inventory element while
             * updating only its text.
             */

            inventoryPanel.innerText =
                count +
                " / " +
                ITEM_KEYS.length;
        }


        /* =========================================================
           CAMPSITE CLICK
        ========================================================= */

        function handleCampsiteClick(
            event
        ) {

            if (
                game.phase !== 1 ||
                !game.missionActive ||
                !campCanvas
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


            const x =
                (
                    event.clientX -
                    rect.left
                ) *
                scaleX;


            const y =
                (
                    event.clientY -
                    rect.top
                ) *
                scaleY;


            const hitRadius =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.10;


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
                        item.x - x,
                        item.y - y
                    );


                if (
                    distance <=
                    hitRadius
                ) {

                    item.collected =
                        true;


                    game.itemsFound +=
                        1;


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

            /*
             * Unlock audio after the user's
             * button interaction.
             */

            unlockFishingAudio();


            /*
             * Phase 1.
             */

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


            /*
             * Switch screens.
             */

            hide(introScreen);

            hide(phase1Complete);

            hide(phase2);

            hide(missionComplete);


            show(gameHUD);

            show(phase1);

            show(inventoryPanel);


            /*
             * Create equipment.
             */

            placeItems();


            /*
             * Mission start sound.
             */

            playSound(
                missionStartSound
            );


            /*
             * Start Phase 1 timer.
             */

            if (
                phase1Interval
            ) {

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


                        game.timer -=
                            1;


                        if (
                            game.timer <= 0
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


            /*
             * Stop Phase 1 timer.
             */

            game.missionActive =
                false;


            if (
                phase1Interval
            ) {

                clearInterval(
                    phase1Interval
                );

                phase1Interval =
                    null;
            }


            /*
             * Phase 1 completion reward.
             */

            game.xp +=
                100;


            game.score +=
                250;


            updateMainHUD();


            /*
             * Hide Phase 1 gameplay.
             */

            hide(phase1);

            hide(inventoryPanel);

            hide(gameHUD);


            /*
             * Show Phase 1 completion.
             */

            show(phase1Complete);


            const completionXP =
                document.getElementById(
                    "phase1CompleteXP"
                );


            if (
                completionXP
            ) {

                completionXP.innerText =
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

            if (
                !terminal
            ) {
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
           INTRO INITIALISATION
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

            if (
                !loadingScreen
            ) {

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


            if (
                loadingFill
            ) {

                loadingFill.style.width =
                    "0%";
            }


            if (
                loadingText
            ) {

                loadingText.innerText =
                    messages[0];
            }


            const loadingInterval =
                setInterval(
                    () => {

                        progress +=
                            2;


                        if (
                            loadingFill
                        ) {

                            loadingFill.style.width =
                                progress +
                                "%";
                        }


                        const threshold =
                            messageIndex *
                            (
                                100 /
                                (
                                    messages.length -
                                    1
                                )
                            );


                        if (
                            progress >=
                            threshold &&
                            messageIndex <
                            messages.length -
                            1
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


        if (
            campCanvas
        ) {

            campCanvas.addEventListener(
                "pointerdown",
                handleCampsiteClick
            );
        }


        /* =========================================================
           KEYBOARD CONTROLS
        ========================================================= */

        document.addEventListener(
            "keydown",
            event => {

                /*
                 * SPACE = fishing action
                 */

                if (
                    event.code ===
                    "Space" &&
                    game.phase === 2 &&
                    game.fishingActive
                ) {

                    event.preventDefault();

                    handleCastRod();

                }


                /*
                 * R = reel
                 */

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


        /* =========================================================
           VISIBILITY CHANGE
        ========================================================= */

        document.addEventListener(
            "visibilitychange",
            () => {

                /*
                 * If the player leaves the page
                 * while reeling, safely stop the
                 * reel instead of allowing the
                 * fishing loop to continue.
                 */

                if (
                    document.hidden &&
                    fishingState ===
                    "REELING"
                ) {

                    stopReeling();
                }

            }
        );


        /* =========================================================
           GLOBAL MISSION API
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
           INITIAL UI STATE
        ========================================================= */

        hide(gameHUD);

        hide(inventoryPanel);

        hide(phase1);

        hide(phase1Complete);

        hide(phase2);

        hide(missionComplete);


        updateMainHUD();

        updateFishingHUD();


        /* =========================================================
           START GAME
        ========================================================= */

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
