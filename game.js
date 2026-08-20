/* =========================================================
   GLOBAL HELPERS
========================================================= */

const $ = id => document.getElementById(id);

function show(id){
  document.querySelectorAll(".screen").forEach(screen=>{
    screen.classList.remove("active");
  });

  $(id).classList.add("active");

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}


/* =========================================================
   MISSION INTRO
========================================================= */

$("begin").onclick = ()=>{
  show("game1");
};


/* =========================================================
   GAME 01 — READ THE WATER
========================================================= */

const rounds = [

  {
    title:"ROUND 1 — FIND THE FEEDING ZONE",
    diff:"EASY",
    xp:100,
    correct:"B",

    scan:{
      current:"→ Moderate",
      depth:"4–6 m",
      temp:"25.8°C • OPTIMAL",
      surface:"HIGH",
      bait:"🐟 HIGH",
      structure:"Rocky / submerged rocks"
    },

    choices:[
      [
        "A",
        "CALM WATER",
        [
          "Smooth surface",
          "No activity"
        ],
        "calm"
      ],

      [
        "B",
        "SURFACE ACTIVITY",
        [
          "Ripples on surface",
          "Birds feeding",
          "Baitfish around"
        ],
        "feed"
      ],

      [
        "C",
        "STRONG CURRENT",
        [
          "Heavy current",
          "Waves crashing"
        ],
        "surf"
      ]
    ]
  },


  {
    title:"ROUND 2 — READ THE CURRENT",
    diff:"MEDIUM",
    xp:150,
    correct:"B",

    scan:{
      current:"→ Moderate → Strong",
      depth:"5–6 m",
      temp:"24.9°C",
      surface:"MODERATE",
      bait:"🐟 MODERATE",
      structure:"HIGH"
    },

    choices:[
      [
        "A",
        "FAST CURRENT",
        [
          "Water moving fast",
          "Hard to hold"
        ],
        "fast"
      ],

      [
        "B",
        "CURRENT BREAK",
        [
          "Fast meets slow",
          "Fish can rest",
          "Food flows in"
        ],
        "break"
      ],

      [
        "C",
        "DEAD WATER",
        [
          "Very little flow",
          "Less food"
        ],
        "dead"
      ]
    ]
  },


  {
    title:"ROUND 3 — THE FINAL READ",
    diff:"HARD",
    xp:300,
    correct:"B",

    scan:{
      current:"→ Moderate",
      depth:"6–9 m",
      temp:"24.3°C",
      surface:"LOW",
      bait:"🐟 MODERATE",
      structure:"HIGH"
    },

    choices:[
      [
        "A",
        "OPEN WATER",
        [
          "Deep and dark",
          "No structure"
        ],
        "open"
      ],

      [
        "B",
        "ROCKY EDGE",
        [
          "Structure nearby",
          "Subtle current",
          "Occasional ripples"
        ],
        "rocky"
      ],

      [
        "C",
        "HEAVY SURF",
        [
          "Too much noise",
          "Chaotic water"
        ],
        "heavy"
      ]
    ]
  }

];


let totalWaterXP = 0;

let g1 = {
  started:false,
  round:0,
  choice:null,
  charges:3,
  scanned:false,
  scores:[0,0,0],
  timer:null,
  time:0,
  done:false
};


/* =========================================================
   WATER SCENE
========================================================= */

function scene(type,night){

  let x = "";

  if(type === "feed"){
    x += `
      <i class="bird b1">⌁</i>
      <i class="bird b2">⌁</i>
      <i class="bird b3">⌁</i>
      <i class="ripple ri1"></i>
      <i class="ripple ri2"></i>
    `;
  }

  if([
    "surf",
    "fast",
    "break",
    "rocky",
    "heavy"
  ].includes(type)){
    x += `
      <i class="rock r1"></i>
      <i class="rock r2"></i>
    `;
  }

  if(type === "break" || type === "rocky"){
    x += `
      <i class="ripple ri1"></i>
      <i class="ripple ri2"></i>
    `;
  }

  if(night){
    x += `<i class="moon"></i>`;
  }

  return `
    <div class="scene">
      ${x}
    </div>
  `;
}


/* =========================================================
   RENDER WATER ROUNDS
========================================================= */

