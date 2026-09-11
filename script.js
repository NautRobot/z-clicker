// ==========================================
// THE PANIC BUTTON (MS. INMAN)
// ==========================================
let isPanicking = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === '`') {
        isPanicking = !isPanicking;
        document.getElementById('panic-screen').style.display = isPanicking ? 'block' : 'none';
        document.getElementById('game-ui').style.display = isPanicking ? 'none' : 'block';
    }
});

// ==========================================
// CORE CLICKER ENGINE
// ==========================================
let zekes = 0;
let cps = 0;

// Replaced generic names with lore-accurate unblocked/high school themes
const upgrades = [
    { id: 'u1', name: "Bathroom Pass", desc: "Wander the halls. +1 Z/s", baseCost: 15, cps: 1, count: 0 },
    { id: 'u2', name: "South-Doyle Wi-Fi", desc: "Connect to the guest network. +5 Z/s", baseCost: 100, cps: 5, count: 0 },
    { id: 'u3', name: "Bazzite Linux Proxy", desc: "Bypass the school firewall. +20 Z/s", baseCost: 1000, cps: 20, count: 0 },
    { id: 'u4', name: "Cool Math Games", desc: "Keep a tab open in the background. +100 Z/s", baseCost: 12000, cps: 100, count: 0 },
    { id: 'u5', name: "WPILib Auto-Clicker", desc: "Robot code clicking for you. +500 Z/s", baseCost: 100000, cps: 500, count: 0 },
    { id: 'u6', name: "Inspect Element Hack", desc: "Change your grades to A+. +3000 Z/s", baseCost: 1500000, cps: 3000, count: 0 }
];

function getCost(u) { return Math.floor(u.baseCost * Math.pow(1.15, u.count)); }
function getClickPower() { return 1 + Math.floor(cps * 0.1); } 

const zekeImg = document.getElementById('main-zeke');
zekeImg.addEventListener('mousedown', (e) => {
    let power = getClickPower();
    zekes += power;
    
    let f = document.createElement('div');
    f.className = 'float-txt';
    f.innerText = '+' + power;
    f.style.left = (e.clientX - 10 + (Math.random()*20)) + 'px';
    f.style.top = (e.clientY - 20) + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1000);
    
    updateUI();
});

setInterval(() => {
    if(!isPanicking && cps > 0) {
        zekes += cps / 10;
        updateUI();
    }
}, 100);

setInterval(() => { localStorage.setItem('unblockedZekeSave', JSON.stringify({ zekes, upgrades })); }, 5000);

function loadGame() {
    let save = JSON.parse(localStorage.getItem('unblockedZekeSave'));
    if(save) {
        zekes = save.zekes || 0;
        if(save.upgrades) { save.upgrades.forEach((savedU, i) => { if(upgrades[i]) upgrades[i].count = savedU.count; }); }
    }
    recalcCPS(); buildStore(); updateUI();
}

function recalcCPS() {
    cps = 0; upgrades.forEach(u => cps += u.cps * u.count);
}

function buyUpgrade(idx) {
    let u = upgrades[idx]; let cost = getCost(u);
    if(zekes >= cost) { zekes -= cost; u.count++; recalcCPS(); buildStore(); updateUI(); }
}

function buildStore() {
    let html = '';
    upgrades.forEach((u, i) => {
        let cost = getCost(u);
        html += `<button class="upg-btn" id="btn-upg-${i}" onclick="buyUpgrade(${i})">
            <div>
                <div class="upg-name">${u.name} (${u.count})</div>
                <div class="upg-desc">${u.desc}</div>
            </div>
            <div class="upg-cost">${Math.floor(cost).toLocaleString()}</div>
        </button>`;
    });
    document.getElementById('store-list').innerHTML = html;
}

function updateUI() {
    document.getElementById('zekeCount').innerText = Math.floor(zekes).toLocaleString();
    document.getElementById('cpsDisplay').innerText = Math.floor(cps).toLocaleString();
    upgrades.forEach((u, i) => {
        let btn = document.getElementById(`btn-upg-${i}`);
        if(btn) btn.disabled = zekes < getCost(u);
    });
}

function restartGame() {
    if(confirm("Erase all data?")) { localStorage.removeItem('unblockedZekeSave'); location.reload(); }
}

// ==========================================
// ARCADE HUB LOGIC
// ==========================================
let activeInterval = null;

function switchTab(tabId) {
    document.querySelectorAll('.minigame-view').forEach(el => el.classList.remove('active-game'));
    document.getElementById('game-' + tabId).classList.add('active-game');
    clearInterval(activeInterval); // Kill any running game loop
}

// ------------------------------------------
// 1. ZEKE SNAKE (300x300, 15px grid)
// ------------------------------------------
const sCanvas = document.getElementById("snakeCanvas");
const sCtx = sCanvas.getContext("2d");
const box = 15;
let snake, food, d;
let zImg = new Image(); zImg.src = 'zeke.jpg';

function startSnake() {
    clearInterval(activeInterval);
    snake = [{ x: 10 * box, y: 10 * box }];
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    d = "RIGHT";
    activeInterval = setInterval(drawSnake, 120);
}

document.addEventListener("keydown", (e) => {
    let key = e.keyCode;
    if(key == 37 && d != "RIGHT") d = "LEFT";
    else if(key == 38 && d != "DOWN") d = "UP";
    else if(key == 39 && d != "LEFT") d = "RIGHT";
    else if(key == 40 && d != "UP") d = "DOWN";
});

