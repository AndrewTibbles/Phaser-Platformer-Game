export default
class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" }); // Sets the scenes key
    }

    preload() {
        //Loads all the iamges using on the MainMenu
        this.load.image('background', 'https://sill-bill.github.io/resource-box/instant-0000/bg.png');
        this.load.image("sprBg0", "assets/MainMenu/sprBg0.png");
        this.load.image("sprBg1", "assets/MainMenu/sprBg1.png");
        this.load.image("sprBtnPlay", 'assets/MainMenu/btn-start.png');
        this.load.image("sprBtnPlayHover", "assets/MainMenu/sprBtnPlayHover.png");
        this.load.image("sprBtnPlayDown", "assets/MainMenu/sprBtnPlayDown.png");
        this.load.image("sprBtnRestart", "assets/MainMenu/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "assets/MainMenu/sprBtnRestartHover.png");
        this.load.image("sprBtnlevelselect", "assets/MainMenu/select-level.png");
        this.load.image("sprBtnRestartDown", "assets/MainMenu/sprBtnRestartDown.png");

        // Loads button audio files
        this.load.audio("sndBtnOver", "assets/MainMenu/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "assets/MainMenu/sndBtnDown.wav");
    }

    create() {
        // Adds the background image
        let image = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / image.width // Gets the scene size and devices that by the images width
        let scaleY = this.cameras.main.height / image.height // Gets the scene size and devices that by the images height
        let scale = Math.max(scaleX, scaleY) // Sets the scale based on the x and y values.
        image.setScale(scale).setScrollFactor(0) // sets the scale.

        // Defines button events sound effect.
        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };

        //Creates play button
        this.btnPlay = this.add.sprite(  
            this.game.config.width * 0.5, // Defines the buttons width
            this.game.config.height * 0.5, // And the height
            "sprBtnPlay" // Defines the texture name used in the preload function
        )

        this.btnPlay.setInteractive(); // Sets the button to be interactable.

        this.btnPlay.on("pointerover", function() {
            this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
            this.sfx.btnOver.play(); // play the button over sound
        }, this);

        this.btnPlay.on("pointerout", function() {
            this.setTexture("sprBtnPlay"); // set the button texture
        });

        this.btnPlay.on("pointerdown", function() {
            this.btnPlay.setTexture("sprBtnPlayDown"); // set the button texture
            this.sfx.btnDown.play(); // play the button over sound
        }, this);

        this.btnPlay.on("pointerup", function() {
            this.btnPlay.setTexture("sprBtnPlay"); // set the button texture
            this.scene.start("mainscene"); // changes scene to mainscene
            console.log("start button clicked"); // logs to the console
        }, this);



        //Creates the level select button
        this.btnlevelselect = this.add.sprite(
            this.game.config.width * 0.5, // Defines the buttons width
            this.game.config.height * 0.5 + 100, // And the height
            "sprBtnlevelselect" // Defines the texture name used in the preload function
        )

        this.btnlevelselect.setInteractive(); // Sets the button to be interactable.

        this.btnlevelselect.on("pointerover", function() {
            this.sfx.btnOver.play(); // play the button over sound
        }, this);

        this.btnlevelselect.on("pointerdown", function() {
            this.sfx.btnDown.play();  // play the button click sound
        }, this);

        this.btnlevelselect.on("pointerup", function() {
            this.btnlevelselect.setTexture("sprBtnlevelselect"); // sets the texture
            console.log("level select button clicked"); // log to the console
            this.scene.start("LevelSelect"); // loads the level select scene
        }, this);

        this.title = this.add.text(this.game.config.width * 0.5, 128, "Phaser Platformer", { // adds a title to the page
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5); // sets the origin of the text
    }

    update() {}
}