// ==========================================
// THEME & SCROLL LOCK
// ==========================================
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('zekeThemeV18', document.body.classList.contains('dark-mode'));
}
if(localStorage.getItem('zekeThemeV18') === 'true') document.body.classList.add('dark-mode');

window.addEventListener("keydown", function(e) {
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        if(document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
            e.preventDefault();
        }
    }
}, false);

// ==========================================
// CORE DATA & LOGIC (PHYSICAL FEATURES LORE)
// ==========================================
let zekes = 0; let cps = 0; let activeStoreTab = 'bld';

// LORE: Buildings are Zeke's Physical Features
const buildings = [
    { id: 'b1', name: "Zeke's Fingers", desc: "Autonomously twitching to generate passive clicks.", baseCost: 15, cps: 0.5, count: 0 },
    { id: 'b2', name: "Zeke's Arms", desc: "Powered by endless pushup routines to sweep Zekes.", baseCost: 100, cps: 4, count: 0 },
    { id: 'b3', name: "Zeke's Legs", desc: "Conditioned from high-endurance distance running.", baseCost: 1100, cps: 16, count: 0 },
    { id: 'b4', name: "Zeke's Lungs", desc: "Processing massive oxygen yields for extended stamina.", baseCost: 12000, cps: 65, count: 0 },
    { id: 'b5', name: "Zeke's Eyes", desc: "Hyper-focused ocular tracking to spot hidden Zekes.", baseCost: 130000, cps: 380, count: 0 },
    { id: 'b6', name: "Zeke's Brain", desc: "Prefrontal cortex optimized for calculating complex yields.", baseCost: 1500000, cps: 2500, count: 0 },
    { id: 'b7', name: "Zeke's Heart", desc: "Pumping pure adrenaline through the central nervous system.", baseCost: 20000000, cps: 15000, count: 0 },
    { id: 'b8', name: "Zeke's Nervous System", desc: "Firing electrical impulses at unquantifiable speeds.", baseCost: 330000000, cps: 100000, count: 0 }
];

// LORE: Upgrades are Physical Traits & Adaptations
const clickUpgrades = [
    { id: 'u1', name: "Calloused Hands", desc: "Clicking force increased by 200%.", cost: 500, bought: false },
    { id: 'u2', name: "Fast-Twitch Muscle Fibers", desc: "Clicking force increased by 200%.", cost: 5000, bought: false },
    { id: 'u3', name: "Runner's High", desc: "Clicking force increased by 200%.", cost: 50000, bought: false },
    { id: 'u4', name: "Sympathetic Neural Response", desc: "Aggregate clicks yield +1% of global CPS.", cost: 250000, bought: false },
    { id: 'u5', name: "Hypertrophic Adaptation", desc: "Clicking force increased by 200%.", cost: 1000000, bought: false }
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
    f.style.left = (e.clientX - 15 + (Math.random()*30)) + 'px'; f.style.top = (e.clientY - 30) + 'px';
    document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
    updateUI();
});

setInterval(() => { if(cps > 0) { zekes += cps / 10; updateUI(); } }, 100);
setInterval(() => { localStorage.setItem('zekeClicker_V18', JSON.stringify({ zekes, buildings, clickUpgrades })); }, 5000);

function loadGame() {
    let save = JSON.parse(localStorage.getItem('zekeClicker_V18'));
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
    document.getElementById('tab-bld').className = tab === 'bld' ? 'toggle-btn active' : 'toggle-btn';
    document.getElementById('tab-upg').className = tab === 'upg' ? 'toggle-btn active' : 'toggle-btn';
    buildStore();
}
function buyBuilding(idx) { let b = buildings[idx]; let cost = getBldCost(b); if(zekes >= cost) { zekes -= cost; b.count++; recalcStats(); buildStore(); updateUI(); } }
function buyUpgrade(idx) { let u = clickUpgrades[idx]; if(zekes >= u.cost && !u.bought) { zekes -= u.cost; u.bought = true; recalcStats(); buildStore(); updateUI(); } }

