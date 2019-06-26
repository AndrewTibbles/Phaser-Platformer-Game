var bgMusic;

export default
class Loading extends Phaser.Scene {

    constructor() {
        super({ key: 'loading' }); //The key name for the scene to be called when the page is to be requested.
    }

    preload() {
        var progressBar = this.add.graphics(); // Creates a physical box
        var progressBox = this.add.graphics(); // Creates a physical
        progressBox.fillStyle(0x222222, 0.8); // Sets the style of the box
        progressBox.fillRect(240, 270, 320, 50); // Fills the area in

        var width = this.cameras.main.width; // Gets the scene width
        var height = this.cameras.main.height; // Gets the scene height
        var loadingText = this.make.text({ // Adds some text to the scene
            x: width / 2, 
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5); // Sets the origin of the text

        var percentText = this.make.text({ // displays a persentage text which increments
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('fileprogress', function(file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function() {
            progressBar.destroy(); // Destorys the boxes and text
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });


        for (var i = 0; i < 100; i++) { // Counts up too 100
            this.load.image('' + i, './assets/logo.png');

        }

        this.load.audio('game', ['assets/audio/Extreme_Game_watermarked.mp3']); // loads the game sound
    }

    create() {
        console.log("setup complete"); // Logs to the console on scene script complete.
        this.scene.start('MainMenu'); // loads 
        bgMusic = this.sound.add('game'); // adds the sound using the audio name
        bgMusic.play({ loop: true }); // plays the game sound looping once the assets are loaded
        bgMusic.volume = 1; // sets the sound volume to 1
    }
}