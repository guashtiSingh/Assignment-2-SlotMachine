
/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />



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
function pinkButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
}

// Callback functions that change the alpha transparency of the button

// Our Main Game Function
function main() {
    //Slot machine graphic
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);
}