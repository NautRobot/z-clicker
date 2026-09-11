import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, onValue, onDisconnect, set, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyD2K3TT7hOfakFPgJ9mMjTEM8Jim9_rA",
  authDomain: "z-clicker-97488.firebaseapp.com",
  projectId: "z-clicker-97488",
  storageBucket: "z-clicker-97488.firebasestorage.app",
  messagingSenderId: "686862323992",
  appId: "1:686862323992:web:e25c46b7deb67254278e6d",
  measurementId: "G-Y92C3EM9E1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Logic: Generate a unique ID for this session
const sessionRef = ref(db, 'online_users/' + Date.now() + Math.random().toString(36).substring(2));
set(sessionRef, true); // Mark as online
onDisconnect(sessionRef).remove(); // Auto-remove when tab closes!

// Listen to total count
const usersRef = ref(db, 'online_users');
onValue(usersRef, (snapshot) => {
    let count = snapshot.size || 0;
    document.getElementById('realLiveUsers').innerText = count;
});

// Increment and read Total Visits
const visitsRef = ref(db, 'total_visits');
set(visitsRef, increment(1)); // Add 1 on page load
onValue(visitsRef, (snapshot) => {
    document.getElementById('realTotalVisits').innerText = (snapshot.val() || 0).toLocaleString();
});
*/


// ==========================================
// 2. DATA-DRIVEN GAME ENGINE
// ==========================================

let game = {
    zekes: 0,
    allTimeZekes: 0, // Used for calculating Rebirth Memories
    memories: 0,
    spentMemories: 0,
    astralZekes: 0,
    
    // Core stats calculated per tick
    cps: 0,
    clickValue: 1,
};

const COST_SCALAR = 1.15; // Cookie Clicker standard

// --- BUILDINGS (Right Panel List) ---
const buildings = [
    { id: 'b_finger', name: "Zeke's Finger", baseCost: 15, baseCPS: 0.2, count: 0 },
    { id: 'b_toe', name: "Zeke's Toe", baseCost: 100, baseCPS: 1, count: 0 },
    { id: 'b_shoe', name: "Zeke's Shoe", baseCost: 1100, baseCPS: 8, count: 0 },
    { id: 'b_glasses', name: "Zeke's Glasses", baseCost: 12000, baseCPS: 47, count: 0 },
    { id: 'b_backpack', name: "Zeke's Backpack", baseCost: 130000, baseCPS: 260, count: 0 },
    { id: 'b_liver', name: "Zeke's Liver", baseCost: 1400000, baseCPS: 1400, count: 0 },
    { id: 'b_clone', name: "Zeke Clone", baseCost: 20000000, baseCPS: 7800, count: 0 }
];

// --- NORMAL UPGRADES (Right Panel Grid) ---
// type: 'building_mult' (multiplies a building's base CPS)
// type: 'click_mult' (multiplies base click value)
// type: 'synergy_mouse' (click gains x% of CPS)
const upgrades = [
    // Clickers
    { id: 'u_c1', name: 'Zeke Cursor', desc: 'Clicking is twice as efficient.', cost: 500, type: 'click_mult', val: 2, reqCheck: ()=>game.allTimeZekes>=100, bought: false, icon: '🖱️' },
    { id: 'u_c2', name: 'Carpal Tunnel', desc: 'Clicking is twice as efficient.', cost: 10000, type: 'click_mult', val: 2, reqCheck: ()=>game.allTimeZekes>=5000, bought: false, icon: '💪' },
    
    // Synergies
    { id: 'u_syn1', name: 'Plastic Mouse', desc: 'Clicking gains +1% of your total CPS.', cost: 50000, type: 'synergy_mouse', val: 0.01, reqCheck: ()=>game.cps>=100, bought: false, icon: '🐁' },
    { id: 'u_syn2', name: 'Iron Mouse', desc: 'Clicking gains +1% of your total CPS.', cost: 5000000, type: 'synergy_mouse', val: 0.01, reqCheck: ()=>game.cps>=5000, bought: false, icon: '🐭' },

    // Building Boosts
    { id: 'u_b1', name: 'Nimble Fingers', desc: 'Fingers are twice as efficient.', cost: 150, type: 'building_mult', target: 'b_finger', val: 2, reqCheck: ()=>getBld('b_finger').count>=10, bought: false, icon: '☝️' },
    { id: 'u_b2', name: 'Thick Toes', desc: 'Toes are twice as efficient.', cost: 1000, type: 'building_mult', target: 'b_toe', val: 2, reqCheck: ()=>getBld('b_toe').count>=10, bought: false, icon: '🦶' },
    { id: 'u_b3', name: 'Nike Airs', desc: 'Shoes are twice as efficient.', cost: 11000, type: 'building_mult', target: 'b_shoe', val: 2, reqCheck: ()=>getBld('b_shoe').count>=10, bought: false, icon: '👟' },
];

// --- PRESTIGE TREES (Middle Panel) ---
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
// 3. CORE LOGIC & CALCULATION
// ==========================================

