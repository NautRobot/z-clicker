// Rebirth Stats
let rebirthTokens = 0;
let rebirthPowerLevel = 0; 
let rebirthAutoLevel = 0;  
let rbPowerCost = 1;
let rbAutoCost = 2;

// Standard Stats
let zekes = 0; 
let baseClickGain = 1; 
let baseIdleZekes = 0; 
const costMultiplier = 2.5; 

// Costs
let zekeFingerCost = 15; 
let zekeToeCost = 100; 
let zekeFootCost = 500; 
let zekeArmCost = 2500;
let zekeLegCost = 10000;

let zekeShoeCost = 100; 
let zekeGlassesCost = 1000;
let zekeBackpackCost = 10000;
let zekeLiverCost = 100000;
let zekeRobotCost = 1000000;

let zekePartOneCost = 1000000000;
let zekePartTwoCost = 10000000000;

// Counts
let zekeFingerCount = 0; 
let zekeFootCount = 0; 
let zekeToeCount = 0; 
let zekeArmCount = 0;
let zekeLegCount = 0;

let zekeShoeCount = 0; 
let zekeGlassesCount = 0;
let zekeBackpackCount = 0;
let zekeLiverCount = 0;
let zekeRobotCount = 0;

let zekePartOne = false;
let zekePartTwo = false;

const image = document.getElementById('zeke'); 

image.addEventListener('click', () => { 
    image.classList.add('click-animation'); 
}); 

image.addEventListener('animationend', () => { 
    image.classList.remove('click-animation'); 
}); 

// Auto generate loop
setInterval(() => {
    let totalIdle = baseIdleZekes * (1 + rebirthAutoLevel);
    if (totalIdle > 0) {
        zekes += totalIdle;
        updateAll();
    }
}, 1000);

// Auto save loop (saves every 10 seconds)
setInterval(() => {
    saveGame();
}, 10000);

function buyUpgrade(upgradeName) { 
    switch(upgradeName) { 
        case 'zekeFinger': 
            if (zekes >= zekeFingerCost) { 
                zekes -= zekeFingerCost; 
                baseClickGain += 1 * Math.max(1, rebirthPowerLevel); 
                zekeFingerCount++; 
                zekeFingerCost = Math.floor(zekeFingerCost * costMultiplier); 
            } 
            break; 
        case 'zekeToe': 
            if (zekes >= zekeToeCost) { 
                zekes -= zekeToeCost; 
                baseClickGain += 5 * Math.max(1, rebirthPowerLevel); 
                zekeToeCount++; 
                zekeToeCost = Math.floor(zekeToeCost * costMultiplier); 
            } 
            break; 
        case 'zekeFoot': 
            if (zekes >= zekeFootCost) { 
                zekes -= zekeFootCost; 
                baseClickGain += 10 * Math.max(1, rebirthPowerLevel); 
                zekeFootCount++; 
                zekeFootCost = Math.floor(zekeFootCost * costMultiplier); 
            } 
            break; 
        case 'zekeArm': 
            if (zekes >= zekeArmCost) { 
                zekes -= zekeArmCost; 
                baseClickGain += 25 * Math.max(1, rebirthPowerLevel); 
                zekeArmCount++; 
                zekeArmCost = Math.floor(zekeArmCost * costMultiplier); 
            } 
            break; 
        case 'zekeLeg': 
            if (zekes >= zekeLegCost) { 
                zekes -= zekeLegCost; 
                baseClickGain += 100 * Math.max(1, rebirthPowerLevel); 
                zekeLegCount++; 
                zekeLegCost = Math.floor(zekeLegCost * costMultiplier); 
            } 
            break;
        case 'zekeShoe': 
            if (zekes >= zekeShoeCost) { 
                zekes -= zekeShoeCost; 
                baseIdleZekes += 1 * Math.max(1, rebirthAutoLevel);
                zekeShoeCount++; 
                zekeShoeCost = Math.floor(zekeShoeCost * costMultiplier); 
            } 
            break; 
        case 'zekeGlasses': 
            if (zekes >= zekeGlassesCost) { 
                zekes -= zekeGlassesCost; 
                baseIdleZekes += 5 * Math.max(1, rebirthAutoLevel);
                zekeGlassesCount++; 
                zekeGlassesCost = Math.floor(zekeGlassesCost * costMultiplier); 
            } 
            break; 
        case 'zekeBackpack': 
            if (zekes >= zekeBackpackCost) { 
                zekes -= zekeBackpackCost; 
                baseIdleZekes += 50 * Math.max(1, rebirthAutoLevel);
                zekeBackpackCount++; 
                zekeBackpackCost = Math.floor(zekeBackpackCost * costMultiplier); 
            } 
            break; 
        case 'zekeLiver': 
            if (zekes >= zekeLiverCost) { 
                zekes -= zekeLiverCost; 
                baseIdleZekes += 100 * Math.max(1, rebirthAutoLevel);
                zekeLiverCount++; 
                zekeLiverCost = Math.floor(zekeLiverCost * costMultiplier); 
            } 
            break; 
        case 'zekeRobot': 
            if (zekes >= zekeRobotCost) { 
                zekes -= zekeRobotCost; 
                baseIdleZekes += 1000 * Math.max(1, rebirthAutoLevel);
                zekeRobotCount++; 
                zekeRobotCost = Math.floor(zekeRobotCost * costMultiplier); 
            } 
            break; 
        case 'zekePartOne': 
            if (zekes >= zekePartOneCost) { 
                zekes -= zekePartOneCost; 
                zekePartOne = true;
                baseClickGain *= 1000;
                updateAll();
                document.getElementById('partOneBox').style.display = 'none';
            } 
            break; 
        case 'zekePartTwo': 
            if (zekes >= zekePartTwoCost) { 
                zekes -= zekePartTwoCost; 
                zekePartTwo = true;
                document.getElementById('partTwoBox').style.display = 'none';
            } 
            break; 
    } 

    if (zekePartOne && zekePartTwo) {
        triggerWinState();
    }

    updateAll(); 
    saveGame();
} 

