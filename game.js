/* =========================================================
   HOOKED IN 30
   COMPLETE GAME.JS
   FLOW:
   MISSION 3 FRONT PAGE
        ↓
   GAME 1 – WATER READING
        ↓
   GAME 2 – LEGENDARY CATCH
        ↓
   GAME 3 – CAMP AFTER DARK
        ↓
   FINAL BIRTHDAY REVEAL
========================================================= */

"use strict";

/* =========================================================
   ASSET PATHS
========================================================= */

const A = "assets/";

const GAME1 = A + "game-01/";
const GAME2 = A + "game-02/";
const GAME3 = A + "game-03/";


/* =========================================================
   GAME STATE
========================================================= */

let currentGame = "mission3";
let currentStep = 0;

let game1Round = 1;
let game1Score = 0;

let game2Phase = 1;
let game2Score = 0;
let game2Started = false;

let game3Step = 0;
let game3Score = 0;


/* =========================================================
   MAIN CONTAINER
========================================================= */

const container = document.getElementById("game-container");

if (!container) {
    console.error("Game container not found.");
}


/* =========================================================
   GLOBAL STYLES
   Keeps the images sharp and makes the whole image responsive.
========================================================= */

document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.background = "#000";
document.body.style.overflow = "hidden";

if (container) {
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.background = "#000";
}


/* =========================================================
   IMAGE PRELOADER
========================================================= */

function preloadImages(list) {

    list.forEach(src => {

        const img = new Image();

        img.src = src;

    });

}


/* =========================================================
   LOAD ALL YOUR EXISTING ASSETS
========================================================= */

preloadImages([

    /* -------------------------
       MISSION 3
    ------------------------- */

    A + "Mission3frontpage.png",


    /* -------------------------
       GAME 1
    ------------------------- */

    GAME1 + "01_intro_screen.png",
    GAME1 + "02_how_to_play.png",
    GAME1 + "03_angler_scanner.png",
    GAME1 + "04_scanner_tip.png",

    GAME1 + "07_round1_A_calm_water.png",
    GAME1 + "08_round1_B_surface_activity.png",
    GAME1 + "09_round1_C_strong_current.png",

    GAME1 + "10_round2_A_fast_current.png",
    GAME1 + "11_round2_B_current_break.png",
    GAME1 + "12_round2_C_dead_water.png",

    GAME1 + "13_round3_A_open_water.png",
    GAME1 + "15_round3_C_heavy_surf.png",

    GAME1 + "16_correct_reaction.png",
    GAME1 + "17_wrong_reaction.png",

    GAME1 + "18_completion_panel.png",
    GAME1 + "19_master_angler_badge.png",
    GAME1 + "20_master_angler_message.png",
    GAME1 + "21_continue_game2_button.png",

    GAME1 + "scanner_charge.png",


    /* -------------------------
       GAME 2
    ------------------------- */

    GAME2 + "g2_title.png",
    GAME2 + "g2_how_to_play.png",

    GAME2 + "g2_phase1_bite.png",
    GAME2 + "g2_phase2_run.png",
    GAME2 + "g2_phase3_fight.png",
    GAME2 + "g2_phase4_wear_down.png",
    GAME2 + "g2_phase5_landing.png",

    GAME2 + "g2_release_button.png",
    GAME2 + "g2_release_icon.png",

    GAME2 + "g2_reel_button.png",
    GAME2 + "g2_reel_icon.png",

    GAME2 + "g2_stamina_icon.png",

    GAME2 + "g2_tension_icon.png",
    GAME2 + "g2_tension_zone_meter.png",
    GAME2 + "g2_tension_bar_normal.png",
    GAME2 + "g2_tension_bar_low_line.png",

    GAME2 + "g2_status_legend.png",
    GAME2 + "g2_hud.png",

    GAME2 + "g2_fish_icon.png",
    GAME2 + "g2_green_zone_icon.png",

    GAME2 + "g2_land_it_button.png",

    GAME2 + "g2_legendary_catch_panel.png",
    GAME2 + "g2_failure_panel.png",

    GAME2 + "g2_master_angler_badge.png",
    GAME2 + "g2_master_angler_message.png",

    GAME2 + "g2_continue_game3_button.png",


    /* -------------------------
       GAME 3
    ------------------------- */

    GAME3 + "game3_intro_page.png",

    GAME3 + "g3_tinder.png",
    GAME3 + "g3_dry_wood.png",
    GAME3 + "g3_fire_starter.png",
    GAME3 + "g3_fire_unit.png",
    GAME3 + "g3_fire_lit.png",

    GAME3 + "g3_energy_bar.png",
    GAME3 + "g3_health_bar.png",
    GAME3 + "g3_preparedness_bar.png",

    GAME3 + "g3_food_supplies.png",
    GAME3 + "g3_water_bucket.png",
    GAME3 + "g3_kindling.png",
    GAME3 + "g3_tent.png",

    GAME3 + "g3_slot_1st.png",
    GAME3 + "g3_slot_2nd.png",
    GAME3 + "g3_slot_3rd.png",
    GAME3 + "g3_slot_4th.png",

    GAME3 + "g3_storm_warning.png",
    GAME3 + "g3_weather_timer.png",

    GAME3 + "g3_fishing_weather_icon.png",
    GAME3 + "g3_food_weather_icon.png",
    GAME3 + "g3_tent_weather_icon.png",

    GAME3 + "g3_food_hotspot_icon.png",
    GAME3 + "g3_gear_hotspot_icon.png",
    GAME3 + "g3_tent_hotspot_icon.png",

    GAME3 + "g3_to_final_button.png",
    GAME3 + "g3_camp_complete.png"

]);


