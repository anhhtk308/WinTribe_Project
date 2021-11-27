class man1 extends Phaser.Scene {
    constructor() {
        super("man1");
    }

    preload() {
        this.load.image("ship", "assets/Ship.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/SeaMapDemo23114.json");

        // set
        this.load.audio("button_sound", "assets/audio-button.mp3");
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

        // set
        this.button_sound = this.sound.add("button_sound", { loop: false });
        //
        this.btn_test = this.add.text(210, 400, 'Check', { font: '32px Courier', fill: '#000' }).setVisible(true);
        this.btn_test.setInteractive();
        this.btn_test.on('pointerdown', function() {
            //this.cameras.main.fade(250);
            this.cameras.main.flash();
            //this.time.delayedCall(250, function() {
            this.button_sound.play();
            this.scene.start('man2');
            // }, [], this);
        }, this);
    }

    update() {
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.ship) {
            if (this.cursors.left.isDown) {
                this.ship.setAngularVelocity(-150);
            } else if (this.cursors.right.isDown) {
                this.ship.setAngularVelocity(150);
            } else {
                this.ship.setAngularVelocity(0);
            }

            if (this.cursors.up.isDown) {
                this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
            } else {
                this.ship.setAcceleration(0);
            }

            this.physics.world.wrap(this.ship, 5);
        }
    }
}