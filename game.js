/* =========================================================
   HOOKED IN 30
   MISSION 3 → GAME 1 → GAME 2 → GAME 3
   ========================================================= */

"use strict";

/* =========================================================
   ASSET PATHS
   ========================================================= */

const ASSETS = "assets";

const GAME1 = `${ASSETS}/game-01`;
const GAME2 = `${ASSETS}/game-02`;
const GAME3 = `${ASSETS}/game-03`;


/* =========================================================
   GAME 1 ASSETS
   ========================================================= */

const game1Assets = {

    intro: `${GAME1}/01_intro_screen.png`,
    howToPlay: `${GAME1}/02_how_to_play.png`,
    scanner: `${GAME1}/03_angler_scanner.png`,
    scannerTip: `${GAME1}/04_scanner_tip.png`,

    round1: {
        A: `${GAME1}/07_round1_A_calm_water.png`,
        B: `${GAME1}/08_round1_B_surface_activity.png`,
        C: `${GAME1}/09_round1_C_strong_current.png`
    },

    round2: {
        A: `${GAME1}/10_round2_A_fast_current.png`,
        B: `${GAME1}/11_round2_B_current_break.png`,
        C: `${GAME1}/12_round2_C_dead_water.png`
    },

    round3: {
        A: `${GAME1}/13_round3_A_open_water.png`,

        // CORRECTED OPTION B
        B: `${GAME1}/14_round3_rocky_edge.png`,

        C: `${GAME1}/15_round3_C_heavy_surf.png`
    },

    correct: `${GAME1}/16_correct_reaction.png`,
    wrong: `${GAME1}/17_wrong_reaction.png`,
    completion: `${GAME1}/18_completion_panel.png`,
    badge: `${GAME1}/19_master_angler_badge.png`,
    message: `${GAME1}/20_master_angler_message.png`,
    continueGame2: `${GAME1}/21_continue_game2_button.png`
};


/* =========================================================
   GAME 2 ASSETS
   ========================================================= */

const game2Assets = {

    title: `${GAME2}/g2_title.png`,
    howToPlay: `${GAME2}/g2_how_to_play.png`,
    hud: `${GAME2}/g2_hud.png`,

    phase1: `${GAME2}/g2_phase1_bite.png`,
    phase2: `${GAME2}/g2_phase2_run.png`,
    phase3: `${GAME2}/g2_phase3_fight.png`,
    phase4: `${GAME2}/g2_phase4_wear_down.png`,
    phase5: `${GAME2}/g2_phase5_landing.png`,

    reelButton: `${GAME2}/g2_reel_button.png`,
    reelIcon: `${GAME2}/g2_reel_icon.png`,

    releaseButton: `${GAME2}/g2_release_button.png`,
    releaseIcon: `${GAME2}/g2_release_icon.png`,

    staminaIcon: `${GAME2}/g2_stamina_icon.png`,
    lineStamina: `${GAME2}/g2_line_stamina.png`,

    tensionIcon: `${GAME2}/g2_tension_icon.png`,
    tensionNormal: `${GAME2}/g2_tension_bar_normal.png`,
    tensionLow: `${GAME2}/g2_tension_bar_low_line.png`,
    tensionZone: `${GAME2}/g2_tension_zone_meter.png`,

    statusLegend: `${GAME2}/g2_status_legend.png`,

    fishIcon: `${GAME2}/g2_fish_icon.png`,
    greenZone: `${GAME2}/g2_green_zone_icon.png`,

    legendaryCatch: `${GAME2}/g2_legendary_catch_panel.png`,
    failure: `${GAME2}/g2_failure_panel.png`,

    landIt: `${GAME2}/g2_land_it_button.png`,
    continueGame3: `${GAME2}/g2_continue_game3_button.png`,

    masterBadge: `${GAME2}/g2_master_angler_badge.png`,
    masterMessage: `${GAME2}/g2_master_angler_message.png`
};


/* =========================================================
   GAME 3 ASSETS
   ========================================================= */