function buildStore() {
    let html = '';
    if (activeStoreTab === 'bld') {
        buildings.forEach((b, i) => {
            html += `
            <div class="inventory-item">
                <div class="inv-details">
                    <span class="inv-name">${b.name} <span style="font-weight:normal; color:var(--ink-muted);">(${b.count})</span></span>
                    <span class="inv-desc">${b.desc}</span>
                    <span class="inv-yield">+${formatNum(b.cps)} Z/sec</span>
                </div>
                <button class="inv-action" id="btn-bld-${i}" onclick="buyBuilding(${i})">
                    <span class="action-lbl">ACQUIRE</span>
                    <span class="action-cost">${formatNum(getBldCost(b))}</span>
                </button>
            </div>`;
        });
    } else {
        clickUpgrades.forEach((u, i) => {
            if (!u.bought) {
                html += `
                <div class="inventory-item">
                    <div class="inv-details">
                        <span class="inv-name">${u.name}</span>
                        <span class="inv-desc">${u.desc}</span>
                    </div>
                    <button class="inv-action" id="btn-upg-${i}" onclick="buyUpgrade(${i})">
                        <span class="action-lbl">UPGRADE</span>
                        <span class="action-cost">${formatNum(u.cost)}</span>
                    </button>
                </div>`;
            }
        });
        if (html === '') html = '<p style="text-align:center; font-family:var(--font-mono); font-size:12px; color:var(--ink-muted); margin-top:20px;">ALL TRAITS ACQUIRED.</p>';
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

function restartGame() { if(confirm("CRITICAL WARNING: This will permanently purge local cache data. Proceed?")) { localStorage.removeItem('zekeClicker_V18'); location.reload(); } }

// ==========================================
// ARCADE HUB MODAL & GAMES
// ==========================================
let activeInterval = null; let gameTimer = null;
const modal = document.getElementById('arcade-modal');

function getGameMult() { return Math.max(1, Math.floor(cps / 15)); }

function openArcadeModal() { modal.classList.remove('hidden'); }
function closeArcadeModal() { modal.classList.add('hidden'); clearInterval(activeInterval); clearInterval(gameTimer); }

function openGame(tabId, element) {
    document.querySelectorAll('.game-view').forEach(el => el.classList.remove('active-view'));
    document.getElementById('game-' + tabId).classList.add('active-view');
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');
    clearInterval(activeInterval); clearInterval(gameTimer);
}

// --- 1. SNAKE (Neural Pathway) ---
const sCanvas = document.getElementById("snakeCanvas"); const sCtx = sCanvas.getContext("2d"); const box = 15;
let snake, food, goldenFood, d, snakeSpeed;
function startSnake() {
    clearInterval(activeInterval); snake = [{ x: 9 * box, y: 9 * box }]; food = spawnFood(); goldenFood = null; d = "RIGHT"; snakeSpeed = 130;
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}
function spawnFood() { return { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; }
document.addEventListener("keydown", (e) => {
    if(modal.classList.contains('hidden')) return;
    if((e.code === "ArrowLeft" || e.code === "KeyA") && d != "RIGHT") d = "LEFT";
    else if((e.code === "ArrowUp" || e.code === "KeyW") && d != "DOWN") d = "UP";
    else if((e.code === "ArrowRight" || e.code === "KeyD") && d != "LEFT") d = "RIGHT";
    else if((e.code === "ArrowDown" || e.code === "KeyS") && d != "UP") d = "DOWN";
});
function snakeLoop() {
    let isDark = document.body.classList.contains('dark-mode');
    sCtx.fillStyle = isDark ? "#1A1A1A" : "#FFFFFF"; sCtx.fillRect(0, 0, 300, 300);
    for(let i = 0; i < snake.length; i++) {
        sCtx.fillStyle = i === 0 ? (isDark ? "#4048FF" : "#1018D5") : (isDark ? "#5A5A5A" : "#5A5A5A"); sCtx.fillRect(snake[i].x, snake[i].y, box, box);
        sCtx.strokeStyle = isDark ? "#F4F0EA" : "#111111"; sCtx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    sCtx.fillStyle = "#D53F2B"; sCtx.fillRect(food.x, food.y, box, box);
    if(goldenFood) { sCtx.fillStyle = "#FFD700"; sCtx.fillRect(goldenFood.x, goldenFood.y, box, box); }

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
        alert("TERMINATED. Length: " + snake.length + " | Yield: " + formatNum(reward) + " Zekes");
        zekes += reward; updateUI(); return;
    }
    snake.unshift(newHead); activeInterval = setTimeout(snakeLoop, snakeSpeed);
}

// --- 2. JUMP (Cardio Sprint) ---
const jumper = document.getElementById("jumper"); const obs = document.getElementById("obstacle"); const coin = document.getElementById("jump-coin");
let jScore = 0, oLeft = 420, cLeft = -50, isJumping = false, canDoubleJump = false, obsType = 0;

function startJump() {
    clearInterval(activeInterval); jScore = 0; oLeft = 420; cLeft = 500; 
    obs.style.left = oLeft + 'px'; obs.style.bottom = '0px'; obs.style.background = 'var(--danger)'; obs.style.width = '16px'; obs.style.height = '32px';
    coin.classList.remove('hidden'); coin.style.left = cLeft + 'px';
    document.getElementById("jump-score").innerText = "0";
    
    activeInterval = setInterval(() => {
        let jRect = jumper.getBoundingClientRect(); let oRect = obs.getBoundingClientRect(); let cRect = coin.getBoundingClientRect();
        oLeft -= 6 + (jScore * 0.1); cLeft -= 5; 
        
        if (oLeft < -40) { 
            oLeft = 400 + Math.random() * 150; jScore += 5; 
            obsType = Math.random() < 0.3 ? 1 : 0; 
            if(obsType === 1) { obs.style.bottom = '65px'; obs.style.height = '20px'; obs.style.width = '20px'; obs.style.background = 'var(--accent)'; } 
            else { obs.style.bottom = '0px'; obs.style.height = (25 + Math.random() * 20) + 'px'; obs.style.width = (15 + Math.random() * 15) + 'px'; obs.style.background = 'var(--danger)'; }
        }
        if (cLeft < -20) { cLeft = 400 + Math.random() * 300; coin.classList.remove('hidden'); }
        
        obs.style.left = oLeft + 'px'; coin.style.left = cLeft + 'px';
        document.getElementById("jump-score").innerText = jScore;

        if (jRect.left < oRect.right && jRect.right > oRect.left && jRect.bottom > oRect.top && jRect.top < oRect.bottom) {
            clearInterval(activeInterval);
            let reward = jScore * 40 * getGameMult();
            alert("IMPACT DETECTED. Distance: " + jScore + " | Yield: " + formatNum(reward) + " Zekes."); zekes += reward; updateUI();
        }
        if (!coin.classList.contains('hidden') && jRect.left < cRect.right && jRect.right > cRect.left && jRect.top < cRect.bottom && jRect.bottom > cRect.top) {
            coin.classList.add('hidden'); jScore += 25;
        }
    }, 20);
}
document.addEventListener("keydown", (e) => { 
    if((e.code === "Space" || e.code === "ArrowUp") && document.getElementById('game-jump').classList.contains('active-view') && !modal.classList.contains('hidden')) { 
        e.preventDefault(); doJump(); 
    } 
});
function doJump() {
    if (!isJumping) {
        isJumping = true; canDoubleJump = true; jumper.className = 'jump-up';
        setTimeout(() => { if(jumper.className === 'jump-up') { jumper.className = 'jump-down'; setTimeout(() => { jumper.className = ''; isJumping = false; canDoubleJump = false; }, 300); } }, 300);
    } else if (canDoubleJump) {
        canDoubleJump = false; jumper.className = ''; void jumper.offsetWidth; jumper.className = 'jump-up';
        setTimeout(() => { jumper.className = 'jump-down'; setTimeout(() => { jumper.className = ''; isJumping = false; }, 300); }, 300);
    }
}

// --- 3. MUSCLE MEMORY ---
const ings = ["REFLEX", "STAMINA", "POWER", "FOCUS"];
let target = [], current = [], papaTime = 0, papaCombo = 1, totalPapaScore = 0;
function startPapa() {
    clearInterval(gameTimer); papaTime = 60; papaCombo = 1; totalPapaScore = 0;
    document.getElementById('papa-time').innerText = papaTime; document.getElementById('papa-combo').innerText = papaCombo;
    newOrder();
    gameTimer = setInterval(() => {
        papaTime--; document.getElementById('papa-time').innerText = papaTime;
        if(papaTime <= 0) {
            clearInterval(gameTimer); let reward = totalPapaScore * getGameMult();
            alert("ROUTINE COMPLETE. Yield: " + formatNum(reward) + " Zekes!"); zekes += reward; updateUI();
            document.getElementById('papa-order').innerText = "AWAITING INITIALIZATION"; document.getElementById('papa-current').innerText = "";
        }
    }, 1000);
}
function newOrder() {
    current = []; target = []; let len = Math.floor(Math.random() * 4) + 3; 
    for(let i=0; i<len; i++) target.push(ings[Math.floor(Math.random()*ings.length)]);
    document.getElementById('papa-order').innerText = target.join(" + "); document.getElementById('papa-current').innerText = "";
}
function addIng(ing) {
    if(papaTime <= 0) return; current.push(ing.toUpperCase()); document.getElementById('papa-current').innerText = current.join(" - ");
    for(let i=0; i<current.length; i++) {
        if(current[i] !== target[i]) { papaCombo = 1; document.getElementById('papa-combo').innerText = papaCombo; newOrder(); return; }
    }
    if(current.length === target.length) {
        totalPapaScore += (target.length * 50 * papaCombo); papaCombo++; document.getElementById('papa-combo').innerText = papaCombo; newOrder();
    }
}

// --- 4. OCULAR TRACKING ---
let aimHits = 0, aimTime = 0;
function startAim() {
    clearInterval(gameTimer); aimHits = 0; aimTime = 30; 
    document.getElementById("aim-score").innerText = "0"; document.getElementById("aim-time").innerText = aimTime;
    for(let i=1; i<=3; i++) spawnTarget(document.getElementById("at-"+i));
    
    gameTimer = setInterval(() => {
        aimTime--; document.getElementById("aim-time").innerText = aimTime;
        if(aimTime <= 0) {
            clearInterval(gameTimer); for(let i=1; i<=3; i++) document.getElementById("at-"+i).style.display = 'none';
            let reward = aimHits * 150 * getGameMult();
            alert("CALIBRATION COMPLETE. Hits: " + aimHits + " | Yield: " + formatNum(reward)); zekes += reward; updateUI();
        }
    }, 1000);
}
function spawnTarget(t) {
    t.style.display = "block"; t.style.left = Math.floor(Math.random() * 400) + "px"; t.style.top = Math.floor(Math.random() * 230) + "px";
}

document.getElementById('aim-box').addEventListener('mousedown', (e) => {
    if(aimTime <= 0 || modal.classList.contains('hidden')) return;
    if(e.target.classList.contains('aim-target')) {
        aimHits++; document.getElementById("aim-score").innerText = aimHits;
        spawnTarget(e.target);
    } else {
        aimHits = Math.max(0, aimHits - 1);
        document.getElementById("aim-score").innerText = aimHits;
    }
});

// Boot up
window.onload = loadGame;
