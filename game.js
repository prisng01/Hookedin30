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
    "One last push. Land your legendary catch!"
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

  timer:null,

  landing:false,

  caught:false
};


/* =========================================================
   START GAME 2
========================================================= */

function startG2(){

  clearInterval(g2.timer);


  g2 = {

    started:true,

    phase:0,

    line:100,

    stamina:100,

    pos:50,

    hold:false,

    ticks:0,

    timer:null,

    landing:false,

    caught:false

  };


  $("reel").disabled = false;
  $("release").disabled = false;


  if($("catch")){

    $("catch")
      .classList.add("hidden");

  }


  updateG2();

  g2Loop();

}


/* =========================================================
   UPDATE GAME 2
========================================================= */

function updateG2(){

  if(!g2.started && !g2.landing){
    return;
  }


  const phase =
    Math.max(
      0,
      Math.min(
        4,
        g2.phase
      )
    );


  $("phaseTitle").textContent =
    phases[phase][0];


  $("phaseDesc").textContent =
    phases[phase][1];


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
    let i = 1;
    i <= 5;
    i++
  ){

    const box =
      $("p" + i);

    if(!box) continue;


    box.className =
      "pbox " +

      (
        i - 1 < phase
          ? "done "
          : ""
      ) +

      (
        i - 1 === phase
          ? "active"
          : ""
      );

  }

}


/* =========================================================
   GAME 2 LOOP
========================================================= */

