/* =========================================================
   HOOKED IN 30
   MISSION 03 — THE FINAL EXPEDITION
   FINAL CORRECTED GAME.JS

   MATCHES:
   - screen-mission
   - screen-game1-intro
   - screen-game1-how
   - screen-game1
   - screen-game1-result
   - screen-game1-complete
   - screen-game2
   - screen-game2-complete
   - screen-game3-intro
   - screen-game3
   - screen-game3-complete
   - screen-final
========================================================= */

"use strict";

/* =========================================================
   BASIC HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));


function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


function showScreen(id) {
    const screens = $$(".game-screen");

    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    const target = $(id);

    if (target) {
        target.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


function addXP(amount) {
    game.xp += amount;

    setText(
        "xp-value",
        game.xp
    );
}


/* =========================================================
   GLOBAL GAME STATE
========================================================= */

const game = {
    xp: 0,

    game1XP: 0,
    game2XP: 0,
    game3XP: 0,

    game1Complete: false,
    game2Complete: false,
    game3Complete: false
};


/* =========================================================
   GAME 01 — READ THE WATER
========================================================= */

const waterRounds = [

    {
        number: 1,

        title:
            "ROUND 1 — FIND THE FEEDING ZONE",

        difficulty:
            "EASY",

        correct:
            "B",

        xp:
            100,

        scanner: {
            current:
                "MODERATE",

            depth:
                "3.2 M",

            temp:
                "24°C",

            surface:
                "ACTIVE",

            bait:
                "HIGH",

            structure:
                "LOW"
        }
    },


    {
        number: 2,

        title:
            "ROUND 2 — READ THE CURRENT",

        difficulty:
            "MEDIUM",

        correct:
            "B",

        xp:
            150,

        scanner: {
            current:
                "BREAK",

            depth:
                "4.8 M",

            temp:
                "23°C",

            surface:
                "CALM",

            bait:
                "MEDIUM",

            structure:
                "HIGH"
        }
    },


    {
        number: 3,

        title:
            "ROUND 3 — THE FINAL READ",

        difficulty:
            "HARD",

        correct:
            "B",

        xp:
            300,

        scanner: {
            current:
                "SUBTLE",

            depth:
                "6.1 M",

            temp:
                "22°C",

            surface:
                "RIPPLED",

            bait:
                "MEDIUM",

            structure:
                "HIGH"
        }
    }

];


const game1 = {

    started:
        false,

    round:
        0,

    selectedChoice:
        null,

    scannerCharges:
        3,

    scanned:
        false,

    roundXP:
        [0, 0, 0],

    awaitingResult:
        false
};


/* =========================================================
   MISSION 03 → GAME 01
========================================================= */

function beginExpedition() {

    showScreen(
        "screen-game1-intro"
    );

}


/* =========================================================
   GAME 01 INTRO → HOW TO PLAY
========================================================= */

function startGame1() {

    showScreen(
        "screen-game1-how"
    );

}


/* =========================================================
   GAME 01 HOW TO PLAY → START
========================================================= */

function readyGame1() {

    game1.started =
        true;

    game1.round =
        0;

    game1.selectedChoice =
        null;

    game1.scannerCharges =
        3;

    game1.scanned =
        false;

    game1.roundXP =
        [0, 0, 0];

    game1.awaitingResult =
        false;

    renderWaterRound();

    showScreen(
        "screen-game1"
    );

}


/* =========================================================
   RENDER GAME 01 ROUND
========================================================= */

function renderWaterRound() {

    const round =
        waterRounds[
            game1.round
        ];


    if (!round) {

        finishGame1();

        return;
    }


    game1.selectedChoice =
        null;

    game1.scanned =
        false;

    game1.awaitingResult =
        false;


    setText(
        "round-number",
        round.number
    );


    setText(
        "round-difficulty",
        round.difficulty
    );


    setText(
        "round-title",
        round.title
    );


    setText(
        "cast-count",
        `CAST ${round.number} / 3`
    );


    setText(
        "cast-status",
        "Awaiting your read..."
    );


    setText(
        "scanner-current",
        "—"
    );


    setText(
        "scanner-depth",
        "—"
    );


    setText(
        "scanner-temp",
        "—"
    );


    setText(
        "scanner-surface",
        "—"
    );


    setText(
        "scanner-bait",
        "—"
    );


    setText(
        "scanner-structure",
        "—"
    );


    updateScannerCharges();


    const castButton =
        $("cast-btn");


    if (castButton) {

        castButton.disabled =
            true;

        castButton.textContent =
            "CAST HERE";
    }


    $$(".choice-btn")
        .forEach((button) => {

            button.disabled =
                false;

            button.classList.remove(
                "selected",
                "correct",
                "wrong"
            );

        });


    const scannerButton =
        $("use-scanner-btn");


    if (scannerButton) {

        scannerButton.disabled =
            false;

        scannerButton.textContent =
            "USE SCANNER — 1 CHARGE";
    }

}


