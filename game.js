/*======================================================
 OPERATION BIRTHDAY 30
 MISSION 02
 GAME.JS
 AMENDED VERSION (HUD BEAR PROXIMITY DISTANCE METERS, HINT SYSTEM, & IMPROVED ITEM CONTRAST)

 IMPORTANT:
 - ALL IMAGE ASSETS ARE PNG
 - PHASE 1 = CAMPSITE SEARCH (ITEMS WITH WHITE BACKGROUND REMOVED VIA BLENDING & OUTLINES)
 - PHASE 2 = FISHING
 - AUDIO FULLY ENABLED & INTEGRATED
======================================================*/

"use strict";


/*======================================================
 PREVENT DOUBLE INITIALISATION
======================================================*/

if (window.__OPERATION_BIRTHDAY_MISSION_2_LOADED) {

    console.warn(
        "Mission 2 game.js already loaded. Skipping duplicate initialisation."
    );

} else {

    window.__OPERATION_BIRTHDAY_MISSION_2_LOADED = true;


    /*==================================================
      MAIN GAME WRAPPER
    ==================================================*/

    (() => {


        /*================================================
          GAME STATE
        =================================================*/

        const game = {

            phase: 0,

            xp: 0,

            score: 0,

            timer: 60,

            fishingTimer: 60,

            itemsFound: 0,

            totalItems: 8, // Updated to match the 8 available survival items

            fishCaught: 0,

            targetFish: 6,

            bearProgress: 100,

            bearDistanceMeters: 95,

            missionActive: false,

            fishingActive: false,

            hintsRemaining: 3,

            activeHintItem: null,

            hintGlowTimer: 0

        };


        /*================================================
          PHASE 1 ITEMS (Tent & Backpack removed as requested)
        =================================================*/

        const ITEM_KEYS = [

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


        /*================================================
          CANVAS
        =================================================*/

        const campCanvas =
            document.getElementById(
                "gameCanvas"
            );

        const campCtx =
            campCanvas
                ? campCanvas.getContext("2d", { willReadFrequently: true })
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


        /*================================================
          DOM
        =================================================*/

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


        const startMission =
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


        /*================================================
          MAIN HUD
        =================================================*/

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

        const itemsFoundText =
            document.getElementById(
                "itemsFoundText"
            );

        const bearProximityText =
            document.getElementById(
                "bearProximityText"
            );

        const hintButton =
            document.getElementById(
                "hintButton"
            );


        /*================================================
          PHASE 1 COMPLETE
        =================================================*/

        const phase1XP =
            document.getElementById(
                "phase1XP"
            );


        /*================================================
          FISHING HUD
        =================================================*/

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


        /*================================================
          AUDIO (WEB AUDIO API SYNTHESIZER FALLBACK + DOM AUDIO)
        =================================================*/

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


        // Web Audio Context for guaranteed synthesized sound effects if DOM audio files fail or are missing
        let audioCtx = null;

        function initAudioContext() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioCtx = new AudioContext();
                }
            }
            if (audioCtx && audioCtx.state === "suspended") {
                audioCtx.resume();
            }
        }

        // Synthesizer fallback sound effects
        function playSynthBeep(type) {
            try {
                initAudioContext();
                if (!audioCtx) return;

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                const now = audioCtx.currentTime;

                if (type === "collect") {
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                } else if (type === "splash") {
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.3);
                    gain.gain.setValueAtTime(0.4, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                } else if (type === "success") {
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
                    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                } else if (type === "bear") {
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(120, now);
                    osc.frequency.linearRampToValueAtTime(60, now + 0.6);
                    gain.gain.setValueAtTime(0.5, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                    osc.start(now);
                    osc.stop(now + 0.6);
                }
            } catch (e) {
                console.warn("Synthesizer audio error:", e);
            }
        }


        function playSound(sound, synthType) {

            initAudioContext();

            let played = false;

            if (sound) {

                try {

                    sound.currentTime = 0;

                    const promise = sound.play();

                    if (promise !== undefined) {

                        promise.then(() => {
                            played = true;
                        }).catch(error => {
                            if (synthType) {
                                playSynthBeep(synthType);
                            }
                        });

                    }

                } catch (error) {

                    if (synthType) {
                        playSynthBeep(synthType);
                    }

                }

            } else if (synthType) {

                playSynthBeep(synthType);

            }
        }


        function stopSound(sound) {

            if (!sound) {
                return;
            }

            try {

                sound.pause();

            } catch (error) {

                /* Ignore audio errors */

            }
        }


        /*================================================
          ASSETS (Fish filenames updated to match your files)
        =================================================*/

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

            bear:
                loadImage(
                    "assets/bear/bear_walk.png"
                ),

            items: {

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
                        "assets/fish/goldfish.png"
                    ),

                heartFish:
                    loadImage(
                        "assets/fish/heartfish.png"
                    ),

                rainbowFish:
                    loadImage(
                        "assets/fish/rainbowFish.png"
                    )

            }

        };


        /*================================================
          TIMERS & ANIMATION
        =================================================*/

        let phase1Interval =
            null;

        let fishingInterval =
            null;

        let bearAnimTime = 0;


        /*================================================
          FISHING STATE
        =================================================*/

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


        /*================================================
          FIRST PERSON ROD
        =================================================*/

        let rodAngle =
            -0.72;

        let rodTargetAngle =
            -0.72;

        let rodKick =
            0;

        let reelRotation =
            0;


        /*================================================
          HELPERS
        =================================================*/

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


        /*================================================
          CANVAS RESIZE
        =================================================*/

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


        /*================================================
          UPDATE MAIN HUD
        =================================================*/

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


            if (itemsFoundText) {

                itemsFoundText.innerText =
                    game.itemsFound +
                    " / " +
                    game.totalItems;
            }


            if (bearProximityText) {

                // Maps 60s timer down to 0m as bear approaches campsite
                game.bearDistanceMeters =
                    Math.max(0, Math.round((game.timer / 60) * 95));

                bearProximityText.innerText =
                    game.bearDistanceMeters +
                    "m";
            }
        }


        /*================================================
          UPDATE FISHING HUD
        =================================================*/

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


        /*================================================
          SHOW ONLY PHASE 1
        =================================================*/

        function showPhase1() {

            hide(introScreen);

            hide(phase1Complete);

            hide(phase2);

            hide(missionComplete);

            show(phase1);

            show(gameHUD);

            show(inventoryPanel);
        }


        /*================================================
          START MISSION
        =================================================*/

        function initMission() {

            initAudioContext();

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

            game.bearDistanceMeters =
                95;

            game.fishCaught =
                0;

            game.hintsRemaining =
                3;

            game.activeHintItem =
                null;


            if (hintButton) {

                hintButton.innerText =
                    "? HINT " +
                    game.hintsRemaining;

                hintButton.disabled =
                    false;
            }


            showPhase1();


            if (objectiveText) {

                objectiveText.innerText =
                    "Recover all 8 survival items before the bear arrives.";
            }


            updateMainHUD();


            createCampsiteItems();


            startPhase1Timer();


            renderCampsite();
        }


        /*================================================
          CREATE 8 UNIQUE CAMPSITE ITEMS
        =================================================*/

        function createCampsiteItems() {

            const positions = [

                // 1. Torchlight (Right foreground metal ammo crate)
                {
                    key: "torchlight",
                    x: 0.82,
                    y: 0.78,
                    scale: 0.72
                },

                // 2. Compass (Center ground near fire pit rocks)
                {
                    key: "compass",
                    x: 0.70,
                    y: 0.87,
                    scale: 0.65
                },

                // 3. Boots (Bottom left corner mud ground)
                {
                    key: "boots",
                    x: 0.15,
                    y: 0.92,
                    scale: 0.85
                },

                // 4. Bottle (Bottom left near tent edge)
                {
                    key: "bottle",
                    x: 0.09,
                    y: 0.85,
                    scale: 0.70
                },

                // 5. Fishing Rod (Right edge upright leaning on rocks)
                {
                    key: "fishingRod",
                    x: 0.93,
                    y: 0.76,
                    scale: 0.90
                },

                // 6. Map (Left camping chair seat)
                {
                    key: "map",
                    x: 0.22,
                    y: 0.78,
                    scale: 0.78
                },

                // 7. Camera (Left foreground camping table / tripod)
                {
                    key: "camera",
                    x: 0.24,
                    y: 0.79,
                    scale: 0.72
                },

                // 8. Key (Prominently placed near center foreground fire pit / rocks)
                {
                    key: "key",
                    x: 0.44,
                    y: 0.88,
                    scale: 0.95
                }

            ];


            items =
                positions.map(
                    item => ({

                        key:
                            item.key,

                        x:
                            item.x,

                        y:
                            item.y,

                        scale:
                            item.scale,

                        collected:
                            false

                    })
                );
        }


        /*================================================
          PHASE 1 TIMER
        =================================================*/

        function startPhase1Timer() {

            clearInterval(
                phase1Interval
            );


            phase1Interval =
                setInterval(
                    () => {

                        if (
                            game.phase !==
                            1 ||
                            !game.missionActive
                        ) {

                            return;
                        }


                        game.timer -=
                            1;


                        game.bearProgress =
                            (
                                game.timer /
                                60
                            ) *
                            100;


                        updateMainHUD();


                        if (
                            game.timer <=
                            0
                        ) {

                            failPhase1();

                        }

                    },
                    1000
                );
        }


        /*================================================
          PHASE 1 FAILURE
        =================================================*/

        function failPhase1() {

            clearInterval(
                phase1Interval
            );


            game.missionActive =
                false;


            stopSound(
                bgMusic
            );


            playSound(
                bearSound,
                "bear"
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


            show(
                phase1Complete
            );


            const title =
                phase1Complete.querySelector(
                    "h1"
                );

            const description =
                phase1Complete.querySelector(
                    "p"
                );


            if (title) {

                title.innerText =
                    "🐻 MISSION FAILED";
            }


            if (description) {

                description.innerText =
                    "The bear reached the campsite (0m) before you recovered all the survival equipment.";
            }


            const continueButton =
                document.getElementById(
                    "continueFishing"
                );


            if (continueButton) {

                continueButton.disabled =
                    true;

                continueButton.style.opacity =
                    "0.4";

                continueButton.innerText =
                    "MISSION FAILED";
            }
        }


        /*================================================
          CAMPSITE BACKGROUND
        =================================================*/

        function drawCampsiteBackground() {

            if (
                !campCtx ||
                !campCanvas
            ) {

                return;
            }


            if (
                assets.campsite.complete &&
                assets.campsite.naturalWidth
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
                    "#17261c";

                campCtx.fillRect(

                    0,
                    0,

                    campWidth,

                    campHeight

                );
            }
        }


        /*================================================
          TRANSPARENT ITEM RENDER WITH WHITE REMOVAL & GLOW
        =================================================*/

        function drawHiddenItem(
            item
        ) {

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
                !image.naturalWidth
            ) {

                return;
            }


            const x =
                item.x *
                campWidth;


            const y =
                item.y *
                campHeight;


            const baseSize =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.09;


            const drawWidth =
                baseSize *
                item.scale;


            const ratio =
                image.naturalHeight /
                image.naturalWidth;


            const drawHeight =
                drawWidth *
                ratio;


            campCtx.save();


            // Glowing highlight effect if this item is currently selected by a Hint
            if (game.activeHintItem === item) {
                const hintPulse = Math.sin(performance.now() / 150) * 12 + 22;
                campCtx.shadowColor = "#00e5ff";
                campCtx.shadowBlur = hintPulse;
                campCtx.strokeStyle = "#00e5ff";
                campCtx.lineWidth = 4;
                campCtx.beginPath();
                campCtx.arc(x, y, drawWidth * 0.8, 0, Math.PI * 2);
                campCtx.stroke();
            } else if (item.key === "key") {
                // Key spotlight glow so it is easily spotted
                const pulse = Math.sin(performance.now() / 200) * 8 + 16;
                campCtx.shadowColor = "#ffeb3b";
                campCtx.shadowBlur = pulse;
                campCtx.strokeStyle = "#ffeb3b";
                campCtx.lineWidth = 3;
                campCtx.beginPath();
                campCtx.arc(x, y, drawWidth * 0.7, 0, Math.PI * 2);
                campCtx.stroke();
            } else {
                campCtx.shadowColor = "rgba(0,0,0,0.85)";
                campCtx.shadowBlur = 12;
                campCtx.shadowOffsetX = 3;
                campCtx.shadowOffsetY = 4;
            }


            // High visibility alpha & blending to eliminate white box artifacting completely
            campCtx.globalAlpha = 0.98;
            campCtx.globalCompositeOperation = "multiply";

            campCtx.drawImage(

                image,

                x -
                    drawWidth / 2,

                y -
                    drawHeight / 2,

                drawWidth,

                drawHeight

            );


            // Second pass for vibrant color clarity
            campCtx.globalCompositeOperation = "source-over";
            campCtx.globalAlpha = 0.95;
            campCtx.shadowColor = "transparent";

            campCtx.drawImage(

                image,

                x -
                    drawWidth / 2,

                y -
                    drawHeight / 2,

                drawWidth,

                drawHeight

            );


            campCtx.restore();
        }


        /*================================================
          ENHANCED GAME-LIKE BEAR
        =================================================*/

        function drawBear() {

            if (
                !campCtx ||
                !assets.bear.complete ||
                !assets.bear.naturalWidth
            ) {

                return;
            }


            bearAnimTime += 0.05;


            const bearSize =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.15;


            const progress =
                game.bearProgress /
                100;


            const bearX =
                campWidth * 0.10 +
                progress *
                    (campWidth * 0.80);


            const bounceY = Math.sin(bearAnimTime * 8) * 6;
            const bearY =
                campHeight * 0.28 + bounceY;


            campCtx.save();


            campCtx.globalAlpha =
                1.0;


            campCtx.shadowColor = "rgba(255, 0, 0, 0.7)";
            campCtx.shadowBlur = 15;


            campCtx.translate(
                bearX,
                bearY
            );

            campCtx.scale(
                -1,
                1
            );


            campCtx.drawImage(

                assets.bear,

                -bearSize / 2,

                -bearSize / 2,

                bearSize,

                bearSize

            );


            campCtx.restore();
        }


        /*================================================
          RENDER CAMPSITE
        =================================================*/

        function renderCampsite() {

            if (
                game.phase !==
                1
            ) {

                return;
            }


            drawCampsiteBackground();


            for (
                const item of items
            ) {

                drawHiddenItem(
                    item
                );
            }


            drawBear();
        }


        /*================================================
          CAMPSITE CLICK
        =================================================*/

        function handleCampsiteClick(
            event
        ) {

            if (
                game.phase !==
                1 ||
                !game.missionActive
            ) {

                return;
            }


            const rect =
                campCanvas.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const canvasX =
                x *
                (
                    campCanvas.width /
                    rect.width
                );


            const canvasY =
                y *
                (
                    campCanvas.height /
                    rect.height
                );


            for (
                const item of items
            ) {

                if (
                    item.collected
                ) {

                    continue;
                }


                const itemX =
                    item.x *
                    campWidth;


                const itemY =
                    item.y *
                    campHeight;


                const hitRadius =
                    Math.max(
                        50,
                        Math.min(
                            campWidth,
                            campHeight
                        ) *
                        0.08
                    );


                const distance =
                    Math.hypot(

                        canvasX -
                            itemX,

                        canvasY -
                            itemY

                    );


                if (
                    distance <=
                    hitRadius
                ) {

                    collectItem(
                        item
                    );

                    return;
                }
            }
        }


        /*================================================
          COLLECT ITEM
        =================================================*/

        function collectItem(
            item
        ) {

            item.collected =
                true;


            if (game.activeHintItem === item) {

                game.activeHintItem = null;
            }


            game.itemsFound++;


            game.xp +=
                20;


            game.score +=
                100;


            playSound(
                collectSound,
                "collect"
            );


            updateMainHUD();


            renderCampsite();


            if (
                game.itemsFound >=
                game.totalItems
            ) {

                completePhase1();
            }
        }


        /*================================================
          TRIGGER HINT SYSTEM
        =================================================*/

        function useHint() {

            if (
                game.phase !== 1 ||
                !game.missionActive ||
                game.hintsRemaining <= 0
            ) {

                return;
            }


            const uncollected = items.filter(i => !i.collected);

            if (uncollected.length === 0) {
                return;
            }


            // Pick an uncollected item to highlight
            const target = uncollected[Math.floor(Math.random() * uncollected.length)];

            game.activeHintItem = target;

            game.hintsRemaining--;


            if (hintButton) {

                hintButton.innerText =
                    game.hintsRemaining > 0
                        ? "? HINT " + game.hintsRemaining
                        : "? NO HINTS";

                if (game.hintsRemaining <= 0) {
                    hintButton.disabled = true;
                }
            }


            // Automatically clear hint highlight after 4 seconds
            clearTimeout(game.hintGlowTimer);

            game.hintGlowTimer = setTimeout(() => {

                if (game.activeHintItem === target) {
                    game.activeHintItem = null;
                }

            }, 4000);
        }


        /*================================================
          COMPLETE PHASE 1
        =================================================*/

        function completePhase1() {

            clearInterval(
                phase1Interval
            );


            game.missionActive =
                false;


            game.phase =
                1;


            game.bearProgress =
                Math.max(
                    0,
                    game.bearProgress
                );


            updateMainHUD();


            stopSound(
                bgMusic
            );


            if (phase1XP) {

                phase1XP.innerText =
                    game.xp;
            }


            hide(
                phase1
            );

            hide(
                gameHUD
            );

            hide(
                inventoryPanel
            );


            show(
                phase1Complete
            );


            const title =
                phase1Complete.querySelector(
                    "h1"
                );

            const description =
                phase1Complete.querySelector(
                    "p"
                );


            if (title) {

                title.innerText =
                    "🏕 Camp Successfully Secured";
            }


            if (description) {

                description.innerText =
                    "Excellent work, Chief. You recovered every item before the bear arrived.";
            }


            const continueButton =
                document.getElementById(
                    "continueFishing"
                );


            if (continueButton) {

                continueButton.disabled =
                    false;

                continueButton.style.opacity =
                    "1";

                continueButton.innerText =
                    "🎣 Continue to Fishing Challenge";
            }
        }


        /*================================================
          CONTINUE TO FISHING
        =================================================*/

        function goToFishing() {

            hide(
                phase1Complete
            );


            show(
                phase2
            );


            game.phase =
                2;

            game.fishingActive =
                true;


            stopSound(
                bgMusic
            );


            startFishing();
        }


        /*================================================
          FISHING START
        =================================================*/

        function startFishing() {

            if (!fishingCanvas) {

                console.error(
                    "fishingCanvas not found."
                );

                return;
            }


            game.fishingTimer =
                60;

            game.fishCaught =
                0;

            game.fishingActive =
                true;


            fishingState =
                "AIM";


            aimAngle =
                0;

            aimDirection =
                1;


            castPower =
                0;

            castDirection =
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


            hide(
                hook
            );


            hide(
                bite
            );


            if (powerFill) {

                powerFill.style.width =
                    "0%";
            }


            if (reelFill) {

                reelFill.style.width =
                    "0%";
            }


            if (fishCaughtText) {

                fishCaughtText.innerText =
                    "0";
            }


            if (fishScoreText) {

                fishScoreText.innerText =
                    game.score;
            }


            if (fishingTimerText) {

                fishingTimerText.innerText =
                    "01:00";
            }


            if (castRod) {

                castRod.innerText =
                    "🎣 CAST ROD";

                castRod.disabled =
                    false;
            }


            startFishingTimer();


            updateFishingHUD();


            renderFishing();
        }


        /*================================================
          FISHING TIMER
        =================================================*/

        function startFishingTimer() {

            clearInterval(
                fishingInterval
            );


            fishingInterval =
                setInterval(
                    () => {

                        if (
                            game.phase !==
                                2 ||
                            !game.fishingActive
                        ) {

                            return;
                        }


                        game.fishingTimer--;


                        updateFishingHUD();


                        if (
                            game.fishingTimer <=
                            0
                        ) {

                            failFishing();

                        }

                    },
                    1000
                );
        }


        /*================================================
          FISHING FAILURE
        =================================================*/

        function failFishing() {

            clearInterval(
                fishingInterval
            );


            game.fishingActive =
                false;


            fishingState =
                "IDLE";


            if (castRod) {

                castRod.disabled =
                    true;
            }


            const fishPanel =
                phase2.querySelector(
                    ".fishingHeader p"
                );


            if (fishPanel) {

                fishPanel.innerHTML =
                    "TIME'S UP! The fish escaped.";
            }


            setTimeout(
                () => {

                    showMissionComplete(
                        false
                    );

                },
                1200
            );
        }


        /*================================================
          FISHING POINTER CONTROL
        =================================================*/

        fishingCanvas.addEventListener(
            "pointerdown",
            event => {

                if (
                    game.phase !==
                    2 ||
                    !game.fishingActive
                ) {

                    return;
                }


                if (
                    fishingState ===
                    "AIM"
                ) {

                    lockAim();

                    return;
                }


                if (
                    fishingState ===
                    "POWER"
                ) {

                    castRodNow();

                    return;
                }


                if (
                    fishingState ===
                    "HOOKED"
                ) {

                    hookFish();

                    return;
                }


                if (
                    fishingState ===
                    "REELING"
                ) {

                    reelActive =
                        true;

                    return;
                }
            }
        );


        fishingCanvas.addEventListener(
            "pointerup",
            () => {

                reelActive =
                    false;
            }
        );


        /*================================================
          GLOBAL MOUSE REEL
        =================================================*/

        window.addEventListener(
            "mousedown",
            () => {

                if (
                    game.phase ===
                        2 &&
                    fishingState ===
                        "REELING"
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
            }
        );


        /*================================================
          SPACEBAR REEL
        =================================================*/

        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code ===
                        "Space" &&
                    game.phase ===
                        2 &&
                    fishingState ===
                        "REELING"
                ) {

                    event.preventDefault();

                    reelActive =
                        true;
                }
            }
        );


        window.addEventListener(
            "keyup",
            event => {

                if (
                    event.code ===
                    "Space"
                ) {

                    reelActive =
                        false;
                }
            }
        );


        /*================================================
          LOCK AIM
        =================================================*/

        function lockAim() {

            fishingState =
                "POWER";


            castPower =
                0;


            if (castRod) {

                castRod.innerText =
                    "🎣 LOCK CAST POWER";
            }
        }


        /*================================================
          CAST ROD
        =================================================*/

        function castRodNow() {

            fishingState =
                "WAITING";


            castPower =
                Math.max(
                    10,
                    castPower
                );


            lureX =
                fishingWidth /
                    2 +
                aimAngle *
                    fishingWidth *
                    0.35;


            lureY =
                fishingHeight *
                (
                    0.80 -
                    (
                        castPower /
                        100
                    ) *
                    0.35
                );


            fishDistance =
                25 +
                castPower *
                    0.35;


            rodKick =
                1;


            hide(
                bite
            );


            if (castRod) {

                castRod.innerText =
                    "⏳ WAITING FOR BITE...";

                castRod.disabled =
                    true;
            }


            if (powerFill) {

                powerFill.style.width =
                    castPower +
                    "%";
            }


            clearTimeout(
                fishBiteTimeout
            );


            fishBiteTimeout =
                setTimeout(
                    fishBites,
                    2500 +
                        Math.random() *
                            2500
                );
        }


        /*================================================
          FISH BITE
        =================================================*/

        function fishBites() {

            if (
                fishingState !==
                    "WAITING" ||
                !game.fishingActive
            ) {

                return;
            }


            const fishTypes = [

                "goldFish",
                "heartFish",
                "rainbowFish"

            ];


            currentFish =
                fishTypes[
                    Math.floor(
                        Math.random() *
                        fishTypes.length
                    )
                ];


            fishingState =
                "HOOKED";


            rodKick =
                1;


            show(
                bite
            );


            if (castRod) {

                castRod.innerText =
                    "❗ FISH BITE! CLICK!";
            }


            setTimeout(
                () => {

                    hide(
                        bite
                    );

                },
                1600
            );
        }


        /*================================================
          HOOK FISH
        =================================================*/

        function hookFish() {

            hide(
                bite
            );


            playSound(
                splashSound,
                "splash"
            );


            fishingState =
                "REELING";


            lineTension =
                25;


            if (castRod) {

                castRod.innerText =
                    "🎣 HOLD TO REEL";
            }
        }


        /*================================================
          LAND FISH
        =================================================*/

        function landFish() {

            game.fishCaught++;


            game.score +=
                150;


            game.xp +=
                50;


            fishingState =
                "AIM";


            lineTension =
                0;


            fishDistance =
                0;


            rodAngle =
                -0.72;

            rodTargetAngle =
                -0.72;


            reelActive =
                false;


            hide(
                bite
            );


            if (castRod) {

                castRod.disabled =
                    false;

                castRod.innerText =
                    "🎣 AIM & CAST NEXT FISH";
            }


            updateFishingHUD();


            if (
                game.fishCaught >=
                game.targetFish
            ) {

                completeFishing();

                return;
            }


            setTimeout(
                () => {

                    if (
                        game.fishingActive &&
                        game.phase ===
                            2
                    ) {

                        fishingState =
                            "AIM";

                    }

                },
                500
            );
        }


        /*================================================
          COMPLETE FISHING
        =================================================*/

        function completeFishing() {

            clearInterval(
                fishingInterval
            );


            clearTimeout(
                fishBiteTimeout
            );


            game.fishingActive =
                false;


            fishingState =
                "IDLE";


            playSound(
                successSound,
                "success"
            );


            game.xp +=
                100;


            updateFishingHUD();


            setTimeout(
                () => {

                    showMissionComplete(
                        true
                    );

                },
                700
            );
        }


        /*================================================
          MISSION COMPLETE
        =================================================*/

        function showMissionComplete(
            successful
        ) {

            hide(
                phase2
            );


            hide(
                gameHUD
            );


            hide(
                inventoryPanel
            );


            show(
                missionComplete
            );


            const finalXP =
                document.getElementById(
                    "finalXP"
                );


            if (finalXP) {

                finalXP.innerText =
                    game.xp;
            }


            const reportCards =
                missionComplete.querySelectorAll(
                    ".reportCard"
                );


            if (
                !successful &&
                reportCards.length >=
                    4
            ) {

                reportCards[2]
                    .querySelector("p")
                    .innerText =
                    `${game.fishCaught} / ${game.targetFish}`;

                reportCards[3]
                    .querySelector("p")
                    .innerText =
                    "INCOMPLETE";
            }
        }


        /*================================================
          DRAW LAKE
        =================================================*/

        function drawLake() {

            if (
                !fishingCtx
            ) {

                return;
            }


            if (
                assets.lake.complete &&
                assets.lake.naturalWidth
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
                    "#173b4d"
                );

                gradient.addColorStop(
                    0.55,
                    "#0b526b"
                );

                gradient.addColorStop(
                    1,
                    "#062b3a"
                );


                fishingCtx.fillStyle =
                    gradient;


                fishingCtx.fillRect(

                    0,
                    0,

                    fishingWidth,

                    fishingHeight

                );
            }
        }


        /*================================================
          DRAW FIRST PERSON ROD
        =================================================*/

        function drawFishingRod() {

            const handX =
                fishingWidth *
                0.88;


            const handY =
                fishingHeight *
                1.05;


            const rodLength =
                Math.min(

                    fishingWidth *
                        0.48,

                    fishingHeight *
                        0.64

                );


            const angle =
                rodAngle -
                rodKick *
                    0.12;


            const tipX =
                handX +
                Math.cos(angle) *
                    rodLength;


            const tipY =
                handY +
                Math.sin(angle) *
                    rodLength;


            fishingCtx.save();


            fishingCtx.lineCap =
                "round";


            fishingCtx.strokeStyle =
                "rgba(0,0,0,0.45)";

            fishingCtx.lineWidth =
                16;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                handX,
                handY
            );

            fishingCtx.lineTo(
                tipX,
                tipY
            );

            fishingCtx.stroke();


            const gradient =
                fishingCtx.createLinearGradient(

                    handX,
                    handY,

                    tipX,
                    tipY

                );


            gradient.addColorStop(
                0,
                "#101519"
            );

            gradient.addColorStop(
                0.55,
                "#46545d"
            );

            gradient.addColorStop(
                1,
                "#b9c3c8"
            );


            fishingCtx.strokeStyle =
                gradient;

            fishingCtx.lineWidth =
                9;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                handX,
                handY
            );

            fishingCtx.lineTo(
                tipX,
                tipY
            );

            fishingCtx.stroke();


            const handleX =
                handX -
                Math.cos(angle) *
                    70;


            const handleY =
                handY -
                Math.sin(angle) *
                    70;


            fishingCtx.strokeStyle =
                "#a8753d";

            fishingCtx.lineWidth =
                24;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                handX,
                handY
            );

            fishingCtx.lineTo(
                handleX,
                handleY
            );

            fishingCtx.stroke();


            const reelX =
                handX -
                Math.cos(angle) *
                    34;


            const reelY =
                handY -
                Math.sin(angle) *
                    34;


            fishingCtx.fillStyle =
                "#11171b";


            fishingCtx.beginPath();

            fishingCtx.ellipse(

                reelX,

                reelY +
                    12,

                31,

                43,

                angle,

                0,

                Math.PI *
                    2

            );

            fishingCtx.fill();


            fishingCtx.strokeStyle =
                "#b8c2c7";

            fishingCtx.lineWidth =
                4;


            fishingCtx.beginPath();

            fishingCtx.ellipse(

                reelX,

                reelY +
                    12,

                22,

                34,

                angle,

                0,

                Math.PI *
                    2

            );

            fishingCtx.stroke();


            const rotation =
                reelRotation *
                8;


            const crankX =
                reelX +
                Math.cos(rotation) *
                    25;


            const crankY =
                reelY +
                12 +
                Math.sin(rotation) *
                    25;


            fishingCtx.strokeStyle =
                "#d5dcdf";

            fishingCtx.lineWidth =
                5;


            fishingCtx.beginPath();

            fishingCtx.moveTo(
                reelX,
                reelY +
                    12
            );

            fishingCtx.lineTo(
                crankX,
                crankY
            );

            fishingCtx.stroke();


            fishingCtx.fillStyle =
                "#151b1f";


            fishingCtx.beginPath();

            fishingCtx.arc(

                crankX,

                crankY,

                7,

                0,

                Math.PI *
                    2

            );

            fishingCtx.fill();


            for (
                let i = 1;
                i <= 5;
                i++
            ) {

                const progress =
                    i /
                    6;


                const guideX =
                    handX +
                    Math.cos(angle) *
                        rodLength *
                        progress;


                const guideY =
                    handY +
                    Math.sin(angle) *
                        rodLength *
                        progress;


                fishingCtx.strokeStyle =
                    "rgba(230,240,244,0.8)";


                fishingCtx.lineWidth =
                    2;


                fishingCtx.beginPath();

                fishingCtx.arc(

                    guideX,

                    guideY,

                    5 -
                        i *
                            0.5,

                    0,

                    Math.PI *
                        2

                );

                fishingCtx.stroke();
            }


            fishingCtx.restore();


            return {

                tipX:
                    tipX,

                tipY:
                    tipY

            };
        }


        /*================================================
          DRAW FISHING LINE
        =================================================*/

        function drawFishingLine(
            tipX,
            tipY
        ) {

            if (
                fishingState !==
                    "WAITING" &&
                fishingState !==
                    "HOOKED" &&
                fishingState !==
                    "REELING"
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
                        0.5
                );


            fishingCtx.save();


            fishingCtx.strokeStyle =
                lineTension >
                    75
                    ? "#ff5252"
                    : "#f5f7f8";


            fishingCtx.lineWidth =
                lineTension >
                    75
                    ? 3
                    : 1.5;


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                tipX,
                tipY
            );


            fishingCtx.quadraticCurveTo(

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


            fishingCtx.stroke();


            fishingCtx.fillStyle =
                "#f4f4f4";


            fishingCtx.beginPath();

            fishingCtx.arc(

                lureX,

                lureY,

                7,

                0,

                Math.PI *
                    2

            );

            fishingCtx.fill();


            fishingCtx.fillStyle =
                "#e53935";


            fishingCtx.beginPath();

            fishingCtx.arc(

                lureX,

                lureY -
                    3,

                7,

                Math.PI,

                0

            );

            fishingCtx.fill();


            fishingCtx.restore();
        }


        /*================================================
          DRAW FISH
        =================================================*/

        function drawFish() {

            if (
                fishingState !==
                    "HOOKED" &&
                fishingState !==
                    "REELING"
            ) {

                return;
            }


            const fishImage =
                assets.fish[
                    currentFish
                ];


            if (
                !fishImage ||
                !fishImage.complete ||
                !fishImage.naturalWidth
            ) {

                return;
            }


            fishingCtx.save();


            fishingCtx.globalAlpha =
                0.9;


            const movement =
                Math.sin(
                    performance.now() /
                    180
                ) *
                5;


            fishingCtx.drawImage(

                fishImage,

                lureX -
                    42,

                lureY +
                    movement,

                84,

                60

            );


            fishingCtx.restore();
        }


        /*================================================
          RENDER FISHING
        =================================================*/

        function renderFishing() {

            if (
                game.phase !==
                2 ||
                !fishingCtx
            ) {

                return;
            }


            drawLake();


            const rod =
                drawFishingRod();


            if (
                fishingState ===
                    "AIM" ||
                fishingState ===
                    "POWER"
            ) {

                const targetX =
                    fishingWidth /
                        2 +
                    aimAngle *
                        fishingWidth *
                        0.35;


                const targetY =
                    fishingHeight *
                    (
                        0.80 -
                        (
                            castPower /
                            100
                        ) *
                            0.35
                    );


                fishingCtx.save();


                fishingCtx.strokeStyle =
                    "rgba(79,195,247,0.75)";


                fishingCtx.lineWidth =
                    2;


                fishingCtx.setLineDash(
                    [
                        7,
                        8
                    ]
                );


                fishingCtx.beginPath();


                fishingCtx.moveTo(

                    rod.tipX,

                    rod.tipY

                );


                fishingCtx.lineTo(

                    targetX,

                    targetY

                );


                fishingCtx.stroke();


                fishingCtx.restore();
            }


            drawFishingLine(

                rod.tipX,

                rod.tipY

            );


            drawFish();
        }


        /*================================================
          UPDATE FISHING
        =================================================*/

        function updateFishing(
            dt
        ) {

            if (
                game.phase !==
                    2 ||
                !game.fishingActive
            ) {

                return;
            }


            if (
                fishingState ===
                "AIM"
            ) {

                aimAngle +=
                    aimDirection *
                    1.2 *
                    dt;


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
                    -0.72 +
                    aimAngle *
                        0.42;
            }


            if (
                fishingState ===
                "POWER"
            ) {

                castPower +=
                    castDirection *
                    100 *
                    dt;


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


                rodTargetAngle =
                    -0.72 +
                    (
                        castPower /
                        100
                    ) *
                    0.20;
            }


            if (
                fishingState ===
                "WAITING"
            ) {

                rodTargetAngle =
                    -0.52;
            }


            if (
                fishingState ===
                "HOOKED"
            ) {

                rodTargetAngle =
                    -0.52 -
                    Math.sin(
                        performance.now() /
                        75
                    ) *
                    0.07;


                rodKick =
                    Math.max(
                        0,
                        rodKick -
                            dt *
                            2
                    );
            }


            if (
                fishingState ===
                "REELING"
            ) {

                if (
                    reelActive
                ) {

                    lineTension =
                        Math.min(
                            100,
                            lineTension +
                                40 *
                                dt
                        );


                    fishDistance -=
                        8 *
                        dt;


                    reelRotation +=
                        12 *
                        dt;


                    rodTargetAngle =
                        -0.58 -
                        Math.sin(
                            performance.now() /
                            100
                        ) *
                        0.09;

                } else {

                    lineTension =
                        Math.max(
                            0,
                            lineTension -
                                28 *
                                dt
                        );


                    fishDistance +=
                        2 *
                        dt;


                    rodTargetAngle =
                        -0.52;
                }


                if (
                    lineTension >=
                    100
                ) {

                    lineTension =
                        0;


                    fishingState =
                        "AIM";


                    reelActive =
                        false;


                    if (castRod) {

                        castRod.disabled =
                            false;

                        castRod.innerText =
                            "🎣 AIM & CAST AGAIN";
                    }


                } else if (
                    fishDistance <=
                    2
                ) {

                    landFish();
                }
            }


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


            updateFishingHUD();
        }


        /*================================================
          FISHING ANIMATION LOOP
        =================================================*/

        let lastFishingTime =
            performance.now();


        function fishingLoop(
            now
        ) {

            const dt =
                Math.min(
                    (
                        now -
                        lastFishingTime
                    ) /
                        1000,

                    0.05
                );


            lastFishingTime =
                now;


            updateFishing(
                dt
            );


            if (
                game.phase ===
                2
            ) {

                renderFishing();
            }


            requestAnimationFrame(
                fishingLoop
            );
        }


        /*================================================
          PHASE 1 ANIMATION LOOP
        =================================================*/

        function campsiteLoop() {

            if (
                game.phase ===
                1
            ) {

                renderCampsite();
            }


            requestAnimationFrame(
                campsiteLoop
            );
        }


        /*================================================
          START BUTTON
        =================================================*/

        if (startMission) {

            startMission.addEventListener(
                "click",
                initMission
            );
        }


        /*================================================
          CONTINUE FISHING BUTTON
        =================================================*/

        if (continueFishing) {

            continueFishing.addEventListener(
                "click",
                goToFishing
            );
        }


        /*================================================
          REPLAY BUTTON
        =================================================*/

        if (replayMission) {

            replayMission.addEventListener(
                "click",
                () => {

                    hide(
                        missionComplete
                    );


                    initMission();

                }
            );
        }


        /*================================================
          HINT BUTTON EVENT
        =================================================*/

        if (hintButton) {

            hintButton.addEventListener(
                "click",
                useHint
            );
        }


        /*================================================
          CAMPSITE CLICK EVENT
        =================================================*/

        if (campCanvas) {

            campCanvas.addEventListener(
                "pointerdown",
                handleCampsiteClick
            );
        }


        /*================================================
          CAST BUTTON
        =================================================*/

        if (castRod) {

            castRod.addEventListener(
                "click",
                () => {

                    if (
                        game.phase !==
                        2
                    ) {

                        return;
                    }


                    if (
                        fishingState ===
                        "AIM"
                    ) {

                        lockAim();

                    } else if (
                        fishingState ===
                        "POWER"
                    ) {

                        castRodNow();

                    } else if (
                        fishingState ===
                        "HOOKED"
                    ) {

                        hookFish();

                    } else if (
                        fishingState ===
                        "REELING"
                    ) {

                        reelActive =
                            !reelActive;
                    }
                }
            );
        }


        /*================================================
          LOADING / INTRO COMPATIBILITY
        =================================================*/

        if (
            loadingScreen &&
            introScreen
        ) {

            setTimeout(
                () => {

                    hide(
                        loadingScreen
                    );

                    show(
                        introScreen
                    );

                },
                900
            );
        }


        /*================================================
          INITIAL STATE
        =================================================*/

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


        /*================================================
          START ANIMATION LOOPS
        =================================================*/

        campsiteLoop();

        fishingLoop();


    })();

}
