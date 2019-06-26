var gameOptions = {
    colors: ["0xffffff"] // Sets the main background colour(S) used later
}

export default
    class LevelSelect extends Phaser.Scene {
    constructor() {
        super("LevelSelect"); //The key name for the scene to be called when the page is to be requested.
    }
    preload() {
        this.load.image("transp", "../assets/levelselect/transp.png"); // Sets a background image which is partually transparent to display a checkered patern in any colour dependent on the background colour.
        this.load.image("sprlvl1", 'assets/levelselect/sprlvl1.png'); // Loads the sprite image for the level 1 button
        this.load.image("sprlvl2", 'assets/levelselect/sprlvl2.png'); // Loads the sprite image for the level 2 button

        this.load.image("sprback", 'assets/levelselect/sprback.png'); // Loads the sprite image for the back button
    }
    create() {
        this.Background = this.add.tileSprite(0, 0, gameOptions.colors.length * 800, 480, "transp"); // Creates the background image as a tile sprite using the gameOptions colour on line 1.
        this.Background.setOrigin(0, 0); // Sets the images position to the corner.

        //Creates the level 1 button
        this.btnlvl1 = this.add.sprite(
            this.game.config.width * 0.1, // Defines the buttons width
            this.game.config.height * 0.1, // And the height
            "sprlvl1" // Defines the texture name used in the preload function
        )

        this.btnlvl1.setInteractive(); // Sets the button to be interactable.

        this.btnlvl1.on("pointerup", function () { // Mouse pointer up event handler for level 1 button. It loads level 1 after the button has been pressed.
            console.log("level 1 selected"); // Outputs text to the browsers console for testing.
            this.scene.start("mainscene"); // Loads the scene mainscene.
        }, this);

        //Creates the level 2 button
        this.btnlvl2 = this.add.sprite(
            this.game.config.width * 0.1 + 100, // Defines the buttons width
            this.game.config.height * 0.1, // And the height
            "sprlvl2" // Defines the texture name used in the preload function
        )

        this.btnlvl2.setInteractive(); // Sets the button to be interactable.

        this.btnlvl2.on("pointerup", function () { // Mouse pointer up event handler for level 2 button. It loads level 2 after the button has been pressed.
            console.log("level 2 selected"); // Outputs text to the browsers console for testing.
            this.scene.start("level2"); // Loads the scene level2.
        }, this);

        // Adds some text to the scene to be used as a title.
        this.title = this.add.text(this.game.config.width * 0.5, 18, "Level Select", {
            fontFamily: 'monospace', // Sets the titles font family
            fontSize: 24, // Sets the titles font size
            fontStyle: 'bold', // Sets the titles font style
            color: '#ffffff', // Sets the titles font colour
            align: 'center' // Sets the title to be center of the window.
        });
        this.title.setOrigin(0.5); // Sets the titles origin point on the sheet.

          //Creates the return button
        this.btnback = this.add.sprite(
            this.game.config.width * 0.5, // Defines the buttons width
            this.game.config.height * 0.1 + 300, // And the height
            "sprback" // Defines the texture name used in the preload function
        )

        this.btnback.setInteractive(); // Sets the button to be interactable.

        this.btnback.on("pointerup", function () { // Mouse pointer up event handler for the return button. It loads the MainMenu after the button has been pressed.
            console.log("Back to menu selected"); // Outputs text to the browsers console for testing.
            this.scene.start("MainMenu"); // Loads the scene MainMenu.
        }, this);

    }

    update() {
    }
}

