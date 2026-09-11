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

// RE-BALANCED SCALING MULTIPLIER (1.15 = standard 15% increase per purchase)
const costMultiplier = 1.15; 

// Balanced Base Costs & Progression
let zekeFingerCost = 15; 
let zekeToeCost = 100; 
let zekeFootCost = 500; 
let zekeArmCost = 3000;
let zekeLegCost = 20000;

let zekeShoeCost = 50; 
let zekeGlassesCost = 300;
let zekeBackpackCost = 2000;
let zekeLiverCost = 15000;
let zekeRobotCost = 100000;

let zekePartOneCost = 5000000;    // 5 Million
let zekePartTwoCost = 25000000;   // 25 Million

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

if (image) {
    image.addEventListener('click', () => { 
        image.classList.add('click-animation'); 
    }); 

    image.addEventListener('animationend', () => { 
        image.classList.remove('click-animation'); 
    }); 
}

// Auto generate loop (Passive Income)
setInterval(() => {
    let totalIdle = baseIdleZekes * (1 + rebirthAutoLevel);
    if (totalIdle > 0) {
        zekes += totalIdle;
        updateAll();
    }
}, 1000);

// Auto save loop
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
                baseClickGain += 20 * Math.max(1, rebirthPowerLevel); 
                zekeFootCount++; 
                zekeFootCost = Math.floor(zekeFootCost * costMultiplier); 
            } 
            break; 
        case 'zekeArm': 
            if (zekes >= zekeArmCost) { 
                zekes -= zekeArmCost; 
                baseClickGain += 100 * Math.max(1, rebirthPowerLevel); 
                zekeArmCount++; 
                zekeArmCost = Math.floor(zekeArmCost * costMultiplier); 
            } 
            break; 
        case 'zekeLeg': 
            if (zekes >= zekeLegCost) { 
                zekes -= zekeLegCost; 
                baseClickGain += 500 * Math.max(1, rebirthPowerLevel); 
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
                baseIdleZekes += 8 * Math.max(1, rebirthAutoLevel);
                zekeGlassesCount++; 
                zekeGlassesCost = Math.floor(zekeGlassesCost * costMultiplier); 
            } 
            break; 
        case 'zekeBackpack': 
            if (zekes >= zekeBackpackCost) { 
                zekes -= zekeBackpackCost; 
                baseIdleZekes += 45 * Math.max(1, rebirthAutoLevel);
                zekeBackpackCount++; 
                zekeBackpackCost = Math.floor(zekeBackpackCost * costMultiplier); 
            } 
            break; 
        case 'zekeLiver': 
            if (zekes >= zekeLiverCost) { 
                zekes -= zekeLiverCost; 
                baseIdleZekes += 250 * Math.max(1, rebirthAutoLevel);
                zekeLiverCount++; 
                zekeLiverCost = Math.floor(zekeLiverCost * costMultiplier); 
            } 
            break; 
        case 'zekeRobot': 
            if (zekes >= zekeRobotCost) { 
                zekes -= zekeRobotCost; 
                baseIdleZekes += 1500 * Math.max(1, rebirthAutoLevel);
                zekeRobotCount++; 
                zekeRobotCost = Math.floor(zekeRobotCost * costMultiplier); 
            } 
            break; 
        case 'zekePartOne': 
            if (zekes >= zekePartOneCost) { 
                zekes -= zekePartOneCost; 
                zekePartOne = true;
                baseClickGain *= 10;
                updateAll();
                if (document.getElementById('partOneBox')) document.getElementById('partOneBox').style.display = 'none';
            } 
            break; 
        case 'zekePartTwo': 
            if (zekes >= zekePartTwoCost) { 
                zekes -= zekePartTwoCost; 
                zekePartTwo = true;
                if (document.getElementById('partTwoBox')) document.getElementById('partTwoBox').style.display = 'none';
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
    if (image) image.classList.add('win-image');
    if (document.getElementById('left-sidebar')) document.getElementById('left-sidebar').style.display = 'none';
    if (document.getElementById('right-sidebar')) document.getElementById('right-sidebar').style.display = 'none';
    if (document.getElementById('win-screen')) document.getElementById('win-screen').style.display = 'flex';
    
    let earnedTokens = Math.max(5, Math.floor(Math.log10(zekes + 1) * 5));
    if (document.getElementById('pendingTokens')) document.getElementById('pendingTokens').innerText = earnedTokens;
}