function renderRounds(){

  $("rounds").innerHTML = rounds.map((r,i)=>{

    const active =
      g1.started &&
      i === g1.round;

    return `
      <article class="round ${active ? "" : "locked"}">

        <div class="roundHead">

          <span>
            ${r.title}
          </span>

          <small>
            ${r.diff}
          </small>

        </div>


        <div class="roundMeta">

          <span>
            WHERE WOULD YOU CAST?
          </span>

          <span>
            CAST ${i+1} / 3
          </span>

        </div>


        <div
          style="
            text-align:center;
            font-size:9px;
            font-weight:900;
            margin:10px 0;
          "
        >
          CHOOSE THE BEST SPOT
        </div>


        <div class="choices">

          ${r.choices.map(c=>`

            <button
              class="choice"
              data-r="${i}"
              data-c="${c[0]}"
              ${active ? "" : "disabled"}
            >

              <b
                style="
                  position:absolute;
                  z-index:5;
                  margin:6px;
                  width:21px;
                  height:21px;
                  border-radius:50%;
                  background:#000b;
                  text-align:center;
                  padding-top:3px;
                  font-size:9px;
                "
              >
                ${c[0]}
              </b>

              ${scene(c[3],i===2)}

              <div class="choiceText">

                <b>
                  ${c[1]}
                </b>

                <ul>
                  ${c[2]
                    .map(v=>`<li>${v}</li>`)
                    .join("")
                  }
                </ul>

              </div>

            </button>

          `).join("")}

        </div>


        <div class="roundBottom">

          <div class="look">
            LOOK FOR:<br>
            ⌁ CURRENT • ◇ STRUCTURE
            • 🐟 BAIT • BIRDS
          </div>

          <button
            class="cast"
            data-cast="${i}"
            disabled
          >
            CAST HERE
          </button>

        </div>


        <div
          class="result"
          id="result${i}"
        >
          Awaiting your read...
        </div>

      </article>
    `;

  }).join("");


  document.querySelectorAll("[data-c]").forEach(button=>{
    button.onclick = ()=>{
      selectWater(
        Number(button.dataset.r),
        button.dataset.c
      );
    };
  });


  document.querySelectorAll("[data-cast]").forEach(button=>{
    button.onclick = ()=>{
      castWater(
        Number(button.dataset.cast)
      );
    };
  });

}


/* =========================================================
   SCANNER
========================================================= */

function updateScanner(data=null){

  const ids = [
    "scanCurrent",
    "scanDepth",
    "scanTemp",
    "scanSurface",
    "scanBait",
    "scanStructure"
  ];

  ids.forEach((id,i)=>{
    $(id).textContent =
      data
        ? Object.values(data)[i]
        : "—";
  });


  document.querySelectorAll(".charge").forEach((charge,i)=>{
    charge.classList.toggle(
      "off",
      i >= g1.charges
    );
  });


  $("scanBtn").disabled =
    !g1.started ||
    g1.scanned ||
    g1.charges < 1;


  if(g1.scanned){

    $("scanBtn").textContent =
      "SCANNER USED THIS ROUND";

  }
  else if(g1.charges){

    $("scanBtn").textContent =
      "USE SCANNER — 1 CHARGE";

  }
  else{

    $("scanBtn").textContent =
      "NO CHARGES LEFT";

  }

}


/* =========================================================
   START WATER
========================================================= */

function startWater(){

  if(g1.started) return;

  g1.started = true;
  g1.round = 0;
  g1.charges = 3;
  g1.scores = [0,0,0];
  g1.done = false;

  $("startWater").disabled = true;
  $("startWater2").disabled = true;

  activateRound(0);
}


/* =========================================================
   ACTIVATE ROUND
========================================================= */

function activateRound(i){

  clearInterval(g1.timer);

  g1.round = i;
  g1.choice = null;
  g1.scanned = false;

  g1.time =
    rounds[i].diff === "EASY"
      ? 30
      : rounds[i].diff === "MEDIUM"
        ? 40
        : 45;

  renderRounds();
  updateScanner();


  g1.timer = setInterval(()=>{

    g1.time--;

    if(g1.time <= 0){

      clearInterval(g1.timer);

      resolveWater(
        i,
        null,
        true
      );

    }

  },1000);

}


