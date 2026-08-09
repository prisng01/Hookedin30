/* ======================================================
   OPERATION BIRTHDAY 30 - MISSION 02
   CLEAN / CONSOLIDATED GAME.JS

   Phase 1: Campsite search - recover 10 items
   Phase 2: Fishing challenge - catch 6 fish

   ONE copy of every function/listener.
====================================================== */

"use strict";

(() => {

    if (window.__OPERATION_BIRTHDAY_MISSION_2_LOADED) {
        console.warn("Mission 2 game.js is already loaded.");
        return;
    }

    window.__OPERATION_BIRTHDAY_MISSION_2_LOADED = true;


    /* ======================================================
       GAME STATE
    ====================================================== */

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


    /* ======================================================
       DOM ELEMENTS
    ====================================================== */

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


    const startMissionBtn =
        document.getElementById("startMission");

    const continueFishing =
        document.getElementById("continueFishing");

    const replayMission =
        document.getElementById("replayMission");

    const hintButton =
        document.getElementById("hintButton");


    const timerText =
        document.getElementById("timer");

    const xpText =
        document.getElementById("xp");

    const scoreText =
        document.getElementById("score");

    const bearProgress =
        document.getElementById("bearProgress");

    const bearProximityText =
        document.getElementById("bearProximityText");

    const objectiveText =
        document.getElementById("objectiveText");

    const itemsFoundText =
        document.getElementById("itemsFoundText");


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

    const terminal =
        document.getElementById("terminal");

    const finalXP =
        document.getElementById("finalXP");


    /* ======================================================
       CANVAS
    ====================================================== */

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


    function resizeCanvases() {

        if (campCanvas) {

            const rect =
                campCanvas.getBoundingClientRect();

            campWidth =
                campCanvas.width =
                Math.max(
                    1,
                    Math.round(
                        rect.width ||
                        window.innerWidth
                    )
                );

            campHeight =
                campCanvas.height =
                Math.max(
                    1,
                    Math.round(
                        rect.height ||
                        window.innerHeight
                    )
                );
        }


        if (fishingCanvas) {

            const rect =
                fishingCanvas.getBoundingClientRect();

            fishingWidth =
                fishingCanvas.width =
                Math.max(
                    1,
                    Math.round(
                        rect.width ||
                        window.innerWidth
                    )
                );

            fishingHeight =
                fishingCanvas.height =
                Math.max(
                    1,
                    Math.round(
                        rect.height ||
                        window.innerHeight
                    )
                );
        }
    }


    window.addEventListener(
        "resize",
        resizeCanvases
    );


    /* ======================================================
       AUDIO
    ====================================================== */

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


    function playSound(sound) {

        if (!sound) return;

        try {

            sound.currentTime = 0;

            const promise =
                sound.play();

            if (
                promise &&
                typeof promise.catch === "function"
            ) {
                promise.catch(() => {});
            }

        } catch (_) {}

    }


    function stopSound(sound) {

        if (!sound) return;

        try {

            sound.pause();

        } catch (_) {}

    }


    /* ======================================================
       IMAGE LOADER
    ====================================================== */

    function loadImage(src) {

        const image =
            new Image();

        image.decoding =
            "async";

        image.src =
            src;

        image.addEventListener(
            "error",
            () => {

                console.warn(
                    "Unable to load image:",
                    src
                );

            }
        );

        return image;
    }


    /* ======================================================
       ASSETS
    ====================================================== */

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


    /* ======================================================
       TIMERS
    ====================================================== */

    let phase1Interval = null;

    let fishingInterval = null;

    let fishBiteTimeout = null;


    /* ======================================================
       FISHING STATE
    ====================================================== */

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

    let fishPhase =
        0;

    let fishVertical =
        0;


    /* ======================================================
       HELPERS
    ====================================================== */

    function show(element) {

        if (element) {

            element.classList.remove(
                "hidden"
            );

        }

    }


    function hide(element) {

        if (element) {

            element.classList.add(
                "hidden"
            );

        }

    }


    function setText(
        element,
        value
    ) {

        if (element) {

            element.innerText =
                value;

        }

    }


    function formatTime(seconds) {

        const value =
            Math.max(
                0,
                Math.ceil(seconds)
            );

        return (
            "00:" +
            String(value)
                .padStart(2, "0")
        );

    }


    /* ======================================================
       MAIN HUD
    ====================================================== */

    function updateMainHUD() {

        setText(
            timerText,
            formatTime(game.timer)
        );

        setText(
            xpText,
            game.xp
        );

        setText(
            scoreText,
            game.score
        );

        setText(
            itemsFoundText,
            `${game.itemsFound} / ${game.totalItems}`
        );


        if (bearProgress) {

            bearProgress.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        game.bearProgress
                    )
                )}%`;

        }


        if (bearProximityText) {

            const distance =
                Math.max(
                    0,
                    Math.round(
                        5 +
                        game.bearProgress *
                        0.9
                    )
                );

            bearProximityText.innerText =
                `${distance}m`;

        }

    }


    function updateFishingHUD() {

        setText(
            fishCaughtText,
            game.fishCaught
        );

        setText(
            fishingTimerText,
            formatTime(
                game.fishingTimer
            )
        );

        setText(
            fishScoreText,
            game.score
        );


        if (powerFill) {

            powerFill.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        castPower
                    )
                )}%`;

        }


        if (reelFill) {

            reelFill.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        lineTension
                    )
                )}%`;

        }

    }


    /* ======================================================
       PHASE 1 SCREEN
    ====================================================== */

    function showPhase1() {

        hide(introScreen);

        hide(phase1Complete);

        hide(phase2);

        hide(missionComplete);

        show(phase1);

        show(gameHUD);

        show(inventoryPanel);

    }


    /* ======================================================
       CAMPSITE ITEMS
    ====================================================== */

    function createCampsiteItems() {

        const positions = [

            {
                key: "tent",
                x: 0.20,
                y: 0.73,
                scale: 1.25
            },

            {
                key: "backpack",
                x: 0.31,
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

                    ...position,

                    name:
                        itemNames[
                            position.key
                        ],

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
            (
                slot,
                index
            ) => {

                slot.classList.toggle(
                    "collected",

                    Boolean(
                        items[index] &&
                        items[index].collected
                    )
                );

            }
        );

    }


    /* ======================================================
       CAMPSITE BACKGROUND
    ====================================================== */

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


    /* ======================================================
       DRAW HIDDEN ITEM
    ====================================================== */

    function drawHiddenItem(item) {

        if (
            !campCtx ||
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
            ) * 0.10;


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


        campCtx.shadowColor =
            "rgba(0,0,0,0.30)";

        campCtx.shadowBlur =
            3;

        campCtx.shadowOffsetX =
            1;

        campCtx.shadowOffsetY =
            2;


        /*
         * First blend layer.
         */

        campCtx.globalAlpha =
            0.52;

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
         * Second natural-looking layer.
         */

        campCtx.globalCompositeOperation =
            "source-over";

        campCtx.globalAlpha =
            0.58;

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


    /* ======================================================
       BEAR
    ====================================================== */

    function drawBear() {

        if (
            !campCtx ||
            !assets.bear.complete ||
            !assets.bear.naturalWidth
        ) {
            return;
        }


        const size =
            Math.min(
                campWidth,
                campHeight
            ) * 0.10;


        const progress =
            game.bearProgress /
            100;


        const x =
            campWidth -
            70 -
            progress * 100;


        const y =
            Math.max(
                55,
                campHeight * 0.12
            );


        campCtx.save();

        campCtx.globalAlpha =
            0.9;


        campCtx.drawImage(
            assets.bear,

            x -
                size / 2,

            y -
                size / 2,

            size,

            size
        );


        campCtx.restore();

    }


    /* ======================================================
       RENDER CAMPSITE
    ====================================================== */

    function renderCampsite() {

        if (
            !campCtx ||
            game.phase !== 1
        ) {
            return;
        }


        drawCampsiteBackground();


        items.forEach(
            drawHiddenItem
        );


        if (
            game.missionActive
        ) {
            drawBear();
        }

    }


    /* ======================================================
       CAMPSITE CLICK
    ====================================================== */

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


        const canvasX =
            (
                event.clientX -
                rect.left
            ) *
            (
                campCanvas.width /
                rect.width
            );


        const canvasY =
            (
                event.clientY -
                rect.top
            ) *
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


            let hitRadius =
                Math.max(
                    32,
                    Math.min(
                        campWidth,
                        campHeight
                    ) * 0.055
                );


            /*
             * Tent is larger and therefore
             * gets a larger click area.
             */

            if (
                item.key === "tent"
            ) {

                hitRadius =
                    Math.min(
                        campWidth,
                        campHeight
                    ) * 0.16;

            }


            /*
             * Fishing rod is long.
             */

            if (
                item.key ===
                "fishingRod"
            ) {

                hitRadius =
                    Math.min(
                        campWidth,
                        campHeight
                    ) * 0.09;

            }


            const distance =
                Math.hypot(
                    canvasX - itemX,
                    canvasY - itemY
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


    /* ======================================================
       COLLECT ITEM
    ====================================================== */

    function collectItem(item) {

        item.collected =
            true;


        game.itemsFound +=
            1;


        game.xp +=
            20;


        game.score +=
            100;


        playSound(
            collectSound
        );


        updateMainHUD();

        updateInventory();

        renderCampsite();


        if (
            game.itemsFound >=
            game.totalItems
        ) {

            completePhase1();

        }

    }


    /* ======================================================
       PHASE 1 TIMER
    ====================================================== */

    function startPhase1Timer() {

        clearInterval(
            phase1Interval
        );


        game.timer =
            60;


        game.bearProgress =
            100;


        updateMainHUD();


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

                        failPhase1();

                    }

                },

                1000
            );

    }


    /* ======================================================
       PHASE 1 FAILURE
    ====================================================== */

    function failPhase1() {

        clearInterval(
            phase1Interval
        );


        phase1Interval =
            null;


        game.missionActive =
            false;


        stopSound(
            bgMusic
        );


        playSound(
            bearSound
        );


        hide(gameHUD);

        hide(inventoryPanel);

        hide(phase1);

        show(phase1Complete);


        const title =
            phase1Complete
                ? phase1Complete.querySelector(
                    "h1"
                )
                : null;


        const description =
            phase1Complete
                ? phase1Complete.querySelector(
                    "p"
                )
                : null;


        if (title) {

            title.innerText =
                "🐻 MISSION FAILED";

        }


        if (description) {

            description.innerText =
                "The bear reached the campsite before you recovered all of the equipment.";

        }


        if (
            continueFishing
        ) {

            continueFishing.disabled =
                true;

            continueFishing.style.opacity =
                "0.4";

            continueFishing.innerText =
                "MISSION FAILED";

        }

    }


    /* ======================================================
       PHASE 1 COMPLETE
    ====================================================== */

    function completePhase1() {

        clearInterval(
            phase1Interval
        );


        phase1Interval =
            null;


        game.missionActive =
            false;


        stopSound(
            bgMusic
        );


        playSound(
            successSound
        );


        setText(
            phase1XP,
            game.xp
        );


        hide(phase1);

        hide(gameHUD);

        hide(inventoryPanel);

        show(phase1Complete);


        const title =
            phase1Complete
                ? phase1Complete.querySelector(
                    "h1"
                )
                : null;


        const description =
            phase1Complete
                ? phase1Complete.querySelector(
                    "p"
                )
                : null;


        if (title) {

            title.innerText =
                "🏕 CAMP SUCCESSFULLY SECURED";

        }


        if (description) {

            description.innerText =
                "Excellent work, Chief. You recovered every item before the bear arrived.";

        }


        if (
            continueFishing
        ) {

            continueFishing.disabled =
                false;

            continueFishing.style.opacity =
                "1";

            continueFishing.innerText =
                "🎣 CONTINUE TO FISHING CHALLENGE";

        }

    }


    /* ======================================================
       TERMINAL INTRO
    ====================================================== */

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


    let terminalRunId =
        0;


    function startTerminal() {

        if (!terminal) {
            return;
        }


        const runId =
            ++terminalRunId;


        terminal.innerHTML =
            "";


        let lineIndex =
            0;


        function typeLine() {

            if (
                runId !==
                terminalRunId ||
                lineIndex >=
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
                    lineIndex
                ];


            let character =
                0;


            const typing =
                setInterval(
                    () => {

                        if (
                            runId !==
                            terminalRunId
                        ) {

                            clearInterval(
                                typing
                            );

                            return;

                        }


                        paragraph.innerText =
                            text.substring(
                                0,
                                character
                            );


                        character +=
                            1;


                        if (
                            character >
                            text.length
                        ) {

                            clearInterval(
                                typing
                            );


                            lineIndex +=
                                1;


                            setTimeout(
                                typeLine,
                                120
                            );

                        }

                    },

                    12
                );

        }


        typeLine();

    }


    /* ======================================================
       START MISSION
    ====================================================== */

    function startMission() {

        clearInterval(
            phase1Interval
        );

        clearInterval(
            fishingInterval
        );

        clearTimeout(
            fishBiteTimeout
        );


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


        fishingState =
            "IDLE";


        createCampsiteItems();


        resizeCanvases();


        showPhase1();


        setText(
            objectiveText,
            "Recover all hidden camping equipment."
        );


        updateMainHUD();


        startPhase1Timer();


        renderCampsite();


        stopSound(
            bgMusic
        );


        if (bgMusic) {

            bgMusic.currentTime =
                0;


            const promise =
                bgMusic.play();


            if (
                promise &&
                typeof promise.catch ===
                "function"
            ) {

                promise.catch(
                    () => {}
                );

            }

        }

    }


    /* ======================================================
       GO TO FISHING
    ====================================================== */

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


        clearInterval(
            phase1Interval
        );


        game.phase =
            2;


        game.fishingActive =
            true;


        game.missionActive =
            true;


        hide(phase1Complete);

        hide(gameHUD);

        hide(inventoryPanel);


        show(phase2);


        if (fishingCanvas) {

            fishingCanvas.classList.remove(
                "hidden"
            );

        }


        resizeCanvases();


        startFishing();

    }


    /* ======================================================
       START FISHING
    ====================================================== */

    function startFishing() {

        clearInterval(
            fishingInterval
        );

        clearTimeout(
            fishBiteTimeout
        );


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


        fishDistance =
            0;


        lineTension =
            0;


        reelActive =
            false;


        lureX =
            fishingWidth *
            0.52;


        lureY =
            fishingHeight *
            0.70;


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


        fishPhase =
            0;


        fishVertical =
            0;


        hide(bite);

        hide(hook);


        if (castRod) {

            castRod.disabled =
                false;

            castRod.innerText =
                "🎣 LOCK AIM";

        }


        updateFishingHUD();


        startFishingTimer();


        renderFishing();

    }


    /* ======================================================
       FISHING TIMER
    ====================================================== */

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
                        game.phase !== 2 ||
                        !game.fishingActive
                    ) {
                        return;
                    }


                    game.fishingTimer -=
                        1;


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


    /* ======================================================
       FISHING FAILURE
    ====================================================== */

    function failFishing() {

        clearInterval(
            fishingInterval
        );


        fishingInterval =
            null;


        clearTimeout(
            fishBiteTimeout
        );


        game.fishingActive =
            false;


        game.missionActive =
            false;


        fishingState =
            "IDLE";


        reelActive =
            false;


        if (castRod) {

            castRod.disabled =
                true;

        }


        hide(bite);

        hide(hook);


        const heading =
            phase2
                ? phase2.querySelector(
                    "h1"
                )
                : null;


        if (heading) {

            heading.innerText =
                "🎣 TIME'S UP";

        }


        setTimeout(
            () => {

                showMissionComplete(
                    false
                );

            },

            900
        );

    }


    /* ======================================================
       AIM
    ====================================================== */

    function lockAim() {

        fishingState =
            "POWER";


        castPower =
            0;


        castDirection =
            1;


        if (castRod) {

            castRod.innerText =
                "🎣 LOCK CAST POWER";

        }

    }


    /* ======================================================
       CAST ROD
    ====================================================== */

    function castRodNow() {

        fishingState =
            "WAITING";


        castPower =
            Math.max(
                10,
                castPower
            );


        lureX =
            fishingWidth *
            0.52 +
            aimAngle *
            fishingWidth *
            0.30;


        lureY =
            fishingHeight *
            (
                0.78 -
                (
                    castPower /
                    100
                ) *
                0.32
            );


        fishDistance =
            25 +
            castPower *
            0.35;


        rodKick =
            1;


        reelActive =
            false;


        hide(bite);

        hide(hook);


        playSound(
            splashSound
        );


        if (castRod) {

            castRod.disabled =
                true;

            castRod.innerText =
                "⏳ WAITING FOR BITE...";

        }


        clearTimeout(
            fishBiteTimeout
        );


        fishBiteTimeout =
            setTimeout(
                fishBites,
                2200 +
                Math.random() *
                2600
            );

    }


    /* ======================================================
       FISH BITES
    ====================================================== */

    function fishBites() {

        if (
            game.phase !== 2 ||
            !game.fishingActive ||
            fishingState !==
            "WAITING"
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


        lineTension =
            35 +
            Math.random() *
            15;


        rodKick =
            1;


        playSound(
            splashSound
        );


        show(bite);

        show(hook);


        if (castRod) {

            castRod.disabled =
                false;

            castRod.innerText =
                "🎣 SET THE HOOK!";

        }


        setTimeout(
            () => {

                hide(bite);

            },

            900
        );

    }


    /* ======================================================
       HOOK FISH
    ====================================================== */

    function hookFish() {

        if (
            fishingState !==
            "HOOKED"
        ) {
            return;
        }


        fishingState =
            "REELING";


        reelActive =
            false;


        lineTension =
            Math.max(
                20,
                lineTension
            );


        if (castRod) {

            castRod.innerText =
                "🌀 HOLD TO REEL";

        }


        hide(hook);

    }


    /* ======================================================
       LAND FISH
    ====================================================== */

    function landFish() {

        game.fishCaught +=
            1;


        const points =
            250 +
            Math.round(
                Math.max(
                    0,
                    100 -
                    lineTension
                )
            );


        game.score +=
            points;


        game.xp +=
            50;


        playSound(
            successSound
        );


        hide(bite);

        hide(hook);


        lineTension =
            0;


        fishDistance =
            0;


        reelActive =
            false;


        if (
            game.fishCaught >=
            game.targetFish
        ) {

            completeFishing();

            return;

        }


        fishingState =
            "AIM";


        castPower =
            0;


        aimAngle =
            0;


        rodTargetAngle =
            -0.72;


        if (castRod) {

            castRod.disabled =
                false;

            castRod.innerText =
                "🎣 LOCK AIM";

        }


        updateFishingHUD();

    }


    /* ======================================================
       FISHING COMPLETE
    ====================================================== */

    function completeFishing() {

        clearInterval(
            fishingInterval
        );


        fishingInterval =
            null;


        clearTimeout(
            fishBiteTimeout
        );


        game.fishingActive =
            false;


        game.missionActive =
            false;


        fishingState =
            "IDLE";


        reelActive =
            false;


        playSound(
            successSound
        );


        showMissionComplete(
            true
        );

    }


    /* ======================================================
       MISSION COMPLETE
    ====================================================== */

    function showMissionComplete(
        success
    ) {

        hide(phase2);

        hide(gameHUD);

        hide(inventoryPanel);


        show(missionComplete);


        if (finalXP) {

            finalXP.innerText =
                game.xp;

        }


        const cards =
            missionComplete
                ? missionComplete.querySelectorAll(
                    ".reportCard"
                )
                : [];


        if (cards[0]) {

            cards[0]
                .querySelector("p")
                .innerText =
                game.xp;

        }


        if (cards[1]) {

            cards[1]
                .querySelector("p")
                .innerText =
                `${game.itemsFound} / ${game.totalItems}`;

        }


        if (cards[2]) {

            cards[2]
                .querySelector("p")
                .innerText =
                `${game.fishCaught} / ${game.targetFish}`;

        }


        if (cards[3]) {

            cards[3]
                .querySelector("p")
                .innerText =
                success
                    ? "100%"
                    : `${Math.round(
                        (
                            game.fishCaught /
                            game.targetFish
                        ) * 100
                    )}%`;

        }

    }


    /* ======================================================
       DRAW LAKE
    ====================================================== */

    function drawLake() {

        if (!fishingCtx) {
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
                "#8ca6ad"
            );


            gradient.addColorStop(
                0.5,
                "#3f6671"
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


    /* ======================================================
       ANIMATED ANGLER
    ====================================================== */

    function drawAngler() {

        if (!fishingCtx) {
            return;
        }


        const baseX =
            fishingWidth *
            0.32;


        const baseY =
            fishingHeight *
            0.82;


        const bob =
            Math.sin(
                fishPhase *
                2.2
            ) * 3;


        const bodyY =
            baseY +
            bob;


        const armMotion =
            Math.sin(
                fishPhase *
                3.2
            ) * 0.08;


        fishingCtx.save();


        fishingCtx.translate(
            baseX,
            bodyY
        );


        /*
         * Body
         */

        fishingCtx.fillStyle =
            "rgba(30,38,44,0.96)";


        fishingCtx.beginPath();


        fishingCtx.ellipse(
            0,
            35,
            46,
            68,
            0,
            0,
            Math.PI * 2
        );


        fishingCtx.fill();


        /*
         * Head
         */

        fishingCtx.fillStyle =
            "rgba(198,151,116,0.98)";


        fishingCtx.beginPath();


        fishingCtx.arc(
            -2,
            -38,
            22,
            0,
            Math.PI * 2
        );


        fishingCtx.fill();


        /*
         * Cap
         */

        fishingCtx.fillStyle =
            "rgba(26,30,34,0.98)";


        fishingCtx.beginPath();


        fishingCtx.arc(
            -2,
            -45,
            23,
            Math.PI,
            Math.PI * 2
        );


        fishingCtx.fill();


        fishingCtx.fillRect(
            -24,
            -46,
            38,
            7
        );


        /*
         * Animated arms
         */

        const shoulderX =
            18;


        const shoulderY =
            12;


        const elbowX =
            48 +
            armMotion *
            40;


        const elbowY =
            -3 +
            Math.sin(
                fishPhase *
                3.2
            ) * 6;


        const handX =
            66 +
            armMotion *
            30;


        const handY =
            -15 +
            Math.sin(
                fishPhase *
                3.2
            ) * 8;


        fishingCtx.strokeStyle =
            "rgba(198,151,116,0.98)";


        fishingCtx.lineWidth =
            13;


        fishingCtx.lineCap =
            "round";


        fishingCtx.beginPath();


        fishingCtx.moveTo(
            shoulderX,
            shoulderY
        );


        fishingCtx.lineTo(
            elbowX,
            elbowY
        );


        fishingCtx.lineTo(
            handX,
            handY
        );


        fishingCtx.stroke();


        /*
         * Second arm
         */

        fishingCtx.beginPath();


        fishingCtx.moveTo(
            5,
            20
        );


        fishingCtx.lineTo(
            42,
            3
        );


        fishingCtx.lineTo(
            59,
            -10
        );


        fishingCtx.stroke();


        /*
         * Hands
         */

        fishingCtx.fillStyle =
            "rgba(198,151,116,0.98)";


        fishingCtx.beginPath();


        fishingCtx.arc(
            handX,
            handY,
            7,
            0,
            Math.PI * 2
        );


        fishingCtx.fill();


        fishingCtx.beginPath();


        fishingCtx.arc(
            59,
            -10,
            7,
            0,
            Math.PI * 2
        );


        fishingCtx.fill();


        /*
         * Legs
         */

        fishingCtx.strokeStyle =
            "rgba(22,27,31,0.98)";


        fishingCtx.lineWidth =
            18;


        fishingCtx.beginPath();


        fishingCtx.moveTo(
            -18,
            70
        );


        fishingCtx.lineTo(
            -60,
            100
        );


        fishingCtx.moveTo(
            15,
            72
        );


        fishingCtx.lineTo(
            52,
            98
        );


        fishingCtx.stroke();


        fishingCtx.restore();


        /*
         * Rod follows the angler's hands.
         */

        drawRod(
            baseX + 63,
            bodyY - 13
        );

    }


    /* ======================================================
       FISHING ROD
    ====================================================== */

    function drawRod(
        handX,
        handY
    ) {

        if (!fishingCtx) {
            return;
        }


        const length =
            Math.min(
                fishingWidth,
                fishingHeight
            ) * 0.48;


        const angle =
            rodAngle;


        const tipX =
            handX +
            Math.cos(angle) *
            length;


        const tipY =
            handY +
            Math.sin(angle) *
            length;


        fishingCtx.save();


        fishingCtx.strokeStyle =
            "rgba(35,35,35,0.95)";


        fishingCtx.lineWidth =
            7;


        fishingCtx.lineCap =
            "round";


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


        fishingCtx.strokeStyle =
            "rgba(220,220,220,0.75)";


        fishingCtx.lineWidth =
            1.5;


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


        /*
         * Reel
         */

        fishingCtx.fillStyle =
            "rgba(30,30,30,0.95)";


        fishingCtx.beginPath();


        fishingCtx.arc(
            handX + 10,
            handY + 4,
            9,
            0,
            Math.PI * 2
        );


        fishingCtx.fill();


        fishingCtx.restore();


        if (
            fishingState ===
            "WAITING" ||

            fishingState ===
            "HOOKED" ||

            fishingState ===
            "REELING"
        ) {

            drawFishingLine(
                tipX,
                tipY
            );

        }

    }


    /* ======================================================
       FISHING LINE
    ====================================================== */

    function drawFishingLine(
        tipX,
        tipY
    ) {

        if (!fishingCtx) {
            return;
        }


        const targetX =
            lureX ||
            fishingWidth *
            0.55;


        const targetY =
            lureY ||
            fishingHeight *
            0.72;


        const midX =
            (
                tipX +
                targetX
            ) / 2;


        const midY =
            Math.max(
                tipY,
                targetY
            ) +
            18 +
            Math.sin(
                fishPhase *
                2
            ) * 4;


        fishingCtx.save();


        fishingCtx.strokeStyle =
            "rgba(235,235,235,0.72)";


        fishingCtx.lineWidth =
            1.4;


        fishingCtx.beginPath();


        fishingCtx.moveTo(
            tipX,
            tipY
        );


        fishingCtx.quadraticCurveTo(
            midX,
            midY,
            targetX,
            targetY
        );


        fishingCtx.stroke();


        /*
         * Lure
         */

        fishingCtx.fillStyle =
            "rgba(245,245,245,0.95)";


        fishingCtx.beginPath();


        fishingCtx.arc(
            targetX,
            targetY,
            5,
            0,
            Math.PI * 2
        );


        fishingCtx.fill();


        fishingCtx.restore();

    }


    /* ======================================================
       FISH
    ====================================================== */

    function drawFish() {

        if (
            !fishingCtx ||
            fishingState === "IDLE" ||
            fishingState === "AIM" ||
            fishingState === "POWER"
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
            !image.naturalWidth
        ) {

            return;

        }


        const size =
            Math.min(
                fishingWidth,
                fishingHeight
            ) * 0.08;


        const x =
            lureX +
            Math.sin(
                fishPhase *
                2.5
            ) * 24;


        const y =
            lureY +
            Math.cos(
                fishPhase *
                2.0
            ) * 12;


        const ratio =
            image.naturalHeight /
            image.naturalWidth;


        const h =
            size *
            ratio;


        fishingCtx.save();


        fishingCtx.globalAlpha =
            fishingState ===
            "REELING"
                ? 0.95
                : 0.65;


        fishingCtx.drawImage(
            image,

            x -
                size / 2,

            y -
                h / 2,

            size,

            h
        );


        fishingCtx.restore();

    }


    /* ======================================================
       RENDER FISHING
    ====================================================== */

    function renderFishing() {

        if (
            !fishingCtx ||
            game.phase !== 2
        ) {

            return;

        }


        drawLake();


        /*
         * Water movement.
         */

        fishingCtx.save();


        fishingCtx.globalAlpha =
            0.12;


        fishingCtx.strokeStyle =
            "#ffffff";


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
                    0.48 +
                    i *
                    0.055
                ) +

                Math.sin(
                    fishPhase +
                    i
                ) * 3;


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                fishingWidth *
                0.45,
                y
            );


            fishingCtx.quadraticCurveTo(
                fishingWidth *
                0.62,

                y - 6,

                fishingWidth *
                0.82,

                y
            );


            fishingCtx.stroke();

        }


        fishingCtx.restore();


        /*
         * Angler.
         */

        drawAngler();


        /*
         * Fish.
         */

        drawFish();


        /*
         * Aim indicator.
         */

        if (
            fishingState ===
            "AIM" ||

            fishingState ===
            "POWER"
        ) {

            const targetX =
                fishingWidth *
                0.52 +

                aimAngle *
                fishingWidth *
                0.30;


            const targetY =
                fishingHeight *
                0.64;


            fishingCtx.save();


            fishingCtx.strokeStyle =
                "rgba(57,217,255,0.85)";


            fishingCtx.lineWidth =
                2;


            fishingCtx.setLineDash(
                [
                    8,
                    8
                ]
            );


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                fishingWidth *
                0.52,

                fishingHeight *
                0.78
            );


            fishingCtx.lineTo(
                targetX,
                targetY
            );


            fishingCtx.stroke();


            fishingCtx.setLineDash(
                []
            );


            fishingCtx.beginPath();


            fishingCtx.arc(
                targetX,
                targetY,

                12 +
                castPower *
                0.08,

                0,
                Math.PI * 2
            );


            fishingCtx.stroke();


            fishingCtx.restore();

        }

    }


    /* ======================================================
       FISHING UPDATE
    ====================================================== */

    function updateFishing(dt) {

        if (
            game.phase !== 2 ||
            !game.fishingActive
        ) {

            return;

        }


        fishPhase +=
            dt;


        /*
         * AIMING
         */

        if (
            fishingState ===
            "AIM"
        ) {

            aimAngle +=
                aimDirection *
                1.2 *
                dt;


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


            rodTargetAngle =
                -0.72 +
                aimAngle *
                0.42;

        }


        /*
         * CAST POWER
         */

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


        /*
         * WAITING FOR BITE
         */

        if (
            fishingState ===
            "WAITING"
        ) {

            rodTargetAngle =
                -0.52 +

                Math.sin(
                    fishPhase *
                    2.2
                ) *
                0.025;


            lureY +=
                Math.sin(
                    fishPhase *
                    2.4
                ) *
                dt *
                3;

        }


        /*
         * HOOKED
         */

        if (
            fishingState ===
            "HOOKED"
        ) {

            rodTargetAngle =
                -0.50 +

                Math.sin(
                    fishPhase *
                    5
                ) *
                0.08;


            lineTension +=
                Math.sin(
                    fishPhase *
                    4.5
                ) *
                dt *
                7;


            lineTension =
                Math.max(
                    15,
                    Math.min(
                        92,
                        lineTension
                    )
                );

        }


        /*
         * REELING
         */

        if (
            fishingState ===
            "REELING"
        ) {

            reelRotation +=
                dt *
                (
                    reelActive
                        ? 10
                        : 3
                );


            if (reelActive) {

                fishDistance -=
                    dt *
                    14;


                lineTension +=
                    dt *
                    3.5;

            } else {

                fishDistance +=
                    dt *
                    5.5;


                lineTension -=
                    dt *
                    4.5;

            }


            /*
             * Fish fights back.
             */

            const fight =
                Math.sin(
                    fishPhase *
                    3.4
                );


            if (
                fight >
                0.86
            ) {

                fishDistance +=
                    dt *
                    8;


                lineTension +=
                    dt *
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


            rodTargetAngle =
                -0.52 -

                Math.min(
                    0.28,
                    lineTension /
                    350
                );


            /*
             * Line breaks.
             */

            if (
                lineTension >=
                100
            ) {

                lineTension =
                    0;


                fishDistance =
                    Math.min(
                        100,
                        fishDistance +
                        25
                    );


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

            }


            /*
             * Fish landed.
             */

            else if (
                fishDistance <=
                2
            ) {

                landFish();

            }

        }


        /*
         * Smooth rod movement.
         */

        rodAngle +=
            (
                rodTargetAngle -
                rodAngle
            ) *
            Math.min(
                1,
                8 * dt
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


    /* ======================================================
       INPUT - START MISSION
    ====================================================== */

    if (
        startMissionBtn
    ) {

        startMissionBtn.addEventListener(
            "click",
            startMission
        );

    }


    /* ======================================================
       INPUT - CONTINUE FISHING
    ====================================================== */

    if (
        continueFishing
    ) {

        continueFishing.addEventListener(
            "click",
            goToFishing
        );

    }


    /* ======================================================
       INPUT - REPLAY
    ====================================================== */

    if (
        replayMission
    ) {

        replayMission.addEventListener(
            "click",
            resetMission
        );

    }


    /* ======================================================
       HINT BUTTON
    ====================================================== */

    if (
        hintButton
    ) {

        hintButton.addEventListener(
            "click",
            () => {

                if (
                    game.phase !== 1 ||
                    !game.missionActive
                ) {

                    return;

                }


                const target =
                    items.find(
                        item =>
                            !item.collected
                    );


                if (!target) {
                    return;
                }


                game.xp =
                    Math.max(
                        0,
                        game.xp -
                        5
                    );


                const previous =
                    objectiveText
                        ? objectiveText.innerText
                        : "";


                if (
                    objectiveText
                ) {

                    objectiveText.innerText =
                        `Hint: Search near the ${target.name.toLowerCase()}.`;

                }


                setTimeout(
                    () => {

                        if (
                            objectiveText &&
                            game.phase === 1 &&
                            game.missionActive
                        ) {

                            objectiveText.innerText =
                                previous;

                        }

                    },

                    1800
                );


                updateMainHUD();

            }
        );

    }


    /* ======================================================
       CAMPSITE POINTER
    ====================================================== */

    if (
        campCanvas
    ) {

        campCanvas.addEventListener(
            "pointerdown",
            handleCampsiteClick
        );

    }


    /* ======================================================
       CAST ROD BUTTON
    ====================================================== */

    if (
        castRod
    ) {

        castRod.addEventListener(
            "click",
            () => {

                if (
                    game.phase !== 2 ||
                    !game.fishingActive
                ) {

                    return;

                }


                if (
                    fishingState ===
                    "AIM"
                ) {

                    lockAim();

                }

                else if (
                    fishingState ===
                    "POWER"
                ) {

                    castRodNow();

                }

                else if (
                    fishingState ===
                    "HOOKED"
                ) {

                    hookFish();

                }

                else if (
                    fishingState ===
                    "REELING"
                ) {

                    reelActive =
                        !reelActive;

                }

            }
        );

    }


    /* ======================================================
       REEL HELPERS
    ====================================================== */

    function startReel() {

        if (
            game.phase === 2 &&
            game.fishingActive &&
            fishingState ===
            "REELING"
        ) {

            reelActive =
                true;

        }

    }


    function stopReel() {

        reelActive =
            false;

    }


    /* ======================================================
       FISHING CANVAS POINTER
    ====================================================== */

    if (
        fishingCanvas
    ) {

        fishingCanvas.addEventListener(
            "pointerdown",
            event => {

                if (
                    game.phase !== 2 ||
                    !game.fishingActive
                ) {

                    return;

                }


                if (
                    fishingState ===
                    "AIM"
                ) {

                    lockAim();

                }

                else if (
                    fishingState ===
                    "POWER"
                ) {

                    castRodNow();

                }

                else if (
                    fishingState ===
                    "HOOKED"
                ) {

                    hookFish();

                }

                else if (
                    fishingState ===
                    "REELING"
                ) {

                    reelActive =
                        true;


                    try {

                        fishingCanvas.setPointerCapture(
                            event.pointerId
                        );

                    } catch (_) {}

                }

            }
        );


        fishingCanvas.addEventListener(
            "pointerup",
            stopReel
        );


        fishingCanvas.addEventListener(
            "pointercancel",
            stopReel
        );


        fishingCanvas.addEventListener(
            "pointerleave",
            stopReel
        );

    }


    /* ======================================================
       KEYBOARD
    ====================================================== */

    window.addEventListener(
        "keydown",
        event => {

            if (
                game.phase !== 2 ||
                !game.fishingActive
            ) {

                return;

            }


            /*
             * SPACE = REEL
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
             * ENTER = ACTION
             */

            if (
                event.code ===
                "Enter"
            ) {

                event.preventDefault();


                if (
                    fishingState ===
                    "AIM"
                ) {

                    lockAim();

                }

                else if (
                    fishingState ===
                    "POWER"
                ) {

                    castRodNow();

                }

                else if (
                    fishingState ===
                    "HOOKED"
                ) {

                    hookFish();

                }

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


    /* ======================================================
       RESET MISSION
    ====================================================== */

    function resetMission() {

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


        terminalRunId +=
            1;


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


        fishPhase =
            0;


        items =
            [];


        hide(gameHUD);

        hide(inventoryPanel);

        hide(phase1);

        hide(phase1Complete);

        hide(phase2);

        hide(missionComplete);


        show(introScreen);


        if (
            continueFishing
        ) {

            continueFishing.disabled =
                false;

            continueFishing.style.opacity =
                "1";

        }


        if (
            castRod
        ) {

            castRod.disabled =
                false;

            castRod.innerText =
                "🎣 LOCK AIM";

        }


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


        updateMainHUD();

        updateFishingHUD();

        startTerminal();

    }


    /* ======================================================
       LOADING SCREEN
    ====================================================== */

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


        const interval =
            setInterval(
                () => {

                    progress +=
                        2;


                    if (
                        loadingFill
                    ) {

                        loadingFill.style.width =
                            `${progress}%`;

                    }


                    const newIndex =
                        Math.min(
                            messages.length - 1,

                            Math.floor(
                                progress /
                                (
                                    100 /
                                    (
                                        messages.length - 1
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
                            interval
                        );


                        setTimeout(
                            () => {

                                hide(
                                    loadingScreen
                                );


                                initialiseGame();

                            },

                            350
                        );

                    }

                },

                45
            );

    }


    /* ======================================================
       INITIALISE GAME
    ====================================================== */

    function initialiseGame() {

        resizeCanvases();


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


    /* ======================================================
       ANIMATION LOOPS
    ====================================================== */

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
                ) / 1000,

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


    /* ======================================================
       INITIAL START
    ====================================================== */

    resizeCanvases();


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                resizeCanvases();

                startLoadingScreen();


                requestAnimationFrame(
                    fishingLoop
                );


                requestAnimationFrame(
                    campsiteLoop
                );

            },

            {
                once: true
            }
        );

    }

    else {

        startLoadingScreen();


        requestAnimationFrame(
            fishingLoop
        );


        requestAnimationFrame(
            campsiteLoop
        );

    }


    /* ======================================================
       DEBUG ACCESS
    ====================================================== */

    window.Mission2 = {

        game,

        startMission,

        goToFishing,

        startFishing,

        resetMission,

        createCampsiteItems,

        renderCampsite,

        renderFishing

    };


})();
