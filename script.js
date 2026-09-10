let zekes = 0; 
let baseClickGain = 1; 
let baseIdleZekes = 0; 
const costMultiplier = 1.45; // Smoother scaling curve

// Costs (Rebalanced)
let zekeFingerCost = 15; 
let zekeToeCost = 75; 
let zekeFootCost = 300; 
let zekeArmCost = 1200;
let zekeLegCost = 5000;

let zekeShoeCost = 50; 
let zekeGlassesCost = 250;
let zekeBackpackCost = 1500;
let zekeLiverCost = 7500;
let zekeRobotCost = 30000;

let zekePartOneCost = 500000;
let zekePartTwoCost = 1000000;

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

// Rebirth Stats
let rebirthTokens = 0;
let rebirthPowerLevel = 0; 
let rebirthAutoLevel = 0;  
let rbPowerCost = 1;
let rbAutoCost = 2;

// Buff Multipliers from Golden Cookies
let clickBuffMultiplier = 1;
let autoBuffMultiplier = 1;
let clickBuffTimer = 0;
let autoBuffTimer = 0;

// Rebirth Threshold Gate
const REBIRTH_THRESHOLD = 100000;

const image = document.getElementById('zeke'); 

image.addEventListener('click', () => { 
    image.classList.add('click-animation'); 
}); 

image.addEventListener('animationend', () => { 
    image.classList.remove('click-animation'); 
}); 

// Auto generate loop
setInterval(() => {
    let multiplier = Math.max(1, rebirthAutoLevel * 2);
    let totalIdle = baseIdleZekes * multiplier * autoBuffMultiplier;
    if (totalIdle > 0) {
        zekes += totalIdle;
        updateAll();
    }
}, 1000);

// Buff countdown loop
setInterval(() => {
    if (clickBuffTimer > 0) {
        clickBuffTimer--;
        if (clickBuffTimer === 0) clickBuffMultiplier = 1;
    }
    if (autoBuffTimer > 0) {
        autoBuffTimer--;
        if (autoBuffTimer === 0) autoBuffMultiplier = 1;
    }
    updateBuffDisplay();
}, 1000);

// Golden Cookie Spawner (every 25 to 50 seconds)
function scheduleGoldenCookie() {
    let randomTime = Math.random() * 25000 + 25000;
    setTimeout(() => {
        spawnGoldenCookie();
        scheduleGoldenCookie();
    }, randomTime);
}
scheduleGoldenCookie();

function spawnGoldenCookie() {
    image.style.boxShadow = "0 0 50px #ffff00";
    image.style.border = "4px solid #ffff00";
    
    let clickHandler = () => {
        triggerGoldenCookieEffect();
        image.removeEventListener('click', clickHandler);
        resetImageStyle();
    };
    image.addEventListener('click', clickHandler);

    setTimeout(() => {
        image.removeEventListener('click', clickHandler);
        resetImageStyle();
    }, 7000);
}

function resetImageStyle() {
    if (!zekePartOne || !zekePartTwo) {
        image.style.boxShadow = "0 0 30px rgba(255,0,127,0.4)";
        image.style.border = "none";
    }
}

function triggerGoldenCookieEffect() {
    let effectType = Math.random() < 0.5 ? 'click' : 'auto';
    if (effectType === 'click') {
        clickBuffMultiplier = 100;
        clickBuffTimer = 10;
    } else {
        autoBuffMultiplier = 1000;
        autoBuffTimer = 20;
    }
    updateAll();
}

function updateBuffDisplay() {
    let text = "";
    if (clickBuffTimer > 0) text += `⚡ 100x Click Power (${clickBuffTimer}s) `;
    if (autoBuffTimer > 0) text += `🚀 1000x Auto Power (${autoBuffTimer}s)`;
    let buffElement = document.getElementById('active-buffs');
    if (buffElement) buffElement.innerText = text;
}

// Auto save loop
setInterval(() => {
    saveGame();
}, 10000);

