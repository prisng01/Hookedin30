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

            fishingTimer: 60,

            itemsFound: 0,

            totalItems: 10,

            fishCaught: 0,

            targetFish: 6,

            bearProgress: 100,

            missionActive: false,

            fishingActive: false

        };


        /* =========================================================
           CAMPSITE ITEMS
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
           CANVASES
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


        /* =========================================================
           FISHING HUD
        ========================================================= */

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
           AUDIO
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


        /*
         * Mission-start sound.
         *
         * Already available in assets:
         * assets/audio/mission_start.mp3
         */
        const missionStartSound =
            new Audio(
                "assets/audio/mission_start.mp3"
            );


        /* =========================================================
           IMAGE LOADER
        ========================================================= */

        function loadImage(src) {

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
           TIMERS
        ========================================================= */

        let phase1Interval =
            null;

        let fishingInterval =
            null;


        /* =========================================================
           FISHING STATE
        ========================================================= */

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


        /* =========================================================
           FISH SELECTION SYSTEM
           
           Uses a shuffled fish bag so all available fish
           types appear before the rotation repeats.
        ========================================================= */

        let fishPool = [];


        function getAvailableFishTypes() {

            return Object.keys(
                assets.fish
            ).filter(
                fishKey => {

                    const image =
                        assets.fish[
                            fishKey
                        ];

                    return (
                        image &&
                        image.complete &&
                        image.naturalWidth > 0
                    );

                }
            );

        }


        /* =========================================================
           SHUFFLE FISH POOL
        ========================================================= */

        function shuffleFishPool() {

            const availableFish =
                getAvailableFishTypes();


            /*
             * If images are still loading,
             * use all declared fish types.
             */
            const sourceFish =
                availableFish.length > 0
                    ? availableFish
                    : Object.keys(
                        assets.fish
                    );


            fishPool =
                [...sourceFish];


            /*
             * Fisher-Yates shuffle.
             */
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
                ] =
                [
                    fishPool[j],
                    fishPool[i]
                ];

            }

        }


        /* =========================================================
           CHOOSE NEXT FISH
           
           Every available fish appears once before
           the pool is shuffled again.
        ========================================================= */

        function chooseFish() {

            if (
                fishPool.length === 0
            ) {

                shuffleFishPool();

            }


            const availableFish =
                getAvailableFishTypes();


            /*
             * Rebuild the pool if newly loaded assets
             * have changed the available fish list.
             */
            if (
                availableFish.length > 0
            ) {

                const poolStillValid =
                    fishPool.every(
                        fish =>
                            availableFish.includes(
                                fish
                            )
                    );


                if (
                    !poolStillValid ||
                    fishPool.length === 0
                ) {

                    shuffleFishPool();

                }

            }


            const selectedFish =
                fishPool.shift();


            return (
                selectedFish ||
                "goldFish"
            );

        }


        /* =========================================================
           ROD ANIMATION
        ========================================================= */

        let rodAngle =
            -0.34;

        let rodTargetAngle =
            -0.34;

        let rodKick =
            0;

        let reelRotation =
            0;


        /* =========================================================
           REALISTIC ROD CONFIGURATION
        ========================================================= */

        const ROD_CONFIG = {

            /*
             * Rod is positioned in the lower-right/foreground.
             */
            handX: 0.70,

            handY: 0.86,


            /*
             * Long enough to look like a proper fishing rod.
             */
            lengthRatio: 0.46,


            /*
             * Base water-facing angle.
             */
            waterAngle: -0.34,


            /*
             * Hard limits prevent the rod from
             * ever pointing vertically into the sky.
             */
            minAngle: -0.44,

            maxAngle: -0.22

        };


        /* =========================================================
           SHOW / HIDE
        ========================================================= */

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


                const promise =
                    sound.play();


                if (
                    promise &&
                    typeof promise.catch ===
                    "function"
                ) {

                    promise.catch(
                        () => {}
                    );

                }

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

                /* Ignore audio stop errors */

            }

        }


        /* =========================================================
           RESIZE CANVASES
        ========================================================= */

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


        /* =========================================================
           MAIN HUD
        ========================================================= */

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


        /* =========================================================
           FISHING HUD
        ========================================================= */

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


        /* =========================================================
           SHOW PHASE 1
        ========================================================= */

        function showPhase1() {

            hide(introScreen);

            hide(phase1Complete);

            hide(phase2);

            hide(missionComplete);

            show(phase1);

            show(gameHUD);

            show(inventoryPanel);

        }


        /* =========================================================
           START MISSION
        ========================================================= */

        function startMission() {

            playSound(
                missionStartSound
            );


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


        /* =========================================================
           CAMPSITE ITEM POSITIONS
        ========================================================= */

        function createCampsiteItems() {

            const positions = [

                {
                    key: "tent",
                    x: 0.22,
                    y: 0.78,
                    scale: 3.00
                },

                {
                    key: "backpack",
                    x: 0.39,
                    y: 0.82,
                    scale: 1.55
                },

                {
                    key: "torchlight",
                    x: 0.68,
                    y: 0.76,
                    scale: 1.35
                },

                {
                    key: "compass",
                    x: 0.31,
                    y: 0.68,
                    scale: 1.25
                },

                {
                    key: "boots",
                    x: 0.53,
                    y: 0.84,
                    scale: 1.55
                },

                {
                    key: "bottle",
                    x: 0.76,
                    y: 0.86,
                    scale: 1.35
                },

                {
                    key: "fishingRod",
                    x: 0.86,
                    y: 0.77,
                    scale: 1.80
                },

                {
                    key: "map",
                    x: 0.62,
                    y: 0.82,
                    scale: 1.35
                },

                {
                    key: "camera",
                    x: 0.46,
                    y: 0.72,
                    scale: 1.40
                },

                {
                    key: "key",
                    x: 0.92,
                    y: 0.88,
                    scale: 1.25
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


        /* =========================================================
           INVENTORY
        ========================================================= */

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


        /* =========================================================
           CAMPSITE RENDER
        ========================================================= */

        function renderCampsite() {

            if (
                !campCanvas ||
                !campCtx
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
                assets.campsite.complete &&
                assets.campsite.naturalWidth > 0
            ) {

                campCtx.save();


                campCtx.filter =
                    "brightness(1.35) saturate(1.10)";


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

                    if (
                        item.collected
                    ) {

                        return;

                    }


                    drawCampsiteItem(
                        item
                    );

                }
            );


            if (
                game.phase === 1
            ) {

                requestAnimationFrame(
                    renderCampsite
                );

            }

        }


        /* =========================================================
           DRAW CAMPSITE ITEM
        ========================================================= */

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
                ) *
                0.065;


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


        /* =========================================================
           CAMPSITE CLICK
        ========================================================= */

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


                if (
                    item.collected
                ) {

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
                    ) *
                    0.065;


                const width =
                    baseSize *
                    item.scale *
                    1.10;


                const height =
                    baseSize *
                    item.scale *
                    1.10;


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


        /* =========================================================
           COLLECT ITEM
        ========================================================= */

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


        /* =========================================================
           COLLECTION EFFECT
        ========================================================= */

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


                campCtx.save();


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


        /* =========================================================
           PHASE 1 TIMER
        ========================================================= */

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
                                ) *
                                100
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


        /* =========================================================
           PHASE 1 TIMEOUT
        ========================================================= */

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


        /* =========================================================
           COMPLETE PHASE 1
        ========================================================= */

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


            hide(gameHUD);

            hide(inventoryPanel);

            hide(phase2);

            hide(missionComplete);


            show(
                phase1Complete
            );


            playSound(
                successSound
            );

        }


        /* =========================================================
           START FISHING PHASE
        ========================================================= */

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


            /*
             * Start a fresh fish rotation.
             */
            shuffleFishPool();


            lureX =
                0;

            lureY =
                0;


            rodAngle =
                ROD_CONFIG.waterAngle;

            rodTargetAngle =
                ROD_CONFIG.waterAngle;

            rodKick =
                0;

            reelRotation =
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


        /* =========================================================
           FISHING TIMER
           
           Remains 60 seconds.
        ========================================================= */

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


        /* =========================================================
           FISHING TIMEOUT
        ========================================================= */

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


        /* =========================================================
           CAST BUTTON
        ========================================================= */

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


        /* =========================================================
           AIMING
        ========================================================= */

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
                ROD_CONFIG.waterAngle;


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
             * Very small water-facing movement.
             */
            rodTargetAngle =
                Math.max(
                    ROD_CONFIG.minAngle,
                    Math.min(
                        ROD_CONFIG.maxAngle,
                        ROD_CONFIG.waterAngle +
                        aimAngle *
                        0.06
                    )
                );


            drawFishingScene();


            requestAnimationFrame(
                aimLoop
            );

        }


        /* =========================================================
           POWER CHARGE
        ========================================================= */

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


            updateFishingHUD();


            /*
             * Keep the rod pointing shallowly
             * toward the water.
             */
            rodTargetAngle =
                Math.max(
                    ROD_CONFIG.minAngle,
                    Math.min(
                        ROD_CONFIG.maxAngle,
                        ROD_CONFIG.waterAngle +
                        (
                            castPower /
                            100
                        ) *
                        0.05
                    )
                );


            drawFishingScene();


            requestAnimationFrame(
                powerLoop
            );

        }


        /* =========================================================
           CAST LINE
        ========================================================= */

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


            /*
             * Lure is always placed over the lake.
             */
            lureX =
                fishingWidth *
                (
                    0.48 +
                    (
                        power /
                        100
                    ) *
                    0.36
                );


            lureY =
                fishingHeight *
                0.60;


            fishDistance =
                100;

            lineTension =
                0;

            rodKick =
                1;


            /*
             * Shallow downward water-facing cast.
             */
            rodTargetAngle =
                ROD_CONFIG.maxAngle;


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


        /* =========================================================
           CAST ANIMATION
        ========================================================= */

        function castAnimation(power) {

            let frame =
                0;


            const totalFrames =
                30;


            const geometry =
                getRodGeometry();


            const startX =
                geometry.tipX;


            const startY =
                geometry.tipY;


            const targetX =
                fishingWidth *
                (
                    0.48 +
                    (
                        power /
                        100
                    ) *
                    0.36
                );


            /*
             * Target is in the water, not the sky.
             */
            const targetY =
                fishingHeight *
                (
                    0.57 +
                    (
                        1 -
                        power /
                        100
                    ) *
                    0.04
                );


            function animate() {

                if (
                    game.phase !== 2 ||
                    !game.fishingActive
                ) {

                    return;

                }


                const progress =
                    frame /
                    totalFrames;


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
                 * Small realistic cast arc.
                 *
                 * Importantly, the arc stays within
                 * the water area and never shoots
                 * the lure toward the sky.
                 */
                const arc =
                    Math.sin(
                        progress *
                        Math.PI
                    ) *
                    Math.min(
                        55,
                        30 +
                        power * 0.18
                    );


                lureY =
                    startY +
                    (
                        targetY -
                        startY
                    ) *
                    eased -
                    arc;


                /*
                 * Rod remains shallow and water-facing.
                 */
                rodTargetAngle =
                    ROD_CONFIG.waterAngle -
                    progress *
                    0.04;


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


        /* =========================================================
           WAIT FOR FISH
        ========================================================= */

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


            /*
             * Fish comes in faster.
             */
            const delay =
                900 +
                Math.random() *
                1600;


            clearTimeout(
                fishBiteTimeout
            );


            fishBiteTimeout =
                setTimeout(
                    fishBite,
                    delay
                );

        }


        /* =========================================================
           FISH BITE
           
           Easier:
           - 3 seconds reaction window
           - lower starting tension
        ========================================================= */

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
                12;


            rodTargetAngle =
                -0.25;


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


            /*
             * Long reaction window.
             */
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
                25;


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
                -0.22;


            if (castRod) {

                castRod.innerText =
                    "🌀 REEL IN";

            }


            playSound(
                splashSound
            );


            startFishFight();

        }


        /* =========================================================
           FISH FIGHT
           
           Easier version:
           - fish moves away more slowly
           - tension rises slowly
           - sudden tension spikes are rare
        ========================================================= */

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

                /*
                 * Fish moves away only slightly.
                 */
                fishDistance +=
                    0.20;

            } else {

                /*
                 * Reeling still brings fish
                 * toward player efficiently.
                 */
                fishDistance +=
                    0.10;

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


            /*
             * Much smaller and less frequent
             * tension spikes.
             */
            if (
                pull < 0.012
            ) {

                lineTension +=
                    2.5;

            }


            /*
             * Natural slow tension recovery.
             */
            lineTension -=
                0.03;


            lineTension =
                Math.max(
                    0,
                    Math.min(
                        100,
                        lineTension
                    )
                );


            if (
                lineTension >= 100
            ) {

                fishEscaped();

                return;

            }


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
           FISH ESCAPES
        ========================================================= */

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


        /* =========================================================
           DRAW CURRENT FISH
        ========================================================= */

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
                    0.53 +
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


        /* =========================================================
           DRAW LURE
        ========================================================= */

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
                -0.20;


            if (castRod) {

                castRod.innerText =
                    "🌀 REELING...";

            }


            updateFishingHUD();

            drawFishingScene();

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


            fishingState =
                "HOOKED";


            rodTargetAngle =
                -0.22;


            if (castRod) {

                castRod.innerText =
                    "🌀 REEL IN";

            }


            drawFishingScene();

            fishFightLoop();

        }


        /* =========================================================
           REEL LOOP
           
           Easier:
           - faster fish recovery
           - slower tension increase
           - reduced fish pull-away
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
             * Faster fish recovery.
             */
            fishDistance -=
                1.65;


            /*
             * Slower tension build-up.
             */
            lineTension +=
                0.28;


            const fishPull =
                Math.random();


            /*
             * Fish rarely pulls away.
             */
            if (
                fishPull < 0.012
            ) {

                fishDistance +=
                    1.5;


                lineTension +=
                    1.5;

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
                lineTension >= 100
            ) {

                fishEscaped();

                return;

            }


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


            /*
             * Existing fish score values remain unchanged.
             */
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


        /* =========================================================
           FISH CATCH EFFECT
        ========================================================= */

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


        /* =========================================================
           RESET FISHING ATTEMPT
        ========================================================= */

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


            /*
             * Only refill once the current fish bag
             * has been completely used.
             */
            if (
                fishPool.length === 0
            ) {

                shuffleFishPool();

            }


            lureX =
                0;

            lureY =
                0;


            rodAngle =
                ROD_CONFIG.waterAngle;

            rodTargetAngle =
                ROD_CONFIG.waterAngle;

            rodKick =
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
           FINISH FISHING
           
           Still requires 6 fish.
        ========================================================= */

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


            /*
             * Existing completion XP remains.
             */
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


        /* =========================================================
           ROD ANIMATION
        ========================================================= */

        function updateRodAnimation() {

            /*
             * Smoothly follow the target angle.
             */
            rodAngle +=
                (
                    rodTargetAngle -
                    rodAngle
                ) *
                0.12;


            /*
             * Keep rod inside safe water-facing range.
             */
            rodAngle =
                Math.max(
                    ROD_CONFIG.minAngle,
                    Math.min(
                        ROD_CONFIG.maxAngle,
                        rodAngle
                    )
                );


            rodKick *=
                0.86;


            if (reelActive) {

                reelRotation +=
                    0.4;

            }

        }


        /* =========================================================
           ROD GEOMETRY
        ========================================================= */

        function getRodGeometry() {

            const handX =
                fishingWidth *
                ROD_CONFIG.handX;


            const handY =
                fishingHeight *
                ROD_CONFIG.handY;


            const rodLength =
                Math.min(
                    fishingWidth,
                    fishingHeight
                ) *
                ROD_CONFIG.lengthRatio;


            const angle =
                Math.max(
                    ROD_CONFIG.minAngle,
                    Math.min(
                        ROD_CONFIG.maxAngle,
                        rodAngle
                    )
                );


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
           DRAW REALISTIC FISHING ROD
           
           Uses existing fishingRod.png.
           
           Includes:
           - larger rod
           - graphite shaft
           - handle grip
           - grip rings
           - reel mount
           - reel body
           - rotating spool
           - reel handle
           - rod guides
           - shadow/depth
        ========================================================= */

        function drawFishingRod() {

            if (!fishingCtx) {
                return;
            }


            updateRodAnimation();


            const geometry =
                getRodGeometry();


            const rodImage =
                assets.items.fishingRod;


            const rodLength =
                geometry.rodLength;


            fishingCtx.save();


            fishingCtx.translate(
                geometry.handX,
                geometry.handY
            );


            fishingCtx.rotate(
                geometry.angle
            );


            /* =====================================================
               ROD SHADOW
            ===================================================== */

            fishingCtx.save();


            fishingCtx.globalAlpha =
                0.22;


            fishingCtx.strokeStyle =
                "#000000";


            fishingCtx.lineWidth =
                15;


            fishingCtx.lineCap =
                "round";


            fishingCtx.filter =
                "blur(4px)";


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                -2,
                6
            );


            fishingCtx.lineTo(
                rodLength,
                6
            );


            fishingCtx.stroke();


            fishingCtx.restore();


            /* =====================================================
               EXISTING ROD IMAGE
            ===================================================== */

            if (
                rodImage &&
                rodImage.complete &&
                rodImage.naturalWidth > 0
            ) {

                const imageRatio =
                    rodImage.naturalWidth /
                    rodImage.naturalHeight;


                const rodHeight =
                    Math.min(
                        118,
                        Math.max(
                            82,
                            fishingHeight *
                            0.105
                        )
                    );


                const rodWidth =
                    rodHeight *
                    imageRatio;


                fishingCtx.save();


                fishingCtx.globalAlpha =
                    0.96;


                fishingCtx.imageSmoothingEnabled =
                    true;


                /*
                 * Draw existing asset as a visible
                 * foreground rod.
                 */
                fishingCtx.drawImage(
                    rodImage,
                    -rodHeight * 0.18,
                    -rodHeight * 0.50,
                    rodWidth,
                    rodHeight
                );


                fishingCtx.restore();

            }


            /* =====================================================
               GRAPHITE SHAFT
            ===================================================== */

            const rodGradient =
                fishingCtx.createLinearGradient(
                    0,
                    -7,
                    rodLength,
                    7
                );


            rodGradient.addColorStop(
                0,
                "#15191d"
            );


            rodGradient.addColorStop(
                0.45,
                "#30363b"
            );


            rodGradient.addColorStop(
                0.78,
                "#5b6469"
            );


            rodGradient.addColorStop(
                1,
                "#a5afb3"
            );


            fishingCtx.strokeStyle =
                rodGradient;


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
                rodLength * 0.70,
                0
            );


            fishingCtx.stroke();


            /* =====================================================
               THIN ROD TIP
            ===================================================== */

            fishingCtx.strokeStyle =
                "#b8c1c4";


            fishingCtx.lineWidth =
                4;


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                rodLength * 0.62,
                0
            );


            fishingCtx.lineTo(
                rodLength,
                0
            );


            fishingCtx.stroke();


            /* =====================================================
               SHAFT HIGHLIGHT
            ===================================================== */

            fishingCtx.strokeStyle =
                "rgba(255,255,255,0.28)";


            fishingCtx.lineWidth =
                2;


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                5,
                -4
            );


            fishingCtx.lineTo(
                rodLength * 0.72,
                -4
            );


            fishingCtx.stroke();


            /* =====================================================
               HANDLE GRIP
            ===================================================== */

            const gripGradient =
                fishingCtx.createLinearGradient(
                    -38,
                    0,
                    34,
                    0
                );


            gripGradient.addColorStop(
                0,
                "#4b2b1a"
            );


            gripGradient.addColorStop(
                0.30,
                "#9a633b"
            );


            gripGradient.addColorStop(
                0.60,
                "#c18a58"
            );


            gripGradient.addColorStop(
                1,
                "#59331e"
            );


            fishingCtx.fillStyle =
                gripGradient;


            fishingCtx.beginPath();


            fishingCtx.roundRect(
                -38,
                -11,
                72,
                22,
                10
            );


            fishingCtx.fill();


            /* =====================================================
               GRIP RINGS
            ===================================================== */

            fishingCtx.strokeStyle =
                "rgba(45,25,15,0.75)";


            fishingCtx.lineWidth =
                2;


            for (
                let i = 0;
                i < 5;
                i++
            ) {

                const ringX =
                    -28 +
                    i * 14;


                fishingCtx.beginPath();


                fishingCtx.moveTo(
                    ringX,
                    -10
                );


                fishingCtx.lineTo(
                    ringX,
                    10
                );


                fishingCtx.stroke();

            }


            /* =====================================================
               REEL MOUNT
            ===================================================== */

            fishingCtx.strokeStyle =
                "#353b3f";


            fishingCtx.lineWidth =
                5;


            fishingCtx.lineCap =
                "round";


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                22,
                4
            );


            fishingCtx.lineTo(
                38,
                20
            );


            fishingCtx.stroke();


            /* =====================================================
               REEL BODY
            ===================================================== */

            const reelX =
                38;


            const reelY =
                22;


            const reelGradient =
                fishingCtx.createRadialGradient(
                    reelX - 5,
                    reelY - 5,
                    2,
                    reelX,
                    reelY,
                    30
                );


            reelGradient.addColorStop(
                0,
                "#aeb6ba"
            );


            reelGradient.addColorStop(
                0.35,
                "#626b70"
            );


            reelGradient.addColorStop(
                0.70,
                "#30363a"
            );


            reelGradient.addColorStop(
                1,
                "#171b1e"
            );


            fishingCtx.fillStyle =
                reelGradient;


            fishingCtx.beginPath();


            fishingCtx.ellipse(
                reelX,
                reelY,
                25,
                31,
                0,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            /* =====================================================
               REEL OUTER RIM
            ===================================================== */

            fishingCtx.strokeStyle =
                "#b9c1c4";


            fishingCtx.lineWidth =
                2;


            fishingCtx.beginPath();


            fishingCtx.ellipse(
                reelX,
                reelY,
                20,
                26,
                0,
                0,
                Math.PI * 2
            );


            fishingCtx.stroke();


            /* =====================================================
               ROTATING SPOOL
            ===================================================== */

            fishingCtx.save();


            fishingCtx.translate(
                reelX,
                reelY
            );


            fishingCtx.rotate(
                reelRotation
            );


            fishingCtx.fillStyle =
                "#858e92";


            fishingCtx.beginPath();


            fishingCtx.ellipse(
                0,
                0,
                15,
                22,
                0,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            fishingCtx.strokeStyle =
                "#d8dfe1";


            fishingCtx.lineWidth =
                2;


            for (
                let i = 0;
                i < 5;
                i++
            ) {

                const spokeAngle =
                    (
                        Math.PI * 2 /
                        5
                    ) *
                    i;


                fishingCtx.beginPath();


                fishingCtx.moveTo(
                    0,
                    0
                );


                fishingCtx.lineTo(
                    Math.cos(
                        spokeAngle
                    ) *
                    13,
                    Math.sin(
                        spokeAngle
                    ) *
                    19
                );


                fishingCtx.stroke();

            }


            fishingCtx.fillStyle =
                "#202427";


            fishingCtx.beginPath();


            fishingCtx.arc(
                0,
                0,
                5,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            fishingCtx.restore();


            /* =====================================================
               REEL HANDLE
            ===================================================== */

            const handleAngle =
                reelRotation;


            const handleX =
                reelX +
                Math.cos(
                    handleAngle
                ) *
                31;


            const handleY =
                reelY +
                Math.sin(
                    handleAngle
                ) *
                31;


            fishingCtx.strokeStyle =
                "#171a1c";


            fishingCtx.lineWidth =
                5;


            fishingCtx.lineCap =
                "round";


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                reelX,
                reelY
            );


            fishingCtx.lineTo(
                handleX,
                handleY
            );


            fishingCtx.stroke();


            fishingCtx.fillStyle =
                "#0d0f10";


            fishingCtx.beginPath();


            fishingCtx.arc(
                handleX,
                handleY,
                7,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            /* =====================================================
               ROD GUIDES
            ===================================================== */

            fishingCtx.strokeStyle =
                "#d1d8da";


            fishingCtx.lineWidth =
                2;


            const guidePositions = [

                0.28,

                0.43,

                0.57,

                0.69,

                0.80,

                0.90,

                0.97

            ];


            guidePositions.forEach(
                position => {

                    const gx =
                        rodLength *
                        position;


                    const guideHeight =
                        Math.max(
                            5,
                            10 -
                            position * 5
                        );


                    fishingCtx.beginPath();


                    fishingCtx.arc(
                        gx,
                        0,
                        guideHeight,
                        0,
                        Math.PI
                    );


                    fishingCtx.stroke();

                }
            );


            fishingCtx.restore();

        }


        /* =========================================================
           DRAW FISHING LINE
           
           Connects directly from the actual rod tip.
        ========================================================= */

        function drawFishingLine() {

            if (!fishingCtx) {
                return;
            }


            if (
                !lureX ||
                !lureY ||
                fishingState === "IDLE" ||
                fishingState === "AIMING" ||
                fishingState === "CHARGING"
            ) {

                return;

            }


            const geometry =
                getRodGeometry();


            const rodTipX =
                geometry.tipX;


            const rodTipY =
                geometry.tipY;


            /*
             * Keep lure in the water area.
             */
            const safeLureY =
                Math.max(
                    lureY,
                    fishingHeight *
                    0.55
                );


            fishingCtx.save();


            /* =====================================================
               LINE SHADOW
            ===================================================== */

            fishingCtx.strokeStyle =
                "rgba(0,0,0,0.18)";


            fishingCtx.lineWidth =
                3;


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                rodTipX,
                rodTipY
            );


            const shadowControlX =
                (
                    rodTipX +
                    lureX
                ) / 2;


            const shadowControlY =
                (
                    rodTipY +
                    safeLureY
                ) / 2 +
                8;


            fishingCtx.quadraticCurveTo(
                shadowControlX,
                shadowControlY,
                lureX,
                safeLureY
            );


            fishingCtx.stroke();


            /* =====================================================
               MAIN FISHING LINE
            ===================================================== */

            fishingCtx.strokeStyle =
                "rgba(245,248,250,0.92)";


            fishingCtx.lineWidth =
                1.25;


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                rodTipX,
                rodTipY
            );


            const controlX =
                (
                    rodTipX +
                    lureX
                ) / 2;


            const controlY =
                (
                    rodTipY +
                    safeLureY
                ) / 2 -
                18;


            fishingCtx.quadraticCurveTo(
                controlX,
                controlY,
                lureX,
                safeLureY
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
                fishingState === "IDLE" ||
                fishingState === "AIMING" ||
                fishingState === "CHARGING" ||
                fishingState === "CASTING"
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
           FISHING SCENE
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


            /*
             * Keep rod animation smooth.
             */
            updateRodAnimation();


            if (
                fishingState === "WAITING" ||
                fishingState === "BITE" ||
                fishingState === "HOOKED" ||
                fishingState === "REELING"
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


        /* =========================================================
           FISHING CANVAS CLICK
        ========================================================= */

        if (fishingCanvas) {

            fishingCanvas.addEventListener(
                "click",
                () => {

                    handleCastRod();

                }
            );

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


            playSound(
                successSound
            );


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


        /* =========================================================
           REPLAY
        ========================================================= */

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


            fishPool =
                [];


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
                ROD_CONFIG.waterAngle;

            rodTargetAngle =
                ROD_CONFIG.waterAngle;

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


        /* =========================================================
           RESET GAME
        ========================================================= */

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


            fishPool =
                [];


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
                ROD_CONFIG.waterAngle;

            rodTargetAngle =
                ROD_CONFIG.waterAngle;

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


        /* =========================================================
           TERMINAL INTRO
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


        /* =========================================================
           INITIALISE INTRO
        ========================================================= */

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


        /* =========================================================
           RENDER FISHING
        ========================================================= */

        function renderFishing() {

            drawFishingScene();

        }


        /* =========================================================
           BUTTON EVENTS
        ========================================================= */

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


        /* =========================================================
           CAMPSITE POINTER EVENT
        ========================================================= */

        if (campCanvas) {

            campCanvas.addEventListener(
                "pointerdown",
                handleCampsiteClick
            );

        }


        /* =========================================================
           KEYBOARD CONTROLS
           
           SPACE = fishing action
           R = reel
        ========================================================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.code ===
                    "Space"
                ) {

                    if (
                        game.phase === 2 &&
                        game.fishingActive
                    ) {

                        event.preventDefault();


                        handleCastRod();

                    }

                }


                if (
                    event.key.toLowerCase() ===
                    "r"
                ) {

                    if (
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

            }
        );


        /* =========================================================
           VISIBILITY CHANGE
        ========================================================= */

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


        updateMainHUD();

        updateFishingHUD();


        /* =========================================================
           START
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
