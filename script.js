// ==========================================
// PANIC BUTTON (MS. INMAN)
// ==========================================
let isPanicking = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
let activeStoreTab = 'bld';

// Authentic high school proxy/unblocked themes
const buildings = [
    { id: 'b1', name: "Bathroom Pass", desc: "Take the pass and literally just walk around the school for 45 minutes.", baseCost: 15, cps: 0.5, count: 0 },
    { id: 'b2', name: "Cool Math Games", desc: "Playing Moto X3M in the back row while the teacher isn't looking.", baseCost: 100, cps: 4, count: 0 },
    { id: 'b3', name: "Unblocked Games 66", desc: "Finding a Google Site that isn't blocked by Securly yet.", baseCost: 1100, cps: 16, count: 0 },
    { id: 'b4', name: "Discord Proxy", desc: "Logging into discord via some shady proxy to talk in 3rd period.", baseCost: 12000, cps: 65, count: 0 },
    { id: 'b5', name: "Quizlet Hack", desc: "Using inspect element to steal the exact answers for the Edpuzzle.", baseCost: 130000, cps: 380, count: 0 },
    { id: 'b6', name: "Bypass Firewall", desc: "Bringing a flash drive with a portable VPN from home.", baseCost: 1500000, cps: 2500, count: 0 },
    { id: 'b7', name: "Teacher's HDMI", desc: "Connecting your chromebook to the smartboard and blasting meme comps.", baseCost: 20000000, cps: 15000, count: 0 }
];

const clickUpgrades = [
    { id: 'u1', name: "Stolen School Mouse", desc: "Clicking is 2x stronger. You took the tracking ball out so it glides better.", cost: 500, bought: false },
    { id: 'u2', name: "Sketchy Auto-Clicker", desc: "Clicking is 2x stronger. Downloaded from SourceForge.", cost: 5000, bought: false },
    { id: 'u3', name: "Dry Scoop Pre-Workout", desc: "Clicking is 2x stronger. Eaten dry right before first period.", cost: 50000, bought: false },
    { id: 'u4', name: "Energy Drink Synergy", desc: "Clicks gain +1% of your total CPS. Drinking a Monster and Redbull at the same time.", cost: 250000, bought: false },
    { id: 'u5', name: "Spam Clicking", desc: "Clicking is 2x stronger. Just destroying the left click button.", cost: 1000000, bought: false },
    { id: 'u6', name: "Complete Focus", desc: "Clicks gain +2% of your total CPS. Headphones in, hood up.", cost: 5000000, bought: false }
];

function getBldCost(b) { return Math.floor(b.baseCost * Math.pow(1.15, b.count)); }

function getClickPower() {
    let power = 1;
    if(clickUpgrades[0].bought) power *= 2;
    if(clickUpgrades[1].bought) power *= 2;
    if(clickUpgrades[2].bought) power *= 2;
    if(clickUpgrades[4].bought) power *= 2;
    
    let synergy = 0;
    if(clickUpgrades[3].bought) synergy += (cps * 0.01);
    if(clickUpgrades[5].bought) synergy += (cps * 0.02);
    
    return Math.floor(power + synergy);
}

document.getElementById('main-zeke').addEventListener('mousedown', (e) => {
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
    localStorage.setItem('weeblyZekeSave', JSON.stringify({ zekes, buildings, clickUpgrades }));
}, 5000);

function loadGame() {
    let save = JSON.parse(localStorage.getItem('weeblyZekeSave'));
    if(save) {
        zekes = save.zekes || 0;
        if(save.buildings) save.buildings.forEach((sb, i) => { if(buildings[i]) buildings[i].count = sb.count; });
        if(save.clickUpgrades) save.clickUpgrades.forEach((su, i) => { if(clickUpgrades[i]) clickUpgrades[i].bought = su.bought; });
    }
    recalcStats(); switchTab('bld'); updateUI();
}

function recalcStats() {
    cps = 0; buildings.forEach(b => cps += b.cps * b.count);
    document.getElementById('clickPowerDisplay').innerText = formatNum(getClickPower());
}