function buyUpgrade(upgradeName) { 
    switch(upgradeName) { 
        case 'zekeFinger': 
            if (zekes >= zekeFingerCost) { 
                zekes -= zekeFingerCost; 
                baseClickGain += 1; 
                zekeFingerCount++; 
                zekeFingerCost = Math.floor(zekeFingerCost * costMultiplier); 
            } 
            break; 
        case 'zekeToe': 
            if (zekes >= zekeToeCost) { 
                zekes -= zekeToeCost; 
                baseClickGain += 3; 
                zekeToeCount++; 
                zekeToeCost = Math.floor(zekeToeCost * costMultiplier); 
            } 
            break; 
        case 'zekeFoot': 
            if (zekes >= zekeFootCost) { 
                zekes -= zekeFootCost; 
                baseClickGain += 10; 
                zekeFootCount++; 
                zekeFootCost = Math.floor(zekeFootCost * costMultiplier); 
            } 
            break; 
        case 'zekeArm': 
            if (zekes >= zekeArmCost) { 
                zekes -= zekeArmCost; 
                baseClickGain += 30; 
                zekeArmCount++; 
                zekeArmCost = Math.floor(zekeArmCost * costMultiplier); 
            } 
            break; 
        case 'zekeLeg': 
            if (zekes >= zekeLegCost) { 
                zekes -= zekeLegCost; 
                baseClickGain += 100; 
                zekeLegCount++; 
                zekeLegCost = Math.floor(zekeLegCost * costMultiplier); 
            } 
            break; 
        case 'zekeShoe': 
            if (zekes >= zekeShoeCost) { 
                zekes -= zekeShoeCost; 
                baseIdleZekes += 1;
                zekeShoeCount++; 
                zekeShoeCost = Math.floor(zekeShoeCost * costMultiplier); 
            } 
            break; 
        case 'zekeGlasses': 
            if (zekes >= zekeGlassesCost) { 
                zekes -= zekeGlassesCost; 
                baseIdleZekes += 5;
                zekeGlassesCount++; 
                zekeGlassesCost = Math.floor(zekeGlassesCost * costMultiplier); 
            } 
            break; 
        case 'zekeBackpack': 
            if (zekes >= zekeBackpackCost) { 
                zekes -= zekeBackpackCost; 
                baseIdleZekes += 25;
                zekeBackpackCount++; 
                zekeBackpackCost = Math.floor(zekeBackpackCost * costMultiplier); 
            } 
            break; 
        case 'zekeLiver': 
            if (zekes >= zekeLiverCost) { 
                zekes -= zekeLiverCost; 
                baseIdleZekes += 100;
                zekeLiverCount++; 
                zekeLiverCost = Math.floor(zekeLiverCost * costMultiplier); 
            } 
            break; 
        case 'zekeRobot': 
            if (zekes >= zekeRobotCost) { 
                zekes -= zekeRobotCost; 
                baseIdleZekes += 500;
                zekeRobotCount++; 
                zekeRobotCost = Math.floor(zekeRobotCost * costMultiplier); 
            } 
            break; 
        case 'zekePartOne': 
            if (zekes >= zekePartOneCost) { 
                zekes -= zekePartOneCost; 
                zekePartOne = true;
                let p1Box = document.getElementById('partOneBox');
                if (p1Box) p1Box.style.display = 'none';
            } 
            break; 
        case 'zekePartTwo': 
            if (zekes >= zekePartTwoCost) { 
                zekes -= zekePartTwoCost; 
                zekePartTwo = true;
                let p2Box = document.getElementById('partTwoBox');
                if (p2Box) p2Box.style.display = 'none';
            } 
            break; 
    } 

    if (zekePartOne && zekePartTwo) {
        triggerWinState();
    }

    updateAll(); 
    saveGame();
} 

function calculatePendingTokens() {
    if (zekes < REBIRTH_THRESHOLD) return 0;
    return Math.floor(Math.log10(zekes / REBIRTH_THRESHOLD) * 10) + 1;
}

function triggerWinState() {
    image.classList.add('win-image');
    let winScreen = document.getElementById('win-screen');
    if (winScreen) winScreen.style.display = 'flex';
    let winTitle = document.getElementById('win-title');
    if (winTitle) winTitle.innerText = "FULL ASCENSION!";
    let earnedTokens = calculatePendingTokens();
    let pendingTokensEl = document.getElementById('pendingTokens');
    if (pendingTokensEl) pendingTokensEl.innerText = earnedTokens;
}

