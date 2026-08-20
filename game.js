/* =========================================================
   HOOKED IN 30
   MISSION 3 — COMPLETE GAME CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const ASSET = {
        mission3Front: "assets/Mission3frontpage.png",

        /* ---------------- GAME 1 ---------------- */
        game1: {
            intro: "assets/game-01/01_intro_screen.png",
            howToPlay: "assets/game-01/02_how_to_play.png",
            scanner: "assets/game-01/03_angler_scanner.png",
            scannerTip: "assets/game-01/04_scanner_tip.png",

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
                "assets/game-01/15_round3_C_heavy_surf.png"
            ],

            correct: "assets/game-01/16_correct_reaction.png",
            wrong: "assets/game-01/17_wrong_reaction.png",
            completion: "assets/game-01/18_completion_panel.png",
            badge: "assets/game-01/19_master_angler_badge.png",
            message: "assets/game-01/20_master_angler_message.png",
            continue: "assets/game-01/21_continue_game2_button.png",

            /* Correct answers:
               Round 1 = B
               Round 2 = B
               Round 3 = not used because B asset is missing
            */
            answers: ["B", "B", "A"]
        },

        /* ---------------- GAME 2 ---------------- */
        game2: {
            title: "assets/game-02/g2_title.png",
            howToPlay: "assets/game-02/g2_how_to_play.png",
            hud: "assets/game-02/g2_hud.png",

            phase1: "assets/game-02/g2_phase1_bite.png",
            phase2: "assets/game-02/g2_phase2_run.png",
            phase3: "assets/game-02/g2_phase3_fight.png",
            phase4: "assets/game-02/g2_phase4_wear_down.png",
            phase5: "assets/game-02/g2_phase5_landing.png",

            reelButton: "assets/game-02/g2_reel_button.png",
            reelIcon: "assets/game-02/g2_reel_icon.png",

            releaseButton: "assets/game-02/g2_release_button.png",
            releaseIcon: "assets/game-02/g2_release_icon.png",

            staminaIcon: "assets/game-02/g2_stamina_icon.png",

            statusLegend: "assets/game-02/g2_status_legend.png",

            tensionLow: "assets/game-02/g2_tension_bar_low_line.png",
            tensionNormal: "assets/game-02/g2_tension_bar_normal.png",
            tensionIcon: "assets/game-02/g2_tension_icon.png",
            tensionMeter: "assets/game-02/g2_tension_zone_meter.png",

            greenZone: "assets/game-02/g2_green_zone_icon.png",
            fishIcon: "assets/game-02/g2_fish_icon.png",
            lineStamina: "assets/game-02/g2_line_stamina.png",

            landButton: "assets/game-02/g2_land_it_button.png",

            legendaryCatch: "assets/game-02/g2_legendary_catch_panel.png",
            failure: "assets/game-02/g2_failure_panel.png",

            masterBadge: "assets/game-02/g2_master_angler_badge.png",
            masterMessage: "assets/game-02/g2_master_angler_message.png",
            continueGame3: "assets/game-02/g2_continue_game3_button.png"
        },

        /* ---------------- GAME 3 ---------------- */
        game3: {
            intro: "assets/game-03/game3_intro_page.png",

            campComplete: "assets/game-03/g3_camp_complete.png",
            dryWood: "assets/game-03/g3_dry_wood.png",
            energyBar: "assets/game-03/g3_energy_bar.png",

            fireLit: "assets/game-03/g3_fire_lit.png",
            fireStarter: "assets/game-03/g3_fire_starter.png",
            fireUnlit: "assets/game-03/g3_fire_unlit.png",

            fishingWeather: "assets/game-03/g3_fishing_weather_icon.png",
            foodHotspot: "assets/game-03/g3_food_hotspot_icon.png",
            foodSupplies: "assets/game-03/g3_food_supplies.png",
            foodWeather: "assets/game-03/g3_food_weather_icon.png",

            gearHotspot: "assets/game-03/g3_gear_hotspot_icon.png",
            healthBar: "assets/game-03/g3_health_bar.png",
            kindling: "assets/game-03/g3_kindling.png",

            lightFire: "assets/game-03/g3_light_fire_button.png",
            preparednessBar: "assets/game-03/g3_preparedness_bar.png",

            slot1: "assets/game-03/g3_slot_1st.png",
            slot2: "assets/game-03/g3_slot_2nd.png",
            slot3: "assets/game-03/g3_slot_3rd.png",
            slot4: "assets/game-03/g3_slot_4th.png",

            stormWarning: "assets/game-03/g3_storm_warning.png",

            tent: "assets/game-03/g3_tent.png",
            tentHotspot: "assets/game-03/g3_tent_hotspot_icon.png",
            tentWeather: "assets/game-03/g3_tent_weather_icon.png",

            tinder: "assets/game-03/g3_tinder.png",

            finalButton: "assets/game-03/g3_to_final_button.png",

            waterBucket: "assets/game-03/g3_water_bucket.png",
            weatherTimer: "assets/game-03/g3_weather_timer.png"
        }
    };


    /* =====================================================
       BASIC ELEMENTS
       ===================================================== */

    const container = document.getElementById("game-container");

    if (!container) {
        console.error("Game container not found.");
        return;
    }

    /*
       We build the screens dynamically so the game.js
       remains independent of the old HTML structure.
    */

    container.innerHTML = "";


    /* =====================================================
       HELPER FUNCTIONS
       ===================================================== */

    function createScreen(id) {
        const screen = document.createElement("section");
        screen.id = id;
        screen.className = "game-screen hidden";
        container.appendChild(screen);
        return screen;
    }


    function showScreen(screen) {
        document.querySelectorAll(".game-screen").forEach(s => {
            s.classList.add("hidden");
        });

        screen.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function createImage(src, alt = "") {
        const img = document.createElement("img");

        img.src = src;
        img.alt = alt;
        img.className = "game-image";

        img.onerror = () => {
            console.warn("Asset not found:", src);
            img.style.display = "none";
        };

        return img;
    }


    function createButton(text, callback, className = "game-button") {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = text;
        button.className = className;

        button.addEventListener("click", callback);

        return button;
    }


    function imageButton(src, alt, callback) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "image-button";

        const img = createImage(src, alt);

        button.appendChild(img);

        button.addEventListener("click", callback);

        return button;
    }


    function addTitle(screen, text) {
        const title = document.createElement("h1");
        title.textContent = text;
        title.className = "game-title";
        screen.appendChild(title);
    }


    function addInstruction(screen, text) {
        const instruction = document.createElement("p");
        instruction.textContent = text;
        instruction.className = "game-instruction";
        screen.appendChild(instruction);
    }


    function addImage(screen, src, alt = "") {
        screen.appendChild(createImage(src, alt));
    }


    function addNextButton(screen, text, callback) {
        const wrapper = document.createElement("div");
        wrapper.className = "button-area";

        wrapper.appendChild(
            createButton(text, callback)
        );

        screen.appendChild(wrapper);
    }


    /* =====================================================
       CREATE ALL SCREENS
       ===================================================== */

    const missionScreen = createScreen("mission3-front");

    const game1Screen = createScreen("game1-screen");

    const game1HowToScreen = createScreen("game1-howto");

    const game1ScannerScreen = createScreen("game1-scanner");

    const game1ScannerTipScreen = createScreen("game1-scanner-tip");

    const game1RoundScreen = createScreen("game1-round");

    const game1ReactionScreen = createScreen("game1-reaction");

    const game1CompleteScreen = createScreen("game1-complete");


    const game2TitleScreen = createScreen("game2-title");

    const game2HowToScreen = createScreen("game2-howto");

    const game2PlayScreen = createScreen("game2-play");

    const game2ResultScreen = createScreen("game2-result");


    const game3IntroScreen = createScreen("game3-intro");

    const game3PlayScreen = createScreen("game3-play");

    const game3ResultScreen = createScreen("game3-result");


    /* =====================================================
       MISSION 3 FRONT PAGE
       ===================================================== */

    addImage(
        missionScreen,
        ASSET.mission3Front,
        "Welcome to Mission 3"
    );

    addNextButton(
        missionScreen,
        "BEGIN MISSION 3 →",
        () => {
            startGame1();
        }
    );


    /* =====================================================
       GAME 1
       ===================================================== */

    let game1Round = 0;
    let game1Score = 0;


    function startGame1() {

        game1Round = 0;
        game1Score = 0;

        game1Screen.innerHTML = "";

        addImage(
            game1Screen,
            ASSET.game1.intro,
            "Game 1 Introduction"
        );

        addNextButton(
            game1Screen,
            "CONTINUE →",
            () => {
                showGame1HowTo();
            }
        );

        showScreen(game1Screen);
    }


    function showGame1HowTo() {

        game1HowToScreen.innerHTML = "";

        addImage(
            game1HowToScreen,
            ASSET.game1.howToPlay,
            "How to Play"
        );

        addNextButton(
            game1HowToScreen,
            "CONTINUE →",
            () => {
                showGame1Scanner();
            }
        );

        showScreen(game1HowToScreen);
    }


    function showGame1Scanner() {

        game1ScannerScreen.innerHTML = "";

        addImage(
            game1ScannerScreen,
            ASSET.game1.scanner,
            "Angler Scanner"
        );

        addNextButton(
            game1ScannerScreen,
            "SCAN THE WATER →",
            () => {
                showGame1ScannerTip();
            }
        );

        showScreen(game1ScannerScreen);
    }


    function showGame1ScannerTip() {

        game1ScannerTipScreen.innerHTML = "";

        addImage(
            game1ScannerTipScreen,
            ASSET.game1.scannerTip,
            "Scanner Tip"
        );

        addNextButton(
            game1ScannerTipScreen,
            "START ROUND 1 →",
            () => {
                game1Round = 0;
                showGame1Round();
            }
        );

        showScreen(game1ScannerTipScreen);
    }


    function showGame1Round() {

        game1RoundScreen.innerHTML = "";

        const roundNumber = game1Round + 1;

        addTitle(
            game1RoundScreen,
            `ROUND ${roundNumber}`
        );

        addInstruction(
            game1RoundScreen,
            "Choose the best fishing location."
        );

        const cards = ASSET.game1[`round${roundNumber}`];

        const choices = ["A", "B", "C"];

        const cardContainer = document.createElement("div");
        cardContainer.className = "choice-grid";


        cards.forEach((src, index) => {

            const letter = choices[index];

            const button = imageButton(
                src,
                `Round ${roundNumber} Choice ${letter}`,
                () => {
                    handleGame1Answer(letter);
                }
            );

            cardContainer.appendChild(button);
        });


        /*
           Round 3 currently only has A and C in your GitHub
           folder. We intentionally do NOT request the missing
           14_round3_B file because that would create a 404.
        */

        game1RoundScreen.appendChild(cardContainer);

        showScreen(game1RoundScreen);
    }


    function handleGame1Answer(answer) {

        const correctAnswer = ASSET.game1.answers[game1Round];

        const isCorrect = answer === correctAnswer;

        if (isCorrect) {
            game1Score++;
        }

        showGame1Reaction(isCorrect);
    }


    function showGame1Reaction(isCorrect) {

        game1ReactionScreen.innerHTML = "";

        if (isCorrect) {

            addImage(
                game1ReactionScreen,
                ASSET.game1.correct,
                "Correct Reaction"
            );

        } else {

            addImage(
                game1ReactionScreen,
                ASSET.game1.wrong,
                "Wrong Reaction"
            );
        }


        addNextButton(
            game1ReactionScreen,
            "CONTINUE →",
            () => {

                game1Round++;

                /*
                   Your current files contain:
                   Round 1
                   Round 2
                   Round 3 A + C

                   We finish Game 1 after Round 3.
                */

                if (game1Round < 3) {
                    showGame1Round();
                } else {
                    showGame1Completion();
                }
            }
        );

        showScreen(game1ReactionScreen);
    }


    function showGame1Completion() {

        game1CompleteScreen.innerHTML = "";

        addImage(
            game1CompleteScreen,
            ASSET.game1.completion,
            "Game 1 Completion"
        );

        addImage(
            game1CompleteScreen,
            ASSET.game1.badge,
            "Master Angler Badge"
        );

        addImage(
            game1CompleteScreen,
            ASSET.game1.message,
            "Master Angler Message"
        );

        addNextButton(
            game1CompleteScreen,
            "CONTINUE TO GAME 2 →",
            () => {
                startGame2();
            }
        );

        showScreen(game1CompleteScreen);
    }


    /* =====================================================
       GAME 2
       ===================================================== */

    function startGame2() {

        game2TitleScreen.innerHTML = "";

        addImage(
            game2TitleScreen,
            ASSET.game2.title,
            "Game 2"
        );

        addNextButton(
            game2TitleScreen,
            "START GAME 2 →",
            () => {
                showGame2HowTo();
            }
        );

        showScreen(game2TitleScreen);
    }


    function showGame2HowTo() {

        game2HowToScreen.innerHTML = "";

        addImage(
            game2HowToScreen,
            ASSET.game2.howToPlay,
            "Game 2 How to Play"
        );

        addNextButton(
            game2HowToScreen,
            "START FIGHT →",
            () => {
                startGame2Play();
            }
        );

        showScreen(game2HowToScreen);
    }


    let game2Phase = 0;


    function startGame2Play() {

        game2Phase = 0;

        showGame2Phase();
    }


    function showGame2Phase() {

        game2PlayScreen.innerHTML = "";

        addImage(
            game2PlayScreen,
            ASSET.game2.hud,
            "Game 2 HUD"
        );


        const phases = [
            ASSET.game2.phase1,
            ASSET.game2.phase2,
            ASSET.game2.phase3,
            ASSET.game2.phase4,
            ASSET.game2.phase5
        ];


        const phaseNames = [
            "BITE",
            "RUN",
            "FIGHT",
            "WEAR DOWN",
            "LANDING"
        ];


        addImage(
            game2PlayScreen,
            phases[game2Phase],
            `Game 2 Phase ${game2Phase + 1}`
        );


        /*
           Add the relevant controls from your assets.
        */

        if (game2Phase === 0) {

            addNextButton(
                game2PlayScreen,
                "REEL IN →",
                () => {
                    game2Phase++;
                    showGame2Phase();
                }
            );

        } else if (game2Phase === 1) {

            addNextButton(
                game2PlayScreen,
                "REEL →",
                () => {
                    game2Phase++;
                    showGame2Phase();
                }
            );

        } else if (game2Phase === 2) {

            addNextButton(
                game2PlayScreen,
                "FIGHT →",
                () => {
                    game2Phase++;
                    showGame2Phase();
                }
            );

        } else if (game2Phase === 3) {

            addNextButton(
                game2PlayScreen,
                "WEAR IT DOWN →",
                () => {
                    game2Phase++;
                    showGame2Phase();
                }
            );

        } else {

            addNextButton(
                game2PlayScreen,
                "LAND THE FISH →",
                () => {
                    showGame2Success();
                }
            );
        }


        showScreen(game2PlayScreen);
    }


    function showGame2Success() {

        game2ResultScreen.innerHTML = "";

        addImage(
            game2ResultScreen,
            ASSET.game2.legendaryCatch,
            "Legendary Catch"
        );

        addImage(
            game2ResultScreen,
            ASSET.game2.masterBadge,
            "Master Angler Badge"
        );

        addImage(
            game2ResultScreen,
            ASSET.game2.masterMessage,
            "Master Angler Message"
        );

        addNextButton(
            game2ResultScreen,
            "CONTINUE TO GAME 3 →",
            () => {
                startGame3();
            }
        );

        showScreen(game2ResultScreen);
    }


    /* =====================================================
       GAME 3
       ===================================================== */

    function startGame3() {

        game3IntroScreen.innerHTML = "";

        addImage(
            game3IntroScreen,
            ASSET.game3.intro,
            "Game 3 Camp After Dark"
        );

        addNextButton(
            game3IntroScreen,
            "START FINAL MISSION →",
            () => {
                startGame3Play();
            }
        );

        showScreen(game3IntroScreen);
    }


    let game3Step = 0;


    function startGame3Play() {

        game3Step = 0;

        showGame3Step();
    }


    function showGame3Step() {

        game3PlayScreen.innerHTML = "";

        const steps = [

            {
                image: ASSET.game3.tent,
                title: "SET UP CAMP",
                button: "SET UP TENT →"
            },

            {
                image: ASSET.game3.dryWood,
                title: "GATHER DRY WOOD",
                button: "GATHER WOOD →"
            },

            {
                image: ASSET.game3.kindling,
                title: "PREPARE KINDLING",
                button: "PREPARE KINDLING →"
            },

            {
                image: ASSET.game3.tinder,
                title: "PREPARE TINDER",
                button: "PREPARE TINDER →"
            },

            {
                image: ASSET.game3.fireStarter,
                title: "GET THE FIRE STARTER",
                button: "LIGHT THE FIRE →"
            },

            {
                image: ASSET.game3.fishingWeather,
                title: "CHECK THE WEATHER",
                button: "CHECK WEATHER →"
            },

            {
                image: ASSET.game3.foodSupplies,
                title: "CHECK FOOD SUPPLIES",
                button: "CHECK SUPPLIES →"
            },

            {
                image: ASSET.game3.waterBucket,
                title: "SECURE WATER",
                button: "SECURE WATER →"
            },

            {
                image: ASSET.game3.campComplete,
                title: "CAMP COMPLETE",
                button: "COMPLETE FINAL MISSION →"
            }
        ];


        const step = steps[game3Step];


        addTitle(
            game3PlayScreen,
            step.title
        );


        addImage(
            game3PlayScreen,
            step.image,
            step.title
        );


        addNextButton(
            game3PlayScreen,
            step.button,
            () => {

                game3Step++;

                if (game3Step >= steps.length) {
                    showGame3Final();
                } else {
                    showGame3Step();
                }

            }
        );


        showScreen(game3PlayScreen);
    }


    function showGame3Final() {

        game3ResultScreen.innerHTML = "";

        addImage(
            game3ResultScreen,
            ASSET.game3.campComplete,
            "Camp Complete"
        );

        addImage(
            game3ResultScreen,
            ASSET.game3.finalButton,
            "Final Mission"
        );


        addNextButton(
            game3ResultScreen,
            "FINISH MISSION 3 ★",
            () => {

                game3ResultScreen.innerHTML = "";

                addTitle(
                    game3ResultScreen,
                    "MISSION 3 COMPLETE"
                );

                addInstruction(
                    game3ResultScreen,
                    "You completed the final mission and proved yourself a true Master Angler."
                );

                addImage(
                    game3ResultScreen,
                    ASSET.game3.campComplete,
                    "Mission Complete"
                );

                showScreen(game3ResultScreen);
            }
        );


        showScreen(game3ResultScreen);
    }


    /* =====================================================
       START
       ===================================================== */

    showScreen(missionScreen);

});