/* =========================================================
   SELECT WATER
========================================================= */

function selectWater(i,c){

  if(i !== g1.round) return;

  g1.choice = c;

  document
    .querySelectorAll(`[data-r="${i}"]`)
    .forEach(button=>{
      button.classList.toggle(
        "selected",
        button.dataset.c === c
      );
    });


  const cast =
    document.querySelector(
      `[data-cast="${i}"]`
    );

  cast.disabled = false;

  cast.textContent =
    `CAST ${c} HERE`;

}


/* =========================================================
   RESOLVE WATER
========================================================= */

function resolveWater(
  i,
  c,
  timeout=false
){

  if(i !== g1.round || g1.done){
    return;
  }

  const r = rounds[i];

  const correct =
    c === r.correct;

  g1.scores[i] =
    correct
      ? r.xp
      : 0;


  totalWaterXP =
    g1.scores.reduce(
      (a,b)=>a+b,
      0
    );


  $("g1xpTop").textContent =
    totalWaterXP;

  $("g1score").textContent =
    `${totalWaterXP} / 550`;


  $(`s${i+1}`).textContent =
    correct
      ? "✓"
      : "×";


  const result =
    $(`result${i}`);

  result.className =
    "result " +
    (
      correct
        ? "ok"
        : "bad"
    );


  result.innerHTML =
    correct
      ? `
        <b>
          ${
            i === 2
              ? "PERFECT READ!"
              : "GOOD READ!"
          }
        </b>

        <span>
          +${r.xp} XP
        </span>
      `
      : `
        <b>
          ${
            timeout
              ? "TIME'S UP"
              : "NO BITE."
          }
        </b>

        <span>
          +0 XP
        </span>
      `;


  document
    .querySelectorAll(`[data-r="${i}"]`)
    .forEach(button=>{

      button.disabled = true;

      if(
        correct &&
        button.dataset.c === r.correct
      ){
        button.classList.add("correct");
      }

      if(
        !correct &&
        button.dataset.c === c
      ){
        button.classList.add("wrong");
      }

    });


  if(correct){

    $("goodTitle").textContent =
      i === 2
        ? "PERFECT READ!"
        : "GOOD READ!";


    $("goodText").textContent =
      i === 1
        ? "You understood the current break."
        : i === 2
          ? "You found the right holding spot."
          : "You found the feeding zone.";


    $("goodXP").textContent =
      `+${r.xp} XP`;

  }
  else{

    $("badTitle").textContent =
      timeout
        ? "TIME'S UP."
        : "NO BITE.";


    $("badText").textContent =
      timeout
        ? "Trust your instincts next time."
        : "Read the clues and look for the strongest signs.";

  }


  updateScanner();


  setTimeout(()=>{

    if(i < 2){

      activateRound(i+1);

    }
    else{

      finishWater();

    }

  },950);

}


/* =========================================================
   CAST
========================================================= */

function castWater(i){

  if(g1.choice){

    clearInterval(g1.timer);

    resolveWater(
      i,
      g1.choice
    );

  }

}


/* =========================================================
   FINISH WATER
========================================================= */

function finishWater(){

  g1.done = true;

  updateScanner();


  $("g1message").innerHTML =
    totalWaterXP === 550
      ? `
        You didn't just see the water.
        <br>
        <b>
          You understood it.
        </b>
      `
      : `
        Water reading complete.
        <br>
        <b>
          Instincts confirmed.
        </b>
      `;


  $("toG2").disabled = false;

  renderRounds();

}


/* =========================================================
   WATER BUTTONS
========================================================= */

$("startWater").onclick =
  startWater;

$("startWater2").onclick =
  startWater;


$("scanBtn").onclick = ()=>{

  if(
    g1.charges > 0 &&
    !g1.scanned
  ){

    g1.charges--;
    g1.scanned = true;

    updateScanner(
      rounds[g1.round].scan
    );

  }

};


$("toG2").onclick = ()=>{

  show("game2");

  startG2();

};


renderRounds();
updateScanner();


/* =========================================================
   GAME 02 — THE FINAL CATCH
========================================================= */

