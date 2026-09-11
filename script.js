// ==========================================
// PANIC BUTTON
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
// GAME ENGINE & DATA
// ==========================================
let zekes = 0;
let cps = 0;
let clickMulti = 1;
let activeStoreTab = 'buildings';

// Deep building progression
const buildings = [
    { id: 'b1', name: "Hall Pass", desc: "Wander the halls.", baseCost: 15, cps: 0.5, count: 0 },
    { id: 'b2', name: "Calculator Games", desc: "Play Tetris in math.", baseCost: 100, cps: 4, count: 0 },
    { id: 'b3', name: "Proxy Site", desc: "Bypass the school filter.", baseCost: 1100, cps: 16, count: 0 },
    { id: 'b4', name: "Cool Math Games", desc: "Leave it open on a tab.", baseCost: 12000, cps: 65, count: 0 },
    { id: 'b5', name: "Kahoot Botter", desc: "Spam the class lobby.", baseCost: 130000, cps: 380, count: 0 },
    { id: 'b6', name: "Flash Drive VPN", desc: "Portable internet freedom.", baseCost: 1500000, cps: 2500, count: 0 },
    { id: 'b7', name: "Inspect Element", desc: "Change your grades to A+.", baseCost: 20000000, cps: 15000, count: 0 },
    { id: 'b8', name: "Bribe IT Guy", desc: "Unrestricted access.", baseCost: 330000000, cps: 100000, count: 0 },
    { id: 'b9', name: "Stolen Teacher Laptop", desc: "You are the admin now.", baseCost: 5100000000, cps: 800000, count: 0 },
    { id: 'b10', name: "School Mainframe", desc: "Total district control.", baseCost: 75000000000, cps: 5000000, count: 0 }
];

// One-time upgrades
const clickUpgrades = [
    { id: 'u1', name: "Better Mouse", desc: "Clicking is 2x stronger.", cost: 500, bought: false },
    { id: 'u2', name: "Auto-Clicker Trial", desc: "Clicking is 2x stronger.", cost: 5000, bought: false },
    { id: 'u3', name: "Gaming Mouse", desc: "Clicking is 2x stronger.", cost: 50000, bought: false },
    { id: 'u4', name: "Synergy I", desc: "Clicks gain +1% of your total CPS.", cost: 250000, bought: false },
    { id: 'u5', name: "G-Fuel Powder", desc: "Clicking is 2x stronger.", cost: 1000000, bought: false },
    { id: 'u6', name: "Synergy II", desc: "Clicks gain +2% of your total CPS.", cost: 5000000, bought: false },
    { id: 'u7', name: "Mechanical Keyboard", desc: "Clicking is 2x stronger.", cost: 50000000, bought: false }
];

function getBldCost(b) { return Math.floor(b.baseCost * Math.pow(1.15, b.count)); }

function getClickPower() {
    let power = 1;
    if(clickUpgrades[0].bought) power *= 2;
    if(clickUpgrades[1].bought) power *= 2;
    if(clickUpgrades[2].bought) power *= 2;
    if(clickUpgrades[4].bought) power *= 2;
    if(clickUpgrades[6].bought) power *= 2;
    
    let synergy = 0;
    if(clickUpgrades[3].bought) synergy += (cps * 0.01);
    if(clickUpgrades[5].bought) synergy += (cps * 0.02);
    
    return Math.floor(power + synergy);
}

