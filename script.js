// ==========================================
// THE PANIC BUTTON (BOSS KEY)
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

const upgrades = [
    { id: 'u1', name: "Bathroom Pass", desc: "Adds +1 Zekes/sec. Take the whole period.", baseCost: 15, cps: 1, count: 0 },
    { id: 'u2', name: "Cool Math Games Proxy", desc: "Adds +5 Zekes/sec. Bypass the firewall.", baseCost: 100, cps: 5, count: 0 },
    { id: 'u3', name: "Kahoot Bot", desc: "Adds +20 Zekes/sec. Spam the lobby.", baseCost: 1000, cps: 20, count: 0 },
    { id: 'u4', name: "Stolen Wifi Password", desc: "Adds +100 Zekes/sec. Teacher's lounge access.", baseCost: 12000, cps: 100, count: 0 },
    { id: 'u5', name: "Ctrl+C Ctrl+V", desc: "Adds +500 Zekes/sec. Plagiarize your essays.", baseCost: 100000, cps: 500, count: 0 },
    { id: 'u6', name: "Inspect Element Hack", desc: "Adds +3000 Zekes/sec. Change your grades to A+.", baseCost: 1500000, cps: 3000, count: 0 }
];

function getCost(u) { return Math.floor(u.baseCost * Math.pow(1.15, u.count)); }
function getClickPower() { return 1 + Math.floor(cps * 0.1); } // Clicks are worth 1 + 10% of CPS

// The mighty click
const zekeImg = document.getElementById('main-zeke');
zekeImg.addEventListener('mousedown', (e) => {
    let power = getClickPower();
    zekes += power;
    
    // Floating text
    let f = document.createElement('div');
    f.className = 'float-txt';
    f.innerText = '+' + power;
    f.style.left = (e.clientX - 10 + (Math.random()*20)) + 'px';
    f.style.top = (e.clientY - 20) + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1000);
    
    updateUI();
});

// Game Loop
setInterval(() => {
    if(!isPanicking && cps > 0) {
        zekes += cps / 10;
        updateUI();
    }
}, 100);

// Auto Save
setInterval(() => {
    localStorage.setItem('shittyZekeSave', JSON.stringify({ zekes, upgrades }));
}, 5000);

function loadGame() {
    let save = JSON.parse(localStorage.getItem('shittyZekeSave'));
    if(save) {
        zekes = save.zekes || 0;
        if(save.upgrades) {
            save.upgrades.forEach((savedU, i) => { if(upgrades[i]) upgrades[i].count = savedU.count; });
        }
    }
    recalcCPS();
    buildStore();
    updateUI();
}

function recalcCPS() {
    cps = 0;
    upgrades.forEach(u => cps += u.cps * u.count);
    // Spin Zeke faster if high CPS
    zekeImg.style.animationDuration = Math.max(0.5, 10 - (cps/100)) + 's';
}

function buyUpgrade(idx) {
    let u = upgrades[idx];
    let cost = getCost(u);
    if(zekes >= cost) {
        zekes -= cost;
        u.count++;
        recalcCPS();
        buildStore();
        updateUI();
    }
}

function buildStore() {
    let html = '';
    upgrades.forEach((u, i) => {
        let cost = getCost(u);
        html += `<button class="upg-btn" ${zekes < cost ? 'disabled' : ''} onclick="buyUpgrade(${i})">
            <div>
                <div style="font-size:18px;">${u.name} (Owned: ${u.count})</div>
                <div style="font-size:12px; color:#aaa;">${u.desc}</div>
            </div>
            <div style="color:#00ffff;">Cost: ${Math.floor(cost).toLocaleString()}</div>
        </button>`;
    });
    document.getElementById('store').innerHTML = html;
}

function updateUI() {
    document.getElementById('zekeCount').innerText = Math.floor(zekes).toLocaleString();
    document.getElementById('cpsDisplay').innerText = Math.floor(cps).toLocaleString();
    
    // Enable/disable store buttons without rebuilding
    upgrades.forEach((u, i) => {
        let btn = document.getElementById('store').children[i];
        if(btn) btn.disabled = zekes < getCost(u);
    });
}

function restartGame() {
    if(confirm("DELETE EVERYTHING? FR? NO CAP?")) {
        localStorage.removeItem('shittyZekeSave');
        location.reload();
    }
}

