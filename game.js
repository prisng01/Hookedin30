"use strict";

/*
=========================================================
HOOKED IN 30
MISSION 03 — THE FINAL EXPEDITION

COMPLETE SELF-CONTAINED GAME.JS

Works with the simple index.html containing:

#game-container
#game1
#game2
#game3

Existing assets:
assets/Mission 3 front  page.png
assets/game-01/01_intro_screen.png
assets/game-01/02_how_to_play_panel.png
assets/game-01/03_angler_scanner_panel.png
assets/game-01/05_scanner_charge.png
assets/game-01/06_modes_icons.png
assets/game-01/07_round1_A.png
assets/game-01/08_round1_B.png
assets/game-01/09_round1_C.png
assets/game-01/10_round2_A.png
assets/game-01/11_round2_B.png
assets/game-01/12_round2_C.png
assets/game-01/13_round3_A.png
assets/game-01/14_round3_B.png
assets/game-01/15_round3_C.png

assets/game-02/g2_title.png

assets/game-03/game3_intro_page.png

IMPORTANT:
This file does NOT depend on the old HTML
button IDs. It creates the game controls itself.
=========================================================
*/


/* =====================================================
   WAIT FOR PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.getElementById("game-container");

    if (!container) {
        console.error(
            "ERROR: #game-container was not found."
        );
        return;
    }


    /* =================================================
       GAME STATE
    ================================================= */

    const state = {

        xp: 0,

        game1XP: 0,
        game2XP: 0,
        game3XP: 0,

        game1Round: 0,
        game1Correct: 0,

        scannerCharges: 3,

        game2Progress: 0,
        game2Started: false,

        campFire: false,
        campTent: false,
        campGear: false,
        campStorm: false,

        currentScreen: "mission"

    };


    /* =================================================
       ASSET PATHS
    ================================================= */

    const ASSETS = {

        mission:
            "assets/Mission 3 front  page.png",

        game1Intro:
            "assets/game-01/01_intro_screen.png",

        game1How:
            "assets/game-01/02_how_to_play_panel.png",

        game1Scanner:
            "assets/game-01/03_angler_scanner_panel.png",

        scannerCharge:
            "assets/game-01/05_scanner_charge.png",

        scannerModes:
            "assets/game-01/06_modes_icons.png",

        round1: [
            "assets/game-01/07_round1_A.png",
            "assets/game-01/08_round1_B.png",
            "assets/game-01/09_round1_C.png"
        ],

        round2: [
            "assets/game-01/10_round2_A.png",
            "assets/game-01/11_round2_B.png",
            "assets/game-01/12_round2_C.png"
        ],

        round3: [
            "assets/game-01/13_round3_A.png",
            "assets/game-01/14_round3_B.png",
            "assets/game-01/15_round3_C.png"
        ],

        game2:
            "assets/game-02/g2_title.png",

        game3:
            "assets/game-03/game3_intro_page.png"
    };


    /* =================================================
       GLOBAL STYLES
       These are only safety styles so the game remains
       clickable even if style.css has an issue.
    ================================================= */

    const style =
        document.createElement("style");

    style.textContent = `

        #game-container {
            width:100%;
            min-height:100vh;
            position:relative;
        }

        .hook-screen {
            width:100%;
            min-height:100vh;
            position:relative;
            display:none;
            align-items:center;
            justify-content:center;
            overflow:hidden;
        }

        .hook-screen.active {
            display:flex;
        }

        .hook-bg {
            width:100%;
            height:100%;
            min-height:100vh;
            object-fit:cover;
            display:block;
        }

        .hook-overlay {
            position:absolute;
            inset:0;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-end;
            padding:40px;
            pointer-events:none;
        }

        .hook-button {
            pointer-events:auto;
            position:relative;
            z-index:1000;
            border:2px solid #d8a928;
            border-radius:18px;
            padding:18px 42px;
            min-width:300px;
            background:linear-gradient(
                180deg,
                #65e51c,
                #2f9208
            );
            color:#fff;
            font-size:24px;
            font-weight:900;
            letter-spacing:1px;
            cursor:pointer;
            box-shadow:
                0 0 0 4px #14220c,
                0 8px 30px rgba(0,0,0,.7);
            text-shadow:0 2px 3px #000;
            transition:.15s ease;
        }

        .hook-button:hover {
            transform:scale(1.04);
            filter:brightness(1.15);
        }

        .hook-button:active {
            transform:scale(.98);
        }

        .hook-panel {
            width:min(1100px,92%);
            max-height:90vh;
            overflow:auto;
            background:
                linear-gradient(
                    145deg,
                    rgba(7,18,22,.98),
                    rgba(2,8,11,.98)
                );
            border:1px solid #45646c;
            border-radius:20px;
            padding:35px;
            color:#f2f4ef;
            box-shadow:0 25px 70px #000;
            text-align:center;
        }

        .hook-panel h1 {
            margin:0 0 15px;
            font-size:clamp(30px,5vw,60px);
        }

        .hook-panel h2 {
            margin:10px 0;
        }

        .hook-panel p {
            color:#c7d0ce;
            line-height:1.6;
        }

        .hook-game-label {
            color:#62d9d5;
            font-weight:900;
            letter-spacing:2px;
            margin-bottom:10px;
        }

        .hook-xp {
            font-size:40px;
            font-weight:900;
            color:#9bd83f;
            margin:20px 0;
        }

        .hook-grid {
            display:grid;
            grid-template-columns:
                repeat(3,minmax(0,1fr));
            gap:16px;
            margin:25px 0;
        }

        .hook-card {
            background:#0d1b20;
            border:1px solid #294047;
            border-radius:14px;
            padding:18px;
        }

        .hook-card strong {
            display:block;
            margin-bottom:8px;
            color:#9bd83f;
        }

        .hook-scanner {
            display:grid;
            grid-template-columns:
                repeat(3,minmax(0,1fr));
            gap:12px;
            margin:20px 0;
        }

        .hook-reading {
            background:#0b171b;
            border:1px solid #294047;
            border-radius:10px;
            padding:12px;
        }

        .hook-reading span {
            display:block;
            font-size:11px;
            color:#8fa19e;
            margin-bottom:5px;
        }

        .hook-reading strong {
            font-size:18px;
        }

        .hook-choices {
            display:grid;
            grid-template-columns:
                repeat(3,minmax(0,1fr));
            gap:15px;
            margin:20px 0;
        }

        .hook-choice {
            background:#081317;
            color:white;
            border:2px solid #294047;
            border-radius:14px;
            padding:10px;
            cursor:pointer;
            transition:.15s;
        }

        .hook-choice:hover {
            border-color:#9bd83f;
            transform:translateY(-2px);
        }

        .hook-choice.selected {
            border-color:#9bd83f;
            box-shadow:
                0 0 20px rgba(155,216,63,.35);
        }

        .hook-choice img {
            width:100%;
            height:150px;
            object-fit:contain;
            display:block;
            margin:auto;
        }

        .hook-choice span {
            display:block;
            margin-top:8px;
            font-weight:900;
        }

        .hook-status {
            padding:14px;
            border-radius:10px;
            background:#071013;
            border:1px solid #294047;
            margin:15px 0;
        }

        .hook-progress {
            width:100%;
            height:18px;
            background:#101d21;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #294047;
            margin:15px 0;
        }

        .hook-progress-fill {
            height:100%;
            width:0%;
            background:#9bd83f;
            transition:.2s;
        }

        .hook-big-button {
            width:min(500px,100%);
            margin:15px auto;
            padding:18px;
            font-size:20px;
            font-weight:900;
            cursor:pointer;
            border-radius:12px;
            border:1px solid #7cae35;
            background:#315e14;
            color:white;
        }

        .hook-big-button:disabled {
            opacity:.4;
            cursor:not-allowed;
        }

        .hook-success {
            color:#9bd83f;
            font-weight:900;
            font-size:22px;
            margin:15px 0;
        }

        .hook-danger {
            color:#e1a153;
            font-weight:900;
        }

        .hook-final-score {
            font-size:clamp(55px,10vw,110px);
            color:#9bd83f;
            font-weight:950;
            line-height:1;
            margin:15px 0;
        }

        .hook-rank {
            color:#e1a153;
            font-size:25px;
            font-weight:900;
            margin:15px 0;
        }

        @media(max-width:800px) {

            .hook-grid,
            .hook-scanner,
            .hook-choices {
                grid-template-columns:1fr;
            }

            .hook-overlay {
                padding:20px;
            }

            .hook-button {
                min-width:0;
                width:90%;
                font-size:18px;
            }

            .hook-panel {
                padding:20px;
            }
        }
    `;

    document.head.appendChild(style);


    /* =================================================
       UTILITY FUNCTIONS
    ================================================= */

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


    function image(src, className = "hook-bg") {

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


    function button(text, callback) {

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

        state.xp += amount;

        if (state.xp < 0) {
            state.xp = 0;
        }
    }


    function showScreen(screen) {

        document
            .querySelectorAll(".hook-screen")
            .forEach(s => {
                s.classList.remove("active");
            });

        screen.classList.add("active");

        state.currentScreen =
            screen.id;

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    }


    /* =================================================
       MISSION 03 FRONT PAGE
    ================================================= */

    function showMissionFront() {

        clearContainer();

        const screen =
            createScreen("mission-screen");

        const img =
            image(
                ASSETS.mission
            );

        screen.appendChild(img);

        const overlay =
            document.createElement("div");

        overlay.className =
            "hook-overlay";

        const begin =
            button(
                "BEGIN MISSION 3 →",
                () => {
                    showGame1Intro();
                }
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


    /* =================================================
       GAME 1 INTRO
    ================================================= */

    function showGame1Intro() {

        clearContainer();

        const screen =
            createScreen("game1-intro-screen");

        const img =
            image(
                ASSETS.game1Intro
            );

        screen.appendChild(img);

        const overlay =
            document.createElement("div");

        overlay.className =
            "hook-overlay";

        const start =
            button(
                "START WATER READING",
                () => {
                    showGame1How();
                }
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


    /* =================================================
       GAME 1 HOW TO PLAY
    ================================================= */

    function showGame1How() {

        clearContainer();

        const screen =
            createScreen("game1-how-screen");

        const panel =
            document.createElement("div");

        panel.className =
            "hook-panel";

        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 01
            </div>

            <h1>HOW TO PLAY</h1>

            <p>
                Read the water.
                Study the clues.
                Choose the best spot.
            </p>

            <div class="hook-grid">

                <div class="hook-card">
                    <strong>👁️ OBSERVE</strong>
                    Study current,
                    structure, surface
                    activity and fish signs.
                </div>

                <div class="hook-card">
                    <strong>🧠 ANALYSE</strong>
                    Use the Angler Scanner
                    and your instincts.
                </div>

                <div class="hook-card">
                    <strong>🎣 DECIDE</strong>
                    Choose the best
                    spot to cast.
                    One cast per round.
                </div>

            </div>

            <div class="hook-status">
                <strong>
                    MASTER ANGLER TIP
                </strong>
                <br><br>
                Fish go where food is,
                and stay where it feels safe.
                Look for structure,
                current breaks and bait activity.
            </div>

        `;

        const ready =
            button(
                "GOT IT, LET'S GO!",
                () => {
                    startGame1();
                }
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


    /* =================================================
       GAME 1 — WATER READING
    ================================================= */

    const rounds = [

        {
            title:
                "ROUND 1 — FIND THE FEEDING ZONE",

            difficulty:
                "EASY",

            correct:
                1,

            xp:
                100,

            scanner: {
                current:"MODERATE",
                depth:"3.2 M",
                temp:"24°C",
                surface:"ACTIVE",
                bait:"HIGH",
                structure:"LOW"
            },

            assets:
                ASSETS.round1
        },

        {
            title:
                "ROUND 2 — READ THE CURRENT",

            difficulty:
                "MEDIUM",

            correct:
                1,

            xp:
                150,

            scanner: {
                current:"CURRENT BREAK",
                depth:"4.8 M",
                temp:"23°C",
                surface:"CALM",
                bait:"MEDIUM",
                structure:"HIGH"
            },

            assets:
                ASSETS.round2
        },

        {
            title:
                "ROUND 3 — THE FINAL READ",

            difficulty:
                "HARD",

            correct:
                1,

            xp:
                300,

            scanner: {
                current:"SUBTLE",
                depth:"6.1 M",
                temp:"22°C",
                surface:"RIPPLED",
                bait:"MEDIUM",
                structure:"HIGH"
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
            rounds[state.game1Round];

        clearContainer();

        const screen =
            createScreen(
                "game1-round-screen"
            );

        const panel =
            document.createElement("div");

        panel.className =
            "hook-panel";

        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 01
            </div>

            <h1>ANGLER SCANNER</h1>

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
                    <strong id="read-current">
                        —
                    </strong>
                </div>

                <div class="hook-reading">
                    <span>DEPTH</span>
                    <strong id="read-depth">
                        —
                    </strong>
                </div>

                <div class="hook-reading">
                    <span>WATER TEMP</span>
                    <strong id="read-temp">
                        —
                    </strong>
                </div>

                <div class="hook-reading">
                    <span>SURFACE</span>
                    <strong id="read-surface">
                        —
                    </strong>
                </div>

                <div class="hook-reading">
                    <span>BAIT</span>
                    <strong id="read-bait">
                        —
                    </strong>
                </div>

                <div class="hook-reading">
                    <span>STRUCTURE</span>
                    <strong id="read-structure">
                        —
                    </strong>
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
            >
                USE SCANNER — 1 CHARGE
            </button>

            <h2>
                ${round.title}
            </h2>

            <p>
                WHERE WOULD YOU CAST?
            </p>

            <div
                id="choices"
                class="hook-choices"
            ></div>

            <p
                id="round-message"
                class="hook-status"
            >
                Study the clues before choosing.
            </p>

        `;


        const choices =
            panel.querySelector(
                "#choices"
            );


        round.assets.forEach(
            (src,index) => {

                const choice =
                    document.createElement(
                        "button"
                    );

                choice.type =
                    "button";

                choice.className =
                    "hook-choice";

                const img =
                    image(
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
                                c =>
                                    c.classList
                                        .remove(
                                            "selected"
                                        )
                            );

                        choice.classList.add(
                            "selected"
                        );

                        choice.dataset.selected =
                            index;

                        const cast =
                            document.createElement(
                                "button"
                            );

                        cast.type =
                            "button";

                        cast.className =
                            "hook-big-button";

                        cast.textContent =
                            "🎣 CAST HERE";

                        const old =
                            panel.querySelector(
                                "#cast-button"
                            );

                        if (old) {
                            old.remove();
                        }

                        cast.id =
                            "cast-button";

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
                            .disabled = true;
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


    function resolveWaterRound(
        selected,
        panel
    ) {

        const round =
            rounds[state.game1Round];

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

            message.innerHTML =
                `
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

            message.innerHTML =
                `
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
                document.createElement(
                    "button"
                );

            next.type =
                "button";

            next.className =
                "hook-big-button";

            next.textContent =
                "NEXT ROUND →";

            next.addEventListener(
                "click",
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
                document.createElement(
                    "button"
                );

            finish.type =
                "button";

            finish.className =
                "hook-big-button";

            finish.textContent =
                "VIEW WATER READING SCORE →";

            finish.addEventListener(
                "click",
                showGame1Complete
            );

            panel.appendChild(
                finish
            );
        }
    }


    /* =================================================
       GAME 1 COMPLETE
    ================================================= */

    function showGame1Complete() {

        clearContainer();

        const screen =
            createScreen(
                "game1-complete-screen"
            );

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "hook-panel";

        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 01 COMPLETE
            </div>

            <h1>
                🌊 WATER READING COMPLETE!
            </h1>

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

            <p>
                You didn't just see the water.
            </p>

            <p>
                <strong>
                    You understood it.
                </strong>
            </p>

            <div class="hook-xp">
                ${state.game1XP} XP
            </div>

            <p>
                ${
                    state.game1Correct === 3
                    ? "MASTER ANGLER INSTINCTS: CONFIRMED"
                    : "GOOD READ. THE EXPEDITION CONTINUES."
                }
            </p>

        `;

        const next =
            button(
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


    /* =================================================
       GAME 2 — THE FINAL CATCH
    ================================================= */

    function showGame2() {

        clearContainer();

        state.game2Progress = 0;
        state.game2Started = false;

        const screen =
            createScreen(
                "game2-screen"
            );

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "hook-panel";

        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 02
            </div>

            <h1>
                THE FINAL CATCH
            </h1>

            <p>
                ONE LEGENDARY FISH.
                ONE CHANCE.
            </p>

            <img
                src="${ASSETS.game2}"
                style="
                    width:min(900px,100%);
                    max-height:350px;
                    object-fit:contain;
                    border-radius:12px;
                    margin:10px auto;
                "
                alt="Game 2"
            >

            <div class="hook-card">

                <strong>
                    LEGENDARY TARGET
                </strong>

                🐟 SPECIES: UNKNOWN
                <br>
                SIZE: HUGE
                <br>
                DIFFICULTY: ★★★★★
                <br>
                WEIGHT: 30.0 KG

            </div>

            <p>
                Keep the tension in the
                green zone and wear the fish down.
            </p>

            <div class="hook-progress">
                <div
                    id="fish-progress"
                    class="hook-progress-fill"
                ></div>
            </div>

            <p id="fish-message">
                Ready to cast?
            </p>

        `;


        const start =
            document.createElement(
                "button"
            );

        start.type =
            "button";

        start.className =
            "hook-big-button";

        start.textContent =
            "🎣 CAST FOR THE LEGENDARY FISH";


        start.addEventListener(
            "click",
            () => {

                if (
                    state.game2Started
                ) {
                    return;
                }

                state.game2Started =
                    true;

                start.disabled =
                    true;

                fishBattle(
                    panel
                );

            }
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


    function fishBattle(panel) {

        let progress = 0;

        const bar =
            panel.querySelector(
                "#fish-progress"
            );

        const message =
            panel.querySelector(
                "#fish-message"
            );


        const interval =
            setInterval(
                () => {

                    progress +=
                        Math.floor(
                            Math.random() * 12
                        ) + 5;

                    if (
                        progress > 100
                    ) {
                        progress = 100;
                    }

                    bar.style.width =
                        progress + "%";


                    if (
                        progress < 25
                    ) {

                        message.textContent =
                            "THE BITE! SET THE HOOK!";

                    } else if (
                        progress < 50
                    ) {

                        message.textContent =
                            "THE FISH IS RUNNING! MANAGE THE LINE!";

                    } else if (
                        progress < 75
                    ) {

                        message.textContent =
                            "KEEP THE TENSION STEADY!";

                    } else if (
                        progress < 100
                    ) {

                        message.textContent =
                            "THE FISH IS TIRED! BRING IT IN!";

                    } else {

                        clearInterval(
                            interval
                        );

                        completeGame2(
                            panel
                        );
                    }

                },
                450
            );
    }


    /* =================================================
       GAME 2 COMPLETE
    ================================================= */

    function completeGame2(panel) {

        state.game2XP =
            500;

        addXP(500);

        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 02 — COMPLETE
            </div>

            <h1>
                🐟 LEGENDARY CATCH!
            </h1>

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
                    <strong>DIFFICULTY</strong>
                    ★★★★★
                </div>

            </div>

            <div class="hook-xp">
                +500 XP
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

            <p class="hook-success">
                MASTER ANGLER STATUS MAINTAINED.
            </p>

        `;

        const next =
            button(
                "CONTINUE TO GAME 03 →",
                showGame3Intro
            );

        panel.appendChild(
            next
        );
    }


    /* =================================================
       GAME 3 INTRO
    ================================================= */

    function showGame3Intro() {

        clearContainer();

        const screen =
            createScreen(
                "game3-intro-screen"
            );

        const img =
            image(
                ASSETS.game3
            );

        screen.appendChild(
            img
        );

        const overlay =
            document.createElement(
                "div"
            );

        overlay.className =
            "hook-overlay";

        const start =
            button(
                "START CAMPING CHALLENGE →",
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


    /* =================================================
       GAME 3 — CAMP AFTER DARK
    ================================================= */

    function startGame3() {

        state.campFire =
            false;

        state.campTent =
            false;

        state.campGear =
            false;

        state.campStorm =
            false;

        clearContainer();

        const screen =
            createScreen(
                "game3-screen"
            );

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "hook-panel";

        panel.innerHTML = `

            <div class="hook-game-label">
                MISSION 03 • GAME 03
            </div>

            <h1>
                CAMP AFTER DARK
            </h1>

            <p>
                The sun has gone down.
                Your legendary catch is secured.
            </p>

            <p>
                Now make camp.
            </p>

            <div class="hook-grid">

                <div
                    id="fire-card"
                    class="hook-card"
                >
                    <strong>
                        🔥 TASK 1
                    </strong>

                    Build the fire.

                    <br><br>

                    <button
                        id="fire-btn"
                        class="hook-big-button"
                    >
                        LIGHT FIRE
                    </button>

                </div>


                <div
                    id="tent-card"
                    class="hook-card"
                >
                    <strong>
                        🏕️ TASK 2
                    </strong>

                    Secure the campsite.

                    <br><br>

                    <button
                        id="tent-btn"
                        class="hook-big-button"
                        disabled
                    >
                        SECURE TENT
                    </button>

                </div>


                <div
                    id="gear-card"
                    class="hook-card"
                >
                    <strong>
                        🎒 TASK 3
                    </strong>

                    Protect the fishing gear.

                    <br><br>

                    <button
                        id="gear-btn"
                        class="hook-big-button"
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

            <p
                id="camp-message"
                class="hook-status"
            >
                Prepare the campsite before the weather changes.
            </p>

        `;


        panel
            .querySelector(
                "#fire-btn"
            )
            .addEventListener(
                "click",
                () => {

                    state.campFire =
                        true;

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
                        ).textContent =
                        "Fire started. Now secure the tent.";

                }
            );


        panel
            .querySelector(
                "#tent-btn"
            )
            .addEventListener(
                "click",
                () => {

                    state.campTent =
                        true;

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
                        ).textContent =
                        "Tent secured. Protect the fishing gear.";

                }
            );


        panel
            .querySelector(
                "#gear-btn"
            )
            .addEventListener(
                "click",
                () => {

                    state.campGear =
                        true;

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

                    state.campStorm =
                        true;

                    panel
                        .querySelector(
                            "#camp-message"
                        ).innerHTML =
                        `
                            <span class="hook-success">
                                ⚠ STORM APPROACHING
                            </span>
                            <br><br>
                            Your camp is prepared.
                        `;

                    setTimeout(
                        () => {
                            completeGame3();
                        },
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


    /* =================================================
       GAME 3 COMPLETE
    ================================================= */

    function completeGame3() {

        state.game3XP =
            400;

        addXP(400);

        clearContainer();

        const screen =
            createScreen(
                "game3-complete-screen"
            );

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "hook-panel";

        panel.innerHTML = `

            <div class="hook-game-label">
                GAME 03 COMPLETE
            </div>

            <h1>
                🏕️ CAMP SECURED!
            </h1>

            <div class="hook-grid">

                <div class="hook-card">
                    <strong>
                        🔥 FIRE STARTED
                    </strong>
                    ✓ COMPLETE
                </div>

                <div class="hook-card">
                    <strong>
                        🏕️ TENT SECURED
                    </strong>
                    ✓ COMPLETE
                </div>

                <div class="hook-card">
                    <strong>
                        🌧️ STORM SURVIVED
                    </strong>
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

        const finalButton =
            button(
                "🏆 VIEW FINAL EXPEDITION REPORT",
                showFinalReport
            );

        panel.appendChild(
            finalButton
        );

        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);
    }


    /* =================================================
       FINAL EXPEDITION REPORT
    ================================================= */

    function showFinalReport() {

        clearContainer();

        const screen =
            createScreen(
                "final-report-screen"
            );

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "hook-panel";

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
                    ${state.game1XP} XP
                </div>

                <div class="hook-card">
                    <strong>
                        🎣 THE FINAL CATCH
                    </strong>
                    ${state.game2XP} XP
                </div>

                <div class="hook-card">
                    <strong>
                        🏕️ CAMP AFTER DARK
                    </strong>
                    ${state.game3XP} XP
                </div>

            </div>

            <p>
                TOTAL SCORE
            </p>

            <div class="hook-final-score">
                ${state.xp} XP
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


        const replay =
            button(
                "PLAY MISSION 3 AGAIN",
                showMissionFront
            );

        panel.appendChild(
            replay
        );

        screen.appendChild(
            panel
        );

        container.appendChild(
            screen
        );

        showScreen(screen);
    }


    /* =================================================
       START
    ================================================= */

    showMissionFront();

});
