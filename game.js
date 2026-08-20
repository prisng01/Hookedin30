"use strict";

/*
=========================================================
HOOKED IN 30
MISSION 3 — THE FINAL EXPEDITION

COMPLETE GAME.JS
=========================================================

IMPORTANT:
- Replace your ENTIRE existing game.js with this file.
- Asset paths below match the folders/names you showed.
- Mission 3 front page:
    assets/Mission3frontpage.png
- Game 1:
    assets/game-01/
- Game 2:
    assets/game-02/
- Game 3:
    assets/game-03/

The game creates its own screens and buttons.
=========================================================
*/


/* =========================================================
   WAIT FOR PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("game-container");

    if (!container) {
        console.error("ERROR: #game-container not found.");
        return;
    }


    /* =====================================================
       GAME STATE
    ===================================================== */

    const state = {

        totalXP: 0,

        game1XP: 0,
        game2XP: 0,
        game3XP: 0,

        game1Round: 0,
        game1Correct: 0,

        scannerCharges: 3,

        game2Phase: 0,
        game2Started: false,

        game3Started: false,

        fire: false,
        tent: false,
        gear: false,

        currentScreen: "mission"

    };


    /* =====================================================
       EXACT ASSET PATHS
    ===================================================== */

    const ASSETS = {

        /* -------------------------------------------------
           MISSION 3 FRONT PAGE
        ------------------------------------------------- */

        mission:
            "assets/Mission3frontpage.png",


        /* -------------------------------------------------
           GAME 1
        ------------------------------------------------- */

        game1Intro:
            "assets/game-01/01_intro_screen.png",

        game1How:
            "assets/game-01/02_how_to_play.png",

        game1Scanner:
            "assets/game-01/03_angler_scanner.png",

        scannerTip:
            "assets/game-01/04_scanner_tip.png",

        scannerCharge:
            "assets/game-01/scanner_charge.png",

        scannerModes:
            "assets/game-01/_modes_icons.png",

        round1: [

            "assets/game-01/07_round1_A_calm_water.png",

            "assets/game-01/08_round1_B_surface_activity.png",

            "assets/game-01/09_round1_C_strong_current.png"

        ],

        round2: [

            "assets/game-01/10_round2_A_fast_current.png",

            "assets/game-01/11_round2_B_current_break.png",

            "assets/game-01/12_round2_C_dead_water.png"

        ],

        round3: [

            "assets/game-01/13_round3_A_open_water.png",

            "assets/game-01/14_round3_B.png",

            "assets/game-01/15_round3_C_heavy_surf.png"

        ],

        correctReaction:
            "assets/game-01/16_correct_reaction.png",

        wrongReaction:
            "assets/game-01/17_wrong_reaction.png",

        completionPanel:
            "assets/game-01/18_completion_panel.png",

        masterBadge:
            "assets/game-01/19_master_angler_badge.png",

        masterMessage:
            "assets/game-01/20_master_angler_message.png",

        continueGame2:
            "assets/game-01/21_continue_game2_button.png",


        /* -------------------------------------------------
           GAME 2
        ------------------------------------------------- */

        game2Title:
            "assets/game-02/g2_title.png",

        game2How:
            "assets/game-02/g2_how_to_play.png",

        game2HUD:
            "assets/game-02/g2_hud.png",

        game2Fish:
            "assets/game-02/g2_fish_icon.png",

        greenZone:
            "assets/game-02/g2_green_zone_icon.png",

        staminaIcon:
            "assets/game-02/g2_stamina_icon.png",

        tensionIcon:
            "assets/game-02/g2_tension_icon.png",

        lineStamina:
            "assets/game-02/g2_line_stamina.png",

        tensionMeter:
            "assets/game-02/g2_tension_zone_meter.png",

        tensionNormal:
            "assets/game-02/g2_tension_bar_normal.png",

        tensionLow:
            "assets/game-02/g2_tension_bar_low_line.png",

        statusLegend:
            "assets/game-02/g2_status_legend.png",

        phase1:
            "assets/game-02/g2_phase1_bite.png",

        phase2:
            "assets/game-02/g2_phase2_run.png",

        phase3:
            "assets/game-02/g2_phase3_fight.png",

        phase4:
            "assets/game-02/g2_phase4_wear_down.png",

        phase5:
            "assets/game-02/g2_phase5_landing.png",

        reelButton:
            "assets/game-02/g2_reel_button.png",

        reelIcon:
            "assets/game-02/g2_reel_icon.png",

        releaseButton:
            "assets/game-02/g2_release_button.png",

        releaseIcon:
            "assets/game-02/g2_release_icon.png",

        landButton:
            "assets/game-02/g2_land_it_button.png",

        legendaryCatch:
            "assets/game-02/g2_legendary_catch_panel.png",

        failurePanel:
            "assets/game-02/g2_failure_panel.png",

        masterBadge2:
            "assets/game-02/g2_master_angler_badge.png",

        masterMessage2:
            "assets/game-02/g2_master_angler_message.png",

        continueGame3:
            "assets/game-02/g2_continue_game3_button.png",


        /* -------------------------------------------------
           GAME 3
        ------------------------------------------------- */

        game3Intro:
            "assets/game-03/game3_intro_page.png",

        tent:
            "assets/game-03/g3_tent.png",

        tentHotspot:
            "assets/game-03/g3_tent_hotspot_icon.png",

        tentWeather:
            "assets/game-03/g3_tent_weather_icon.png",

        tinder:
            "assets/game-03/g3_tinder.png",

        dryWood:
            "assets/game-03/g3_dry_wood.png",

        fireUnit:
            "assets/game-03/g3_fire_unit.png",

        fireStarter:
            "assets/game-03/g3_fire_starter.png",

        fireLit:
            "assets/game-03/g3_fire_lit.png",

        lightFireButton:
            "assets/game-03/g3_light_fire_button.png",

        waterBucket:
            "assets/game-03/g3_water_bucket.png",

        energyBar:
            "assets/game-03/g3_energy_bar.png",

        healthBar:
            "assets/game-03/g3_health_bar.png",

        preparednessBar:
            "assets/game-03/g3_preparedness_bar.png",

        foodSupplies:
            "assets/game-03/g3_food_supplies.png",

        foodHotspot:
            "assets/game-03/g3_food_hotspot_icon.png",

        foodWeather:
            "assets/game-03/g3_food_weather_icon.png",

        gearHotspot:
            "assets/game-03/g3_gear_hotspot_icon.png",

        fishingWeather:
            "assets/game-03/g3_fishing_weather_icon.png",

        stormWarning:
            "assets/game-03/g3_storm_warning.png",

        slot1:
            "assets/game-03/g3_slot_1st.png",

        slot2:
            "assets/game-03/g3_slot_2nd.png",

        slot3:
            "assets/game-03/g3_slot_3rd.png",

        slot4:
            "assets/game-03/g3_slot_4th.png",

        weatherTimer:
            "assets/game-03/g3_weather_timer.png",

        toFinal:
            "assets/game-03/g3_to_final_button.png"

    };


    /* =====================================================
       BASIC HELPERS
    ===================================================== */

    function clearContainer() {

        container.innerHTML = "";

    }


    function createScreen(id) {

        const screen =
            document.createElement("section");

        screen.id = id;

        screen.className = "hook-screen";

        return screen;

    }


    function showScreen(screen) {

        document
            .querySelectorAll(".hook-screen")
            .forEach((item) => {

                item.classList.remove("active");

            });

        screen.classList.add("active");

        state.currentScreen = screen.id;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function createImage(src, className = "hook-bg") {

        const img =
            document.createElement("img");

        img.src = src;

        img.className = className;

        img.alt = "";

        img.onerror = () => {

            console.warn(
                "Asset not found:",
                src
            );

        };

        return img;

    }


    function createButton(text, callback) {

        const btn =
            document.createElement("button");

        btn.type = "button";

        btn.className = "hook-button";

        btn.textContent = text;

        btn.addEventListener(
            "click",
            callback
        );

        return btn;

    }


    function addXP(amount) {

        state.totalXP += amount;

        if (state.totalXP < 0) {
            state.totalXP = 0;
        }

    }


    function createPanel() {

        const panel =
            document.createElement("div");

        panel.className = "hook-panel";

        return panel;

    }


    /* =====================================================
       MISSION 3 FRONT PAGE
    ===================================================== */

    function showMissionFront() {

        clearContainer();

        const screen =
            createScreen("mission-screen");

        const background =
            createImage(
                ASSETS.mission,
                "hook-bg"
            );

        screen.appendChild(
            background
        );


        const overlay =
            document.createElement("div");

        overlay.className =
            "hook-overlay";


        /*
         IMPORTANT:
         The actual words "BEGIN MISSION 3 →"
         are already inside your PNG.

         This transparent button sits over the
         green button area.
        */

        const begin =
            createButton(
                "BEGIN MISSION 3 →",
                showGame1Intro
            );

        overlay.appendChild(begin);

        screen.appendChild(
            overlay
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 1 INTRO
    ===================================================== */

    function showGame1Intro() {

        clearContainer();

        const screen =
            createScreen(
                "game1-intro-screen"
            );

        screen.appendChild(
            createImage(
                ASSETS.game1Intro
            )
        );


        const overlay =
            document.createElement("div");

        overlay.className =
            "hook-overlay";


        const start =
            createButton(
                "START GAME 1 →",
                showGame1How
            );

        overlay.appendChild(start);

        screen.appendChild(
            overlay
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 1 HOW TO PLAY
    ===================================================== */

    function showGame1How() {

        clearContainer();

        const screen =
            createScreen(
                "game1-how-screen"
            );

        const panel =
            createPanel();

        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 01
            </div>

            <h1>
                READ THE WATER
            </h1>

            <p>
                Study the water.
                Read the signs.
                Choose the best place to cast.
            </p>

            <div class="hook-grid">

                <div class="hook-card">
                    <strong>👁 OBSERVE</strong>
                    Look at current,
                    surface activity,
                    structure and bait.
                </div>

                <div class="hook-card">
                    <strong>📡 SCAN</strong>
                    Use your Angler Scanner
                    to reveal additional clues.
                </div>

                <div class="hook-card">
                    <strong>🎣 DECIDE</strong>
                    Choose the strongest
                    fishing position.
                </div>

            </div>

            <div class="hook-status">

                <strong>
                    MASTER ANGLER TIP
                </strong>

                <br><br>

                Fish go where food is
                and stay where they feel safe.

                <br><br>

                Look for feeding activity,
                current breaks and shelter.

            </div>

        `;


        const ready =
            createButton(
                "GOT IT — LET'S GO →",
                startGame1
            );

        panel.appendChild(
            ready
        );

        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 1 ROUNDS
    ===================================================== */

    const rounds = [

        {
            title:
                "ROUND 1 — FIND THE FEEDING ZONE",

            difficulty:
                "EASY",

            correct: 1,

            xp: 100,

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

            },

            assets:
                ASSETS.round1
        },


        {
            title:
                "ROUND 2 — READ THE CURRENT",

            difficulty:
                "MEDIUM",

            correct: 1,

            xp: 150,

            scanner: {

                current:
                    "CURRENT BREAK",

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

            },

            assets:
                ASSETS.round2
        },


        {
            title:
                "ROUND 3 — THE FINAL READ",

            difficulty:
                "HARD",

            correct: 1,

            xp: 300,

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

            },

            assets:
                ASSETS.round3
        }

    ];


    function startGame1() {

        state.game1Round = 0;

        state.game1Correct = 0;

        state.game1XP = 0;

        state.scannerCharges = 3;

        showWaterRound();

    }


    function showWaterRound() {

        const round =
            rounds[
                state.game1Round
            ];


        clearContainer();

        const screen =
            createScreen(
                "game1-round-screen"
            );

        const panel =
            createPanel();


        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 01
            </div>

            <h1>
                ANGLER SCANNER
            </h1>

            <p>
                ROUND
                <strong>
                    ${state.game1Round + 1}
                </strong>
                / 3
            </p>

            <div class="hook-scanner">

                <div class="hook-reading">
                    <span>CURRENT</span>
                    <strong id="read-current">—</strong>
                </div>

                <div class="hook-reading">
                    <span>DEPTH</span>
                    <strong id="read-depth">—</strong>
                </div>

                <div class="hook-reading">
                    <span>WATER TEMP</span>
                    <strong id="read-temp">—</strong>
                </div>

                <div class="hook-reading">
                    <span>SURFACE</span>
                    <strong id="read-surface">—</strong>
                </div>

                <div class="hook-reading">
                    <span>BAIT</span>
                    <strong id="read-bait">—</strong>
                </div>

                <div class="hook-reading">
                    <span>STRUCTURE</span>
                    <strong id="read-structure">—</strong>
                </div>

            </div>


            <div class="hook-status">

                <strong>
                    SCANNER CHARGES:
                    <span id="charges">
                        ${state.scannerCharges}
                    </span>
                </strong>

            </div>


            <button
                id="scanner-button"
                class="hook-big-button"
                type="button"
            >
                USE SCANNER — 1 CHARGE
            </button>


            <h2>
                ${round.title}
            </h2>

            <p>
                DIFFICULTY:
                <strong>
                    ${round.difficulty}
                </strong>
            </p>

            <p>
                WHERE WOULD YOU CAST?
            </p>


            <div
                id="choices"
                class="hook-choices"
            ></div>


            <div
                id="round-message"
                class="hook-status"
            >
                Study the clues before choosing.
            </div>

        `;


        const choices =
            panel.querySelector(
                "#choices"
            );


        round.assets.forEach(
            (src, index) => {

                const choice =
                    document.createElement(
                        "button"
                    );

                choice.type =
                    "button";

                choice.className =
                    "hook-choice";


                const img =
                    createImage(
                        src,
                        ""
                    );

                choice.appendChild(
                    img
                );


                const label =
                    document.createElement(
                        "span"
                    );

                label.textContent =
                    `CAST SPOT ${
                        String.fromCharCode(
                            65 + index
                        )
                    }`;

                choice.appendChild(
                    label
                );


                choice.addEventListener(
                    "click",
                    () => {

                        panel
                            .querySelectorAll(
                                ".hook-choice"
                            )
                            .forEach(
                                (item) => {

                                    item.classList.remove(
                                        "selected"
                                    );

                                }
                            );


                        choice.classList.add(
                            "selected"
                        );


                        const oldCast =
                            panel.querySelector(
                                "#cast-button"
                            );

                        if (oldCast) {
                            oldCast.remove();
                        }


                        const cast =
                            document.createElement(
                                "button"
                            );

                        cast.type =
                            "button";

                        cast.id =
                            "cast-button";

                        cast.className =
                            "hook-big-button";

                        cast.textContent =
                            "🎣 CAST HERE";


                        cast.addEventListener(
                            "click",
                            () => {

                                resolveWaterRound(
                                    index,
                                    panel
                                );

                                cast.disabled =
                                    true;

                            }
                        );


                        panel
                            .querySelector(
                                "#round-message"
                            )
                            .after(cast);

                    }
                );


                choices.appendChild(
                    choice
                );

            }
        );


        panel
            .querySelector(
                "#scanner-button"
            )
            .addEventListener(
                "click",
                () => {

                    if (
                        state.scannerCharges <= 0
                    ) {
                        return;
                    }


                    state.scannerCharges--;


                    panel
                        .querySelector(
                            "#charges"
                        )
                        .textContent =
                        state.scannerCharges;


                    const s =
                        round.scanner;


                    panel
                        .querySelector(
                            "#read-current"
                        )
                        .textContent =
                        s.current;

                    panel
                        .querySelector(
                            "#read-depth"
                        )
                        .textContent =
                        s.depth;

                    panel
                        .querySelector(
                            "#read-temp"
                        )
                        .textContent =
                        s.temp;

                    panel
                        .querySelector(
                            "#read-surface"
                        )
                        .textContent =
                        s.surface;

                    panel
                        .querySelector(
                            "#read-bait"
                        )
                        .textContent =
                        s.bait;

                    panel
                        .querySelector(
                            "#read-structure"
                        )
                        .textContent =
                        s.structure;


                    if (
                        state.scannerCharges === 0
                    ) {

                        panel
                            .querySelector(
                                "#scanner-button"
                            )
                            .disabled =
                            true;

                    }

                }
            );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       RESOLVE GAME 1 ROUND
    ===================================================== */

    function resolveWaterRound(
        selected,
        panel
    ) {

        const round =
            rounds[
                state.game1Round
            ];


        const message =
            panel.querySelector(
                "#round-message"
            );


        if (
            selected === round.correct
        ) {

            state.game1Correct++;

            state.game1XP +=
                round.xp;

            addXP(
                round.xp
            );


            message.innerHTML = `

                <img
                    src="${ASSETS.correctReaction}"
                    class="hook-result-image"
                    alt=""
                >

                <span class="hook-success">
                    PERFECT READ!
                </span>

                <br>

                You found the right spot.

                <br>

                <strong>
                    +${round.xp} XP
                </strong>

            `;

        } else {

            message.innerHTML = `

                <img
                    src="${ASSETS.wrongReaction}"
                    class="hook-result-image"
                    alt=""
                >

                <span class="hook-danger">
                    NO BITE.
                </span>

                <br>

                That spot didn't hold fish today.

                <br>

                <strong>
                    +0 XP
                </strong>

            `;

        }


        if (
            state.game1Round < 2
        ) {

            const next =
                createButton(
                    "NEXT ROUND →",
                    () => {

                        state.game1Round++;

                        showWaterRound();

                    }
                );

            panel.appendChild(
                next
            );

        } else {

            const finish =
                createButton(
                    "VIEW GAME 1 RESULT →",
                    showGame1Complete
                );

            panel.appendChild(
                finish
            );

        }

    }


    /* =====================================================
       GAME 1 COMPLETE
    ===================================================== */

    function showGame1Complete() {

        clearContainer();

        const screen =
            createScreen(
                "game1-complete-screen"
            );

        const panel =
            createPanel();


        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 01 COMPLETE
            </div>

            <h1>
                WATER READING COMPLETE!
            </h1>


            <img
                src="${ASSETS.completionPanel}"
                class="hook-result-image"
                alt=""
            >


            <div class="hook-grid">

                <div class="hook-card">
                    <strong>ROUND 1</strong>
                    ${
                        state.game1Correct >= 1
                        ? "✓ PERFECT"
                        : "NO BITE"
                    }
                    <br>
                    +100 XP
                </div>

                <div class="hook-card">
                    <strong>ROUND 2</strong>
                    ${
                        state.game1Correct >= 2
                        ? "✓ PERFECT"
                        : "NO BITE"
                    }
                    <br>
                    +150 XP
                </div>

                <div class="hook-card">
                    <strong>ROUND 3</strong>
                    ${
                        state.game1Correct >= 3
                        ? "✓ PERFECT"
                        : "NO BITE"
                    }
                    <br>
                    +300 XP
                </div>

            </div>


            <div class="hook-xp">
                ${state.game1XP} XP
            </div>


            <p>
                ${
                    state.game1Correct === 3
                    ? "MASTER ANGLER INSTINCTS: CONFIRMED."
                    : "GOOD READ. THE EXPEDITION CONTINUES."
                }
            </p>

        `;


        const badge =
            createImage(
                ASSETS.masterBadge,
                "hook-result-image"
            );

        panel.appendChild(
            badge
        );


        const next =
            createButton(
                "CONTINUE TO GAME 2 →",
                showGame2
            );

        panel.appendChild(
            next
        );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 2 INTRO / TITLE
    ===================================================== */

    function showGame2() {

        clearContainer();

        state.game2Phase = 0;

        state.game2Started = false;


        const screen =
            createScreen(
                "game2-screen"
            );

        const panel =
            createPanel();


        const titleImage =
            createImage(
                ASSETS.game2Title,
                "hook-game-image"
            );

        panel.appendChild(
            titleImage
        );


        panel.innerHTML += `

            <div class="hook-game-label">
                MISSION 03 • GAME 02
            </div>

            <h1>
                THE FINAL CATCH
            </h1>

            <p>
                ONE LEGENDARY FISH.
                ONE FINAL FIGHT.
            </p>

            <div class="hook-card">

                <strong>
                    LEGENDARY TARGET
                </strong>

                <br><br>

                🐟 SPECIES: UNKNOWN

                <br>

                SIZE: HUGE

                <br>

                DIFFICULTY: ★★★★★

                <br>

                WEIGHT: 30.0 KG

            </div>

            <p>
                Manage the line.
                Control the tension.
                Wear the fish down.
            </p>

        `;


        const start =
            createButton(
                "🎣 CAST FOR THE LEGENDARY FISH",
                startGame2
            );

        panel.appendChild(
            start
        );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 2 — FISH BATTLE
    ===================================================== */

    function startGame2() {

        if (state.game2Started) {
            return;
        }

        state.game2Started = true;

        state.game2Phase = 1;

        showGame2Battle();

    }


    const game2Phases = [

        {
            image: ASSETS.phase1,
            title: "PHASE 1 — THE BITE",
            instruction:
                "The fish has taken the bait. SET THE HOOK!"
        },

        {
            image: ASSETS.phase2,
            title: "PHASE 2 — THE RUN",
            instruction:
                "The fish is running! MANAGE THE LINE!"
        },

        {
            image: ASSETS.phase3,
            title: "PHASE 3 — THE FIGHT",
            instruction:
                "Keep the tension steady!"
        },

        {
            image: ASSETS.phase4,
            title: "PHASE 4 — WEAR IT DOWN",
            instruction:
                "The fish is tiring. Stay patient!"
        },

        {
            image: ASSETS.phase5,
            title: "PHASE 5 — LANDING",
            instruction:
                "The fish is ready. LAND IT!"
        }

    ];


    function showGame2Battle() {

        clearContainer();

        const screen =
            createScreen(
                "game2-battle-screen"
            );

        const panel =
            createPanel();


        const phase =
            game2Phases[
                state.game2Phase - 1
            ];


        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 02
            </div>

            <h1>
                ${phase.title}
            </h1>

            <img
                src="${phase.image}"
                class="hook-game-image"
                alt=""
            >

            <div class="hook-progress">
                <div
                    id="fish-progress"
                    class="hook-progress-fill"
                ></div>
            </div>

            <p id="fish-message">
                ${phase.instruction}
            </p>

            <div class="hook-card">

                <strong>
                    FISH STATUS
                </strong>

                <br><br>

                LINE:
                <span id="line-value">
                    100%
                </span>

                <br>

                STAMINA:
                <span id="stamina-value">
                    100%
                </span>

                <br>

                TENSION:
                <span id="tension-value">
                    GREEN ZONE
                </span>

            </div>

        `;


        const action =
            createButton(
                state.game2Phase === 5
                    ? "LAND THE FISH →"
                    : "MANAGE THE FIGHT →",
                advanceGame2
            );


        panel.appendChild(
            action
        );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    function advanceGame2() {

        if (
            state.game2Phase < 5
        ) {

            state.game2Phase++;

            showGame2Battle();

            return;

        }


        completeGame2();

    }


    /* =====================================================
       GAME 2 COMPLETE
    ===================================================== */

    function completeGame2() {

        state.game2XP = 500;

        addXP(500);


        clearContainer();

        const screen =
            createScreen(
                "game2-complete-screen"
            );

        const panel =
            createPanel();


        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 02 — COMPLETE
            </div>

            <h1>
                LEGENDARY CATCH!
            </h1>


            <img
                src="${ASSETS.legendaryCatch}"
                class="hook-result-image"
                alt=""
            >


            <div class="hook-grid">

                <div class="hook-card">
                    <strong>WEIGHT</strong>
                    30.0 KG
                </div>

                <div class="hook-card">
                    <strong>LENGTH</strong>
                    112 CM
                </div>

                <div class="hook-card">
                    <strong>XP</strong>
                    +500 XP
                </div>

            </div>


            <p>
                ✓ Fish hooked
                <br>
                ✓ Tension managed
                <br>
                ✓ Fish worn down
                <br>
                ✓ Catch landed
            </p>


            <div class="hook-xp">
                +500 XP
            </div>


            <p class="hook-success">
                MASTER ANGLER STATUS MAINTAINED.
            </p>

        `;


        panel.appendChild(
            createImage(
                ASSETS.masterBadge2,
                "hook-result-image"
            )
        );


        panel.appendChild(
            createButton(
                "CONTINUE TO GAME 3 →",
                showGame3Intro
            )
        );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 3 INTRO
    ===================================================== */

    function showGame3Intro() {

        clearContainer();

        const screen =
            createScreen(
                "game3-intro-screen"
            );


        screen.appendChild(
            createImage(
                ASSETS.game3Intro
            )
        );


        const overlay =
            document.createElement("div");

        overlay.className =
            "hook-overlay";


        const start =
            createButton(
                "START GAME 3 →",
                startGame3
            );


        overlay.appendChild(
            start
        );

        screen.appendChild(
            overlay
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 3 — CAMP AFTER DARK
    ===================================================== */

    function startGame3() {

        state.game3Started = true;

        state.fire = false;

        state.tent = false;

        state.gear = false;


        clearContainer();


        const screen =
            createScreen(
                "game3-screen"
            );

        const panel =
            createPanel();


        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 03
            </div>

            <h1>
                CAMP AFTER DARK
            </h1>

            <p>
                The legendary catch is secured.
                Now survive the night.
            </p>


            <div class="hook-grid">

                <div class="hook-card">

                    <strong>
                        🔥 TASK 1
                    </strong>

                    <br><br>

                    Build the fire.

                    <br><br>

                    <button
                        id="fire-btn"
                        class="hook-big-button"
                        type="button"
                    >
                        LIGHT FIRE
                    </button>

                </div>


                <div class="hook-card">

                    <strong>
                        🏕️ TASK 2
                    </strong>

                    <br><br>

                    Secure the campsite.

                    <br><br>

                    <button
                        id="tent-btn"
                        class="hook-big-button"
                        type="button"
                        disabled
                    >
                        SECURE TENT
                    </button>

                </div>


                <div class="hook-card">

                    <strong>
                        🎒 TASK 3
                    </strong>

                    <br><br>

                    Protect the fishing gear.

                    <br><br>

                    <button
                        id="gear-btn"
                        class="hook-big-button"
                        type="button"
                        disabled
                    >
                        SECURE GEAR
                    </button>

                </div>

            </div>


            <div class="hook-status">

                <strong>
                    CAMP STATUS
                </strong>

                <br><br>

                🔥 Fire:
                <span id="fire-status">
                    NOT LIT
                </span>

                <br>

                🏕️ Tent:
                <span id="tent-status">
                    NOT SECURED
                </span>

                <br>

                🎒 Gear:
                <span id="gear-status">
                    NOT SECURED
                </span>

            </div>


            <div
                id="camp-message"
                class="hook-status"
            >
                Prepare the campsite before
                the weather changes.
            </div>

        `;


        /* -----------------------------------------------
           FIRE
        ----------------------------------------------- */

        panel
            .querySelector("#fire-btn")
            .addEventListener(
                "click",
                () => {

                    state.fire = true;


                    panel
                        .querySelector(
                            "#fire-status"
                        )
                        .textContent =
                        "SECURED ✓";


                    panel
                        .querySelector(
                            "#fire-btn"
                        )
                        .disabled =
                        true;


                    panel
                        .querySelector(
                            "#tent-btn"
                        )
                        .disabled =
                        false;


                    panel
                        .querySelector(
                            "#camp-message"
                        )
                        .innerHTML = `

                            <img
                                src="${ASSETS.fireLit}"
                                class="hook-small-image"
                                alt=""
                            >

                            Fire started.

                            <br><br>

                            Now secure the tent.

                        `;

                }
            );


        /* -----------------------------------------------
           TENT
        ----------------------------------------------- */

        panel
            .querySelector("#tent-btn")
            .addEventListener(
                "click",
                () => {

                    state.tent = true;


                    panel
                        .querySelector(
                            "#tent-status"
                        )
                        .textContent =
                        "SECURED ✓";


                    panel
                        .querySelector(
                            "#tent-btn"
                        )
                        .disabled =
                        true;


                    panel
                        .querySelector(
                            "#gear-btn"
                        )
                        .disabled =
                        false;


                    panel
                        .querySelector(
                            "#camp-message"
                        )
                        .innerHTML = `

                            <img
                                src="${ASSETS.tent}"
                                class="hook-small-image"
                                alt=""
                            >

                            Tent secured.

                            <br><br>

                            Protect the fishing gear.

                        `;

                }
            );


        /* -----------------------------------------------
           GEAR
        ----------------------------------------------- */

        panel
            .querySelector("#gear-btn")
            .addEventListener(
                "click",
                () => {

                    state.gear = true;


                    panel
                        .querySelector(
                            "#gear-status"
                        )
                        .textContent =
                        "SECURED ✓";


                    panel
                        .querySelector(
                            "#gear-btn"
                        )
                        .disabled =
                        true;


                    panel
                        .querySelector(
                            "#camp-message"
                        )
                        .innerHTML = `

                            <img
                                src="${ASSETS.stormWarning}"
                                class="hook-small-image"
                                alt=""
                            >

                            <span class="hook-success">
                                STORM APPROACHING!
                            </span>

                            <br><br>

                            Your camp is prepared.

                        `;


                    setTimeout(
                        completeGame3,
                        1800
                    );

                }
            );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       GAME 3 COMPLETE
    ===================================================== */

    function completeGame3() {

        state.game3XP = 400;

        addXP(400);


        clearContainer();

        const screen =
            createScreen(
                "game3-complete-screen"
            );

        const panel =
            createPanel();


        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 03 COMPLETE
            </div>

            <h1>
                CAMP SECURED!
            </h1>


            <div class="hook-grid">

                <div class="hook-card">
                    <strong>
                        🔥 FIRE STARTED
                    </strong>

                    <br><br>

                    ✓ COMPLETE
                </div>


                <div class="hook-card">
                    <strong>
                        🏕️ TENT SECURED
                    </strong>

                    <br><br>

                    ✓ COMPLETE
                </div>


                <div class="hook-card">
                    <strong>
                        🌧️ STORM SURVIVED
                    </strong>

                    <br><br>

                    ✓ COMPLETE
                </div>

            </div>


            <p>
                The storm came.
                You were ready.
            </p>

            <p>
                <strong>
                    Night survived.
                </strong>
            </p>


            <div class="hook-xp">
                +400 XP
            </div>


            <p class="hook-success">
                CAMPING CLEARANCE: APPROVED ✓
            </p>

        `;


        panel.appendChild(
            createButton(
                "🏆 VIEW FINAL EXPEDITION REPORT",
                showFinalReport
            )
        );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       FINAL REPORT
    ===================================================== */

    function showFinalReport() {

        clearContainer();

        const screen =
            createScreen(
                "final-report-screen"
            );

        const panel =
            createPanel();


        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03
            </div>

            <h1>
                FINAL EXPEDITION REPORT
            </h1>

            <h2>
                THE FINAL EXPEDITION
            </h2>


            <div class="hook-grid">

                <div class="hook-card">

                    <strong>
                        🌊 READ THE WATER
                    </strong>

                    <br><br>

                    ${state.game1XP} XP

                </div>


                <div class="hook-card">

                    <strong>
                        🎣 THE FINAL CATCH
                    </strong>

                    <br><br>

                    ${state.game2XP} XP

                </div>


                <div class="hook-card">

                    <strong>
                        🏕️ CAMP AFTER DARK
                    </strong>

                    <br><br>

                    ${state.game3XP} XP

                </div>

            </div>


            <p>
                TOTAL SCORE
            </p>


            <div class="hook-final-score">
                ${state.totalXP} XP
            </div>


            <div class="hook-rank">
                🏆 MASTER ANGLER
            </div>


            <h2>
                LEVEL 30
            </h2>


            <div class="hook-status">

                <strong>
                    ACHIEVEMENTS UNLOCKED
                </strong>

                <br><br>

                🎣 Water Reader ✓
                <br>

                🐟 Legendary Catch ✓
                <br>

                🔥 Firestarter ✓
                <br>

                🏕️ Camp Master ✓
                <br>

                🌧️ Storm Survivor ✓
                <br>

                🎂 Level 30 ✓

            </div>


            <div class="hook-status">

                <strong>
                    MASTER ANGLER,
                </strong>

                <br><br>

                You started this adventure
                with a simple mission.

                <br><br>

                Find the gear.
                <br>

                Read the water.
                <br>

                Catch the fish.
                <br>

                Survive the night.

                <br><br>

                And somehow...

                <br><br>

                <strong>
                    YOU MADE IT ALL THE WAY TO LEVEL 30.
                </strong>

                <br><br>

                Your training is complete.
                <br>

                Your rank has been earned.

                <br><br>

                Now there's only one thing left...

                <br><br>

                <strong>
                    TAKE THIS ADVENTURE OFF THE SCREEN.
                </strong>

                <br><br>

                🏕️ REAL-LIFE EXPEDITION

                <br><br>

                <strong>
                    21 — 22 AUGUST 2026
                </strong>

                <br>

                EAST COAST PARK

                <br><br>

                Pack your bags,
                birthday boy. 🤭❤️

                <br><br>

                The final adventure starts soon.

            </div>

        `;


        panel.appendChild(
            createButton(
                "PLAY MISSION 3 AGAIN",
                showMissionFront
            )
        );


        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);

    }


    /* =====================================================
       START THE WHOLE MISSION
    ===================================================== */

    showMissionFront();

});