/* =========================================================
   WATER CHOICE
========================================================= */

function selectWaterChoice(choice) {

    if (
        !game1.started ||
        game1.awaitingResult
    ) {
        return;
    }


    game1.selectedChoice =
        choice;


    $$(".choice-btn")
        .forEach((button) => {

            button.classList.remove(
                "selected"
            );


            if (
                button.dataset.choice ===
                choice
            ) {

                button.classList.add(
                    "selected"
                );

            }

        });


    const castButton =
        $("cast-btn");


    if (castButton) {

        castButton.disabled =
            false;

        castButton.textContent =
            `CAST ${choice} HERE`;
    }


    setText(
        "cast-status",
        `You selected ${choice}. Cast when ready.`
    );

}


/* =========================================================
   SCANNER
========================================================= */

function useScanner() {

    if (
        !game1.started ||
        game1.awaitingResult ||
        game1.scanned ||
        game1.scannerCharges <= 0
    ) {
        return;
    }


    const round =
        waterRounds[
            game1.round
        ];


    if (!round) {
        return;
    }


    game1.scannerCharges--;

    game1.scanned =
        true;


    setText(
        "scanner-current",
        round.scanner.current
    );


    setText(
        "scanner-depth",
        round.scanner.depth
    );


    setText(
        "scanner-temp",
        round.scanner.temp
    );


    setText(
        "scanner-surface",
        round.scanner.surface
    );


    setText(
        "scanner-bait",
        round.scanner.bait
    );


    setText(
        "scanner-structure",
        round.scanner.structure
    );


    updateScannerCharges();


    const scannerButton =
        $("use-scanner-btn");


    if (scannerButton) {

        scannerButton.disabled =
            true;

        scannerButton.textContent =
            "SCANNER USED THIS ROUND";
    }

}


/* =========================================================
   SCANNER CHARGES
========================================================= */

function updateScannerCharges() {

    const display =
        $("scanner-charge-display");


    if (!display) {
        return;
    }


    const charges =
        display.querySelectorAll(
            "span"
        );


    charges.forEach(
        (charge, index) => {

            charge.style.opacity =
                index <
                game1.scannerCharges
                    ? "1"
                    : "0.2";

        }
    );

}


/* =========================================================
   CAST WATER
========================================================= */