const phases = [

  [
    "1. THE BITE",
    "The fish is interested... Be ready!"
  ],

  [
    "2. THE RUN",
    "It's making a run! Don't panic."
  ],

  [
    "3. THE FIGHT",
    "Keep the tension steady!"
  ],

  [
    "4. WEAR IT DOWN",
    "It's getting tired. Don't give up!"
  ],

  [
    "5. THE LANDING",
    "One last push. You've got this!"
  ]

];


let g2 = {
  started:false,
  phase:0,
  line:100,
  stamina:100,
  pos:50,
  hold:false,
  ticks:0,
  timer:null
};


/* =========================================================
   START GAME 2
========================================================= */

function startG2(){

  if(g2.started) return;

  g2.started = true;
  g2.phase = 0;
  g2.line = 100;
  g2.stamina = 100;
  g2.pos = 50;
  g2.ticks = 0;

  $("reel").disabled = false;
  $("release").disabled = false;

  $("catch").classList.add("hidden");

  updateG2();
  g2Loop();

}


/* =========================================================
   UPDATE GAME 2
========================================================= */

function updateG2(){

  $("phaseTitle").textContent =
    phases[g2.phase][0];

  $("phaseDesc").textContent =
    phases[g2.phase][1];


  $("marker").style.left =
    Math.max(
      2,
      Math.min(
        98,
        g2.pos
      )
    ) + "%";


  $("lineText").textContent =
    Math.round(g2.line) + "%";

  $("lineSide").textContent =
    Math.round(g2.line) + "%";


  $("lineBar").style.width =
    Math.max(
      0,
      g2.line
    ) + "%";


  $("stamina").style.width =
    Math.max(
      0,
      g2.stamina
    ) + "%";


  for(
    let i=1;
    i<=5;
    i++
  ){

    $("p"+i).className =
      "pbox " +

      (
        i-1 < g2.phase
          ? "done "
          : ""
      ) +

      (
        i-1 === g2.phase
          ? "active"
          : ""
      );

  }

}


/* =========================================================
   GAME 2 LOOP
========================================================= */

function g2Loop(){

  clearInterval(g2.timer);

  g2.timer =
    setInterval(()=>{

      if(!g2.started) return;


      g2.pos +=
        Math.sin(Date.now()/400) * 2.8 +

        (
          g2.hold
            ? (50-g2.pos)*.18
            : 0
        );


      g2.pos =
        Math.max(
          2,
          Math.min(
            98,
            g2.pos
          )
        );


      const perfect =
        g2.pos >= 43 &&
        g2.pos <= 57;


      if(g2.hold){

        if(perfect){

          g2.stamina -= 0.75;

        }
        else{

          g2.line -= 0.8;

        }

      }
      else{

        g2.line +=
          Math.random() * 0.35;

      }


      g2.line =
        Math.max(
          0,
          Math.min(
            100,
            g2.line
          )
        );


      g2.stamina =
        Math.max(
          0,
          g2.stamina
        );


      g2.ticks++;


      if(g2.stamina <= 0){

        finishG2();

        return;

      }


      if(g2.line <= 0){

        loseG2();

        return;

      }


      if(
        g2.ticks % 65 === 0 &&
        g2.phase < 4
      ){

        g2.phase++;

      }


      updateG2();

    },100);

}


/* =========================================================
   REEL BUTTON
========================================================= */

$("reel").onpointerdown = e=>{
  e.preventDefault();
  g2.hold = true;
  $("reel").setPointerCapture?.(e.pointerId);
};

$("reel").onpointerup = e=>{
  e.preventDefault();
  g2.hold = false;
};

$("reel").onpointercancel = ()=>{
  g2.hold = false;
};

$("reel").onpointerleave = e=>{
  if(e.pointerType === "mouse"){
    g2.hold = false;
  }
};


/* =========================================================
   RELEASE
========================================================= */

$("release").onclick = ()=>{

  g2.hold = false;

  g2.line =
    Math.min(
      100,
      g2.line + 5
    );

  updateG2();

};


/* =========================================================
   FINISH GAME 2
========================================================= */