function triggerWinState() {
    image.classList.add('win-image');
    document.getElementById('left-sidebar').style.display = 'none';
    document.getElementById('right-sidebar').style.display = 'none';
    document.getElementById('win-screen').style.display = 'flex';
    
    let earnedTokens = Math.max(5, Math.floor(Math.log10(zekes + 1) * 5));
    document.getElementById('pendingTokens').innerText = earnedTokens;
}

function triggerRebirth() {
    let earnedTokens = parseInt(document.getElementById('pendingTokens').innerText) || 5;
    rebirthTokens += earnedTokens;

    // Reset standard game variables
    zekes = 0;
    baseClickGain = 1;
    baseIdleZekes = 0;
    
    zekeFingerCost = 15; zekeFingerCount = 0;
    zekeToeCost = 100; zekeToeCount = 0;
    zekeFootCost = 500; zekeFootCount = 0;
    zekeArmCost = 2500; zekeArmCount = 0;
    zekeLegCost = 10000; zekeLegCount = 0;

    zekeShoeCost = 100; zekeShoeCount = 0;
    zekeGlassesCost = 1000; zekeGlassesCount = 0;
    zekeBackpackCost = 10000; zekeBackpackCount = 0;
    zekeLiverCost = 100000; zekeLiverCount = 0;
    zekeRobotCost = 1000000; zekeRobotCount = 0;

    zekePartOne = false;
    zekePartTwo = false;

    // Reset layout UI elements
    image.classList.remove('win-image');
    document.getElementById('win-screen').style.display = 'none';
    document.getElementById('partOneBox').style.display = 'block';
    document.getElementById('partTwoBox').style.display = 'block';
    
    document.getElementById('left-sidebar').style.display = 'block';
    document.getElementById('right-sidebar').style.display = 'block';
    document.getElementById('rebirth-sidebar').style.display = 'block';

    updateAll();
    saveGame();
}