const game3Assets = {

    intro: `${GAME3}/game3_intro_page.png`,

    tent: `${GAME3}/g3_tent.png`,
    tentHotspot: `${GAME3}/g3_tent_hotspot_icon.png`,
    tentWeather: `${GAME3}/g3_tent_weather_icon.png`,

    tinder: `${GAME3}/g3_tinder.png`,
    fireStarter: `${GAME3}/g3_fire_starter.png`,
    fireUnlit: `${GAME3}/g3_fire_unlit.png`,
    fireLit: `${GAME3}/g3_fire_lit.png`,
    kindling: `${GAME3}/g3_kindling.png`,
    dryWood: `${GAME3}/g3_dry_wood.png`,
    lightFireButton: `${GAME3}/g3_light_fire_button.png`,

    waterBucket: `${GAME3}/g3_water_bucket.png`,

    foodSupplies: `${GAME3}/g3_food_supplies.png`,
    foodHotspot: `${GAME3}/g3_food_hotspot_icon.png`,
    foodWeather: `${GAME3}/g3_food_weather_icon.png`,

    fishingWeather: `${GAME3}/g3_fishing_weather_icon.png`,

    gearHotspot: `${GAME3}/g3_gear_hotspot_icon.png`,

    energyBar: `${GAME3}/g3_energy_bar.png`,
    healthBar: `${GAME3}/g3_health_bar.png`,
    preparednessBar: `${GAME3}/g3_preparedness_bar.png`,

    slot1: `${GAME3}/g3_slot_1st.png`,
    slot2: `${GAME3}/g3_slot_2nd.png`,
    slot3: `${GAME3}/g3_slot_3rd.png`,
    slot4: `${GAME3}/g3_slot_4th.png`,

    stormWarning: `${GAME3}/g3_storm_warning.png`,
    weatherTimer: `${GAME3}/g3_weather_timer.png`,

    finalButton: `${GAME3}/g3_to_final_button.png`,
    complete: `${GAME3}/g3_camp_complete.png`
};


/* =========================================================
   MISSION 3 FRONT PAGE
   IMPORTANT:
   Your actual file is:
   assets/Mission3frontpage.png
   ========================================================= */

const mission3FrontPage = `${ASSETS}/Mission3frontpage.png`;


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function hideAllScreens() {
    document.querySelectorAll(".game-screen").forEach(screen => {
        screen.classList.add("hidden");
        screen.style.display = "none";
    });
}

function showScreen(id) {

    hideAllScreens();

    const screen = document.getElementById(id);

    if (!screen) {
        console.error(`Screen not found: ${id}`);
        return;
    }

    screen.classList.remove("hidden");
    screen.style.display = "flex";
}


/* =========================================================
   IMAGE HELPER
   ========================================================= */

function createImage(src, alt = "") {

    const img = document.createElement("img");

    img.src = src;
    img.alt = alt;
    img.draggable = false;

    img.addEventListener("error", () => {
        console.warn("Asset not found:", src);
    });

    return img;
}


/* =========================================================
   BUTTON / CLICKABLE IMAGE HELPER
   ========================================================= */

function createImageButton(src, alt, onClick, className = "") {

    const button = document.createElement("button");

    button.type = "button";
    button.className = `game-image-button ${className}`;

    const img = createImage(src, alt);

    button.appendChild(img);

    button.addEventListener("click", onClick);

    return button;
}


/* =========================================================
   MISSION 3 FRONT PAGE
   THE IMAGE ITSELF IS CLICKABLE.
   NO SECOND BEGIN MISSION 3 BUTTON.
   ========================================================= */