function castWater() {

    if (
        !game1.started ||
        game1.awaitingResult ||
        !game1.selectedChoice
    ) {
        return;
    }


    game1.awaitingResult =
        true;


    const round =
        waterRounds[
            game1.round
        ];


    const selected =
        game1.selectedChoice;


    const correct =
        selected ===
        round.correct;


    const earnedXP =
        correct
            ? round.xp
            : 0;


    game1.roundXP[
        game1.round
    ] = earnedXP;


    if (correct) {

        addXP(
            earnedXP
        );

    }


    $$(".choice-btn")
        .forEach((button) => {

            button.disabled =
                true;


            if (
                button.dataset.choice ===
                round.correct
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                button.dataset.choice ===
                    selected &&
                !correct
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        });


    setText(
        "cast-status",
        correct
            ? "Perfect read. You found the right spot."
            : "No bite. Read the clues and trust your instincts."
    );


    setText(
        "game1-result-icon",
        correct
            ? "🎣"
            : "🌊"
    );


    setText(
        "game1-result-title",
        correct
            ? "PERFECT READ!"
            : "NO BITE."
    );


    setText(
        "game1-result-text",
        correct
            ? "You found the right spot."
            : "Read the clues and trust your instincts."
    );


    setText(
        "game1-round-xp",
        earnedXP
    );


    const nextButton =
        $("game1-next-btn");


    if (nextButton) {

        nextButton.textContent =
            game1.round < 2
                ? "NEXT ROUND"
                : "VIEW WATER READING SCORE";

    }


    setTimeout(
        () => {

            showScreen(
                "screen-game1-result"
            );

        },
        400
    );

}


/* =========================================================
   NEXT GAME 01 ROUND
========================================================= */

function nextWaterRound() {

    if (
        !game1.awaitingResult
    ) {
        return;
    }


    if (
        game1.round < 2
    ) {

        game1.round++;

        renderWaterRound();

        showScreen(
            "screen-game1"
        );

    }

    else {

        finishGame1();

    }

}


/* =========================================================
   COMPLETE GAME 01
========================================================= */

function finishGame1() {

    game1.awaitingResult =
        false;


    game1.started =
        false;


    game.game1XP =
        game1.roundXP.reduce(
            (total, value) =>
                total + value,
            0
        );


    game.game1XP =
        Math.min(
            game.game1XP,
            550
        );


    game.game1Complete =
        true;


    setText(
        "round1-score",
        `+${game1.roundXP[0]} XP`
    );


    setText(
        "round2-score",
        `+${game1.roundXP[1]} XP`
    );


    setText(
        "round3-score",
        `+${game1.roundXP[2]} XP`
    );


    setText(
        "game1-total-xp",
        game.game1XP
    );


    showScreen(
        "screen-game1-complete"
    );

}


/* =========================================================
   GAME 02 — LEGENDARY CATCH
========================================================= */

const game2 = {

    started:
        false,

    completed:
        false,

    phase:
        0,

    lineHealth:
        100,

    stamina:
        100,

    tension:
        50,

    holding:
        false,

    timer:
        null
};


const game2Phases = [

    {
        name:
            "1. THE BITE",

        message:
            "The fish is interested... Be ready!"
    },

    {
        name:
            "2. THE RUN",

        message:
            "It's making a run! Don't panic."
    },

    {
        name:
            "3. THE FIGHT",

        message:
            "Keep the tension steady!"
    },

    {
        name:
            "4. WEAR DOWN",

        message:
            "It's getting tired. Don't force it."
    },

    {
        name:
            "5. THE LANDING",

        message:
            "One last push. Land the legendary catch!"
    }

];


/* =========================================================
   START GAME 02
========================================================= */

function startGame2() {

    clearInterval(
        game2.timer
    );


    game2.started =
        true;

    game2.completed =
        false;

    game2.phase =
        0;

    game2.lineHealth =
        100;

    game2.stamina =
        100;

    game2.tension =
        50;

    game2.holding =
        false;


    const reel =
        $("hold-reel-btn");

    const release =
        $("release-btn");


    if (reel) {
        reel.disabled =
            false;
    }


    if (release) {
        release.disabled =
            false;
    }


    updateGame2();


    showScreen(
        "screen-game2"
    );


    game2.timer =
        setInterval(
            game2Loop,
            100
        );

}


/* =========================================================
   GAME 02 LOOP
========================================================= */

function game2Loop() {

    if (
        !game2.started ||
        game2.completed
    ) {
        return;
    }


    /*
       HOLD / REEL
    */

    if (game2.holding) {

        game2.tension +=
            1.35;

        game2.stamina -=
            0.85;

    }

    else {

        /*
           Slowly return toward
           a playable tension range.
        */

        if (
            game2.tension > 50
        ) {

            game2.tension -=
                0.7;

        }

        else if (
            game2.tension < 50
        ) {

            game2.tension +=
                0.7;

        }


        /*
           Fish recovers slightly
           when not being reeled.
        */

        game2.stamina +=
            0.08;
    }


    /*
       Clamp values.
    */

    game2.tension =
        Math.max(
            0,
            Math.min(
                100,
                game2.tension
            )
        );


    game2.stamina =
        Math.max(
            0,
            Math.min(
                100,
                game2.stamina
            )
        );


    /*
       Tension management.
    */

    if (
        game2.tension >= 40 &&
        game2.tension <= 60
    ) {

        /*
           Perfect zone.
           Fish gets tired.
        */

        if (game2.holding) {

            game2.stamina -=
                0.45;

        }

    }

    else if (
        game2.tension < 20 ||
        game2.tension > 80
    ) {

        /*
           Dangerous tension.
        */

        game2.lineHealth -=
            1.0;

    }

    else {

        game2.lineHealth -=
            0.08;

    }


    /*
       Keep line health playable.
    */

    game2.lineHealth =
        Math.max(
            0,
            Math.min(
                100,
                game2.lineHealth
            )
        );


    /*
       Update phase.
    */

    const progress =
        100 -
        game2.stamina;


    let newPhase =
        0;


    if (
        progress >= 80
    ) {

        newPhase =
            4;

    }

    else if (
        progress >= 60
    ) {

        newPhase =
            3;

    }

    else if (
        progress >= 40
    ) {

        newPhase =
            2;

    }

    else if (
        progress >= 20
    ) {

        newPhase =
            1;

    }


    game2.phase =
        newPhase;


    /*
       Line snapped.
    */

    if (
        game2.lineHealth <= 0
    ) {

        loseGame2();

        return;
    }


    /*
       Legendary fish landed.
    */

    if (
        game2.stamina <= 0 &&
        game2.tension >= 30 &&
        game2.tension <= 75
    ) {

        completeGame2();

        return;
    }


    updateGame2();

}


/* =========================================================
   UPDATE GAME 02
========================================================= */

function updateGame2() {

    const phase =
        game2Phases[
            game2.phase
        ];


    if (phase) {

        setText(
            "game2-message",
            phase.message
        );

    }


    const indicator =
        $("tension-indicator");


    if (indicator) {

        indicator.style.left =
            `${game2.tension}%`;

    }


    setText(
        "line-health-value",
        `${Math.round(
            game2.lineHealth
        )}%`
    );


    const lineBar =
        $("line-health-bar");


    if (lineBar) {

        lineBar.style.width =
            `${game2.lineHealth}%`;

    }


    const staminaBar =
        $("fish-stamina-bar");


    if (staminaBar) {

        staminaBar.style.width =
            `${game2.stamina}%`;

    }


    $$(".progress-step")
        .forEach((step) => {

            const number =
                Number(
                    step.dataset.step
                );


            step.classList.remove(
                "active",
                "complete"
            );


            if (
                number - 1 <
                game2.phase
            ) {

                step.classList.add(
                    "complete"
                );

            }

            else if (
                number - 1 ===
                game2.phase
            ) {

                step.classList.add(
                    "active"
                );

            }

        });

}


/* =========================================================
   GAME 02 HOLD / REEL
========================================================= */

function holdReel() {

    if (
        !game2.started ||
        game2.completed
    ) {
        return;
    }


    game2.holding =
        true;

}


/* =========================================================
   GAME 02 RELEASE
========================================================= */

function releaseLine() {

    game2.holding =
        false;

}


/* =========================================================
   COMPLETE GAME 02
========================================================= */

function completeGame2() {

    if (
        game2.completed
    ) {
        return;
    }


    game2.completed =
        true;

    game2.started =
        false;


    clearInterval(
        game2.timer
    );


    game2.lineHealth =
        Math.max(
            1,
            game2.lineHealth
        );


    game2.stamina =
        0;


    game.game2XP =
        500;


    game.game2Complete =
        true;


    addXP(
        500
    );


    updateGame2();


    showScreen(
        "screen-game2-complete"
    );

}


/* =========================================================
   GAME 02 FAILURE
========================================================= */

function loseGame2() {

    clearInterval(
        game2.timer
    );


    game2.started =
        false;


    game2.lineHealth =
        0;


    game2.stamina =
        100;


    setText(
        "game2-message",
        "THE LINE SNAPPED! Try again."
    );


    const reel =
        $("hold-reel-btn");

    const release =
        $("release-btn");


    if (reel) {
        reel.disabled =
            true;
    }


    if (release) {
        release.disabled =
            true;
    }


    setTimeout(
        () => {

            game2.lineHealth =
                100;

            game2.stamina =
                100;

            game2.tension =
                50;

            game2.phase =
                0;

            game2.holding =
                false;

            if (reel) {
                reel.disabled =
                    false;
            }

            if (release) {
                release.disabled =
                    false;
            }

            game2.started =
                true;

            updateGame2();

            game2.timer =
                setInterval(
                    game2Loop,
                    100
                );

        },
        1200
    );

}


/* =========================================================
   GAME 03 — CAMP AFTER DARK
========================================================= */

const game3 = {

    started:
        false,

    fireOrder:
        [],

    fireCorrectOrder:
        [
            "dry-leaves",
            "kindling",
            "dry-wood",
            "fire-starter"
        ],

    campZones:
        new Set(),

    stormItems:
        new Set(),

    stormTime:
        30,

    stormTimer:
        null,

    completed:
        false
};


/* =========================================================
   SHOW GAME 03 INTRO
========================================================= */

function showGame3Intro() {

    showScreen(
        "screen-game3-intro"
    );

}


/* =========================================================
   START GAME 03
========================================================= */

function startGame3() {

    clearInterval(
        game3.stormTimer
    );


    game3.started =
        true;

    game3.fireOrder =
        [];

    game3.campZones.clear();

    game3.stormItems.clear();

    game3.stormTime =
        30;

    game3.completed =
        false;


    /*
       Reset fire items.
    */

    $$(".fire-item")
        .forEach((button) => {

            button.disabled =
                false;

            button.classList.remove(
                "selected",
                "correct",
                "wrong"
            );

        });


    /*
       Reset camp zones.
    */

    $$(".camp-zone")
        .forEach((button) => {

            button.disabled =
                false;

            button.classList.remove(
                "selected"
            );

        });


    /*
       Reset storm items.
    */

    $$(".storm-item")
        .forEach((button) => {

            button.disabled =
                false;

            button.classList.remove(
                "selected"
            );

        });


    const lightFireButton =
        $("light-fire-btn");


    const secureCampButton =
        $("secure-camp-btn");


    const surviveStormButton =
        $("survive-storm-btn");


    if (lightFireButton) {
        lightFireButton.disabled =
            true;
    }


    if (secureCampButton) {
        secureCampButton.disabled =
            true;
    }


    if (surviveStormButton) {
        surviveStormButton.disabled =
            true;
    }


    resetFireDisplay();


    setText(
        "storm-time",
        "00:30"
    );


    setText(
        "health-value",
        "100%"
    );


    setText(
        "energy-value",
        "85%"
    );


    setText(
        "preparedness-value",
        "90%"
    );


    const task1 =
        $("game3-task1");

    const task2 =
        $("game3-task2");

    const task3 =
        $("game3-task3");


    if (task1) {
        task1.classList.add(
            "active-task"
        );
    }


    if (task2) {
        task2.classList.remove(
            "active-task"
        );
    }


    if (task3) {
        task3.classList.remove(
            "active-task"
        );
    }


    showScreen(
        "screen-game3"
    );

}


/* =========================================================
   FIRE ITEM
========================================================= */

function selectFireItem(item) {

    if (
        !game3.started
    ) {
        return;
    }


    const expected =
        game3.fireCorrectOrder[
            game3.fireOrder.length
        ];


    const button =
        document.querySelector(
            `.fire-item[data-fire-item="${item}"]`
        );


    /*
       Correct item.
    */

    if (
        item === expected
    ) {

        game3.fireOrder.push(
            item
        );


        if (button) {

            button.disabled =
                true;

            button.classList.add(
                "correct"
            );

        }


        updateFireOrderDisplay();


        /*
           Fire complete.
        */

        if (
            game3.fireOrder.length ===
            4
        ) {

            const lightButton =
                $("light-fire-btn");


            if (lightButton) {

                lightButton.disabled =
                    false;

            }

        }


        return;
    }


    /*
       Wrong item.
    */

    if (button) {

        button.classList.add(
            "wrong"
        );


        setTimeout(
            () => {

                button.classList.remove(
                    "wrong"
                );

            },
            500
        );

    }

}


/* =========================================================
   FIRE ORDER DISPLAY
========================================================= */

function updateFireOrderDisplay() {

    const display =
        $("fire-order-display");


    if (!display) {
        return;
    }


    const names = {

        "dry-leaves":
            "DRY LEAVES",

        "kindling":
            "KINDLING",

        "dry-wood":
            "DRY WOOD",

        "fire-starter":
            "FIRE STARTER"

    };


    const slots =
        display.querySelectorAll(
            "span"
        );


    slots.forEach(
        (slot, index) => {

            const item =
                game3.fireOrder[
                    index
                ];


            if (item) {

                slot.textContent =
                    names[item];

            }

            else {

                slot.textContent =
                    [
                        "1st",
                        "2nd",
                        "3rd",
                        "4th"
                    ][index];

            }

        }
    );

}


/* =========================================================
   RESET FIRE DISPLAY
========================================================= */

function resetFireDisplay() {

    const display =
        $("fire-order-display");


    if (!display) {
        return;
    }


    const labels = [
        "1st",
        "2nd",
        "3rd",
        "4th"
    ];


    display
        .querySelectorAll(
            "span"
        )
        .forEach(
            (slot, index) => {

                slot.textContent =
                    labels[index];

            }
        );

}


/* =========================================================
   LIGHT FIRE
========================================================= */

function lightFire() {

    if (
        game3.fireOrder.length !==
        4
    ) {
        return;
    }


    const fireButton =
        $("light-fire-btn");


    if (fireButton) {
        fireButton.disabled =
            true;
    }


    const task1 =
        $("game3-task1");

    const task2 =
        $("game3-task2");


    if (task1) {

        task1.classList.remove(
            "active-task"
        );

    }


    if (task2) {

        task2.classList.add(
            "active-task"
        );

    }


    setText(
        "energy-value",
        "80%"
    );


    /*
       Enable camp security
       only after fire is lit.
    */

    const secureButton =
        $("secure-camp-btn");


    if (secureButton) {

        secureButton.disabled =
            false;

    }

}


/* =========================================================
   CAMP ZONE
========================================================= */

function selectCampZone(zone) {

    if (
        !game3.started
    ) {
        return;
    }


    game3.campZones.add(
        zone
    );


    const button =
        document.querySelector(
            `.camp-zone[data-zone="${zone}"]`
        );


    if (button) {

        button.classList.add(
            "selected"
        );

    }


    if (
        game3.campZones.size >=
        3
    ) {

        const secureButton =
            $("secure-camp-btn");


        if (secureButton) {

            secureButton.disabled =
                false;

        }

    }

}


/* =========================================================
   SECURE CAMP
========================================================= */

function secureCamp() {

    if (
        game3.campZones.size <
        3
    ) {
        return;
    }


    $$(".camp-zone")
        .forEach(
            (button) => {

                button.disabled =
                    true;

            }
        );


    const task2 =
        $("game3-task2");

    const task3 =
        $("game3-task3");


    if (task2) {

        task2.classList.remove(
            "active-task"
        );

    }


    if (task3) {

        task3.classList.add(
            "active-task"
        );

    }


    setText(
        "preparedness-value",
        "95%"
    );


    startStorm();

}


/* =========================================================
   START STORM
========================================================= */

function startStorm() {

    clearInterval(
        game3.stormTimer
    );


    game3.stormTime =
        30;


    game3.stormItems.clear();


    setText(
        "storm-time",
        "00:30"
    );


    $$(".storm-item")
        .forEach((button) => {

            button.disabled =
                false;

            button.classList.remove(
                "selected"
            );

        });


    const surviveButton =
        $("survive-storm-btn");


    if (surviveButton) {

        surviveButton.disabled =
            true;

    }


    game3.stormTimer =
        setInterval(
            () => {

                game3.stormTime--;


                setText(
                    "storm-time",
                    `00:${String(
                        Math.max(
                            0,
                            game3.stormTime
                        )
                    ).padStart(2, "0")}`
                );


                /*
                   All three selected?
                   Player can finish immediately.
                */

                if (
                    game3.stormItems.size >=
                    3
                ) {

                    if (surviveButton) {

                        surviveButton.disabled =
                            false;

                    }

                }


                /*
                   Timer reached zero.
                   Do not trap the player.
                */

                if (
                    game3.stormTime <=
                    0
                ) {

                    clearInterval(
                        game3.stormTimer
                    );


                    if (
                        game3.stormItems.size >=
                        3
                    ) {

                        surviveStorm();

                    }

                    else {

                        /*
                           Give player another
                           30-second chance.
                        */

                        game3.stormTime =
                            30;

                        setText(
                            "storm-time",
                            "00:30"
                        );


                        game3.stormTimer =
                            setInterval(
                                () => {

                                    startStormTick();

                                },
                                1000
                            );

                    }

                }

            },
            1000
        );

}


/*
   Separate storm tick helper.
*/

function startStormTick() {

    if (
        !game3.started
    ) {
        return;
    }


    game3.stormTime--;


    setText(
        "storm-time",
        `00:${String(
            Math.max(
                0,
                game3.stormTime
            )
        ).padStart(2, "0")}`
    );


    const surviveButton =
        $("survive-storm-btn");


    if (
        game3.stormItems.size >=
        3
    ) {

        if (surviveButton) {

            surviveButton.disabled =
                false;

        }

    }


    if (
        game3.stormTime <=
        0
    ) {

        clearInterval(
            game3.stormTimer
        );


        if (
            game3.stormItems.size >=
            3
        ) {

            surviveStorm();

        }

        else {

            game3.stormTime =
                30;

            setText(
                "storm-time",
                "00:30"
            );


            game3.stormTimer =
                setInterval(
                    startStormTick,
                    1000
                );

        }

    }

}


/* =========================================================
   STORM ITEM
========================================================= */

function selectStormItem(item) {

    if (
        !game3.started
    ) {
        return;
    }


    game3.stormItems.add(
        item
    );


    const button =
        document.querySelector(
            `.storm-item[data-storm-item="${item}"]`
        );


    if (button) {

        button.classList.add(
            "selected"
        );

        button.disabled =
            true;

    }


    if (
        game3.stormItems.size >=
        3
    ) {

        const surviveButton =
            $("survive-storm-btn");


        if (surviveButton) {

            surviveButton.disabled =
                false;

        }

    }

}


/* =========================================================
   SURVIVE STORM
========================================================= */

function surviveStorm() {

    if (
        game3.stormItems.size <
        3
    ) {
        return;
    }


    clearInterval(
        game3.stormTimer
    );


    $$(".storm-item")
        .forEach(
            (button) => {

                button.disabled =
                    true;

            }
        );


    const surviveButton =
        $("survive-storm-btn");


    if (surviveButton) {

        surviveButton.disabled =
            true;

    }


    game3.completed =
        true;

    game3.started =
        false;


    game.game3XP =
        400;


    game.game3Complete =
        true;


    addXP(
        400
    );


    setText(
        "health-value",
        "100%"
    );


    setText(
        "energy-value",
        "75%"
    );


    setText(
        "preparedness-value",
        "100%"
    );


    showScreen(
        "screen-game3-complete"
    );

}


/* =========================================================
   FINAL EXPEDITION REPORT
========================================================= */

function showFinalReport() {

    const finalXP =
        game.game1XP +
        game.game2XP +
        game.game3XP;


    setText(
        "final-xp",
        `${finalXP.toLocaleString()} XP`
    );


    showScreen(
        "screen-final"
    );

}


/* =========================================================
   RESTART GAME
========================================================= */

function restartGame() {

    clearInterval(
        game2.timer
    );


    clearInterval(
        game3.stormTimer
    );


    /*
       Global score.
    */

    game.xp =
        0;

    game.game1XP =
        0;

    game.game2XP =
        0;

    game.game3XP =
        0;


    game.game1Complete =
        false;

    game.game2Complete =
        false;

    game.game3Complete =
        false;


    /*
       Game 01.
    */

    game1.started =
        false;

    game1.round =
        0;

    game1.selectedChoice =
        null;

    game1.scannerCharges =
        3;

    game1.scanned =
        false;

    game1.roundXP =
        [0, 0, 0];

    game1.awaitingResult =
        false;


    /*
       Game 02.
    */

    game2.started =
        false;

    game2.completed =
        false;

    game2.phase =
        0;

    game2.lineHealth =
        100;

    game2.stamina =
        100;

    game2.tension =
        50;

    game2.holding =
        false;


    /*
       Game 03.
    */

    game3.started =
        false;

    game3.fireOrder =
        [];

    game3.campZones.clear();

    game3.stormItems.clear();

    game3.stormTime =
        30;

    game3.completed =
        false;


    /*
       Reset XP display.
    */

    setText(
        "xp-value",
        "0"
    );


    /*
       Reset buttons.
    */

    const beginButton =
        $("begin-expedition-btn");


    const startButton =
        $("start-game1-btn");


    const readyButton =
        $("game1-ready-btn");


    if (beginButton) {
        beginButton.disabled =
            false;
    }


    if (startButton) {
        startButton.disabled =
            false;
    }


    if (readyButton) {
        readyButton.disabled =
            false;
    }


    showScreen(
        "screen-mission"
    );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {

    /*
       MISSION INTRO
    */

    const beginButton =
        $("begin-expedition-btn");


    if (beginButton) {

        beginButton.addEventListener(
            "click",
            beginExpedition
        );

    }


    /*
       GAME 01 INTRO
    */

    const startGame1Button =
        $("start-game1-btn");


    if (startGame1Button) {

        startGame1Button.addEventListener(
            "click",
            startGame1
        );

    }


    /*
       GAME 01 HOW TO PLAY
    */

    const readyButton =
        $("game1-ready-btn");


    if (readyButton) {

        readyButton.addEventListener(
            "click",
            readyGame1
        );

    }


    /*
       SCANNER
    */

    const scannerButton =
        $("use-scanner-btn");


    if (scannerButton) {

        scannerButton.addEventListener(
            "click",
            useScanner
        );

    }


    /*
       WATER CHOICES
    */

    $$(".choice-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    selectWaterChoice(
                        button.dataset.choice
                    );

                }
            );

        });


    /*
       CAST
    */

    const castButton =
        $("cast-btn");


    if (castButton) {

        castButton.addEventListener(
            "click",
            castWater
        );

    }


    /*
       NEXT WATER ROUND
    */

    const nextWaterButton =
        $("game1-next-btn");


    if (nextWaterButton) {

        nextWaterButton.addEventListener(
            "click",
            nextWaterRound
        );

    }


    /*
       CONTINUE GAME 01 → GAME 02
    */

    const game2Button =
        $("continue-game2-btn");


    if (game2Button) {

        game2Button.addEventListener(
            "click",
            startGame2
        );

    }


    /*
       GAME 02 RELEASE
    */

    const releaseButton =
        $("release-btn");


    if (releaseButton) {

        releaseButton.addEventListener(
            "click",
            releaseLine
        );

    }


    /*
       GAME 02 HOLD / REEL
    */

    const reelButton =
        $("hold-reel-btn");


    if (reelButton) {

        reelButton.addEventListener(
            "mousedown",
            holdReel
        );


        reelButton.addEventListener(
            "mouseup",
            releaseLine
        );


        reelButton.addEventListener(
            "mouseleave",
            releaseLine
        );


        reelButton.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                holdReel();

            },
            {
                passive: false
            }
        );


        reelButton.addEventListener(
            "touchend",
            (event) => {

                event.preventDefault();

                releaseLine();

            },
            {
                passive: false
            }
        );

    }


    /*
       GAME 02 → GAME 03
    */

    const game3IntroButton =
        $("continue-game3-btn");


    if (game3IntroButton) {

        game3IntroButton.addEventListener(
            "click",
            showGame3Intro
        );

    }


    /*
       START GAME 03
    */

    const startGame3Button =
        $("start-game3-btn");


    if (startGame3Button) {

        startGame3Button.addEventListener(
            "click",
            startGame3
        );

    }


    /*
       FIRE ITEMS
    */

    $$(".fire-item")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    selectFireItem(
                        button.dataset.fireItem
                    );

                }
            );

        });


    /*
       LIGHT FIRE
    */

    const lightFireButton =
        $("light-fire-btn");


    if (lightFireButton) {

        lightFireButton.addEventListener(
            "click",
            lightFire
        );

    }


    /*
       CAMP ZONES
    */

    $$(".camp-zone")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    selectCampZone(
                        button.dataset.zone
                    );

                }
            );

        });


    /*
       SECURE CAMP
    */

    const secureCampButton =
        $("secure-camp-btn");


    if (secureCampButton) {

        secureCampButton.addEventListener(
            "click",
            secureCamp
        );

    }


    /*
       STORM ITEMS
    */

    $$(".storm-item")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    selectStormItem(
                        button.dataset.stormItem
                    );

                }
            );

        });


    /*
       SURVIVE STORM
    */

    const surviveStormButton =
        $("survive-storm-btn");


    if (surviveStormButton) {

        surviveStormButton.addEventListener(
            "click",
            surviveStorm
        );

    }


    /*
       FINAL REPORT
    */

    const finalReportButton =
        $("final-report-btn");


    if (finalReportButton) {

        finalReportButton.addEventListener(
            "click",
            showFinalReport
        );

    }


    /*
       RESTART
    */

    const restartButton =
        $("restart-btn");


    if (restartButton) {

        restartButton.addEventListener(
            "click",
            restartGame
        );

    }

}