function calculateStats() {
    // 1. Calculate Base CPS
    let newCPS = 0;
    buildings.forEach(b => {
        let bldMult = 1;
        // Apply normal upgrades targeted at this building
        upgrades.forEach(u => {
            if (u.bought && u.type === 'building_mult' && u.target === b.id) bldMult *= u.val;
        });
        
        // Rebirth Tree specific synergies
        if (getRT('rt_2').bought && b.id === 'b_shoe') {
            bldMult *= (1 + (getBld('b_finger').count * 0.01));
        }

        newCPS += (b.baseCPS * bldMult) * b.count;
    });

    // 2. Apply Global Prestige Multipliers to CPS
    let memoryBoostValue = getAT('at_2').bought ? 0.02 : 0.01;
    let memoryMultiplier = 1 + (game.memories * memoryBoostValue);
    
    // Astral Zekes give +50% each
    let astralMultiplier = 1 + (game.astralZekes * 0.5); 

    game.cps = newCPS * memoryMultiplier * astralMultiplier;

    // 3. Calculate Click Value
    let clickBase = getRT('rt_1').bought ? 6 : 1; // Rebirth tree base boost
    
    upgrades.forEach(u => {
        if (u.bought && u.type === 'click_mult') clickBase *= u.val;
    });

    // Apply synergies (Mouse upgrades adding % of CPS)
    let synergyBonus = 0;
    upgrades.forEach(u => {
        if (u.bought && u.type === 'synergy_mouse') synergyBonus += (game.cps * u.val);
    });

    // Apply global modifiers to click as well
    game.clickValue = (clickBase + synergyBonus) * memoryMultiplier * astralMultiplier;
}

// Tick loop
setInterval(() => {
    if (game.cps > 0) {
        let amount = game.cps / 10; // Run 10 times a second for smoothness
        game.zekes += amount;
        game.allTimeZekes += amount;
    }
    updateUI();
}, 100);

// ==========================================
// 4. INTERACTION
// ==========================================

