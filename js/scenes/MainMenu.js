export default
    class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }

    preload() {
        this.load.image('background', 'https://sill-bill.github.io/resource-box/instant-0000/bg.png');
        this.load.image("sprBg0", "assets/MainMenu/sprBg0.png");
        this.load.image("sprBg1", "assets/MainMenu/sprBg1.png");
        this.load.image("sprBtnPlay", 'assets/MainMenu/btn-start.png');
        this.load.image("sprBtnPlayHover", "assets/MainMenu/sprBtnPlayHover.png");
        this.load.image("sprBtnPlayDown", "assets/MainMenu/sprBtnPlayDown.png");
        this.load.image("sprBtnRestart", "assets/MainMenu/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "assets/MainMenu/sprBtnRestartHover.png");
        this.load.image("sprBtnRestartDown", "assets/MainMenu/sprBtnRestartDown.png");
        this.load.audio("sndBtnOver", "assets/MainMenu/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "assets/MainMenu/sndBtnDown.wav");
    }

    create() {
        let image = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY)
        image.setScale(scale).setScrollFactor(0)

        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };

        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        )

        this.btnPlay.setInteractive();

        this.btnPlay.on("pointerover", function () {
            this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
            this.sfx.btnOver.play(); // play the button over sound
        }, this);

        this.btnPlay.on("pointerout", function () {
            this.setTexture("sprBtnPlay");
        });

        this.btnPlay.on("pointerdown", function () {
            this.btnPlay.setTexture("sprBtnPlayDown");
            this.sfx.btnDown.play();
        }, this);

        this.btnPlay.on("pointerup", function () {
            this.btnPlay.setTexture("sprBtnPlay");
            this.scene.start("mainscene");
        }, this);




        this.btnlevelselect = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5 + 100,
            "sprlevelselect"
        )

        this.btnlevelselect.setInteractive();

        this.btnlevelselect.on("pointerover", function () {
            this.btnlevelselect.setTexture("sprlevelselectHover"); // set the button texture to sprlevelselectHover
            this.sfx.btnOver.play(); // play the button over sound
        }, this);

        this.btnlevelselect.on("pointerout", function () {
            this.setTexture("sprlevelselect");
        });

        this.btnlevelselect.on("pointerdown", function () {
            this.btnlevelselect.setTexture("sprlevelselectDown");
            this.sfx.btnDown.play();
        }, this);

        this.btnlevelselect.on("pointerup", function () {
            this.btnlevelselect.setTexture("sprBtnlevelselect");
            this.scene.start("LevelSelect");
        }, this);

        this.title = this.add.text(this.game.config.width * 0.5, 128, "Phaser Platformer", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);
    }

    update() {
    }
}