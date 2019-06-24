var gameOptions = {
    colors: ["0xffffff"]
}

export default
    class LevelSelect extends Phaser.Scene {
    constructor() {
        super("LevelSelect");
    }
    preload() {
        this.load.spritesheet("levelthumb", "../assets/levelselect/levelthumb.png", {
            frameWidth: 60,
            frameHeight: 60
        });
        this.load.image("levelpages", "../assets/levelselect/levelpages.png");
        this.load.image("transp", "../assets/levelselect/transp.png");
        this.load.image("sprlvl1", 'assets/levelselect/sprlvl1.png');
        this.load.image("sprlvl2", 'assets/levelselect/sprlvl2.png');

        this.load.image("sprback", 'assets/levelselect/sprback.png');
    }
    create() {
        this.scrollingMap = this.add.tileSprite(0, 0, gameOptions.colors.length * 800, 480, "transp");
        this.scrollingMap.setInteractive();
        this.input.setDraggable(this.scrollingMap);
        this.scrollingMap.setOrigin(0, 0);

        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };

        this.btnlvl1 = this.add.sprite(
            this.game.config.width * 0.1,
            this.game.config.height * 0.1,
            "sprlvl1"
        )

        this.btnlvl1.setInteractive();

        this.btnlvl1.on("pointerup", function () {
            this.scene.start("mainscene");
        }, this);

        //Level 2 button
        this.btnlvl2 = this.add.sprite(
            this.game.config.width * 0.1 + 100,
            this.game.config.height * 0.1,
            "sprlvl2"
        )

        this.btnlvl2.setInteractive();

        this.btnlvl2.on("pointerup", function () {
            this.scene.start("level2");
        }, this);

        this.title = this.add.text(this.game.config.width * 0.5, 18, "Level Select", {
            fontFamily: 'monospace',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        //Back button
        this.btnback = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.1 + 300,
            "sprback"
        )

        this.btnback.setInteractive();

        this.btnback.on("pointerup", function () {
            this.scene.start("MainMenu");
        }, this);

    }

    update() {
    }
}