function triggerRebirth() {
    let earnedTokens = parseInt(document.getElementById('pendingTokens').innerText) || 5;
    rebirthTokens += earnedTokens;

    zekes = 0;
    baseClickGain = 1;
    baseIdleZekes = 0;
    
    zekeFingerCost = 15; zekeFingerCount = 0;
    zekeToeCost = 100; zekeToeCount = 0;
    zekeFootCost = 500; zekeFootCount = 0;
    zekeArmCost = 3000; zekeArmCount = 0;
    zekeLegCost = 20000; zekeLegCount = 0;

    zekeShoeCost = 50; zekeShoeCount = 0;
    zekeGlassesCost = 300; zekeGlassesCount = 0;
    zekeBackpackCost = 2000; zekeBackpackCount = 0;
    zekeLiverCost = 15000; zekeLiverCount = 0;
    zekeRobotCost = 100000; zekeRobotCount = 0;

    zekePartOne = false;
    zekePartTwo = false;

    if (image) image.classList.remove('win-image');
    if (document.getElementById('win-screen')) document.getElementById('win-screen').style.display = 'none';
    if (document.getElementById('partOneBox')) document.getElementById('partOneBox').style.display = 'block';
    if (document.getElementById('partTwoBox')) document.getElementById('partTwoBox').style.display = 'block';
    
    if (document.getElementById('left-sidebar')) document.getElementById('left-sidebar').style.display = 'block';
    if (document.getElementById('right-sidebar')) document.getElementById('right-sidebar').style.display = 'block';
    if (document.getElementById('rebirth-sidebar')) document.getElementById('rebirth-sidebar').style.display = 'block';

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

    if (document.getElementById("zekeCount")) document.getElementById("zekeCount").innerHTML = Math.floor(zekes).toLocaleString(); 
    if (document.getElementById("zekeIdleCount")) document.getElementById("zekeIdleCount").innerHTML = Math.floor(currentIdleZekes).toLocaleString(); 
    if (document.getElementById("zekeClickGain")) document.getElementById("zekeClickGain").innerHTML = Math.floor(currentClickGain).toLocaleString(); 
    
    if (document.getElementById("fingerCount")) document.getElementById("fingerCount").innerHTML = zekeFingerCount; 
    if (document.getElementById("fingerCost")) document.getElementById("fingerCost").innerHTML = zekeFingerCost.toLocaleString(); 
    
    if (document.getElementById("toeCount")) document.getElementById("toeCount").innerHTML = zekeToeCount; 
    if (document.getElementById("toeCost")) document.getElementById("toeCost").innerHTML = zekeToeCost.toLocaleString(); 
    
    if (document.getElementById("footCount")) document.getElementById("footCount").innerHTML = zekeFootCount; 
    if (document.getElementById("footCost")) document.getElementById("footCost").innerHTML = zekeFootCost.toLocaleString(); 

    if (document.getElementById("armCount")) document.getElementById("armCount").innerHTML = zekeArmCount; 
    if (document.getElementById("armCost")) document.getElementById("armCost").innerHTML = zekeArmCost.toLocaleString(); 

    if (document.getElementById("legCount")) document.getElementById("legCount").innerHTML = zekeLegCount; 
    if (document.getElementById("legCost")) document.getElementById("legCost").innerHTML = zekeLegCost.toLocaleString(); 
    
    if (document.getElementById("shoeCount")) document.getElementById("shoeCount").innerHTML = zekeShoeCount; 
    if (document.getElementById("shoeCost")) document.getElementById("shoeCost").innerHTML = zekeShoeCost.toLocaleString(); 

    if (document.getElementById("glassesCount")) document.getElementById("glassesCount").innerHTML = zekeGlassesCount; 
    if (document.getElementById("glassesCost")) document.getElementById("glassesCost").innerHTML = zekeGlassesCost.toLocaleString(); 

    if (document.getElementById("backpackCount")) document.getElementById("backpackCount").innerHTML = zekeBackpackCount; 
    if (document.getElementById("backpackCost")) document.getElementById("backpackCost").innerHTML = zekeBackpackCost.toLocaleString(); 

    if (document.getElementById("liverCount")) document.getElementById("liverCount").innerHTML = zekeLiverCount; 
    if (document.getElementById("liverCost")) document.getElementById("liverCost").innerHTML = zekeLiverCost.toLocaleString(); 

    if (document.getElementById("robotCount")) document.getElementById("robotCount").innerHTML = zekeRobotCount; 
    if (document.getElementById("robotCost")) document.getElementById("robotCost").innerHTML = zekeRobotCost.toLocaleString(); 

    if (document.getElementById("partOneCostDisplay")) document.getElementById("partOneCostDisplay").innerHTML = zekePartOneCost.toLocaleString();
    if (document.getElementById("partTwoCostDisplay")) document.getElementById("partTwoCostDisplay").innerHTML = zekePartTwoCost.toLocaleString();

    if (document.getElementById("tokenCount")) document.getElementById("tokenCount").innerHTML = rebirthTokens.toLocaleString();
    if (document.getElementById("rbPowerCount")) document.getElementById("rbPowerCount").innerHTML = rebirthPowerLevel;
    if (document.getElementById("rbPowerCost")) document.getElementById("rbPowerCost").innerHTML = rbPowerCost.toLocaleString();
    if (document.getElementById("rbAutoCount")) document.getElementById("rbAutoCount").innerHTML = rebirthAutoLevel;
    if (document.getElementById("rbAutoCost")) document.getElementById("rbAutoCost").innerHTML = rbAutoCost.toLocaleString();

    if (zekePartOne && document.getElementById('partOneBox')) document.getElementById('partOneBox').style.display = 'none';
    if (zekePartTwo && document.getElementById('partTwoBox')) document.getElementById('partTwoBox').style.display = 'none';
    if ((rebirthTokens > 0 || rebirthPowerLevel > 0 || rebirthAutoLevel > 0) && document.getElementById('rebirth-sidebar')) {
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

window.addEventListener("keydown", function(e) {
    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1 && document.getElementById('arcade-modal') && document.getElementById('arcade-modal').style.display === 'flex') {
        e.preventDefault();
    }
}, false);


/* =========================================
   DISCREET ARCADE LOGIC
   ========================================= */
let activeInterval = null;
let gameTimer = null;
let aimMoveTimer = null;

function toggleArcade() {
    let modal = document.getElementById('arcade-modal');
    if(modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
        clearInterval(activeInterval);
        clearInterval(gameTimer);
        clearInterval(aimMoveTimer);
    }
}

function switchArcade(gameId) {
    document.querySelectorAll('.arcade-view').forEach(el => el.style.display = 'none');
    document.getElementById('game-' + gameId).style.display = 'block';
    
    let tabs = document.querySelectorAll('.arcade-tabs button');
    tabs.forEach(btn => btn.classList.remove('active-tab'));
    if (event && event.target) event.target.classList.add('active-tab');

    clearInterval(activeInterval);
    clearInterval(gameTimer);
    clearInterval(aimMoveTimer);
}

function getGameReward() {
    let tokenMultiplier = Math.max(1, rebirthTokens);
    return Math.max(10, Math.floor((baseClickGain + baseIdleZekes) * tokenMultiplier * 5));
}

// --- 1. SNAKE ---
const sCanvas = document.getElementById("snakeCanvas"); 
const sCtx = sCanvas ? sCanvas.getContext("2d") : null; 
const box = 15;
let snake, food, d, snakeSpeed;

function startSnake() {
    if (!sCtx) return;
    clearInterval(activeInterval); 
    snake = [{ x: 9 * box, y: 9 * box }]; 
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    d = "RIGHT"; 
    snakeSpeed = 80;
    activeInterval = setTimeout(snakeLoop, snakeSpeed);
}

document.addEventListener("keydown", (e) => {
    let modal = document.getElementById('arcade-modal');
    if(!modal || modal.style.display !== 'flex') return;
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
        snakeSpeed = Math.max(30, snakeSpeed - 4);
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
    if (obs) obs.style.left = oLeft + 'px'; 
    if (document.getElementById("jump-score")) document.getElementById("jump-score").innerText = "0";
    
    activeInterval = setInterval(() => {
        if (!jumper || !obs) return;
        let jTop = parseInt(window.getComputedStyle(jumper).getPropertyValue("bottom"));
        oLeft -= 10 + (jScore * 0.2); 
        
        if (oLeft < -20) { 
            oLeft = 300 + Math.random() * 100; 
            jScore += 5; 
        }
        obs.style.left = oLeft + 'px'; 
        if (document.getElementById("jump-score")) document.getElementById("jump-score").innerText = jScore;

        if (oLeft > 15 && oLeft < 50 && jTop <= 25) {
            clearInterval(activeInterval);
            let reward = jScore * getGameReward();
            alert("Crash! Score: " + jScore + " | Earned: " + reward); 
            gainZeke(reward);
        }
    }, 20);
}

document.addEventListener("keydown", (e) => { 
    if((e.code === "Space" || e.code === "ArrowUp") && document.getElementById('game-jump') && document.getElementById('game-jump').style.display === 'block') { 
        if(!isJumping) doJump(); 
    } 
});

function doJump() {
    if (!jumper) return;
    isJumping = true; 
    jumper.classList.add('jump-anim');
    setTimeout(() => { jumper.classList.remove('jump-anim'); isJumping = false; }, 350);
}

// --- 3. PAPA'S PIZZERIA (SVG VISUAL STACKING) ---
const ingredients = ["Dough", "Sauce", "Cheese", "Pepperoni"];
let papaTarget = [], currentPapa = [], papaTime = 0, papaCombo = 1, totalPapaScore = 0;

const svgMap = {
    "Dough": `<svg style="position:absolute; top:20px; left:20px; width:100px; height:100px; z-index:1;" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#f5d7b5" stroke="#d4b48f" stroke-width="2"/></svg>`,
    "Sauce": `<svg style="position:absolute; top:20px; left:20px; width:100px; height:100px; z-index:2;" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#d9381e"/></svg>`,
    "Cheese": `<svg style="position:absolute; top:20px; left:20px; width:100px; height:100px; z-index:3;" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#f4d03f" stroke="#f1c40f" stroke-width="2" stroke-dasharray="5,5"/></svg>`,
    "Pepperoni": `<svg style="position:absolute; top:20px; left:20px; width:100px; height:100px; z-index:4;" viewBox="0 0 100 100">
        <circle cx="35" cy="35" r="10" fill="#c0392b"/>
        <circle cx="65" cy="45" r="10" fill="#c0392b"/>
        <circle cx="45" cy="70" r="10" fill="#c0392b"/>
        <circle cx="55" cy="25" r="10" fill="#c0392b"/>
        <circle cx="30" cy="60" r="10" fill="#c0392b"/>
    </svg>`
};

function startPapa() {
    clearInterval(gameTimer); 
    papaTime = 30; 
    papaCombo = 1; 
    totalPapaScore = 0;
    if (document.getElementById('papa-time')) document.getElementById('papa-time').innerText = papaTime; 
    if (document.getElementById('papa-combo')) document.getElementById('papa-combo').innerText = papaCombo;
    newPapaOrder();
    
    gameTimer = setInterval(() => {
        papaTime--; 
        if (document.getElementById('papa-time')) document.getElementById('papa-time').innerText = papaTime;
        if(papaTime <= 0) {
            clearInterval(gameTimer); 
            let reward = totalPapaScore * getGameReward();
            alert("Shift Over! Earned: " + reward); 
            gainZeke(reward);
            if (document.getElementById('papa-order')) document.getElementById('papa-order').innerText = "Click Start"; 
            if (document.getElementById('pizza-base')) document.getElementById('pizza-base').innerHTML = "Drag Ingredients Here!";
        }
    }, 1000);
}

function newPapaOrder() {
    currentPapa = []; 
    papaTarget = ["Dough"]; 
    let len = Math.floor(Math.random() * 3) + 2; 
    for(let i=0; i<len; i++) {
        let randIng = ingredients[Math.floor(Math.random() * ingredients.length)];
        if(randIng === "Dough") randIng = "Cheese"; 
        papaTarget.push(randIng);
    }
    if (document.getElementById('papa-order')) document.getElementById('papa-order').innerText = "Order: " + papaTarget.join(" -> "); 
    if (document.getElementById('pizza-base')) document.getElementById('pizza-base').innerHTML = "Drop Here!";
}

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
    
    let pizzaBase = document.getElementById('pizza-base');
    if (!pizzaBase) return;

    if(currentPapa.length === 1) {
        pizzaBase.innerHTML = "";
    }
    
    pizzaBase.innerHTML += svgMap[data];
    
    for(let i=0; i<currentPapa.length; i++) {
        if(currentPapa[i] !== papaTarget[i]) { 
            papaCombo = 1; 
            if (document.getElementById('papa-combo')) document.getElementById('papa-combo').innerText = papaCombo; 
            
            pizzaBase.style.borderColor = "red";
            setTimeout(() => pizzaBase.style.borderColor = "#ff007f", 300);
            
            newPapaOrder(); 
            return; 
        }
    }
    
    if(currentPapa.length === papaTarget.length) {
        totalPapaScore += (papaTarget.length * papaCombo); 
        papaCombo++; 
        if (document.getElementById('papa-combo')) document.getElementById('papa-combo').innerText = papaCombo; 
        
        pizzaBase.style.borderColor = "#00ff00";
        setTimeout(() => pizzaBase.style.borderColor = "#ff007f", 300);

        newPapaOrder();
    }
}

// --- 4. AIM TRAINER ---
let aimHits = 0, aimTime = 0;

function startAim() {
    clearInterval(gameTimer); 
    clearInterval(aimMoveTimer);
    aimHits = 0; aimTime = 15; 
    if (document.getElementById("aim-score")) document.getElementById("aim-score").innerText = "0"; 
    if (document.getElementById("aim-time")) document.getElementById("aim-time").innerText = aimTime;
    
    spawnTarget();
    aimMoveTimer = setInterval(spawnTarget, 600); 
    
    gameTimer = setInterval(() => {
        aimTime--; 
        if (document.getElementById("aim-time")) document.getElementById("aim-time").innerText = aimTime;
        if(aimTime <= 0) {
            clearInterval(gameTimer); 
            clearInterval(aimMoveTimer);
            if (document.getElementById("aim-target-1")) document.getElementById("aim-target-1").style.display = 'none';
            let reward = aimHits * getGameReward();
            alert("Time's up! Hits: " + aimHits + " | Earned: " + reward); 
            gainZeke(reward);
        }
    }, 1000);
}

function spawnTarget() {
    let t = document.getElementById("aim-target-1");
    if (!t) return;
    t.style.display = "block"; 
    t.style.left = Math.floor(Math.random() * 260) + "px"; 
    t.style.top = Math.floor(Math.random() * 160) + "px";
}

function handleAimClick(e) {
    if(aimTime <= 0) return;
    if(e.target.classList.contains('aim-target')) {
        aimHits++; 
        if (document.getElementById("aim-score")) document.getElementById("aim-score").innerText = aimHits;
        
        clearInterval(aimMoveTimer);
        spawnTarget();
        aimMoveTimer = setInterval(spawnTarget, 600); 
    } else {
        aimHits = Math.max(0, aimHits - 1);
        if (document.getElementById("aim-score")) document.getElementById("aim-score").innerText = aimHits;
    }
}


/* =========================================
   SECRET DEV PANEL LOGIC
   ========================================= */

function initDevPanel() {
    if (document.getElementById('dev-panel')) return;
    const devPanelHTML = `
    <div id="dev-panel" style="display:none; position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.95); border:2px solid #ff00ff; padding:15px; z-index:9999; border-radius:10px; font-family:monospace; color:#00ffff; box-shadow:0 0 20px #ff00ff; width:260px; text-align:center;">
        <h3 style="margin:0 0 10px 0; border-bottom:1px solid #ff00ff; padding-bottom:5px;">⚡ HACKER MENU ⚡</h3>
        
        <select id="dev-resource" style="width:100%; padding:8px; margin-bottom:10px; background:#111; color:#fff; border:1px solid #ff00ff; cursor:pointer; font-weight:bold;">
            <option value="zekes">Zekes</option>
            <option value="tokens">Rebirth Tokens</option>
            <option value="baseClickGain">Click Power (Base)</option>
            <option value="baseIdleZekes">Auto Power (Base)</option>
        </select>
        
        <input type="number" id="dev-amount" value="1000000" style="width:100%; padding:8px; margin-bottom:10px; background:#111; color:#00ffff; border:1px solid #00ffff; box-sizing:border-box; font-weight:bold;">
        
        <button id="dev-apply-btn" onclick="applyDevCheat()" style="width:100%; padding:10px; margin-bottom:8px; background:#222; color:#00ff00; border:1px solid #00ff00; cursor:pointer; font-weight:bold; transition: background 0.2s;">GRANT RESOURCES</button>
        
        <button onclick="document.getElementById('dev-panel').style.display='none'" style="width:100%; padding:8px; background:#222; color:#ff0000; border:1px solid #ff0000; cursor:pointer; font-weight:bold;">Close Panel</button>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', devPanelHTML);
}

window.applyDevCheat = function() {
    let res = document.getElementById("dev-resource").value;
    let amt = parseFloat(document.getElementById("dev-amount").value) || 0;
    
    if (res === "zekes") zekes += amt;
    if (res === "tokens") rebirthTokens += amt;
    if (res === "baseClickGain") baseClickGain += amt;
    if (res === "baseIdleZekes") baseIdleZekes += amt;
    
    updateAll();
    saveGame();
    
    let btn = document.getElementById('dev-apply-btn');
    if (btn) {
        btn.innerText = "GRANTED!";
        btn.style.background = "#00ff00";
        btn.style.color = "#000";
        setTimeout(() => {
            btn.innerText = "GRANT RESOURCES";
            btn.style.background = "#222";
            btn.style.color = "#00ff00";
        }, 800);
    }
};

let secretKeystrokeBuffer = "";
const targetCode = "super_secret_long_password_12345_i_love_zeke";

document.addEventListener("keydown", (e) => {
    if (e.key && e.key.length === 1) {
        secretKeystrokeBuffer += e.key.toLowerCase();
        
        if (secretKeystrokeBuffer.length > 100) {
            secretKeystrokeBuffer = secretKeystrokeBuffer.substring(secretKeystrokeBuffer.length - 60);
        }
        
        if (secretKeystrokeBuffer.endsWith(targetCode.toLowerCase())) {
            initDevPanel();
            let panel = document.getElementById("dev-panel");
            if (panel) {
                panel.style.display = (panel.style.display === "none" || panel.style.display === "") ? "block" : "none";
            }
            secretKeystrokeBuffer = "";
        }
    }
});

// Boot up game and dev panel safely
window.addEventListener("DOMContentLoaded", () => {
    loadGame();
    initDevPanel();
});