function switchTab(tab) {
    activeStoreTab = tab;
    document.getElementById('tab-bld').classList.toggle('active-tab', tab === 'bld');
    document.getElementById('tab-upg').classList.toggle('active-tab', tab === 'upg');
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
    if (activeStoreTab === 'bld') {
        buildings.forEach((b, i) => {
            let cost = getBldCost(b);
            html += `<div class="store-item">
                <div style="flex:1;">
                    <strong>${b.name}</strong> (Owned: ${b.count})<br>
                    <span style="font-size:11px; color:#555;">${b.desc} <br><i>(+${formatNum(b.cps)}/sec)</i></span>
                </div>
                <button id="btn-bld-${i}" onclick="buyBuilding(${i})">Buy<br><b>${formatNum(cost)}</b></button>
            </div>`;
        });
    } else {
        clickUpgrades.forEach((u, i) => {
            if (!u.bought) {
                html += `<div class="store-item">
                    <div style="flex:1;">
                        <strong>${u.name}</strong><br>
                        <span style="font-size:11px; color:#555;">${u.desc}</span>
                    </div>
                    <button id="btn-upg-${i}" onclick="buyUpgrade(${i})">Buy<br><b>${formatNum(u.cost)}</b></button>
                </div>`;
            }
        });
        if (html === '') html = '<p style="text-align:center; font-size:12px;">No more upgrades available.</p>';
    }
    document.getElementById('store-list').innerHTML = html;
}