function triggerRebirth() {
    let earnedTokens = calculatePendingTokens();
    if (earnedTokens <= 0 && !(zekePartOne && zekePartTwo)) return;
    
    rebirthTokens += earnedTokens;

    zekes = 0;
    baseClickGain = 1;
    baseIdleZekes = 0;
    
    zekeFingerCost = 15; zekeFingerCount = 0;
    zekeToeCost = 75; zekeToeCount = 0;
    zekeFootCost = 300; zekeFootCount = 0;
    zekeArmCost = 1200; zekeArmCount = 0;
    zekeLegCost = 5000; zekeLegCount = 0;

    zekeShoeCost = 50; zekeShoeCount = 0;
    zekeGlassesCost = 250; zekeGlassesCount = 0;
    zekeBackpackCost = 1500; zekeBackpackCount = 0;
    zekeLiverCost = 7500; zekeLiverCount = 0;
    zekeRobotCost = 30000; zekeRobotCount = 0;

    zekePartOne = false;
    zekePartTwo = false;

    image.classList.remove('win-image');
    let winScreen = document.getElementById('win-screen');
    if (winScreen) winScreen.style.display = 'none';
    let p1Box = document.getElementById('partOneBox');
    if (p1Box) p1Box.style.display = 'block';
    let p2Box = document.getElementById('partTwoBox');
    if (p2Box) p2Box.style.display = 'block';
    
    let rebirthSidebar = document.getElementById('rebirth-sidebar');
    if (rebirthSidebar) rebirthSidebar.style.display = 'block';

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
    let powerMult = Math.max(1, rebirthPowerLevel * 2);
    let autoMult = Math.max(1, rebirthAutoLevel * 2);

    let currentClickGain = (baseClickGain * powerMult) * clickBuffMultiplier;
    let currentIdleZekes = (baseIdleZekes * autoMult) * autoBuffMultiplier;

    document.getElementById("zekeCount").innerHTML = Math.floor(zekes); 
    document.getElementById("zekeIdleCount").innerHTML = Math.floor(currentIdleZekes); 
    document.getElementById("zekeClickGain").innerHTML = Math.floor(currentClickGain); 
    
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
    
    let pending = calculatePendingTokens();
    let pendingTokensEl = document.getElementById('pendingTokens');
    if (pendingTokensEl) pendingTokensEl.innerText = pending;
    
    // Manage Rebirth button state
    let rebirthBtn = document.getElementById('rebirth-trigger-btn');
    if (rebirthBtn) {
        if (zekes >= REBIRTH_THRESHOLD || (zekePartOne && zekePartTwo)) {
            rebirthBtn.disabled = false;
            rebirthBtn.style.background = "#ff007f";
            rebirthBtn.style.color = "#fff";
            rebirthBtn.style.borderColor = "#ff007f";
            rebirthBtn.style.cursor = "pointer";
            rebirthBtn.innerText = `Rebirth (+${pending} Tokens)`;
        } else {
            rebirthBtn.disabled = true;
            rebirthBtn.style.background = "#333";
            rebirthBtn.style.color = "#888";
            rebirthBtn.style.borderColor = "#555";
            rebirthBtn.style.cursor = "not-allowed";
            let remaining = Math.max(0, REBIRTH_THRESHOLD - Math.floor(zekes));
            rebirthBtn.innerText = `Rebirth Locked (${remaining.toLocaleString()} more needed)`;
        }
    }

    if (zekePartOne) {
        let p1Box = document.getElementById('partOneBox');
        if (p1Box) p1Box.style.display = 'none';
    }
    if (zekePartTwo) {
        let p2Box = document.getElementById('partTwoBox');
        if (p2Box) p2Box.style.display = 'none';
    }
    if (rebirthTokens > 0 || rebirthPowerLevel > 0 || rebirthAutoLevel > 0) {
        let rebirthSidebar = document.getElementById('rebirth-sidebar');
        if (rebirthSidebar) rebirthSidebar.style.display = 'block';
    }
} 

function gainZeke(amount) { 
    zekes += amount; 
    zekeBeep(); 
    updateAll(); 
} 

function gainZekesAutoCount() { 
    let powerMult = Math.max(1, rebirthPowerLevel * 2);
    gainZeke((baseClickGain * powerMult) * clickBuffMultiplier); 
} 

function zekeBeep() { 
    const audio = new Audio('zekeBeep.mp3'); 
    audio.play().catch(e => {}); 
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
        } catch (e) {}
    }
    updateAll();
}

window.onload = function() {
    loadGame();
};