/* =========================================================
   SCREEN CREATION
========================================================= */

function clearScreen() {

    if (!container) return;

    container.innerHTML = "";

}


function createImage(src, alt = "") {

    const img = document.createElement("img");

    img.src = src;
    img.alt = alt;

    img.draggable = false;

    img.style.display = "block";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.maxWidth = "100vw";
    img.style.maxHeight = "100vh";
    img.style.objectFit = "contain";

    /*
       Prevent browser interpolation from making the image
       look unnecessarily blurry.
    */

    img.style.imageRendering = "auto";

    return img;
}


/* =========================================================
   FULL-SCREEN IMAGE SCREEN
========================================================= */

function showImageScreen(src, alt, clickFunction) {

    clearScreen();

    const wrapper = document.createElement("div");

    wrapper.style.position = "relative";
    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";

    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    wrapper.style.cursor = clickFunction ? "pointer" : "default";

    const img = createImage(src, alt);

    wrapper.appendChild(img);

    if (clickFunction) {

        /*
           THE ENTIRE PNG IS CLICKABLE.

           This is important because your buttons are already
           physically drawn inside the PNG files.
        */

        wrapper.addEventListener("click", function (event) {

            event.preventDefault();

            clickFunction(event);

        });

        wrapper.addEventListener("touchend", function (event) {

            event.preventDefault();

            clickFunction(event);

        }, {
            passive: false
        });

    }

    container.appendChild(wrapper);

    return wrapper;
}


/* =========================================================
   CLICKABLE IMAGE BUTTON
========================================================= */

function createClickableImage(src, alt, callback) {

    const button = document.createElement("button");

    button.type = "button";

    button.style.border = "0";
    button.style.padding = "0";
    button.style.margin = "0";

    button.style.background = "transparent";

    button.style.cursor = "pointer";

    button.style.display = "block";

    button.style.lineHeight = "0";

    const img = createImage(src, alt);

    button.appendChild(img);

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        callback(event);

    });

    return button;
}


/* =========================================================
   MISSION 3 FRONT PAGE
========================================================= */

