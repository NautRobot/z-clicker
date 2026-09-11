// ==========================================
// 1. DATA-DRIVEN GAME ENGINE
// ==========================================
let game = {
    zekes: 0,
    allTimeZekes: 0, 
    memories: 0,
    spentMemories: 0,
    astralZekes: 0,
    cps: 0,
    clickValue: 1,
};

const COST_SCALAR = 1.15; 

// --- BUILDINGS ---
const buildings = [
    { id: 'b_finger', name: "Zeke's Finger", baseCost: 15, baseCPS: 0.2, count: 0 },
    { id: 'b_toe', name: "Zeke's Toe", baseCost: 100, baseCPS: 1, count: 0 },
    { id: 'b_shoe', name: "Zeke's Shoe", baseCost: 1100, baseCPS: 8, count: 0 },
    { id: 'b_glasses', name: "Zeke's Glasses", baseCost: 12000, baseCPS: 47, count: 0 },
    { id: 'b_backpack', name: "Zeke's Backpack", baseCost: 130000, baseCPS: 260, count: 0 },
    { id: 'b_liver', name: "Zeke's Liver", baseCost: 1400000, baseCPS: 1400, count: 0 },
    { id: 'b_clone', name: "Zeke Clone", baseCost: 20000000, baseCPS: 7800, count: 0 }
];

// --- NORMAL UPGRADES ---
const upgrades = [
    { id: 'u_c1', name: 'Zeke Cursor', desc: 'Clicking is twice as efficient.', cost: 500, type: 'click_mult', val: 2, reqCheck: ()=>game.allTimeZekes>=100, bought: false, icon: '🖱️' },
    { id: 'u_c2', name: 'Carpal Tunnel', desc: 'Clicking is twice as efficient.', cost: 10000, type: 'click_mult', val: 2, reqCheck: ()=>game.allTimeZekes>=5000, bought: false, icon: '💪' },
    { id: 'u_syn1', name: 'Plastic Mouse', desc: 'Clicking gains +1% of your total CPS.', cost: 50000, type: 'synergy_mouse', val: 0.01, reqCheck: ()=>game.cps>=100, bought: false, icon: '🐁' },
    { id: 'u_syn2', name: 'Iron Mouse', desc: 'Clicking gains +1% of your total CPS.', cost: 5000000, type: 'synergy_mouse', val: 0.01, reqCheck: ()=>game.cps>=5000, bought: false, icon: '🐭' },
    { id: 'u_b1', name: 'Nimble Fingers', desc: 'Fingers are twice as efficient.', cost: 150, type: 'building_mult', target: 'b_finger', val: 2, reqCheck: ()=>getBld('b_finger').count>=10, bought: false, icon: '☝️' },
    { id: 'u_b2', name: 'Thick Toes', desc: 'Toes are twice as efficient.', cost: 1000, type: 'building_mult', target: 'b_toe', val: 2, reqCheck: ()=>getBld('b_toe').count>=10, bought: false, icon: '🦶' },
    { id: 'u_b3', name: 'Nike Airs', desc: 'Shoes are twice as efficient.', cost: 11000, type: 'building_mult', target: 'b_shoe', val: 2, reqCheck: ()=>getBld('b_shoe').count>=10, bought: false, icon: '👟' },
];

// --- PRESTIGE TREES ---
const rebirthTree = [
    { id: 'rt_1', name: 'Better Base', desc: 'Base click value +5.', cost: 1, bought: false },
    { id: 'rt_2', name: 'Synergy Core', desc: 'Fingers boost Shoes by 1% each.', cost: 5, bought: false },
];

const ascensionTree = [
    { id: 'at_1', name: 'Crit Chance', desc: 'Unlock 10% chance to Crit (x5 click).', cost: 1, bought: false },
    { id: 'at_2', name: 'Astral Aura', desc: 'Memories grant +2% global boost instead of +1%.', cost: 3, bought: false },
];

