//Import scene views
import Loading from "./scenes/loading.js";
import MainMenu from "./scenes/MainMenu.js";
import MainScene from "./scenes/main-scene.js";
import Level2 from "./scenes/level2-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: "game-container",
  scene: [Loading, MainMenu, MainScene, Level2], // List of scenes to call later
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

