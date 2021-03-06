import Player from "../player.js";
import createRotatingPlatform from "../objects/create-rotating-platform.js";

var help = "";

export default
  class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: "mainscene" });
  }

  preload() {
    // loads the level data
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/level.json");
    this.load.image(
      "kenney-tileset-64px-extruded",
      "../assets/tilesets/kenney-tileset-64px-extruded.png"
    );

    // loads the images for the objects
    this.load.image("wooden-plank", "../assets/images/wooden-plank.png");
    this.load.image("block", "../assets/images/block.png");

    // Loads the background images for the panarama.
    this.load.image('background1_clouds_1', 'assets/images/game_background_1/layers/clouds_1.png');
    this.load.image('background1_clouds_2', 'assets/images/game_background_1/layers/clouds_2.png');
    this.load.image('background1_clouds_3', 'assets/images/game_background_1/layers/clouds_3.png');
    this.load.image('background1_clouds_4', 'assets/images/game_background_1/layers/clouds_4.png');
    this.load.image('background1_rocks_1', 'assets/images/game_background_1/layers/rocks_1.png');
    this.load.image('background1_rocks_2', 'assets/images/game_background_1/layers/rocks_2.png');
    this.load.image('background1_sky', 'assets/images/game_background_1/layers/sky.png');

    //loads the player sprite sheet=
    this.load.spritesheet(
      "player",
      "../assets/spritesheets/0x72-industrial-player-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2
      }
    );
    this.load.atlas("emoji", "../assets/atlases/emoji.png", "../assets/atlases/emoji.json");
    }


  create() {
    //creates a tilemap based on the key map from level.json
    const map = this.make.tilemap({ key: "map" });

    //this.background = this.add.tileSprite(0, 0, 1000, 1000, 'background', 'assets/images/background.png').setOrigin(0).setDepth(-100).setScrollFactor(0)

    // Get the window sizes
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Find the center of the top space
    let topBackgroundXOrigin = windowWidth / 2;
    let topBackgroundYOrigin = (windowHeight / 5) * 1.5;
    let topBackgroundHeight = (windowHeight / 5) * 3;

    // Base width and height of the images
    let imageBaseWidth = 1920;
    let imageBaseHeight = 1080;
    let heightRatio = topBackgroundHeight / imageBaseHeight;

    // Add the sky image at the right location and resize it to take all the space, no scaling needed
    let skyImage = this.add.image(topBackgroundXOrigin, topBackgroundYOrigin, 'background1_sky');
    skyImage.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    // Panarama background
    this.cloud1 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background1_clouds_1');
    this.cloud1.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    this.cloud2 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background1_clouds_2');
    this.cloud2.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    this.rocks1 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background1_rocks_1');
    this.rocks1.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    this.cloud3 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background1_clouds_3');
    this.cloud3.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    this.rocks2 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background1_rocks_2');
    this.rocks2.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    this.cloud4 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background1_clouds_4');
    this.cloud4.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

    const tileset = map.addTilesetImage("kenney-tileset-64px-extruded");
    map.createDynamicLayer("Background", tileset, 0, 0);
    const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
    const lavaLayer = map.createDynamicLayer("Lava", tileset, 0, 0);
    map.createDynamicLayer("Foreground", tileset, 0, 0).setDepth(10);


    // Set colliding tiles before converting the layer to Matter bodies
    groundLayer.setCollisionByProperty({ collides: true });
    lavaLayer.setCollisionByProperty({ collides: true });

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped our collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(groundLayer);
    this.matter.world.convertTilemapLayer(lavaLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // The spawn point is set using a point object inside of Tiled (within the "Spawn" object layer)
    const { x, y } = map.findObject("Spawn", obj => obj.name === "Spawn Point");
    this.player = new Player(this, x, y);

    // Smoothly follow the player
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this
    });

    // Load up some crates from the "Crates" object layer created in Tiled
    map.getObjectLayer("Crates").objects.forEach(crateObject => {
      const { x, y, width, height } = crateObject;
      // Tiled origin for coordinate system is (0, 1), but we want (0.5, 0.5)
      this.matter.add
        .image(x + width / 2, y - height / 2, "block")
        .setBody({ shape: "rectangle", density: 0.001 });
    });

    // Create platforms at the point locations in the "Platform Locations" layer created in Tiled
    map.getObjectLayer("Platform Locations").objects.forEach(point => {
      createRotatingPlatform(this, point.x, point.y);
    });
    const rectwalkcontsign = map.findObject("Sign", obj => obj.name === "walking_controls");
    const walkcontsignSensor = this.matter.add.rectangle(
      rectwalkcontsign.x + rectwalkcontsign.width / 2,
      rectwalkcontsign.y + rectwalkcontsign.height / 2,
      rectwalkcontsign.width,
      rectwalkcontsign.height,
      {
        isSensor: true, // It shouldn't physically interact with other bodies
        isStatic: true // It shouldn't move
      }
    );

    const rectsignbewarerotplatform = map.findObject("Sign", obj => obj.name === "moving_platforms");
    const signbewarerotplatformSensor = this.matter.add.rectangle(
      rectsignbewarerotplatform.x + rectsignbewarerotplatform.width / 2,
      rectsignbewarerotplatform.y + rectsignbewarerotplatform.height / 2,
      rectsignbewarerotplatform.width,
      rectsignbewarerotplatform.height,
      {
        isSensor: true, // It shouldn't physically interact with other bodies
        isStatic: true // It shouldn't move
      }
    );

    const rectwin = map.findObject("Sensors", obj => obj.name === "Level1Win");
    const Level1WinSensor = this.matter.add.rectangle(
      rectwin.x + rectwin.width / 2,
      rectwin.y + rectwin.height / 2,
      rectwin.width,
      rectwin.height,
      {
        isSensor: true, // It shouldn't physically interact with other bodies
        isStatic: true // It shouldn't move
      }
    );

    // Create a sensor at rectangle object created in Tiled (under the "Sensors" layer)
    const rect = map.findObject("Sensors", obj => obj.name === "Celebration");
    const celebrateSensor = this.matter.add.rectangle(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
      rect.width,
      rect.height,
      {
        isSensor: true, // It shouldn't physically interact with other bodies
        isStatic: true // It shouldn't move
      }
    );
    this.unsubscribeCelebrate = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: celebrateSensor,
      callback: this.onPlayerWin,
      context: this
    });

    this.unsubscribeLevel1Win = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: Level1WinSensor,
      callback: this.onLevel1Win,
      context: this
    });

    this.unsubscribewalkcontsign = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: walkcontsignSensor,
      callback: this.onwalkcontsign,
      context: this
    });

    this.unsubscribesignbewarerotplatform = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: signbewarerotplatformSensor,
      callback: this.onsignbewarerotplatform,
      context: this
    })

    // Level 1 first help message
    help = this.add.text(16, 16, "Arrows/WASD to move the player.", {
      fontSize: "18px",
      padding: { x: 10, y: 5 },
      backgroundColor: "#ffffff",
      fill: "#000000"
    });
    help.setScrollFactor(0).setDepth(1000);
  }

  onPlayerCollide({ gameObjectB }) {
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    const tile = gameObjectB;

    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    if (tile.properties.isLethal) {
      // Unsubscribe from collision events so that this logic is run only once
      this.player.freeze();
      this.player.death();
      this.time.addEvent({
        delay: 600,
        callback: () => {
          this.unsubscribePlayerCollide();
          const cam = this.cameras.main;
          cam.fade(250, 0, 0, 0);
          cam.once("camerafadeoutcomplete", () => this.scene.restart());
          this.time.addEvent({
            delay: 300,
            callback: () => {
              this.player.onDeath = false;
            },
            loop: true
          })
        },
        loop: true
      })
    }
  }

  onPlayerWin() {
    // Celebrate only once
    this.unsubscribeCelebrate();
    // Drop some apples
    for (let i = 0; i < 35; i++) {
      const x = this.player.sprite.x + Phaser.Math.RND.integerInRange(-50, 50);
      const y = this.player.sprite.y - 150 + Phaser.Math.RND.integerInRange(-10, 10);
      this.matter.add
        .image(x, y, "emoji", "1f621", {
          restitution: 1,
          friction: 0,
          density: 0.0001,
          shape: "circle"
        })
        .setScale(0.5);
    }
  }

  onLevel1Win() {
    this.unsubscribeLevel1Win();//unload level 1
    this.scene.start('level2');//load level 2
  }

  onwalkcontsign() { //Walking controls sign
    this.unsubscribewalkcontsign();
    help.destroy(); //Destroy the sign
    help = this.add.text(16, 16, "Use the up or W keys to jump.", { //Recreate the sign with the new width
      fontSize: "18px", //Sets the signs fontsize to 18 px
      padding: { x: 10, y: 5 }, //Adds padding to the sign
      backgroundColor: "#ffffff", //Sets the signs background colour
      fill: "#000000"
    });
    help.setScrollFactor(0).setDepth(1000); //Make it follow the user infront of the other layers.
  }

  onsignbewarerotplatform() { //Rotating platform signs
    this.unsubscribesignbewarerotplatform();
    help.destroy(); // Destorys the help text to be replaced
    help = this.add.text(16, 16, "Beware the rotating platforms!", { // Level 1 help message
      fontSize: "18px",
      padding: { x: 10, y: 5 },
      backgroundColor: "#ffffff",
      fill: "#000000"
    });
    help.setScrollFactor(0).setDepth(1000);
  }

  update() {
    //Changes the panarama backgrounds layer positions
    this.cloud1.tilePositionX += 0.05;
    this.cloud2.tilePositionX += 0.05;
    this.rocks1.tilePositionX += 0.10;
    this.cloud3.tilePositionX += 0.15;
    this.rocks2.tilePositionX += 0.20;
    this.cloud4.tilePositionX += 0.30;
  }
}