// Helpers
const getBld = (id) => buildings.find(b => b.id === id);
const getUpg = (id) => upgrades.find(u => u.id === id);
const getRT = (id) => rebirthTree.find(u => u.id === id);
const getAT = (id) => ascensionTree.find(u => u.id === id);
const getBldCost = (b) => Math.floor(b.baseCost * Math.pow(COST_SCALAR, b.count));


// ==========================================
// 2. CORE LOGIC & CALCULATION
// ==========================================
function calculateStats() {
    let newCPS = 0;
    buildings.forEach(b => {
        let bldMult = 1;
        upgrades.forEach(u => {
            if (u.bought && u.type === 'building_mult' && u.target === b.id) bldMult *= u.val;
        });
        
        if (getRT('rt_2').bought && b.id === 'b_shoe') {
            bldMult *= (1 + (getBld('b_finger').count * 0.01));
        }
        newCPS += (b.baseCPS * bldMult) * b.count;
    });

    let memoryBoostValue = getAT('at_2').bought ? 0.02 : 0.01;
    let memoryMultiplier = 1 + (game.memories * memoryBoostValue);
    let astralMultiplier = 1 + (game.astralZekes * 0.5); 

    game.cps = newCPS * memoryMultiplier * astralMultiplier;

    let clickBase = getRT('rt_1').bought ? 6 : 1;
    upgrades.forEach(u => {
        if (u.bought && u.type === 'click_mult') clickBase *= u.val;
    });

    let synergyBonus = 0;
    upgrades.forEach(u => {
        if (u.bought && u.type === 'synergy_mouse') synergyBonus += (game.cps * u.val);
    });

    game.clickValue = (clickBase + synergyBonus) * memoryMultiplier * astralMultiplier;
}

// Tick loop (Runs incredibly smooth now, separates DOM creation from text updates)
let tickCount = 0;
setInterval(() => {
    if (game.cps > 0) {
        let amount = game.cps / 10;
        game.zekes += amount;
        game.allTimeZekes += amount;
    }
    updateUIText();
    
    tickCount++;
    if (tickCount % 10 === 0) {
        refreshUpgradesDOM(); // Checks for newly unlocked upgrades 1x per sec
    }
}, 100);

// ==========================================
// 3. INTERACTION
// ==========================================
const zekeImg = document.getElementById('zeke');
if (zekeImg) {
    zekeImg.addEventListener('mousedown', (e) => {
        zekeImg.classList.remove('click-animation'); 
        void zekeImg.offsetWidth; 
        zekeImg.classList.add('click-animation'); 
        
        let isCrit = false;
        let finalClick = game.clickValue;
        if (getAT('at_1').bought && Math.random() < 0.10) {
            isCrit = true;
            finalClick *= 5;
        }

        game.zekes += finalClick;
        game.allTimeZekes += finalClick;
        
        createFloatingText(e, finalClick, isCrit);
        updateUIText();
    });
}

function createFloatingText(e, amount, isCrit) {
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    floatEl.innerText = (isCrit ? 'CRIT! +' : '+') + formatNumber(amount);
    if (isCrit) floatEl.style.color = '#ff00ff';
    
    const randomOffsetX = (Math.random() - 0.5) * 30;
    const randomOffsetY = (Math.random() - 0.5) * 30;
    floatEl.style.left = (e.clientX + randomOffsetX) + 'px';
    floatEl.style.top = (e.clientY - 20 + randomOffsetY) + 'px';
    
    document.body.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 1000);
}

function buyBuilding(id) {
    let b = getBld(id);
    let cost = getBldCost(b);
    if (game.zekes >= cost) {
        game.zekes -= cost;
        b.count++;
        calculateStats();
        updateUIText();
    }
}

function buyUpgrade(id) {
    let u = getUpg(id);
    if (game.zekes >= u.cost && !u.bought) {
        game.zekes -= u.cost;
        u.bought = true;
        calculateStats();
        
        // Remove from DOM safely
        let el = document.getElementById(`upg_${id}`);
        if(el) el.remove();
        
        updateUIText();
    }
}