/* =========================================================
   INITIALISE
========================================================= */

function initialiseGame() {

    /*
       Make sure all game screens
       start hidden except Mission 03.
    */

    $$(".game-screen")
        .forEach((screen) => {

            screen.classList.remove(
                "active"
            );

        });


    const missionScreen =
        $("screen-mission");


    if (missionScreen) {

        missionScreen.classList.add(
            "active"
        );

    }


    /*
       Reset XP.
    */

    setText(
        "xp-value",
        "0"
    );


    /*
       Prepare scanner.
    */

    updateScannerCharges();


    /*
       Make sure buttons are usable.
    */

    const beginButton =
        $("begin-expedition-btn");


    if (beginButton) {
        beginButton.disabled =
            false;
    }


    /*
       Reset Game 02 controls.
    */

    const reelButton =
        $("hold-reel-btn");

    const releaseButton =
        $("release-btn");


    if (reelButton) {
        reelButton.disabled =
            false;
    }


    if (releaseButton) {
        releaseButton.disabled =
            false;
    }


    /*
       Game 03 reset.
    */

    const lightFireButton =
        $("light-fire-btn");

    const secureCampButton =
        $("secure-camp-btn");

    const surviveStormButton =
        $("survive-storm-btn");


    if (lightFireButton) {
        lightFireButton.disabled =
            true;
    }


    if (secureCampButton) {
        secureCampButton.disabled =
            true;
    }


    if (surviveStormButton) {
        surviveStormButton.disabled =
            true;
    }

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            setupEventListeners();

            initialiseGame();

        }
    );

}

else {

    setupEventListeners();

    initialiseGame();

}