function g2Loop(){

  clearInterval(
    g2.timer
  );


  g2.timer =
    setInterval(()=>{

      if(
        !g2.started ||
        g2.landing
      ){
        return;
      }


      /*
         Fish movement.

         The fish constantly moves left/right.
         The player must use REEL while the marker
         is inside the green zone.
      */

      g2.pos +=

        Math.sin(
          Date.now() / 400
        ) * 2.8 +

        (
          g2.hold
            ? (50 - g2.pos) * 0.18
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


      /*
         Green zone = 43–57%.
      */

      const perfect =
        g2.pos >= 43 &&
        g2.pos <= 57;


      /*
         REEL:

         Correct tension:
         Wear the fish down.

         Incorrect tension:
         Damage the line.
      */

      if(g2.hold){

        if(perfect){

          g2.stamina -= 0.85;

          /*
             Successful control slightly
             restores line health.
          */

          g2.line =
            Math.min(
              100,
              g2.line + 0.08
            );

        }
        else{

          g2.line -= 0.65;

        }

      }
      else{

        /*
           Not reeling allows the fish
           to recover slightly and keeps
           tension unpredictable.
        */

        g2.line +=
          Math.random() * 0.25;

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


      /*
         Line breaks.
      */

      if(
        g2.line <= 0
      ){

        loseG2();

        return;

      }


      /*
         Fish becomes tired.

         IMPORTANT:
         Do NOT automatically award the catch.

         Instead enter the landing phase.
      */

      if(
        g2.stamina <= 0
      ){

        beginLanding();

        return;

      }


      /*
         Advance phases gradually.
      */

      if(
        g2.ticks % 65 === 0 &&
        g2.phase < 3
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

  if(
    !g2.started ||
    g2.landing
  ){
    return;
  }


  g2.hold = true;


  try{

    $("reel")
      .setPointerCapture(
        e.pointerId
      );

  }
  catch(error){

    /* Pointer capture is optional. */

  }

};


$("reel").onpointerup = e=>{

  e.preventDefault();

  g2.hold = false;

};


$("reel").onpointercancel = ()=>{

  g2.hold = false;

};


$("reel").onpointerleave = e=>{

  if(
    e.pointerType === "mouse"
  ){

    g2.hold = false;

  }

};


/* =========================================================
   RELEASE
========================================================= */

$("release").onclick = ()=>{

  if(
    !g2.started ||
    g2.landing
  ){
    return;
  }


  g2.hold = false;


  /*
     Releasing reduces tension and gives
     the player a small safety recovery.
  */

  g2.line =
    Math.min(
      100,
      g2.line + 4
    );


  updateG2();

};


/* =========================================================
   BEGIN LANDING
========================================================= */

function beginLanding(){

  clearInterval(
    g2.timer
  );


  g2.started = false;

  g2.landing = true;

  g2.hold = false;

  g2.phase = 4;

  g2.stamina = 0;


  $("reel").disabled = true;

  $("release").disabled = true;


  $("phaseTitle").textContent =
    "5. THE LANDING";


  $("phaseDesc").textContent =
    "The legendary fish is exhausted. Land it now!";


  $("stamina").style.width =
    "0%";


  /*
     Reveal the landing control.
  */

  if($("catch")){

    $("catch")
      .classList.remove(
        "hidden"
      );

  }


  updateG2();

}


/* =========================================================
   LAND THE FISH
========================================================= */

function landFish(){

  if(
    !g2.landing ||
    g2.caught
  ){
    return;
  }


  g2.caught = true;

  g2.landing = false;


  clearInterval(
    g2.timer
  );


  /*
     Successful legendary catch.
  */

  $("phaseTitle").textContent =
    "🐟 LEGENDARY CATCH!";


  $("phaseDesc").textContent =
    "You landed the legendary fish!";


  $("lineText").textContent =
    "100%";


  $("lineSide").textContent =
    "100%";


  $("lineBar").style.width =
    "100%";


  $("stamina").style.width =
    "0%";


  /*
     Disable all Game 02 controls.
  */

  $("reel").disabled = true;

  $("release").disabled = true;


  if($("catch")){

    $("catch")
      .classList.add(
        "hidden"
      );

  }


  /*
     Display catch information.
  */

  const weight =
    $("catchWeight");

  const length =
    $("catchLength");

  const difficulty =
    $("catchDifficulty");


  if(weight){

    weight.textContent =
      "30.0 KG";

  }


  if(length){

    length.textContent =
      "112 CM";

  }


  if(difficulty){

    difficulty.textContent =
      "★★★★★";

  }


  /*
     Game 02 always awards 500 XP
     after a successful landing.
  */

  const xp =
    $("catchXP");


  if(xp){

    xp.textContent =
      "+500 XP";

  }


  /*
     Continue button becomes available.
  */

  if($("toG3")){

    $("toG3")
      .disabled = false;

  }

}


/* =========================================================
   GAME 2 FAILURE — LINE SNAPS
========================================================= */

function loseG2(){

  clearInterval(
    g2.timer
  );


  g2.started = false;

  g2.landing = false;

  g2.hold = false;


  $("lineText").textContent =
    "0%";


  $("lineSide").textContent =
    "0%";


  $("lineBar").style.width =
    "0%";


  $("phaseTitle").textContent =
    "THE LINE SNAPPED";


  $("phaseDesc").textContent =
    "The fish got away. Take another shot.";


  $("reel").disabled = true;

  $("release").disabled = true;


  /*
     Reset after a short delay.
  */

  setTimeout(()=>{

    g2 = {

      started:true,

      phase:0,

      line:100,

      stamina:100,

      pos:50,

      hold:false,

      ticks:0,

      timer:null,

      landing:false,

      caught:false

    };


    $("reel").disabled = false;

    $("release").disabled = false;


    if($("catch")){

      $("catch")
        .classList.add(
          "hidden"
        );

    }


    updateG2();

    g2Loop();

  },1800);

}


/* =========================================================
   LANDING BUTTON
========================================================= */

if($("catch")){

  $("catch").onclick =
    landFish;

}


/* =========================================================
   GAME 2 → GAME 3
========================================================= */

$("toG3").onclick = ()=>{

  /*
     Only allow the player to continue
     after successfully landing the fish.
  */

  if(!g2.caught){

    return;

  }


  clearInterval(
    g2.timer
  );


  g2.started = false;

  g2.landing = false;

  g2.hold = false;


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

  clearInterval(camp.weatherTimer);

  $("weatherMsg").textContent =
    "🌧️ Rain is coming. Secure your campsite before the storm hits!";

  camp.weatherTimer = setInterval(()=>{

    camp.weatherTime--;

    const remaining =
      Math.max(0, camp.weatherTime);

    $("weatherTime").textContent =
      "00:" +
      String(remaining).padStart(2,"0");

    $("weatherBar").style.width =
      (remaining / 30 * 100) + "%";

    if(remaining <= 15){

      $("storm")
        .classList.add("active");

      $("weatherMsg").textContent =
        "⚠️ Storm approaching. Secure everything!";

    }

    if(
      remaining <= 5 &&
      remaining > 0
    ){

      $("weatherMsg").textContent =
        `⚠️ ${remaining}... Secure the essentials!`;

    }

    if(remaining <= 0){

      clearInterval(
        camp.weatherTimer
      );

      finishWeather();

    }

  },1000);

}


/* =========================================================
   WEATHER ITEM HANDLERS
========================================================= */

document
  .querySelectorAll(".weatherItem")
  .forEach(button=>{

    button.onclick = ()=>{

      const type =
        button.dataset.weather;

      if(
        !type ||
        camp.weather[type]
      ){
        return;
      }

      camp.weather[type] =
        true;

      button.disabled = true;

      button.classList.add(
        "selected"
      );


      const messages = {

        tent:
          "⛺ Tent secured. Rainfly and pegs are ready.",

        food:
          "📦 Food & gear secured from the rain.",

        fishing:
          "🎣 Fishing gear secured and protected."

      };


      $("weatherMsg").textContent =
        messages[type] ||
        "Essential secured.";


      updatePreparedness(3);


      const allSecured =

        camp.weather.tent &&

        camp.weather.food &&

        camp.weather.fishing;


      if(allSecured){

        $("weatherMsg").innerHTML =
          "<b>✓ ALL ESSENTIALS SECURED</b><br>You are ready for the storm.";

      }

    };

  });


/* =========================================================
   PREPAREDNESS
========================================================= */

function updatePreparedness(amount){

  const bar =
    $("ready");

  if(!bar) return;

  const current =
    parseFloat(
      bar.style.width
    ) || 90;

  const value =
    Math.max(
      0,
      Math.min(
        100,
        current + amount
      )
    );

  bar.style.width =
    value + "%";


  if($("readyT")){

    $("readyT").textContent =
      Math.round(value) + "%";

  }

}


/* =========================================================
   CAMP XP
========================================================= */

function calculateCampXP(){

  const fireScore =
    camp.fireComplete
      ? 150
      : 0;


  const campSecureCount =
    Object
      .values(camp.secured)
      .filter(Boolean)
      .length;


  const securityScore =

    campSecureCount === 3
      ? 100

      : campSecureCount === 2
        ? 75

        : campSecureCount === 1
          ? 50

          : 0;


  const weatherSecureCount =
    Object
      .values(camp.weather)
      .filter(Boolean)
      .length;


  const weatherScore =

    weatherSecureCount === 3
      ? 150

      : weatherSecureCount === 2
        ? 100

        : weatherSecureCount === 1
          ? 50

          : 0;


  return Math.min(
    400,
    fireScore +
    securityScore +
    weatherScore
  );

}


/* =========================================================
   WEATHER FINISH
========================================================= */

function finishWeather(){

  if(camp.weatherFinished) return;

  camp.weatherFinished =
    true;

  clearInterval(
    camp.weatherTimer
  );


  $("storm")
    .classList.remove(
      "active"
    );


  camp.campXP =
    calculateCampXP();


  const allCamp =

    camp.fireComplete &&

    camp.secured.tent &&

    camp.secured.food &&

    camp.secured.gear &&

    camp.weather.tent &&

    camp.weather.food &&

    camp.weather.fishing;


  if(allCamp){

    $("weatherMsg").innerHTML =
      "<b>🌧️ THE STORM HAS PASSED.</b><br>Every essential was secured. You were ready.";

  }
  else{

    $("weatherMsg").innerHTML =
      "<b>🌧️ THE STORM HAS PASSED.</b><br>You survived the night, but not everything was secured.";

  }


  setTimeout(()=>{

    completeCamp();

  },1200);

}


/* =========================================================
   COMPLETE CAMP
========================================================= */

function completeCamp(){

  clearInterval(
    camp.weatherTimer
  );


  $("storm")
    .classList.remove(
      "active"
    );


  document
    .querySelector(".tasks")
    ?.classList.add(
      "hidden"
    );


  $("campComplete")
    ?.classList.remove(
      "hidden"
    );


  document
    .querySelector(".campHero")
    ?.classList.add(
      "complete"
    );


  const perfect =
    camp.campXP === 400;


  if($("healthT"))
    $("healthT").textContent =
      "100%";


  if($("energyT"))
    $("energyT").textContent =
      perfect
        ? "85%"
        : "70%";


  if($("readyT"))
    $("readyT").textContent =
      perfect
        ? "100%"
        : "90%";


  if($("campXP"))
    $("campXP").textContent =
      `+${camp.campXP} XP`;


  if($("campXPDisplay"))
    $("campXPDisplay").textContent =
      `+${camp.campXP} XP`;

}


/* =========================================================
   GAME 03 → FINAL REPORT
========================================================= */

$("toFinal").onclick = ()=>{

  show("final");

  updateFinal();

};


/* =========================================================
   FINAL EXPEDITION REPORT
========================================================= */

function updateFinal(){

  const waterXP =
    totalWaterXP;

  const catchXP =
    500;

  const campXP =
    camp.campXP || 0;


  const total =
    waterXP +
    catchXP +
    campXP;


  if($("finalWater")){

    $("finalWater").textContent =
      `+${waterXP} XP`;

  }


  if($("finalCatch")){

    $("finalCatch").textContent =
      `+${catchXP} XP`;

  }


  if($("finalCamp")){

    $("finalCamp").textContent =
      `+${campXP} XP`;

  }


  if($("totalXP")){

    $("totalXP").textContent =
      `${total.toLocaleString()} XP`;

  }


  if($("finalScore")){

    $("finalScore").textContent =
      `${total.toLocaleString()} XP`;

  }

}


/* =========================================================
   INITIAL STATE
========================================================= */

show("intro");
