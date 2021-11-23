// export default man1;

class man1 extends Phaser.Scene {
    constructor() {
        super("man1");
    }

    preload() {
        // this.load.image("tiles", "assets/nature_tile.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/SeaMapDemo23114.json");


    }
    create() {

        const map = this.add.tilemap("SeaMapDemo23114");
        const natural_tile = map.addTilesetImage("tiles");
        // const autumn_tile = map.addTilesetImage("nature-tileset-autumn");
        const ObjectLayer = map.createLayer("sea_bg", [natural_tile]);
        const worldLayer = map.createLayer("island", [natural_tile]);
        // const img = this.add.image(0,0,'tiles');

        // const map = this.make.tilemap({ key: 'map'});
        // const tileset = map.addTilesetImage('nature-tile', 'tiles');

        // const belowLayer = map.createStaticLayer('sea_background', tileset, 0, 0);
        // const islandLayer = map.createStaticLayer('Island', tileset, 0,0);
    }

    update() {}
}