const zekeImg = document.getElementById('zeke');
if (zekeImg) {
    zekeImg.addEventListener('mousedown', (e) => {
        zekeImg.classList.remove('click-animation'); 
        void zekeImg.offsetWidth; 
        zekeImg.classList.add('click-animation'); 
        
        // Crit Logic (Unlocked via Ascension Tree)
        let isCrit = false;
        let finalClick = game.clickValue;
        if (getAT('at_1').bought && Math.random() < 0.10) {
            isCrit = true;
            finalClick *= 5;
        }

        game.zekes += finalClick;
        game.allTimeZekes += finalClick;
        
        createFloatingText(e, finalClick, isCrit);
        updateUI();
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

// Buy functions
function buyBuilding(id) {
    let b = getBld(id);
    let cost = getBldCost(b);
    if (game.zekes >= cost) {
        game.zekes -= cost;
        b.count++;
        calculateStats();
        updateUI();
    }
}

function buyUpgrade(id) {
    let u = getUpg(id);
    if (game.zekes >= u.cost && !u.bought) {
        game.zekes -= u.cost;
        u.bought = true;
        calculateStats();
        buildStore(); // Rebuild store to remove bought icon
        updateUI();
    }
}

// ==========================================
// 5. PRESTIGE SYSTEM
// ==========================================

function getPendingMemories() {
    // Formula: Cube root of millions
    if (game.allTimeZekes < 1000000) return 0;
    let earned = Math.floor(Math.cbrt(game.allTimeZekes / 1000000));
    let totalGotten = game.memories + game.spentMemories;
    return Math.max(0, earned - totalGotten);
}

function getPendingAstral() {
    // Formula based on total memories gathered
    let totalMemories = game.memories + game.spentMemories;
    if (totalMemories < 100) return 0;
    return Math.floor(totalMemories / 100);
}

function triggerRebirth() {
    let pending = getPendingMemories();
    if (pending <= 0) return;
    
    game.memories += pending;
    
    // Soft Reset
    game.zekes = 0;
    buildings.forEach(b => b.count = 0);
    upgrades.forEach(u => u.bought = false);
    
    calculateStats();
    buildStore();
    updateUI();
}

function triggerAscension() {
    let pending = getPendingAstral();
    if (pending <= 0) return;

    game.astralZekes += pending;

    // Hard Reset
    game.zekes = 0;
    game.allTimeZekes = 0;
    game.memories = 0;
    game.spentMemories = 0;
    
    buildings.forEach(b => b.count = 0);
    upgrades.forEach(u => u.bought = false);
    rebirthTree.forEach(u => u.bought = false);
    
    calculateStats();
    buildStore();
    buildPrestigeTrees();
    updateUI();
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
    buildPrestigeTrees();
    updateUI();
}

// ==========================================
// 6. UI BUILDERS (Runs on load)
// ==========================================
const tooltip = document.getElementById('tooltip');

function showTooltip(e, name, cost, desc, currencySymbol = 'Zekes') {
    tooltip.innerHTML = `<h4>${name}</h4><span class="tt-cost">Cost: ${formatNumber(cost)} ${currencySymbol}</span><div>${desc}</div>`;
    tooltip.style.display = 'block';
    
    let x = e.pageX + 15;
    let y = e.pageY + 15;
    
    // Prevent flowing off screen right
    if (x + 200 > window.innerWidth) x = e.pageX - 215;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}
function hideTooltip() { tooltip.style.display = 'none'; }

function buildStore() {
    // 1. Upgrades Grid (Only show unbought ones that meet reqs)
    const upgContainer = document.getElementById('upgrades-container');
    upgContainer.innerHTML = '';
    upgrades.forEach(u => {
        if (!u.bought && u.reqCheck()) {
            let el = document.createElement('div');
            el.className = 'upgrade-icon';
            el.innerHTML = u.icon;
            el.onclick = () => { buyUpgrade(u.id); hideTooltip(); };
            el.onmouseenter = (e) => showTooltip(e, u.name, u.cost, u.desc);
            el.onmousemove = (e) => showTooltip(e, u.name, u.cost, u.desc);
            el.onmouseleave = hideTooltip;
            upgContainer.appendChild(el);
        }
    });

    // 2. Buildings List
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

function buildPrestigeTrees() {
    const rtContainer = document.getElementById('rebirth-tree');
    rtContainer.innerHTML = '';
    rebirthTree.forEach(u => {
        rtContainer.innerHTML += `
            <div class="tree-item ${u.bought ? 'bought' : ''}">
                <div>
                    <strong>${u.name}</strong><br>
                    <span style="font-size:0.8rem; color:#aaa;">${u.desc}</span>
                </div>
                ${u.bought ? '<span>Owned</span>' : `<button onclick="buyTreeUpgrade('rebirth', '${u.id}')">Cost: ${u.cost} M</button>`}
            </div>
        `;
    });

    const atContainer = document.getElementById('ascension-tree');
    atContainer.innerHTML = '';
    ascensionTree.forEach(u => {
        atContainer.innerHTML += `
            <div class="tree-item ${u.bought ? 'bought' : ''}" style="border-color: ${u.bought ? '#ffd700' : '#444'}; background: ${u.bought ? '#332b00' : '#242424'}">
                <div>
                    <strong>${u.name}</strong><br>
                    <span style="font-size:0.8rem; color:#aaa;">${u.desc}</span>
                </div>
                ${u.bought ? '<span style="color:#ffd700;">Owned</span>' : `<button style="background:#b8860b;" onclick="buyTreeUpgrade('ascension', '${u.id}')">Cost: ${u.cost} A</button>`}
            </div>
        `;
    });
}

function updateUI() {
    document.getElementById('zekeCount').innerText = Math.floor(game.zekes).toLocaleString();
    document.getElementById('cpsDisplay').innerText = formatNumber(game.cps);
    document.getElementById('clickValueDisplay').innerText = formatNumber(game.clickValue);

    // Update Building Costs dynamically without rebuilding entire DOM
    buildings.forEach(b => {
        let costEl = document.getElementById(`cost_${b.id}`);
        let countEl = document.getElementById(`count_${b.id}`);
        let rowEl = document.getElementById(`ui_${b.id}`);
        if (costEl) {
            let cost = getBldCost(b);
            costEl.innerText = formatNumber(cost) + " Zekes";
            countEl.innerText = b.count;
            rowEl.style.opacity = game.zekes >= cost ? "1" : "0.5"; // Dim if can't afford
        }
    });
    
    // Store Upgrade visibility logic periodically checks to see if new things unlock
    // (Optimization: In a massive game, you'd only run this specific check once every second, but here it's fine)
    if (Math.random() < 0.1) buildStore(); 

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

    // Reveal Crit UI if unlocked
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
// 7. SAVE / LOAD
// ==========================================
function saveGame() {
    let saveObj = { game, buildings, upgrades, rebirthTree, ascensionTree };
    localStorage.setItem("zekeClickerSave_v6", JSON.stringify(saveObj));
}

function loadGame() {
    let saveStr = localStorage.getItem("zekeClickerSave_v6");
    if (saveStr) {
        try {
            let data = JSON.parse(saveStr);
            game = { ...game, ...data.game };
            
            // Merge arrays to persist state while allowing new code additions
            data.buildings.forEach(savedB => { let b = getBld(savedB.id); if (b) b.count = savedB.count; });
            data.upgrades.forEach(savedU => { let u = getUpg(savedU.id); if (u) u.bought = savedU.bought; });
            data.rebirthTree.forEach(savedU => { let u = getRT(savedU.id); if (u) u.bought = savedU.bought; });
            data.ascensionTree.forEach(savedU => { let u = getAT(savedU.id); if (u) u.bought = savedU.bought; });
        } catch (e) { console.error("Save load failed", e); }
    }
    calculateStats();
    buildStore();
    buildPrestigeTrees();
    updateUI();
}

function restartGame() {
    if (confirm("Are you sure you want to HARD RESET? Everything is wiped!")) {
        localStorage.removeItem("zekeClickerSave_v6");
        location.reload();
    }
}

// Init
window.onload = loadGame;
setInterval(saveGame, 5000); // Auto save every 5s
