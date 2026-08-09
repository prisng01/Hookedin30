/*======================================================
 OPERATION BIRTHDAY 30
 MISSION 02
 GAME.JS
 COMPLETE AMENDED VERSION

 IMPORTANT:
 - ALL IMAGE ASSETS ARE PNG
 - PHASE 1 = CAMPSITE SEARCH
 - PHASE 2 = FISHING
 - NO ANGLER IMAGE
 - FISHING ROD IS DRAWN DIRECTLY ON CANVAS
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

            totalItems: 10,

            fishCaught: 0,

            targetFish: 6,

            bearProgress: 100,

            missionActive: false,

            fishingActive: false

        };


        /*================================================
          PHASE 1 ITEMS
        =================================================*/

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


        /*================================================
          CANVAS
        =================================================*/

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
          AUDIO
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


        /*================================================
          ASSETS
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


        /*================================================
          TIMERS
        =================================================*/

        let phase1Interval =
            null;

        let fishingInterval =
            null;


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

                /* Ignore audio errors */

            }
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


        /*================================================
          CREATE 10 UNIQUE CAMPSITE ITEMS
        =================================================*/

        function createCampsiteItems() {

            /*
             * Positions are percentages of the campsite.
             * They are deliberately fixed so each item
             * remains in a natural place.
             */

            const positions = [

                {
                    key: "tent",
                    x: 0.16,
                    y: 0.32,
                    scale: 1.00
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
                    x: 0.31,
                    y: 0.73,
                    scale: 0.62
                },

                {
                    key: "fishingRod",
                    x: 0.69,
                    y: 0.68,
                    scale: 0.82
                },

                {
                    key: "map",
                    x: 0.11,
                    y: 0.70,
                    scale: 0.68
                },

                {
                    key: "camera",
                    x: 0.57,
                    y: 0.48,
                    scale: 0.62
                },

                {
                    key: "key",
                    x: 0.79,
                    y: 0.57,
                    scale: 0.55
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
                bearSound
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


            /*
             * Use the existing Phase 1 complete
             * panel as the failure screen.
             */

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
                    "The bear reached the campsite before you recovered all the equipment.";
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
          CAMPSITE IMAGE
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
          BLENDED CAMPSITE ITEM
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


            /*
             * Scale objects according to
             * the campsite size.
             */

            const baseSize =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.085;


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


            /*
             * VERY subtle shadow.
             * No circle behind item.
             */

            campCtx.shadowColor =
                "rgba(0,0,0,0.28)";

            campCtx.shadowBlur =
                4;

            campCtx.shadowOffsetX =
                1;

            campCtx.shadowOffsetY =
                2;


            /*
             * First layer:
             * blend into campsite.
             */

            campCtx.globalAlpha =
                0.62;

            campCtx.globalCompositeOperation =
                "multiply";


            campCtx.drawImage(

                image,

                x -
                    drawWidth / 2,

                y -
                    drawHeight / 2,

                drawWidth,

                drawHeight

            );


            /*
             * Second layer:
             * restore enough detail
             * for the player to discover it.
             */

            campCtx.globalCompositeOperation =
                "source-over";

            campCtx.globalAlpha =
                0.38;


            campCtx.shadowColor =
                "transparent";


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
          DRAW BEAR
        =================================================*/

        function drawBear() {

            if (
                !campCtx ||
                !assets.bear.complete ||
                !assets.bear.naturalWidth
            ) {

                return;
            }


            const bearSize =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.10;


            /*
             * Bear approaches from
             * the upper-right area.
             */

            const progress =
                game.bearProgress /
                100;


            const bearX =
                campWidth -
                80 -
                progress *
                    80;


            const bearY =
                55;


            campCtx.save();


            campCtx.globalAlpha =
                0.92;


            campCtx.drawImage(

                assets.bear,

                bearX -
                    bearSize / 2,

                bearY -
                    bearSize / 2,

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


            /*
             * Canvas may be scaled by CSS,
             * so convert to actual canvas coordinates.
             */

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


                /*
                 * Invisible click area.
                 *
                 * Object remains visually small,
                 * but player doesn't need pixel-perfect
                 * clicking.
                 */

                const hitRadius =
                    Math.max(
                        30,
                        Math.min(
                            campWidth,
                            campHeight
                        ) *
                        0.045
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


            game.itemsFound++;


            game.xp +=
                20;


            game.score +=
                100;


            playSound(
                collectSound
            );


            updateMainHUD();


            /*
             * Redraw immediately
             * so item disappears.
             */

            renderCampsite();


            /*
             * All 10 collected.
             */

            if (
                game.itemsFound >=
                game.totalItems
            ) {

                completePhase1();
            }
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


            game.xp +=
                0;


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

            game.score =
                game.score;

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
            event => {

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


            /*
             * Fish takes between
             * 2.5 and 5 seconds to bite.
             */

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


            /*
             * Hide the bite message after
             * a short period.
             */

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
                splashSound
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


            /*
             * Give score for fish.
             */

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


            /*
             * Small success delay before
             * next cast.
             */

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
                successSound
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


            /*------------------------------------------
              ROD SHADOW
            ------------------------------------------*/

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


            /*------------------------------------------
              MAIN ROD
            ------------------------------------------*/

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


            /*------------------------------------------
              CORK HANDLE
            ------------------------------------------*/

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


            /*------------------------------------------
              REEL BODY
            ------------------------------------------*/

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


            /*------------------------------------------
              REEL HANDLE
            ------------------------------------------*/

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


            /*------------------------------------------
              ROD GUIDES
            ------------------------------------------*/

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


            /*------------------------------------------
              BOBBER
            ------------------------------------------*/

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


            /*------------------------------------------
              AIMING GUIDE
            ------------------------------------------*/

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


            /*------------------------------------------
              AIM
            ------------------------------------------*/

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


            /*------------------------------------------
              POWER
            ------------------------------------------*/

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


            /*------------------------------------------
              WAITING
            ------------------------------------------*/

            if (
                fishingState ===
                "WAITING"
            ) {

                rodTargetAngle =
                    -0.52;
            }


            /*------------------------------------------
              HOOKED
            ------------------------------------------*/

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


            /*------------------------------------------
              REELING
            ------------------------------------------*/

            if (
                fishingState ===
                "REELING"
            ) {

                if (
                    reelActive
                ) {

                    /*
                     * Reeling brings the fish closer
                     * but increases line tension.
                     */

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

                    /*
                     * Releasing the reel lets tension
                     * drop but fish moves away slightly.
                     */

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

                    /*
                     * Line snaps.
                     */

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


            /*------------------------------------------
              SMOOTH ROD MOVEMENT
            ------------------------------------------*/

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
