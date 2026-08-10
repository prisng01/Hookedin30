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


        const missionStartSound =
            new Audio(
                "assets/audio/mission_start.mp3"
            );


        /* =========================================================
           FISHING AUDIO
        ========================================================= */

        const fishingLakeAudio =
            new Audio(
                "assets/audio/mindmist-fishing-on-the-lake-310740.mp3"
            );

        fishingLakeAudio.loop =
            true;

        fishingLakeAudio.volume =
            0.45;


        const fishingRodWhooshAudio =
            new Audio(
                "assets/audio/spinopel-fishing-rod-whoosh-411640.mp3"
            );

        fishingRodWhooshAudio.volume =
            0.75;


        const fishingWindingAudio =
            new Audio(
                "assets/audio/freesound_community-fishingrod-winding-92375.mp3"
            );

        fishingWindingAudio.loop =
            true;

        fishingWindingAudio.volume =
            0.70;


        const fishPullingAudio =
            new Audio(
                "assets/audio/freesound_community-fly-reel-fish-pulling-saricione-94671.mp3"
            );

        fishPullingAudio.volume =
            0.80;


        const missionCompleteAudio =
            new Audio(
                "assets/audio/mission-complete.mp3"
            );

        missionCompleteAudio.volume =
            0.90;


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

           Guarantees all available fish types appear before
           repeating the same fish.
        ========================================================= */

        let fishPool = [];


        function getAvailableFishTypes() {

            return Object.keys(
                assets.fish
            ).filter(
                fishKey => {

                    const image =
                        assets.fish[fishKey];

                    return (
                        image &&
                        image.complete &&
                        image.naturalWidth > 0
                    );

                }
            );

        }


        function shuffleFishPool() {

            const availableFish =
                getAvailableFishTypes();


            if (
                availableFish.length === 0
            ) {

                fishPool =
                    Object.keys(
                        assets.fish
                    );

                return;

            }


            fishPool =
                [...availableFish];


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
                ] =
                [
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


            const availableFish =
                getAvailableFishTypes();


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
            -0.72;

        let rodTargetAngle =
            -0.72;

        let rodKick =
            0;

        let reelRotation =
            0;


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
           FISHING AUDIO HELPERS
        ========================================================= */

        function startFishingMusic() {

            if (!fishingLakeAudio) {
                return;
            }


            try {

                fishingLakeAudio.currentTime =
                    0;


                fishingLakeAudio.play().catch(
                    () => {}
                );

            } catch (error) {

                console.warn(
                    "Unable to start fishing music:",
                    error
                );

            }

        }


        function stopFishingMusic() {

            if (!fishingLakeAudio) {
                return;
            }


            try {

                fishingLakeAudio.pause();

                fishingLakeAudio.currentTime =
                    0;

            } catch (error) {

                console.warn(
                    "Unable to stop fishing music:",
                    error
                );

            }

        }


        function playFishingRodWhoosh() {

            if (!fishingRodWhooshAudio) {
                return;
            }


            try {

                fishingRodWhooshAudio.currentTime =
                    0;


                fishingRodWhooshAudio.play().catch(
                    () => {}
                );

            } catch (error) {

                console.warn(
                    "Unable to play rod whoosh:",
                    error
                );

            }

        }


        function startFishingWinding() {

            if (!fishingWindingAudio) {
                return;
            }


            try {

                if (
                    fishingWindingAudio.paused
                ) {

                    fishingWindingAudio.currentTime =
                        0;


                    fishingWindingAudio.play().catch(
                        () => {}
                    );

                }

            } catch (error) {

                console.warn(
                    "Unable to start winding sound:",
                    error
                );

            }

        }


        function stopFishingWinding() {

            if (!fishingWindingAudio) {
                return;
            }


            try {

                fishingWindingAudio.pause();

                fishingWindingAudio.currentTime =
                    0;

            } catch (error) {

                console.warn(
                    "Unable to stop winding sound:",
                    error
                );

            }

        }


        function playFishPullingSound() {

            if (!fishPullingAudio) {
                return;
            }


            try {

                fishPullingAudio.currentTime =
                    0;


                fishPullingAudio.play().catch(
                    () => {}
                );

            } catch (error) {

                console.warn(
                    "Unable to play fish pulling sound:",
                    error
                );

            }

        }


        function stopFishPullingSound() {

            if (!fishPullingAudio) {
                return;
            }


            try {

                fishPullingAudio.pause();

                fishPullingAudio.currentTime =
                    0;

            } catch (error) {

                console.warn(
                    "Unable to stop fish pulling sound:",
                    error
                );

            }

        }


        function playMissionCompleteSound() {

            if (!missionCompleteAudio) {
                return;
            }


            try {

                missionCompleteAudio.currentTime =
                    0;


                missionCompleteAudio.play().catch(
                    () => {}
                );

            } catch (error) {

                console.warn(
                    "Unable to play mission complete sound:",
                    error
                );

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


            game.xp +=
                50;


            game.score +=
                100;


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


            game.xp +=
                200;


            game.score +=
                500;


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
                80;


            game.fishCaught =
                0;


            game.bearProgress =
                100;


            startFishingMusic();


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


            shuffleFishPool();


            lureX =
                0;


            lureY =
                0;


            rodAngle =
                -0.72;


            rodTargetAngle =
                -0.72;


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
           FISHING TIMER — 80 SECONDS
        ========================================================= */

        function startFishingTimer() {

            if (fishingInterval) {

                clearInterval(
                    fishingInterval
                );

            }


            game.fishingTimer =
                80;


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


            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


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
                -0.68;


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


            rodTargetAngle =
                -0.72 +
                (
                    aimAngle *
                    0.16
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


            rodTargetAngle =
                -0.72 +
                (
                    castPower /
                    100
                ) *
                0.12;


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


            playFishingRodWhoosh();


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
                -0.48;


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
                    -0.68 +
                    (
                        progress *
                        0.22
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
                -0.38;


            if (castRod) {

                castRod.innerText =
                    "🎣 WAITING...";

            }


            drawFishingScene();


            const delay =
                1400 +
                Math.random() *
                2600;


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
           Easier reaction window
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
                20;


            rodTargetAngle =
                -0.30;


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
                -0.18;


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


            const pull =
                Math.random();


            if (
                pull < 0.02
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


            stopFishingWinding();

            stopFishPullingSound();


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


            startFishingWinding();


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


            stopFishingWinding();


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


            fishDistance -=
                1.55;


            lineTension +=
                0.45;


            const fishPull =
                Math.random();


            if (
                fishPull < 0.02
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

            stopFishingWinding();

            stopFishPullingSound();


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
                -0.72;


            rodTargetAngle =
                -0.72;


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


            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


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


        /* =========================================================
           ROD ANIMATION
        ========================================================= */

        function updateRodAnimation() {

            rodAngle +=
                (
                    rodTargetAngle -
                    rodAngle
                ) *
                0.12;


            rodKick *=
                0.86;


            if (reelActive) {

                reelRotation +=
                    0.4;

            }

        }


        /* =========================================================
           REALISTIC FISHING ROD
        ========================================================= */

        function drawFishingRod() {

            if (!fishingCtx) {
                return;
            }


            const rodImage =
                assets.items.fishingRod;


            const handX =
                fishingWidth *
                0.50;


            const handY =
                fishingHeight *
                0.82;


            const rodLength =
                Math.min(
                    fishingWidth,
                    fishingHeight
                ) *
                0.52;


            updateRodAnimation();


            const angle =
                -0.58 +
                (
                    rodAngle +
                    0.72
                ) *
                0.35;


            fishingCtx.save();


            fishingCtx.translate(
                handX,
                handY
            );


            fishingCtx.rotate(
                angle
            );


            if (
                rodImage &&
                rodImage.complete &&
                rodImage.naturalWidth > 0
            ) {

                const imageRatio =
                    rodImage.naturalWidth /
                    rodImage.naturalHeight;


                const rodHeight =
                    Math.max(
                        58,
                        Math.min(
                            fishingWidth,
                            fishingHeight
                        ) *
                        0.055
                    );


                const rodWidth =
                    rodHeight *
                    imageRatio;


                fishingCtx.save();


                fishingCtx.globalAlpha =
                    0.25;


                fishingCtx.filter =
                    "blur(3px)";


                fishingCtx.drawImage(
                    rodImage,
                    5,
                    -rodHeight / 2 + 4,
                    rodWidth,
                    rodHeight
                );


                fishingCtx.restore();


                fishingCtx.drawImage(
                    rodImage,
                    0,
                    -rodHeight / 2,
                    rodWidth,
                    rodHeight
                );


            } else {

                const fallbackLength =
                    rodLength;


                fishingCtx.save();


                fishingCtx.globalAlpha =
                    0.25;


                fishingCtx.strokeStyle =
                    "#000000";


                fishingCtx.lineWidth =
                    11;


                fishingCtx.lineCap =
                    "round";


                fishingCtx.beginPath();


                fishingCtx.moveTo(
                    0,
                    0
                );


                fishingCtx.lineTo(
                    fallbackLength,
                    -2
                );


                fishingCtx.stroke();


                fishingCtx.restore();


                const gradient =
                    fishingCtx.createLinearGradient(
                        0,
                        0,
                        fallbackLength,
                        0
                    );


                gradient.addColorStop(
                    0,
                    "#24160f"
                );


                gradient.addColorStop(
                    0.25,
                    "#5d3923"
                );


                gradient.addColorStop(
                    0.7,
                    "#8b633e"
                );


                gradient.addColorStop(
                    1,
                    "#d0a06a"
                );


                fishingCtx.strokeStyle =
                    gradient;


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
                    fallbackLength,
                    -2
                );


                fishingCtx.stroke();


                fishingCtx.strokeStyle =
                    "rgba(255,255,255,0.35)";


                fishingCtx.lineWidth =
                    2;


                fishingCtx.beginPath();


                fishingCtx.moveTo(
                    5,
                    -2
                );


                fishingCtx.lineTo(
                    fallbackLength - 5,
                    -4
                );


                fishingCtx.stroke();

            }


            const gripLength =
                Math.min(
                    55,
                    fishingWidth * 0.035
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
                "#6f4428"
            );


            gripGradient.addColorStop(
                0.5,
                "#b77c4c"
            );


            gripGradient.addColorStop(
                1,
                "#714326"
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
                    -7,
                    gripLength,
                    14,
                    6
                );

            } else {

                fishingCtx.rect(
                    -gripLength,
                    -7,
                    gripLength,
                    14
                );

            }


            fishingCtx.fill();


            fishingCtx.strokeStyle =
                "rgba(40,20,10,0.7)";


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
                    -7
                );


                fishingCtx.lineTo(
                    -i,
                    7
                );


                fishingCtx.stroke();

            }


            const reelX =
                5;


            const reelY =
                13;


            fishingCtx.strokeStyle =
                "#30343a";


            fishingCtx.lineWidth =
                5;


            fishingCtx.lineCap =
                "round";


            fishingCtx.beginPath();


            fishingCtx.moveTo(
                reelX,
                2
            );


            fishingCtx.lineTo(
                reelX,
                reelY
            );


            fishingCtx.stroke();


            const reelGradient =
                fishingCtx.createRadialGradient(
                    reelX,
                    reelY,
                    2,
                    reelX,
                    reelY,
                    17
                );


            reelGradient.addColorStop(
                0,
                "#9fa5aa"
            );


            reelGradient.addColorStop(
                0.45,
                "#555c63"
            );


            reelGradient.addColorStop(
                1,
                "#20252a"
            );


            fishingCtx.fillStyle =
                reelGradient;


            fishingCtx.beginPath();


            fishingCtx.arc(
                reelX,
                reelY,
                15,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            fishingCtx.save();


            fishingCtx.rotate(
                reelRotation
            );


            fishingCtx.strokeStyle =
                "#d8dde0";


            fishingCtx.lineWidth =
                3;


            fishingCtx.beginPath();


            fishingCtx.arc(
                reelX,
                reelY,
                8,
                0,
                Math.PI * 2
            );


            fishingCtx.stroke();


            for (
                let i = 0;
                i < 4;
                i++
            ) {

                const spokeAngle =
                    (
                        Math.PI * 2 /
                        4
                    ) *
                    i;


                fishingCtx.beginPath();


                fishingCtx.moveTo(
                    reelX +
                        Math.cos(
                            spokeAngle
                        ) *
                        3,
                    reelY +
                        Math.sin(
                            spokeAngle
                        ) *
                        3
                );


                fishingCtx.lineTo(
                    reelX +
                        Math.cos(
                            spokeAngle
                        ) *
                        10,
                    reelY +
                        Math.sin(
                            spokeAngle
                        ) *
                        10
                );


                fishingCtx.stroke();

            }


            fishingCtx.restore();


            fishingCtx.fillStyle =
                "#15191d";


            fishingCtx.beginPath();


            fishingCtx.arc(
                reelX,
                reelY,
                3,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            const crankAngle =
                reelRotation;


            const crankX =
                reelX +
                Math.cos(
                    crankAngle
                ) *
                22;


            const crankY =
                reelY +
                Math.sin(
                    crankAngle
                ) *
                22;


            fishingCtx.strokeStyle =
                "#454b50";


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
                "#181c20";


            fishingCtx.beginPath();


            fishingCtx.arc(
                crankX,
                crankY,
                4,
                0,
                Math.PI * 2
            );


            fishingCtx.fill();


            const guidePositions = [
                0.22,
                0.42,
                0.62,
                0.80,
                0.94
            ];


            if (
                rodImage &&
                rodImage.complete &&
                rodImage.naturalWidth > 0
            ) {

                const imageRatio =
                    rodImage.naturalWidth /
                    rodImage.naturalHeight;


                const rodHeight =
                    Math.max(
                        58,
                        Math.min(
                            fishingWidth,
                            fishingHeight
                        ) *
                        0.055
                    );


                const rodWidth =
                    rodHeight *
                    imageRatio;


                guidePositions.forEach(
                    position => {

                        const gx =
                            rodWidth *
                            position;


                        const guideSize =
                            Math.max(
                                3,
                                rodHeight *
                                0.10
                            );


                        fishingCtx.strokeStyle =
                            "rgba(220,225,228,0.85)";


                        fishingCtx.lineWidth =
                            1.5;


                        fishingCtx.beginPath();


                        fishingCtx.arc(
                            gx,
                            0,
                            guideSize,
                            0,
                            Math.PI
                        );


                        fishingCtx.stroke();

                    }
                );

            }


            fishingCtx.restore();

        }


        /* =========================================================
           DRAW FISHING LINE
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


            const handX =
                fishingWidth *
                0.50;


            const handY =
                fishingHeight *
                0.82;


            const rodImage =
                assets.items.fishingRod;


            let rodLength =
                Math.min(
                    fishingWidth,
                    fishingHeight
                ) *
                0.52;


            if (
                rodImage &&
                rodImage.complete &&
                rodImage.naturalWidth > 0
            ) {

                const imageRatio =
                    rodImage.naturalWidth /
                    rodImage.naturalHeight;


                const rodHeight =
                    Math.max(
                        58,
                        Math.min(
                            fishingWidth,
                            fishingHeight
                        ) *
                        0.055
                    );


                rodLength =
                    rodHeight *
                    imageRatio;

            }


            const angle =
                -0.58 +
                (
                    rodAngle +
                    0.72
                ) *
                0.35;


            const rodTipX =
                handX +
                Math.cos(angle) *
                rodLength;


            const rodTipY =
                handY +
                Math.sin(angle) *
                rodLength;


            fishingCtx.save();


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
                    lureY
                ) / 2 +
                8;


            fishingCtx.quadraticCurveTo(
                shadowControlX,
                shadowControlY,
                lureX,
                lureY
            );


            fishingCtx.stroke();


            fishingCtx.strokeStyle =
                "rgba(245,248,250,0.90)";


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
                    lureY
                ) / 2 -
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


            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


            playMissionCompleteSound();


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

            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


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


            fishPool =
                [];


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


        /* =========================================================
           RESET GAME
        ========================================================= */

        function resetGame() {

            stopFishingMusic();

            stopFishingWinding();

            stopFishPullingSound();


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
                80;


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


            fishPool =
                [];


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
/* =========================================================
   END OF PART 1 CONTINUATION
   ========================================================= */


/* =========================================================
   ADDITIONAL FISHING VISUAL EFFECTS
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


    /*
     * General water shimmer.
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
                0.35 +
                i *
                0.075
            );


        const offset =
            (
                now *
                0.0003
            ) %
            1;


        fishingCtx.beginPath();


        fishingCtx.moveTo(
            -50 +
                offset *
                100,
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
   DRAW FISHING BACKGROUND
========================================================= */

function drawFishingBackground() {

    if (
        !fishingCtx
    ) {

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


    /*
     * Fallback lake background.
     */

    const skyGradient =
        fishingCtx.createLinearGradient(
            0,
            0,
            0,
            fishingHeight *
            0.48
        );


    skyGradient.addColorStop(
        0,
        "#8ec9ed"
    );


    skyGradient.addColorStop(
        1,
        "#d8effa"
    );


    fishingCtx.fillStyle =
        skyGradient;


    fishingCtx.fillRect(
        0,
        0,
        fishingWidth,
        fishingHeight *
        0.48
    );


    const waterGradient =
        fishingCtx.createLinearGradient(
            0,
            fishingHeight *
            0.42,
            0,
            fishingHeight
        );


    waterGradient.addColorStop(
        0,
        "#4b9ac1"
    );


    waterGradient.addColorStop(
        1,
        "#123e58"
    );


    fishingCtx.fillStyle =
        waterGradient;


    fishingCtx.fillRect(
        0,
        fishingHeight *
        0.42,
        fishingWidth,
        fishingHeight *
        0.58
    );


    /*
     * Horizon.
     */

    fishingCtx.fillStyle =
        "#6a8b5c";


    fishingCtx.beginPath();


    fishingCtx.moveTo(
        0,
        fishingHeight *
        0.43
    );


    for (
        let x = 0;
        x <= fishingWidth;
        x += 40
    ) {

        const hill =
            Math.sin(
                x *
                0.006
            ) *
            25;


        fishingCtx.lineTo(
            x,
            fishingHeight *
            0.40 +
            hill
        );

    }


    fishingCtx.lineTo(
        fishingWidth,
        fishingHeight *
        0.52
    );


    fishingCtx.lineTo(
        0,
        fishingHeight *
        0.52
    );


    fishingCtx.closePath();


    fishingCtx.fill();


    drawFishingWaterEffects();

}


/* =========================================================
   IMPROVED LURE ANIMATION
========================================================= */

function drawFishingLureGlow() {

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
        fishingState === "CHARGING"
    ) {

        return;

    }


    const pulse =
        (
            Math.sin(
                Date.now() *
                0.006
            ) +
            1
        ) /
        2;


    fishingCtx.save();


    fishingCtx.globalAlpha =
        0.18 +
        pulse *
        0.12;


    const glow =
        fishingCtx.createRadialGradient(
            lureX,
            lureY,
            2,
            lureX,
            lureY,
            25 +
            pulse *
            8
        );


    glow.addColorStop(
        0,
        "#ffffff"
    );


    glow.addColorStop(
        0.35,
        "rgba(255,255,255,0.45)"
    );


    glow.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    fishingCtx.fillStyle =
        glow;


    fishingCtx.beginPath();


    fishingCtx.arc(
        lureX,
        lureY,
        30 +
        pulse *
        8,
        0,
        Math.PI * 2
    );


    fishingCtx.fill();


    fishingCtx.restore();

}


/* =========================================================
   FISH SWIMMING MOTION
========================================================= */

function getFishPosition() {

    const ratio =
        Math.max(
            0,
            Math.min(
                1,
                fishDistance /
                100
            )
        );


    const baseX =
        fishingWidth *
        (
            0.48 +
            ratio *
            0.28
        );


    const swimmingWave =
        Math.sin(
            Date.now() *
            0.0025
        ) *
        12;


    const struggleWave =
        (
            fishingState === "BITE" ||
            fishingState === "HOOKED" ||
            fishingState === "REELING"
        )
            ? Math.sin(
                Date.now() *
                0.012
            ) *
            10
            : 0;


    const baseY =
        fishingHeight *
        0.47;


    return {

        x:
            baseX,

        y:
            baseY +
            swimmingWave +
            struggleWave

    };

}


/* =========================================================
   IMPROVED FISH DRAWING
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


    const position =
        getFishPosition();


    const distanceRatio =
        Math.max(
            0,
            Math.min(
                1,
                fishDistance /
                100
            )
        );


    const fishSize =
        Math.min(
            fishingWidth,
            fishingHeight
        ) *
        (
            0.055 +
            (
                1 -
                distanceRatio
            ) *
            0.025
        );


    const struggling =
        fishingState === "BITE" ||
        fishingState === "HOOKED" ||
        fishingState === "REELING";


    const rotation =
        struggling
            ? Math.sin(
                Date.now() *
                0.014
            ) *
            0.12
            : Math.sin(
                Date.now() *
                0.002
            ) *
            0.04;


    /*
     * Face fish toward the lure.
     */

    const facing =
        position.x <
        lureX
            ? 1
            : -1;


    fishingCtx.save();


    fishingCtx.translate(
        position.x,
        position.y
    );


    fishingCtx.rotate(
        rotation
    );


    fishingCtx.scale(
        facing,
        1
    );


    /*
     * Fish shadow.
     */

    fishingCtx.save();


    fishingCtx.globalAlpha =
        0.18;


    fishingCtx.filter =
        "blur(5px)";


    fishingCtx.drawImage(
        image,
        -fishSize / 2 +
            5,
        -fishSize / 2 +
            7,
        fishSize,
        fishSize
    );


    fishingCtx.restore();


    /*
     * Fish image.
     */

    fishingCtx.globalAlpha =
        1;


    fishingCtx.drawImage(
        image,
        -fishSize / 2,
        -fishSize / 2,
        fishSize,
        fishSize
    );


    /*
     * Small hook/line indicator
     * while hooked.
     */

    if (
        fishingState === "HOOKED" ||
        fishingState === "REELING"
    ) {

        fishingCtx.strokeStyle =
            "rgba(255,255,255,0.75)";


        fishingCtx.lineWidth =
            1.5;


        fishingCtx.beginPath();


        fishingCtx.moveTo(
            0,
            fishSize * 0.20
        );


        fishingCtx.lineTo(
            0,
            fishSize * 0.48
        );


        fishingCtx.stroke();

    }


    fishingCtx.restore();

}


/* =========================================================
   FISH BITE WARNING EFFECT
========================================================= */

function drawBiteEffect() {

    if (
        fishingState !== "BITE" ||
        !fishingCtx
    ) {

        return;

    }


    const pulse =
        (
            Math.sin(
                Date.now() *
                0.012
            ) +
            1
        ) /
        2;


    const alpha =
        0.30 +
        pulse *
        0.30;


    fishingCtx.save();


    fishingCtx.globalAlpha =
        alpha;


    fishingCtx.strokeStyle =
        "#ffffff";


    fishingCtx.lineWidth =
        4;


    fishingCtx.beginPath();


    fishingCtx.arc(
        lureX,
        lureY,
        25 +
        pulse *
        12,
        0,
        Math.PI * 2
    );


    fishingCtx.stroke();


    fishingCtx.restore();

}


/* =========================================================
   FISHING HUD OVERLAY
========================================================= */

function drawFishingCanvasHUD() {

    if (
        !fishingCtx ||
        game.phase !== 2
    ) {

        return;

    }


    /*
     * Current fish indicator.
     */

    if (
        currentFish &&
        fishingState !== "IDLE" &&
        fishingState !== "AIMING" &&
        fishingState !== "CHARGING"
    ) {

        const fishLabel = {

            goldFish:
                "GOLD FISH",

            heartFish:
                "HEART FISH",

            rainbowFish:
                "RAINBOW FISH"

        };


        const label =
            fishLabel[
                currentFish
            ] ||
            "SPECIAL FISH";


        fishingCtx.save();


        fishingCtx.font =
            "700 16px Arial";


        fishingCtx.textAlign =
            "center";


        fishingCtx.fillStyle =
            "rgba(0,0,0,0.45)";


        fishingCtx.fillText(
            label,
            fishingWidth *
            0.50,
            fishingHeight *
            0.17
        );


        fishingCtx.fillStyle =
            "#ffffff";


        fishingCtx.fillText(
            label,
            fishingWidth *
            0.50,
            fishingHeight *
            0.165
        );


        fishingCtx.restore();

    }


    /*
     * Fishing state.
     */

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
                "AIM...";

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


        default:

            stateText =
                "";

    }


    if (
        stateText
    ) {

        fishingCtx.save();


        fishingCtx.font =
            "800 18px Arial";


        fishingCtx.textAlign =
            "center";


        fishingCtx.fillStyle =
            "rgba(0,0,0,0.40)";


        fishingCtx.fillText(
            stateText,
            fishingWidth *
            0.50,
            fishingHeight *
            0.92
        );


        fishingCtx.fillStyle =
            "#ffffff";


        fishingCtx.fillText(
            stateText,
            fishingWidth *
            0.50,
            fishingHeight *
            0.915
        );


        fishingCtx.restore();

    }

}


/* =========================================================
   REPLACE FISHING SCENE RENDERER
========================================================= */

function renderCompleteFishingScene() {

    if (
        !fishingCtx ||
        !fishingCanvas
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
     * Fish first so the fishing line
     * appears naturally over the water.
     */

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

    drawFishingLureGlow();

    drawWaterRipple();

    drawBiteEffect();

    drawFishingRod();

    drawFishingCanvasHUD();


    if (
        game.phase === 2 &&
        game.fishingActive
    ) {

        requestAnimationFrame(
            renderCompleteFishingScene
        );

    }

}


/* =========================================================
   UPDATE THE ACTIVE FISHING RENDER LOOP
========================================================= */

function beginFishingRenderLoop() {

    if (
        game.phase !== 2
    ) {

        return;

    }


    renderCompleteFishingScene();

}


/* =========================================================
   CAST BUTTON VISUAL STATE
========================================================= */

function updateCastButton() {

    if (!castRod) {
        return;
    }


    switch (
        fishingState
    ) {

        case "IDLE":

            castRod.innerText =
                "🎣 CAST ROD";

            break;


        case "AIMING":

            castRod.innerText =
                "🎯 AIM";

            break;


        case "CHARGING":

            castRod.innerText =
                "⚡ CAST!";

            break;


        case "CASTING":

            castRod.innerText =
                "🌊 CASTING...";

            break;


        case "WAITING":

            castRod.innerText =
                "🎣 WAITING...";

            break;


        case "BITE":

            castRod.innerText =
                "❗ HOOK FISH!";

            break;


        case "HOOKED":

            castRod.innerText =
                "🌀 REEL IN";

            break;


        case "REELING":

            castRod.innerText =
                "🌀 REELING...";

            break;


        case "CAUGHT":

            castRod.innerText =
                "🐟 CAUGHT!";

            break;


        default:

            castRod.innerText =
                "🎣 CAST ROD";

    }

}


/* =========================================================
   ENHANCED FISHING HUD UPDATE
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
                seconds /
                60
            );


        const remainingSeconds =
            seconds %
            60;


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
            ) +
            "%";

    }


    if (reelFill) {

        reelFill.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    lineTension
                )
            ) +
            "%";

    }


    updateCastButton();

}


/* =========================================================
   FISHING TIMER WARNING
========================================================= */

function updateFishingTimerWarning() {

    if (
        !fishingTimerText
    ) {

        return;

    }


    fishingTimerText.classList.remove(
        "warning"
    );


    fishingTimerText.classList.remove(
        "danger"
    );


    if (
        game.fishingTimer <=
        20
    ) {

        fishingTimerText.classList.add(
            "danger"
        );

    } else if (
        game.fishingTimer <=
        40
    ) {

        fishingTimerText.classList.add(
            "warning"
        );

    }

}


/* =========================================================
   WRAP FISHING HUD UPDATE
========================================================= */

const originalUpdateFishingHUD =
    updateFishingHUD;


updateFishingHUD =
    function () {

        originalUpdateFishingHUD();

        updateFishingTimerWarning();

    };


/* =========================================================
   FISH SEQUENCE PREPARATION
========================================================= */

function prepareNextFish() {

    /*
     * Ensure the pool always contains fish.
     */

    if (
        fishPool.length === 0
    ) {

        shuffleFishPool();

    }


    /*
     * Select the next fish immediately.
     *
     * This guarantees that the next attempt
     * has a valid fish waiting.
     */

    currentFish =
        chooseFish();

}


/* =========================================================
   UPDATED FISHING ATTEMPT RESET
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
        0;


    lineTension =
        0;


    /*
     * IMPORTANT:
     *
     * Do not choose the fish here.
     *
     * The next fish is selected when it bites.
     * This keeps the guaranteed rotation system
     * intact.
     */

    if (
        fishPool.length === 0
    ) {

        shuffleFishPool();

    }


    currentFish =
        fishPool.length > 0
            ? fishPool[0]
            : "goldFish";


    lureX =
        0;


    lureY =
        0;


    rodAngle =
        -0.72;


    rodTargetAngle =
        -0.72;


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


    if (powerFill) {

        powerFill.style.width =
            "0%";

    }


    if (reelFill) {

        reelFill.style.width =
            "0%";

    }


    updateFishingHUD();

    beginFishingRenderLoop();

}


/* =========================================================
   UPDATED START FISHING PHASE
========================================================= */

function initialiseFishingPhaseState() {

    game.fishingTimer =
        80;


    game.fishCaught =
        0;


    game.fishingActive =
        true;


    game.missionActive =
        true;


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


    fishPool =
        [];


    shuffleFishPool();


    rodAngle =
        -0.72;


    rodTargetAngle =
        -0.72;


    rodKick =
        0;


    reelRotation =
        0;


    clearTimeout(
        fishBiteTimeout
    );


    stopFishingWinding();

    stopFishPullingSound();


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


    updateFishingHUD();

}


/* =========================================================
   AUDIO CLEANUP
========================================================= */

function stopAllFishingAudio() {

    stopFishingMusic();

    stopFishingWinding();

    stopFishPullingSound();


    try {

        fishingRodWhooshAudio.pause();

        fishingRodWhooshAudio.currentTime =
            0;

    } catch (error) {

        /* Ignore */

    }

}


/* =========================================================
   AUDIO UNLOCK
========================================================= */

function unlockFishingAudio() {

    const audioObjects = [

        fishingLakeAudio,

        fishingRodWhooshAudio,

        fishingWindingAudio,

        fishPullingAudio,

        missionCompleteAudio

    ];


    audioObjects.forEach(
        audio => {

            if (!audio) {
                return;
            }


            try {

                audio.muted =
                    true;


                const promise =
                    audio.play();


                if (
                    promise &&
                    promise.then
                ) {

                    promise
                        .then(
                            () => {

                                audio.pause();

                                audio.currentTime =
                                    0;

                                audio.muted =
                                    false;

                            }
                        )
                        .catch(
                            () => {

                                audio.muted =
                                    false;

                            }
                        );

                }

            } catch (error) {

                audio.muted =
                    false;

            }

        }
    );

}


/* =========================================================
   FIRST USER INTERACTION AUDIO UNLOCK
========================================================= */

document.addEventListener(
    "pointerdown",
    unlockFishingAudio,
    {
        once: true
    }
);


document.addEventListener(
    "keydown",
    unlockFishingAudio,
    {
        once: true
    }
);


/* =========================================================
   SAFETY: FISHING AUDIO WHEN LEAVING PHASE 2
========================================================= */

function cleanupFishingPhase() {

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


    reelActive =
        false;


    fishingState =
        "IDLE";

}


/* =========================================================
   PREVENT AUDIO CONTINUING AFTER RESET
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopAllFishingAudio();

    }
);


/* =========================================================
   MOBILE TOUCH SUPPORT
========================================================= */

if (fishingCanvas) {

    fishingCanvas.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            handleCastRod();

        },
        {
            passive: false
        }
    );

}


/* =========================================================
   MOUSE / TOUCH AIMING
========================================================= */

if (fishingCanvas) {

    fishingCanvas.addEventListener(
        "pointermove",
        event => {

            if (
                game.phase !== 2 ||
                fishingState !== "AIMING"
            ) {

                return;

            }


            const rect =
                fishingCanvas.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const normalised =
                (
                    x /
                    rect.width
                ) *
                2 -
                1;


            aimAngle =
                Math.max(
                    -1,
                    Math.min(
                        1,
                        normalised
                    )
                );


            rodTargetAngle =
                -0.72 +
                aimAngle *
                0.16;

        }
    );

}


/* =========================================================
   POWER CHARGE USING HOLD
========================================================= */

let powerHoldActive =
    false;


let powerHoldAnimation =
    null;


function beginPowerHold() {

    if (
        fishingState !==
        "AIMING"
    ) {

        return;

    }


    fishingState =
        "CHARGING";


    powerHoldActive =
        true;


    castPower =
        0;


    castDirection =
        1;


    if (castRod) {

        castRod.innerText =
            "⚡ HOLD...";

    }


    function charge() {

        if (
            !powerHoldActive ||
            fishingState !==
            "CHARGING"
        ) {

            return;

        }


        castPower +=
            2.8;


        if (
            castPower >=
            100
        ) {

            castPower =
                100;

        }


        updateFishingHUD();


        rodTargetAngle =
            -0.72 +
            (
                castPower /
                100
            ) *
            0.12;


        drawFishingScene();


        powerHoldAnimation =
            requestAnimationFrame(
                charge
            );

    }


    charge();

}


function endPowerHold() {

    if (
        fishingState !==
        "CHARGING"
    ) {

        return;

    }


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


    castLine();

}


/* =========================================================
   OPTIONAL HOLD CONTROL
========================================================= */

if (castRod) {

    castRod.addEventListener(
        "pointerdown",
        event => {

            if (
                game.phase !== 2 ||
                fishingState !==
                "AIMING"
            ) {

                return;

            }


            event.preventDefault();

            beginPowerHold();

        }
    );


    castRod.addEventListener(
        "pointerup",
        event => {

            if (
                fishingState !==
                "CHARGING"
            ) {

                return;

            }


            event.preventDefault();

            endPowerHold();

        }
    );


    castRod.addEventListener(
        "pointercancel",
        event => {

            if (
                fishingState !==
                "CHARGING"
            ) {

                return;

            }


            event.preventDefault();

            endPowerHold();

        }
    );

}


/* =========================================================
   FISHING STATE VALIDATION
========================================================= */

function validateFishingState() {

    if (
        game.phase !== 2
    ) {

        return false;

    }


    if (
        !game.fishingActive
    ) {

        return false;

    }


    if (
        game.fishingTimer <= 0
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   FISH POOL DEBUGGING
========================================================= */

function getFishingPoolStatus() {

    return {

        available:
            getAvailableFishTypes(),

        remaining:
            [...fishPool],

        current:
            currentFish,

        caught:
            game.fishCaught,

        target:
            game.targetFish

    };

}


/* =========================================================
   EXPOSE DEBUG INFORMATION
========================================================= */

window.getFishingPoolStatus =
    getFishingPoolStatus;


/* =========================================================
   FISH AUDIO EVENT MONITORING
========================================================= */

fishingWindingAudio.addEventListener(
    "ended",
    () => {

        if (
            fishingState ===
            "REELING"
        ) {

            try {

                fishingWindingAudio.currentTime =
                    0;


                fishingWindingAudio.play().catch(
                    () => {}
                );

            } catch (error) {

                /* Ignore */

            }

        }

    }
);


fishPullingAudio.addEventListener(
    "ended",
    () => {

        /*
         * The pulling sound is deliberately
         * not looped.
         *
         * It plays again only when the fish
         * performs another pull.
         */

    }
);


/* =========================================================
   FISHING AUDIO VOLUME CONTROL
========================================================= */

function setFishingAudioVolume(
    musicVolume = 0.45,
    actionVolume = 0.75
) {

    fishingLakeAudio.volume =
        Math.max(
            0,
            Math.min(
                1,
                musicVolume
            )
        );


    fishingRodWhooshAudio.volume =
        Math.max(
            0,
            Math.min(
                1,
                actionVolume
            )
        );


    fishingWindingAudio.volume =
        Math.max(
            0,
            Math.min(
                1,
                actionVolume
            )
        );


    fishPullingAudio.volume =
        Math.max(
            0,
            Math.min(
                1,
                actionVolume
            )
        );


    missionCompleteAudio.volume =
        Math.max(
            0,
            Math.min(
                1,
                actionVolume
            )
        );

}


/* =========================================================
   FINAL GAME SETTINGS
========================================================= */

setFishingAudioVolume(
    0.45,
    0.75
);


/* =========================================================
   FINAL INITIALISATION CHECK
========================================================= */

function verifyGameAssets() {

    const missingAssets = [];


    Object.keys(
        assets.items
    ).forEach(
        key => {

            const image =
                assets.items[key];


            if (
                !image ||
                image.complete &&
                image.naturalWidth === 0
            ) {

                missingAssets.push(
                    "items/" +
                    key

                );

            }

        }
    );


    Object.keys(
        assets.fish
    ).forEach(
        key => {

            const image =
                assets.fish[key];


            if (
                !image ||
                image.complete &&
                image.naturalWidth === 0
            ) {

                missingAssets.push(
                    "fish/" +
                    key

                );

            }

        }
    );


    if (
        missingAssets.length > 0
    ) {

        console.warn(
            "Some game assets may be missing:",
            missingAssets
        );

    }

}


verifyGameAssets();


/* =========================================================
   FINAL AUDIO PATH CHECK
========================================================= */

console.log(
    "Fishing audio loaded:",
    {

        background:
            "assets/audio/mindmist-fishing-on-the-lake-310740.mp3",

        casting:
            "assets/audio/spinopel-fishing-rod-whoosh-411640.mp3",

        reeling:
            "assets/audio/freesound_community-fishingrod-winding-92375.mp3",

        fishPull:
            "assets/audio/freesound_community-fly-reel-fish-pulling-saricione-94671.mp3",

        missionComplete:
            "assets/audio/mission-complete.mp3"

    }
);


/* =========================================================
   FINAL GAME SETTINGS LOG
========================================================= */

console.log(
    "Mission 02 settings:",
    {

        phase1Timer:
            "60 seconds",

        fishingTimer:
            "80 seconds",

        fishRequired:
            "6",

        fishSelection:
            "Guaranteed rotation pool",

        fishingMusic:
            "Looping",

        rodSound:
            "Cast only",

        reelSound:
            "Loops while reeling",

        fishPullSound:
            "Plays during fish pulls",

        missionCompleteSound:
            "Plays after 6/6 fish"

    }
);
/* =========================================================
   REPLAY MISSION
========================================================= */

function replayGame() {

    /*
     * Stop every active timer.
     */

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


    /*
     * Stop all fishing-related timeouts.
     */

    clearTimeout(
        fishBiteTimeout
    );


    /*
     * Stop all fishing audio.
     */

    stopAllFishingAudio();


    /*
     * Reset fishing state.
     */

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


    /*
     * Reset main game state.
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
     * Reset fishing variables.
     */

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


    /*
     * Completely rebuild fish pool
     * on a new mission.
     */

    fishPool =
        [];


    rodAngle =
        -0.72;

    rodTargetAngle =
        -0.72;

    rodKick =
        0;

    reelRotation =
        0;


    /*
     * Hide fishing messages.
     */

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


    /*
     * Reset fishing bars.
     */

    if (powerFill) {

        powerFill.style.width =
            "0%";

    }


    if (reelFill) {

        reelFill.style.width =
            "0%";

    }


    /*
     * Reset cast button.
     */

    if (castRod) {

        castRod.innerText =
            "🎣 CAST ROD";

    }


    /*
     * Reset inventory.
     */

    items =
        [];


    updateInventory();

    updateMainHUD();

    updateFishingHUD();


    /*
     * Reset terminal.
     */

    if (terminal) {

        terminal.innerHTML =
            "<p>&gt; Mission reset.</p>";

    }


    /*
     * Reset screens.
     */

    hide(
        missionComplete
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
        gameHUD
    );

    hide(
        inventoryPanel
    );


    show(
        introScreen
    );


    /*
     * Stop normal background music.
     */

    stopSound(
        bgMusic
    );


    /*
     * Reset background music position.
     */

    if (bgMusic) {

        try {

            bgMusic.currentTime =
                0;

        } catch (error) {

            /* Ignore */

        }

    }


    /*
     * Recreate terminal.
     */

    startTerminal();

}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    /*
     * Stop all timers.
     */

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


    /*
     * Stop fishing timeout.
     */

    clearTimeout(
        fishBiteTimeout
    );


    /*
     * Stop charging animation.
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
     * Stop all fishing audio.
     */

    stopAllFishingAudio();


    /*
     * Stop mission music.
     */

    stopSound(
        bgMusic
    );


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
     * Reset fishing state.
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
        0;

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
        -0.72;

    rodTargetAngle =
        -0.72;

    rodKick =
        0;

    reelRotation =
        0;


    /*
     * Reset UI.
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


    show(
        introScreen
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


    /*
     * Reset terminal.
     */

    if (terminal) {

        terminal.innerHTML =
            "<p>&gt; Mission ready.</p>";

    }


    /*
     * Reset HUD.
     */

    updateMainHUD();

    updateFishingHUD();

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


/* =========================================================
   START TERMINAL
========================================================= */

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


                const messageStep =
                    100 /
                    (
                        messages.length -
                        1
                    );


                if (
                    progress >=
                    messageIndex *
                    messageStep
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
   FISHING RENDER ENTRY
========================================================= */

function renderFishing() {

    beginFishingRenderLoop();

}


/* =========================================================
   START MISSION BUTTON
========================================================= */

if (startMissionButton) {

    startMissionButton.addEventListener(
        "click",
        () => {

            unlockFishingAudio();

            startMission();

        }
    );

}


/* =========================================================
   CONTINUE TO FISHING
========================================================= */

if (continueFishing) {

    continueFishing.addEventListener(
        "click",
        () => {

            unlockFishingAudio();

            startFishingPhase();

        }
    );

}


/* =========================================================
   REPLAY BUTTON
========================================================= */

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
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
         * SPACE
         */

        if (
            event.code ===
            "Space"
        ) {

            if (
                game.phase === 2 &&
                game.fishingActive
            ) {

                event.preventDefault();


                /*
                 * If charging with a hold,
                 * release it instead.
                 */

                if (
                    fishingState ===
                    "CHARGING"
                ) {

                    endPowerHold();

                    return;

                }


                handleCastRod();

            }

        }


        /*
         * R = REEL
         */

        if (
            event.key.toLowerCase() ===
            "r"
        ) {

            if (
                game.phase === 2 &&
                game.fishingActive
            ) {

                event.preventDefault();


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
   KEYBOARD SPACE RELEASE
========================================================= */

document.addEventListener(
    "keyup",
    event => {

        if (
            event.code !==
            "Space"
        ) {

            return;

        }


        if (
            game.phase !== 2 ||
            !game.fishingActive
        ) {

            return;

        }


        if (
            fishingState ===
            "CHARGING"
        ) {

            endPowerHold();

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
            document.hidden
        ) {

            /*
             * Stop active reel audio
             * when the browser tab is hidden.
             */

            if (
                fishingState ===
                "REELING"
            ) {

                stopFishingWinding();

            }


            stopFishPullingSound();

        } else {

            /*
             * Resume winding when the player
             * returns to the game.
             */

            if (
                fishingState ===
                "REELING"
            ) {

                startFishingWinding();

            }

        }

    }
);


/* =========================================================
   WINDOW BLUR
========================================================= */

window.addEventListener(
    "blur",
    () => {

        if (
            fishingState ===
            "REELING"
        ) {

            stopFishingWinding();

        }

    }
);


/* =========================================================
   WINDOW FOCUS
========================================================= */

window.addEventListener(
    "focus",
    () => {

        if (
            fishingState ===
            "REELING" &&
            game.fishingActive
        ) {

            startFishingWinding();

        }

    }
);


/* =========================================================
   PUBLIC MISSION API
========================================================= */

window.Mission2 = {

    game,

    startMission,

    startFishingPhase,

    replayGame,

    resetGame,

    catchFish,

    fishEscaped,

    drawFishingScene,

    renderFishing,

    getFishingPoolStatus,

    stopAllFishingAudio

};


/* =========================================================
   INITIAL GAME STATE
========================================================= */

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


/* =========================================================
   INITIAL FISHING STATE
========================================================= */

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


fishPool =
    [];


rodAngle =
    -0.72;


rodTargetAngle =
    -0.72;


rodKick =
    0;


reelRotation =
    0;


/* =========================================================
   INITIAL UI STATE
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


/* =========================================================
   INITIAL HUD UPDATE
========================================================= */

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


/* =========================================================
   FINAL SAFETY CLEANUP
========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        try {

            stopAllFishingAudio();

            stopSound(
                bgMusic
            );

        } catch (error) {

            /* Ignore cleanup errors */

        }

    }
);


/* =========================================================
   END OF GAME.JS
========================================================= */
