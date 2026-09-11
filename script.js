// Layer 0: Normal Gameplay
let zekes = 0; 
let baseClickGain = 1; 
let baseIdleZekes = 0; 
const costMultiplier = 1.15; 

let zekeFingerCost = 15, zekeFingerCount = 0;
let zekeToeCost = 120, zekeToeCount = 0;
let zekeFootCost = 900, zekeFootCount = 0;
let zekeArmCost = 7500, zekeArmCount = 0;
let zekeLegCost = 50000, zekeLegCount = 0;

let zekeShoeCost = 50, zekeShoeCount = 0;
let zekeGlassesCost = 400, zekeGlassesCount = 0;
let zekeBackpackCost = 3500, zekeBackpackCount = 0;
let zekeLiverCost = 25000, zekeLiverCount = 0;
let zekeRobotCost = 150000, zekeRobotCount = 0;

// Layer 1: Rebirth (Soft Reset)
const REBIRTH_THRESHOLD = 100000;
let rebirthTokens = 0;
let totalRebirths = 0;
let rebirthPowerLevel = 0, rbPowerCost = 1; 
let rebirthAutoLevel = 0, rbAutoCost = 2;  

// Layer 2: Ascension (Medium Reset)
const ASCENSION_THRESHOLD = 100;
let ascensionPoints = 0;
let totalAscensions = 0;
let ascensionAutoRebirth = false; 
let ascensionPowerLevel = 0, ascPowerCost = 1;
let ascensionAutoLevel = 0, ascAutoCost = 1;

// Layer 3: Transcension (Hard Reset/Win)
let transcensionPartOne = false;
let transcensionPartTwo = false;
const transPartOneCost = 50;  
const transPartTwoCost = 150; 

// Buffs
let clickBuffMultiplier = 1, clickBuffTimer = 0;
let autoBuffMultiplier = 1, autoBuffTimer = 0;

const image = document.getElementById('zeke'); 

// Click Event
if (image) {
    image.addEventListener('mousedown', (e) => { 
        image.classList.remove('click-animation'); 
        void image.offsetWidth; 
        image.classList.add('click-animation'); 
        
        gainZekesAutoCount();
        createFloatingText(e);
    }); 
}

function createFloatingText(e) {
    let rpMult = Math.max(1, rebirthPowerLevel * 2);
    let apMult = Math.pow(5, ascensionPowerLevel); 
    let amount = (baseClickGain * rpMult * apMult) * clickBuffMultiplier;
    
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    floatEl.innerText = '+' + formatNumber(amount);
    
    const randomOffsetX = (Math.random() - 0.5) * 30;
    const randomOffsetY = (Math.random() - 0.5) * 30;
    
    floatEl.style.left = (e.clientX + randomOffsetX) + 'px';
    floatEl.style.top = (e.clientY - 20 + randomOffsetY) + 'px';
    
    document.body.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 1000);
}

// Dev Panel Logic
let typedBuffer = "";
const targetPassword = "zeke"; 

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.length === 1) {
        typedBuffer += e.key.toLowerCase();
        if (typedBuffer.length > targetPassword.length) {
            typedBuffer = typedBuffer.slice(-targetPassword.length);
        }
        if (typedBuffer === targetPassword) {
            let panel = document.getElementById('dev-panel');
            if (panel) { panel.style.display = 'block'; panel.style.zIndex = '99999'; }
            typedBuffer = "";
        }
    }
});