function buyRebirthUpgrade(type) {
    if (type === 'power') {
        if (rebirthTokens >= rbPowerCost) {
            rebirthTokens -= rbPowerCost;
            rebirthPowerLevel++;
            rbPowerCost += 2;
        }
    } else if (type === 'auto') {
        if (rebirthTokens >= rbAutoCost) {
            rebirthTokens -= rbAutoCost;
            rebirthAutoLevel++;
            rbAutoCost += 3;
        }
    }
    updateAll();
    saveGame();
}

function updateAll() { 
    let tokenMultiplier = Math.max(1, rebirthTokens);
    let currentClickGain = (baseClickGain + rebirthPowerLevel) * tokenMultiplier;
    let currentIdleZekes = baseIdleZekes * (1 + rebirthAutoLevel);

    document.getElementById("zekeCount").innerHTML = zekes; 
    document.getElementById("zekeIdleCount").innerHTML = currentIdleZekes; 
    document.getElementById("zekeClickGain").innerHTML = currentClickGain; 
    
    document.getElementById("fingerCount").innerHTML = zekeFingerCount; 
    document.getElementById("fingerCost").innerHTML = zekeFingerCost; 
    
    document.getElementById("toeCount").innerHTML = zekeToeCount; 
    document.getElementById("toeCost").innerHTML = zekeToeCost; 
    
    document.getElementById("footCount").innerHTML = zekeFootCount; 
    document.getElementById("footCost").innerHTML = zekeFootCost; 

    document.getElementById("armCount").innerHTML = zekeArmCount; 
    document.getElementById("armCost").innerHTML = zekeArmCost; 

    document.getElementById("legCount").innerHTML = zekeLegCount; 
    document.getElementById("legCost").innerHTML = zekeLegCost; 
    
    document.getElementById("shoeCount").innerHTML = zekeShoeCount; 
    document.getElementById("shoeCost").innerHTML = zekeShoeCost; 

    document.getElementById("glassesCount").innerHTML = zekeGlassesCount; 
    document.getElementById("glassesCost").innerHTML = zekeGlassesCost; 

    document.getElementById("backpackCount").innerHTML = zekeBackpackCount; 
    document.getElementById("backpackCost").innerHTML = zekeBackpackCost; 

    document.getElementById("liverCount").innerHTML = zekeLiverCount; 
    document.getElementById("liverCost").innerHTML = zekeLiverCost; 

    document.getElementById("robotCount").innerHTML = zekeRobotCount; 
    document.getElementById("robotCost").innerHTML = zekeRobotCost; 

    document.getElementById("partOneCostDisplay").innerHTML = zekePartOneCost;
    document.getElementById("partTwoCostDisplay").innerHTML = zekePartTwoCost;

    document.getElementById("tokenCount").innerHTML = rebirthTokens;
    document.getElementById("rbPowerCount").innerHTML = rebirthPowerLevel;
    document.getElementById("rbPowerCost").innerHTML = rbPowerCost;
    document.getElementById("rbAutoCount").innerHTML = rebirthAutoLevel;
    document.getElementById("rbAutoCost").innerHTML = rbAutoCost;

    if (zekePartOne) document.getElementById('partOneBox').style.display = 'none';
    if (zekePartTwo) document.getElementById('partTwoBox').style.display = 'none';
    if (rebirthTokens > 0 || rebirthPowerLevel > 0 || rebirthAutoLevel > 0) {
        document.getElementById('rebirth-sidebar').style.display = 'block';
    }
} 

function gainZeke(amount) { 
    zekes += amount; 
    updateAll(); 
} 

function gainZekesAutoCount() { 
    let tokenMultiplier = Math.max(1, rebirthTokens);
    let currentClickGain = (baseClickGain + rebirthPowerLevel) * tokenMultiplier;
    gainZeke(currentClickGain); 
} 

// --- COOKIE SAVE SYSTEM ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function saveGame() {
    let gameState = {
        zekes, baseClickGain, baseIdleZekes,
        zekeFingerCost, zekeToeCost, zekeFootCost, zekeArmCost, zekeLegCost,
        zekeShoeCost, zekeGlassesCost, zekeBackpackCost, zekeLiverCost, zekeRobotCost,
        zekeFingerCount, zekeFootCount, zekeToeCount, zekeArmCount, zekeLegCount,
        zekeShoeCount, zekeGlassesCount, zekeBackpackCount, zekeLiverCount, zekeRobotCount,
        zekePartOne, zekePartTwo,
        rebirthTokens, rebirthPowerLevel, rebirthAutoLevel, rbPowerCost, rbAutoCost
    };
    setCookie("zekeClickerSave", JSON.stringify(gameState), 365);
}

