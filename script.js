// ==========================================
// PREVENT PAGE SCROLL ON GAME KEYS
// ==========================================
window.addEventListener("keydown", function(e) {
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if(document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
            e.preventDefault();
        }
    }
}, false);

// ==========================================
// DARK MODE
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('zekeDarkMode', document.body.classList.contains('dark-mode'));
}
if(localStorage.getItem('zekeDarkMode') === 'true') document.body.classList.add('dark-mode');

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
let zekes = 0; let cps = 0; let activeStoreTab = 'bld';

const buildings = [
    { id: 'b1', name: "Bathroom Pass", desc: "Walk around for 45 mins.", baseCost: 15, cps: 0.5, count: 0 },
    { id: 'b2', name: "Cool Math Games", desc: "Moto X3M in the back row.", baseCost: 100, cps: 4, count: 0 },
    { id: 'b3', name: "Unblocked Sites 66", desc: "Before Securly blocks it.", baseCost: 1100, cps: 16, count: 0 },
    { id: 'b4', name: "Discord Proxy", desc: "Chatting in 3rd period.", baseCost: 12000, cps: 65, count: 0 },
    { id: 'b5', name: "Quizlet Hack", desc: "Inspect element the answers.", baseCost: 130000, cps: 380, count: 0 },
    { id: 'b6', name: "Flash Drive VPN", desc: "Portable internet freedom.", baseCost: 1500000, cps: 2500, count: 0 }
];

const clickUpgrades = [
    { id: 'u1', name: "Stolen School Mouse", desc: "Clicking 2x stronger.", cost: 500, bought: false },
    { id: 'u2', name: "Sketchy Auto-Clicker", desc: "Clicking 2x stronger.", cost: 5000, bought: false },
    { id: 'u3', name: "Dry Scoop Pre-Workout", desc: "Clicking 2x stronger.", cost: 50000, bought: false },
    { id: 'u4', name: "Energy Drink Synergy", desc: "Clicks gain +1% of CPS.", cost: 250000, bought: false },
    { id: 'u5', name: "Spam Clicking", desc: "Clicking 2x stronger.", cost: 1000000, bought: false }
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
    return Math.floor(power + synergy);
}

document.getElementById('main-zeke').addEventListener('mousedown', (e) => {
    let p = getClickPower(); zekes += p;
    let f = document.createElement('div'); f.className = 'float-txt'; f.innerText = '+' + formatNum(p);
    f.style.left = (e.clientX - 10 + (Math.random()*20)) + 'px'; f.style.top = (e.clientY - 20) + 'px';
    document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
    updateUI();
});

setInterval(() => { if(!isPanicking && cps > 0) { zekes += cps / 10; updateUI(); } }, 100);
setInterval(() => { localStorage.setItem('weeblyZekeSave_v2', JSON.stringify({ zekes, buildings, clickUpgrades })); }, 5000);

function loadGame() {
    let save = JSON.parse(localStorage.getItem('weeblyZekeSave_v2'));
    if(save) {
        zekes = save.zekes || 0;
        if(save.buildings) save.buildings.forEach((sb, i) => { if(buildings[i]) buildings[i].count = sb.count; });
        if(save.clickUpgrades) save.clickUpgrades.forEach((su, i) => { if(clickUpgrades[i]) clickUpgrades[i].bought = su.bought; });
    }
    recalcStats(); switchTab('bld'); updateUI();
}

function recalcStats() { cps = 0; buildings.forEach(b => cps += b.cps * b.count); document.getElementById('clickPowerDisplay').innerText = formatNum(getClickPower()); }
function switchTab(tab) {
    activeStoreTab = tab;
    document.getElementById('tab-bld').className = tab === 'bld' ? 'store-tab active-tab' : 'store-tab';
    document.getElementById('tab-upg').className = tab === 'upg' ? 'store-tab active-tab' : 'store-tab';
    buildStore();
}
function buyBuilding(idx) { let b = buildings[idx]; let cost = getBldCost(b); if(zekes >= cost) { zekes -= cost; b.count++; recalcStats(); buildStore(); updateUI(); } }
function buyUpgrade(idx) { let u = clickUpgrades[idx]; if(zekes >= u.cost && !u.bought) { zekes -= u.cost; u.bought = true; recalcStats(); buildStore(); updateUI(); } }

