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

if (
    window.__OPERATION_BIRTHDAY_MISSION_2_LOADED
) {
    console.warn(
        "Mission 2 game.js already loaded. Skipping duplicate initialisation."
    );
} else {

    window.__OPERATION_BIRTHDAY_MISSION_2_LOADED =
        true;

    (() => {


        /*================================================
          GAME STATE
        ================================================*/

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
          ITEM DATA
        ================================================*/

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
        ================================================*/

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
          DOM ELEMENTS
        ================================================*/

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


        const startMissionBtn =
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


        const terminal =
            document.getElementById(
                "terminal"
            );


        /*================================================
          AUDIO
        ================================================*/

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
          IMAGE LOADER
        ================================================*/

        function loadImage(
            src
        ) {

            const image =
                new Image();


            image.src =
                src;


            image.onerror =
                () => {

                    console.warn(
                        "Unable to load image:",
                        src
                    );

                };


            return image;

        }


        /*================================================
          ASSETS
        ================================================*/

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
        ================================================*/

        let phase1Interval =
            null;


        let fishingInterval =
            null;


        let fishBiteTimeout =
            null;


        /*================================================
          FISHING STATE
        ================================================*/

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


        let rodAngle =
            -0.72;


        let rodTargetAngle =
            -0.72;


        let rodKick =
            0;


        let reelRotation =
            0;


        /*================================================
          BASIC HELPERS
        ================================================*/

        function show(
            element
        ) {

            if (!element) {

                return;

            }


            element.classList.remove(
                "hidden"
            );

        }


        function hide(
            element
        ) {

            if (!element) {

                return;

            }


            element.classList.add(
                "hidden"
            );

        }


        function playSound(
            sound
        ) {

            if (!sound) {

                return;

            }


            try {

                sound.currentTime =
                    0;

                sound.play()
                    .catch(
                        () => {}
                    );

            } catch (
                error
            ) {

                console.warn(
                    "Audio error:",
                    error
                );

            }

        }


        function stopSound(
            sound
        ) {

            if (!sound) {

                return;

            }


            try {

                sound.pause();

            } catch (
                error
            ) {}

        }


        /*================================================
          CANVAS RESIZE
        ================================================*/

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
          MAIN HUD
        ================================================*/

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
          FISHING HUD
        ================================================*/

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
          SHOW PHASE 1
        ================================================*/

        function showPhase1() {

            hide(
                introScreen
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
                phase1
            );

            show(
                gameHUD
            );

            show(
                inventoryPanel
            );

        }


        /*================================================
          START MISSION
        ================================================*/

        function startMission() {

            stopSound(
                bgMusic
            );


            if (bgMusic) {

                bgMusic.currentTime =
                    0;

                bgMusic.play()
                    .catch(
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
          CAMPSITE ITEMS
          
          AMENDED POSITIONS / SIZES
        ================================================*/

        function createCampsiteItems() {

            const positions = [

                {
                    key: "tent",
                    x: 0.18,
                    y: 0.73,
                    scale: 1.25
                },

                {
                    key: "backpack",
                    x: 0.30,
                    y: 0.62,
                    scale: 1.05
                },

                {
                    key: "torchlight",
                    x: 0.63,
                    y: 0.66,
                    scale: 1.00
                },

                {
                    key: "compass",
                    x: 0.82,
                    y: 0.73,
                    scale: 0.95
                },

                {
                    key: "boots",
                    x: 0.42,
                    y: 0.79,
                    scale: 0.95
                },

                {
                    key: "bottle",
                    x: 0.72,
                    y: 0.55,
                    scale: 0.95
                },

                {
                    key: "fishingRod",
                    x: 0.89,
                    y: 0.57,
                    scale: 1.00
                },

                {
                    key: "map",
                    x: 0.57,
                    y: 0.86,
                    scale: 0.95
                },

                {
                    key: "camera",
                    x: 0.08,
                    y: 0.60,
                    scale: 0.95
                },

                {
                    key: "key",
                    x: 0.92,
                    y: 0.79,
                    scale: 0.95
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


        /*================================================
          INVENTORY
        ================================================*/

        function updateInventory() {

            const slots =
                document.querySelectorAll(
                    ".inventorySlot"
                );


            slots.forEach(
                (
                    slot,
                    index
                ) => {

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


        /*================================================
          CAMPSITE BACKGROUND
        ================================================*/

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
          DRAW HIDDEN ITEM
          
          AMENDED:
          - LARGER ITEMS
          - BLENDED INTO BACKGROUND
          - NO CIRCLE BEHIND ITEM
        ================================================*/

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
             * Increased from 0.085
             * to 0.10 so the items
             * are easier to see.
             */

            const baseSize =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.10;


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
             * Subtle shadow.
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
             * for discovery.
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
        ================================================*/

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
             * upper-right area.
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
        ================================================*/

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
        ================================================*/

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
             * Canvas may be scaled
             * by CSS.
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
                 * Increased click area.
                 */

                const hitRadius =
                    Math.max(

                        30,

                        Math.min(
                            campWidth,
                            campHeight
                        ) *
                        0.055

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
        ================================================*/

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


            updateInventory();


            /*
             * Redraw immediately.
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
          PHASE 1 TIMER
        ================================================*/

        function startPhase1Timer() {

            clearInterval(
                phase1Interval
            );


            game.timer =
                60;


            updateMainHUD();


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


                        game.timer--;


                        game.bearProgress =
                            Math.max(

                                0,

                                (
                                    game.timer /
                                    60
                                ) *
                                100

                            );


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
        ================================================*/

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
             * Use existing Phase 1
             * complete panel.
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
                    "The bear reached the campsite before you recovered all of the equipment.";

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
          COMPLETE PHASE 1
        ================================================*/

        function completePhase1() {

            clearInterval(
                phase1Interval
            );


            game.missionActive =
                false;


            game.phase =
                1;


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
        ================================================*/

        function goToFishing() {

            if (
                game.itemsFound <
                game.totalItems
            ) {

                console.warn(
                    "Cannot start fishing. Not all items collected."
                );


                return;

            }


            hide(
                phase1Complete
            );


            hide(
                phase1
            );


            hide(
                inventoryPanel
            );


            show(
                phase2
            );


            game.phase =
                2;


            game.fishingActive =
                true;


            game.missionActive =
                true;


            startFishing();

        }


        /*================================================
          RESET MISSION
        ================================================*/

        function resetMission() {

            /*
             * Stop all timers.
             */

            clearInterval(
                phase1Interval
            );


            clearInterval(
                fishingInterval
            );


            clearTimeout(
                fishBiteTimeout
            );


            phase1Interval =
                null;


            fishingInterval =
                null;


            fishBiteTimeout =
                null;


            /*
             * Reset game state.
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


            /*
             * Reset fishing.
             */

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


            /*
             * Reset item array.
             */

            items =
                [];


            /*
             * Hide all game screens.
             */

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


            /*
             * Show intro.
             */

            show(
                introScreen
            );


            /*
             * Reset button.
             */

            if (
                castRod
            ) {

                castRod.disabled =
                    false;


                castRod.innerText =
                    "🎣 CAST ROD";

            }


            /*
             * Reset fishing
             * progress bars.
             */

            if (
                powerFill
            ) {

                powerFill.style.width =
                    "0%";

            }


            if (
                reelFill
            ) {

                reelFill.style.width =
                    "0%";

            }


            /*
             * Reset terminal.
             */

            if (
                terminal
            ) {

                terminal.innerHTML =
                    "";

            }


            updateMainHUD();


            updateFishingHUD();


            startTerminal();

        }


        /*================================================
          TERMINAL INTRO
        ================================================*/

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


            let line =
                0;


            function typeLine() {

                if (
                    line >=
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
                        line
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


                                line++;


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
             /*================================================
          FISHING ANIMATION LOOP
        ================================================*/

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
        ================================================*/

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
        ================================================*/

        if (
            startMissionBtn
        ) {

            startMissionBtn.addEventListener(

                "click",

                startMission

            );

        }


        /*================================================
          CONTINUE TO FISHING BUTTON
        ================================================*/

        if (
            continueFishing
        ) {

            continueFishing.addEventListener(

                "click",

                goToFishing

            );

        }


        /*================================================
          REPLAY BUTTON
        ================================================*/

        if (
            replayMission
        ) {

            replayMission.addEventListener(

                "click",

                () => {

                    resetMission();

                }

            );

        }


        /*================================================
          CAMPSITE CLICK HANDLER
        ================================================*/

        if (
            campCanvas
        ) {

            campCanvas.addEventListener(

                "pointerdown",

                handleCampsiteClick

            );

        }


        /*================================================
          CAST ROD BUTTON
        ================================================*/

        if (
            castRod
        ) {

            castRod.addEventListener(

                "click",

                () => {

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
                            !reelActive;

                        return;

                    }

                }

            );

        }


        /*================================================
          FISHING KEYBOARD CONTROLS
        ================================================*/

        document.addEventListener(

            "keydown",

            event => {

                if (
                    game.phase !==
                    2 ||
                    !game.fishingActive
                ) {

                    return;

                }


                /*
                 * SPACE:
                 * Reel the fish while hooked.
                 */

                if (
                    event.code ===
                    "Space"
                ) {

                    event.preventDefault();


                    if (
                        fishingState ===
                        "REELING"
                    ) {

                        reelActive =
                            true;

                    }

                }


                /*
                 * ENTER:
                 * Same action as CAST ROD.
                 */

                if (
                    event.code ===
                    "Enter"
                ) {

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

                    }

                }

            }

        );


        document.addEventListener(

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
          FISHING POINTER REEL
        ================================================*/

        if (
            fishingCanvas
        ) {

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


                    /*
                     * During REELING,
                     * holding the canvas
                     * reels the fish in.
                     */

                    if (
                        fishingState ===
                        "REELING"
                    ) {

                        reelActive =
                            true;

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


            fishingCanvas.addEventListener(

                "pointerleave",

                () => {

                    reelActive =
                        false;

                }

            );

        }


        /*================================================
          GO TO FISHING
        ================================================*/

        function goToFishing() {

            if (
                game.itemsFound <
                game.totalItems
            ) {

                console.warn(
                    "Cannot start fishing. Not all items collected."
                );


                return;

            }


            hide(
                phase1Complete
            );


            hide(
                phase1
            );


            hide(
                inventoryPanel
            );


            show(
                phase2
            );


            game.phase =
                2;


            game.fishingActive =
                true;


            game.missionActive =
                true;


            startFishing();

        }


        /*================================================
          RESET MISSION
        ================================================*/

        function resetMission() {

            /*
             * Stop all timers.
             */

            clearInterval(
                phase1Interval
            );


            clearInterval(
                fishingInterval
            );


            clearTimeout(
                fishBiteTimeout
            );


            phase1Interval =
                null;


            fishingInterval =
                null;


            fishBiteTimeout =
                null;


            /*
             * Reset game state.
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


            /*
             * Reset fishing.
             */

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


            /*
             * Reset item array.
             */

            items =
                [];


            /*
             * Hide all game screens.
             */

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


            /*
             * Show intro.
             */

            show(
                introScreen
            );


            /*
             * Reset button.
             */

            if (
                castRod
            ) {

                castRod.disabled =
                    false;


                castRod.innerText =
                    "🎣 CAST ROD";

            }


            /*
             * Reset fishing
             * progress bars.
             */

            if (
                powerFill
            ) {

                powerFill.style.width =
                    "0%";

            }


            if (
                reelFill
            ) {

                reelFill.style.width =
                    "0%";

            }


            /*
             * Reset terminal.
             */

            if (
                terminal
            ) {

                terminal.innerHTML =
                    "";

            }


            updateMainHUD();


            updateFishingHUD();


            startTerminal();

        }
             /*================================================
          TERMINAL INTRO
        ================================================*/

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


            let line =
                0;


            function typeLine() {

                if (
                    line >=
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
                        line
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


                                line++;


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


        /*================================================
          LOADING SCREEN
        ================================================*/

        function startLoadingScreen() {

            if (
                !loadingScreen
            ) {

                initialiseGame();

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

                "Connecting to Mission Control...",

                "Authenticating Chief Adventurer...",

                "Decrypting Mission Files...",

                "Scanning Campsite...",

                "Bear detected nearby...",

                "Fishing coordinates received...",

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


                        /*
                         * Update loading message
                         * at each stage.
                         */

                        const newIndex =
                            Math.min(

                                messages.length -
                                    1,

                                Math.floor(
                                    progress /
                                    (
                                        100 /
                                        (
                                            messages.length -
                                            1
                                        )
                                    )
                                )

                            );


                        if (
                            newIndex !==
                            messageIndex
                        ) {

                            messageIndex =
                                newIndex;


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


                                    initialiseGame();

                                },

                                600

                            );

                        }

                    },

                    50

                );

        }


        /*================================================
          INITIALISE GAME
        ================================================*/

        function initialiseGame() {

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


        /*================================================
          START FISHING RENDER LOOP
        ================================================*/

        function startFishingRenderLoop() {

            let lastTime =
                performance.now();


            function loop(
                currentTime
            ) {

                const delta =
                    Math.min(

                        (
                            currentTime -
                            lastTime
                        ) /
                        1000,

                        0.05

                    );


                lastTime =
                    currentTime;


                if (
                    game.phase ===
                    2 &&
                    game.fishingActive
                ) {

                    updateFishing(
                        delta
                    );


                    renderFishing();

                }


                requestAnimationFrame(
                    loop
                );

            }


            requestAnimationFrame(
                loop
            );

        }


        /*================================================
          START CAMPSITE RENDER LOOP
        ================================================*/

        function startCampsiteRenderLoop() {

            function loop() {

                if (
                    game.phase ===
                    1 &&
                    game.missionActive
                ) {

                    renderCampsite();

                }


                requestAnimationFrame(
                    loop
                );

            }


            requestAnimationFrame(
                loop
            );

        }


        /*================================================
          INITIAL START
        ================================================*/

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(

                "DOMContentLoaded",

                () => {

                    startLoadingScreen();

                    startFishingRenderLoop();

                    startCampsiteRenderLoop();

                }

            );

        } else {

            startLoadingScreen();

            startFishingRenderLoop();

            startCampsiteRenderLoop();

        }


        /*================================================
          PUBLIC DEBUG ACCESS
        ================================================*/

        window.Mission2 =
            {

                game,

                startMission,

                goToFishing,

                resetMission,

                createCampsiteItems,

                renderCampsite,

                renderFishing,

                startFishing

            };


    })();

}
        /*================================================
          DRAW HIDDEN ITEM
          
          AMENDED:
          - LARGER ITEMS
          - BLENDED INTO BACKGROUND
          - NO CIRCLE BEHIND ITEM
        ================================================*/

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
             * Increased from 0.085
             * to 0.10 so the items
             * are easier to see.
             */

            const baseSize =
                Math.min(
                    campWidth,
                    campHeight
                ) *
                0.10;


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
             * Subtle shadow.
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
             *
                 /*================================================
          FISHING TIMER
        ================================================*/

        function startFishingTimer() {

            clearInterval(
                fishingInterval
            );


            game.fishingTimer =
                60;


            updateFishingHUD();


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
        ================================================*/

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
        ================================================*/

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
        ================================================*/

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
        ================================================*/

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
        ================================================*/

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
        ================================================*/

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
             * 2.5 and 5 seconds.
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
        ================================================*/

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
        ================================================*/

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
        ================================================*/

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
             * Small delay before
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
        ================================================*/

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
        ================================================*/

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
                    .querySelector(
                        "p"
                    )
                    .innerText =
                    `${game.fishCaught} / ${game.targetFish}`;


                reportCards[3]
                    .querySelector(
                        "p"
                    )
                    .innerText =
                    "INCOMPLETE";

            }

        }


        /*================================================
          DRAW LAKE
        ================================================*/

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
                    "#1d4035"
                );


                gradient.addColorStop(
                    1,
                    "#071d29"
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
        ================================================*/

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
                     * Reeling brings fish
                     * closer but increases
                     * tension.
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
                     * Releasing reel lets
                     * tension drop.
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
        ================================================*/

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
        ================================================*/

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
        ================================================*/

        if (
            startMissionBtn
        ) {

            startMissionBtn.addEventListener(

                "click",

                startMission

            );

        }
        /*================================================
          CONTINUE TO FISHING BUTTON
        ================================================*/

        if (
            continueFishing
        ) {

            continueFishing.addEventListener(

                "click",

                goToFishing

            );

        }


        /*================================================
          REPLAY BUTTON
        ================================================*/

        if (
            replayMission
        ) {

            replayMission.addEventListener(

                "click",

                () => {

                    resetMission();

                }

            );

        }


        /*================================================
          CAMPSITE CLICK HANDLER
        ================================================*/

        if (
            campCanvas
        ) {

            campCanvas.addEventListener(

                "pointerdown",

                handleCampsiteClick

            );

        }


        /*================================================
          CAST ROD BUTTON
        ================================================*/

        if (
            castRod
        ) {

            castRod.addEventListener(

                "click",

                () => {

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
                            !reelActive;

                        return;

                    }

                }

            );

        }


        /*================================================
          FISHING KEYBOARD CONTROLS
        ================================================*/

        document.addEventListener(

            "keydown",

            event => {

                if (
                    game.phase !==
                    2 ||
                    !game.fishingActive
                ) {

                    return;

                }


                /*
                 * SPACE:
                 * Reel the fish while hooked.
                 */

                if (
                    event.code ===
                    "Space"
                ) {

                    event.preventDefault();


                    if (
                        fishingState ===
                        "REELING"
                    ) {

                        reelActive =
                            true;

                    }

                }


                /*
                 * ENTER:
                 * Same action as CAST ROD.
                 */

                if (
                    event.code ===
                    "Enter"
                ) {

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

                    }

                }

            }

        );


        document.addEventListener(

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
          FISHING POINTER REEL
        ================================================*/

        if (
            fishingCanvas
        ) {

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


                    /*
                     * During REELING,
                     * holding the canvas
                     * reels the fish in.
                     */

                    if (
                        fishingState ===
                        "REELING"
                    ) {

                        reelActive =
                            true;

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


            fishingCanvas.addEventListener(

                "pointerleave",

                () => {

                    reelActive =
                        false;

                }

            );

        }


        /*================================================
          GO TO FISHING
        ================================================*/

        function goToFishing() {

            if (
                game.itemsFound <
                game.totalItems
            ) {

                console.warn(
                    "Cannot start fishing. Not all items collected."
                );


                return;

            }


            hide(
                phase1Complete
            );


            hide(
                phase1
            );


            hide(
                inventoryPanel
            );


            show(
                phase2
            );


            game.phase =
                2;


            game.fishingActive =
                true;


            game.missionActive =
                true;


            startFishing();

        }


        /*================================================
          RESET MISSION
        ================================================*/

        function resetMission() {

            /*
             * Stop all timers.
             */

            clearInterval(
                phase1Interval
            );


            clearInterval(
                fishingInterval
            );


            clearTimeout(
                fishBiteTimeout
            );


            phase1Interval =
                null;


            fishingInterval =
                null;


            fishBiteTimeout =
                null;


            /*
             * Reset game state.
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


            /*
             * Reset fishing.
             */

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


            /*
             * Reset item array.
             */

            items =
                [];


            /*
             * Hide all game screens.
             */

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


            /*
             * Show intro.
             */

            show(
                introScreen
            );


            /*
             * Reset button.
             */

            if (
                castRod
            ) {

                castRod.disabled =
                    false;


                castRod.innerText =
                    "🎣 CAST ROD";

            }


            /*
             * Reset fishing
             * progress bars.
             */

            if (
                powerFill
            ) {

                powerFill.style.width =
                    "0%";

            }


            if (
                reelFill
            ) {

                reelFill.style.width =
                    "0%";

            }


            /*
             * Reset terminal.
             */

            if (
                terminal
            ) {

                terminal.innerHTML =
                    "";

            }


            updateMainHUD();


            updateFishingHUD();


            startTerminal();

        }


        /*================================================
          TERMINAL INTRO
        ================================================*/

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


            let line =
                0;


            function typeLine() {

                if (
                    line >=
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
                        line
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


                                line++;


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


        /*================================================
          LOADING SCREEN
        ================================================*/

        function startLoadingScreen() {

            if (
                !loadingScreen
            ) {

                initialiseGame();

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

                "Connecting to Mission Control...",

                "Authenticating Chief Adventurer...",

                "Decrypting Mission Files...",

                "Scanning Campsite...",

                "Bear detected nearby...",

                "Fishing coordinates received...",

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


                        /*
                         * Update loading message
                         * at each stage.
                         */

                        const newIndex =
                            Math.min(

                                messages.length -
                                    1,

                                Math.floor(
                                    progress /
                                    (
                                        100 /
                                        (
                                            messages.length -
                                            1
                                        )
                                    )
                                )

                            );


                        if (
                            newIndex !==
                            messageIndex
                        ) {

                            messageIndex =
                                newIndex;


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


                                    initialiseGame();

                                },

                                600

                            );

                        }

                    },

                    50

                );

        }


        /*================================================
          INITIALISE GAME
        ================================================*/

        function initialiseGame() {

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


        /*================================================
          FISHING RENDER LOOP
        ================================================*/

        function startFishingRenderLoop() {

            let lastTime =
                performance.now();


            function loop(
                currentTime
            ) {

                const delta =
                    Math.min(

                        (
                            currentTime -
                            lastTime
                        ) /
                        1000,

                        0.05

                    );


                lastTime =
                    currentTime;


                if (
                    game.phase ===
                    2 &&
                    game.fishingActive
                ) {

                    updateFishing(
                        delta
                    );


                    renderFishing();

                }


                requestAnimationFrame(
                    loop
                );

            }


            requestAnimationFrame(
                loop
            );

        }


        /*================================================
          START CAMPSITE RENDER LOOP
        ================================================*/

        function startCampsiteRenderLoop() {

            function loop() {

                if (
                    game.phase ===
                    1 &&
                    game.missionActive
                ) {

                    renderCampsite();

                }


                requestAnimationFrame(
                    loop
                );

            }


            requestAnimationFrame(
                loop
            );

        }


        /*================================================
          INITIAL START
        ================================================*/

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(

                "DOMContentLoaded",

                () => {

                    startLoadingScreen();

                    startFishingRenderLoop();

                    startCampsiteRenderLoop();

                }

            );

        } else {

            startLoadingScreen();

            startFishingRenderLoop();

            startCampsiteRenderLoop();

        }
        /*================================================
          PUBLIC DEBUG ACCESS
        ================================================*/

        window.Mission2 =
            {

                game,

                startMission,

                goToFishing,

                resetMission,

                createCampsiteItems,

                renderCampsite,

                renderFishing,

                startFishing

            };


    })();

}