function loadGame() {
    let savedData = getCookie("zekeClickerSave");
    if (savedData) {
        try {
            let data = JSON.parse(savedData);
            zekes = data.zekes ?? zekes;
            baseClickGain = data.baseClickGain ?? baseClickGain;
            baseIdleZekes = data.baseIdleZekes ?? baseIdleZekes;
            zekeFingerCost = data.zekeFingerCost ?? zekeFingerCost;
            zekeToeCost = data.zekeToeCost ?? zekeToeCost;
            zekeFootCost = data.zekeFootCost ?? zekeFootCost;
            zekeArmCost = data.zekeArmCost ?? zekeArmCost;
            zekeLegCost = data.zekeLegCost ?? zekeLegCost;
            zekeShoeCost = data.zekeShoeCost ?? zekeShoeCost;
            zekeGlassesCost = data.zekeGlassesCost ?? zekeGlassesCost;
            zekeBackpackCost = data.zekeBackpackCost ?? zekeBackpackCost;
            zekeLiverCost = data.zekeLiverCost ?? zekeLiverCost;
            zekeRobotCost = data.zekeRobotCost ?? zekeRobotCost;
            zekeFingerCount = data.zekeFingerCount ?? zekeFingerCount;
            zekeFootCount = data.zekeFootCount ?? zekeFootCount;
            zekeToeCount = data.zekeToeCount ?? zekeToeCount;
            zekeArmCount = data.zekeArmCount ?? zekeArmCount;
            zekeLegCount = data.zekeLegCount ?? zekeLegCount;
            zekeShoeCount = data.zekeShoeCount ?? zekeShoeCount;
            zekeGlassesCount = data.zekeGlassesCount ?? zekeGlassesCount;
            zekeBackpackCount = data.zekeBackpackCount ?? zekeBackpackCount;
            zekeLiverCount = data.zekeLiverCount ?? zekeLiverCount;
            zekeRobotCount = data.zekeRobotCount ?? zekeRobotCount;
            zekePartOne = data.zekePartOne ?? zekePartOne;
            zekePartTwo = data.zekePartTwo ?? zekePartTwo;
            rebirthTokens = data.rebirthTokens ?? rebirthTokens;
            rebirthPowerLevel = data.rebirthPowerLevel ?? rebirthPowerLevel;
            rebirthAutoLevel = data.rebirthAutoLevel ?? rebirthAutoLevel;
            rbPowerCost = data.rbPowerCost ?? rbPowerCost;
            rbAutoCost = data.rbAutoCost ?? rbAutoCost;
        } catch (e) {
            console.log("Error loading save data: ", e);
        }
    }
    updateAll();
}

window.onload = function() {
    loadGame();
};

// Prevent scrolling when using keys for arcade games
window.addEventListener("keydown", function(e) {
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1 && document.getElementById('arcade-modal').style.display === 'flex') {
        e.preventDefault();
    }
}, false);


/* =========================================
   DISCREET ARCADE LOGIC
   ========================================= */
let activeInterval = null;
let gameTimer = null;

function toggleArcade() {
    let modal = document.getElementById('arcade-modal');
    if(modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
        clearInterval(activeInterval);
        clearInterval(gameTimer);
    }
}

function switchArcade(gameId) {
    document.querySelectorAll('.arcade-view').forEach(el => el.style.display = 'none');
    document.getElementById('game-' + gameId).style.display = 'block';
    
    let tabs = document.querySelectorAll('.arcade-tabs button');
    tabs.forEach(btn => btn.classList.remove('active-tab'));
    event.target.classList.add('active-tab');

    clearInterval(activeInterval);
    clearInterval(gameTimer);
}