// ==========================================
// 4. PRESTIGE SYSTEM
// ==========================================
function getPendingMemories() {
    if (game.allTimeZekes < 1000000) return 0;
    let earned = Math.floor(Math.cbrt(game.allTimeZekes / 1000000));
    let totalGotten = game.memories + game.spentMemories;
    return Math.max(0, earned - totalGotten);
}

function getPendingAstral() {
    let totalMemories = game.memories + game.spentMemories;
    if (totalMemories < 100) return 0;
    return Math.floor(totalMemories / 100);
}

function triggerRebirth() {
    let pending = getPendingMemories();
    if (pending <= 0) return;
    
    game.memories += pending;
    
    game.zekes = 0;
    buildings.forEach(b => b.count = 0);
    upgrades.forEach(u => u.bought = false);
    
    calculateStats();
    refreshUpgradesDOM(true); // Force wipe upgrades
    updateUIText();
}

function triggerAscension() {
    let pending = getPendingAstral();
    if (pending <= 0) return;

    game.astralZekes += pending;

    game.zekes = 0;
    game.allTimeZekes = 0;
    game.memories = 0;
    game.spentMemories = 0;
    
    buildings.forEach(b => b.count = 0);
    upgrades.forEach(u => u.bought = false);
    rebirthTree.forEach(u => u.bought = false);
    
    calculateStats();
    refreshUpgradesDOM(true);
    updatePrestigeTreesUI();
    updateUIText();
}

function buyTreeUpgrade(tree, id) {
    if (tree === 'rebirth') {
        let u = getRT(id);
        if (!u.bought && game.memories >= u.cost) {
            game.memories -= u.cost;
            game.spentMemories += u.cost;
            u.bought = true;
        }
    } else if (tree === 'ascension') {
        let u = getAT(id);
        if (!u.bought && game.astralZekes >= u.cost) {
            game.astralZekes -= u.cost;
            u.bought = true;
        }
    }
    calculateStats();
    updatePrestigeTreesUI();
    updateUIText();
}

// ==========================================
// 5. UI BUILDERS (DOM DIFFING = NO MORE STORE BUGS)
// ==========================================
const tooltip = document.getElementById('tooltip');
function showTooltip(e, name, cost, desc, currencySymbol = 'Zekes') {
    tooltip.innerHTML = `<h4>${name}</h4><span class="tt-cost">Cost: ${formatNumber(cost)} ${currencySymbol}</span><div>${desc}</div>`;
    tooltip.style.display = 'block';
    let x = e.pageX + 15, y = e.pageY + 15;
    if (x + 200 > window.innerWidth) x = e.pageX - 215;
    tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px';
}
function hideTooltip() { tooltip.style.display = 'none'; }

// Run ONCE on load to create the building rows
function initBuildings() {
    const bldContainer = document.getElementById('buildings-container');
    bldContainer.innerHTML = '';
    buildings.forEach(b => {
        let el = document.createElement('div');
        el.className = 'building-row';
        el.id = `ui_${b.id}`;
        el.onclick = () => buyBuilding(b.id);
        el.innerHTML = `
            <div class="bld-info">
                <span class="bld-name">${b.name}</span>
                <span class="bld-cost" id="cost_${b.id}">${formatNumber(getBldCost(b))} Zekes</span>
            </div>
            <span class="bld-count" id="count_${b.id}">${b.count}</span>
        `;
        bldContainer.appendChild(el);
    });
}

// Safely adds new upgrades to the DOM without destroying existing ones
function refreshUpgradesDOM(forceWipe = false) {
    const upgContainer = document.getElementById('upgrades-container');
    if (forceWipe) upgContainer.innerHTML = '';
    
    upgrades.forEach(u => {
        let existing = document.getElementById(`upg_${u.id}`);
        if (u.bought) {
            if (existing) existing.remove();
        } else if (u.reqCheck()) {
            if (!existing) {
                let el = document.createElement('div');
                el.className = 'upgrade-icon';
                el.id = `upg_${u.id}`;
                el.innerHTML = u.icon;
                el.onclick = () => { buyUpgrade(u.id); hideTooltip(); };
                el.onmouseenter = (e) => showTooltip(e, u.name, u.cost, u.desc);
                el.onmousemove = (e) => showTooltip(e, u.name, u.cost, u.desc);
                el.onmouseleave = hideTooltip;
                upgContainer.appendChild(el);
            }
        }
    });
}

