
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


// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;
var spinButton: objects.Button;


//Tally Variables
var flower1 = 0;
var flower2 = 0;
var flower3 = 0;
var flower4 = 0;
var flower5 = 0;
var flower6 = 0;
var wild = 0;
var blank = 0;

var spinResult;
var flower = "";


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



// Callback functions that change the alpha transparency of the button

// Our Main Game Function
function main() {
    //Slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);

    //Add spin button sprite
    spinButton = new objects.Button("spinButton", 236, 332, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);


}