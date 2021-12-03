class startScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    preload() {
        this.load.html('nameForm', 'assets/nameForm/nameForm.html');
        this.load.css('answerCss', 'assets/nameForm/nameForm.css');
        this.load.image("ship", "assets/Ship.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/SeaMapDemo23114.json");
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

        this.text = this.add.text(600, 300, 'Oki', { color: '#000', fontSize: '20px ' });
        this.text.setInteractive();
        this.elementName = this.add.dom(400, 300).createFromCache('nameForm');
        this.text.on("pointerdown", () => {
            if ((this.elementName.getChildByName('nameField').value).trim().length > 0) {
                this.cameras.main.fade(250);
                this.time.delayedCall(250, function() {
                    // this.button_sound.play();
                    this.scene.start('mainHall', { name: this.elementName.getChildByName('nameField').value });
                }, [], this);
            }
        });
    }

    update() {

    }


}