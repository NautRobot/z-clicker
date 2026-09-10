let zekes = 0; 
let baseClickGain = 1; 
let baseIdleZekes = 0; 
const costMultiplier = 1.5;

let zekeFingerCost = 15; 
let zekeToeCost = 120; 
let zekeFootCost = 900; 
let zekeArmCost = 7500;
let zekeLegCost = 50000;

let zekeShoeCost = 50; 
let zekeGlassesCost = 400;
let zekeBackpackCost = 3500;
let zekeLiverCost = 25000;
let zekeRobotCost = 150000;

let zekePartOneCost = 10000000;
let zekePartTwoCost = 50000000;

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

let rebirthTokens = 0;
let rebirthPowerLevel = 0; 
let rebirthAutoLevel = 0;  
let rbPowerCost = 1;
let rbAutoCost = 2;

let clickBuffMultiplier = 1;
let autoBuffMultiplier = 1;
let clickBuffTimer = 0;
let autoBuffTimer = 0;

const REBIRTH_THRESHOLD = 500000;

const image = document.getElementById('zeke'); 

image.addEventListener('click', () => { 
    image.classList.add('click-animation'); 
}); 

image.addEventListener('animationend', () => { 
    image.classList.remove('click-animation'); 
}); 

// Silent Password Buffer Logic (Type "superpassword" anywhere on the page)
let typedBuffer = "";
const targetPassword = "superpassword"; // Change this to your desired super long password

document.addEventListener('keydown', (e) => {
    // Ignore keypresses if typing inside an actual input field/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key.length === 1) {
        typedBuffer += e.key.toLowerCase();
        if (typedBuffer.length > targetPassword.length) {
            typedBuffer = typedBuffer.slice(-targetPassword.length);
        }
        if (typedBuffer === targetPassword) {
            let panel = document.getElementById('dev-panel');
            if (panel) {
                panel.style.display = 'block';
                panel.style.zIndex = '99999';
            }
            typedBuffer = ""; // Reset buffer
        }
    }
});

