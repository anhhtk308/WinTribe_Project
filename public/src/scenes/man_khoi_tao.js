// import man1 from './man1';
class man_khoi_tao extends Phaser.Scene {
    constructor() {
        super("man_khoi_tao");
    }
    preload() {
        this.load.html('nameForm', 'assets/nameForm/nameForm.html');
        this.load.css('answerCss', 'assets/nameForm/nameForm.css');
        this.load.image("ship", "assets/Ship.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/SeaMapDemo23114.json");
        this.load.image("back_ground","assets/back_gound_gamemain.jpg")
        this.load.image("start","assets/start.png");
    }
    create() {


        const map = this.add.tilemap("SeaMapDemo23114");
        const natural_tile = map.addTilesetImage("tiles");
        const SeaLayer = map.createLayer("sea_bg", [natural_tile]);
        const IslandLayer = map.createLayer("island", [natural_tile]);

        this.ship = this.physics.add.sprite(500, 500, 'ship').setScale(0.2);
        this.ship.setCollideWorldBounds(true);
        this.ship.setDrag(100);
        this.ship.setAngularDrag(100);
        this.ship.setMaxVelocity(200);
        // set va chạm với biến platform

        this.physics.add.collider(this.ship, IslandLayer);
        this.add.image(400,300,"back_ground").setScale(0.42,0.5);
        this.text = this.add.image(600,300,"start").setScale(0.8);
        this.text.setInteractive();
        this.elementName = this.add.dom(400, 300).createFromCache('nameForm');
        this.text.on("pointerdown", () => {
            if ((this.elementName.getChildByName('nameField').value).trim().length > 0) {
                this.cameras.main.fade(250);
                this.time.delayedCall(250, function() {
                    // this.button_sound.play();
                    this.scene.start('game_main', { name: this.elementName.getChildByName('nameField').value });
                }, [], this);
            }
        });
    }

    update() {

    }

}