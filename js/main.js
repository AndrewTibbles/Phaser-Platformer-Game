// =============================================================================
// sprites
// =============================================================================

//
// player sprite
//
function Player(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.anchor.set(0.5, 0.5);
}

// inherit from Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// =============================================================================
// game states
// =============================================================================

PlayState = {};

PlayState.preload = function () {
    this.game.load.json('level:1', 'data/level01.json');

    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('player', 'images/player_stopped.png');
};

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON('level:1'));
};

PlayState._loadLevel = function (data) {
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn player and enemies
    this._spawnCharacters({player: data.player, spiders: data.spiders});
};

PlayState._spawnPlatform = function (platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
};

PlayState._spawnCharacters = function (data) {
    // spawn player
    this.player = new Player(this.game, data.player.x, data.player.y);
    this.game.add.existing(this.player);
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};