// Fully Fixed Draggable Dev Panel Logic
window.addEventListener('DOMContentLoaded', () => {
    let panel = document.getElementById('dev-panel');
    if (!panel) return;

    let isDragging = false;
    let startX = 0, startY = 0;

    panel.addEventListener('mousedown', (e) => {
        // Prevent dragging if clicking buttons inside the panel
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        startX = e.clientX - panel.offsetLeft;
        startY = e.clientY - panel.offsetTop;
        panel.style.transform = "none"; // Remove centering transform when grabbed
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panel.style.left = (e.clientX - startX) + 'px';
        panel.style.top = (e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

function devAddZekes() {
    zekes += 1000000;
    updateAll();
}

function devAddTokens() {
    rebirthTokens += 10;
    updateAll();
}

setInterval(() => {
    let multiplier = Math.max(1, rebirthAutoLevel * 2);
    let totalIdle = baseIdleZekes * multiplier * autoBuffMultiplier;
    if (totalIdle > 0) {
        zekes += totalIdle;
        updateAll();
    }
}, 1000);

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

function scheduleGoldenZeke() {
    let randomTime = Math.random() * 30000 + 20000;
    setTimeout(() => {
        spawnGoldenZeke();
        scheduleGoldenZeke();
    }, randomTime);
}
scheduleGoldenZeke();

function spawnGoldenZeke() {
    let goldenEl = document.createElement('div');
    goldenEl.className = 'falling-golden-zeke';
    let randomX = Math.random() * (window.innerWidth - 80);
    goldenEl.style.left = randomX + 'px';

    goldenEl.addEventListener('click', () => {
        triggerGoldenZekeEffect();
        goldenEl.remove();
    });

    document.body.appendChild(goldenEl);

    setTimeout(() => {
        if (goldenEl.parentNode) {
            goldenEl.remove();
        }
    }, 7000);
}

function triggerGoldenZekeEffect() {
    let effectType = Math.random() < 0.5 ? 'click' : 'auto';
    if (effectType === 'click') {
        clickBuffMultiplier = 2;
        clickBuffTimer = 10;
    } else {
        autoBuffMultiplier = 10;
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
                baseClickGain += 4; 
                zekeToeCount++; 
                zekeToeCost = Math.floor(zekeToeCost * costMultiplier); 
            } 
            break; 
        case 'zekeFoot': 
            if (zekes >= zekeFootCost) { 
                zekes -= zekeFootCost; 
                baseClickGain += 15; 
                zekeFootCount++; 
                zekeFootCost = Math.floor(zekeFootCost * costMultiplier); 
            } 
            break; 
        case 'zekeArm': 
            if (zekes >= zekeArmCost) { 
                zekes -= zekeArmCost; 
                baseClickGain += 60; 
                zekeArmCount++; 
                zekeArmCost = Math.floor(zekeArmCost * costMultiplier); 
            } 
            break; 
        case 'zekeLeg': 
            if (zekes >= zekeLegCost) { 
                zekes -= zekeLegCost; 
                baseClickGain += 250; 
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
                baseIdleZekes += 6;
                zekeGlassesCount++; 
                zekeGlassesCost = Math.floor(zekeGlassesCost * costMultiplier); 
            } 
            break; 
        case 'zekeBackpack': 
            if (zekes >= zekeBackpackCost) { 
                zekes -= zekeBackpackCost; 
                baseIdleZekes += 35;
                zekeBackpackCount++; 
                zekeBackpackCost = Math.floor(zekeBackpackCost * costMultiplier); 
            } 
            break; 
        case 'zekeLiver': 
            if (zekes >= zekeLiverCost) { 
                zekes -= zekeLiverCost; 
                baseIdleZekes += 150;
                zekeLiverCount++; 
                zekeLiverCost = Math.floor(zekeLiverCost * costMultiplier); 
            } 
            break; 
        case 'zekeRobot': 
            if (zekes >= zekeRobotCost) { 
                zekes -= zekeRobotCost; 
                baseIdleZekes += 800;
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
    return Math.floor(Math.log10(zekes / REBIRTH_THRESHOLD) * 12) + 1;
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
    zekeToeCost = 120; zekeToeCount = 0;
    zekeFootCost = 900; zekeFootCount = 0;
    zekeArmCost = 7500; zekeArmCount = 0;
    zekeLegCost = 50000; zekeLegCount = 0;

    zekeShoeCost = 50; zekeShoeCount = 0;
    zekeGlassesCost = 400; zekeGlassesCount = 0;
    zekeBackpackCost = 3500; zekeBackpackCount = 0;
    zekeLiverCost = 25000; zekeLiverCount = 0;
    zekeRobotCost = 150000; zekeRobotCount = 0;

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
    
    let pendingTokensBtnEl = document.getElementById('pendingTokensBtn');
    if (pendingTokensBtnEl) pendingTokensBtnEl.innerText = pending;
    
    let rebirthBtn = document.getElementById('rebirth-trigger-btn');
    if (rebirthBtn) {
        if (zekes >= REBIRTH_THRESHOLD || (zekePartOne && zekePartTwo) || rebirthTokens > 0 || rebirthPowerLevel > 0 || rebirthAutoLevel > 0) {
            rebirthBtn.style.display = "inline-block";
            if (pending > 0) {
                rebirthBtn.disabled = false;
                rebirthBtn.style.background = "#ff007f";
                rebirthBtn.style.cursor = "pointer";
                rebirthBtn.innerText = `Rebirth (+${pending} Tokens)`;
            } else {
                rebirthBtn.disabled = true;
                rebirthBtn.style.background = "#555";
                rebirthBtn.style.cursor = "not-allowed";
                rebirthBtn.innerText = `Rebirth (+0 Tokens - Need more Zekes)`;
            }
        } else {
            rebirthBtn.style.display = "none";
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
    updateAll(); 
} 

function gainZekesAutoCount() { 
    let powerMult = Math.max(1, rebirthPowerLevel * 2);
    gainZeke((baseClickGain * powerMult) * clickBuffMultiplier); 
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

function restartGame() {
    if (confirm("Are you sure you want to restart? All progress, upgrades, and rebirth tokens will be permanently lost!")) {
        document.cookie = "zekeClickerSave=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
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

        zekePartOneCost = 10000000;
        zekePartTwoCost = 50000000;
        zekePartOne = false;
        zekePartTwo = false;

        rebirthTokens = 0;
        rebirthPowerLevel = 0; 
        rebirthAutoLevel = 0;  
        rbPowerCost = 1;
        rbAutoCost = 2;

        clickBuffMultiplier = 1;
        autoBuffMultiplier = 1;
        clickBuffTimer = 0;
        autoBuffTimer = 0;

        image.classList.remove('win-image');
        let winScreen = document.getElementById('win-screen');
        if (winScreen) winScreen.style.display = 'none';
        
        let p1Box = document.getElementById('partOneBox');
        if (p1Box) p1Box.style.display = 'block';
        let p2Box = document.getElementById('partTwoBox');
        if (p2Box) p2Box.style.display = 'block';
        
        let rebirthSidebar = ``, rebirthSidebarEl = document.getElementById('rebirth-sidebar');
        if (rebirthSidebarEl) rebirthSidebarEl.style.display = 'none';

        updateAll();
    }
}

window.onload = function() {
    loadGame();
};