const zekeImg = document.getElementById('main-zeke');
zekeImg.addEventListener('mousedown', (e) => {
    let p = getClickPower();
    zekes += p;
    
    let f = document.createElement('div');
    f.className = 'float-txt';
    f.innerText = '+' + formatNum(p);
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

setInterval(() => {
    localStorage.setItem('speechZekeSave', JSON.stringify({ zekes, buildings, clickUpgrades }));
}, 5000);

function loadGame() {
    let save = JSON.parse(localStorage.getItem('speechZekeSave'));
    if(save) {
        zekes = save.zekes || 0;
        if(save.buildings) save.buildings.forEach((sb, i) => { if(buildings[i]) buildings[i].count = sb.count; });
        if(save.clickUpgrades) save.clickUpgrades.forEach((su, i) => { if(clickUpgrades[i]) clickUpgrades[i].bought = su.bought; });
    }
    recalcStats(); switchStoreTab('buildings'); updateUI();
}

function recalcStats() {
    cps = 0;
    buildings.forEach(b => cps += b.cps * b.count);
    document.getElementById('clickPowerDisplay').innerText = formatNum(getClickPower());
}

// ==========================================
// STORE UI
// ==========================================
function switchStoreTab(tab) {
    activeStoreTab = tab;
    document.getElementById('tab-bld').classList.toggle('active', tab === 'buildings');
    document.getElementById('tab-upg').classList.toggle('active', tab === 'upgrades');
    buildStore();
}

function buyBuilding(idx) {
    let b = buildings[idx]; let cost = getBldCost(b);
    if(zekes >= cost) { zekes -= cost; b.count++; recalcStats(); buildStore(); updateUI(); }
}

function buyUpgrade(idx) {
    let u = clickUpgrades[idx];
    if(zekes >= u.cost && !u.bought) { zekes -= u.cost; u.bought = true; recalcStats(); buildStore(); updateUI(); }
}

function buildStore() {
    let html = '';
    if (activeStoreTab === 'buildings') {
        buildings.forEach((b, i) => {
            let cost = getBldCost(b);
            html += `<button class="bld-btn" id="s-item-${i}" onclick="buyBuilding(${i})">
                <div class="item-info">
                    <span class="item-name">${b.name}</span>
                    <span class="item-desc">${b.desc} (+${formatNum(b.cps)} Z/s)</span>
                </div>
                <div class="item-stats">
                    <div class="item-count">${b.count}</div>
                    <div class="item-cost">${formatNum(cost)} Z</div>
                </div>
            </button>`;
        });
    } else {
        clickUpgrades.forEach((u, i) => {
            if (!u.bought) {
                html += `<button class="upg-btn" id="s-item-u${i}" onclick="buyUpgrade(${i})">
                    <div class="item-info">
                        <span class="item-name">${u.name}</span>
                        <span class="item-desc">${u.desc}</span>
                    </div>
                    <div class="item-cost">${formatNum(u.cost)} Z</div>
                </button>`;
            }
        });
        if (html === '') html = '<p style="text-align:center; color:#888;">All upgrades purchased!</p>';
    }
    document.getElementById('store-list').innerHTML = html;
}

function updateUI() {
    document.getElementById('zekeCount').innerText = formatNum(Math.floor(zekes));
    document.getElementById('cpsDisplay').innerText = formatNum(Math.floor(cps));
    
    if (activeStoreTab === 'buildings') {
        buildings.forEach((b, i) => {
            let btn = document.getElementById(`s-item-${i}`);
            if(btn) btn.disabled = zekes < getBldCost(b);
        });
    } else {
        clickUpgrades.forEach((u, i) => {
            if(!u.bought) {
                let btn = document.getElementById(`s-item-u${i}`);
                if(btn) btn.disabled = zekes < u.cost;
            }
        });
    }
}

function formatNum(num) {
    if (num < 1000) return num.toLocaleString();
    if (num < 1000000) return (num / 1000).toFixed(1) + "k";
    if (num < 1000000000) return (num / 1000000).toFixed(2) + "M";
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + "B";
    return (num / 1000000000000).toFixed(2) + "T";
}

function restartGame() {
    if(confirm("Erase all progress?")) { localStorage.removeItem('speechZekeSave'); location.reload(); }
}

// ==========================================
// GOLDEN ZEKE (Random Events)
// ==========================================
const gZeke = document.getElementById('golden-zeke-container');
function spawnGoldenZeke() {
    if(isPanicking) return;
    gZeke.style.display = 'block';
    gZeke.style.top = (10 + Math.random() * 60) + '%';
    
    // Remove after animation finishes
    setTimeout(() => { gZeke.style.display = 'none'; }, 10000);
}

function clickGoldenZeke() {
    gZeke.style.display = 'none';
    let reward = Math.max(100, cps * 120); // 2 minutes of CPS
    alert("GOLDEN ZEKE CAUGHT! You found " + formatNum(reward) + " Zekes!");
    zekes += reward; updateUI();
}
// Try to spawn every 3-5 minutes
setInterval(() => { if(Math.random() < 0.3) spawnGoldenZeke(); }, 60000);


// ==========================================
// ARCADE HUB LOGIC (Rewards Scale with CPS)
// ==========================================
let activeInterval = null;

function switchArcadeTab(tabId) {
    document.querySelectorAll('.minigame-view').forEach(el => el.classList.remove('active-game'));
    document.getElementById('game-' + tabId).classList.add('active-game');
    clearInterval(activeInterval); 
}

function getGameMult() { return Math.max(1, Math.floor(cps / 10)); }

// --- 1. SNAKE ---
const sCanvas = document.getElementById("snakeCanvas");
const sCtx = sCanvas.getContext("2d");
const box = 15;
let snake, food, d;

function startSnake() {
    clearInterval(activeInterval);
    snake = [{ x: 10 * box, y: 10 * box }];
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    d = "RIGHT";
    activeInterval = setInterval(drawSnake, 100);
}
document.addEventListener("keydown", (e) => {
    if(e.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(e.keyCode == 38 && d != "DOWN") d = "UP";
    else if(e.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(e.keyCode == 40 && d != "UP") d = "DOWN";
});
function drawSnake() {
    if(isPanicking) return;
    sCtx.fillStyle = "#0a0a0a"; sCtx.fillRect(0, 0, 300, 300);
    for(let i = 0; i < snake.length; i++) {
        sCtx.fillStyle = i === 0 ? "#fff" : "#00ffff"; 
        sCtx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    sCtx.fillStyle = "#f00"; sCtx.fillRect(food.x, food.y, box, box);

    let sX = snake[0].x, sY = snake[0].y;
    if(d == "LEFT") sX -= box; if(d == "UP") sY -= box;
    if(d == "RIGHT") sX += box; if(d == "DOWN") sY += box;

    if(sX == food.x && sY == food.y) {
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    } else { snake.pop(); }

    let newHead = { x: sX, y: sY };
    if(sX < 0 || sX >= 300 || sY < 0 || sY >= 300 || snake.some(s => s.x === sX && s.y === sY)) {
        clearInterval(activeInterval);
        let reward = (snake.length - 1) * 50 * getGameMult();
        alert("Dead. Base: " + (snake.length-1) + " | Total Earned: " + formatNum(reward) + " Zekes");
        zekes += reward; updateUI(); return;
    }
    snake.unshift(newHead);
}

// --- 2. JUMP ---
const jumper = document.getElementById("jumper");
const obs = document.getElementById("obstacle");
let jScore = 0, oLeft = 280;

function startJump() {
    clearInterval(activeInterval);
    jScore = 0; oLeft = 280; obs.style.left = '280px';
    document.getElementById("jump-score").innerText = "Score: 0";
    activeInterval = setInterval(() => {
        if(isPanicking) return;
        let jTop = parseInt(window.getComputedStyle(jumper).getPropertyValue("bottom"));
        oLeft -= 12; 
        if (oLeft < -20) { oLeft = 280; jScore++; document.getElementById("jump-score").innerText = "Score: " + jScore; }
        obs.style.left = oLeft + 'px';
        if(oLeft > 30 && oLeft < 50 && jTop <= 30) {
            clearInterval(activeInterval);
            let reward = jScore * 25 * getGameMult();
            alert("Crash! Earned: " + formatNum(reward) + " Zekes.");
            zekes += reward; updateUI();
        }
    }, 35);
}
document.addEventListener("keydown", (e) => { if((e.code === "Space" || e.code === "ArrowUp") && document.getElementById('game-jump').classList.contains('active-game')) doJump(); });
document.getElementById('jump-world').addEventListener("mousedown", doJump);
function doJump() {
    if(jumper.classList.contains("jump-anim")) return;
    jumper.classList.add("jump-anim"); setTimeout(() => { jumper.classList.remove("jump-anim"); }, 600);
}

// --- 3. PAPA'S ---
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
        if(current[i] !== target[i]) { alert("Ruined it! Start over."); startPapa(); return; }
    }
    if(current.length === target.length) {
        let reward = target.length * 100 * getGameMult();
        alert("Perfect! Earned: " + formatNum(reward));
        zekes += reward; updateUI(); startPapa();
    }
}

// --- 4. AIM ---
const targetEl = document.getElementById("aim-target");
let aimHits = 0;
function startAim() {
    clearInterval(activeInterval);
    aimHits = 0; document.getElementById("aim-score").innerText = "Hits: 0";
    targetEl.style.display = "block";
    activeInterval = setInterval(() => {
        if(isPanicking) return;
        targetEl.style.left = Math.floor(Math.random() * 240) + "px";
        targetEl.style.top = Math.floor(Math.random() * 160) + "px";
    }, 700); 
}
function hitTarget(e) {
    aimHits++; document.getElementById("aim-score").innerText = "Hits: " + aimHits;
    let reward = 50 * getGameMult();
    zekes += reward; updateUI();
    targetEl.style.left = Math.floor(Math.random() * 240) + "px";
    targetEl.style.top = Math.floor(Math.random() * 160) + "px";
}

// --- 5. RNG ---
const ems = ["🍒", "🍋", "🔔", "💎", "🎰"];
function spinRNG() {
    let bet = 500 * getGameMult();
    if(zekes < bet) { alert("You need " + formatNum(bet) + " Zekes to spin right now!"); return; }
    zekes -= bet; updateUI();
    
    let a = ems[Math.floor(Math.random() * ems.length)];
    let b = ems[Math.floor(Math.random() * ems.length)];
    let c = ems[Math.floor(Math.random() * ems.length)];
    
    document.getElementById('slot-machine').innerText = `${a} ${b} ${c}`;
    
    if(a === b && b === c) {
        let win = bet * 10;
        document.getElementById('slot-result').innerText = "JACKPOT! +" + formatNum(win);
        zekes += win;
    } else if (a === b || b === c || a === c) {
        let win = bet * 2;
        document.getElementById('slot-result').innerText = "Mini win! +" + formatNum(win);
        zekes += win;
    } else {
        document.getElementById('slot-result').innerText = "Loss (-" + formatNum(bet) + ")";
    }
    updateUI();
}

// Boot up
window.onload = loadGame;