// Run ONCE to build tree HTML structures
function initPrestigeTrees() {
    const rtContainer = document.getElementById('rebirth-tree');
    rtContainer.innerHTML = '';
    rebirthTree.forEach(u => {
        let el = document.createElement('div');
        el.className = 'tree-item';
        el.id = `rt_ui_${u.id}`;
        el.innerHTML = `<div><strong>${u.name}</strong><br><span style="font-size:0.8rem; color:#aaa;">${u.desc}</span></div>
                        <div id="rt_btn_${u.id}"></div>`;
        rtContainer.appendChild(el);
    });

    const atContainer = document.getElementById('ascension-tree');
    atContainer.innerHTML = '';
    ascensionTree.forEach(u => {
        let el = document.createElement('div');
        el.className = 'tree-item';
        el.id = `at_ui_${u.id}`;
        el.style.borderColor = '#444'; el.style.background = '#242424';
        el.innerHTML = `<div><strong>${u.name}</strong><br><span style="font-size:0.8rem; color:#aaa;">${u.desc}</span></div>
                        <div id="at_btn_${u.id}"></div>`;
        atContainer.appendChild(el);
    });
    
    updatePrestigeTreesUI();
}

// Safely updates button states in prestige trees
function updatePrestigeTreesUI() {
    rebirthTree.forEach(u => {
        let el = document.getElementById(`rt_ui_${u.id}`);
        let btn = document.getElementById(`rt_btn_${u.id}`);
        if(el && btn) {
            if (u.bought) {
                el.classList.add('bought'); btn.innerHTML = '<span>Owned</span>';
            } else {
                el.classList.remove('bought'); btn.innerHTML = `<button onclick="buyTreeUpgrade('rebirth', '${u.id}')">Cost: ${u.cost} M</button>`;
            }
        }
    });

    ascensionTree.forEach(u => {
        let el = document.getElementById(`at_ui_${u.id}`);
        let btn = document.getElementById(`at_btn_${u.id}`);
        if(el && btn) {
            if (u.bought) {
                el.style.borderColor = '#ffd700'; el.style.background = '#332b00';
                btn.innerHTML = '<span style="color:#ffd700;">Owned</span>';
            } else {
                el.style.borderColor = '#444'; el.style.background = '#242424';
                btn.innerHTML = `<button style="background:#b8860b;" onclick="buyTreeUpgrade('ascension', '${u.id}')">Cost: ${u.cost} A</button>`;
            }
        }
    });
}

function updateUIText() {
    document.getElementById('zekeCount').innerText = Math.floor(game.zekes).toLocaleString();
    document.getElementById('cpsDisplay').innerText = formatNumber(game.cps);
    document.getElementById('clickValueDisplay').innerText = formatNumber(game.clickValue);

    // Update Building Costs dynamically WITHOUT destroying the HTML
    buildings.forEach(b => {
        let costEl = document.getElementById(`cost_${b.id}`);
        let countEl = document.getElementById(`count_${b.id}`);
        let rowEl = document.getElementById(`ui_${b.id}`);
        if (costEl && rowEl) {
            let cost = getBldCost(b);
            costEl.innerText = formatNumber(cost) + " Zekes";
            countEl.innerText = b.count;
            rowEl.style.opacity = game.zekes >= cost ? "1" : "0.5";
        }
    });
    
    // Prestige UI
    document.getElementById('memoryCount').innerText = game.memories.toLocaleString();
    let memoryBoostValue = getAT('at_2').bought ? 2 : 1;
    document.getElementById('memoryBoost').innerText = (game.memories * memoryBoostValue).toLocaleString();
    
    let pMem = getPendingMemories();
    let rBtn = document.getElementById('btn-rebirth');
    document.getElementById('pendingMemories').innerText = pMem.toLocaleString();
    rBtn.disabled = pMem <= 0;

    document.getElementById('astralCount').innerText = game.astralZekes.toLocaleString();
    
    let pAst = getPendingAstral();
    let aBtn = document.getElementById('btn-ascend');
    document.getElementById('pendingAstral').innerText = pAst.toLocaleString();
    aBtn.disabled = pAst <= 0;

    document.getElementById('critDisplay').style.display = getAT('at_1').bought ? 'block' : 'none';
}