// Draggable Dev Panel Logic
window.addEventListener('DOMContentLoaded', () => {
    let panel = document.getElementById('dev-panel');
    if (!panel) return;
    let isDragging = false;
    let startX = 0, startY = 0;

    panel.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX - panel.offsetLeft;
        startY = e.clientY - panel.offsetTop;
        panel.style.transform = "none"; 
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = (e.clientX - startX) + 'px';
        panel.style.top = (e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
});

function devAddZekes() { zekes += 10000000000; updateAll(); }
function devAddTokens() { rebirthTokens += 1000; updateAll(); }
function devAddAP() { ascensionPoints += 100; updateAll(); }

// Passive Income & Auto Rebirth Loop
setInterval(() => {
    let raMult = Math.max(1, rebirthAutoLevel * 2);
    let aaMult = Math.pow(5, ascensionAutoLevel);
    let totalIdle = baseIdleZekes * raMult * aaMult * autoBuffMultiplier;
    
    if (totalIdle > 0) {
        zekes += totalIdle;
    }

    // Auto-Rebirth Logic
    if (ascensionAutoRebirth) {
        let toggle = document.getElementById('autoRebirthToggle');
        let targetEl = document.getElementById('autoRebirthTarget');
        let target = targetEl ? (parseInt(targetEl.value) || 1) : 1;
        
        if (toggle && toggle.checked) {
            if (calculatePendingTokens() >= target) {
                triggerRebirth();
            }
        }
    }

    updateAll();
}, 1000);

// Buff Timers Loop
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

// Golden Zeke Loop
function scheduleGoldenZeke() {
    let randomTime = Math.random() * 40000 + 30000; 
    setTimeout(() => {
        spawnGoldenZeke();
        scheduleGoldenZeke();
    }, randomTime);
}
scheduleGoldenZeke();

function spawnGoldenZeke() {
    let goldenEl = document.createElement('div');
    goldenEl.className = 'falling-golden-zeke';
    let randomX = Math.random() * (window.innerWidth - 100) + 50;
    goldenEl.style.left = randomX + 'px';
    
    let isClicked = false;
    goldenEl.addEventListener('mousedown', () => {
        if(isClicked) return;
        isClicked = true;
        triggerGoldenZekeEffect();
        goldenEl.style.display = 'none';
        goldenEl.remove();
    });

    document.body.appendChild(goldenEl);
    setTimeout(() => { if (goldenEl.parentNode) goldenEl.remove(); }, 6000); 
}

function triggerGoldenZekeEffect() {
    let effectType = Math.random() < 0.5 ? 'click' : 'auto';
    if (effectType === 'click') {
        clickBuffMultiplier = 3;
        clickBuffTimer = 15;
    } else {
        autoBuffMultiplier = 5;
        autoBuffTimer = 20;
    }
    updateAll();
}

// Safe HTML Updater Helper to prevent "Cannot set property of null" errors
function setHTML(id, value) {
    let el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

function setDisplay(id, value) {
    let el = document.getElementById(id);
    if (el) el.style.display = value;
}

function updateBuffDisplay() {
    let text = "";
    if (clickBuffTimer > 0) text += `⚡ 3x Click Power (${clickBuffTimer}s)  `;
    if (autoBuffTimer > 0) text += `🚀 5x Auto Power (${autoBuffTimer}s)`;
    setHTML('active-buffs', text);
}

// Auto Save
setInterval(() => { saveGame(); }, 10000);

function buyUpgrade(upgradeName) { 
    switch(upgradeName) { 
        case 'zekeFinger': 
            if (zekes >= zekeFingerCost) { zekes -= zekeFingerCost; baseClickGain += 1; zekeFingerCount++; zekeFingerCost = Math.floor(zekeFingerCost * costMultiplier); } 
            break; 
        case 'zekeToe': 
            if (zekes >= zekeToeCost) { zekes -= zekeToeCost; baseClickGain += 4; zekeToeCount++; zekeToeCost = Math.floor(zekeToeCost * costMultiplier); } 
            break; 
        case 'zekeFoot': 
            if (zekes >= zekeFootCost) { zekes -= zekeFootCost; baseClickGain += 15; zekeFootCount++; zekeFootCost = Math.floor(zekeFootCost * costMultiplier); } 
            break; 
        case 'zekeArm': 
            if (zekes >= zekeArmCost) { zekes -= zekeArmCost; baseClickGain += 60; zekeArmCount++; zekeArmCost = Math.floor(zekeArmCost * costMultiplier); } 
            break; 
        case 'zekeLeg': 
            if (zekes >= zekeLegCost) { zekes -= zekeLegCost; baseClickGain += 250; zekeLegCount++; zekeLegCost = Math.floor(zekeLegCost * costMultiplier); } 
            break; 
        case 'zekeShoe': 
            if (zekes >= zekeShoeCost) { zekes -= zekeShoeCost; baseIdleZekes += 1; zekeShoeCount++; zekeShoeCost = Math.floor(zekeShoeCost * costMultiplier); } 
            break; 
        case 'zekeGlasses': 
            if (zekes >= zekeGlassesCost) { zekes -= zekeGlassesCost; baseIdleZekes += 6; zekeGlassesCount++; zekeGlassesCost = Math.floor(zekeGlassesCost * costMultiplier); } 
            break; 
        case 'zekeBackpack': 
            if (zekes >= zekeBackpackCost) { zekes -= zekeBackpackCost; baseIdleZekes += 35; zekeBackpackCount++; zekeBackpackCost = Math.floor(zekeBackpackCost * costMultiplier); } 
            break; 
        case 'zekeLiver': 
            if (zekes >= zekeLiverCost) { zekes -= zekeLiverCost; baseIdleZekes += 150; zekeLiverCount++; zekeLiverCost = Math.floor(zekeLiverCost * costMultiplier); } 
            break; 
        case 'zekeRobot': 
            if (zekes >= zekeRobotCost) { zekes -= zekeRobotCost; baseIdleZekes += 800; zekeRobotCount++; zekeRobotCost = Math.floor(zekeRobotCost * costMultiplier); } 
            break; 
        case 'transcensionPartOne': 
            if (ascensionPoints >= transPartOneCost) { 
                ascensionPoints -= transPartOneCost; transcensionPartOne = true;
                setDisplay('partOneBox', 'none');
            } 
            break; 
        case 'transcensionPartTwo': 
            if (ascensionPoints >= transPartTwoCost) { 
                ascensionPoints -= transPartTwoCost; transcensionPartTwo = true;
                setDisplay('partTwoBox', 'none');
            } 
            break; 
    } 

    if (transcensionPartOne && transcensionPartTwo) {
        setDisplay('win-screen', 'flex');
    }

    updateAll(); 
    saveGame();
} 

// -- Prestige Math --
function calculatePendingTokens() {
    if (zekes < REBIRTH_THRESHOLD) return 0;
    return Math.floor(Math.pow(zekes / REBIRTH_THRESHOLD, 0.5));
}
function calculatePendingAP() {
    if (rebirthTokens < ASCENSION_THRESHOLD) return 0;
    return Math.floor(Math.pow(rebirthTokens / ASCENSION_THRESHOLD, 0.5));
}

// -- Rebirth (Soft Reset) --
function triggerRebirth() {
    let earnedTokens = calculatePendingTokens();
    if (earnedTokens <= 0) return;
    
    rebirthTokens += earnedTokens;
    totalRebirths++;

    zekes = 0;
    baseClickGain = 1;
    baseIdleZekes = 0;
    
    zekeFingerCost = 15; zekeFingerCount = 0;
    zekeToeCost = 120; zekeToeCount = 0;
    zekeFootCost = 900; zekeFootCount = 0;
    zekeArmCost = 7500; zekeArmCount = 0;
    zekeLegCost = 50000; zekeLegCount = 0;

    zekeShoeCost = 50; zekeShoeCount = 0;
    zekeGlassesCost = 400; zekeGlassesCount = 0;
    zekeBackpackCost = 3500; zekeBackpackCount = 0;
    zekeLiverCost = 25000; zekeLiverCount = 0;
    zekeRobotCost = 150000; zekeRobotCount = 0;

    updateAll();
    saveGame();
}

// -- Ascension (Medium Reset) --
function triggerAscension() {
    let earnedAP = calculatePendingAP();
    if (earnedAP <= 0) return;

    ascensionPoints += earnedAP;
    totalAscensions++;

    // Reset Normal
    zekes = 0;
    baseClickGain = 1;
    baseIdleZekes = 0;
    
    zekeFingerCost = 15; zekeFingerCount = 0;
    zekeToeCost = 120; zekeToeCount = 0;
    zekeFootCost = 900; zekeFootCount = 0;
    zekeArmCost = 7500; zekeArmCount = 0;
    zekeLegCost = 50000; zekeLegCount = 0;

    zekeShoeCost = 50; zekeShoeCount = 0;
    zekeGlassesCost = 400; zekeGlassesCount = 0;
    zekeBackpackCost = 3500; zekeBackpackCount = 0;
    zekeLiverCost = 25000; zekeLiverCount = 0;
    zekeRobotCost = 150000; zekeRobotCount = 0;

    // Reset Rebirth
    rebirthTokens = 0;
    rebirthPowerLevel = 0; rbPowerCost = 1;
    rebirthAutoLevel = 0; rbAutoCost = 2;

    // UI Resets
    let autoToggle = document.getElementById('autoRebirthToggle');
    if(autoToggle) autoToggle.checked = false; 

    updateAll();
    saveGame();
}

function buyRebirthUpgrade(type) {
    if (type === 'power' && rebirthTokens >= rbPowerCost) {
        rebirthTokens -= rbPowerCost;
        rebirthPowerLevel++;
        rbPowerCost += 2;
    } else if (type === 'auto' && rebirthTokens >= rbAutoCost) {
        rebirthTokens -= rbAutoCost;
        rebirthAutoLevel++;
        rbAutoCost += 3;
    }
    updateAll(); saveGame();
}

function buyAscensionUpgrade(type) {
    if (type === 'autoRebirth' && !ascensionAutoRebirth && ascensionPoints >= 3) {
        ascensionPoints -= 3;
        ascensionAutoRebirth = true;
    } else if (type === 'power' && ascensionPoints >= ascPowerCost) {
        ascensionPoints -= ascPowerCost;
        ascensionPowerLevel++;
        ascPowerCost = Math.floor(ascPowerCost * 2);
    } else if (type === 'auto' && ascensionPoints >= ascAutoCost) {
        ascensionPoints -= ascAutoCost;
        ascensionAutoLevel++;
        ascAutoCost = Math.floor(ascAutoCost * 2);
    }
    updateAll(); saveGame();
}

function formatNumber(num) {
    if (num < 1000000) return Math.floor(num).toLocaleString();
    if (num < 1000000000) return (num / 1000000).toFixed(2) + "M";
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + "B";
    return (num / 1000000000000).toFixed(2) + "T";
}

function updateAll() { 
    let rpMult = Math.max(1, rebirthPowerLevel * 2);
    let raMult = Math.max(1, rebirthAutoLevel * 2);
    let apMult = Math.pow(5, ascensionPowerLevel);
    let aaMult = Math.pow(5, ascensionAutoLevel);

    let currentClickGain = (baseClickGain * rpMult * apMult) * clickBuffMultiplier;
    let currentIdleZekes = (baseIdleZekes * raMult * aaMult) * autoBuffMultiplier;

    // Core Stats
    setHTML("zekeCount", formatNumber(zekes));
    setHTML("zekeIdleCount", formatNumber(currentIdleZekes));
    setHTML("zekeClickGain", formatNumber(currentClickGain));
    
    // Normal Upgrades Display
    setHTML("fingerCount", zekeFingerCount);
    setHTML("fingerCost", formatNumber(zekeFingerCost));
    setHTML("toeCount", zekeToeCount);
    setHTML("toeCost", formatNumber(zekeToeCost));
    setHTML("footCount", zekeFootCount);
    setHTML("footCost", formatNumber(zekeFootCost));
    setHTML("armCount", zekeArmCount);
    setHTML("armCost", formatNumber(zekeArmCost));
    setHTML("legCount", zekeLegCount);
    setHTML("legCost", formatNumber(zekeLegCost));
    
    setHTML("shoeCount", zekeShoeCount);
    setHTML("shoeCost", formatNumber(zekeShoeCost));
    setHTML("glassesCount", zekeGlassesCount);
    setHTML("glassesCost", formatNumber(zekeGlassesCost));
    setHTML("backpackCount", zekeBackpackCount);
    setHTML("backpackCost", formatNumber(zekeBackpackCost));
    setHTML("liverCount", zekeLiverCount);
    setHTML("liverCost", formatNumber(zekeLiverCost));
    setHTML("robotCount", zekeRobotCount);
    setHTML("robotCost", formatNumber(zekeRobotCost));

    // Prestige Currencies
    setHTML("tokenCount", formatNumber(rebirthTokens));
    setHTML("apCount", formatNumber(ascensionPoints));
    
    if(rebirthTokens > 0 || totalRebirths > 0 || totalAscensions > 0) {
        setDisplay("token-display", "block");
        setDisplay("rebirth-shop-container", "block");
    }
    if(ascensionPoints > 0 || totalAscensions > 0) {
        setDisplay("ap-display", "block");
        setDisplay("ascension-shop-container", "block");
        setDisplay("transcension-shop-container", "block");
    }

    // Rebirth Shop Values
    setHTML("rbPowerCount", rebirthPowerLevel);
    setHTML("rbPowerCost", rbPowerCost);
    setHTML("rbAutoCount", rebirthAutoLevel);
    setHTML("rbAutoCost", rbAutoCost);

    // Ascension Shop Values
    setHTML("ascPowerCount", ascensionPowerLevel);
    setHTML("ascPowerCost", ascPowerCost);
    setHTML("ascAutoCount", ascensionAutoLevel);
    setHTML("ascAutoCost", ascAutoCost);

    if (ascensionAutoRebirth) {
        setDisplay('autoRebirthBuyBox', 'none');
        setDisplay('auto-rebirth-container', 'block');
    }

    // Transcension Shop Values
    if (transcensionPartOne) setDisplay('partOneBox', 'none');
    if (transcensionPartTwo) setDisplay('partTwoBox', 'none');

    // Prestige Buttons Logic
    let pendingTokens = calculatePendingTokens();
    let rebirthBtn = document.getElementById('rebirth-trigger-btn');
    if (rebirthBtn) {
        if (zekes >= REBIRTH_THRESHOLD || totalRebirths > 0 || totalAscensions > 0) {
            rebirthBtn.style.display = "inline-block";
            if (pendingTokens > 0) {
                rebirthBtn.disabled = false;
                rebirthBtn.classList.remove("btn-disabled");
                setHTML('pendingTokensBtn', formatNumber(pendingTokens));
                rebirthBtn.innerText = `Rebirth (+${formatNumber(pendingTokens)} Tokens)`;
            } else {
                rebirthBtn.disabled = true;
                rebirthBtn.classList.add("btn-disabled");
                rebirthBtn.innerText = `Rebirth (Need ${formatNumber(REBIRTH_THRESHOLD)} Zekes)`;
            }
        }
    }

    let pendingAP = calculatePendingAP();
    let ascendBtn = document.getElementById('ascend-trigger-btn');
    if (ascendBtn) {
        if (rebirthTokens >= ASCENSION_THRESHOLD || totalAscensions > 0) {
            ascendBtn.style.display = "inline-block";
            if (pendingAP > 0) {
                ascendBtn.disabled = false;
                ascendBtn.classList.remove("btn-disabled");
                setHTML('pendingAPBtn', formatNumber(pendingAP));
                ascendBtn.innerText = `ASCEND (+${formatNumber(pendingAP)} AP)`;
            } else {
                ascendBtn.disabled = true;
                ascendBtn.classList.add("btn-disabled");
                ascendBtn.innerText = `ASCEND (Need ${ASCENSION_THRESHOLD} Tokens)`;
            }
        }
    }
}

function gainZeke(amount) { zekes += amount; updateAll(); } 
function gainZekesAutoCount() { 
    let rpMult = Math.max(1, rebirthPowerLevel * 2);
    let apMult = Math.pow(5, ascensionPowerLevel);
    gainZeke((baseClickGain * rpMult * apMult) * clickBuffMultiplier); 
} 

// Save/Load
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
        rebirthTokens, totalRebirths, rebirthPowerLevel, rebirthAutoLevel, rbPowerCost, rbAutoCost,
        ascensionPoints, totalAscensions, ascensionAutoRebirth, ascensionPowerLevel, ascensionAutoLevel, ascPowerCost, ascAutoCost,
        transcensionPartOne, transcensionPartTwo
    };
    setCookie("zekeClickerSave_v4", JSON.stringify(gameState), 365);
}