function finishG2(){

  clearInterval(g2.timer);

  g2.started = false;

  $("reel").disabled = true;
  $("release").disabled = true;

  $("phaseTitle").textContent =
    "LEGENDARY CATCH";

  $("phaseDesc").textContent =
    "You wore it down. Now land it.";

  $("catch").classList.remove("hidden");

  $("stamina").style.width = "0%";

}


/* =========================================================
   GAME 2 FAILURE
========================================================= */

function loseG2(){

  clearInterval(g2.timer);

  g2.started = false;

  $("lineText").textContent = "0%";
  $("lineSide").textContent = "0%";

  $("phaseTitle").textContent =
    "THE LINE SNAPPED";

  $("phaseDesc").textContent =
    "The fish got away. Take another shot.";

  $("reel").disabled = true;
  $("release").disabled = true;


  setTimeout(()=>{

    g2.started = false;

    g2.line = 100;
    g2.stamina = 100;
    g2.pos = 50;
    g2.phase = 0;
    g2.ticks = 0;

    $("reel").disabled = false;
    $("release").disabled = false;

    updateG2();
    g2Loop();

  },1800);

}


/* =========================================================
   GAME 2 → GAME 3
========================================================= */

$("toG3").onclick = ()=>{

  clearInterval(g2.timer);

  show("game3");

  startCamp();

};


/* =========================================================
   GAME 03 — CAMP AFTER DARK
========================================================= */

let camp = {
  fireOrder:[],
  fireComplete:false,
  campXP:400,

  secured:{
    tent:false,
    food:false,
    gear:false
  },

  weather:{
    tent:false,
    food:false,
    fishing:false
  },

  weatherStarted:false,
  weatherTime:30,
  weatherTimer:null
};


/* =========================================================
   START CAMP
========================================================= */

function startCamp(){

  camp = {

    fireOrder:[],
    fireComplete:false,
    campXP:400,

    secured:{
      tent:false,
      food:false,
      gear:false
    },

    weather:{
      tent:false,
      food:false,
      fishing:false
    },

    weatherStarted:false,
    weatherTime:30,
    weatherTimer:null

  };


  $("campComplete")
    .classList.add("hidden");


  $("storm")
    .classList.remove("active");


  $("weatherTime")
    .textContent = "00:30";


  $("weatherBar")
    .style.width = "100%";


  $("healthT")
    .textContent = "100%";

  $("energyT")
    .textContent = "85%";

  $("readyT")
    .textContent = "90%";


  $("health")
    .style.width = "100%";

  $("energy")
    .style.width = "85%";

  $("ready")
    .style.width = "90%";


  document.querySelectorAll(".fireItem")
    .forEach(button=>{
      button.disabled = false;
      button.classList.remove(
        "selected",
        "correct",
        "wrong"
      );
    });


  document.querySelectorAll(".weatherItem")
    .forEach(button=>{
      button.disabled = false;
      button.classList.remove("selected");
    });


  document.querySelectorAll(".hot")
    .forEach(button=>{
      button.disabled = false;
      button.classList.remove("selected");
    });


  ["slot1","slot2","slot3","slot4"]
    .forEach((id,i)=>{
      $(id).textContent =
        ["1st","2nd","3rd","4th"][i];
    });


  $("fireMsg").textContent =
    "Start small, then build bigger.";

  $("campMsg").textContent =
    "Secure everything before the weather turns.";

  $("weatherMsg").textContent =
    "Focus on the essentials. Don't get caught in the rain!";


  $("lightFire").disabled = true;

}


/* =========================================================
   FIRE BUILDING
========================================================= */

const fireCorrect = [
  "tinder",
  "starter",
  "kindling",
  "wood"
];