function showMission3FrontPage() {

    currentGame = "mission3";

    currentStep = 0;

    /*
       IMPORTANT:

       There is NO extra HTML BEGIN MISSION 3 button.

       The existing button inside Mission3frontpage.png
       is made clickable by making the entire PNG clickable.
    */

    showImageScreen(
        A + "Mission3frontpage.png",
        "Mission 3 - The Final Mission",
        function () {

            startGame1();

        }
    );

}


/* =========================================================
   GAME 1
========================================================= */

function startGame1() {

    currentGame = "game1";

    currentStep = 0;

    game1Round = 1;
    game1Score = 0;

    showGame1Intro();

}


/* =========================================================
   GAME 1 INTRO
========================================================= */

function showGame1Intro() {

    currentStep = 1;

    showImageScreen(
        GAME1 + "01_intro_screen.png",
        "Game 1 Introduction",
        showGame1HowToPlay
    );

}


/* =========================================================
   GAME 1 HOW TO PLAY
========================================================= */

function showGame1HowToPlay() {

    currentStep = 2;

    showImageScreen(
        GAME1 + "02_how_to_play.png",
        "Game 1 - How To Play",
        showGame1Scanner
    );

}


/* =========================================================
   GAME 1 SCANNER
========================================================= */

function showGame1Scanner() {

    currentStep = 3;

    showImageScreen(
        GAME1 + "03_angler_scanner.png",
        "Angler Scanner",
        showScannerTip
    );

}


/* =========================================================
   SCANNER TIP
========================================================= */

function showScannerTip() {

    currentStep = 4;

    showImageScreen(
        GAME1 + "04_scanner_tip.png",
        "Scanner Tip - Start Water Reading",
        startWaterReading
    );

}


/* =========================================================
   START WATER READING
========================================================= */

function startWaterReading() {

    /*
       The Start Water Reading button is part of the image.

       Therefore the whole PNG is clickable.
    */

    game1Round = 1;

    showGame1Round1();

}


/* =========================================================
   GAME 1 ROUND 1
========================================================= */

function showGame1Round1() {

    currentStep = 10;

    showChoiceScreen([

        {
            src: GAME1 + "07_round1_A_calm_water.png",
            answer: "A",
            correct: false
        },

        {
            src: GAME1 + "08_round1_B_surface_activity.png",
            answer: "B",
            correct: true
        },

        {
            src: GAME1 + "09_round1_C_strong_current.png",
            answer: "C",
            correct: false
        }

    ], handleGame1Answer);

}


/* =========================================================
   GAME 1 ROUND 2
========================================================= */

function showGame1Round2() {

    currentStep = 20;

    showChoiceScreen([

        {
            src: GAME1 + "10_round2_A_fast_current.png",
            answer: "A",
            correct: false
        },

        {
            src: GAME1 + "11_round2_B_current_break.png",
            answer: "B",
            correct: true
        },

        {
            src: GAME1 + "12_round2_C_dead_water.png",
            answer: "C",
            correct: false
        }

    ], handleGame1Answer);

}


/* =========================================================
   GAME 1 ROUND 3
========================================================= */

function showGame1Round3() {

    currentStep = 30;

    showChoiceScreen([

        {
            src: GAME1 + "13_round3_A_open_water.png",
            answer: "A",
            correct: true
        },

        {
            src: GAME1 + "15_round3_C_heavy_surf.png",
            answer: "C",
            correct: false
        }

    ], handleGame1Answer);

}


/* =========================================================
   CHOICE SCREEN
========================================================= */

function showChoiceScreen(choices, callback) {

    clearScreen();

    const wrapper = document.createElement("div");

    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";

    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    wrapper.style.gap = "12px";

    wrapper.style.padding = "15px";

    wrapper.style.boxSizing = "border-box";

    wrapper.style.overflow = "auto";

    choices.forEach(choice => {

        const button = createClickableImage(
            choice.src,
            "Answer " + choice.answer,
            function () {

                callback(choice);

            }
        );

        button.style.flex = "0 1 auto";

        wrapper.appendChild(button);

    });

    container.appendChild(wrapper);

}


