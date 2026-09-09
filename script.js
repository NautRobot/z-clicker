// CAM: 3, 3, 2, 0, 0  ;  4, 667
let zekes = 0; 
let clickGain = 1; 
let idleZekes = 0; 
const costMultiplier = 2.5; 

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
let zekePartTwoCost = 100000000000;

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

setInterval(() => {
    if (idleZekes > 0) {
        zekes += idleZekes;
        updateAll();
    }
}, 1000);

function buyUpgrade(upgradeName) { 
    switch(upgradeName) { 
        case 'zekeFinger': 
            if (zekes >= zekeFingerCost) { 
                zekes -= zekeFingerCost; 
                clickGain++; 
                zekeFingerCount++; 
                zekeFingerCost = Math.floor(zekeFingerCost * costMultiplier); 
            } 
            break; 
        case 'zekeToe': 
            if (zekes >= zekeToeCost) { 
                zekes -= zekeToeCost; 
                clickGain += 5; 
                zekeToeCount++; 
                zekeToeCost = Math.floor(zekeToeCost * costMultiplier); 
            } 
            break; 
        case 'zekeFoot': 
            if (zekes >= zekeFootCost) { 
                zekes -= zekeFootCost; 
                clickGain += 10; 
                zekeFootCount++; 
                zekeFootCost = Math.floor(zekeFootCost * costMultiplier); 
            } 
            break; 
        case 'zekeArm': 
            if (zekes >= zekeArmCost) { 
                zekes -= zekeArmCost; 
                clickGain += 50; 
                zekeArmCount++; 
                zekeArmCost = Math.floor(zekeArmCost * costMultiplier); 
            } 
            break; 
        case 'zekeLeg': 
            if (zekes >= zekeLegCost) { 
                zekes -= zekeLegCost; 
                clickGain += 100; 
                zekeLegCount++; 
                zekeLegCost = Math.floor(zekeLegCost * costMultiplier); 
            } 
            break; 
        case 'zekeShoe': 
            if (zekes >= zekeShoeCost) { 
                zekes -= zekeShoeCost; 
                idleZekes += 1;
                zekeShoeCount++; 
                zekeShoeCost = Math.floor(zekeShoeCost * costMultiplier); 
            } 
            break; 
        case 'zekeGlasses': 
            if (zekes >= zekeGlassesCost) { 
                zekes -= zekeGlassesCost; 
                idleZekes += 5;
                zekeGlassesCount++; 
                zekeGlassesCost = Math.floor(zekeGlassesCost * costMultiplier); 
            } 
            break; 
        case 'zekeBackpack': 
            if (zekes >= zekeBackpackCost) { 
                zekes -= zekeBackpackCost; 
                idleZekes += 50;
                zekeBackpackCount++; 
                zekeBackpackCost = Math.floor(zekeBackpackCost * costMultiplier); 
            } 
            break; 
        case 'zekeLiver': 
            if (zekes >= zekeLiverCost) { 
                zekes -= zekeLiverCost; 
                idleZekes += 100;
                zekeLiverCount++; 
                zekeLiverCost = Math.floor(zekeLiverCost * costMultiplier); 
            } 
            break; 
        case 'zekeRobot': 
            if (zekes >= zekeRobotCost) { 
                zekes -= zekeRobotCost; 
                idleZekes += 1000;
                zekeRobotCount++; 
                zekeRobotCost = Math.floor(zekeRobotCost * costMultiplier); 
            } 
            break; 
        case 'zekePartOne': 
            if (zekes >= zekePartOneCost) { 
                zekes -= zekePartOneCost; 
                zekePartOne = true;
            } 
            break; 
        case 'zekePartTwo': 
            if (zekes >= zekePartTwoCost) { 
                zekes -= zekePartTwoCost; 
                zekePartTwo = true;
            } 
            break; 
        default: 
            break; 
    } 
    updateAll(); 
} 

function updateAll() { 
    document.getElementById("zekeCount").innerHTML = zekes; 
    document.getElementById("zekeIdleCount").innerHTML = idleZekes; 
    document.getElementById("zekeClickGain").innerHTML = clickGain; 
    
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
} 

function gainZeke(zekeCount) { 
    zekes += zekeCount; 
    zekeBeep(); 
    updateAll(); 
} 

function gainZekesAutoCount() { 
    gainZeke(clickGain); 
} 

function zekeBeep() { 
    const audio = new Audio('zekeBeep.mp3'); 
    audio.play().catch(e => console.log("Audio playback prevented until user interacts with the page: ", e)); 
}