function loadGame() {
    let savedData = getCookie("zekeClickerSave_v4");
    if (savedData) {
        try {
            let data = JSON.parse(savedData);
            zekes = data.zekes ?? zekes;
            baseClickGain = data.baseClickGain ?? baseClickGain;
            baseIdleZekes = data.baseIdleZekes ?? baseIdleZekes;
            
            zekeFingerCost = data.zekeFingerCost ?? zekeFingerCost; zekeFingerCount = data.zekeFingerCount ?? zekeFingerCount;
            zekeToeCost = data.zekeToeCost ?? zekeToeCost; zekeToeCount = data.zekeToeCount ?? zekeToeCount;
            zekeFootCost = data.zekeFootCost ?? zekeFootCost; zekeFootCount = data.zekeFootCount ?? zekeFootCount;
            zekeArmCost = data.zekeArmCost ?? zekeArmCost; zekeArmCount = data.zekeArmCount ?? zekeArmCount;
            zekeLegCost = data.zekeLegCost ?? zekeLegCost; zekeLegCount = data.zekeLegCount ?? zekeLegCount;
            
            zekeShoeCost = data.zekeShoeCost ?? zekeShoeCost; zekeShoeCount = data.zekeShoeCount ?? zekeShoeCount;
            zekeGlassesCost = data.zekeGlassesCost ?? zekeGlassesCost; zekeGlassesCount = data.zekeGlassesCount ?? zekeGlassesCount;
            zekeBackpackCost = data.zekeBackpackCost ?? zekeBackpackCost; zekeBackpackCount = data.zekeBackpackCount ?? zekeBackpackCount;
            zekeLiverCost = data.zekeLiverCost ?? zekeLiverCost; zekeLiverCount = data.zekeLiverCount ?? zekeLiverCount;
            zekeRobotCost = data.zekeRobotCost ?? zekeRobotCost; zekeRobotCount = data.zekeRobotCount ?? zekeRobotCount;
            
            rebirthTokens = data.rebirthTokens ?? rebirthTokens;
            totalRebirths = data.totalRebirths ?? totalRebirths;
            rebirthPowerLevel = data.rebirthPowerLevel ?? rebirthPowerLevel;
            rebirthAutoLevel = data.rebirthAutoLevel ?? rebirthAutoLevel;
            rbPowerCost = data.rbPowerCost ?? rbPowerCost;
            rbAutoCost = data.rbAutoCost ?? rbAutoCost;
            
            ascensionPoints = data.ascensionPoints ?? ascensionPoints;
            totalAscensions = data.totalAscensions ?? totalAscensions;
            ascensionAutoRebirth = data.ascensionAutoRebirth ?? ascensionAutoRebirth;
            ascensionPowerLevel = data.ascensionPowerLevel ?? ascensionPowerLevel;
            ascensionAutoLevel = data.ascensionAutoLevel ?? ascensionAutoLevel;
            ascPowerCost = data.ascPowerCost ?? ascPowerCost;
            ascAutoCost = data.ascAutoCost ?? ascAutoCost;
            
            transcensionPartOne = data.transcensionPartOne ?? transcensionPartOne;
            transcensionPartTwo = data.transcensionPartTwo ?? transcensionPartTwo;
        } catch (e) {}
    }
    updateAll();
}

function restartGame() {
    if (confirm("Are you sure you want to HARD RESET? All progress, rebirths, and ascensions will be permanently lost!")) {
        document.cookie = "zekeClickerSave_v4=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        location.reload();
    }
}

window.onload = function() { loadGame(); };
