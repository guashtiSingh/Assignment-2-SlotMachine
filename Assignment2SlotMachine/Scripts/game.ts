
/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />

/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />



// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var tiles: createjs.Bitmap[] = [];
var reelContainers: createjs.Container[] = [];
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotmachine.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];

var atlas = {

    "images": ["assets/images/atlas.png"],

    "frames": [
        [2, 2, 60, 60, 0, 0, 0],
        [64, 2, 60, 60, 0, 0, 0],
        [126, 2, 60, 60, 0, 0, 0],
        [188, 2, 60, 60, 0, 0, 0],
        [250, 2, 60, 60, 0, 0, 0],
        [312, 2, 60, 60, 0, 0, 0],
        [374, 2, 60, 60, 0, 0, 0],
        [436, 2, 60, 60, 0, 0, 0],
        [498, 2, 49, 49, 0, 0, 0],
        [549, 2, 49, 49, 0, 0, 0],
        [600, 2, 49, 49, 0, 0, 0],
        [651, 2, 49, 49, 0, 0, 0],
        [702, 2, 23, 21, 0, -242, -49]
    ],

    "animations": {
        "blankButton": [0],
        "flower1": [1],
        "flower2": [2],
        "flower3": [3],
        "flower4": [4],
        "flower5": [5],
        "flower6": [6],
        "wild": [7],
        "betOneButton": [8],
        "betTenButton": [9],
        "resetButton": [10],
        "spinButton": [11],
        "powerButton": [12]
    }

};

// GAME CONSTANTS
var NUM_REELS: number = 3;

// Game Variables
var winRatio = 0;
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var flower = "";

//Tally Variables
var flower1 = 0;
var flower2 = 0;
var flower3 = 0;
var flower4 = 0;
var flower5 = 0;
var flower6 = 0;
var wild = 0;
var blank = 0;

//Game Objects
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;
var resetButton: objects.Button;
var betOneButton: objects.Button;
var betTenButton: objects.Button;
var powerButton: objects.Button;

/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    flower1 = 0;
    flower2 = 0;
    flower3 = 0;
    flower4 = 0;
    flower5 = 0;
    flower6 = 0;
    wild = 0;
    blank = 0;
}

/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}



// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this); 
    assets.loadManifest(manifest);

    //Load Texture atlas
    textureAtlas = new createjs.SpriteSheet(atlas);
    //Setup statistics object
    setupStats();
}

// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop); 

    // calling main game function
    main();
}

// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps

    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';

    document.body.appendChild(stats.domElement);
}

// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring

    stage.update();

    stats.end(); // end measuring
}

// Callback function that allows me to respond to button click events
function spinButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");

    spinResult = Reels();
    flower = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
    }
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank";
                blank++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "Flower1";
                flower1++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "Flower2";
                flower2++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "Flower3";
                flower3++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "Flower4";
                flower4++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "Flower5";
                flower5++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "Flower6";
                flower6++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "Wild";
                wild++;
                break;
        }
    }
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blank == 0) {
        if (flower1 == 3) {
            winnings = playerBet * 10;
        }
        else if (flower2 == 3) {
            winnings = playerBet * 20;
        }
        else if (flower3 == 3) {
            winnings = playerBet * 30;
        }
        else if (flower4 == 3) {
            winnings = playerBet * 40;
        }
        else if (flower5 == 3) {
            winnings = playerBet * 50;
        }
        else if (flower6 == 3) {
            winnings = playerBet * 75;
        }
        else if (wild == 3) {
            winnings = playerBet * 100;
        }
        else if (flower1 == 2) {
            winnings = playerBet * 2;
        }
        else if (flower2 == 2) {
            winnings = playerBet * 2;
        }
        else if (flower3 == 2) {
            winnings = playerBet * 3;
        }
        else if (flower4 == 2) {
            winnings = playerBet * 4;
        }
        else if (flower5 == 2) {
            winnings = playerBet * 5;
        }
        else if (flower6 == 2) {
            winnings = playerBet * 10;
        }
        else if (wild == 2) {
            winnings = playerBet * 20;
        }
        else {
            winnings = playerBet * 1;
        }

        if (wild == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        //showWinMessage();
    }
    else {
        lossNumber++;
        //showLossMessage();
    }

}


// Callback functions that change the alpha transparency of the button

// Our Main Game Function
function main() {
    //Slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);

    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index] = new createjs.Container();
        stage.addChild(reelContainers[index]);
    }
    reelContainers[0].x = 56;
    reelContainers[0].y = 177;
    reelContainers[1].x = 130;
    reelContainers[1].y = 177;
    reelContainers[2].x = 207;
    reelContainers[2].y = 177;

    //Add spin button sprite
    spinButton = new objects.Button("spinButton", 236, 332, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);

    //Add reset button sprite
    resetButton = new objects.Button("resetButton", 35, 332, false);
    stage.addChild(resetButton);
    resetButton.on("click", spinButtonClicked, this);

    //Add bet one button sprite
    betOneButton = new objects.Button("betOneButton", 100, 332, false);
    stage.addChild(betOneButton);
    betOneButton.on("click", spinButtonClicked, this);

    //Add bet ten button sprite
    betTenButton = new objects.Button("betTenButton", 170, 332, false);
    stage.addChild(betTenButton);
    betTenButton.on("click", spinButtonClicked, this);

    //Add power button sprite
    powerButton = new objects.Button("powerButton", 241, 48, false);
    stage.addChild(powerButton);
}