function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toLocaleString();
    if (num < 1000000) return (num / 1000).toFixed(1) + "k";
    if (num < 1000000000) return (num / 1000000).toFixed(2) + "M";
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + "B";
    return (num / 1000000000000).toFixed(2) + "T";
}

// ==========================================
// 6. SAVE / LOAD & MIGRATION
// ==========================================

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

// MIGRATION SCRIPT: Automatically converts v4 and v5 cookies into the new v7 save format!
function migrateOldSaves() {
    let oldSaveData = getCookie("zekeClickerSave_v5") || getCookie("zekeClickerSave_v4") || getCookie("zekeClickerSave_v3");
    if (oldSaveData) {
        try {
            let old = JSON.parse(oldSaveData);
            game.zekes = old.zekes || 0;
            game.allTimeZekes = old.zekes || 0; // Estimate
            game.memories = old.rebirthTokens || 0;
            game.astralZekes = old.ascensionPoints || 0;
            
            let bMap = {
                'b_finger': old.zekeFingerCount || 0,
                'b_toe': old.zekeToeCount || 0,
                'b_shoe': old.zekeShoeCount || 0,
                'b_glasses': old.zekeGlassesCount || 0,
                'b_backpack': old.zekeBackpackCount || 0,
                'b_liver': old.zekeLiverCount || 0,
                'b_clone': old.zekeRobotCount || 0
            };
            
            buildings.forEach(b => {
                if (bMap[b.id] !== undefined) b.count = bMap[b.id];
            });
            
            // Delete old cookies so migration doesn't run again
            document.cookie = "zekeClickerSave_v5=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "zekeClickerSave_v4=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            console.log("Successfully migrated old save!");
        } catch(e) { console.error("Migration failed", e); }
    }
}

function saveGame() {
    let saveObj = { game, buildings, upgrades, rebirthTree, ascensionTree };
    localStorage.setItem("zekeClickerSave_v8", JSON.stringify(saveObj));
}

function loadGame() {
    // 1. Try to migrate if needed
    if (!localStorage.getItem("zekeClickerSave_v8")) {
        migrateOldSaves();
    }
    
    // 2. Load v8 Save (or fallback to v7)
    let saveStr = localStorage.getItem("zekeClickerSave_v8") || localStorage.getItem("zekeClickerSave_v7");
    if (saveStr) {
        try {
            let data = JSON.parse(saveStr);
            game = { ...game, ...data.game };
            data.buildings.forEach(savedB => { let b = getBld(savedB.id); if (b) b.count = savedB.count; });
            data.upgrades.forEach(savedU => { let u = getUpg(savedU.id); if (u) u.bought = savedU.bought; });
            data.rebirthTree.forEach(savedU => { let u = getRT(savedU.id); if (u) u.bought = savedU.bought; });
            data.ascensionTree.forEach(savedU => { let u = getAT(savedU.id); if (u) u.bought = savedU.bought; });
        } catch (e) { console.error("Save load failed", e); }
    }
    
    // 3. Initialize DOM structures ONCE
    initBuildings();
    initPrestigeTrees();
    
    // 4. Update data
    calculateStats();
    refreshUpgradesDOM();
    updateUIText();
}

function restartGame() {
    if (confirm("Are you sure you want to HARD RESET? Everything is wiped!")) {
        localStorage.removeItem("zekeClickerSave_v8");
        localStorage.removeItem("zekeClickerSave_v7");
        location.reload();
    }
}

// Init Game Loop
window.onload = loadGame;
setInterval(saveGame, 5000);
