import Player from "../player.js";
import createRotatingPlatform from "../objects/create-rotating-platform.js";
import createJumpingPlatform from "../objects/create-jumping-platform.js";
import createRotatingGear1 from "../objects/create-rotatomg-gear.js";

export default
class Level2 extends Phaser.Scene {

    constructor() {
        super({ key: 'level2' });
    }

    preload() {

        this.load.path = 'assets/';
        //this.load.tilemapTiledJSON("map", "../assets/tilemaps/level.json");
        this.load.tilemapTiledJSON("map2", "tilemaps/level2.json");
        this.load.image(
            "kenney-tileset-64px-extruded",
            "../assets/tilesets/kenney-tileset-64px-extruded.png"
        );

        this.load.image("Gear", "images/Gear.png");
        this.load.image("spring", "images/bounce.png");
        this.load.image("wooden-plank", "images/wooden-plank.png");
        this.load.image("block", "images/block.png");

        this.load.image('background2_birds', 'images/game_background_2/layers/birds.png');
        this.load.image('background2_clouds_1', 'images/game_background_2/layers/clouds_1.png');
        this.load.image('background2_clouds_2', 'images/game_background_2/layers/clouds_2.png');
        this.load.image('background2_clouds_3', 'images/game_background_2/layers/clouds_3.png');
        this.load.image('background2_pines', 'images/game_background_2/layers/pines.png');
        this.load.image('background2_rocks_1', 'images/game_background_2/layers/rocks_1.png');
        this.load.image('background2_rocks_2', 'images/game_background_2/layers/rocks_2.png');
        this.load.image('background2_sky', 'images/game_background_2/layers/sky.png');

        this.load.image('rock', 'images/rock.png');

        this.load.spritesheet(
            "player",
            "spritesheets/0x72-industrial-player-32px-extruded.png", {
                frameWidth: 32,
                frameHeight: 32,
                margin: 1,
                spacing: 2
            }
        );

        this.load.atlas("emoji", "atlases/emoji.png", "atlases/emoji.json");
        //this.load.multiatlas('spider', "../assets/enemy/spider.png")
    }


    create() {
        const map = this.make.tilemap({ key: "map2" });

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
        let skyImage = this.add.image(topBackgroundXOrigin, topBackgroundYOrigin, 'background2_sky');
        skyImage.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        // Add each layer one by one
        this.cloud1 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_clouds_1');
        this.cloud1.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        this.cloud2 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_clouds_2');
        this.cloud2.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        this.rocks1 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_rocks_1');
        this.rocks1.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        this.cloud3 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_clouds_3');
        this.cloud3.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        this.rocks2 = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_rocks_2');
        this.rocks2.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        this.pines = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_pines');
        this.pines.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

        this.birds = this.add.tileSprite(topBackgroundXOrigin, topBackgroundYOrigin, imageBaseWidth, imageBaseHeight, 'background2_birds');
        this.birds.setDisplaySize(windowWidth, topBackgroundHeight).setScrollFactor(0);

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

        const fallingrock1 = this.matter.add.sprite(100, 0, "rock");
        const fallingrock2 = this.matter.add.sprite(200, 0, "rock");
        const fallingrock3 = this.matter.add.sprite(300, 0, "rock");

        this.matterCollision.addOnCollideStart({
            objectA: this.player,
            objectB: [fallingrock1, fallingrock2, fallingrock3],
            callback: eventData => {
                console.log("Player hit rock");
                // eventData.gameObjectB will be the specific enemy that was hit
            }
        });

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

        map.getObjectLayer("Jumping Locations").objects.forEach(point => {
            createJumpingPlatform(this, point.x, point.y)
        });

        map.getObjectLayer("Gear Locations 1").objects.forEach(point => {
            createRotatingGear1(this, point.x, point.y);
        });

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
}