/* =========================================================
   GAME 1 ANSWER HANDLER
========================================================= */

function handleGame1Answer(choice) {

    if (choice.correct) {

        game1Score++;

        showImageScreen(
            GAME1 + "16_correct_reaction.png",
            "Correct!",
            function () {

                if (game1Round === 1) {

                    game1Round = 2;

                    showGame1Round2();

                }

                else if (game1Round === 2) {

                    game1Round = 3;

                    showGame1Round3();

                }

                else {

                    finishGame1();

                }

            }
        );

    }

    else {

        showImageScreen(
            GAME1 + "17_wrong_reaction.png",
            "Wrong Reaction",
            function () {

                /*
                   Wrong answer does not reset the mission.

                   The player gets another attempt.
                */

                if (game1Round === 1) {

                    showGame1Round1();

                }

                else if (game1Round === 2) {

                    showGame1Round2();

                }

                else {

                    showGame1Round3();

                }

            }
        );

    }

}


/* =========================================================
   GAME 1 COMPLETE
========================================================= */

function finishGame1() {

    currentStep = 40;

    showImageScreen(
        GAME1 + "18_completion_panel.png",
        "Game 1 Complete",
        function () {

            showImageScreen(
                GAME1 + "19_master_angler_badge.png",
                "Master Angler Badge",
                function () {

                    showImageScreen(
                        GAME1 + "20_master_angler_message.png",
                        "Master Angler Message",
                        function () {

                            /*
                               Continue button is embedded inside
                               21_continue_game2_button.png.
                            */

                            showImageScreen(
                                GAME1 + "21_continue_game2_button.png",
                                "Continue to Game 2",
                                startGame2
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   GAME 2
========================================================= */

function startGame2() {

    currentGame = "game2";

    currentStep = 0;

    game2Phase = 1;
    game2Score = 0;
    game2Started = false;

    showGame2Title();

}


/* =========================================================
   GAME 2 TITLE
========================================================= */

function showGame2Title() {

    showImageScreen(
        GAME2 + "g2_title.png",
        "Game 2 - Legendary Catch",
        showGame2HowToPlay
    );

}


/* =========================================================
   GAME 2 HOW TO PLAY
========================================================= */

function showGame2HowToPlay() {

    showImageScreen(
        GAME2 + "g2_how_to_play.png",
        "Game 2 - How To Play",
        startGame2Phases
    );

}


/* =========================================================
   GAME 2 PHASE SYSTEM
========================================================= */

function startGame2Phases() {

    game2Started = true;

    game2Phase = 1;

    showGame2Phase();

}


/* =========================================================
   GAME 2 PHASE DISPLAY
========================================================= */

function showGame2Phase() {

    let phaseImage = "";

    switch (game2Phase) {

        case 1:

            phaseImage = "g2_phase1_bite.png";

            break;

        case 2:

            phaseImage = "g2_phase2_run.png";

            break;

        case 3:

            phaseImage = "g2_phase3_fight.png";

            break;

        case 4:

            phaseImage = "g2_phase4_wear_down.png";

            break;

        case 5:

            phaseImage = "g2_phase5_landing.png";

            break;

        default:

            finishGame2();

            return;
    }


    /*
       Each phase image contains the visual controls.

       The complete image is clickable so the player can
       click the actual button drawn into the artwork.
    */

    showImageScreen(
        GAME2 + phaseImage,
        "Game 2 Phase " + game2Phase,
        handleGame2PhaseClick
    );

}


/* =========================================================
   GAME 2 PHASE CLICK
========================================================= */

function handleGame2PhaseClick() {

    game2Score++;

    /*
       Phase 1 → 2
       Phase 2 → 3
       Phase 3 → 4
       Phase 4 → 5
       Phase 5 → Landing
    */

    if (game2Phase < 5) {

        game2Phase++;

        showGame2Phase();

        return;

    }

    /*
       Once Phase 5 is completed, show the landing screen.
    */

    showImageScreen(
        GAME2 + "g2_land_it_button.png",
        "Land It",
        finishGame2
    );

}


/* =========================================================
   GAME 2 COMPLETE
========================================================= */

function finishGame2() {

    currentStep = 50;

    showImageScreen(
        GAME2 + "g2_legendary_catch_panel.png",
        "Legendary Catch",
        function () {

            showImageScreen(
                GAME2 + "g2_master_angler_badge.png",
                "Master Angler Badge",
                function () {

                    showImageScreen(
                        GAME2 + "g2_master_angler_message.png",
                        "Master Angler Message",
                        function () {

                            showImageScreen(
                                GAME2 + "g2_continue_game3_button.png",
                                "Continue to Game 3",
                                startGame3
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   GAME 3
========================================================= */

function startGame3() {

    currentGame = "game3";

    currentStep = 0;

    game3Step = 0;
    game3Score = 0;

    showGame3Intro();

}


/* =========================================================
   GAME 3 INTRO
========================================================= */

function showGame3Intro() {

    showImageScreen(
        GAME3 + "game3_intro_page.png",
        "Game 3 - Camp After Dark",
        startGame3Preparation
    );

}


/* =========================================================
   GAME 3 PREPARATION
========================================================= */

function startGame3Preparation() {

    game3Step = 1;

    showGame3FireStarter();

}


/* =========================================================
   FIRE STARTER
========================================================= */

function showGame3FireStarter() {

    showImageScreen(
        GAME3 + "g3_fire_starter.png",
        "Fire Starter",
        function () {

            game3Score++;

            showGame3DryWood();

        }
    );

}


/* =========================================================
   DRY WOOD
========================================================= */

function showGame3DryWood() {

    showImageScreen(
        GAME3 + "g3_dry_wood.png",
        "Dry Wood",
        function () {

            game3Score++;

            showGame3Tinder();

        }
    );

}


/* =========================================================
   TINDER
========================================================= */

function showGame3Tinder() {

    showImageScreen(
        GAME3 + "g3_tinder.png",
        "Tinder",
        function () {

            game3Score++;

            showGame3Kindling();

        }
    );

}


/* =========================================================
   KINDLING
========================================================= */

function showGame3Kindling() {

    showImageScreen(
        GAME3 + "g3_kindling.png",
        "Kindling",
        function () {

            game3Score++;

            showGame3FireUnit();

        }
    );

}


/* =========================================================
   FIRE UNIT
========================================================= */

function showGame3FireUnit() {

    showImageScreen(
        GAME3 + "g3_fire_unit.png",
        "Fire Unit",
        function () {

            game3Score++;

            showGame3FireLit();

        }
    );

}


/* =========================================================
   FIRE LIT
========================================================= */

function showGame3FireLit() {

    showImageScreen(
        GAME3 + "g3_fire_lit.png",
        "Fire Lit",
        function () {

            showGame3Supplies();

        }
    );

}


/* =========================================================
   CAMP SUPPLIES
========================================================= */

function showGame3Supplies() {

    /*
       Show the important camp items one by one.

       Every image is fully clickable.
    */

    showImageScreen(
        GAME3 + "g3_food_supplies.png",
        "Food Supplies",
        function () {

            showImageScreen(
                GAME3 + "g3_water_bucket.png",
                "Water Bucket",
                function () {

                    showImageScreen(
                        GAME3 + "g3_tent.png",
                        "Tent",
                        function () {

                            showImageScreen(
                                GAME3 + "g3_slot_1st.png",
                                "Preparation Slot 1",
                                function () {

                                    showImageScreen(
                                        GAME3 + "g3_slot_2nd.png",
                                        "Preparation Slot 2",
                                        function () {

                                            showImageScreen(
                                                GAME3 + "g3_slot_3rd.png",
                                                "Preparation Slot 3",
                                                function () {

                                                    showImageScreen(
                                                        GAME3 + "g3_slot_4th.png",
                                                        "Preparation Slot 4",
                                                        showGame3Weather
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   GAME 3 WEATHER
========================================================= */

function showGame3Weather() {

    showImageScreen(
        GAME3 + "g3_storm_warning.png",
        "Storm Warning",
        function () {

            showImageScreen(
                GAME3 + "g3_weather_timer.png",
                "Weather Timer",
                function () {

                    showGame3WeatherIcons();

                }
            );

        }
    );

}


/* =========================================================
   WEATHER ICONS
========================================================= */

function showGame3WeatherIcons() {

    /*
       Each weather hotspot is clickable.
    */

    clearScreen();

    const wrapper = document.createElement("div");

    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";

    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";

    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    wrapper.style.gap = "10px";

    wrapper.style.overflow = "auto";

    const icons = [

        {
            src: GAME3 + "g3_fishing_weather_icon.png",
            name: "Fishing Weather"
        },

        {
            src: GAME3 + "g3_food_weather_icon.png",
            name: "Food Weather"
        },

        {
            src: GAME3 + "g3_tent_weather_icon.png",
            name: "Tent Weather"
        }

    ];


    icons.forEach(item => {

        const button = createClickableImage(
            item.src,
            item.name,
            function () {

                game3Score++;

                /*
                   After clicking a weather icon,
                   continue to the hotspot stage.
                */

                showGame3Hotspots();

            }
        );

        wrapper.appendChild(button);

    });


    container.appendChild(wrapper);

}


/* =========================================================
   GAME 3 HOTSPOTS
========================================================= */

function showGame3Hotspots() {

    clearScreen();

    const wrapper = document.createElement("div");

    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";

    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";

    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";

    wrapper.style.gap = "10px";

    wrapper.style.overflow = "auto";


    const hotspots = [

        {
            src: GAME3 + "g3_food_hotspot_icon.png",
            name: "Food Hotspot"
        },

        {
            src: GAME3 + "g3_gear_hotspot_icon.png",
            name: "Gear Hotspot"
        },

        {
            src: GAME3 + "g3_tent_hotspot_icon.png",
            name: "Tent Hotspot"
        }

    ];


    hotspots.forEach(item => {

        const button = createClickableImage(
            item.src,
            item.name,
            function () {

                game3Score++;

                showGame3FinalPreparation();

            }
        );

        wrapper.appendChild(button);

    });


    container.appendChild(wrapper);

}


/* =========================================================
   FINAL GAME 3 PREPARATION
========================================================= */

function showGame3FinalPreparation() {

    showImageScreen(
        GAME3 + "g3_energy_bar.png",
        "Energy",
        function () {

            showImageScreen(
                GAME3 + "g3_health_bar.png",
                "Health",
                function () {

                    showImageScreen(
                        GAME3 + "g3_preparedness_bar.png",
                        "Preparedness",
                        function () {

                            showImageScreen(
                                GAME3 + "g3_camp_complete.png",
                                "Camp Complete",
                                showFinalReveal
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   FINAL BIRTHDAY REVEAL
========================================================= */

function showFinalReveal() {

    currentGame = "final";

    clearScreen();


    const wrapper = document.createElement("div");

    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";

    wrapper.style.boxSizing = "border-box";

    wrapper.style.padding = "30px";

    wrapper.style.overflow = "auto";

    wrapper.style.background =
        "linear-gradient(180deg, #061426 0%, #02060c 100%)";

    wrapper.style.color = "#fff";

    wrapper.style.fontFamily =
        "Arial, Helvetica, sans-serif";

    wrapper.style.textAlign = "center";


    const content = document.createElement("div");

    content.style.maxWidth = "850px";

    content.style.margin = "0 auto";

    content.style.padding = "30px 20px 60px";


    /* -------------------------
       TITLE
    ------------------------- */

    const title = document.createElement("h1");

    title.textContent = "🏆 MISSION COMPLETE!";

    title.style.fontSize = "clamp(32px, 6vw, 60px)";

    title.style.marginBottom = "20px";

    title.style.color = "#ffd84d";


    content.appendChild(title);


    /* -------------------------
       MESSAGE
    ------------------------- */

    const message = document.createElement("p");

    message.innerHTML =
        "<strong>You did it, birthday boy. ❤️</strong><br><br>" +
        "Your final surprise has been unlocked…";

    message.style.fontSize = "clamp(20px, 3vw, 32px)";

    message.style.lineHeight = "1.5";

    content.appendChild(message);


    /* -------------------------
       REVEAL BUTTON
    ------------------------- */

    const revealButton = document.createElement("button");

    revealButton.type = "button";

    revealButton.textContent =
        "🔓 TAP TO REVEAL";

    revealButton.style.display = "block";

    revealButton.style.margin =
        "30px auto";

    revealButton.style.padding =
        "18px 35px";

    revealButton.style.fontSize =
        "clamp(18px, 3vw, 28px)";

    revealButton.style.fontWeight =
        "bold";

    revealButton.style.borderRadius =
        "15px";

    revealButton.style.border =
        "2px solid #ffd84d";

    revealButton.style.background =
        "#101d2d";

    revealButton.style.color =
        "#fff";

    revealButton.style.cursor =
        "pointer";


    content.appendChild(revealButton);


    /* -------------------------
       HIDDEN REVEAL
    ------------------------- */

    const reveal = document.createElement("div");

    reveal.style.display = "none";

    reveal.style.marginTop = "35px";


    reveal.innerHTML =

        "<h2 style='font-size:clamp(28px,5vw,48px);color:#ffd84d;margin-bottom:25px;'>" +
        "🏕️ YOUR BIRTHDAY ADVENTURE AWAITS" +
        "</h2>" +

        "<div style='font-size:clamp(22px,4vw,36px);line-height:1.8;'>" +

        "📍 <strong>EAST COAST PARK</strong><br>" +

        "📅 <strong>21–22 AUGUST 2026</strong><br>" +

        "⏰ <strong>3:00 PM</strong>" +

        "</div>" +

        "<div style='margin-top:40px;font-size:clamp(20px,3.5vw,30px);line-height:1.7;'>" +

        "<p><strong>Pack your bags.</strong></p>" +

        "<p><strong>Bring your fishing gear.</strong></p>" +

        "<p><strong>And come ready for an adventure with me. ❤️</strong></p>" +

        "</div>" +

        "<div style='margin-top:45px;font-size:clamp(24px,4vw,38px);color:#4ddcff;font-weight:bold;'>" +

        "THE COUNTDOWN BEGINS… ⏳" +

        "</div>";


    content.appendChild(reveal);


    revealButton.addEventListener("click", function () {

        reveal.style.display = "block";

        revealButton.style.display = "none";

    });


    wrapper.appendChild(content);

    container.appendChild(wrapper);

}


/* =========================================================
   START THE GAME
========================================================= */

function initGame() {

    /*
       Make sure any old HTML buttons from index.html
       do NOT interfere with the game.

       The Mission 3 PNG itself handles the click.
    */

    const oldButton =
        document.getElementById("beginMission3");

    if (oldButton) {

        oldButton.remove();

    }


    /*
       Start on Mission 3 front page.
    */

    showMission3FrontPage();

}


/* =========================================================
   SAFETY: HANDLE IMAGE LOAD ERRORS
========================================================= */

document.addEventListener("error", function (event) {

    if (
        event.target &&
        event.target.tagName === "IMG"
    ) {

        console.error(
            "Asset failed to load:",
            event.target.src
        );

    }

}, true);


/* =========================================================
   START
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initGame
    );

} else {

    initGame();

}