function setupMission3FrontPage() {

    const screen = document.getElementById("mission3-intro");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "mission3-frontpage clickable-frontpage";

    const imageButton = document.createElement("button");

    imageButton.type = "button";
    imageButton.className = "mission3-screen-button";

    const image = createImage(
        mission3FrontPage,
        "Mission 3 - The Final Mission"
    );

    image.className = "mission3-image";

    imageButton.appendChild(image);

    imageButton.addEventListener("click", () => {
        startGame1();
    });

    wrapper.appendChild(imageButton);
    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1
   ========================================================= */

let game1Round = 0;

const game1Rounds = [

    {
        title: "ROUND 1",
        question: "Choose the best water condition.",
        correct: "B",
        options: game1Assets.round1
    },

    {
        title: "ROUND 2",
        question: "Choose the best fishing zone.",
        correct: "B",
        options: game1Assets.round2
    },

    {
        title: "ROUND 3",
        question: "Choose the best location.",
        correct: "B",
        options: game1Assets.round3
    }

];


/* =========================================================
   START GAME 1
   ========================================================= */

function startGame1() {

    game1Round = 0;

    showScreen("game1");

    renderGame1Intro();
}


/* =========================================================
   GAME 1 INTRO
   ========================================================= */

function renderGame1Intro() {

    const screen = document.getElementById("game1");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const imageButton = createImageButton(
        game1Assets.intro,
        "Game 1 Introduction",
        () => renderGame1HowToPlay(),
        "full-screen-image-button"
    );

    wrapper.appendChild(imageButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1 HOW TO PLAY
   ========================================================= */

function renderGame1HowToPlay() {

    const screen = document.getElementById("game1");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const imageButton = createImageButton(
        game1Assets.howToPlay,
        "How to Play",
        () => renderGame1Scanner(),
        "full-screen-image-button"
    );

    wrapper.appendChild(imageButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1 SCANNER
   ========================================================= */

function renderGame1Scanner() {

    const screen = document.getElementById("game1");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const imageButton = createImageButton(
        game1Assets.scanner,
        "Angler Scanner",
        () => renderGame1ScannerTip(),
        "full-screen-image-button"
    );

    wrapper.appendChild(imageButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1 SCANNER TIP
   ========================================================= */

function renderGame1ScannerTip() {

    const screen = document.getElementById("game1");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const imageButton = createImageButton(
        game1Assets.scannerTip,
        "Scanner Tip",
        () => renderGame1Round(),
        "full-screen-image-button"
    );

    wrapper.appendChild(imageButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1 ROUND
   ========================================================= */

function renderGame1Round() {

    const screen = document.getElementById("game1");

    if (!screen) return;

    const round = game1Rounds[game1Round];

    if (!round) {
        completeGame1();
        return;
    }

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper game1-round";

    const title = document.createElement("div");

    title.className = "game-round-title";

    title.innerHTML = `
        <strong>${round.title}</strong>
        <span>${round.question}</span>
    `;

    wrapper.appendChild(title);


    /* -----------------------------------------------------
       THREE REAL CLICKABLE OPTIONS
       ----------------------------------------------------- */

    const choices = document.createElement("div");

    choices.className = "game-choice-grid";

    ["A", "B", "C"].forEach(letter => {

        const button = createImageButton(
            round.options[letter],
            `Option ${letter}`,
            () => handleGame1Answer(letter),
            `choice-${letter.toLowerCase()}`
        );

        button.dataset.option = letter;

        choices.appendChild(button);
    });

    wrapper.appendChild(choices);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1 ANSWER
   ========================================================= */

function handleGame1Answer(selected) {

    const round = game1Rounds[game1Round];

    if (!round) return;

    const isCorrect = selected === round.correct;

    if (isCorrect) {

        showGame1Reaction(true);

    } else {

        showGame1Reaction(false);
    }
}


/* =========================================================
   GAME 1 CORRECT / WRONG REACTION
   ========================================================= */

function showGame1Reaction(correct) {

    const screen = document.getElementById("game1");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper reaction-screen";

    const reactionImage = createImage(
        correct ? game1Assets.correct : game1Assets.wrong,
        correct ? "Correct reaction" : "Wrong reaction"
    );

    reactionImage.className = "reaction-image";

    wrapper.appendChild(reactionImage);


    const continueButton = document.createElement("button");

    continueButton.type = "button";
    continueButton.className = "reaction-continue-button";

    if (correct) {

        continueButton.textContent =
            game1Round < game1Rounds.length - 1
                ? "CONTINUE →"
                : "COMPLETE MISSION →";

        continueButton.addEventListener("click", () => {

            game1Round++;

            if (game1Round < game1Rounds.length) {

                renderGame1Round();

            } else {

                completeGame1();
            }
        });

    } else {

        continueButton.textContent = "TRY AGAIN →";

        continueButton.addEventListener("click", () => {
            renderGame1Round();
        });
    }

    wrapper.appendChild(continueButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 1 COMPLETION
   ========================================================= */

function completeGame1() {

    const screen = document.getElementById("game1");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper completion-screen";


    /* COMPLETION PANEL */

    const completion = createImage(
        game1Assets.completion,
        "Mission 1 Complete"
    );

    completion.className = "completion-image";

    wrapper.appendChild(completion);


    /* BADGE */

    const badge = createImage(
        game1Assets.badge,
        "Master Angler Badge"
    );

    badge.className = "completion-badge";

    wrapper.appendChild(badge);


    /* MESSAGE */

    const message = createImage(
        game1Assets.message,
        "Master Angler Message"
    );

    message.className = "completion-message";

    wrapper.appendChild(message);


    /* CONTINUE TO GAME 2 */

    const continueButton = createImageButton(
        game1Assets.continueGame2,
        "Continue to Game 2",
        () => startGame2(),
        "continue-image-button"
    );

    wrapper.appendChild(continueButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 2
   ========================================================= */

let game2Phase = 1;
let game2Tension = 50;
let game2Stamina = 100;
let game2Line = 100;
let game2Running = false;


/* =========================================================
   START GAME 2
   ========================================================= */

function startGame2() {

    game2Phase = 1;
    game2Tension = 50;
    game2Stamina = 100;
    game2Line = 100;
    game2Running = false;

    showScreen("game2");

    renderGame2Title();
}


/* =========================================================
   GAME 2 TITLE
   ========================================================= */

function renderGame2Title() {

    const screen = document.getElementById("game2");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const button = createImageButton(
        game2Assets.title,
        "Game 2 - The Final Catch",
        () => renderGame2HowToPlay(),
        "full-screen-image-button"
    );

    wrapper.appendChild(button);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 2 HOW TO PLAY
   ========================================================= */

function renderGame2HowToPlay() {

    const screen = document.getElementById("game2");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const button = createImageButton(
        game2Assets.howToPlay,
        "Game 2 How to Play",
        () => startFishing(),
        "full-screen-image-button"
    );

    wrapper.appendChild(button);

    screen.appendChild(wrapper);
}


/* =========================================================
   START FISHING
   ========================================================= */

function startFishing() {

    game2Running = true;
    game2Phase = 1;
    game2Tension = 50;
    game2Stamina = 100;
    game2Line = 100;

    renderFishingPhase();
}


/* =========================================================
   FISHING PHASE
   ========================================================= */

function renderFishingPhase() {

    const screen = document.getElementById("game2");

    if (!screen) return;

    const phases = {

        1: game2Assets.phase1,
        2: game2Assets.phase2,
        3: game2Assets.phase3,
        4: game2Assets.phase4,
        5: game2Assets.phase5

    };

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper fishing-game";


    const phaseImage = createImage(
        phases[game2Phase],
        `Fishing Phase ${game2Phase}`
    );

    phaseImage.className = "fishing-phase-image";

    wrapper.appendChild(phaseImage);


    /* STATUS */

    const status = document.createElement("div");

    status.className = "fishing-status";

    status.innerHTML = `
        <div>PHASE <strong>${game2Phase}/5</strong></div>
        <div>LINE <strong>${game2Line}%</strong></div>
        <div>STAMINA <strong>${game2Stamina}%</strong></div>
        <div>TENSION <strong>${game2Tension}%</strong></div>
    `;

    wrapper.appendChild(status);


    /* ACTIONS */

    const controls = document.createElement("div");

    controls.className = "fishing-controls";


    const reel = document.createElement("button");

    reel.type = "button";
    reel.className = "fishing-action-button";
    reel.textContent = "REEL";

    reel.addEventListener("click", reelFish);


    const release = document.createElement("button");

    release.type = "button";
    release.className = "fishing-action-button release";
    release.textContent = "RELEASE";

    release.addEventListener("click", releaseFish);


    controls.appendChild(reel);
    controls.appendChild(release);

    wrapper.appendChild(controls);

    screen.appendChild(wrapper);
}


/* =========================================================
   REEL
   ========================================================= */

function reelFish() {

    if (!game2Running) return;

    game2Tension += 12;

    game2Stamina -= 15;

    game2Line -= 5;

    if (game2Tension > 100) {

        game2Tension = 100;
    }

    if (game2Stamina < 0) {

        game2Stamina = 0;
    }

    if (game2Line < 0) {

        game2Line = 0;
    }


    if (game2Stamina <= 0) {

        game2Phase++;

        game2Stamina = 100;

        game2Tension = 50;

        if (game2Phase > 5) {

            game2Phase = 5;
            completeGame2();
            return;
        }
    }


    if (game2Tension >= 100) {

        game2Tension = 70;
        game2Line -= 10;

        if (game2Line <= 0) {

            game2Line = 0;
            failGame2();
            return;
        }
    }

    renderFishingPhase();
}


/* =========================================================
   RELEASE
   ========================================================= */

function releaseFish() {

    if (!game2Running) return;

    game2Tension -= 20;

    if (game2Tension < 0) {

        game2Tension = 0;
    }

    game2Stamina -= 5;

    if (game2Stamina < 0) {

        game2Stamina = 0;
    }

    renderFishingPhase();
}


/* =========================================================
   GAME 2 FAILURE
   ========================================================= */

function failGame2() {

    game2Running = false;

    const screen = document.getElementById("game2");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper completion-screen";

    const failure = createImage(
        game2Assets.failure,
        "Fishing Failed"
    );

    failure.className = "completion-image";

    wrapper.appendChild(failure);


    const retry = document.createElement("button");

    retry.type = "button";
    retry.className = "reaction-continue-button";
    retry.textContent = "TRY AGAIN →";

    retry.addEventListener("click", startFishing);

    wrapper.appendChild(retry);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 2 COMPLETE
   ========================================================= */

function completeGame2() {

    game2Running = false;

    const screen = document.getElementById("game2");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper completion-screen";


    const legendary = createImage(
        game2Assets.legendaryCatch,
        "Legendary Catch"
    );

    legendary.className = "completion-image";

    wrapper.appendChild(legendary);


    const badge = createImage(
        game2Assets.masterBadge,
        "Master Angler Badge"
    );

    badge.className = "completion-badge";

    wrapper.appendChild(badge);


    const message = createImage(
        game2Assets.masterMessage,
        "Master Angler Message"
    );

    message.className = "completion-message";

    wrapper.appendChild(message);


    const continueButton = createImageButton(
        game2Assets.continueGame3,
        "Continue to Game 3",
        () => startGame3(),
        "continue-image-button"
    );

    wrapper.appendChild(continueButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   GAME 3
   ========================================================= */

let campState = {
    tent: false,
    fire: false,
    food: false,
    water: false,
    gear: false
};


/* =========================================================
   START GAME 3
   ========================================================= */

function startGame3() {

    campState = {
        tent: false,
        fire: false,
        food: false,
        water: false,
        gear: false
    };

    showScreen("game3");

    renderGame3Intro();
}


/* =========================================================
   GAME 3 INTRO
   ========================================================= */

function renderGame3Intro() {

    const screen = document.getElementById("game3");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper";

    const button = createImageButton(
        game3Assets.intro,
        "Game 3 - Camp After Dark",
        () => renderCampGame(),
        "full-screen-image-button"
    );

    wrapper.appendChild(button);

    screen.appendChild(wrapper);
}


/* =========================================================
   CAMPING GAME
   ========================================================= */

function renderCampGame() {

    const screen = document.getElementById("game3");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper camping-game";


    const title = document.createElement("h2");

    title.textContent = "CAMP AFTER DARK";

    wrapper.appendChild(title);


    const instruction = document.createElement("p");

    instruction.textContent =
        "Prepare the campsite before the storm arrives.";

    wrapper.appendChild(instruction);


    const grid = document.createElement("div");

    grid.className = "camp-action-grid";


    /* TENT */

    const tentButton = createImageButton(
        game3Assets.tent,
        "Set up tent",
        () => completeCampTask("tent"),
        "camp-action"
    );

    grid.appendChild(tentButton);


    /* FIRE */

    const fireButton = createImageButton(
        game3Assets.fireStarter,
        "Start fire",
        () => completeCampTask("fire"),
        "camp-action"
    );

    grid.appendChild(fireButton);


    /* FOOD */

    const foodButton = createImageButton(
        game3Assets.foodSupplies,
        "Prepare food",
        () => completeCampTask("food"),
        "camp-action"
    );

    grid.appendChild(foodButton);


    /* WATER */

    const waterButton = createImageButton(
        game3Assets.waterBucket,
        "Collect water",
        () => completeCampTask("water"),
        "camp-action"
    );

    grid.appendChild(waterButton);


    /* GEAR */

    const gearButton = createImageButton(
        game3Assets.tinder,
        "Prepare gear",
        () => completeCampTask("gear"),
        "camp-action"
    );

    grid.appendChild(gearButton);


    wrapper.appendChild(grid);


    const status = document.createElement("div");

    status.className = "camp-status";

    status.innerHTML = `
        <span>⛺ ${campState.tent ? "READY" : "NOT READY"}</span>
        <span>🔥 ${campState.fire ? "READY" : "NOT READY"}</span>
        <span>🍖 ${campState.food ? "READY" : "NOT READY"}</span>
        <span>💧 ${campState.water ? "READY" : "NOT READY"}</span>
        <span>🎒 ${campState.gear ? "READY" : "NOT READY"}</span>
    `;

    wrapper.appendChild(status);

    screen.appendChild(wrapper);
}


/* =========================================================
   CAMP TASK
   ========================================================= */

function completeCampTask(task) {

    campState[task] = true;

    const allReady =
        campState.tent &&
        campState.fire &&
        campState.food &&
        campState.water &&
        campState.gear;


    if (allReady) {

        renderCampComplete();

    } else {

        renderCampGame();
    }
}


/* =========================================================
   GAME 3 COMPLETE
   ========================================================= */

function renderCampComplete() {

    const screen = document.getElementById("game3");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "game-wrapper final-completion";


    const completeImage = createImage(
        game3Assets.complete,
        "Camp Complete"
    );

    completeImage.className = "completion-image";

    wrapper.appendChild(completeImage);


    const finalButton = createImageButton(
        game3Assets.finalButton,
        "Final Mission",
        () => showFinalMessage(),
        "continue-image-button"
    );

    wrapper.appendChild(finalButton);

    screen.appendChild(wrapper);
}


/* =========================================================
   FINAL BIRTHDAY MESSAGE
   ========================================================= */

function showFinalMessage() {

    const screen = document.getElementById("game3");

    if (!screen) return;

    screen.innerHTML = "";

    const wrapper = document.createElement("div");

    wrapper.className = "final-message";


    wrapper.innerHTML = `
        <div class="final-message-card">

            <h1>🏆 MISSION COMPLETE!</h1>

            <h2>You did it, birthday boy. ❤️</h2>

            <p>
                Your final surprise has been unlocked…
            </p>

            <button
                type="button"
                id="revealBirthday"
                class="reveal-button"
            >
                🔓 TAP TO REVEAL
            </button>

            <div
                id="birthdayReveal"
                class="birthday-reveal hidden"
            >

                <h2>🏕️ YOUR BIRTHDAY ADVENTURE AWAITS</h2>

                <p>
                    📍 <strong>EAST COAST PARK</strong>
                </p>

                <p>
                    📅 <strong>21–22 AUGUST 2026</strong>
                </p>

                <p>
                    ⏰ <strong>3:00 PM</strong>
                </p>

                <hr>

                <p>
                    <strong>Pack your bags.</strong><br>
                    <strong>Bring your fishing gear.</strong><br>
                    <strong>And come ready for an adventure with me. ❤️</strong>
                </p>

                <h2 class="countdown">
                    THE COUNTDOWN BEGINS… ⏳
                </h2>

            </div>

        </div>
    `;

    screen.appendChild(wrapper);


    const revealButton = document.getElementById("revealBirthday");

    const revealPanel = document.getElementById("birthdayReveal");

    revealButton.addEventListener("click", () => {

        revealPanel.classList.remove("hidden");

        revealButton.style.display = "none";
    });
}


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* Fix the Mission 3 front page automatically */
    setupMission3FrontPage();

    /* Start on Mission 3 front page */
    showScreen("mission3-intro");

});


/* =========================================================
   GLOBAL SAFETY
   ========================================================= */

window.addEventListener("error", event => {

    console.warn(
        "Game error:",
        event.message
    );

});


/* =========================================================
   DEBUG HELPERS
   ========================================================= */

window.HookedIn30 = {

    startMission3: () => showScreen("mission3-intro"),

    startGame1,

    startGame2,

    startGame3,

    game1Round,

    game1Assets,

    game2Assets,

    game3Assets

};