function updateUI() {
    document.getElementById('zekeCount').innerText = formatNum(Math.floor(zekes));
    document.getElementById('cpsDisplay').innerText = formatNum(Math.floor(cps));
    
    if (activeStoreTab === 'bld') {
        buildings.forEach((b, i) => {
            let btn = document.getElementById(`btn-bld-${i}`);
            if(btn) btn.disabled = zekes < getBldCost(b);
        });
    } else {
        clickUpgrades.forEach((u, i) => {
            if(!u.bought) {
                let btn = document.getElementById(`btn-upg-${i}`);
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
    if(confirm("Are you sure you want to wipe your save?")) { localStorage.removeItem('weeblyZekeSave'); location.reload(); }
}

// ==========================================
// ARCADE HUB LOGIC (Deepened Minigames)
// ==========================================
let activeInterval = null;
let gameTimer = null;

function openGame(tabId) {
    document.querySelectorAll('.mini-view').forEach(el => el.classList.remove('active-mini'));
    document.getElementById('game-' + tabId).classList.add('active-mini');
    clearInterval(activeInterval); 
    clearInterval(gameTimer);
}

function getGameMult() { return Math.max(1, Math.floor(cps / 15)); } // Rewards scale directly with CPS

// --- 1. SNAKE (Golden Zekes & Progressive Speed) ---
const sCanvas = document.getElementById("snakeCanvas");
const sCtx = sCanvas.getContext("2d");
const box = 15;
let snake, food, goldenFood, d, snakeSpeed;
let zImg = new Image(); zImg.src = 'zeke.jpg';

function startSnake() {
    clearInterval(activeInterval);
    snake = [{ x: 9 * box, y: 9 * box }];
    food = spawnFood();
    goldenFood = null;
    d = "RIGHT";
    snakeSpeed = 150;
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}
function spawnFood() { return { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; }

document.addEventListener("keydown", (e) => {
    if(e.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(e.keyCode == 38 && d != "DOWN") d = "UP";
    else if(e.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(e.keyCode == 40 && d != "UP") d = "DOWN";
});

function snakeLoop() {
    if(isPanicking) { activeInterval = setTimeout(snakeLoop, snakeSpeed); return; }
    
    sCtx.fillStyle = "#fff"; sCtx.fillRect(0, 0, 300, 300);
    
    // Draw Snake
    for(let i = 0; i < snake.length; i++) {
        sCtx.fillStyle = i === 0 ? "#333" : "#888"; 
        sCtx.fillRect(snake[i].x, snake[i].y, box, box);
        sCtx.strokeStyle = "#fff"; sCtx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    
    // Draw Food
    try { sCtx.drawImage(zImg, food.x, food.y, box, box); } catch(e) { sCtx.fillStyle = "red"; sCtx.fillRect(food.x, food.y, box, box); }
    if(goldenFood) { sCtx.fillStyle = "gold"; sCtx.fillRect(goldenFood.x, goldenFood.y, box, box); }

    let sX = snake[0].x, sY = snake[0].y;
    if(d == "LEFT") sX -= box; if(d == "UP") sY -= box;
    if(d == "RIGHT") sX += box; if(d == "DOWN") sY += box;

    let ate = false;
    if(sX == food.x && sY == food.y) {
        food = spawnFood(); ate = true;
        if(Math.random() < 0.15 && !goldenFood) goldenFood = spawnFood(); // 15% chance for golden
    } else if (goldenFood && sX == goldenFood.x && sY == goldenFood.y) {
        goldenFood = null; ate = true;
        // Golden gives huge invisible extra tail segments for score without making it too long instantly
        snake.push({...snake[snake.length-1]}); snake.push({...snake[snake.length-1]});
    } else {
        snake.pop();
    }

    if(ate) snakeSpeed = Math.max(50, snakeSpeed - 2); // Gets faster

    let newHead = { x: sX, y: sY };
    if(sX < 0 || sX >= 300 || sY < 0 || sY >= 300 || snake.some(s => s.x === sX && s.y === sY)) {
        let reward = (snake.length - 1) * 80 * getGameMult();
        alert("Game Over! Length: " + snake.length + " | Earned: " + formatNum(reward) + " Zekes");
        zekes += reward; updateUI(); return;
    }
    
    snake.unshift(newHead);
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}

// --- 2. JUMP (Double Jump & Coins) ---
const jumper = document.getElementById("jumper");
const obs = document.getElementById("obstacle");
const coin = document.getElementById("jump-coin");
let jScore = 0, oLeft = 280, cLeft = -50, isJumping = false, canDoubleJump = false;

function startJump() {
    clearInterval(activeInterval);
    jScore = 0; oLeft = 280; cLeft = 400; 
    obs.style.left = oLeft + 'px'; coin.style.display = 'block'; coin.style.left = cLeft + 'px';
    document.getElementById("jump-score").innerText = "0";
    
    activeInterval = setInterval(() => {
        if(isPanicking) return;
        let jRect = jumper.getBoundingClientRect();
        let oRect = obs.getBoundingClientRect();
        let cRect = coin.getBoundingClientRect();
        
        oLeft -= 8; // Obstacle speed
        cLeft -= 6; // Coin speed
        
        if (oLeft < -20) { oLeft = 280 + Math.random() * 100; jScore += 5; }
        if (cLeft < -20) { cLeft = 300 + Math.random() * 200; coin.style.display = 'block'; }
        
        obs.style.left = oLeft + 'px';
        coin.style.left = cLeft + 'px';
        document.getElementById("jump-score").innerText = jScore;

        // Hit Obstacle
        if (jRect.left < oRect.right && jRect.right > oRect.left && jRect.bottom > oRect.top) {
            clearInterval(activeInterval);
            let reward = jScore * 40 * getGameMult();
            alert("Crash! Score: " + jScore + " | Earned: " + formatNum(reward) + " Zekes.");
            zekes += reward; updateUI();
        }
        
        // Collect Coin
        if (coin.style.display !== 'none' && jRect.left < cRect.right && jRect.right > cRect.left && jRect.top < cRect.bottom && jRect.bottom > cRect.top) {
            coin.style.display = 'none';
            jScore += 25;
        }
    }, 20);
}

document.addEventListener("keydown", (e) => { 
    if(e.code === "Space" && document.getElementById('game-jump').classList.contains('active-mini')) {
        e.preventDefault(); doJump(); 
    }
});

function doJump() {
    if (!isJumping) {
        // First jump
        isJumping = true; canDoubleJump = true;
        jumper.className = 'jump-up';
        setTimeout(() => {
            if(jumper.className === 'jump-up') {
                jumper.className = 'jump-down';
                setTimeout(() => { jumper.className = ''; isJumping = false; canDoubleJump = false; }, 300);
            }
        }, 300);
    } else if (canDoubleJump) {
        // Double jump in air
        canDoubleJump = false;
        jumper.className = ''; // Reset anim
        void jumper.offsetWidth; // Trigger reflow
        jumper.className = 'jump-up';
        setTimeout(() => {
            jumper.className = 'jump-down';
            setTimeout(() => { jumper.className = ''; isJumping = false; }, 300);
        }, 300);
    }
}

// --- 3. PAPA'S (Combo Rush Hour) ---
const ings = ["Dough", "Sauce", "Cheese", "Zeke"];
let target = [], current = [], papaTime = 0, papaCombo = 1, totalPapaScore = 0;

function startPapa() {
    clearInterval(gameTimer);
    papaTime = 60; papaCombo = 1; totalPapaScore = 0;
    document.getElementById('papa-time').innerText = papaTime;
    document.getElementById('papa-combo').innerText = papaCombo;
    newOrder();
    
    gameTimer = setInterval(() => {
        if(isPanicking) return;
        papaTime--;
        document.getElementById('papa-time').innerText = papaTime;
        if(papaTime <= 0) {
            clearInterval(gameTimer);
            let reward = totalPapaScore * getGameMult();
            alert("Shift Over! Earned: " + formatNum(reward) + " Zekes!");
            zekes += reward; updateUI();
            document.getElementById('papa-order').innerText = "Click Start";
            document.getElementById('papa-current').innerText = "";
        }
    }, 1000);
}

function newOrder() {
    current = []; target = [];
    let len = Math.floor(Math.random() * 4) + 3; // 3 to 6 items
    for(let i=0; i<len; i++) target.push(ings[Math.floor(Math.random()*ings.length)]);
    document.getElementById('papa-order').innerText = target.join(" + ");
    document.getElementById('papa-current').innerText = "";
}

function addIng(ing) {
    if(papaTime <= 0) return; 
    current.push(ing);
    document.getElementById('papa-current').innerText = current.join(" - ");
    for(let i=0; i<current.length; i++) {
        if(current[i] !== target[i]) { 
            papaCombo = 1; // Reset combo on mistake
            document.getElementById('papa-combo').innerText = papaCombo;
            newOrder(); 
            return; 
        }
    }
    if(current.length === target.length) {
        totalPapaScore += (target.length * 50 * papaCombo);
        papaCombo++; // Increase combo for speed!
        document.getElementById('papa-combo').innerText = papaCombo;
        newOrder();
    }
}

// --- 4. GRIDSHOT (Aim Trainer 30s) ---
let aimHits = 0, aimTime = 0;
const targets = [document.getElementById("at-1"), document.getElementById("at-2"), document.getElementById("at-3")];

function startAim() {
    clearInterval(gameTimer);
    aimHits = 0; aimTime = 30; 
    document.getElementById("aim-score").innerText = "0";
    document.getElementById("aim-time").innerText = aimTime;
    
    targets.forEach(t => spawnTarget(t));
    
    gameTimer = setInterval(() => {
        if(isPanicking) return;
        aimTime--;
        document.getElementById("aim-time").innerText = aimTime;
        if(aimTime <= 0) {
            clearInterval(gameTimer);
            targets.forEach(t => t.style.display = 'none');
            let reward = aimHits * 150 * getGameMult();
            alert("Time's Up! Hits: " + aimHits + " | Earned: " + formatNum(reward));
            zekes += reward; updateUI();
        }
    }, 1000);
}

function spawnTarget(t) {
    t.style.display = "block";
    t.style.left = Math.floor(Math.random() * 240) + "px";
    t.style.top = Math.floor(Math.random() * 180) + "px";
}

function hitTarget(idNum) {
    if(aimTime <= 0) return;
    aimHits++; document.getElementById("aim-score").innerText = aimHits;
    spawnTarget(document.getElementById("at-"+idNum));
}

// Boot up
window.onload = loadGame;