function buildStore() {
    let html = '';
    if (activeStoreTab === 'bld') {
        buildings.forEach((b, i) => {
            html += `<div class="store-item"><div style="flex:1;"><strong>${b.name}</strong> (Owned: ${b.count})<br><span style="font-size:11px; color:inherit; opacity:0.8;">${b.desc} <i>(+${formatNum(b.cps)}/sec)</i></span></div><button id="btn-bld-${i}" onclick="buyBuilding(${i})">Buy<br><b>${formatNum(getBldCost(b))}</b></button></div>`;
        });
    } else {
        clickUpgrades.forEach((u, i) => {
            if (!u.bought) html += `<div class="store-item"><div style="flex:1;"><strong>${u.name}</strong><br><span style="font-size:11px; color:inherit; opacity:0.8;">${u.desc}</span></div><button id="btn-upg-${i}" onclick="buyUpgrade(${i})">Buy<br><b>${formatNum(u.cost)}</b></button></div>`;
        });
        if (html === '') html = '<p style="text-align:center; font-size:12px;">No more upgrades available.</p>';
    }
    document.getElementById('store-list').innerHTML = html;
}

function updateUI() {
    document.getElementById('zekeCount').innerText = formatNum(Math.floor(zekes));
    document.getElementById('cpsDisplay').innerText = formatNum(Math.floor(cps));
    if (activeStoreTab === 'bld') { buildings.forEach((b, i) => { let btn = document.getElementById(`btn-bld-${i}`); if(btn) btn.disabled = zekes < getBldCost(b); }); } 
    else { clickUpgrades.forEach((u, i) => { if(!u.bought) { let btn = document.getElementById(`btn-upg-${i}`); if(btn) btn.disabled = zekes < u.cost; } }); }
}

function formatNum(num) {
    if (num < 1000) return num.toLocaleString();
    if (num < 1000000) return (num / 1000).toFixed(1) + "k";
    if (num < 1000000000) return (num / 1000000).toFixed(2) + "M";
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + "B";
    return (num / 1000000000000).toFixed(2) + "T";
}

function restartGame() { if(confirm("Are you sure you want to wipe your save?")) { localStorage.removeItem('weeblyZekeSave_v2'); location.reload(); } }

// ==========================================
// ARCADE HUB 
// ==========================================
let activeInterval = null; let gameTimer = null;
function getGameMult() { return Math.max(1, Math.floor(cps / 15)); }

function openGame(tabId, element) {
    document.querySelectorAll('.mini-view').forEach(el => el.classList.remove('active-mini'));
    document.getElementById('game-' + tabId).classList.add('active-mini');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active-nav'));
    if(element) element.classList.add('active-nav');
    clearInterval(activeInterval); clearInterval(gameTimer);
}

