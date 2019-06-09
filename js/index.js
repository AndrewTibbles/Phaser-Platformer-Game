import MainMenu from "./MainMenu.js";
import MainScene from "./main-scene.js";
import Level2 from "./level2-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: "game-container",
  scene: [Level2],
  pixelArt: true,
  physics: { default: "matter" },
  plugins: {
    scene: [
      {

        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision"// Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
  }
};

const game = new Phaser.Game(config);

