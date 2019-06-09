import Player from "./player.js";
import createRotatingPlatform from "./create-rotating-platform.js";

export default 
class Level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });
    }
  
    preload() {
      //this.load.tilemapTiledJSON("map", "../assets/tilemaps/level.json");
      this.load.tilemapTiledJSON("map2", "../assets/tilemaps/level2.json");
      this.load.image(
        "kenney-tileset-64px-extruded",
        "../assets/tilesets/kenney-tileset-64px-extruded.png"
      );
  
  
      this.load.image("wooden-plank", "../assets/images/wooden-plank.png");
      this.load.image("block", "../assets/images/block.png");
  
      this.load.image('background', 'assets/images/background.png');
  
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
  
      this.load.audio('game', ['assets/audio/Extreme_Game_watermarked.mp3']);
    }
  
  
    create() {
      const map = this.make.tilemap({ key: "map2" });
      const tileset = map.addTilesetImage("kenney-tileset-64px-extruded");
      map.createDynamicLayer("Background", tileset, 0, 0);
      const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
      const lavaLayer = map.createDynamicLayer("Lava", tileset, 0, 0);
      map.createDynamicLayer("Foreground", tileset, 0, 0).setDepth(10);
  
  
  
      this.background = this.add.tileSprite(0, 0, 1000, 1000, 'background', 'assets/images/background.png').setOrigin(0).setDepth(-100).setScrollFactor(0)
  
      var music = this.sound.add('game', { loop: true });
  
      music.play();
  
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
    }
  
    onPlayerCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
  
      const tile = gameObjectB;
  
      // Check the tile property set in Tiled (you could also just check the index if you aren't using
      // Tiled in your game)
      if (tile.properties.isLethal) {
        // Unsubscribe from collision events so that this logic is run only once
        this.unsubscribePlayerCollide();
  
        this.player.freeze();
        const cam = this.cameras.main;
        cam.fade(250, 0, 0, 0);
        cam.once("camerafadeoutcomplete", () => this.scene.restart());
      }
    }
  
    onPlayerWin() {
      // Celebrate only once
      this.unsubscribeCelebrate();
  
      // Drop some emojis, of course
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
  }