document.querySelectorAll(".fireItem")
  .forEach(button=>{

    button.onclick = ()=>{

      if(camp.fireComplete) return;


      const value =
        button.dataset.fire;


      if(value === "water"){

        $("fireMsg").textContent =
          "💧 Really? We were trying to START the fire. 😂";

        button.classList.add("wrong");

        setTimeout(()=>{
          button.classList.remove("wrong");
        },600);

        return;

      }


      const next =
        fireCorrect[
          camp.fireOrder.length
        ];


      if(value === next){

        camp.fireOrder.push(value);

        button.disabled = true;
        button.classList.add("correct");


        const slot =
          $("slot"+camp.fireOrder.length);

        slot.textContent =
          value === "tinder"
            ? "🍂"
            : value === "kindling"
              ? "🪵"
              : value === "wood"
                ? "🪵"
                : "🔥";


        if(camp.fireOrder.length === 4){

          camp.fireComplete = true;

          $("lightFire").disabled = false;

          $("fireMsg").innerHTML =
            "<b>Perfect build.</b> The fire is ready.";

        }
        else{

          $("fireMsg").textContent =
            camp.fireOrder.length === 1
              ? "Good start. Add the fire starter."
              : camp.fireOrder.length === 2
                ? "Now add the kindling."
                : "Almost there. Add the dry wood.";

        }

      }
      else{

        $("fireMsg").textContent =
          "⚠️ Not yet. Think: small → medium → large.";

        button.classList.add("wrong");

        setTimeout(()=>{
          button.classList.remove("wrong");
        },600);

      }

    };

  });


/* =========================================================
   LIGHT FIRE
========================================================= */

$("lightFire").onclick = ()=>{

  if(!camp.fireComplete) return;

  $("lightFire").disabled = true;

  document
    .querySelector(".fire")
    ?.classList.add("lit");


  $("fireMsg").innerHTML =
    "<b>🔥 FIRE LIT!</b><br>Warm. Safe. Ready for the night.";


  updatePreparedness(10);

  startWeatherTimer();

};


/* =========================================================
   CAMP HOTSPOTS
========================================================= */

document.querySelectorAll(".hot")
  .forEach(button=>{

    button.onclick = ()=>{

      const type =
        button.dataset.hot;


      if(camp.secured[type]) return;


      camp.secured[type] = true;

      button.disabled = true;
      button.classList.add("selected");


      const messages = {

        tent:
          "⛺ Tent secured. Check the pegs and rainfly.",

        food:
          "📦 Food and supplies are protected.",

        gear:
          "🎣 Fishing gear secured from the weather."

      };


      $("campMsg").textContent =
        messages[type];


      updatePreparedness(5);


      if(
        camp.secured.tent &&
        camp.secured.food &&
        camp.secured.gear
      ){

        $("campMsg").innerHTML =
          "<b>🏕️ CAMP SECURED!</b><br>Everything is ready for the night.";

        updatePreparedness(10);

      }

    };

  });


/* =========================================================
   WEATHER TIMER
========================================================= */

function startWeatherTimer(){

  if(camp.weatherStarted) return;

  camp.weatherStarted = true;
  camp.weatherTime = 30;


  clearInterval(
    camp.weatherTimer
  );


  camp.weatherTimer =
    setInterval(()=>{

      camp.weatherTime--;


      $("weatherTime").textContent =
        "00:" +
        String(
          camp.weatherTime
        ).padStart(2,"0");


      $("weatherBar").style.width =
        (
          camp.weatherTime / 30 * 100
        ) + "%";


      if(camp.weatherTime <= 15){

        $("storm").classList.add("active");

        $("weatherMsg").textContent =
          "⚠️ Storm approaching. Secure everything!";

      }


      if(camp.weatherTime <= 5){

        $("weatherMsg").textContent =
          `⚠️ ${camp.weatherTime}...`;

      }


      if(camp.weatherTime <= 0){

        clearInterval(
          camp.weatherTimer
        );

        finishWeather();

      }

    },1000);

}


/* =========================================================
   WEATHER ACTIONS
========================================================= */

document.querySelectorAll(".weatherItem")
  .forEach(button=>{

    button.onclick = ()=>{

      const type =
        button.dataset.weather;


      if(camp.weather[type]) return;


      camp.weather[type] = true;

      button.disabled = true;
      button.classList.add("selected");


      const messages = {

        tent:
          "⛺ Rainfly secured.",

        food:
          "📦 Supplies protected.",

        fishing:
          "🎣 Fishing gear secured."

      };


      $("weatherMsg").textContent =
        messages[type];


      updatePreparedness(3);


      if(
        camp.weather.tent &&
        camp.weather.food &&
        camp.weather.fishing
      ){

        $("weatherMsg").innerHTML =
          "<b>✓ ALL ESSENTIALS SECURED</b><br>You are ready for the storm.";

      }

    };

  });