function getGameReward() {
    let tokenMultiplier = Math.max(1, rebirthTokens);
    return Math.max(10, Math.floor((baseClickGain + baseIdleZekes) * tokenMultiplier * 5));
}

// --- 1. SNAKE ---
const sCanvas = document.getElementById("snakeCanvas"); 
const sCtx = sCanvas.getContext("2d"); 
const box = 15;
let snake, food, d, snakeSpeed;

function startSnake() {
    clearInterval(activeInterval); 
    snake = [{ x: 9 * box, y: 9 * box }]; 
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    d = "RIGHT"; 
    snakeSpeed = 120;
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}

document.addEventListener("keydown", (e) => {
    if(document.getElementById('arcade-modal').style.display !== 'flex') return;
    if((e.code === "ArrowLeft" || e.code === "KeyA") && d != "RIGHT") d = "LEFT";
    else if((e.code === "ArrowUp" || e.code === "KeyW") && d != "DOWN") d = "UP";
    else if((e.code === "ArrowRight" || e.code === "KeyD") && d != "LEFT") d = "RIGHT";
    else if((e.code === "ArrowDown" || e.code === "KeyS") && d != "UP") d = "DOWN";
});

function snakeLoop() {
    sCtx.fillStyle = "#000"; sCtx.fillRect(0, 0, 300, 300);
    for(let i = 0; i < snake.length; i++) {
        sCtx.fillStyle = i === 0 ? "#00ffff" : "#ff007f"; 
        sCtx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    sCtx.fillStyle = "#fff"; sCtx.fillRect(food.x, food.y, box, box);

    let sX = snake[0].x, sY = snake[0].y;
    if(d == "LEFT") sX -= box; 
    if(d == "UP") sY -= box; 
    if(d == "RIGHT") sX += box; 
    if(d == "DOWN") sY += box;

    if(sX == food.x && sY == food.y) {
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
        snakeSpeed = Math.max(50, snakeSpeed - 2);
    } else { 
        snake.pop(); 
    }

    let newHead = { x: sX, y: sY };
    if(sX < 0 || sX >= 300 || sY < 0 || sY >= 300 || snake.some(s => s.x === sX && s.y === sY)) {
        let reward = (snake.length - 1) * getGameReward();
        alert("Game Over. Length: " + snake.length + " | Earned: " + reward);
        gainZeke(reward);
        return;
    }
    snake.unshift(newHead); 
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}

// --- 2. JUMP ---
const jumper = document.getElementById("jumper"); 
const obs = document.getElementById("obstacle"); 
let jScore = 0, oLeft = 320, isJumping = false;

function startJump() {
    clearInterval(activeInterval); 
    jScore = 0; oLeft = 320; 
    obs.style.left = oLeft + 'px'; 
    document.getElementById("jump-score").innerText = "0";
    
    activeInterval = setInterval(() => {
        let jTop = parseInt(window.getComputedStyle(jumper).getPropertyValue("bottom"));
        oLeft -= 5 + (jScore * 0.1); 
        
        if (oLeft < -20) { 
            oLeft = 300 + Math.random() * 100; 
            jScore += 5; 
        }
        obs.style.left = oLeft + 'px'; 
        document.getElementById("jump-score").innerText = jScore;

        if (oLeft > 15 && oLeft < 50 && jTop <= 25) {
            clearInterval(activeInterval);
            let reward = jScore * getGameReward();
            alert("Crash! Score: " + jScore + " | Earned: " + reward); 
            gainZeke(reward);
        }
    }, 20);
}

document.addEventListener("keydown", (e) => { 
    if((e.code === "Space" || e.code === "ArrowUp") && document.getElementById('game-jump').style.display === 'block') { 
        if(!isJumping) doJump(); 
    } 
});

function doJump() {
    isJumping = true; 
    jumper.classList.add('jump-anim');
    setTimeout(() => { jumper.classList.remove('jump-anim'); isJumping = false; }, 500);
}

// --- 3. PAPA'S PIZZERIA (DRAG & DROP) ---
const ingredients = ["Dough", "Sauce", "Cheese", "Pepperoni"];
let papaTarget = [], currentPapa = [], papaTime = 0, papaCombo = 1, totalPapaScore = 0;

function startPapa() {
    clearInterval(gameTimer); 
    papaTime = 60; papaCombo = 1; totalPapaScore = 0;
    document.getElementById('papa-time').innerText = papaTime; 
    document.getElementById('papa-combo').innerText = papaCombo;
    newPapaOrder();
    
    gameTimer = setInterval(() => {
        papaTime--; 
        document.getElementById('papa-time').innerText = papaTime;
        if(papaTime <= 0) {
            clearInterval(gameTimer); 
            let reward = totalPapaScore * getGameReward();
            alert("Shift Over! Earned: " + reward); 
            gainZeke(reward);
            document.getElementById('papa-order').innerText = "Click Start"; 
            document.getElementById('pizza-base').innerHTML = "Drag Ingredients Here!";
        }
    }, 1000);
}

function newPapaOrder() {
    currentPapa = []; 
    papaTarget = ["Dough"]; // Pizza always starts with dough
    let len = Math.floor(Math.random() * 3) + 2; // 2 to 4 extra toppings
    for(let i=0; i<len; i++) {
        let randIng = ingredients[Math.floor(Math.random() * ingredients.length)];
        // Prevent double dough
        if(randIng === "Dough") randIng = "Cheese"; 
        papaTarget.push(randIng);
    }
    document.getElementById('papa-order').innerText = "Order: " + papaTarget.join(" -> "); 
    document.getElementById('pizza-base').innerHTML = "Drag Ingredients Here!";
}

// Drag & Drop Events
function dragPapa(ev) {
    if(papaTime <= 0) return;
    ev.dataTransfer.setData("text", ev.target.getAttribute('data-ing'));
}
function allowDropPapa(ev) {
    ev.preventDefault();
}
function dropPapa(ev) {
    ev.preventDefault();
    if(papaTime <= 0) return;
    var data = ev.dataTransfer.getData("text");
    
    currentPapa.push(data);
    
    // Visually update the pizza base
    document.getElementById('pizza-base').innerHTML = "Current:<br>" + currentPapa.join(", ");
    
    // Check accuracy
    for(let i=0; i<currentPapa.length; i++) {
        if(currentPapa[i] !== papaTarget[i]) { 
            papaCombo = 1; 
            document.getElementById('papa-combo').innerText = papaCombo; 
            newPapaOrder(); 
            return; 
        }
    }
    
    // Order Complete
    if(currentPapa.length === papaTarget.length) {
        totalPapaScore += (papaTarget.length * papaCombo); 
        papaCombo++; 
        document.getElementById('papa-combo').innerText = papaCombo; 
        newPapaOrder();
    }
}

// --- 4. AIM TRAINER ---
let aimHits = 0, aimTime = 0;
function startAim() {
    clearInterval(gameTimer); 
    aimHits = 0; aimTime = 30; 
    document.getElementById("aim-score").innerText = "0"; 
    document.getElementById("aim-time").innerText = aimTime;
    spawnTarget();
    
    gameTimer = setInterval(() => {
        aimTime--; 
        document.getElementById("aim-time").innerText = aimTime;
        if(aimTime <= 0) {
            clearInterval(gameTimer); 
            document.getElementById("aim-target-1").style.display = 'none';
            let reward = aimHits * getGameReward();
            alert("Time's up! Hits: " + aimHits + " | Earned: " + reward); 
            gainZeke(reward);
        }
    }, 1000);
}

function spawnTarget() {
    let t = document.getElementById("aim-target-1");
    t.style.display = "block"; 
    t.style.left = Math.floor(Math.random() * 260) + "px"; 
    t.style.top = Math.floor(Math.random() * 160) + "px";
}

function handleAimClick(e) {
    if(aimTime <= 0) return;
    if(e.target.classList.contains('aim-target')) {
        aimHits++; 
        document.getElementById("aim-score").innerText = aimHits;
        spawnTarget();
    } else {
        aimHits = Math.max(0, aimHits - 1);
        document.getElementById("aim-score").innerText = aimHits;
    }
}
