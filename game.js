/* =========================================================
   HOOKED IN 30
   MISSION 3 — COMPLETE GAME.JS

   FLOW:
   MISSION 3 FRONT PAGE
          ↓
   BEGIN MISSION 3
          ↓
        GAME 1
          ↓
     GAME 1 COMPLETE
          ↓
        GAME 2
          ↓
   LEGENDARY CATCH
          ↓
        GAME 3
          ↓
    CAMP COMPLETE
          ↓
   FINAL EXPEDITION REPORT
          ↓
     TAP TO REVEAL
          ↓
   BIRTHDAY ADVENTURE
========================================================= */


document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       HTML ELEMENTS
    ===================================================== */

    const mission3Intro =
        document.getElementById("mission3-intro");

    const game1 =
        document.getElementById("game1");

    const game2 =
        document.getElementById("game2");

    const game3 =
        document.getElementById("game3");

    const beginMission3 =
        document.getElementById("beginMission3");


    /* =====================================================
       CHECK HTML
    ===================================================== */

    if (!mission3Intro) {
        console.error("Missing #mission3-intro");
    }

    if (!game1) {
        console.error("Missing #game1");
    }

    if (!game2) {
        console.error("Missing #game2");
    }

    if (!game3) {
        console.error("Missing #game3");
    }

    if (!beginMission3) {
        console.error("Missing #beginMission3");
    }


    /* =====================================================
       SCREEN CONTROL
    ===================================================== */

    function hideAllScreens() {

        if (mission3Intro) {
            mission3Intro.classList.add("hidden");
        }

        if (game1) {
            game1.classList.add("hidden");
        }

        if (game2) {
            game2.classList.add("hidden");
        }

        if (game3) {
            game3.classList.add("hidden");
        }
    }


    function showScreen(screen) {

        hideAllScreens();

        if (screen) {
            screen.classList.remove("hidden");
        }

        window.scrollTo(0, 0);
    }


    /* =====================================================
       GAME VARIABLES
    ===================================================== */

    let game1Round = 0;
    let game1Score = 0;

    let game2Phase = 0;

    let game3Step = 0;


    /* =====================================================
       GAME 1 ASSETS
    ===================================================== */

    const GAME1 = {

        intro:
            "assets/game-01/01_intro_screen.png",

        howToPlay:
            "assets/game-01/02_how_to_play.png",

        scanner:
            "assets/game-01/03_angler_scanner.png",

        scannerTip:
            "assets/game-01/04_scanner_tip.png",

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
            null,
            "assets/game-01/15_round3_C_heavy_surf.png"
        ],

        correct:
            "assets/game-01/16_correct_reaction.png",

        wrong:
            "assets/game-01/17_wrong_reaction.png",

        completion:
            "assets/game-01/18_completion_panel.png",

        badge:
            "assets/game-01/19_master_angler_badge.png",

        message:
            "assets/game-01/20_master_angler_message.png",

        continueGame2:
            "assets/game-01/21_continue_game2_button.png"
    };


    /* =====================================================
       GAME 2 ASSETS
    ===================================================== */

    const GAME2 = {

        title:
            "assets/game-02/g2_title.png",

        howToPlay:
            "assets/game-02/g2_how_to_play.png",

        hud:
            "assets/game-02/g2_hud.png",

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

        staminaIcon:
            "assets/game-02/g2_stamina_icon.png",

        statusLegend:
            "assets/game-02/g2_status_legend.png",

        tensionLow:
            "assets/game-02/g2_tension_bar_low_line.png",

        tensionNormal:
            "assets/game-02/g2_tension_bar_normal.png",

        tensionIcon:
            "assets/game-02/g2_tension_icon.png",

        tensionMeter:
            "assets/game-02/g2_tension_zone_meter.png",

        greenZone:
            "assets/game-02/g2_green_zone_icon.png",

        fishIcon:
            "assets/game-02/g2_fish_icon.png",

        lineStamina:
            "assets/game-02/g2_line_stamina.png",

        landButton:
            "assets/game-02/g2_land_it_button.png",

        legendaryCatch:
            "assets/game-02/g2_legendary_catch_panel.png",

        failure:
            "assets/game-02/g2_failure_panel.png",

        masterBadge:
            "assets/game-02/g2_master_angler_badge.png",

        masterMessage:
            "assets/game-02/g2_master_angler_message.png",

        continueGame3:
            "assets/game-02/g2_continue_game3_button.png"
    };


    /* =====================================================
       GAME 3 ASSETS
    ===================================================== */

    const GAME3 = {

        intro:
            "assets/game-03/game3_intro_page.png",

        campComplete:
            "assets/game-03/g3_camp_complete.png",

        dryWood:
            "assets/game-03/g3_dry_wood.png",

        energyBar:
            "assets/game-03/g3_energy_bar.png",

        fireLit:
            "assets/game-03/g3_fire_lit.png",

        fireStarter:
            "assets/game-03/g3_fire_starter.png",

        fireUnlit:
            "assets/game-03/g3_fire_unlit.png",

        fishingWeather:
            "assets/game-03/g3_fishing_weather_icon.png",

        foodHotspot:
            "assets/game-03/g3_food_hotspot_icon.png",

        foodSupplies:
            "assets/game-03/g3_food_supplies.png",

        foodWeather:
            "assets/game-03/g3_food_weather_icon.png",

        gearHotspot:
            "assets/game-03/g3_gear_hotspot_icon.png",

        healthBar:
            "assets/game-03/g3_health_bar.png",

        kindling:
            "assets/game-03/g3_kindling.png",

        lightFire:
            "assets/game-03/g3_light_fire_button.png",

        preparednessBar:
            "assets/game-03/g3_preparedness_bar.png",

        slot1:
            "assets/game-03/g3_slot_1st.png",

        slot2:
            "assets/game-03/g3_slot_2nd.png",

        slot3:
            "assets/game-03/g3_slot_3rd.png",

        slot4:
            "assets/game-03/g3_slot_4th.png",

        stormWarning:
            "assets/game-03/g3_storm_warning.png",

        tent:
            "assets/game-03/g3_tent.png",

        tentHotspot:
            "assets/game-03/g3_tent_hotspot_icon.png",

        tentWeather:
            "assets/game-03/g3_tent_weather_icon.png",

        tinder:
            "assets/game-03/g3_tinder.png",

        finalButton:
            "assets/game-03/g3_to_final_button.png",

        waterBucket:
            "assets/game-03/g3_water_bucket.png",

        weatherTimer:
            "assets/game-03/g3_weather_timer.png"
    };


    /* =====================================================
       IMAGE CREATOR
    ===================================================== */

    function createImage(src, alt) {

        const img =
            document.createElement("img");

        img.className =
            "game-image";

        img.alt =
            alt || "";

        img.draggable =
            false;

        if (src) {

            img.src =
                src;

            img.onerror =
                function () {

                    console.warn(
                        "Asset not found:",
                        src
                    );

                    img.style.display =
                        "none";
                };
        }

        return img;
    }


    /* =====================================================
       BUTTON CREATOR
    ===================================================== */

    function createButton(
        text,
        callback
    ) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "game-button";

        button.textContent =
            text;

        button.addEventListener(
            "click",
            callback
        );

        return button;
    }


    /* =====================================================
       IMAGE BUTTON
    ===================================================== */

    function createImageButton(
        src,
        alt,
        callback
    ) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "image-button";

        const img =
            createImage(
                src,
                alt
            );

        button.appendChild(
            img
        );

        button.addEventListener(
            "click",
            callback
        );

        return button;
    }


    /* =====================================================
       CLEAR SCREEN
    ===================================================== */

    function clearScreen(screen) {

        if (screen) {
            screen.innerHTML = "";
        }
    }


    /* =====================================================
       ADD BUTTON
    ===================================================== */

    function addButton(
        screen,
        text,
        callback
    ) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "button-area";

        wrapper.appendChild(
            createButton(
                text,
                callback
            )
        );

        screen.appendChild(
            wrapper
        );
    }


    /* =====================================================
       MISSION 3 FRONT PAGE → GAME 1
    ===================================================== */

    function startMission3() {

        game1Round =
            0;

        game1Score =
            0;

        showGame1Intro();
    }


    /* =====================================================
       BEGIN MISSION 3
    ===================================================== */

    if (beginMission3) {

        beginMission3.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                console.log(
                    "BEGIN MISSION 3 clicked"
                );

                startMission3();
            }
        );
    }


    /* =====================================================
       GAME 1 INTRO
    ===================================================== */

    function showGame1Intro() {

        clearScreen(game1);

        game1.appendChild(
            createImage(
                GAME1.intro,
                "Game 1 Introduction"
            )
        );

        addButton(
            game1,
            "CONTINUE →",
            showGame1HowTo
        );

        showScreen(game1);
    }


    /* =====================================================
       GAME 1 HOW TO PLAY
    ===================================================== */

    function showGame1HowTo() {

        clearScreen(game1);

        game1.appendChild(
            createImage(
                GAME1.howToPlay,
                "How to Play"
            )
        );

        addButton(
            game1,
            "CONTINUE →",
            showGame1Scanner
        );

        showScreen(game1);
    }


    /* =====================================================
       GAME 1 SCANNER
    ===================================================== */

    function showGame1Scanner() {

        clearScreen(game1);

        game1.appendChild(
            createImage(
                GAME1.scanner,
                "Angler Scanner"
            )
        );

        addButton(
            game1,
            "SCAN THE WATER →",
            showGame1ScannerTip
        );

        showScreen(game1);
    }


    /* =====================================================
       GAME 1 SCANNER TIP
    ===================================================== */

    function showGame1ScannerTip() {

        clearScreen(game1);

        game1.appendChild(
            createImage(
                GAME1.scannerTip,
                "Scanner Tip"
            )
        );

        addButton(
            game1,
            "START WATER READING →",
            function () {

                game1Round =
                    0;

                game1Score =
                    0;

                showGame1Round();
            }
        );

        showScreen(game1);
    }


    /* =====================================================
       GAME 1 — THREE WATER READING ROUNDS
    ===================================================== */

    function showGame1Round() {

        clearScreen(game1);

        const roundNumber =
            game1Round + 1;

        const roundAssets =
            GAME1[
                "round" +
                roundNumber
            ];


        const title =
            document.createElement("h2");

        title.className =
            "game-title";

        title.textContent =
            "WATER READING — ROUND " +
            roundNumber;

        game1.appendChild(
            title
        );


        const instruction =
            document.createElement("p");

        instruction.className =
            "game-instruction";

        instruction.textContent =
            "Choose the water condition you would fish.";

        game1.appendChild(
            instruction
        );


        const grid =
            document.createElement("div");

        grid.className =
            "choice-grid";


        roundAssets.forEach(
            function (src, index) {

                if (!src) {
                    return;
                }

                const letter =
                    String.fromCharCode(
                        65 + index
                    );

                const button =
                    createImageButton(
                        src,
                        "Round " +
                        roundNumber +
                        " Choice " +
                        letter,
                        function () {

                            handleGame1Answer(
                                letter
                            );
                        }
                    );

                grid.appendChild(
                    button
                );
            }
        );


        game1.appendChild(
            grid
        );

        showScreen(game1);
    }


    /* =====================================================
       GAME 1 ANSWERS
    ===================================================== */

    const GAME1_ANSWERS = [

        "B",

        "B",

        "A"

    ];


    function handleGame1Answer(
        answer
    ) {

        const correct =
            GAME1_ANSWERS[
                game1Round
            ];

        const isCorrect =
            answer === correct;


        if (isCorrect) {
            game1Score++;
        }


        showGame1Reaction(
            isCorrect
        );
    }


    /* =====================================================
       GAME 1 CORRECT / WRONG SCREEN
    ===================================================== */

    function showGame1Reaction(
        isCorrect
    ) {

        clearScreen(game1);


        game1.appendChild(
            createImage(
                isCorrect
                    ? GAME1.correct
                    : GAME1.wrong,

                isCorrect
                    ? "Correct"
                    : "Wrong"
            )
        );


        const scoreText =
            document.createElement("p");

        scoreText.className =
            "score-display";

        scoreText.textContent =
            "XP: " +
            game1Score;


        game1.appendChild(
            scoreText
        );


        addButton(
            game1,
            "CONTINUE →",
            function () {

                game1Round++;


                if (
                    game1Round < 3
                ) {

                    showGame1Round();

                } else {

                    showGame1Complete();
                }
            }
        );


        showScreen(game1);
    }


    /* =====================================================
       GAME 1 COMPLETE
    ===================================================== */

    function showGame1Complete() {

        clearScreen(game1);


        game1.appendChild(
            createImage(
                GAME1.completion,
                "Game 1 Complete"
            )
        );


        game1.appendChild(
            createImage(
                GAME1.badge,
                "Master Angler Badge"
            )
        );


        game1.appendChild(
            createImage(
                GAME1.message,
                "Master Angler Message"
            )
        );


        const score =
            document.createElement("p");

        score.className =
            "score-display";

        score.textContent =
            "FINAL XP: " +
            game1Score;


        game1.appendChild(
            score
        );


        addButton(
            game1,
            "CONTINUE TO GAME 2 →",
            startGame2
        );


        showScreen(game1);
    }


    /* =====================================================
       GAME 2 START
    ===================================================== */

    function startGame2() {

        game2Phase =
            0;

        showGame2Title();
    }


    /* =====================================================
       GAME 2 TITLE
    ===================================================== */

    function showGame2Title() {

        clearScreen(game2);


        game2.appendChild(
            createImage(
                GAME2.title,
                "Game 2"
            )
        );


        addButton(
            game2,
            "CONTINUE →",
            showGame2HowTo
        );


        showScreen(game2);
    }


    /* =====================================================
       GAME 2 HOW TO PLAY
    ===================================================== */

    function showGame2HowTo() {

        clearScreen(game2);


        game2.appendChild(
            createImage(
                GAME2.howToPlay,
                "Game 2 How to Play"
            )
        );


        addButton(
            game2,
            "START THE FIGHT →",
            function () {

                game2Phase =
                    0;

                showGame2Phase();
            }
        );


        showScreen(game2);
    }


    /* =====================================================
       GAME 2 — FISH FIGHT
    ===================================================== */

    function showGame2Phase() {

        clearScreen(game2);


        const phases = [

            GAME2.phase1,

            GAME2.phase2,

            GAME2.phase3,

            GAME2.phase4,

            GAME2.phase5

        ];


        const phaseNames = [

            "BITE",

            "RUN",

            "FIGHT",

            "WEAR DOWN",

            "LANDING"

        ];


        if (GAME2.hud) {

            game2.appendChild(
                createImage(
                    GAME2.hud,
                    "Game 2 HUD"
                )
            );
        }


        game2.appendChild(
            createImage(
                phases[game2Phase],
                "Game 2 " +
                phaseNames[game2Phase]
            )
        );


        if (
            game2Phase <
            phases.length - 1
        ) {

            addButton(
                game2,
                phaseNames[
                    game2Phase
                ] +
                " →",
                function () {

                    game2Phase++;

                    showGame2Phase();
                }
            );

        } else {

            addButton(
                game2,
                "LAND THE LEGENDARY CATCH →",
                showGame2Success
            );
        }


        showScreen(game2);
    }


    /* =====================================================
       GAME 2 LEGENDARY CATCH
    ===================================================== */

    function showGame2Success() {

        clearScreen(game2);


        game2.appendChild(
            createImage(
                GAME2.legendaryCatch,
                "Legendary Catch"
            )
        );


        game2.appendChild(
            createImage(
                GAME2.masterBadge,
                "Master Angler Badge"
            )
        );


        game2.appendChild(
            createImage(
                GAME2.masterMessage,
                "Master Angler Message"
            )
        );


        addButton(
            game2,
            "CONTINUE TO GAME 3 →",
            startGame3
        );


        showScreen(game2);
    }


    /* =====================================================
       GAME 3 START
    ===================================================== */

    function startGame3() {

        game3Step =
            0;

        showGame3Intro();
    }


    /* =====================================================
       GAME 3 INTRO
    ===================================================== */

    function showGame3Intro() {

        clearScreen(game3);


        game3.appendChild(
            createImage(
                GAME3.intro,
                "Game 3 Camp After Dark"
            )
        );


        addButton(
            game3,
            "START GAME 3 →",
            function () {

                game3Step =
                    0;

                showGame3Step();
            }
        );


        showScreen(game3);
    }


    /* =====================================================
       GAME 3 CAMP STEPS
    ===================================================== */

    const GAME3_STEPS = [

        {
            image:
                GAME3.tent,

            title:
                "SET UP CAMP",

            button:
                "SET UP TENT →"
        },

        {
            image:
                GAME3.dryWood,

            title:
                "GATHER DRY WOOD",

            button:
                "GATHER WOOD →"
        },

        {
            image:
                GAME3.kindling,

            title:
                "PREPARE KINDLING",

            button:
                "PREPARE KINDLING →"
        },

        {
            image:
                GAME3.tinder,

            title:
                "PREPARE TINDER",

            button:
                "PREPARE TINDER →"
        },

        {
            image:
                GAME3.fireStarter,

            title:
                "PREPARE THE FIRE",

            button:
                "LIGHT THE FIRE →"
        },

        {
            image:
                GAME3.fishingWeather,

            title:
                "CHECK FISHING WEATHER",

            button:
                "CHECK WEATHER →"
        },

        {
            image:
                GAME3.foodSupplies,

            title:
                "CHECK FOOD SUPPLIES",

            button:
                "CHECK SUPPLIES →"
        },

        {
            image:
                GAME3.waterBucket,

            title:
                "SECURE WATER",

            button:
                "SECURE WATER →"
        }

    ];


    function showGame3Step() {

        clearScreen(game3);


        const step =
            GAME3_STEPS[
                game3Step
            ];


        if (!step) {

            showGame3Complete();

            return;
        }


        const title =
            document.createElement("h2");

        title.className =
            "game-title";

        title.textContent =
            step.title;

        game3.appendChild(
            title
        );


        game3.appendChild(
            createImage(
                step.image,
                step.title
            )
        );


        addButton(
            game3,
            step.button,
            function () {

                game3Step++;


                if (
                    game3Step >=
                    GAME3_STEPS.length
                ) {

                    showGame3Complete();

                } else {

                    showGame3Step();
                }
            }
        );


        showScreen(game3);
    }


    /* =====================================================
       GAME 3 COMPLETE
    ===================================================== */

    function showGame3Complete() {

        clearScreen(game3);


        game3.appendChild(
            createImage(
                GAME3.campComplete,
                "Camp Complete"
            )
        );


        addButton(
            game3,
            "CONTINUE TO FINAL EXPEDITION →",
            showFinalReport
        );


        showScreen(game3);
    }


    /* =====================================================
       FINAL EXPEDITION REPORT
    ===================================================== */

    function showFinalReport() {

        clearScreen(game3);


        const finalScreen =
            document.createElement("div");

        finalScreen.className =
            "final-expedition-report";


        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        const title =
            document.createElement("h1");

        title.textContent =
            "🏆 MISSION COMPLETE!";

        finalScreen.appendChild(
            title
        );


        /* -------------------------------------------------
           BIRTHDAY MESSAGE
        ------------------------------------------------- */

        const birthdayMessage =
            document.createElement("p");

        birthdayMessage.innerHTML =
            "<strong>You did it, birthday boy. ❤️</strong><br>" +
            "Your final surprise has been unlocked…";

        finalScreen.appendChild(
            birthdayMessage
        );


        /* -------------------------------------------------
           REVEAL BUTTON
        ------------------------------------------------- */

        const revealButton =
            document.createElement("button");

        revealButton.type =
            "button";

        revealButton.className =
            "game-button";

        revealButton.textContent =
            "🔓 TAP TO REVEAL";

        finalScreen.appendChild(
            revealButton
        );


        /* -------------------------------------------------
           HIDDEN SURPRISE
        ------------------------------------------------- */

        const surprise =
            document.createElement("div");

        surprise.className =
            "birthday-surprise";

        surprise.style.display =
            "none";


        /* -------------------------------------------------
           ADVENTURE TITLE
        ------------------------------------------------- */

        const adventureTitle =
            document.createElement("h2");

        adventureTitle.textContent =
            "🏕️ YOUR BIRTHDAY ADVENTURE AWAITS";

        surprise.appendChild(
            adventureTitle
        );


        /* -------------------------------------------------
           LOCATION / DATE / TIME
        ------------------------------------------------- */

        const adventureDetails =
            document.createElement("div");

        adventureDetails.className =
            "adventure-details";

        adventureDetails.innerHTML =
            "<p>📍 <strong>EAST COAST PARK</strong></p>" +
            "<p>📅 <strong>21–22 AUGUST 2026</strong></p>" +
            "<p>⏰ <strong>3:00 PM</strong></p>";

        surprise.appendChild(
            adventureDetails
        );


        /* -------------------------------------------------
           PERSONAL MESSAGE
        ------------------------------------------------- */

        const personalMessage =
            document.createElement("div");

        personalMessage.className =
            "personal-message";

        personalMessage.innerHTML =
            "<p><strong>Pack your bags.</strong></p>" +
            "<p><strong>Bring your fishing gear.</strong></p>" +
            "<p><strong>And come ready for an adventure with me. ❤️</strong></p>";

        surprise.appendChild(
            personalMessage
        );


        /* -------------------------------------------------
           FINAL LINE
        ------------------------------------------------- */

        const countdown =
            document.createElement("h2");

        countdown.className =
            "final-countdown";

        countdown.textContent =
            "THE COUNTDOWN BEGINS… ⏳";

        surprise.appendChild(
            countdown
        );


        /* -------------------------------------------------
           ADD SURPRISE
        ------------------------------------------------- */

        finalScreen.appendChild(
            surprise
        );


        /* -------------------------------------------------
           REVEAL ACTION
        ------------------------------------------------- */

        revealButton.addEventListener(
            "click",
            function () {

                revealButton.style.display =
                    "none";

                surprise.style.display =
                    "block";

                setTimeout(
                    function () {

                        surprise.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    },
                    100
                );
            }
        );


        /* -------------------------------------------------
           SHOW FINAL SCREEN
        ------------------------------------------------- */

        game3.appendChild(
            finalScreen
        );


        showScreen(game3);
    }


    /* =====================================================
       START ON MISSION 3 FRONT PAGE
    ===================================================== */

    showScreen(
        mission3Intro
    );


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "================================="
    );

    console.log(
        "HOOKED IN 30 — MISSION 3 LOADED"
    );

    console.log(
        "Flow:"
    );

    console.log(
        "Mission 3 Front Page → Game 1 → Game 2 → Game 3 → Final Reveal"
    );

    console.log(
        "================================="
    );

});