function drawSnake() {
    if(isPanicking) return;
    sCtx.fillStyle = "#111"; sCtx.fillRect(0, 0, 300, 300);

    for(let i = 0; i < snake.length; i++) {
        if(i === 0) {
            try { sCtx.drawImage(zImg, snake[i].x, snake[i].y, box, box); } 
            catch(e) { sCtx.fillStyle = "yellow"; sCtx.fillRect(snake[i].x, snake[i].y, box, box); }
        } else { sCtx.fillStyle = "#0f0"; sCtx.fillRect(snake[i].x, snake[i].y, box, box); }
    }

    try { sCtx.drawImage(zImg, food.x, food.y, box, box); } 
    catch(e) { sCtx.fillStyle = "red"; sCtx.fillRect(food.x, food.y, box, box); }

    let sX = snake[0].x, sY = snake[0].y;
    if(d == "LEFT") sX -= box; if(d == "UP") sY -= box;
    if(d == "RIGHT") sX += box; if(d == "DOWN") sY += box;

    if(sX == food.x && sY == food.y) {
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    } else { snake.pop(); }

    let newHead = { x: sX, y: sY };

    if(sX < 0 || sX >= 300 || sY < 0 || sY >= 300 || snake.some(s => s.x === sX && s.y === sY)) {
        clearInterval(activeInterval);
        let reward = (snake.length - 1) * 300;
        alert("Dead. Reward: " + reward + " Zekes.");
        zekes += reward; updateUI(); return;
    }
    snake.unshift(newHead);
}

// ------------------------------------------
// 2. ZEKE JUMP
// ------------------------------------------
const jumper = document.getElementById("jumper");
const obs = document.getElementById("obstacle");
let jScore = 0; let oLeft = 300;

function startJump() {
    clearInterval(activeInterval);
    jScore = 0; oLeft = 300;
    obs.style.left = '300px';
    document.getElementById("jump-score").innerText = "Score: 0";
    
    activeInterval = setInterval(() => {
        if(isPanicking) return;
        let jTop = parseInt(window.getComputedStyle(jumper).getPropertyValue("bottom"));
        
        oLeft -= 15; // Move speed
        if (oLeft < -20) { oLeft = 300; jScore++; document.getElementById("jump-score").innerText = "Score: " + jScore; }
        obs.style.left = oLeft + 'px';

        if(oLeft > 30 && oLeft < 50 && jTop <= 30) {
            clearInterval(activeInterval);
            let reward = jScore * 100;
            alert("Crash! Reward: " + reward + " Zekes.");
            zekes += reward; updateUI();
        }
    }, 40);
}

document.addEventListener("keydown", (e) => { if((e.code === "Space" || e.code === "ArrowUp") && document.getElementById('game-jump').classList.contains('active-game')) doJump(); });
document.getElementById('jump-world').addEventListener("mousedown", doJump);

function doJump() {
    if(jumper.classList.contains("jump-anim")) return;
    jumper.classList.add("jump-anim");
    setTimeout(() => { jumper.classList.remove("jump-anim"); }, 600);
}

// ------------------------------------------
// 3. PAPA'S PIZZERIA
// ------------------------------------------
const ings = ["Dough", "Sauce", "Cheese", "Zeke"];
let target = [], current = [];

function startPapa() {
    current = []; target = [];
    let len = Math.floor(Math.random() * 3) + 3; 
    for(let i=0; i<len; i++) target.push(ings[Math.floor(Math.random()*ings.length)]);
    document.getElementById('papa-order').innerText = target.join(" + ");
    document.getElementById('papa-current').innerText = "";
}

function addIng(ing) {
    if(target.length === 0) return; 
    current.push(ing);
    document.getElementById('papa-current').innerText = current.join(" - ");
    for(let i=0; i<current.length; i++) {
        if(current[i] !== target[i]) { alert("TRASH! Start over."); startPapa(); return; }
    }
    if(current.length === target.length) {
        let reward = target.length * 400;
        alert("Order done! Earned: " + reward);
        zekes += reward; updateUI(); startPapa();
    }
}

// ------------------------------------------
// 4. AIM TRAINER
// ------------------------------------------
const targetEl = document.getElementById("aim-target");
let aimHits = 0;

function startAim() {
    clearInterval(activeInterval);
    aimHits = 0; document.getElementById("aim-score").innerText = "Hits: 0";
    targetEl.style.display = "block";
    
    activeInterval = setInterval(() => {
        if(isPanicking) return;
        targetEl.style.left = Math.floor(Math.random() * 260) + "px";
        targetEl.style.top = Math.floor(Math.random() * 160) + "px";
    }, 800); // Moves every 800ms
}

function hitTarget(e) {
    aimHits++; document.getElementById("aim-score").innerText = "Hits: " + aimHits;
    zekes += 150; updateUI();
    // Force move immediately
    targetEl.style.left = Math.floor(Math.random() * 260) + "px";
    targetEl.style.top = Math.floor(Math.random() * 160) + "px";
}

// ------------------------------------------
// 5. ZEKE RNG CASINO
// ------------------------------------------
const ems = ["💀", "🔥", "💯", "🍕", "🤖"];
function spinRNG() {
    if(zekes < 500) { alert("You broke."); return; }
    zekes -= 500; updateUI();
    
    let a = ems[Math.floor(Math.random() * ems.length)];
    let b = ems[Math.floor(Math.random() * ems.length)];
    let c = ems[Math.floor(Math.random() * ems.length)];
    
    document.getElementById('slot-machine').innerText = `${a} ${b} ${c}`;
    
    if(a === b && b === c) {
        document.getElementById('slot-result').innerText = "JACKPOT! +5000 Zekes!";
        zekes += 5000;
    } else if (a === b || b === c || a === c) {
        document.getElementById('slot-result').innerText = "Mini win! +800 Zekes";
        zekes += 800;
    } else {
        document.getElementById('slot-result').innerText = "L. Try again.";
    }
    updateUI();
}

window.onload = loadGame;
