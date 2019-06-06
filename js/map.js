export default maps(name)
    var run = run || {};
    run.Game = function () { };
    run.Game.prototype = {
        create: function () {
            newMapName = '';
            x = 0;
            this.load_map('testmap');
        },
        update: function () {
            x += 1;
            if (x > 60 && x <= 61) {
                //destroy the first tilemap and add a new one			
                map.destroy();
                foreground.destroy();
                this.load_map('level');
                console.log(newMapName);
            } if (x > 120
                && x <= 121) {
                //destroy the second tilemap		
                map.destroy(); foreground.destroy();
                this.load_map('level2');
                console.log(newMapName);
            }
        },
        new_map: function (name) {
            //add the tilemap	
            map = this.game.add.tilemap(name);
            const tileset = map.addTilesetImage("kenney-tileset-64px-extruded");
            map.createDynamicLayer("Background", tileset, 0, 0);
            const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
            const lavaLayer = map.createDynamicLayer("Lava", tileset, 0, 0);
            map.createDynamicLayer("Foreground", tileset, 0, 0).setDepth(10);
        }, load_map: function (name) {
            this.load.tilemap(name, 'assets/tilemaps/' + name + '.json', null, Phaser.Tilemap.TILED_JSON);
            newMapName = name;
            //begin the loading process	
            this.load.start()
            //on complete, call the "load_map_success" function	
            this.load.onLoadComplete.add(this.load_map_success, this);
        },
        load_map_success: function () {
            //call the "new_map" function	
            this.new_map(newMapName);
        },
    };
}