/* =========================================================
   PREPAREDNESS
========================================================= */

function updatePreparedness(amount){

  const bar = $("ready");

  const current =
    parseFloat(
      bar.style.width
    ) || 90;


  const value =
    Math.min(
      100,
      current + amount
    );


  bar.style.width =
    value + "%";


  $("readyT").textContent =
    Math.round(value) + "%";

}


/* =========================================================
   WEATHER FINISH
========================================================= */

function finishWeather(){

  $("storm").classList.remove("active");

  const securedCount = [
    camp.weather.tent,
    camp.weather.food,
    camp.weather.fishing
  ].filter(Boolean).length;

  /*
    Camp XP is based on the player's actual storm preparation:
    3/3 = 400 XP
    2/3 = 300 XP
    1/3 = 200 XP
    0/3 = 100 XP
  */
  camp.campXP =
    securedCount === 3 ? 400 :
    securedCount === 2 ? 300 :
    securedCount === 1 ? 200 : 100;

  if(securedCount === 3){

    $("weatherMsg").innerHTML =
      "<b>🌧️ CAMP SECURED!</b><br>The storm came. You were ready.";

  }
  else if(securedCount === 2){

    $("weatherMsg").innerHTML =
      "<b>🌧️ STORM SURVIVED.</b><br>Most of the campsite was secured.";

  }
  else if(securedCount === 1){

    $("weatherMsg").innerHTML =
      "<b>🌧️ STORM SURVIVED.</b><br>One essential was secured.";

  }
  else{

    $("weatherMsg").innerHTML =
      "<b>🌧️ THE STORM HIT.</b><br>You survived, but the campsite was exposed.";

  }

  setTimeout(()=>{
    completeCamp();
  },1500);

}


/* =========================================================
   COMPLETE CAMP
========================================================= */

function completeCamp(){

  clearInterval(
    camp.weatherTimer
  );

  $("storm").classList.remove("active");

  document
    .querySelector(".tasks")
    ?.classList.add("hidden");

  $("campComplete")
    .classList.remove("hidden");

  document
    .querySelector(".campHero")
    ?.classList.add("complete");

  const securedCount = [
    camp.weather.tent,
    camp.weather.food,
    camp.weather.fishing
  ].filter(Boolean).length;

  const finalPreparedness =
    Math.min(
      100,
      90 +
      (camp.fireComplete ? 10 : 0) +
      (securedCount * 3)
    );

  $("healthT").textContent = "100%";
  $("energyT").textContent = "70%";
  $("readyT").textContent =
    `${Math.min(100, finalPreparedness)}%`;

  if($("campXP")){
    $("campXP").textContent =
      `+${camp.campXP} XP`;
  }

  const campTitle =
    $("campComplete").querySelector("h1");

  const campCopy =
    $("campComplete").querySelector(".copy");

  const campNight =
    camp.fireComplete &&
    securedCount === 3;

  if(campTitle){
    campTitle.textContent =
      campNight
        ? "CAMP SECURED!"
        : "NIGHT SURVIVED!";
  }

  if(campCopy){
    campCopy.innerHTML =
      campNight
        ? `
          The storm came.<br>
          You were ready.<br><br>
          The tent is safe.<br>
          The gear is protected.<br>
          The fire is still glowing.
        `
        : `
          The storm came.<br>
          You made it through the night.<br><br>
          Some parts of the campsite were left exposed,<br>
          but you kept the expedition going.
        `;
  }

}


/* =========================================================
   CAMP → FINAL REPORT
========================================================= */

$("toFinal").onclick = ()=>{

  show("final");

  updateFinal();

};


/* =========================================================
   FINAL REPORT
========================================================= */

function updateFinal(){

  const total =
    totalWaterXP +
    500 +
    camp.campXP;

  $("finalWater").textContent =
    `+${totalWaterXP} XP`;

  if($("finalCamp")){
    $("finalCamp").textContent =
      `+${camp.campXP} XP`;
  }

  $("totalXP").textContent =
    `${total.toLocaleString()} XP`;

}


/* =========================================================
   INITIAL STATE
========================================================= */

show("intro");