// --- 1. SNAKE ---
const sCanvas = document.getElementById("snakeCanvas"); const sCtx = sCanvas.getContext("2d"); const box = 15;
let snake, food, goldenFood, d, snakeSpeed; let zImg = new Image(); zImg.src = 'zeke.jpg';
function startSnake() {
    clearInterval(activeInterval); snake = [{ x: 9 * box, y: 9 * box }]; food = spawnFood(); goldenFood = null; d = "RIGHT"; snakeSpeed = 130;
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}
function spawnFood() { return { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; }
document.addEventListener("keydown", (e) => {
    if((e.code === "ArrowLeft" || e.code === "KeyA") && d != "RIGHT") d = "LEFT";
    else if((e.code === "ArrowUp" || e.code === "KeyW") && d != "DOWN") d = "UP";
    else if((e.code === "ArrowRight" || e.code === "KeyD") && d != "LEFT") d = "RIGHT";
    else if((e.code === "ArrowDown" || e.code === "KeyS") && d != "UP") d = "DOWN";
});
function snakeLoop() {
    if(isPanicking) { activeInterval = setTimeout(snakeLoop, snakeSpeed); return; }
    sCtx.fillStyle = document.body.classList.contains('dark-mode') ? "#111" : "#fff"; sCtx.fillRect(0, 0, 300, 300);
    for(let i = 0; i < snake.length; i++) {
        sCtx.fillStyle = i === 0 ? "#000" : "#555"; sCtx.fillRect(snake[i].x, snake[i].y, box, box);
        sCtx.strokeStyle = "#ccc"; sCtx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    try { sCtx.drawImage(zImg, food.x, food.y, box, box); } catch(e) { sCtx.fillStyle = "red"; sCtx.fillRect(food.x, food.y, box, box); }
    if(goldenFood) { sCtx.fillStyle = "gold"; sCtx.fillRect(goldenFood.x, goldenFood.y, box, box); }

    let sX = snake[0].x, sY = snake[0].y;
    if(d == "LEFT") sX -= box; if(d == "UP") sY -= box; if(d == "RIGHT") sX += box; if(d == "DOWN") sY += box;

    let ate = false;
    if(sX == food.x && sY == food.y) {
        food = spawnFood(); ate = true;
        if(Math.random() < 0.15 && !goldenFood) goldenFood = spawnFood(); 
    } else if (goldenFood && sX == goldenFood.x && sY == goldenFood.y) {
        goldenFood = null; ate = true; snake.push({...snake[snake.length-1]}); snake.push({...snake[snake.length-1]});
    } else { snake.pop(); }

    if(ate) snakeSpeed = Math.max(50, snakeSpeed - 2); 
    let newHead = { x: sX, y: sY };
    if(sX < 0 || sX >= 300 || sY < 0 || sY >= 300 || snake.some(s => s.x === sX && s.y === sY)) {
        let reward = (snake.length - 1) * 80 * getGameMult();
        alert("Game Over! Length: " + snake.length + " | Earned: " + formatNum(reward) + " Zekes");
        zekes += reward; updateUI(); return;
    }
    snake.unshift(newHead); activeInterval = setTimeout(snakeLoop, snakeSpeed);
}

// --- 2. JUMP (Dynamic obstacles + Air birds) ---
const jumper = document.getElementById("jumper"); const obs = document.getElementById("obstacle"); const coin = document.getElementById("jump-coin");
let jScore = 0, oLeft = 320, cLeft = -50, isJumping = false, canDoubleJump = false, obsType = 0;

function startJump() {
    clearInterval(activeInterval); jScore = 0; oLeft = 320; cLeft = 400; 
    obs.style.left = oLeft + 'px'; obs.style.bottom = '0px'; obs.style.background = '#d00'; obs.style.width = '15px'; obs.style.height = '25px';
    coin.style.display = 'block'; coin.style.left = cLeft + 'px';
    document.getElementById("jump-score").innerText = "0";
    
    activeInterval = setInterval(() => {
        if(isPanicking) return;
        let jRect = jumper.getBoundingClientRect(); let oRect = obs.getBoundingClientRect(); let cRect = coin.getBoundingClientRect();
        oLeft -= 6 + (jScore * 0.1); cLeft -= 5; 
        
        if (oLeft < -40) { 
            oLeft = 300 + Math.random() * 150; jScore += 5; 
            // Randomize Obstacle
            obsType = Math.random() < 0.3 ? 1 : 0; // 30% chance for bird/air obstacle
            if(obsType === 1) {
                obs.style.bottom = '60px'; obs.style.height = '20px'; obs.style.width = '20px'; obs.style.background = 'blue';
            } else {
                obs.style.bottom = '0px'; obs.style.height = (20 + Math.random() * 20) + 'px'; obs.style.width = (15 + Math.random() * 15) + 'px'; obs.style.background = '#d00';
            }
        }
        if (cLeft < -20) { cLeft = 300 + Math.random() * 300; coin.style.display = 'block'; }
        
        obs.style.left = oLeft + 'px'; coin.style.left = cLeft + 'px';
        document.getElementById("jump-score").innerText = jScore;

        if (jRect.left < oRect.right && jRect.right > oRect.left && jRect.bottom > oRect.top && jRect.top < oRect.bottom) {
            clearInterval(activeInterval);
            let reward = jScore * 40 * getGameMult();
            alert("Crash! Score: " + jScore + " | Earned: " + formatNum(reward) + " Zekes."); zekes += reward; updateUI();
        }
        if (coin.style.display !== 'none' && jRect.left < cRect.right && jRect.right > cRect.left && jRect.top < cRect.bottom && jRect.bottom > cRect.top) {
            coin.style.display = 'none'; jScore += 25;
        }
    }, 20);
}
document.addEventListener("keydown", (e) => { if((e.code === "Space" || e.code === "ArrowUp") && document.getElementById('game-jump').classList.contains('active-mini')) { e.preventDefault(); doJump(); } });
function doJump() {
    if (!isJumping) {
        isJumping = true; canDoubleJump = true; jumper.className = 'jump-up';
        setTimeout(() => { if(jumper.className === 'jump-up') { jumper.className = 'jump-down'; setTimeout(() => { jumper.className = ''; isJumping = false; canDoubleJump = false; }, 300); } }, 300);
    } else if (canDoubleJump) {
        canDoubleJump = false; jumper.className = ''; void jumper.offsetWidth; jumper.className = 'jump-up';
        setTimeout(() => { jumper.className = 'jump-down'; setTimeout(() => { jumper.className = ''; isJumping = false; }, 300); }, 300);
    }
}

// --- 3. PAPA'S ---
const ings = ["Dough", "Sauce", "Cheese", "Zeke"];
let target = [], current = [], papaTime = 0, papaCombo = 1, totalPapaScore = 0;
function startPapa() {
    clearInterval(gameTimer); papaTime = 60; papaCombo = 1; totalPapaScore = 0;
    document.getElementById('papa-time').innerText = papaTime; document.getElementById('papa-combo').innerText = papaCombo;
    newOrder();
    gameTimer = setInterval(() => {
        if(isPanicking) return; papaTime--; document.getElementById('papa-time').innerText = papaTime;
        if(papaTime <= 0) {
            clearInterval(gameTimer); let reward = totalPapaScore * getGameMult();
            alert("Shift Over! Earned: " + formatNum(reward) + " Zekes!"); zekes += reward; updateUI();
            document.getElementById('papa-order').innerText = "Click Start"; document.getElementById('papa-current').innerText = "";
        }
    }, 1000);
}
function newOrder() {
    current = []; target = []; let len = Math.floor(Math.random() * 4) + 3; 
    for(let i=0; i<len; i++) target.push(ings[Math.floor(Math.random()*ings.length)]);
    document.getElementById('papa-order').innerText = target.join(" + "); document.getElementById('papa-current').innerText = "";
}
function addIng(ing) {
    if(papaTime <= 0) return; current.push(ing); document.getElementById('papa-current').innerText = current.join(" - ");
    for(let i=0; i<current.length; i++) {
        if(current[i] !== target[i]) { papaCombo = 1; document.getElementById('papa-combo').innerText = papaCombo; newOrder(); return; }
    }
    if(current.length === target.length) {
        totalPapaScore += (target.length * 50 * papaCombo); papaCombo++; document.getElementById('papa-combo').innerText = papaCombo; newOrder();
    }
}

// --- 4. GRIDSHOT (Anti-Spam) ---
let aimHits = 0, aimTime = 0;

function startAim() {
    clearInterval(gameTimer); aimHits = 0; aimTime = 30; 
    document.getElementById("aim-score").innerText = "0"; document.getElementById("aim-time").innerText = aimTime;
    for(let i=1; i<=3; i++) spawnTarget(document.getElementById("at-"+i));
    
    gameTimer = setInterval(() => {
        if(isPanicking) return; aimTime--; document.getElementById("aim-time").innerText = aimTime;
        if(aimTime <= 0) {
            clearInterval(gameTimer); for(let i=1; i<=3; i++) document.getElementById("at-"+i).style.display = 'none';
            let reward = aimHits * 150 * getGameMult();
            alert("Time's Up! Hits: " + aimHits + " | Earned: " + formatNum(reward)); zekes += reward; updateUI();
        }
    }, 1000);
}
function spawnTarget(t) {
    t.style.display = "block"; t.style.left = Math.floor(Math.random() * 260) + "px"; t.style.top = Math.floor(Math.random() * 180) + "px";
}

// Anti-spam logic: attach mousedown to the CONTAINER. 
document.getElementById('aim-box').addEventListener('mousedown', (e) => {
    if(aimTime <= 0 || isPanicking) return;
    if(e.target.classList.contains('aim-t')) {
        // Hit target
        aimHits++; document.getElementById("aim-score").innerText = aimHits;
        spawnTarget(e.target);
    } else {
        // Missed (clicked background) -> Lose point
        aimHits = Math.max(0, aimHits - 1);
        document.getElementById("aim-score").innerText = aimHits;
    }
});

// Boot up
window.onload = loadGame;