// ==========================================
// MINIGAMES HUB LOGIC
// ==========================================
function switchTab(tabId) {
    // Hide all
    document.querySelectorAll('.minigame').forEach(el => el.classList.remove('active-minigame'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Show specific
    document.getElementById('game-' + tabId).classList.add('active-minigame');
    document.querySelector(`.tab-btn[onclick="switchTab('${tabId}')"]`).classList.add('active');

    // Kill running game loops to save CPU
    clearInterval(snakeInterval);
    clearInterval(jumpInterval);
}

// ------------------------------------------
// 1. ZEKE SNAKE
// ------------------------------------------
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake, snakeFood, d, snakeInterval;

let zekeImage = new Image();
zekeImage.src = 'zeke.jpg'; // Tries to load zeke.jpg to draw on canvas

function startSnake() {
    clearInterval(snakeInterval);
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    snakeFood = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    d = "RIGHT";
    snakeInterval = setInterval(drawSnake, 100);
}

document.addEventListener("keydown", (e) => {
    let key = e.keyCode;
    if(key == 37 && d != "RIGHT") d = "LEFT";
    else if(key == 38 && d != "DOWN") d = "UP";
    else if(key == 39 && d != "LEFT") d = "RIGHT";
    else if(key == 40 && d != "UP") d = "DOWN";
});

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function drawSnake() {
    if(isPanicking) return;
    
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 400, 400);

    for(let i = 0; i < snake.length; i++) {
        if(i === 0) {
            try { ctx.drawImage(zekeImage, snake[i].x, snake[i].y, box, box); } 
            catch(e) { ctx.fillStyle = "yellow"; ctx.fillRect(snake[i].x, snake[i].y, box, box); }
        } else {
            ctx.fillStyle = "#ff00ff";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }
    }

    try { ctx.drawImage(zekeImage, snakeFood.x, snakeFood.y, box, box); } 
    catch(e) { ctx.fillStyle = "red"; ctx.fillRect(snakeFood.x, snakeFood.y, box, box); }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    if(snakeX == snakeFood.x && snakeY == snakeFood.y) {
        snakeFood = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeX >= 400 || snakeY < 0 || snakeY >= 400 || collision(newHead, snake)) {
        clearInterval(snakeInterval);
        let reward = (snake.length - 1) * 200;
        alert("GAME OVER! You ate " + (snake.length-1) + " Zekes. Reward: " + reward + " Zekes.");
        zekes += reward;
        updateUI();
        return;
    }

    snake.unshift(newHead);
}

// ------------------------------------------
// 2. ZEKE JUMP (DINO CLONE)
// ------------------------------------------
const jumper = document.getElementById("jumper");
const obstacle = document.getElementById("obstacle");
let jumpScore = 0;
let jumpInterval;

function startJump() {
    clearInterval(jumpInterval);
    jumpScore = 0;
    obstacle.classList.add("obs-anim");
    document.getElementById("jump-score").innerText = "Score: " + jumpScore;
    
    jumpInterval = setInterval(() => {
        if(isPanicking) return;
        
        let jTop = parseInt(window.getComputedStyle(jumper).getPropertyValue("bottom"));
        let oLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));

        // Collision logic
        if(oLeft > 50 && oLeft < 90 && jTop <= 50) {
            obstacle.classList.remove("obs-anim");
            clearInterval(jumpInterval);
            let reward = jumpScore * 50;
            alert("BONK! You hit a desk. Reward: " + reward + " Zekes.");
            zekes += reward;
            updateUI();
        } else if (oLeft < 10 && oLeft > -10) {
            jumpScore++;
            document.getElementById("jump-score").innerText = "Score: " + jumpScore;
        }
    }, 50);
}

// Jump controls
document.addEventListener("keydown", (e) => {
    if(e.code === "Space" && document.getElementById('game-jump').classList.contains('active-minigame')) {
        doJump();
    }
});
document.getElementById('jump-world').addEventListener("mousedown", doJump);

function doJump() {
    if(jumper.classList.contains("jump-anim")) return;
    jumper.classList.add("jump-anim");
    setTimeout(() => { jumper.classList.remove("jump-anim"); }, 500);
}

// ------------------------------------------
// 3. PAPA ZEKE'S PIZZERIA
// ------------------------------------------
const allIngs = ["Dough", "Sauce", "Cheese", "Zeke"];
let targetOrder = [];
let currentBuild = [];

function startPapa() {
    currentBuild = [];
    targetOrder = [];
    let len = Math.floor(Math.random() * 3) + 3; // Orders are 3-5 items long
    for(let i=0; i<len; i++) {
        targetOrder.push(allIngs[Math.floor(Math.random()*allIngs.length)]);
    }
    document.getElementById('current-order').innerText = targetOrder.join(" ➔ ");
    document.getElementById('papa-current').innerText = "";
}

function addIng(ing) {
    if(targetOrder.length === 0) return; // Game not started
    
    currentBuild.push(ing);
    document.getElementById('papa-current').innerText = currentBuild.join(" - ");

    // Check if correct so far
    for(let i=0; i<currentBuild.length; i++) {
        if(currentBuild[i] !== targetOrder[i]) {
            alert("YOU RUINED THE PIZZA! Start over.");
            startPapa();
            return;
        }
    }

    // Check if finished
    if(currentBuild.length === targetOrder.length) {
        let reward = targetOrder.length * 500;
        alert("PERFECT PIZZA! Mama mia! Reward: " + reward + " Zekes!");
        zekes += reward;
        updateUI();
        startPapa(); // Next order
    }
}

// Init
window.onload = loadGame;
